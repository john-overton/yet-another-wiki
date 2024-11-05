const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

async function generatePrismaClient() {
    console.log('Generating Prisma client...');
    try {
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log('✓ Prisma client generated');
        
        // Dynamic import of PrismaClient after generation
        const { PrismaClient } = require('@prisma/client');
        return new PrismaClient();
    } catch (error) {
        console.error('Error generating Prisma client:', error);
        throw error;
    }
}

async function cleanupTestUser(prisma) {
    try {
        await prisma.user.delete({
            where: {
                email: 'test@example.com'
            }
        });
        console.log('✓ Test user removed');
    } catch (error) {
        if (error.code === 'P2025') {
            console.log('✓ Test user already removed');
        } else {
            console.error('Error removing test user:', error);
        }
    }
}

async function cleanupNginxConfig() {
    const blockedIpsPath = path.join(__dirname, '../nginx/conf.d/blocked_ips.conf');
    
    try {
        // Reset blocked IPs file to initial state
        await fs.writeFile(blockedIpsPath, '# Blocked IPs\n');
        console.log('✓ Blocked IPs file reset');
    } catch (error) {
        console.error('Error resetting blocked IPs file:', error);
    }
}

async function cleanupFiles() {
    // Files to clean up
    const files = [
        path.join(__dirname, '../db/yetanotherwiki.db'),
        path.join(__dirname, '../.env')
    ];

    for (const file of files) {
        try {
            await fs.unlink(file);
            console.log(`✓ Removed ${path.basename(file)}`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`✓ ${path.basename(file)} already removed`);
            } else {
                console.error(`Error removing ${path.basename(file)}:`, error);
            }
        }
    }
}

async function cleanupTestEnvironment() {
    console.log('🧹 Cleaning up test environment...\n');

    try {
        // Clean up database and env files first
        await cleanupFiles();

        // Generate Prisma client and get instance
        const prisma = await generatePrismaClient();
        
        try {
            // Connect to database (this might fail if db is already removed)
            await prisma.$connect();

            // Cleanup test data
            await cleanupTestUser(prisma);
        } catch (error) {
            console.log('Note: Database operations skipped (database might be already removed)');
        } finally {
            await prisma.$disconnect();
        }

        // Cleanup Nginx config
        await cleanupNginxConfig();

        console.log('\n✨ Test environment cleanup complete!');
        console.log('\nYou can now run setup-test-env.js to create a fresh test environment.');

    } catch (error) {
        console.error('\n❌ Test environment cleanup failed:', error);
        process.exit(1);
    }
}

// Run cleanup
cleanupTestEnvironment().catch(console.error);