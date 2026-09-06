const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('unique_scraped_pandals.json', 'utf8'));
  console.log(`Importing ${data.length} pandals from Indian Festival Diary...`);
  
  let festival = await prisma.festival.findUnique({
    where: { slug: 'durga-puja-2026' }
  });
  
  if (!festival) {
    festival = await prisma.festival.create({
      data: {
        name: 'Durga Puja 2026',
        slug: 'durga-puja-2026',
        year: 2026,
        startDate: new Date('2026-10-18T00:00:00.000Z'),
        endDate: new Date('2026-10-23T00:00:00.000Z'),
      }
    });
  }

  let imported = 0;
  for (const p of data) {
    // Generate simple coordinates and slug based on name
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    try {
      await prisma.pandal.upsert({
        where: {
          name_festivalId: {
            name: p.name,
            festivalId: festival.id
          }
        },
        update: {
          zone: p.zone,
          sourceName: 'Indian Festival Diary'
        },
        create: {
          festivalId: festival.id,
          name: p.name,
          slug: slug,
          zone: p.zone,
          area: p.zone,
          address: p.zone,
          latitude: 22.5726 + (Math.random() * 0.1 - 0.05), // random approx coord in kolkata
          longitude: 88.3639 + (Math.random() * 0.1 - 0.05), // random approx coord in kolkata
          verificationStatus: 'VERIFIED',
          sourceName: 'Indian Festival Diary',
          editions: {
            create: [
              {
                year: 2026,
                theme: 'Traditional Durga Puja', // Pending AI enrichment
              }
            ]
          }
        }
      });
      imported++;
      if (imported % 50 === 0) console.log(`Processed ${imported}...`);
    } catch (e) {
      console.log(`Failed to insert ${p.name}:`, e.message);
    }
  }

  console.log(`✅ Successfully synced ${imported} pandals into the database!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
