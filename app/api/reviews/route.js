import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all reviews first to calculate total count and average
    const allReviews = await prisma.userReview.findMany({
      select: {
        rating: true,
      },
    });

    const averageRating = allReviews.length > 0
      ? allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length
      : 0;

    // Get total count of reviews
    const totalCount = allReviews.length;

    // Get 5 random reviews for display
    const randomReviews = await prisma.$queryRaw`
      SELECT 
        "UserReview".*,
        "User"."name",
        "User"."avatar",
        "User"."is_pro"
      FROM "UserReview"
      LEFT JOIN "User" ON "UserReview"."userId" = "User"."id"
      ORDER BY RANDOM()
      LIMIT 5
    `;

    // Format the reviews to match the expected structure
    const formattedReviews = randomReviews.map(review => ({
      id: review.id,
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      userId: review.userId,
      user: {
        name: review.name,
        avatar: review.avatar,
        is_pro: review.is_pro
      }
    }));

    return NextResponse.json({
      reviews: formattedReviews,
      averageRating,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, rating, review } = await request.json();

    // Validate input
    if (!userId || !rating || !review) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (review.length > 1000) {
      return NextResponse.json(
        { error: 'Review must be 1000 characters or less' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Ensure userId is an integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = await prisma.userReview.create({
      data: {
        userId: userIdInt,
        rating: parseInt(rating),
        review,
      },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { reviewId, rating, review } = await request.json();

    // Validate input
    if (!reviewId || !rating || !review) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (review.length > 1000) {
      return NextResponse.json(
        { error: 'Review must be 1000 characters or less' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Ensure reviewId is an integer
    const reviewIdInt = parseInt(reviewId);
    if (isNaN(reviewIdInt)) {
      return NextResponse.json(
        { error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    // Update review
    const updatedReview = await prisma.userReview.update({
      where: {
        id: reviewIdInt,
      },
      data: {
        rating: parseInt(rating),
        review,
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
