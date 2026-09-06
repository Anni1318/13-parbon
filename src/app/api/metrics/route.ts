export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const metric = await prisma.siteMetric.findUnique({ where: { id: 1 } });
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeSessions = await prisma.activeSession.count({
      where: { lastHeartbeat: { gte: fiveMinutesAgo } },
    });
    return NextResponse.json({
      totalViews: metric?.totalViews ?? 0,
      activeSessions,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = body.sessionId as string | undefined;

    await prisma.siteMetric.upsert({
      where: { id: 1 },
      update: { totalViews: { increment: 1 } },
      create: { id: 1, totalViews: 1 },
    });

    if (sessionId) {
      await prisma.activeSession.upsert({
        where: { sessionId },
        update: { lastHeartbeat: new Date() },
        create: { sessionId, lastHeartbeat: new Date() },
      });
      // Clean up stale sessions older than 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      await prisma.activeSession.deleteMany({
        where: { lastHeartbeat: { lt: tenMinutesAgo } },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error updating metrics:', error);
    return NextResponse.json({ error: 'Failed to update metrics' }, { status: 500 });
  }
}

