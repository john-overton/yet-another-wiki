import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../[...nextauth]/auth';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user) {
      console.log('No session found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('Session user:', {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role
    });

    const userId = parseInt(session.user.id);
    
    if (isNaN(userId)) {
      console.error('Invalid user ID:', session.user.id);
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { 
        id: userId,
      },
      include: {
        secret_question_1: true,
        secret_question_2: true,
        secret_question_3: true,
      }
    });

    if (!user) {
      console.error('User not found for ID:', userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('Found user:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Return user fields including security question IDs but excluding sensitive data
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      auth_type: user.auth_type,
      role: user.role,
      is_active: user.is_active,
      active: user.active,
      is_pro: user.is_pro,  // Fixed: Now using the correct is_pro field
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      // Include security question IDs but not the answers
      secret_question_1_id: user.secret_question_1_id,
      secret_question_2_id: user.secret_question_2_id,
      secret_question_3_id: user.secret_question_3_id,
      // Include question text if questions are set
      secret_question_1: user.secret_question_1?.question,
      secret_question_2: user.secret_question_2?.question,
      secret_question_3: user.secret_question_3?.question
    };

    return NextResponse.json(sanitizedUser);
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { message: 'Error fetching user data', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
