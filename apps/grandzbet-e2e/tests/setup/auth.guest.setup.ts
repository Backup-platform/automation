import { test as setup } from '@playwright/test';
import path from 'path';
import { PopupHandlers } from '../../pages/popupHandlers.po';
import { MenuItems } from '../../pages/menu/menuItems.po';

const guestAuthFile = path.resolve(__dirname, '../../playwright/.auth/noAuthentication.json');

setup('Setup Guest User (No Authentication)', async ({ page }) => {
	const popupHandlers = new PopupHandlers(page);
    const menuItems = new MenuItems(page);
	
	await page.emulateMedia({ reducedMotion: 'reduce' });

	await popupHandlers.handleAllPopups();

	await page.setViewportSize({ width: 1320, height: 720 });
	await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
	
	await menuItems.clickLogo();
	await page.waitForTimeout(1000);
    
	await page.context().storageState({ path: guestAuthFile });
 
});
