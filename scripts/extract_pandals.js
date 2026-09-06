const fs = require('fs');

try {
  const content = fs.readFileSync('C:/Users/User/.gemini/antigravity-ide/brain/badba528-d671-4fa5-9ce6-667ae416d2ac/.system_generated/steps/272/content.md', 'utf8');
  
  const matches = [];
  const parts = content.split('class="card shadow-sm p-1 puja_list"');
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const titleMatch = part.match(/title="([^"]+)"/);
    const zoneMatch = part.match(/Zone:([^<]+)<\/small>/);
    
    if (titleMatch && zoneMatch) {
      let name = titleMatch[1].replace(' 2025', '').trim();
      let zone = zoneMatch[1].trim();
      matches.push({ name, zone });
    }
  }

  fs.writeFileSync('scraped_pandals.json', JSON.stringify(matches, null, 2));
  console.log(`Successfully extracted ${matches.length} pandals.`);
} catch (e) {
  console.error("Error processing:", e);
}
