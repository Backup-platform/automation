/**
 * TODO: figure out how to do setup with fixtures
 */
import test, { expect } from '../pages/utils/base.po';
import { test as setup } from '@playwright/test';
import { devices } from '@playwright/test';
import { LandingPage } from '../pages/landingPage.po';
import { LogInIFrame } from '../pages/logInIFrame.po';

const authFileMobile = 'playwright/.auth/mobileUser.json';

setup('Authenticate for Mobile', async ({ page }) => {
	await page.setViewportSize(devices['Pixel 5'].viewport);

	const landingPage = new LandingPage(page);
	const logInIFrame = new LogInIFrame(page);

	await page.goto(`${process.env.URL}`);
	await landingPage.clickLoginButton();
	await logInIFrame.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await page.waitForURL(`${process.env.URL}`);
	await expect(page.locator('img[src*="Mobile_Bottom_Nav_My_Bonuses_icon_f21202f625.svg"]')).toBeVisible({ timeout: 20000 });
	await landingPage.clickAcceptCookiesButton();

	await page.context().storageState({ path: authFileMobile });
});

