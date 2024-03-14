import test, { expect } from '../pages/utils/base.po';

test.beforeEach(async ({ page }) => {
	await page.goto('https://stage.spacefortuna1.com');
});

test.describe.skip('screenshot tests', () => {
	test('compare landing page', async ({ page, landingPage }) => {
		await landingPage.isLoginButtonVisible();
		await expect(page).toHaveScreenshot('landingPage.png', { maxDiffPixelRatio: 0.85 });
	});

	test('Validate Login', async ({ landingPage, logInIFrame, page }) => {
		await landingPage.isLoginButtonVisible();
		await landingPage.clickLoginButton();
		await expect(logInIFrame.wholeLoginWindow()).toHaveScreenshot('logingPage.png', { maxDiffPixels: 500 });
	});

});