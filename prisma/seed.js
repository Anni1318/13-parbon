require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🪔 Starting PUJA GUIDE seed...');

  // --- FESTIVALS ---
  const durgaPuja = await prisma.festival.upsert({
    where: { slug: 'durga-puja-2026' },
    update: {},
    create: {
      id: 'festival-durga-2026',
      name: 'Durga Puja 2026',
      slug: 'durga-puja-2026',
      year: 2026,
      description: 'The grandest celebration of West Bengal — five days of art, devotion, and community.',
      startDate: new Date('2026-10-15T00:00:00.000Z'),
      endDate: new Date('2026-10-19T23:59:59.000Z'),
      bannerUrl: null,
      primaryColor: '#F59E0B',
    },
  });

  const kaliPuja = await prisma.festival.upsert({
    where: { slug: 'kali-puja-2026' },
    update: {},
    create: {
      id: 'festival-kali-2026',
      name: 'Kali Puja 2026',
      slug: 'kali-puja-2026',
      year: 2026,
      description: 'The night of the goddess — Kali Puja celebrated with devotion and fireworks across Bengal.',
      startDate: new Date('2026-11-12T00:00:00.000Z'),
      endDate: new Date('2026-11-13T23:59:59.000Z'),
      bannerUrl: null,
      primaryColor: '#EF4444',
    },
  });

  console.log('✅ Festivals seeded');

  // --- DURGA PUJA CALENDAR DAYS ---
  const durgaCalendar = [
    { id: 'dc-1', dayName: 'Mahalaya', tithiDetails: 'Amavasya Tithi — Tarpan to ancestors at dawn', calendarDate: new Date('2026-10-08T04:00:00.000Z'), auspiciousTimings: '4:30 AM – 6:00 AM (Brahma Muhurta)', isCountdownTarget: false, orderIndex: 1 },
    { id: 'dc-2', dayName: 'Maha Shashthi', tithiDetails: 'Shashthi Tithi — Devi Bodhon (awakening), Amontron & Adhivas', calendarDate: new Date('2026-10-15T00:00:00.000Z'), auspiciousTimings: '5:48 AM – 7:02 AM', isCountdownTarget: true, orderIndex: 2 },
    { id: 'dc-3', dayName: 'Maha Saptami', tithiDetails: 'Saptami Tithi — Nabapatrika Snan, Saptami Puja', calendarDate: new Date('2026-10-16T00:00:00.000Z'), auspiciousTimings: '6:13 AM – 8:30 AM', isCountdownTarget: false, orderIndex: 3 },
    { id: 'dc-4', dayName: 'Maha Ashtami', tithiDetails: 'Ashtami Tithi — Kumari Puja, Pushpanjali, Sandhi Puja', calendarDate: new Date('2026-10-17T00:00:00.000Z'), auspiciousTimings: '6:14 AM – 8:34 AM (Puja), 11:48 PM (Sandhi begins)', isCountdownTarget: false, orderIndex: 4 },
    { id: 'dc-5', dayName: 'Sandhi Puja', tithiDetails: 'Junction of Ashtami & Navami — 108 lamps, 108 lotus flowers offered', calendarDate: new Date('2026-10-17T18:18:00.000Z'), auspiciousTimings: '11:48 PM – 12:12 AM (48-minute window)', isCountdownTarget: false, orderIndex: 5 },
    { id: 'dc-6', dayName: 'Maha Navami', tithiDetails: 'Navami Tithi — Navami Puja, Havan, Bali (symbolic)', calendarDate: new Date('2026-10-18T00:00:00.000Z'), auspiciousTimings: '6:15 AM – 8:45 AM', isCountdownTarget: false, orderIndex: 6 },
    { id: 'dc-7', dayName: 'Vijaya Dashami', tithiDetails: 'Dashami Tithi — Visarjan procession, Sindur Khela', calendarDate: new Date('2026-10-19T00:00:00.000Z'), auspiciousTimings: 'Shubho Bijoya — idol immersion from 1:00 PM onwards', isCountdownTarget: false, orderIndex: 7 },
  ];

  for (const day of durgaCalendar) {
    await prisma.festivalCalendarDay.upsert({
      where: { id: day.id },
      update: {},
      create: { ...day, festivalId: durgaPuja.id },
    });
  }

  // --- KALI PUJA CALENDAR DAYS ---
  const kaliCalendar = [
    { id: 'kc-1', dayName: 'Kali Puja Amavasya', tithiDetails: 'Kartik Amavasya — Devi Kali worshipped through the night', calendarDate: new Date('2026-11-12T18:00:00.000Z'), auspiciousTimings: 'Nishita Puja: 11:40 PM – 12:31 AM (most auspicious)', isCountdownTarget: true, orderIndex: 1 },
    { id: 'kc-2', dayName: 'Diwali (Lakshmi Puja)', tithiDetails: 'Pradosh Kaal — lighting of diyas, Lakshmi Puja', calendarDate: new Date('2026-11-12T17:30:00.000Z'), auspiciousTimings: '5:30 PM – 7:00 PM (Pradosh)', isCountdownTarget: false, orderIndex: 2 },
    { id: 'kc-3', dayName: 'Bhratri Dwitiya', tithiDetails: "Bhai Phota — sisters apply tika to brothers' foreheads", calendarDate: new Date('2026-11-14T00:00:00.000Z'), auspiciousTimings: '11:00 AM – 1:00 PM', isCountdownTarget: false, orderIndex: 3 },
  ];

  for (const day of kaliCalendar) {
    await prisma.festivalCalendarDay.upsert({
      where: { id: day.id },
      update: {},
      create: { ...day, festivalId: kaliPuja.id },
    });
  }

  console.log('✅ Calendar days seeded');

  // --- PANDALS (DURGA PUJA 2026) ---
  const pandalData = [
    // North Kolkata
    { id: 'p-sreebhumi', name: 'Sreebhumi Sporting Club', slug: 'sreebhumi-sporting-club', zone: 'North Kolkata', area: 'Lake Town', address: 'VIP Road, Lake Town, Kolkata', pincode: '700089', latitude: 22.6074, longitude: 88.3980, isFeatured: true, sourceName: 'anandabazar.com' },
    { id: 'p-bagbazar', name: 'Bagbazar Sarbojanin', slug: 'bagbazar-sarbojanin', zone: 'North Kolkata', area: 'Bagbazar', address: 'Bagbazar Street, Kolkata', pincode: '700003', latitude: 22.5939, longitude: 88.3712, isFeatured: true, sourceName: 'kolkatapuja.com' },
    { id: 'p-kumartuli', name: 'Kumartuli Sarbojanin', slug: 'kumartuli-sarbojanin', zone: 'North Kolkata', area: 'Kumartuli', address: 'Kumartuli, Shyambazar, Kolkata', pincode: '700005', latitude: 22.5961, longitude: 88.3680, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-hatibagan', name: 'Hatibagan Sarbojanin', slug: 'hatibagan-sarbojanin', zone: 'North Kolkata', area: 'Hatibagan', address: 'Hatibagan Market area, Kolkata', pincode: '700006', latitude: 22.5870, longitude: 88.3668, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-shyambazar', name: 'Shyambazar Friends Union', slug: 'shyambazar-friends-union', zone: 'North Kolkata', area: 'Shyambazar', address: 'Shyambazar 5-Point Crossing, Kolkata', pincode: '700004', latitude: 22.5960, longitude: 88.3710, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-maniktala', name: 'Maniktala Chaltabagan', slug: 'maniktala-chaltabagan', zone: 'North Kolkata', area: 'Maniktala', address: 'Maniktala Main Road, Kolkata', pincode: '700054', latitude: 22.5741, longitude: 88.3725, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-sinthi', name: 'Sinthi More Durga Puja', slug: 'sinthi-more', zone: 'North Kolkata', area: 'Sinthi', address: 'Sinthi More, Kolkata', pincode: '700050', latitude: 22.5975, longitude: 88.3615, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-lake-town', name: 'Lake Town Block A', slug: 'lake-town-block-a', zone: 'North Kolkata', area: 'Lake Town', address: 'Lake Town, Kolkata', pincode: '700089', latitude: 22.5907, longitude: 88.3950, isFeatured: false, sourceName: 'kolkatapuja.com' },
    // Central Kolkata
    { id: 'p-college-sq', name: 'College Square', slug: 'college-square', zone: 'Central', area: 'College Street', address: 'College Square, College Street, Kolkata', pincode: '700073', latitude: 22.5760, longitude: 88.3639, isFeatured: true, sourceName: 'anandabazar.com' },
    { id: 'p-mohd-ali', name: 'Mohammad Ali Park', slug: 'mohammad-ali-park', zone: 'Central', area: 'Central Kolkata', address: 'Mohammad Ali Park, Kolkata', pincode: '700016', latitude: 22.5778, longitude: 88.3596, isFeatured: true, sourceName: 'anandabazar.com' },
    { id: 'p-santosh-mitra', name: 'Santosh Mitra Square', slug: 'santosh-mitra-square', zone: 'Central', area: 'Lebutala', address: 'Lebutala, Bowbazar, Kolkata', pincode: '700012', latitude: 22.5681, longitude: 88.3531, isFeatured: true, sourceName: 'anandabazar.com' },
    // South Kolkata
    { id: 'p-suruchi', name: 'Suruchi Sangha', slug: 'suruchi-sangha', zone: 'South Kolkata', area: 'New Alipore', address: 'New Alipore, Kolkata', pincode: '700053', latitude: 22.5202, longitude: 88.3297, isFeatured: true, sourceName: 'anandabazar.com' },
    { id: 'p-deshapriya', name: 'Deshapriya Park', slug: 'deshapriya-park', zone: 'South Kolkata', area: 'Rashbehari', address: 'Rashbehari Avenue, Kolkata', pincode: '700026', latitude: 22.5186, longitude: 88.3496, isFeatured: true, sourceName: 'anandabazar.com' },
    { id: 'p-hindustan', name: 'Hindustan Park', slug: 'hindustan-park', zone: 'South Kolkata', area: 'Hindustan Park', address: 'Hindustan Park, Golpark, Kolkata', pincode: '700029', latitude: 22.5195, longitude: 88.3513, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-mudiali', name: 'Mudiali Club', slug: 'mudiali-club', zone: 'South Kolkata', area: 'Mudiali', address: 'Mudiali, Kolkata', pincode: '700025', latitude: 22.5161, longitude: 88.3468, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-ekdalia', name: 'Ekdalia Evergreen', slug: 'ekdalia-evergreen', zone: 'South Kolkata', area: 'Ekdalia', address: 'Ekdalia, Gariahat, Kolkata', pincode: '700029', latitude: 22.5166, longitude: 88.3554, isFeatured: true, sourceName: 'anandabazar.com' },
    { id: 'p-ballygunge', name: 'Ballygunge Cultural Association', slug: 'ballygunge-cultural', zone: 'South Kolkata', area: 'Ballygunge', address: 'Ballygunge, Kolkata', pincode: '700019', latitude: 22.5281, longitude: 88.3641, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-95pally', name: '95 Pally', slug: '95-pally', zone: 'South Kolkata', area: 'Behala', address: 'Behala, Kolkata', pincode: '700034', latitude: 22.5241, longitude: 88.3427, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-chetla', name: 'Chetla Agrani Club', slug: 'chetla-agrani-club', zone: 'South Kolkata', area: 'Chetla', address: 'Chetla, Kolkata', pincode: '700027', latitude: 22.5143, longitude: 88.3435, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-tridhara', name: 'Tridhara Sammilani', slug: 'tridhara-sammilani', zone: 'South Kolkata', area: 'Behala', address: 'Behala, Kolkata', pincode: '700034', latitude: 22.5126, longitude: 88.3419, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-selimpur', name: 'Selimpur Pallishree', slug: 'selimpur-pallishree', zone: 'South Kolkata', area: 'Selimpur', address: 'Selimpur Road, Dhakuria, Kolkata', pincode: '700031', latitude: 22.5044, longitude: 88.3578, isFeatured: false, sourceName: 'kolkatapuja.com' },
    // Salt Lake / East Kolkata
    { id: 'p-fd-block', name: 'FD Block Durga Puja', slug: 'fd-block-salt-lake', zone: 'Salt Lake/East', area: 'Salt Lake', address: 'FD Block, Sector III, Salt Lake City, Kolkata', pincode: '700106', latitude: 22.5772, longitude: 88.4118, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-ae-block', name: 'AE Block Salt Lake', slug: 'ae-block-salt-lake', zone: 'Salt Lake/East', area: 'Salt Lake', address: 'AE Block, Sector I, Salt Lake City, Kolkata', pincode: '700064', latitude: 22.5731, longitude: 88.4153, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-bosepukur', name: 'Bosepukur Sitala Mandir', slug: 'bosepukur-sitala-mandir', zone: 'Salt Lake/East', area: 'Kasba', address: 'Bosepukur Road, Kasba, Kolkata', pincode: '700042', latitude: 22.5056, longitude: 88.3954, isFeatured: false, sourceName: 'kolkatapuja.com' },
    { id: 'p-kasba-talbagan', name: 'Kasba Bosepukur Talbagan', slug: 'kasba-bosepukur-talbagan', zone: 'Salt Lake/East', area: 'Kasba', address: 'Talbagan, Kasba, Kolkata', pincode: '700042', latitude: 22.5028, longitude: 88.3938, isFeatured: true, sourceName: 'anandabazar.com' },
  ];

  for (const p of pandalData) {
    await prisma.pandal.upsert({
      where: { name_festivalId: { name: p.name, festivalId: durgaPuja.id } },
      update: {},
      create: { ...p, festivalId: durgaPuja.id },
    });
  }

  console.log('✅ Pandals seeded');

  // --- PANDAL EDITIONS ---
  const editions = [
    { id: 'pe-sreebhumi-2026', pandalId: 'p-sreebhumi', year: 2026, theme: 'Bangkok Temple', themeDescription: 'Replica of the famous Wat Arun temple in Bangkok, Thailand, adorned with gold and precious stones.', idolArtist: 'Mintu Pal', pandalArtist: 'Subhas Das', pujaTimings: 'Shashthi: 5:48 AM | Saptami: 6:13 AM | Ashtami: 6:14 AM | Navami: 6:15 AM', awards: JSON.stringify(['Best Illumination 2025', 'Best Theme Award 2024']) },
    { id: 'pe-sreebhumi-2025', pandalId: 'p-sreebhumi', year: 2025, theme: 'Dubai Creek Harbour', themeDescription: 'Stunning recreation of the Dubai Creek Harbour skyline.', idolArtist: 'Mintu Pal', pandalArtist: 'Subhas Das', awards: JSON.stringify(['Best Grand Pandal 2025']) },
    { id: 'pe-sreebhumi-2024', pandalId: 'p-sreebhumi', year: 2024, theme: 'Burj Al Arab', themeDescription: 'Faithful scale model of the iconic Dubai hotel.', idolArtist: 'Mintu Pal', pandalArtist: 'Subhas Das', awards: JSON.stringify(['Best Illumination 2024']) },
    { id: 'pe-college-2026', pandalId: 'p-college-sq', year: 2026, theme: 'Char Dham Yatra', themeDescription: 'Journey through the four holy dhams — Badrinath, Dwarka, Puri, and Rameshwaram.', idolArtist: 'Sanatan Dinda', pandalArtist: 'Rintu Das', pujaTimings: 'Open all day, Aarti at 6 PM and 10 PM daily', awards: JSON.stringify(['Best Artistic Idol 2025', 'Heritage Award 2023']) },
    { id: 'pe-college-2025', pandalId: 'p-college-sq', year: 2025, theme: 'Natmandir', themeDescription: 'Traditional Bengali natmandir architecture with intricate terracotta work.', idolArtist: 'Sanatan Dinda', awards: JSON.stringify(['Best Traditional Theme 2025']) },
    { id: 'pe-deshapriya-2026', pandalId: 'p-deshapriya', year: 2026, theme: 'Maa er Mukh', themeDescription: "Theme centered on the divine mother's compassionate face — a meditation on motherhood.", idolArtist: 'Tapas Dutta', pandalArtist: 'Asit Dutta', pujaTimings: 'Aarti: 5:30 AM, 12:00 PM, 6:00 PM, 11:00 PM', awards: JSON.stringify(['UNESCO Heritage List 2023', 'Best Crowd Management 2024']) },
    { id: 'pe-suruchi-2026', pandalId: 'p-suruchi', year: 2026, theme: 'Prakriti', themeDescription: 'Eco-friendly pandal celebrating nature — handmade from clay, jute, bamboo, and leaves.', idolArtist: 'Pradip Rudra Pal', pandalArtist: 'Dulal Mondal', pujaTimings: 'Entry from 10 AM', awards: JSON.stringify(['Best Eco-Friendly Pandal 2026', 'Green Puja Award 2025']) },
    { id: 'pe-mohd-ali-2026', pandalId: 'p-mohd-ali', year: 2026, theme: 'Ek Takar Shansar', themeDescription: 'Social commentary pandal on economic disparity — built from recycled materials.', idolArtist: 'Gouranga Kuila', pandalArtist: 'Sushanta Pal', awards: JSON.stringify(['Best Social Theme 2026', 'Best Artistic Pandal 2024']) },
    { id: 'pe-santosh-2026', pandalId: 'p-santosh-mitra', year: 2026, theme: 'Angkor Wat', themeDescription: 'Awe-inspiring 100-ft recreation of the Angkor Wat temple complex with 108 lamps.', idolArtist: 'Bhabatosh Sutar', pandalArtist: 'Avijit Chattopadhyay', awards: JSON.stringify(['Best Grand Structure 2024', 'Best Night Illumination 2023']) },
    { id: 'pe-ekdalia-2026', pandalId: 'p-ekdalia', year: 2026, theme: 'Desh Bhalobashi', themeDescription: 'Patriotic theme celebrating independent India with folk art installations.', idolArtist: 'Tapas Pal', pandalArtist: 'Ramen Das', awards: JSON.stringify(['Best Thematic Execution 2025']) },
    { id: 'pe-kasba-2026', pandalId: 'p-kasba-talbagan', year: 2026, theme: 'Chol Jai Bangladesh', themeDescription: 'A tribute to the folk culture and liberation spirit of Bangladesh.', idolArtist: 'Asim Mondal', pandalArtist: 'Prodip Das', awards: JSON.stringify(['Best Community Spirit 2025']) },
    { id: 'pe-bagbazar-2026', pandalId: 'p-bagbazar', year: 2026, theme: 'Neel Durga', themeDescription: 'The 200+ year old traditional Bagbazar puja — one of the oldest in Kolkata.', idolArtist: 'Traditional family artisan', pandalArtist: 'Traditional', pujaTimings: 'Strict traditional timings per Panjika', awards: JSON.stringify(['Heritage Puja Award', 'Oldest Traditional Puja 2024']) },
  ];

  for (const ed of editions) {
    await prisma.pandalEdition.upsert({
      where: { pandalId_year: { pandalId: ed.pandalId, year: ed.year } },
      update: {},
      create: {
        id: ed.id,
        pandalId: ed.pandalId,
        year: ed.year,
        theme: ed.theme || null,
        themeDescription: ed.themeDescription || null,
        idolArtist: ed.idolArtist || null,
        pandalArtist: ed.pandalArtist || null,
        pujaTimings: ed.pujaTimings || null,
        images: '[]',
        awards: ed.awards || '[]',
      },
    });
  }

  console.log('✅ Pandal editions seeded');

  // --- INGEST SCRAPED PANDALS (IF AVAILABLE) ---
  const fs = require('fs');
  const path = require('path');
  const scrapedPath = path.join(__dirname, '..', 'src', 'data', 'scraped-pandals.json');
  if (fs.existsSync(scrapedPath)) {
    try {
      const scrapedList = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));
      console.log(`📦 Found ${scrapedList.length} scraped pandals in ${scrapedPath}. Seeding into database...`);
      let sCount = 0;
      let edCount = 0;
      for (const p of scrapedList) {
        const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const pandal = await prisma.pandal.upsert({
          where: { name_festivalId: { name: p.name, festivalId: durgaPuja.id } },
          update: {
            slug,
            zone: p.zone || 'Kolkata',
            area: p.area || p.landmark || p.zone || 'Kolkata',
            address: p.address || p.zone || 'Kolkata',
            latitude: p.latitude || 22.5726,
            longitude: p.longitude || 88.3639,
            sourceName: 'Indian Festival Diary',
          },
          create: {
            festivalId: durgaPuja.id,
            name: p.name,
            slug,
            zone: p.zone || 'Kolkata',
            area: p.area || p.landmark || p.zone || 'Kolkata',
            address: p.address || p.zone || 'Kolkata',
            latitude: p.latitude || 22.5726,
            longitude: p.longitude || 88.3639,
            verificationStatus: 'VERIFIED',
            sourceName: 'Indian Festival Diary',
          },
        });
        sCount++;

        if (Array.isArray(p.editions)) {
          for (const ed of p.editions) {
            await prisma.pandalEdition.upsert({
              where: { pandalId_year: { pandalId: pandal.id, year: ed.year } },
              update: {
                theme: ed.theme || null,
                themeDescription: ed.themeDescription || null,
                idolArtist: ed.idolArtist || null,
                pandalArtist: ed.pandalArtist || null,
                awards: typeof ed.awards === 'string' ? ed.awards : JSON.stringify(ed.awards || []),
              },
              create: {
                pandalId: pandal.id,
                year: ed.year,
                theme: ed.theme || null,
                themeDescription: ed.themeDescription || null,
                idolArtist: ed.idolArtist || null,
                pandalArtist: ed.pandalArtist || null,
                awards: typeof ed.awards === 'string' ? ed.awards : JSON.stringify(ed.awards || []),
                images: '[]',
              },
            });
            edCount++;
          }
        }
      }
      console.log(`✅ Successfully seeded ${sCount} scraped pandals and ${edCount} editions from Indian Festival Diary!`);
    } catch (e) {
      console.error('Error seeding scraped pandals:', e.message);
    }
  }

  // --- MUSIC TRACKS ---
  const tracks = [
    { id: 'mt-dhak-1', title: 'Dhakir Dhol — Festival Beat', type: 'DHAK', filePath: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 240, sourceName: 'SoundHelix Demo', licenseType: 'Demo' },
    { id: 'mt-dhak-2', title: 'Dhak Beats — Ashtami Special', type: 'DHAK', filePath: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: 180, sourceName: 'SoundHelix Demo', licenseType: 'Demo' },
    { id: 'mt-shankha-1', title: 'Shankha Dhwani — Morning Prayer', type: 'SHANKHA', filePath: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration: 120, sourceName: 'SoundHelix Demo', licenseType: 'Demo' },
    { id: 'mt-soundscape-1', title: 'Mahalaya Birendra Krishna Bhadra', type: 'SOUNDSCAPE', filePath: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 300, sourceName: 'SoundHelix Demo', licenseType: 'Demo' },
    { id: 'mt-soundscape-2', title: 'Puja Ambiance — Kolkata Streets', type: 'SOUNDSCAPE', filePath: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 360, sourceName: 'SoundHelix Demo', licenseType: 'Demo' },
    { id: 'mt-kali-1', title: 'Kali Mantra — Nishita Puja', type: 'SOUNDSCAPE', filePath: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration: 200, sourceName: 'SoundHelix Demo', licenseType: 'Demo' },
  ];

  for (const t of tracks) {
    await prisma.musicTrack.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    });
  }

  const durgaTrackIds = ['mt-dhak-1', 'mt-dhak-2', 'mt-shankha-1', 'mt-soundscape-1', 'mt-soundscape-2'];
  const kaliTrackIds = ['mt-kali-1', 'mt-shankha-1', 'mt-soundscape-1'];

  for (const tid of durgaTrackIds) {
    await prisma.musicTrackFestival.upsert({
      where: { musicTrackId_festivalId: { musicTrackId: tid, festivalId: durgaPuja.id } },
      update: {},
      create: { musicTrackId: tid, festivalId: durgaPuja.id },
    });
  }
  for (const tid of kaliTrackIds) {
    await prisma.musicTrackFestival.upsert({
      where: { musicTrackId_festivalId: { musicTrackId: tid, festivalId: kaliPuja.id } },
      update: {},
      create: { musicTrackId: tid, festivalId: kaliPuja.id },
    });
  }

  await prisma.siteMetric.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, totalViews: 0 },
  });

  console.log('✅ Music tracks seeded');
  console.log('🎉 PUJA GUIDE seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
