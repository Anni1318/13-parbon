const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.indianfestivaldiary.com';
const LIST_URL = `${BASE_URL}/durgapuja/durga_puja_list.php`;
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'scraped-pandals.json');

const ZONE_COORDINATES = {
  'North Kolkata': { lat: 22.5950, lng: 88.3700 },
  'South Kolkata': { lat: 22.5200, lng: 88.3550 },
  'Central Kolkata': { lat: 22.5675, lng: 88.3600 },
  'Behala': { lat: 22.4980, lng: 88.3180 },
  'Salt Lake': { lat: 22.5800, lng: 88.4150 },
  'East Kolkata': { lat: 22.5400, lng: 88.4000 },
  'South 24 Parganas': { lat: 22.4500, lng: 88.3600 },
  'North 24 Parganas': { lat: 22.6500, lng: 88.4200 },
  'Howrah': { lat: 22.5958, lng: 88.3100 },
  'Hooghly': { lat: 22.9000, lng: 88.3900 },
  'Other Zone': { lat: 22.5726, lng: 88.3639 },
};

function getCoordinates(zone, name) {
  let matchedZone = 'Other Zone';
  for (const z of Object.keys(ZONE_COORDINATES)) {
    if (zone.toLowerCase().includes(z.toLowerCase())) {
      matchedZone = z;
      break;
    }
  }
  const base = ZONE_COORDINATES[matchedZone] || { lat: 22.5726, lng: 88.3639 };
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  const jitterLat = ((Math.abs(hash) % 1000) / 1000 - 0.5) * 0.025;
  const jitterLng = ((Math.abs(hash * 31) % 1000) / 1000 - 0.5) * 0.025;
  return {
    latitude: +(base.lat + jitterLat).toFixed(6),
    longitude: +(base.lng + jitterLng).toFixed(6)
  };
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, retries = 3, delayMs = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.text();
    } catch (err) {
      if (attempt === retries) {
        console.error(`❌ Failed to fetch ${url} after ${retries} attempts: ${err.message}`);
        return null;
      }
      await delay(delayMs * attempt);
    }
  }
  return null;
}

async function scrapePandalDetails(pandalMeta) {
  const html = await fetchWithRetry(pandalMeta.url);
  if (!html) return null;

  const $ = cheerio.load(html);

  // Table fields from main pandal page
  const mainTable = {};
  $('table.tabl tr').each((_, tr) => {
    const k = $(tr).find('td.TD1').text().trim();
    const v = $(tr).find('td.TD2').text().trim();
    if (k) mainTable[k] = v;
  });

  const headerTitle = $('.club_header_puja h2').text().replace(/\s*\b(202\d|201\d)\b/g, '').trim();
  const headerAddress = $('.club_header_puja h6').first().text().trim();
  const headerZone = $('.club_header_puja h6 a').text().trim();

  const name = mainTable['Name of the Puja'] || headerTitle || pandalMeta.name;
  const clubName = mainTable['Name of the Club'] || '';
  const zone = mainTable['Zone'] || headerZone || pandalMeta.zone || 'Kolkata';
  const address = mainTable['Address'] || headerAddress || zone;
  const landmark = mainTable['Landmark'] || '';
  const city = mainTable['City'] || 'Kolkata';
  const district = mainTable['District'] || 'Kolkata';
  const state = mainTable['State'] || 'West Bengal';
  const pincode = (mainTable['Pincode / Zipcode'] && mainTable['Pincode / Zipcode'] !== '--') ? mainTable['Pincode / Zipcode'] : null;
  const pujaType = mainTable['Puja Type'] || 'Barowari';
  const estdYear = mainTable['Puja Estd. Year'] || '';
  const website = mainTable['Official Website'] || '';
  const facebook = mainTable['Official Facebook Page'] || '';

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const coords = getCoordinates(zone, name);

  // Parse year archive links
  const yearArchiveLinks = [];
  $('#PujaYearArchive a[href*="/20"]').each((_, a) => {
    const yearText = $(a).text().trim().match(/\b(20\d\d)\b/);
    let href = $(a).attr('href');
    if (href && !href.startsWith('http')) {
      href = `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
    }
    if (yearText && href) {
      const year = parseInt(yearText[1], 10);
      if (!yearArchiveLinks.find(y => y.year === year)) {
        yearArchiveLinks.push({ year, url: href });
      }
    }
  });

  const editions = [];

  // Scrape each year edition
  for (const y of yearArchiveLinks) {
    await delay(150);
    const yHtml = await fetchWithRetry(y.url);
    if (!yHtml) continue;

    const $y = cheerio.load(yHtml);
    const yTable = {};
    $y('table.tabl tr').each((_, tr) => {
      const k = $y(tr).find('td.TD1').text().trim();
      const v = $y(tr).find('td.TD2').text().trim();
      if (k) yTable[k] = v;
    });

    const theme = yTable['Theme Name'] || $y('#ThemeDetail h3').text().trim() || null;
    let themeDesc = $y('#ThemeDetail .modal-body p').text().trim() || yTable['Theme Details'] || null;
    if (themeDesc && themeDesc.toLowerCase().includes('click here')) themeDesc = null;

    const idolArtist = yTable['Durga Idol Maker (Shilpi)'] || null;
    const pandalArtist = yTable['Theme Maker'] || yTable['Decorator'] || null;
    const lighting = yTable['Lighting'] || null;
    const budget = yTable['Budget'] || null;
    const crowd = yTable['Crowd Puller (Minimum)'] || null;

    editions.push({
      year: y.year,
      theme: theme || null,
      themeDescription: themeDesc || null,
      idolArtist: idolArtist || null,
      pandalArtist: pandalArtist || null,
      lighting: lighting || null,
      budget: budget || null,
      crowd: crowd || null,
      awards: []
    });
  }

  // Ensure current year (2026) edition exists
  if (!editions.find(e => e.year === 2026)) {
    editions.unshift({
      year: 2026,
      theme: 'Traditional Celebrations',
      themeDescription: `${name} celebrates Durga Puja with grandeur and heritage art.`,
      idolArtist: editions.length > 0 ? editions[0].idolArtist : null,
      pandalArtist: editions.length > 0 ? editions[0].pandalArtist : null,
      lighting: null,
      budget: null,
      crowd: null,
      awards: []
    });
  }

  return {
    name,
    slug,
    clubName,
    zone,
    area: landmark || zone,
    address,
    landmark,
    city,
    district,
    state,
    pincode,
    pujaType,
    estdYear,
    website,
    facebook,
    latitude: coords.latitude,
    longitude: coords.longitude,
    verificationStatus: 'VERIFIED',
    isFeatured: false,
    sourceName: 'Indian Festival Diary',
    sourceUrl: pandalMeta.url,
    editions
  };
}

async function main() {
  console.log('🚀 Starting Durga Puja Pandal Scraper...');
  console.log(`Fetching list from: ${LIST_URL}`);

  const listHtml = await fetchWithRetry(LIST_URL);
  if (!listHtml) {
    console.error('Failed to load main pandal list page.');
    process.exit(1);
  }

  const $ = cheerio.load(listHtml);
  const pandalsToScrape = [];
  const seenUrls = new Set();

  $('.puja_list').each((_, el) => {
    const a = $(el).find('a').first();
    let href = a.attr('href');
    if (!href) return;
    if (!href.startsWith('http')) {
      href = `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
    }
    if (seenUrls.has(href)) return;
    seenUrls.add(href);

    let rawName = a.attr('title') || $(el).find('strong, b, h6').text().trim() || a.text().trim();
    rawName = rawName.replace(/\s*\b(202\d|201\d)\b/g, '').replace(/Zone:.*$/i, '').trim();

    const zoneText = $(el).text();
    const zoneMatch = zoneText.match(/Zone:\s*([^<\n\r]+)/i);
    const zone = zoneMatch ? zoneMatch[1].trim() : 'Kolkata';

    pandalsToScrape.push({ name: rawName, zone, url: href });
  });

  console.log(`📋 Found ${pandalsToScrape.length} total pandals.`);

  // Load existing data if file exists to enable incremental resumes
  let results = [];
  const existingMap = new Map();
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      results = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      for (const p of results) {
        if (p.sourceUrl) existingMap.set(p.sourceUrl, p);
        if (p.name) existingMap.set(p.name, p);
      }
      console.log(`📦 Loaded ${results.length} already scraped pandals from ${OUTPUT_FILE}`);
    } catch (e) {
      console.log('Starting fresh output file.');
    }
  }

  const CONCURRENCY = 4;
  let activeIndex = 0;
  let completed = results.length;

  const queue = pandalsToScrape.filter(p => !existingMap.has(p.url) && !existingMap.has(p.name));
  console.log(`⏳ Pandals remaining to scrape: ${queue.length}`);

  async function worker(workerId) {
    while (activeIndex < queue.length) {
      const idx = activeIndex++;
      const item = queue[idx];
      console.log(`[Worker ${workerId}] Scraping (${completed + 1}/${pandalsToScrape.length}): ${item.name}...`);

      try {
        const details = await scrapePandalDetails(item);
        if (details) {
          results.push(details);
          completed++;
          console.log(`  ✅ Done: ${details.name} (${details.editions.length} editions)`);

          // Periodic save every 10 pandals
          if (completed % 10 === 0 || activeIndex >= queue.length) {
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
            console.log(`💾 Saved ${results.length} pandals to ${OUTPUT_FILE}`);
          }
        }
      } catch (err) {
        console.error(`  ❌ Error scraping ${item.name}: ${err.message}`);
      }

      await delay(200);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  // Final write
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`🎉 Finished! Successfully scraped ${results.length} pandals to ${OUTPUT_FILE}`);
}

main().catch(console.error);
