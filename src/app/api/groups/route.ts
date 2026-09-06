import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, memberName, color } = await request.json();

    if (!name || !memberName) {
      return NextResponse.json({ error: 'Group name and creator name are required' }, { status: 400 });
    }

    const group = await prisma.group.create({
      data: {
        name,
        members: {
          create: {
            name: memberName,
            color: color || '#F59E0B',
          }
        }
      },
      include: {
        members: true,
      }
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('Failed to create group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}
