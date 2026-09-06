require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, '..', 'src', 'data', 'scraped-pandals.json');
  const fallbackPath = path.join(__dirname, '..', 'unique_scraped_pandals.json');

  let data = [];
  if (fs.existsSync(jsonPath)) {
    console.log(`📖 Loading pandals from ${jsonPath}...`);
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } else if (fs.existsSync(fallbackPath)) {
    console.log(`📖 Loading pandals from fallback ${fallbackPath}...`);
    data = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
  } else {
    console.error('❌ No pandal data file found to import.');
    process.exit(1);
  }

  console.log(`Found ${data.length} pandals to import into PostgreSQL.`);

  // Find or create Durga Puja 2026 festival
  let festival = await prisma.festival.findUnique({
    where: { slug: 'durga-puja-2026' }
  });

  if (!festival) {
    console.log('Creating Durga Puja 2026 festival...');
    festival = await prisma.festival.create({
      data: {
        id: 'festival-durga-2026',
        name: 'Durga Puja 2026',
        slug: 'durga-puja-2026',
        year: 2026,
        description: 'The grandest celebration of West Bengal — five days of art, devotion, and community.',
        startDate: new Date('2026-10-15T00:00:00.000Z'),
        endDate: new Date('2026-10-19T23:59:59.000Z'),
        primaryColor: '#F59E0B'
      }
    });
  }

  let pandalCount = 0;
  let editionCount = 0;

  for (const p of data) {
    const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      const pandal = await prisma.pandal.upsert({
        where: {
          name_festivalId: {
            name: p.name,
            festivalId: festival.id
          }
        },
        update: {
          slug: slug,
          zone: p.zone || 'Kolkata',
          area: p.area || p.landmark || p.zone || 'Kolkata',
          address: p.address || p.zone || 'Kolkata',
          city: p.city || 'Kolkata',
          district: p.district || 'Kolkata',
          state: p.state || 'West Bengal',
          pincode: p.pincode || null,
          latitude: p.latitude || 22.5726,
          longitude: p.longitude || 88.3639,
          verificationStatus: 'VERIFIED',
          sourceName: 'Indian Festival Diary'
        },
        create: {
          festivalId: festival.id,
          name: p.name,
          slug: slug,
          zone: p.zone || 'Kolkata',
          area: p.area || p.landmark || p.zone || 'Kolkata',
          address: p.address || p.zone || 'Kolkata',
          city: p.city || 'Kolkata',
          district: p.district || 'Kolkata',
          state: p.state || 'West Bengal',
          pincode: p.pincode || null,
          latitude: p.latitude || 22.5726,
          longitude: p.longitude || 88.3639,
          verificationStatus: 'VERIFIED',
          sourceName: 'Indian Festival Diary'
        }
      });
      pandalCount++;

      // Upsert editions if provided
      const editions = Array.isArray(p.editions) && p.editions.length > 0 ? p.editions : [
        {
          year: 2026,
          theme: 'Traditional Durga Puja',
          themeDescription: `${p.name} celebrates Durga Puja with authentic Bengali rituals.`,
          awards: []
        }
      ];

      for (const ed of editions) {
        await prisma.pandalEdition.upsert({
          where: {
            pandalId_year: {
              pandalId: pandal.id,
              year: ed.year
            }
          },
          update: {
            theme: ed.theme || null,
            themeDescription: ed.themeDescription || null,
            idolArtist: ed.idolArtist || null,
            pandalArtist: ed.pandalArtist || null,
            awards: typeof ed.awards === 'string' ? ed.awards : JSON.stringify(ed.awards || [])
          },
          create: {
            pandalId: pandal.id,
            year: ed.year,
            theme: ed.theme || null,
            themeDescription: ed.themeDescription || null,
            idolArtist: ed.idolArtist || null,
            pandalArtist: ed.pandalArtist || null,
            awards: typeof ed.awards === 'string' ? ed.awards : JSON.stringify(ed.awards || []),
            images: '[]'
          }
        });
        editionCount++;
      }

      if (pandalCount % 25 === 0) {
        console.log(`  Processed ${pandalCount} pandals (${editionCount} editions)...`);
      }
    } catch (err) {
      console.error(`Failed to import ${p.name}:`, err.message);
    }
  }

  console.log(`\n🎉 Import Complete!`);
  console.log(`✅ Successfully synced ${pandalCount} pandals and ${editionCount} yearly editions into the PostgreSQL database!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
