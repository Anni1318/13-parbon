export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const festivals = await prisma.festival.findMany({
      include: {
        calendarDays: { orderBy: { orderIndex: 'asc' } },
      },
      orderBy: { startDate: 'asc' },
    });
    return NextResponse.json(festivals);
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return NextResponse.json({ error: 'Failed to fetch festivals' }, { status: 500 });
  }
}

