/**
 * TODO: figure out how to do setup with fixtures
 */
import path from 'path';
import { test as setup } from '@playwright/test';
import { MenuItems } from '../../pages/menu/menuItems.po';
import { LoginPage } from '../../pages/login/loginPage.po';

const authFile = path.resolve(__dirname, '../../playwright/.auth/user.json');

setup('Authenticate for Desktop', async ({ page }) => {
	const menuItems = new MenuItems(page);
	const loginPage = new LoginPage(page);

	await page.setViewportSize({ width: 1320, height: 720 });
	await page.goto(`${process.env.URL}`);
	await menuItems.validateGuestItems();
	await menuItems.clickLogin();
	await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await page.waitForEvent("load");
	await menuItems.validateUserItems();
	// Save the authentication state to a file
	await page.context().storageState({ path: authFile });
});

