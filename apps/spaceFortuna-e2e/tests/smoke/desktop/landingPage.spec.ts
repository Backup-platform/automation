import test from "../../../pages/utils/base.po";
import path from 'path';

test.beforeEach(async ({ page, banner }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: "load" });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
});

test.describe("Landing Page Smoke Tests - Desktop", () => {

    test("Validate page elements are visible for a member", async ({ landingPage }) => {
        await landingPage.validateCarouselElementsAreVisibleForMember();
        await landingPage.validateTopCategoriesElements();
        await landingPage.validateGameCategoriesElements();
        await landingPage.validateFaqElements();
        await landingPage.validatePromoCardElements();
        await landingPage.validateFooterLinksSectionElements();
    });

    test.describe("Guest", () => {
        test.use({
            storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json')
        });
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
