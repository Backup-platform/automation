/**
 * TODO: figure out how to do setup with fixtures
 */
import path from 'path';
import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.po';
import { HeaderMenuDesktop } from '../pages/headerMenuDesktop.po';
import { Banner } from '../pages/banner.po';

const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');

setup('Authenticate for Desktop', async ({ page }) => {
	await page.setViewportSize({ width: 1320, height: 720 });
	
	const logInIFrame = new LoginPage(page);
	const headerMenuDesktop = new HeaderMenuDesktop(page);
	const banner = new Banner(page);

	await banner.escapeOptIn();
	await banner.randomClickSkipSomething();
	await banner.acceptCookies();
    await banner.bannerNewDesign();
    await banner.bannerHiThere();
    await banner.acceptTermsAndConditions();
	await page.goto(`${process.env.URL}`);
	await headerMenuDesktop.clickLoginButton();
	await logInIFrame.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await page.waitForEvent("load");
	await headerMenuDesktop.validateSFLogoVisible();
	//TODO: FIX ME await headerMenuDesktop.validateGamesButtonVisible();
	//TODO: FIX ME await headerMenuDesktop.validateMyProfileVisible(); //expect(page.locator('#desktop-profile-icon')).toBeVisible({timeout: 20000});
	//TODO: FIX ME await landingPage.clickAcceptCookiesButton();

	await page.context().storageState({ path: authFile });
});

