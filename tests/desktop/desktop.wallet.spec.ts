import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page, banner, landingPage,loginPage,headerMenuDesktop }) => {
	await page.goto(`${process.env.URL}`);
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
	await headerMenuDesktop.clickLoginButton();
	await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await headerMenuDesktop.validateSFLogoVisible();
	await headerMenuDesktop.validateHeaderVisible();
   
});

test.describe.skip('Login Desktop', () => {
	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Successfull Deposit', async ({ landingPage, headerMenuDesktop, walletModal }) => {
        await headerMenuDesktop.validateDepositButton();
	});
});
