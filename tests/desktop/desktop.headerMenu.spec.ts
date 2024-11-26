import test, { expect } from "../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, headerMenuDesktop, navigation }) => {
	await page.goto(`${process.env.URL}`, {waitUntil: "load" });
	await banner.randomClickEscape();
	await banner.randomClickSkipSomething();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
});

test.describe("Header Menu Smoke Tests", () => {
    test.use({ storageState: "playwright/.auth/noAuthentication.json" });
    test("Validate header elements for a guest", async ({ headerMenuDesktop, page }) => {
        await page.goto(`${process.env.URL}`, { waitUntil: "load" });
        await headerMenuDesktop.validateHeaderElements(true);
        //TODO: validate sign up / login buttons
        //validate search

    });

    test("Validate header elements for a member", async ({ headerMenuDesktop, page }) => {
        await page.goto(`${process.env.URL}`, { waitUntil: "load" });
        await headerMenuDesktop.validateHeaderElements(true);
        //TODO: validate shortcut, balance, deposit, my profile
        //validate search

    });

    test.use({ storageState: "playwright/.auth/noAuthentication.json" });
    test("Validate header menu navigation for a guest", async ({ headerMenuDesktop, page }) => {
        await page.goto(`${process.env.URL}`, { waitUntil: "load" });
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
        await page.goto(`${process.env.URL}`, { waitUntil: "load" });
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