/**
 * TODO: figure out how to do setup with fixtures
 */
import test, { expect } from '../pages/utils/base.po';
import { test as setup } from '@playwright/test';
import { devices } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage/landingPage.po';
import { Banner } from '../pages/banner.po';
import { HeaderMenuDesktop } from '../pages/headerMenuDesktop.po';
import { LoginPage } from '../pages/loginPage.po';

const authFileMobile = 'playwright/.auth/mobileUser.json';

setup('Authenticate for Mobile', async ({ page }) => {
	await page.setViewportSize(devices['iPhone 11 Pro'].viewport);

	const loginPage = new LoginPage(page);
	const headerMenuDesktop = new HeaderMenuDesktop(page);
	const banner = new Banner(page);

	await banner.clickEscapeInOptIn();
	await banner.randomClickSkipSomething();

	await page.goto(`${process.env.URL}`,{ waitUntil: 'domcontentloaded' });
	await headerMenuDesktop.clickLoginButton();
	await page.waitForTimeout(10000);
	await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await page.waitForURL(`${process.env.URL}`, {waitUntil: 'domcontentloaded'});
	await expect(page.locator('img[src*="Mobile_Bottom_Nav_My_Bonuses_icon_f21202f625.svg"]')).toBeVisible({ timeout: 20000 });
	//TODO: FIX ME await landingPage.clickAcceptCookiesButton();

	await page.context().storageState({ path: authFileMobile });
});

