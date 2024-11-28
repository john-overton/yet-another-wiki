import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession, authOptions } from 'next-auth';

const prisma = new PrismaClient();

// POST /api/dev-items/vote
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user from database using session email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const data = await request.json();
  const { itemId } = data;

  if (!itemId) {
    return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
  }

  try {
    // Check if user has already voted
    const existingVote = await prisma.devItemVote.findFirst({
      where: {
        devItemId: itemId,
        userId: user.id,
      },
    });

    if (existingVote) {
      // Remove vote if it exists
      await prisma.devItemVote.delete({
        where: {
          id: existingVote.id,
        },
      });
      return NextResponse.json({ message: 'Vote removed' });
    }

    // Create new vote
    const vote = await prisma.devItemVote.create({
      data: {
        devItemId: itemId,
        userId: user.id,
      },
    });

    return NextResponse.json(vote);
  } catch (error) {
    console.error('Error handling vote:', error);
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
  }
}

// GET /api/dev-items/vote
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user from database using session email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const itemId = parseInt(searchParams.get('itemId'));

  if (!itemId) {
    return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
  }

  try {
    const vote = await prisma.devItemVote.findFirst({
      where: {
        devItemId: itemId,
        userId: user.id,
      },
    });

    return NextResponse.json({ hasVoted: !!vote });
  } catch (error) {
    console.error('Error checking vote:', error);
    return NextResponse.json({ error: 'Failed to check vote status' }, { status: 500 });
  }
}
