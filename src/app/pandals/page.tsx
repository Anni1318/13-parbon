export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import PandalCard from '@/components/ui/PandalCard';
import PandalFilters from '@/components/pandals/PandalFilters';
import Link from 'next/link';
import { Map } from 'lucide-react';
import { searchGooglePlacesForPandals } from '@/lib/googlePlaces';

const ZONES = ['All', 'North Kolkata', 'Central', 'South Kolkata', 'Salt Lake/East'];

async function getPandals(zone?: string, q?: string) {
  const defaultFestival = await prisma.festival.findUnique({
    where: { slug: 'durga-puja-2026' },
  });
  if (!defaultFestival) return [];

  const all = await prisma.pandal.findMany({
    where: {
      festivalId: defaultFestival.id,
      ...(zone && zone !== 'All' ? { zone } : {}),
    },
    include: { editions: { orderBy: { year: 'desc' }, take: 1 } },
    orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
  });

  if (q) {
    const lower = q.toLowerCase();
    const filtered = all.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) || p.area.toLowerCase().includes(lower)
    );

    if (filtered.length === 0) {
      const googleResults = await searchGooglePlacesForPandals(q);
      return googleResults;
    }

    return filtered;
  }
  return all;
}

export default async function PandalsPage({
  searchParams,
}: {
  searchParams: Promise<{ zone?: string; q?: string }>;
}) {
  const { zone, q } = await searchParams;
  const pandals: any[] = await getPandals(zone, q);

  const grouped = ZONES.slice(1).reduce<Record<string, typeof pandals>>((acc, z) => {
    acc[z] = pandals.filter((p) => p.zone === z);
    return acc;
  }, {});

  const showGrouped = !zone || zone === 'All';

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
        <PandalFilters zones={ZONES} currentZone={zone} currentQuery={q} />

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
