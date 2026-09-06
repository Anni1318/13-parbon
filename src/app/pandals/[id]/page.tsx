export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MapPin, Star, ArrowLeft, Clock, Palette, User } from 'lucide-react';
import LeafletMiniMap from '@/components/map/LeafletMiniMapWrapper';

export default async function PandalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let id: string | undefined;
  try {
    const resolved = (await params) as { id?: string } | undefined;
    id = resolved?.id;
  } catch (err) {
    console.warn('Failed to resolve params:', err);
  }

  if (!id) notFound();

  let pandal: any = null;
  try {
    pandal = await prisma.pandal.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      },
      include: {
        editions: { orderBy: { year: 'desc' } },
        festival: true,
      },
    });
  } catch (err) {
    console.error('Error fetching pandal details:', err);
  }

  if (!pandal) notFound();

  const latestEdition = pandal.editions[0];
  let awards: string[] = [];
  try {
    awards = latestEdition?.awards ? JSON.parse(latestEdition.awards) : [];
  } catch {
    awards = [];
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/pandals"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Pandals
        </Link>

        {/* Hero */}
        <div className="relative rounded-2xl bg-gradient-to-br from-amber-900/30 to-[#1F2937] border border-amber-500/20 p-8 mb-6 overflow-hidden">
          <div className="absolute top-4 right-4 text-7xl opacity-10 pointer-events-none">🏛️</div>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-3">
                {pandal.isFeatured && (
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                )}
                <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                  {pandal.zone}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    pandal.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {pandal.verificationStatus === 'VERIFIED' ? '✓ Verified' : '⏳ Pending'}
                </span>
                <span className="text-xs text-amber-400/60 bg-amber-500/5 px-2 py-0.5 rounded-full">
                  {pandal.festival.name}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                {pandal.name}
              </h1>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                <MapPin size={14} />
                <span>
                  {pandal.address}, {pandal.city}
                  {pandal.pincode ? ` — ${pandal.pincode}` : ''}
                </span>
              </div>
            </div>
          </div>

          {awards.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {awards.map((a, i) => (
                <span
                  key={i}
                  className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full"
                >
                  🏆 {a}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Theme info */}
        {latestEdition && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {latestEdition.theme && latestEdition.theme.toLowerCase() !== 'traditional durga puja' && (
              <div className="bg-[#1F2937] border border-amber-500/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <Palette size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {latestEdition.year} Theme
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{latestEdition.theme}</h3>
                {latestEdition.themeDescription && (
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {latestEdition.themeDescription}
                  </p>
                )}
              </div>
            )}
            {(latestEdition.idolArtist || latestEdition.pandalArtist || latestEdition.pujaTimings) && (
              <div className="bg-[#1F2937] border border-amber-500/10 rounded-2xl p-5 space-y-3">
              {latestEdition.idolArtist && (
                <div className="flex items-center gap-2">
                  <User size={14} className="text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Idol Artist
                    </p>
                    <p className="text-white font-semibold text-sm">{latestEdition.idolArtist}</p>
                  </div>
                </div>
              )}
              {latestEdition.pandalArtist && (
                <div className="flex items-center gap-2">
                  <Palette size={14} className="text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Pandal Artist
                    </p>
                    <p className="text-white font-semibold text-sm">
                      {latestEdition.pandalArtist}
                    </p>
                  </div>
                </div>
              )}
              {latestEdition.pujaTimings && (
                <div className="flex items-start gap-2">
                  <Clock size={14} className="text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Puja Timings
                    </p>
                    <p className="text-white text-xs leading-relaxed mt-0.5">
                      {latestEdition.pujaTimings}
                    </p>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* Mini Map */}
        <div
          className="mb-6 rounded-2xl overflow-hidden border border-amber-500/10"
          style={{ height: 260 }}
        >
          <LeafletMiniMap lat={pandal.latitude} lng={pandal.longitude} name={pandal.name} />
        </div>

        {/* Edition History */}
        {pandal.editions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">📅 Edition History</h2>
            <div className="space-y-3">
              {pandal.editions.map((edition: any) => {
                let edAwards: string[] = [];
                try {
                  edAwards = edition.awards ? JSON.parse(edition.awards) : [];
                } catch {
                  edAwards = [];
                }
                return (
                  <details
                    key={edition.id}
                    className="bg-[#1F2937] border border-white/5 rounded-xl overflow-hidden group"
                  >
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-amber-400 text-lg">{edition.year}</span>
                        {edition.theme && edition.theme.toLowerCase() !== 'traditional durga puja' && (
                          <span className="text-white text-sm">{edition.theme}</span>
                        )}
                      </div>
                      {edAwards.length > 0 && (
                        <span className="text-xs text-yellow-400">
                          🏆 {edAwards.length} award{edAwards.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </summary>
                    <div className="px-5 pb-4 border-t border-white/5 space-y-2 pt-3">
                      {edition.themeDescription && (
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {edition.themeDescription}
                        </p>
                      )}
                      {edition.idolArtist && (
                        <p className="text-xs text-gray-500">
                          Idol Artist:{' '}
                          <span className="text-white">{edition.idolArtist}</span>
                        </p>
                      )}
                      {edition.pandalArtist && (
                        <p className="text-xs text-gray-500">
                          Pandal Artist:{' '}
                          <span className="text-white">{edition.pandalArtist}</span>
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {edAwards.map((a, i) => (
                          <span
                            key={i}
                            className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full"
                          >
                            🏆 {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
