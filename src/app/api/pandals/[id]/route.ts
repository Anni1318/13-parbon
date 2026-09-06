export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pandal = await prisma.pandal.findUnique({
      where: { id },
      include: {
        editions: { orderBy: { year: 'desc' } },
        festival: true,
      },
    });
    if (!pandal) {
      return NextResponse.json({ error: 'Pandal not found' }, { status: 404 });
    }
    return NextResponse.json(pandal);
  } catch (error) {
    console.error('Error fetching pandal:', error);
    return NextResponse.json({ error: 'Failed to fetch pandal' }, { status: 500 });
  }
}
