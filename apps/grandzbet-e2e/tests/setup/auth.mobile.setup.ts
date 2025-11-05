/**
 * TODO: figure out how to do setup with fixtures
 */
import { devices } from '@playwright/test';
import path from 'path';
import { test as setup } from '@playwright/test';
import { MenuItems } from '../../pages/menu/menuItems.po';
import { LoginPage } from '../../pages/login/loginPage.po';
import { PopupHandlers } from '../../pages/popupHandlers.po';

const authFileMobile = path.resolve(__dirname, '../../playwright/.auth/mobileUser.json');

setup('Authenticate for Mobile', async ({ page }) => {
	const menuItems = new MenuItems(page);
	const loginPage = new LoginPage(page);
	const popupHandlers = new PopupHandlers(page);
	
	await page.emulateMedia({ reducedMotion: 'reduce' });
	
	await popupHandlers.handleAllPopups();

	await page.setViewportSize(devices['iPhone 11 Pro'].viewport);
	await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
	await menuItems.validateGuestItems();
	await menuItems.clickLogin();
	await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	
	await page.waitForTimeout(3000);
	
	await page.context().storageState({ path: authFileMobile });
});

