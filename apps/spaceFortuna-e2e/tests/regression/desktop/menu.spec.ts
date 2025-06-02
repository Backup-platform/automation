import test from "../../../pages/utils/base.po";
import path from 'path';

test.beforeEach(async ({ page, banner }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.randomBannerNewDesign();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    await banner.acceptCookies();
    await banner.acceptTermsAndConditions();
});

test.describe("Menu Regression Tests - Desktop", () => {

    test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
    test("Validate header menu navigation for a guest", async ({ headerMenuDesktop, page }) => {
        await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
        await headerMenuDesktop.clickSFLogo();
        await headerMenuDesktop.clickCrashButton();
        await headerMenuDesktop.clickLiveButton();
        await headerMenuDesktop.clickTournamentButton();
        await headerMenuDesktop.clickGamesButton();
        await headerMenuDesktop.clickPromotionsButton();
        await headerMenuDesktop.clickVIPButton();
        await headerMenuDesktop.clickLoyaltyButton();
    });

    test("Validate header menu navigation for a member", async ({ headerMenuDesktop, page }) => {
        await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
        await headerMenuDesktop.clickSFLogo();
        await headerMenuDesktop.clickCrashButton();
        await headerMenuDesktop.clickLiveButton();
        await headerMenuDesktop.clickTournamentButton();
        await headerMenuDesktop.clickGamesButton();
        await headerMenuDesktop.clickPromotionsButton();
        await headerMenuDesktop.clickVIPButton();
        await headerMenuDesktop.clickLoyaltyButton();
    });
});
