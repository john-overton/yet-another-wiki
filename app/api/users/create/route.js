import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const userData = await request.json();

    // First check if any users exist in the database
    const existingUsers = await prisma.user.findFirst();

    // Only check license if users already exist (not first-time setup)
    if (existingUsers) {
      // Check license type
      const licensePath = join(process.cwd(), 'config/settings/licensing.json');
      const licenseContent = await fs.readFile(licensePath, 'utf8');
      const licenseData = JSON.parse(licenseContent);

      // Only allow additional user creation with pro license
      if (licenseData.licenseType !== 'pro') {
        return new Response(JSON.stringify({ 
          error: 'Additional user creation is only available with a pro license' 
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return new Response(JSON.stringify({ 
        error: 'A user with this email already exists' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        is_active: userData.is_active,
        auth_type: userData.auth_type,
        avatar: userData.avatar,
        voting_rights: userData.voting_rights,
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return new Response(JSON.stringify(userWithoutPassword), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle known Prisma errors
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ 
        error: 'A user with this email already exists' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred while creating the user' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
