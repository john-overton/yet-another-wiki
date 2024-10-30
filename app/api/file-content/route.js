import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    // Resolve the path relative to the app/docs directory
    const fullPath = path.join(process.cwd(), 'app', 'docs', filePath);
    console.log('Reading file from:', fullPath);

    const content = await fs.readFile(fullPath, 'utf8');
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
