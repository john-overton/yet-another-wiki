import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'config', 'settings', 'terms.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    return Response.json(JSON.parse(fileContent));
  } catch (error) {
    console.error('Error reading terms:', error);
    return Response.json({ error: 'Failed to read terms' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { type, content } = await request.json();
    const filePath = path.join(process.cwd(), 'config', 'settings', 'terms.json');
    
    // Read existing content
    const fileContent = await fs.readFile(filePath, 'utf8');
    const currentData = JSON.parse(fileContent);
    
    // Update the appropriate field
    if (type === 'terms') {
      currentData.termsAndConditions = content;
    } else if (type === 'privacy') {
      currentData.privacyPolicy = content;
    }
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error saving terms:', error);
    return Response.json({ error: 'Failed to save terms' }, { status: 500 });
  }
}
