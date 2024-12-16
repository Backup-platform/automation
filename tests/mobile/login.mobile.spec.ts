import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page, banner }) => {
	await page.goto(`${process.env.URL}`);
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
});

test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
test('Validate Login', async ({ loginPage, bottomMenu , footerMenuMobile }) => {
	await bottomMenu.clickLoginButton();
	await loginPage.validateLoginWindowElementsVisible(true);
	await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
	await footerMenuMobile.validateLogoVisible();
	await footerMenuMobile.validateBottomNavVisible();
});

test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
test('Validate Wrong Password Login', async ({ loginPage, bottomMenu }) => {
	await bottomMenu.clickLoginButton();
	await loginPage.validateLoginWindowElementsVisible(true);
	await loginPage.actionLogin(`${process.env.USER}`, `wrong_password`);
	await loginPage.validateInputErrorVisible();
});

test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
test('Validate Wrong Username Login', async ({ loginPage, bottomMenu }) => {
	await bottomMenu.clickLoginButton();
	await loginPage.validateLoginWindowElementsVisible(true);
	await loginPage.actionLogin(`wrong_username`, `${process.env.PASS}`);
	await loginPage.validateInputErrorVisible();
});