import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Helper function to ensure promotions directory exists
async function ensurePromotionsDir() {
  const promotionsDir = path.join(process.cwd(), 'config/settings/promotions');
  try {
    await fs.access(promotionsDir);
  } catch {
    await fs.mkdir(promotionsDir, { recursive: true });
  }
  return promotionsDir;
}

// Helper to get promotion file path
function getPromotionPath(id) {
  return path.join(process.cwd(), 'config/settings/promotions', `${id}.json`);
}

export async function GET() {
  try {
    const promotionsDir = await ensurePromotionsDir();
    const files = await fs.readdir(promotionsDir);
    const promotions = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const content = await fs.readFile(path.join(promotionsDir, file), 'utf8');
      promotions.push(JSON.parse(content));
    }

    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error reading promotions:', error);
    return NextResponse.json(
      { error: 'Failed to read promotions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const promotion = await request.json();
    
    if (!promotion.id) {
      return NextResponse.json(
        { error: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['type', 'startDate', 'endDate', 'description', 'details'];
    for (const field of requiredFields) {
      if (!promotion[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Additional validation for giveaways
    if (promotion.type === 'giveaway' && !promotion.maxGiveaways) {
      return NextResponse.json(
        { error: 'maxGiveaways is required for giveaway promotions' },
        { status: 400 }
      );
    }

    // Ensure promotions directory exists
    await ensurePromotionsDir();

    // Save the promotion
    const promotionPath = getPromotionPath(promotion.id);
    await fs.writeFile(promotionPath, JSON.stringify(promotion, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving promotion:', error);
    return NextResponse.json(
      { error: 'Failed to save promotion' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    const promotionPath = getPromotionPath(id);
    await fs.unlink(promotionPath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { error: 'Failed to delete promotion' },
      { status: 500 }
    );
  }
}

// API route to track promotion interactions
export async function PUT(request) {
  try {
    const { id, action } = await request.json();
    
    if (!id || !action) {
      return NextResponse.json(
        { error: 'Promotion ID and action are required' },
        { status: 400 }
      );
    }

    const promotionPath = getPromotionPath(id);
    const content = await fs.readFile(promotionPath, 'utf8');
    const promotion = JSON.parse(content);

    // Update stats based on action
    switch (action) {
      case 'close':
        promotion.clicksClosed = (promotion.clicksClosed || 0) + 1;
        break;
      case 'open':
        promotion.clicksOpened = (promotion.clicksOpened || 0) + 1;
        break;
      case 'register':
        promotion.registrations = (promotion.registrations || 0) + 1;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await fs.writeFile(promotionPath, JSON.stringify(promotion, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating promotion stats:', error);
    return NextResponse.json(
      { error: 'Failed to update promotion stats' },
      { status: 500 }
    );
  }
}
