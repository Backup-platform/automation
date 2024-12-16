import test, { expect } from "../../pages/utils/base.po";

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

test.describe("Landing Page Regression Tests", () => {
    test.describe("Desktop", () => {
        test.beforeEach(async ({ }, testInfo) => {
            if (!testInfo.project.name.includes('desktop')) { test.skip(); }
        });
        test.describe("guest", () => {
            test.use({ storageState: "playwright/.auth/noAuthentication.json" });
            test("Validate carousel elements for a guest", async ({ landingPageCarousel, signUpFirstStep }) => {
                await landingPageCarousel.validateCarousel();
                await landingPageCarousel.validateEnterNavigation();
                await signUpFirstStep.validatePageElements();
            });

            test("Validate top Categories elements for a guest", async ({ topCategories, page }) => {
                await topCategories.validateCardElements();
                await topCategories.clickShowAll();
                await page.goBack();
                await topCategories.validateTopCardNavigation('slots/all',2);
            });

            test("Validate Game categories elements for a guest", async ({ gamesCategories, page }) => {
                await gamesCategories.validateGameCardElements();
                await gamesCategories.clickShowAll(0, 'slots/new-releases');
                await page.goBack();
                await gamesCategories.validateCTAbuttonsForGuests(0,0,false);
            });

            test("Validate promotion elements for a guest", async ({ promotionsLandingPage, page }) => {
                await promotionsLandingPage.validateCardElements();
                await promotionsLandingPage.validateCardTitleVisible(0);
                await promotionsLandingPage.clickShowAll('promotions');
                await page.goBack();
                await promotionsLandingPage.validateCTAbuttonsForGuests(0,true);
            });
        });

        test.describe("member", () => {
            test("Validate carousel elements for a member", async ({ landingPageCarousel }) => {
                await landingPageCarousel.validateCarousel();
                await landingPageCarousel.validateGetBonusNavigation();

            });

            test("Validate top Categories elements for a member", async ({ topCategories, page }) => {
                await topCategories.validateCardElements();
                await topCategories.clickShowAll();
                await page.goBack();
                await topCategories.validateTopCardNavigation('slots/all',2);
            });

            test("Validate Game categories elements for a member", async ({ gamesCategories, page }) => {
                await gamesCategories.validateGameCardElements();
                await gamesCategories.clickShowAll(0, 'slots/new-releases');
                await page.goBack();
                await gamesCategories.validateCTAbuttonsForMembers(0,0,false);
            });

            test("Validate promotion elements for a member", async ({ promotionsLandingPage, page }) => {
                await promotionsLandingPage.validateCardElements();
                await promotionsLandingPage.validateCardTitleVisible(0);
                await promotionsLandingPage.clickShowAll('promotions');
                await page.goBack();
                await promotionsLandingPage.validateCTAbuttonsForMembers(0,true);
            });
        });
    });

    test.describe("Mobile", () => {
        test.beforeEach(async ({ }, testInfo) => {
            if (!testInfo.project.name.includes('mobile')) { test.skip(); }
        });

        test.describe("guest", () => {
            test.use({ storageState: "playwright/.auth/noAuthentication.json" });
            test("Validate carousel elements for a guest", async ({ landingPageCarousel, signUpFirstStep }) => {
                await landingPageCarousel.validateCarousel();
                await landingPageCarousel.validateEnterNavigation();
                await signUpFirstStep.validatePageElements();
            });

            test("Validate top Categories elements for a guest", async ({ topCategories, page }) => {
                await topCategories.validateCardElements();
                await topCategories.clickShowAll();
                await page.goBack();
                await topCategories.validateTopCardNavigation('slots/all',2); 
            });

            test("Validate Game categories elements for a guest", async ({ gamesCategories, page }) => {
                await gamesCategories.validateGameCardElements();
                await gamesCategories.clickShowAll(0, 'slots/new-releases');
                await page.goBack();
                await gamesCategories.validateCTAbuttonsForGuests(0,0, true);
            });

            test("Validate promotion elements for a guest", async ({ promotionsLandingPage, page }) => {
                await promotionsLandingPage.validateCardElements();
                await promotionsLandingPage.validateCardTitleVisible(0);
                await promotionsLandingPage.clickShowAll('promotions');
                await page.goBack();
                await promotionsLandingPage.validateCTAbuttonsForGuests(0,true);
            });

        });

        test.describe("member", () => {
            test("Validate carousel elements for a member", async ({ landingPageCarousel }) => {
                await landingPageCarousel.validateCarousel();
                await landingPageCarousel.validateGetBonusNavigation();
            });

            test("Validate top Categories elements for a member", async ({ topCategories, page }) => {
                await topCategories.validateCardElements();
                await topCategories.clickShowAll();
                await page.goBack();
                await topCategories.validateTopCardNavigation('slots/all',2);
            });

            test("Validate Game categories elements for a member", async ({ gamesCategories, page }) => {
                await gamesCategories.validateGameCardElements();
                await gamesCategories.clickShowAll(0, 'slots/new-releases');
                await page.goBack();
                await gamesCategories.validateCTAbuttonsForMembers(0,0,true);
            });

            test("Validate promotion elements for a member", async ({ promotionsLandingPage, page }) => {
                await promotionsLandingPage.validateCardElements();
                await promotionsLandingPage.validateCardTitleVisible(0);
                await promotionsLandingPage.clickShowAll('promotions');
                await page.goBack();
                await promotionsLandingPage.validateCTAbuttonsForMembers(0,true);
            });
        });
    });
});