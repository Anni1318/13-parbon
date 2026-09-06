import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getZone(area: string | null): string {
  if (!area) return 'All';
  const lower = area.toLowerCase();
  
  if (
    lower.includes('north') || lower.includes('baghbazar') || lower.includes('shyambazar') || 
    lower.includes('sovabazar') || lower.includes('manicktala') || lower.includes('jorabagan') || 
    lower.includes('cossipore') || lower.includes('tala') || lower.includes('hatibagan') ||
    lower.includes('ahiritola') || lower.includes('beniatola') || lower.includes('darjipara') ||
    lower.includes('kumartuli') || lower.includes('simla')
  ) {
    return 'North Kolkata';
  }
  
  if (
    lower.includes('south') || lower.includes('ballygunge') || lower.includes('kalighat') || 
    lower.includes('bhowanipore') || lower.includes('chetla') || lower.includes('new alipore') || 
    lower.includes('kasba') || lower.includes('gariahat') || lower.includes('mudiali') ||
    lower.includes('kidderpore')
  ) {
    return 'South Kolkata';
  }
  
  if (
    lower.includes('central') || lower.includes('college street') || lower.includes('bowbazar') || 
    lower.includes('sealdah') || lower.includes('entally') || lower.includes('esplanade') ||
    lower.includes('college square') || lower.includes('baithakkhana') || lower.includes('machuabazar') ||
    lower.includes('taltala') || lower.includes('kolutolla')
  ) {
    return 'Central';
  }
  
  if (
    lower.includes('salt lake') || lower.includes('lake town') || lower.includes('dum dum') || 
    lower.includes('beliaghata') || lower.includes('phoolbagan') || lower.includes('ultadanga')
  ) {
    return 'Salt Lake/East';
  }
  
  return 'All'; // Default fallback
}

async function main() {
  console.log('Fetching live pandal data from Sharodiya API...');
  const res = await fetch('https://api.sharodiya.com/api/pandals');
  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }
  const json = await res.json();
  const pandals = json.data;

  console.log(`Successfully fetched ${pandals.length} pandals.`);

  // Find the target festival
  let festival = await prisma.festival.findUnique({
    where: { slug: 'durga-puja-2026' }
  });

  if (!festival) {
    console.log('Festival durga-puja-2026 not found, creating it...');
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

  console.log('Wiping existing pandals from local database...');
  await prisma.pandal.deleteMany({});

  console.log('Inserting new pandals...');
  let imported = 0;
  const seenNames = new Set<string>();

  for (const p of pandals) {
    const zone = getZone(p.area);
    const slug = p.slug || Math.random().toString(36).substring(7);

    let finalName = p.name;
    let counter = 1;
    while (seenNames.has(finalName)) {
      finalName = `${p.name} (${p.area || counter})`;
      if (seenNames.has(finalName)) {
        finalName = `${p.name} (${p.area || counter} - ${counter})`;
      }
      counter++;
    }
    seenNames.add(finalName);

    await prisma.pandal.create({
      data: {
        festivalId: festival.id,
        name: finalName,
        slug: slug,
        zone: zone,
        area: p.area || 'Kolkata',
        address: p.area || 'Kolkata',
        latitude: p.lat || 22.5726,
        longitude: p.lng || 88.3639,
        verificationStatus: 'VERIFIED',
        isFeatured: p.is_featured === true || p.is_featured === 1,
        sourceName: 'Sharodiya',
        editions: {
          create: [
            {
              year: 2026,
              theme: p.about || 'Traditional Durga Puja',
              images: JSON.stringify(p.photos || []),
            }
          ]
        }
      }
    });
    imported++;
    if (imported % 50 === 0) console.log(`Inserted ${imported}/${pandals.length}`);
  }

  console.log(`✅ Import complete! Successfully seeded ${imported} pandals into the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
