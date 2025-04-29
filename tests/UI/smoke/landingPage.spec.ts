import test, { expect } from "../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, headerMenuDesktop, navigation }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: "load" });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
});

test.describe("Landing Page Smoke Tests", () => {
    test.describe("Desktop", () => {
        test.beforeEach(async ({ }, testInfo) => {
            if (!testInfo.project.name.includes('desktop')) { test.skip(); }
        });

        test("Validate page elements are visible for a member", async ({ landingPage, topCategories }) => {
            await landingPage.validateCarouselElementsAreVisibleForMember();
            await landingPage.validateTopCategoriesElements();
            await landingPage.validateGameCategoriesElements();
            await landingPage.validateFaqElements();
            await landingPage.validatePromoCardElements();
            await landingPage.validateFooterLinksSectionElements();
        });

        test.describe("Guest", () => {
            test.use({ storageState: "playwright/.auth/noAuthentication.json" });
            test("Validate page elements are visible for a guest", async ({ landingPage }) => {
                await landingPage.validateCarouselElementsAreVisibleForGuest();
                await landingPage.validateTopCategoriesElements();
                await landingPage.validateGameCategoriesElements();
                await landingPage.validateFaqElements();
                await landingPage.validatePromoCardElements();
                await landingPage.validateFooterLinksSectionElements();
            });
        });
    });

    test.describe("Mobile", () => {
        test.beforeEach(async ({ }, testInfo) => {
            if (!testInfo.project.name.includes('mobile')) { test.skip(); }
        });

        test("Validate page elements are visible for a member", async ({ landingPage }) => {
            await landingPage.validateCarouselElementsAreVisibleForMember();
            await landingPage.validateTopCategoriesElements();
            await landingPage.validateGameCategoriesElements();
            await landingPage.validateFaqElements();
            await landingPage.validatePromoCardElements();
            await landingPage.validateFooterLinksSectionElements();
        });

        test.describe("Guest", () => {
            test.use({ storageState: "playwright/.auth/noAuthentication.json" });
            test("Validate page elements are visible for a guest", async ({ landingPage }) => {
                await landingPage.validateCarouselElementsAreVisibleForGuest();
                await landingPage.validateTopCategoriesElements();
                await landingPage.validateGameCategoriesElements();
                await landingPage.validateFaqElements();
                await landingPage.validatePromoCardElements();
                await landingPage.validateFooterLinksSectionElements();
            });
        });
    });
});
