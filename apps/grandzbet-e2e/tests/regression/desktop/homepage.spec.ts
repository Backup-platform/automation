import test from '../../../pages/base/base.po';
import { expect } from '@playwright/test';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
});

test.describe("Landing page- Carousel elements", () => {
  test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });

  test('Guest: validate carousel elements visibility', async ({ landingPageCarousel }) => {
    await landingPageCarousel.validateElementsVisible();
  });

  test('Member: validate carousel elements visibility', async ({ loginPage, menuItems, page, landingPageCarousel }) => {
    await menuItems.clickLogin();
    await loginPage.validatePageElementsVisible();
    await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
    await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await menuItems.validateUserItems();
    await landingPageCarousel.validateElementsVisible();
  });
  test('Guest: Clicking on dots on Landing page',async ({ landingPageCarousel }) => {
   await landingPageCarousel.validateElementsVisible();
   await landingPageCarousel.clickActiveDot();
  
});

 
  test('Guest: Clicking on CTA button goes to bonus terms page', async ({ landingPageCarousel, page }) => {
  await landingPageCarousel.validateElementsVisible();
  await landingPageCarousel.clickCtaButton();

  await page.waitForURL('https://stage.grandzbet7.com/bonus-terms', { waitUntil: 'domcontentloaded' });
});


  test('Member: Clicking on dots on Landing page', async ({ landingPageCarousel, menuItems, loginPage, page }) => {
  await menuItems.clickLogin();
  await loginPage.validatePageElementsVisible();
  await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
  await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
  await menuItems.validateUserItems();
  await landingPageCarousel.validateElementsVisible();
  await landingPageCarousel.clickActiveDot();
});


test('Member: Clicking on CTA button on Landing page', async ({ loginPage, menuItems, page, landingPageCarousel }) => {
  await menuItems.clickLogin();
  await loginPage.validatePageElementsVisible();
  await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);

  await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
  await menuItems.validateUserItems();

  await landingPageCarousel.validateElementsVisible();
  await landingPageCarousel.clickCtaButton();

  await page.waitForURL('https://stage.grandzbet7.com/bonus-terms', { waitUntil: 'domcontentloaded' });
});

 test('Guest: Swiping on carousel changes slide', async ({ landingPageCarousel }) => {
    await landingPageCarousel.validateElementsVisible();

    const before = await landingPageCarousel.getActiveDotIndex();
    await landingPageCarousel.swipeLeft();
    const after = await landingPageCarousel.getActiveDotIndex();

    expect(before).not.toEqual(after);
  });

  test('Member: Swiping on carousel changes slide', async ({ loginPage, menuItems, page, landingPageCarousel }) => {
    await menuItems.clickLogin();
    await loginPage.validatePageElementsVisible();
    await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
    await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
    await menuItems.validateUserItems();

    await landingPageCarousel.validateElementsVisible();

    const before = await landingPageCarousel.getActiveDotIndex();
    await landingPageCarousel.swipeLeft();
    const after = await landingPageCarousel.getActiveDotIndex();

    expect(before).not.toEqual(after);
  });

});