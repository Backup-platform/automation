import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, loginPage, headerMenuDesktop }) => {
    await page.goto(`${process.env.URL}`);
    await banner.bannerNewDesign();
    await banner.bannerHiThere();
    await headerMenuDesktop.clickLoginButton();
    await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
    await headerMenuDesktop.validateSFLogoVisible();
    await headerMenuDesktop.validateHeaderVisible();
});

test.describe('Wallet Smoke Tests - Desktop', () => {
    test('Successful Deposit Button Visibility', async ({ headerMenuDesktop }) => {
        await headerMenuDesktop.validateDepositButtonVisible();
    });
});
