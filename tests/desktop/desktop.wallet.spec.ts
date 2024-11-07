import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page, banner, landingPage,logInIFrame,headerMenuDesktop }) => {
	await page.goto('https://stage.spacefortuna1.com');
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
    await landingPage.clickLoginButton();
	await logInIFrame.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await headerMenuDesktop.validateLogoVisible();
	await headerMenuDesktop.validateDesktopHeaderVisible();
   
});

test.describe('Login Desktop', () => {
	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Successfull Deposit', async ({ landingPage, logInIFrame, headerMenuDesktop, walletModal }) => {
        await headerMenuDesktop.walletModalVisible();
	});
});
