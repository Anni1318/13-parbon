import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const festivalSlug = searchParams.get('festival');
    const zone = searchParams.get('zone');
    const featuredOnly = searchParams.get('featured') === 'true';

    let festivalId: string | undefined;
    if (festivalSlug) {
      const festival = await prisma.festival.findUnique({ where: { slug: festivalSlug } });
      if (!festival) return NextResponse.json([]);
      festivalId = festival.id;
    } else {
      const defaultFestival = await prisma.festival.findUnique({ where: { slug: 'durga-puja-2026' } });
      festivalId = defaultFestival?.id;
    }

    const pandals = await prisma.pandal.findMany({
      where: {
        ...(festivalId ? { festivalId } : {}),
        ...(zone && zone !== 'All' ? { zone } : {}),
        ...(featuredOnly ? { isFeatured: true } : {}),
      },
      include: {
        editions: {
          orderBy: { year: 'desc' },
          take: 1,
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    });

    return NextResponse.json(pandals);
  } catch (error) {
    console.error('Error fetching pandals:', error);
    return NextResponse.json({ error: 'Failed to fetch pandals' }, { status: 500 });
  }
}
