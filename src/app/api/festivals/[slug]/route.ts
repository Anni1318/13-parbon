import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const festival = await prisma.festival.findUnique({
      where: { slug },
      include: {
        calendarDays: { orderBy: { orderIndex: 'asc' } },
      },
    });
    if (!festival) {
      return NextResponse.json({ error: 'Festival not found' }, { status: 404 });
    }
    return NextResponse.json(festival);
  } catch (error) {
    console.error('Error fetching festival:', error);
    return NextResponse.json({ error: 'Failed to fetch festival' }, { status: 500 });
  }
}
