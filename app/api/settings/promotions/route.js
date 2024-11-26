import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

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

// Helper to generate a unique ID
async function generateUniqueId() {
  const promotionsDir = await ensurePromotionsDir();
  const files = await fs.readdir(promotionsDir);
  
  let id;
  do {
    // Generate a random 8-character hex string
    id = crypto.randomBytes(4).toString('hex');
    // Check if this ID already exists
  } while (files.includes(`${id}.json`));
  
  return id;
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
    
    // For new promotions, generate a unique ID
    if (!promotion.id) {
      promotion.id = await generateUniqueId();
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

    return NextResponse.json({ success: true, promotion });
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

export async function PUT(request) {
  try {
    const promotion = await request.json();
    
    if (!promotion.id) {
      return NextResponse.json(
        { error: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    const promotionPath = getPromotionPath(promotion.id);
    
    // For updates that include action field, handle as stat updates
    if (promotion.action) {
      const content = await fs.readFile(promotionPath, 'utf8');
      const existingPromotion = JSON.parse(content);

      // Update stats based on action
      switch (promotion.action) {
        case 'close':
          existingPromotion.clicksClosed = (existingPromotion.clicksClosed || 0) + 1;
          break;
        case 'open':
          existingPromotion.clicksOpened = (existingPromotion.clicksOpened || 0) + 1;
          break;
        case 'register':
          existingPromotion.registrations = (existingPromotion.registrations || 0) + 1;
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          );
      }

      await fs.writeFile(promotionPath, JSON.stringify(existingPromotion, null, 2));
    } else {
      // Regular promotion update
      await fs.writeFile(promotionPath, JSON.stringify(promotion, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to update promotion' },
      { status: 500 }
    );
  }
}
