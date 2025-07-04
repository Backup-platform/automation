import { test as setup } from '@playwright/test';
import path from 'path';

const guestAuthFile = path.resolve(__dirname, '../../playwright/.auth/noAuthentication.json');

setup('Setup Guest User (No Authentication)', async ({ page, context }) => {
    // Visit the site without logging in to establish a guest session
    await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await context.storageState({ path: guestAuthFile });
});
