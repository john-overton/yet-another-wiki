import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to check if there's an active giveaway
async function checkActiveGiveaway() {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    const promotionsDir = path.join(process.cwd(), 'config/settings/promotions');
    
    // Create directory if it doesn't exist
    try {
      await fs.access(promotionsDir);
    } catch {
      await fs.mkdir(promotionsDir, { recursive: true });
    }

    // Read all promotion files
    const files = await fs.readdir(promotionsDir);
    const now = new Date();

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const content = await fs.readFile(path.join(promotionsDir, file), 'utf8');
      const promotion = JSON.parse(content);
      
      if (promotion.type === 'giveaway' && 
          new Date(promotion.startDate) <= now && 
          new Date(promotion.endDate) >= now &&
          promotion.remainingGiveaways > 0) {
        return promotion;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error checking for active giveaway:', error);
    return null;
  }
}

// Function to update giveaway count
async function updateGiveawayCount(promotionId) {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    const promotionPath = path.join(process.cwd(), 'config/settings/promotions', `${promotionId}.json`);
    
    const content = await fs.readFile(promotionPath, 'utf8');
    const promotion = JSON.parse(content);
    
    if (promotion.remainingGiveaways > 0) {
      promotion.remainingGiveaways--;
      promotion.usedGiveaways = (promotion.usedGiveaways || 0) + 1;
      await fs.writeFile(promotionPath, JSON.stringify(promotion, null, 2));
    }
  } catch (error) {
    console.error('Error updating giveaway count:', error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check for active giveaway
    const activeGiveaway = await checkActiveGiveaway();
    const licenseType = activeGiveaway ? 'pro' : 'personal';

    // Generate license using the external API
    const response = await fetch('https://lic.yetanotherwiki.com/api/license/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        licenseType
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate license');
    }

    const data = await response.json();

    // Update user's is_pro status if it's a pro license
    if (licenseType === 'pro') {
      await prisma.user.update({
        where: { email },
        data: { is_pro: true }
      });
    }

    // If this was a giveaway, update the count
    if (activeGiveaway) {
      await updateGiveawayCount(activeGiveaway.id);
    }

    return NextResponse.json({
      licenseKey: data.licenseKey,
      licenseType
    });

  } catch (error) {
    console.error('Error generating license:', error);
    return NextResponse.json(
      { error: 'Failed to generate license' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Look up licenses using the external API
    const response = await fetch(`https://lic.yetanotherwiki.com/api/license/lookup/${encodeURIComponent(email)}`);

    if (!response.ok) {
      throw new Error('Failed to look up licenses');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error looking up licenses:', error);
    return NextResponse.json(
      { error: 'Failed to look up licenses' },
      { status: 500 }
    );
  }
}
