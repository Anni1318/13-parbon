export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import scrapedPandalsFallback from '@/data/scraped-pandals.json';

// In-memory cache to prevent Supabase connection pool queuing delays
let memoryCache: any[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

async function fetchFromPrismaWithTimeout(festivalSlug?: string | null): Promise<any[]> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Prisma query timed out')), 3000)
  );

  const queryPromise = (async () => {
    let festivalId: string | undefined;
    if (festivalSlug) {
      const festival = await prisma.festival.findUnique({ where: { slug: festivalSlug } });
      if (festival) festivalId = festival.id;
    } else {
      const defaultFestival = await prisma.festival.findUnique({ where: { slug: 'durga-puja-2026' } });
      festivalId = defaultFestival?.id;
    }

    return await prisma.pandal.findMany({
      where: {
        ...(festivalId ? { festivalId } : {}),
      },
      include: {
        editions: {
          orderBy: { year: 'desc' },
          take: 1,
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    });
  })();

  return Promise.race([queryPromise, timeoutPromise]);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const festivalSlug = searchParams.get('festival');
    const zone = searchParams.get('zone');
    const featuredOnly = searchParams.get('featured') === 'true';

    let allPandals: any[] = [];

    // Check memory cache first
    const now = Date.now();
    if (memoryCache && now - lastFetchTime < CACHE_TTL_MS) {
      allPandals = memoryCache;
    } else {
      try {
        const dbPandals = await fetchFromPrismaWithTimeout(festivalSlug);
        if (Array.isArray(dbPandals) && dbPandals.length > 0) {
          allPandals = dbPandals;
          memoryCache = dbPandals;
          lastFetchTime = now;
        } else {
          allPandals = scrapedPandalsFallback as any[];
        }
      } catch (err) {
        console.warn('Using local fallback for pandals API:', (err as any)?.message);
        allPandals = memoryCache || (scrapedPandalsFallback as any[]);
      }
    }

    // Apply zone & featured filtering
    let results = allPandals;
    if (zone && zone !== 'All') {
      results = results.filter(
        (p) => p.zone?.toLowerCase().trim() === zone.toLowerCase().trim()
      );
    }
    if (featuredOnly) {
      results = results.filter((p) => p.isFeatured);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching pandals:', error);
    // Even in catastrophic error, never return 500: return fallback
    return NextResponse.json(scrapedPandalsFallback);
  }
}
