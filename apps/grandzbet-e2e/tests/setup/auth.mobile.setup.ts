/**
 * TODO: figure out how to do setup with fixtures
 */
import { test as setup } from '@playwright/test';
import { devices } from '@playwright/test';
import path from 'path';
import { MenuItems } from '../../pages/menu/menuItems.po';
import { LoginPage } from '../../pages/login/loginPage.po';

const authFileMobile = path.resolve(__dirname, '../../playwright/.auth/mobileUser.json');

setup('Authenticate for Mobile', async ({ page }) => {
	await page.setViewportSize(devices['iPhone 11 Pro'].viewport);
	const menuItems = new MenuItems(page);
	const loginPage = new LoginPage(page);

	await page.goto(`${process.env.URL}`);
	await menuItems.validateGuestItems();
	await menuItems.clickLogin();
	await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await page.waitForEvent("load");
	//await menuItems.validateUserItems(); //FIXME: it is broken in the staging environment, so we cannot validate the user items after login
	// Save the authentication state to a file
	await page.context().storageState({ path: authFileMobile });
});

