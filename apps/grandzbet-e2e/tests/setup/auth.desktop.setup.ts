/**
 * TODO: figure out how to do setup with fixtures
 */
import path from 'path';
import { test as setup } from '@playwright/test';
import { MenuItems } from '../../pages/menu/menuItems.po';
import { LoginPage } from '../../pages/login/loginPage.po';
import { PopupHandlers } from '../../pages/popupHandlers.po';

const authFile = path.resolve(__dirname, '../../playwright/.auth/user.json');

setup('Authenticate for Desktop', async ({ page }) => {
	const menuItems = new MenuItems(page);
	const loginPage = new LoginPage(page);
	const popupHandlers = new PopupHandlers(page);
	
	await page.emulateMedia({ reducedMotion: 'reduce' });

	await popupHandlers.handleAllPopups();

	await page.setViewportSize({ width: 1320, height: 720 });
	await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
	await menuItems.validateGuestItems();
	await menuItems.clickLogin();
	await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await menuItems.validateUserItems();

	await page.context().storageState({ path: authFile });
});

