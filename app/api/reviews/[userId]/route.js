import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const review = await prisma.userReview.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            is_pro: true,  // Added is_pro field
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(null);
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error fetching user review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user review' },
      { status: 500 }
    );
  }
}
