import test from '../../../pages/base/base.po';
import path from 'path';
import { LandingPageCarousel } from '../../../pages/landingPage/carousel.po';



test.beforeEach(async ({ page }) => {
  await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
});


test.describe("Landing page- Carousel elements", () => {
  test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });


  test('Guest: validate carousel elements visibility', async ({ page }) => {
    const carousel = new LandingPageCarousel(page);

    await carousel.validateElementsVisible();
  });


  test('Member: validate carousel elements visibility', async ({ loginPage, menuItems, page }) => {


    await menuItems.clickLogin();
    await loginPage.validatePageElementsVisible();
    await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
    await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await menuItems.validateUserItems();

    const carousel = new LandingPageCarousel(page);

    await carousel.validateElementsVisible();

  });

});