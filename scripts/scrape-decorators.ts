import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

async function scrapeDecorators(url: string, outputFile: string) {
  console.log(`Scraping ${url}...`);
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const decorators: any[] = [];
    
    $('table.deco_list tbody tr').each((i, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 6) {
        const id = $(tds[0]).text().trim();
        const name = $(tds[1]).text().trim();
        const decoratedFor = $(tds[2]).text().trim();
        const year = $(tds[3]).text().trim();
        const address = $(tds[4]).text().trim();
        const contact = $(tds[5]).text().trim();
        
        if (name) {
          decorators.push({
            id,
            name,
            decoratedFor,
            year,
            address,
            contact
          });
        }
      }
    });
    
    const outPath = path.join(process.cwd(), 'src', 'data', outputFile);
    fs.writeFileSync(outPath, JSON.stringify(decorators, null, 2));
    console.log(`Saved ${decorators.length} decorators to ${outputFile}`);
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
}

async function main() {
  await scrapeDecorators(
    'https://www.indianfestivaldiary.com/durgapuja/pandal_decorator.php',
    'pandal-decorators.json'
  );
  
  await scrapeDecorators(
    'https://www.indianfestivaldiary.com/durgapuja/lighting_decorator.php',
    'lighting-decorators.json'
  );
}

main();
