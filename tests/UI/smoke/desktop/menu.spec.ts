import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.randomBannerNewDesign();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
});

test.describe("Menu Smoke Tests - Desktop", () => {
    test.beforeAll(({ }, testInfo) => {
        if (!testInfo.project.name.includes('desktop')) { test.skip(); }
    });

    test("Validate header elements for a member", async ({ headerMenuDesktop, page }) => {
        await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
        await headerMenuDesktop.validateHeaderElements(true);
    });

    test.describe("Guest", () => {
        test.use({ storageState: "playwright/.auth/noAuthentication.json" });
        test("Validate header elements for a guest", async ({ headerMenuDesktop, page }) => {
            await page.goto(`${process.env.URL}`, { waitUntil: "domcontentloaded" });
            await headerMenuDesktop.validateHeaderElements(true);
        });
    });
});
