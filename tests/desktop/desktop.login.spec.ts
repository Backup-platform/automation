import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page }) => {
	await page.goto('https://stage.spacefortuna1.com');
});

test.describe('Login Desktop', () => {
	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Validate Login', async ({ landingPage, logInIFrame, headerMenuDesktop, banner }) => {
		await banner.bannerNewDesign();
		await banner.bannerHiThere();
		await landingPage.clickLoginButton();
		await logInIFrame.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
		await headerMenuDesktop.validateLogoVisible();
		await headerMenuDesktop.validateDesktopHeaderVisible();
	});

	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Validate Wrong Password Login', async ({ landingPage, logInIFrame, banner }) => {
		await banner.bannerNewDesign();
		await banner.bannerHiThere();
		await landingPage.clickLoginButton();
		await logInIFrame.actionLogin(`${process.env.USER}`, 'wrong_password');
		await logInIFrame.validateWrongPasswordUsed();
	});

	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Validate Wrong Username Login', async ({ landingPage, logInIFrame, banner }) => {
		await banner.bannerNewDesign();
		await banner.bannerHiThere();
		await landingPage.clickLoginButton();
		await logInIFrame.actionLogin(`wrong_username`, `${process.env.PASS}`);
		await logInIFrame.validateWrongPasswordUsed();
	});
});
