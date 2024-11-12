import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page, banner }) => {
	await page.goto(`${process.env.URL}`);
	await banner.randomClickEscape();
	await banner.randomClickSkipSomething();
});

test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
test('Validate Login', async ({ landingPage, logInIFrame, footerMenuMobile }) => {
	await landingPage.clickLoginButton();
	await logInIFrame.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await footerMenuMobile.validateLogoVisible();
	await footerMenuMobile.validateBottomNavVisible();
});

test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
test('Validate Wrong Password Login', async ({ landingPage, logInIFrame }) => {
	await landingPage.clickLoginButton();
	await logInIFrame.actionLogin(`${process.env.USER}`,'wrong_password');
	await logInIFrame.validateWrongPasswordUsed();
});

test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
test('Validate Wrong Username Login', async ({ landingPage, logInIFrame }) => {
	await landingPage.clickLoginButton();
	await logInIFrame.actionLogin(`wrong_username`, `${process.env.PASS}`);
	await logInIFrame.validateWrongPasswordUsed();
});