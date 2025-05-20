import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.bannerNewDesign();
    await banner.bannerHiThere();
    await banner.acceptCookies();
    await banner.acceptTermsAndConditions();
});

test.describe("Menu Smoke Tests - Desktop", () => {

    test("Validate header elements for a member", async ({ headerMenuDesktop, page }) => {
        await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
        await headerMenuDesktop.validateLoggedInState(true);
    });

    test.describe("Guest", () => {
        test.use({ storageState: "playwright/.auth/noAuthentication.json" });
        test("Validate header elements for a guest", async ({ headerMenuDesktop, page }) => {
            await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
            await headerMenuDesktop.validateLoggedOutState(false);
        });
    });
});
