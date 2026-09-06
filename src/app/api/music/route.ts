import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const festivalSlug = searchParams.get('festival');

    let festivalId: string | undefined;
    if (festivalSlug) {
      const festival = await prisma.festival.findUnique({ where: { slug: festivalSlug } });
      festivalId = festival?.id;
    }

    const tracks = await prisma.musicTrack.findMany({
      where: festivalId
        ? { festivals: { some: { festivalId } } }
        : {},
      orderBy: { type: 'asc' },
    });
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error fetching music tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
