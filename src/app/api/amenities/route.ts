export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

// Curated high-reliability Kolkata emergency amenities (used as fallback or base)
const CURATED_KOLKATA_AMENITIES = [
  // Hospitals
  { id: 'h-sskm', lat: 22.5398, lon: 88.3425, tags: { amenity: 'hospital', name: 'SSKM / IPGMER Hospital', phone: '033-2223-3800', address: '244 AJC Bose Road, Bhowanipore' } },
  { id: 'h-medcol', lat: 22.5732, lon: 88.3615, tags: { amenity: 'hospital', name: 'Calcutta Medical College & Hospital', phone: '033-2255-1621', address: '88 College Street, College Square' } },
  { id: 'h-nrs', lat: 22.5645, lon: 88.3705, tags: { amenity: 'hospital', name: 'NRS Medical College & Hospital', phone: '033-2286-0033', address: '138 AJC Bose Road, Sealdah' } },
  { id: 'h-rgkar', lat: 22.6041, lon: 88.3751, tags: { amenity: 'hospital', name: 'RG Kar Medical College & Hospital', phone: '033-2555-7656', address: '1 Khudiram Bose Sarani, Belgachia' } },
  { id: 'h-cnmc', lat: 22.5401, lon: 88.3685, tags: { amenity: 'hospital', name: 'Calcutta National Medical College', phone: '033-2284-4834', address: '32 Gorachand Road, Beniapukur' } },
  { id: 'h-bellevue', lat: 22.5422, lon: 88.3538, tags: { amenity: 'hospital', name: 'Belle Vue Clinic', phone: '033-2287-2321', address: '9 Dr UN Brahmachari Street, Elgin' } },
  { id: 'h-amri-dh', lat: 22.5132, lon: 88.3614, tags: { amenity: 'hospital', name: 'AMRI Hospital Dhakuria', phone: '033-6680-0000', address: 'Block A, Gariahat Road, Dhakuria' } },
  { id: 'h-apollo', lat: 22.5712, lon: 88.4014, tags: { amenity: 'hospital', name: 'Apollo Multispeciality Hospitals', phone: '033-2320-3040', address: '58 Canal Circular Road, Kadapara' } },
  { id: 'h-fortis', lat: 22.5185, lon: 88.4021, tags: { amenity: 'hospital', name: 'Fortis Hospital Anandapur', phone: '033-6628-4444', address: '730 Anandapur, EM Bypass' } },
  { id: 'h-peerless', lat: 22.4842, lon: 88.3982, tags: { amenity: 'hospital', name: 'Peerless Hospital & B.K. Roy Research', phone: '033-4011-1222', address: '360 Panchasayar, Garia' } },
  { id: 'h-ruby', lat: 22.5135, lon: 88.4035, tags: { amenity: 'hospital', name: 'Ruby General Hospital', phone: '033-3987-1800', address: 'Kasba Golpark, EM Bypass' } },
  { id: 'h-howrah-dist', lat: 22.5841, lon: 88.3287, tags: { amenity: 'hospital', name: 'Howrah District Hospital', phone: '033-2641-8600', address: 'Biplabi Haren Ghosh Sarani, Howrah' } },

  // Police Stations
  { id: 'p-lalbazar', lat: 22.5708, lon: 88.3532, tags: { amenity: 'police', name: 'Kolkata Police Headquarters (Lalbazar)', phone: '033-2214-5000', address: '18 Lalbazar Street, BBD Bagh' } },
  { id: 'p-parkst', lat: 22.5512, lon: 88.3541, tags: { amenity: 'police', name: 'Park Street Police Station', phone: '033-2229-2323', address: '109 Park Street, Kolkata' } },
  { id: 'p-shyambazar', lat: 22.6002, lon: 88.3712, tags: { amenity: 'police', name: 'Shyampukur Police Station', phone: '033-2555-7033', address: '47 Shyampukur Street, Shyambazar' } },
  { id: 'p-bhowanipore', lat: 22.5312, lon: 88.3478, tags: { amenity: 'police', name: 'Bhowanipore Police Station', phone: '033-2454-0000', address: '19 Ashutosh Mukherjee Road' } },
  { id: 'p-gariahat', lat: 22.5182, lon: 88.3654, tags: { amenity: 'police', name: 'Gariahat Police Station', phone: '033-2464-1000', address: '22 Hindusthan Park, Gariahat' } },
  { id: 'p-ballygunge', lat: 22.5271, lon: 88.3612, tags: { amenity: 'police', name: 'Ballygunge Police Station', phone: '033-2460-1500', address: 'Ballygunge Circular Road' } },
  { id: 'p-saltlake', lat: 22.5872, lon: 88.4162, tags: { amenity: 'police', name: 'Bidhannagar East Police Station', phone: '033-2337-1000', address: 'JB Block, Sector III, Salt Lake' } },
  { id: 'p-newtown', lat: 22.5841, lon: 88.4632, tags: { amenity: 'police', name: 'New Town Police Station', phone: '033-2324-4000', address: 'Action Area I, New Town' } },
  { id: 'p-howrah', lat: 22.5835, lon: 88.3412, tags: { amenity: 'police', name: 'Golabari Police Station (Howrah)', phone: '033-2666-0000', address: 'Grand Trunk Road, Howrah' } },
  { id: 'p-behala', lat: 22.4975, lon: 88.3125, tags: { amenity: 'police', name: 'Behala Police Station', phone: '033-2398-0000', address: 'Diamond Harbour Road, Behala' } },

  // Public Toilets
  { id: 't-howrah-stn', lat: 22.5855, lon: 88.3425, tags: { amenity: 'toilets', name: 'Sulabh Sauchalaya (Howrah Station Area)', phone: '', address: 'Howrah Station Complex' } },
  { id: 't-sealdah', lat: 22.5682, lon: 88.3718, tags: { amenity: 'toilets', name: 'Public Toilet - Sealdah Station Hub', phone: '', address: 'Bipin Behari Ganguly Street, Sealdah' } },
  { id: 't-esplanade', lat: 22.5645, lon: 88.3518, tags: { amenity: 'toilets', name: 'KMC Public Toilet - Esplanade Bus Terminus', phone: '', address: 'Dorina Crossing, Esplanade' } },
  { id: 't-shyambazar', lat: 22.5975, lon: 88.3705, tags: { amenity: 'toilets', name: 'KMC Public Toilet - Shyambazar 5-Point', phone: '', address: 'Shyambazar Five Point Crossing' } },
  { id: 't-college-sq', lat: 22.5752, lon: 88.3632, tags: { amenity: 'toilets', name: 'Public Toilet - College Square', phone: '', address: 'College Street, Kolkata' } },
  { id: 't-gariahat', lat: 22.5185, lon: 88.3642, tags: { amenity: 'toilets', name: 'Public Toilet - Gariahat Crossing', phone: '', address: 'Rashbehari Avenue, Gariahat' } },
  { id: 't-kalighat', lat: 22.5198, lon: 88.3445, tags: { amenity: 'toilets', name: 'Sulabh Toilet - Kalighat Temple Complex', phone: '', address: 'Kalitemple Road, Kalighat' } },
  { id: 't-karunamoyee', lat: 22.5852, lon: 88.4205, tags: { amenity: 'toilets', name: 'Public Toilet - Karunamoyee Bus Station', phone: '', address: 'Central Park, Salt Lake Sector II' } },
  { id: 't-newmarket', lat: 22.5595, lon: 88.3528, tags: { amenity: 'toilets', name: 'KMC Public Toilet - New Market / Lindsay St', phone: '', address: 'Lindsay Street, Dharmatala' } },
  { id: 't-dakshineswar', lat: 22.6545, lon: 88.3575, tags: { amenity: 'toilets', name: 'Sulabh Toilet - Dakshineswar Skywalk', phone: '', address: 'Dakshineswar Temple Complex' } },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bboxParam = searchParams.get('bbox');
    const showToilets = searchParams.get('toilets') === 'true';
    const showPolice = searchParams.get('police') === 'true';
    const showHospitals = searchParams.get('hospitals') === 'true';

    if (!showToilets && !showPolice && !showHospitals) {
      return NextResponse.json([]);
    }

    const bbox = bboxParam || '22.45,88.25,22.65,88.45';

    // Build Overpass query
    let parts: string[] = [];
    if (showToilets) parts.push(`nwr["amenity"="toilets"](${bbox});`);
    if (showPolice) parts.push(`nwr["amenity"="police"](${bbox});`);
    if (showHospitals) parts.push(`nwr["amenity"="hospital"](${bbox});`);

    const overpassQuery = `[out:json][timeout:12];(${parts.join('')});out center 120;`;

    // Try Overpass mirrors with timeout
    const endpoints = [
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
      `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
      `https://lz4.overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
    ];

    let liveElements: any[] = [];
    for (const ep of endpoints) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(ep, {
          headers: {
            'User-Agent': 'PujaGuideApp/1.0 (https://13-parbon.vercel.app)'
          },
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (Array.isArray(data.elements)) {
              liveElements = data.elements
                .filter((e: any) => e.tags && (e.lat || e.center?.lat) && (e.lon || e.center?.lon))
                .map((e: any) => ({
                  id: String(e.id),
                  lat: e.lat || e.center?.lat,
                  lon: e.lon || e.center?.lon,
                  tags: {
                    amenity: e.tags.amenity,
                    name: e.tags.name || (e.tags.amenity === 'hospital' ? 'Hospital' : e.tags.amenity === 'police' ? 'Police Station' : 'Public Toilet'),
                    phone: e.tags['contact:phone'] || e.tags.phone || '',
                    address: e.tags['addr:street'] || e.tags['addr:full'] || ''
                  }
                }));
              break;
            }
          }
        }
      } catch (err) {
        // Continue to next mirror
      }
    }

    // Filter curated fallback elements based on requested types
    const matchingCurated = CURATED_KOLKATA_AMENITIES.filter((a) => {
      if (a.tags.amenity === 'toilets' && showToilets) return true;
      if (a.tags.amenity === 'police' && showPolice) return true;
      if (a.tags.amenity === 'hospital' && showHospitals) return true;
      return false;
    });

    // Merge live results with curated list (avoiding duplicate names)
    const seenNames = new Set(liveElements.map((e: any) => (e.tags?.name || '').toLowerCase()));
    const merged = [...liveElements];
    for (const c of matchingCurated) {
      if (!seenNames.has(c.tags.name.toLowerCase())) {
        merged.push(c);
      }
    }

    return NextResponse.json(merged, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error in /api/amenities:', error);
    return NextResponse.json(CURATED_KOLKATA_AMENITIES);
  }
}
