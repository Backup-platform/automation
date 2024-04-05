/**
 * TODO: figure out how to do setup with fixtures
 */
import { test as setup } from '@playwright/test';
import { LandingPage } from '../pages/landingPage.po';
import { LogInIFrame } from '../pages/logInIFrame.po';
import { HeaderMenuDesktop } from '../pages/headerMenuDesktop.po';

const authFile = 'playwright/.auth/user.json';

setup('Authenticate for Desktop', async ({ page }) => {
	await page.setViewportSize({ width: 1320, height: 720 });
	
	const landingPage = new LandingPage(page);
	const logInIFrame = new LogInIFrame(page);
	const headerMenuDesktop = new HeaderMenuDesktop(page);

	await page.goto(`${process.env.URL}`);
	await landingPage.clickLoginButton();
	await logInIFrame.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await page.waitForURL(process.env.URL!, {waitUntil: "domcontentloaded"});
	await headerMenuDesktop.validateLogoVisible();
	await headerMenuDesktop.validateGamesButtonVisible();
	await headerMenuDesktop.validateMyProfileVisible(); //expect(page.locator('#desktop-profile-icon')).toBeVisible({timeout: 20000});
	await landingPage.clickAcceptCookiesButton();

	await page.context().storageState({ path: authFile });
});

