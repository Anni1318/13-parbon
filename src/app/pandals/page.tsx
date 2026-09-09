export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import PandalCard from '@/components/ui/PandalCard';
import PandalFilters from '@/components/pandals/PandalFilters';
import Link from 'next/link';
import { Map } from 'lucide-react';
import { searchGooglePlacesForPandals } from '@/lib/googlePlaces';
import scrapedPandalsFallback from '@/data/scraped-pandals.json';

const ALL_ZONES = [
  'All',
  'South Kolkata',
  'North Kolkata',
  'Central Kolkata',
  'Behala',
  'Howrah',
  'Salt Lake',
  'East Kolkata',
  'North 24 Parganas',
  'South 24 Parganas',
  'Hooghly',
  'Other Zone',
];

function getFallbackPandals(zone?: string, q?: string, featured?: string, sort = 'featured') {
  let list = (scrapedPandalsFallback as any[]).map((p, idx) => ({
    ...p,
    id: p.id || `scraped-${idx}`,
    slug: p.slug || `pandal-${idx}`,
    isFeatured: Boolean(p.isFeatured),
    editions: Array.isArray(p.editions) && p.editions.length > 0 ? p.editions : [
      {
        year: 2026,
        theme: p.theme || 'Traditional Celebrations',
        themeDescription: p.themeDescription || p.description || '',
        idolArtist: p.idolArtist || '',
        pandalArtist: p.pandalArtist || '',
        lighting: null,
        budget: null,
        crowd: null,
        awards: []
      }
    ]
  }));

  if (zone && zone !== 'All') {
    const lowerZone = zone.toLowerCase().trim();
    list = list.filter((p) => p.zone?.toLowerCase().trim() === lowerZone);
  }

  if (featured === 'true') {
    list = list.filter((p) => p.isFeatured);
  }

  if (q) {
    const lower = q.toLowerCase().trim();
    list = list.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(lower)) ||
        (p.area && p.area.toLowerCase().includes(lower)) ||
        (p.zone && p.zone.toLowerCase().includes(lower)) ||
        (p.address && p.address.toLowerCase().includes(lower))
    );
  }

  if (sort === 'name') {
    list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sort === 'zone') {
    list.sort((a, b) => (a.zone || '').localeCompare(b.zone || '') || (a.name || '').localeCompare(b.name || ''));
  } else {
    list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (a.name || '').localeCompare(b.name || ''));
  }

  return list;
}

async function getPandals(zone?: string, q?: string, featured?: string, sort = 'featured') {
  try {
    const queryPrisma = async () => {
      const defaultFestival = await prisma.festival.findUnique({
        where: { slug: 'durga-puja-2026' },
      });
      if (!defaultFestival) return [];

      let orderBy: any[] = [{ isFeatured: 'desc' }, { name: 'asc' }];
      if (sort === 'name') {
        orderBy = [{ name: 'asc' }];
      } else if (sort === 'zone') {
        orderBy = [{ zone: 'asc' }, { name: 'asc' }];
      }

      const all = await prisma.pandal.findMany({
        where: {
          festivalId: defaultFestival.id,
          ...(zone && zone !== 'All' ? { zone } : {}),
          ...(featured === 'true' ? { isFeatured: true } : {}),
        },
        include: { editions: { orderBy: { year: 'desc' }, take: 1 } },
        orderBy,
      });
      return all;
    };

    const prismaPromise = queryPrisma();
    const timeoutPromise = new Promise<any[]>((_, reject) =>
      setTimeout(() => reject(new Error('Prisma timeout')), 3000)
    );

    let all = await Promise.race([prismaPromise, timeoutPromise]);

    if (!all || all.length === 0) {
      all = getFallbackPandals(zone, undefined, featured, sort);
    }

    if (q) {
      const lower = q.toLowerCase();
      const filtered = all.filter(
        (p: any) =>
          (p.name && p.name.toLowerCase().includes(lower)) ||
          (p.area && p.area.toLowerCase().includes(lower)) ||
          (p.zone && p.zone.toLowerCase().includes(lower))
      );

      if (filtered.length === 0) {
        try {
          const googleResults = await searchGooglePlacesForPandals(q);
          if (featured === 'true') {
            return (googleResults || []).filter((p: any) => p.isFeatured);
          }
          return googleResults || [];
        } catch {
          return [];
        }
      }

      return filtered;
    }
    return all;
  } catch (err) {
    console.warn('Fallback to local scraped pandals dataset:', err);
    return getFallbackPandals(zone, q, featured, sort);
  }
}

export default async function PandalsPage({
  searchParams,
}: {
  searchParams: Promise<{ zone?: string; q?: string; featured?: string; sort?: string }>;
}) {
  let zone: string | undefined;
  let q: string | undefined;
  let featured: string | undefined;
  let sort: string | undefined;

  try {
    const resolvedParams = (await searchParams) as
      | { zone?: string; q?: string; featured?: string; sort?: string }
      | undefined;
    zone = resolvedParams?.zone;
    q = resolvedParams?.q;
    featured = resolvedParams?.featured;
    sort = resolvedParams?.sort;
  } catch (err) {
    console.warn('Failed to resolve searchParams:', err);
  }

  let pandals: any[] = [];
  try {
    pandals = await getPandals(zone, q, featured, sort);
  } catch (err) {
    console.error('Error in PandalsPage:', err);
    pandals = getFallbackPandals(zone, q, featured, sort);
  }

  if (!Array.isArray(pandals) || pandals.length === 0) {
    pandals = getFallbackPandals(zone, q, featured, sort);
  }

  // Dynamically group by all zones present in database
  const uniqueZones = Array.from(new Set(pandals.map((p) => p.zone || 'Other Zone'))).sort();
  const grouped = uniqueZones.reduce<Record<string, typeof pandals>>((acc, z) => {
    acc[z] = pandals.filter((p) => (p.zone || 'Other Zone') === z);
    return acc;
  }, {});

  const showGrouped = (!zone || zone === 'All') && sort !== 'name';

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-1">🏛️ Pandal Directory</h1>
            <p className="text-gray-400 text-sm">
              {pandals.length} pandal{pandals.length !== 1 ? 's' : ''} across Kolkata
              {q ? ` matching "${q}"` : ''}
              {featured === 'true' ? ' (Featured only)' : ''}
            </p>
          </div>
          <Link
            href="/map"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 rounded-xl font-semibold text-sm transition-all"
          >
            <Map size={16} /> View on Map
          </Link>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="h-12 bg-white/5 rounded-xl animate-pulse" />}>
          <PandalFilters
            zones={ALL_ZONES}
            currentZone={zone}
            currentQuery={q}
            currentFeatured={featured === 'true'}
            currentSort={sort ?? 'featured'}
          />
        </Suspense>

        {/* Results */}
        {showGrouped ? (
          <div className="space-y-10 mt-8">
            {Object.entries(grouped).map(([zoneName, zonePandals]) => {
              if (!zonePandals.length) return null;
              return (
                <section key={zoneName}>
                  <h2 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                    📍 {zoneName}
                    <span className="text-xs text-gray-500 font-normal">
                      ({zonePandals.length} pandal{zonePandals.length !== 1 ? 's' : ''})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {zonePandals.map((p) => (
                      <PandalCard key={p.id} pandal={p as any} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {pandals.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-500">
                <p className="text-lg mb-2">No pandals found{q ? ` for "${q}"` : ''}.</p>
                <Link href="/pandals" className="text-amber-400 hover:underline text-sm">
                  Clear filters
                </Link>
              </div>
            ) : (
              pandals.map((p) => <PandalCard key={p.id} pandal={p as any} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
