import test, { expect } from '../../pages/utils/base.po';
import path from 'path';

test.beforeEach(async ({ page, banner }) => {
	await page.goto(`${process.env.URL}`);
	await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
});

test.describe.skip('screenshot tests', () => {
	test.use({ storageState: path.resolve(__dirname, '../../playwright/.auth/noAuthentication.json') });
	test('compare landing page', async ({ page, headerMenuDesktop }) => {
		await headerMenuDesktop.validateLoginButtonVisible();
		await expect(page).toHaveScreenshot('landingPage.png', { maxDiffPixelRatio: 0.85 });
	});

	test('Validate Login', async ({ loginPage, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoginButton();
		await expect(loginPage.wholeLoginWindow()).toHaveScreenshot('logingPage.png', { maxDiffPixels: 500 });
	});

});