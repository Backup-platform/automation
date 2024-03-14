import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page }) => {
	await page.goto('https://stage.spacefortuna1.com');
});

test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
test('Validate Login', async ({ landingPage, logInIFrame, footerMenuMobile, banner }) => {
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
	await landingPage.clickLoginButton();
	await logInIFrame.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await footerMenuMobile.validateLogoVisible();
	await footerMenuMobile.validateBottomNavVisible();
});

test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
test('Validate Wrong Password Login', async ({ landingPage, logInIFrame, banner }) => {
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
	await landingPage.clickLoginButton();
	await logInIFrame.actionLogin(`${process.env.USER}`,'wrong_password');
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