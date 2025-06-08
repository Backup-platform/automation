import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';

const guestAuthFile = path.resolve(__dirname, '../playwright/.auth/noAuthentication.json');

setup('Setup Guest User (No Authentication)', async () => {
    // Create completely empty authentication state
    const emptyState = {};
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(guestAuthFile), { recursive: true });
    
    // Write empty state directly to file
    await fs.writeFile(guestAuthFile, JSON.stringify(emptyState, null, 2));
});
