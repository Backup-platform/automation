import test, { expect } from "../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, headerMenuDesktop, navigation }) => {
	await page.goto(`${process.env.URL}`, {waitUntil: "load" });
	await banner.randomClickEscape();
	await banner.randomClickSkipSomething();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
});

    //TODO: Click CTA register / deposit based on logged in logged out
    //TODO: Click read more button
    //TODO: click top category cards
    //TODO: check switching the language 
    //TODO: check certificates 
    //TODO: Enter button
    //TODO: GetBonus button

test.describe("Landing page Smoke Tests", () => {
    test("Validate page elements are visible for a member", async ({ landingPage, topCategories }) => {
        await landingPage.validateCarouselElementsAreVisibleForMember();
        await landingPage.validateTopCategoriesElements();
        await landingPage.validateGameCategoriesElements();
        await landingPage.validateFaqElements();
        await landingPage.validatePromoCardElements();
        await landingPage.validateFooterLinksSectionElements();

    });
});

test.use({ storageState: "playwright/.auth/noAuthentication.json" });
test("Validate page elements are visible for a guest", async ({ landingPage }) => {
    await landingPage.validateCarouselElementsAreVisibleForGuest();
    await landingPage.validateTopCategoriesElements();
    await landingPage.validateGameCategoriesElements();
    await landingPage.validateFaqElements();
    await landingPage.validatePromoCardElements();
    await landingPage.validateFooterLinksSectionElements();

});

test.describe("Landing page Regression Tests", () => {
    test.use({ storageState: "playwright/.auth/noAuthentication.json" });
    test("Validate carousel elements for a guest", async ({ landingPageCarousel }) => {
        await landingPageCarousel.validateCarousel();
    });

    test.use({ storageState: "playwright/.auth/noAuthentication.json" });
    test("Validate carousel elements for a member", async ({ landingPageCarousel }) => {
        await landingPageCarousel.validateCarousel();
    });
});