import test from '../../../pages/utils/base.po';
import path from 'path';

test.beforeEach(async ({ page, banner }) => {
  await page.goto(`${process.env.URL}`, { waitUntil: 'load' });
  await banner.clickEscapeInOptIn();
  await banner.randomClickSkipSomething();
  await banner.sideBannerClickCloseBtn();
  await banner.randomBannerHiThere();
  await banner.acceptCookies();
  await banner.randomBannerNewDesign();
  await banner.acceptTermsAndConditions();
});

test.describe('Landing Page Regression Tests - Desktop', () => {
  test.describe('Guest', () => {
    test.use({
      storageState: path.resolve(
        __dirname,
        '../../../playwright/.auth/noAuthentication.json'
      ),
    });

    test('Validate carousel elements for a guest', async ({
      landingPageCarousel,
      signUpFirstStep,
    }) => {
      await landingPageCarousel.validateCarousel();
      await landingPageCarousel.validateEnterNavigation();
      await signUpFirstStep.validatePageElements();
    });

    test('Validate top Categories elements for a guest', async ({
      topCategories,
      headerMenuDesktop,
    }) => {
      await topCategories.validateCardElements();
      await topCategories.clickShowAll();
      await headerMenuDesktop.navigateToHomePageViaLogo();
      await topCategories.validateTopCardNavigation('/slots/all', 2);
    });

    test('Validate Game categories elements for a guest', async ({
      gamesCategories,
      headerMenuDesktop,
    }) => {
      await gamesCategories.validateGameCardElements();
      await gamesCategories.clickShowAll(0, '/slots/new-releases');
      await headerMenuDesktop.navigateToHomePageViaLogo();
      await gamesCategories.validateCTAbuttonsForGuests(0, 0, false);
    });

    test('Validate promotion elements for a guest', async ({
      promotionsLandingPage,
      headerMenuDesktop,
    }) => {
      await promotionsLandingPage.validateCardElements();
      await promotionsLandingPage.validateCardTitleVisible(1);
      await promotionsLandingPage.clickShowAll('/promotions');
      await headerMenuDesktop.navigateToHomePageViaLogo();
      await promotionsLandingPage.validateCTAbuttonsForGuests(1, true);
    });
  });

  test.describe('Member', () => {
    test('Validate carousel elements for a member', async ({
      landingPageCarousel,
    }) => {
      await landingPageCarousel.validateCarousel();
      await landingPageCarousel.validateGetBonusNavigation();
    });

    test('Validate top Categories elements for a member', async ({
      topCategories,
      headerMenuDesktop,
    }) => {
      await topCategories.validateCardElements();
      await topCategories.clickShowAll();
      await headerMenuDesktop.navigateToHomePageViaLogo();
      await topCategories.validateTopCardNavigation('/slots/all', 2);
    });

    test('Validate Game categories elements for a member', async ({
      gamesCategories,
      headerMenuDesktop,
    }) => {
      await gamesCategories.validateGameCardElements();
      await gamesCategories.clickShowAll(0, '/slots/new-releases');
      await headerMenuDesktop.navigateToHomePageViaLogo();
      await gamesCategories.validateCTAbuttonsForMembers(0, 0, false);
    });

    test('Validate promotion elements for a member', async ({
      promotionsLandingPage,
      headerMenuDesktop,
    }) => {
      await promotionsLandingPage.validateCardElements();
      await promotionsLandingPage.validateCardTitleVisible(1);
      await promotionsLandingPage.clickShowAll('/promotions');
      await headerMenuDesktop.navigateToHomePageViaLogo();
      await promotionsLandingPage.validateCTAbuttonsForMembers(1, true);
    });
  });
});
