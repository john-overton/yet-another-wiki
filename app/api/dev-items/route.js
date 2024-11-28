import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession, authOptions } from 'next-auth';

const prisma = new PrismaClient();

// GET /api/dev-items
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const sort = searchParams.get('sort') || 'votes';
  const type = searchParams.get('type') || 'all';

  const skip = (page - 1) * limit;

  try {
    // Build where clause
    let where = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { details: { contains: search } },
      ];
    }
    if (status === 'active') {
      where.status = { not: 'done' };
    } else if (status !== 'all') {
      where.status = status;
    }
    if (type !== 'all') {
      where.type = type;
    }

    // Get total count for pagination
    const total = await prisma.devItem.count({ where });
    const pages = Math.ceil(total / limit);

    // Get items with proper sorting
    const items = await prisma.devItem.findMany({
      where,
      include: {
        _count: {
          select: { votes: true, comments: true }
        },
        votes: true,
      },
      orderBy: sort === 'votes' 
        ? { votes: { _count: 'desc' } }
        : sort === 'views'
        ? { views: 'desc' }
        : { dateCreated: 'desc' },
      skip,
      take: limit,
    });

    // Increment view count for each item
    await Promise.all(
      items.map(item =>
        prisma.devItem.update({
          where: { id: item.id },
          data: { views: item.views + 1 },
        })
      )
    );

    return NextResponse.json({
      items,
      pagination: { page, pages, total }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST /api/dev-items
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { title, details, type } = data;

    if (!title || !details || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const item = await prisma.devItem.create({
      data: {
        title,
        details,
        type,
        status: 'new',
        views: 0,
      },
      include: {
        _count: {
          select: { votes: true, comments: true }
        },
        votes: true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

// PUT /api/dev-items
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

    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, status, adminNotes } = data;

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }

    const updateData = {
      ...(status && { status }),
      ...(adminNotes && { adminNotes }),
      ...(status === 'done' && { dateCompleted: new Date() }),
    };

    const item = await prisma.devItem.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { votes: true, comments: true }
        },
        votes: true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
