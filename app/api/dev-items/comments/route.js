import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession, authOptions } from 'next-auth';

const prisma = new PrismaClient();

// GET /api/dev-items/comments
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const itemId = parseInt(searchParams.get('itemId'));

  if (!itemId) {
    return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
  }

  try {
    const comments = await prisma.devItemComment.findMany({
      where: {
        devItemId: itemId,
        parentId: null, // Only get top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            is_pro: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                is_pro: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/dev-items/comments
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user from database using session email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();
    const { itemId, content, parentId } = data;

    if (!itemId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await prisma.devItemComment.create({
      data: {
        devItemId: itemId,
        userId: user.id,
        content,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            is_pro: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

// PUT /api/dev-items/comments
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user from database using session email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();
    const { id, content } = data;

    if (!id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the comment belongs to the user
    const comment = await prisma.devItemComment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!comment || comment.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedComment = await prisma.devItemComment.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            is_pro: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

// DELETE /api/dev-items/comments
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user from database using session email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'Missing comment ID' }, { status: 400 });
    }

    // Verify the comment belongs to the user or user is admin
    const comment = await prisma.devItemComment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!comment || (comment.userId !== user.id && user.role !== 'Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.devItemComment.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
