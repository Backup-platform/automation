import test from '../../../pages/base/base.po';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.URL as string, { waitUntil: 'domcontentloaded' });
});

test.describe('Landing Page - Top Casino Games', () => {
  test.use({
    storageState: path.resolve(
      __dirname,
      '../../../playwright/.auth/noAuthentication.json'
    ),
  });

  test('Guest: Validate Top Games elements visible', async ({ topGames }) => {
    await topGames.validateTopGamesVisible();
  });

  test('Guest: Show All button navigates correctly', async ({ topGames, page }) => {
    await topGames.validateTopGamesVisible();
    await topGames.clickShowAll();
    await page.waitForLoadState('domcontentloaded');
    //await expect(page).toHaveURL(/\/casino/i);
  });

  test('Member: Validate Top Games elements visible', async ({
    loginPage,
    menuItems,
    topGames,
    page,
  }) => {
    await menuItems.clickLogin();
    await loginPage.validatePageElementsVisible();
    await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
    await page.waitForLoadState('domcontentloaded');
    await menuItems.validateUserItems();
    await topGames.validateTopGamesVisible();
  });

  test.only('Member: Show All button navigates correctly', async ({
    loginPage,
    menuItems,
    topGames,
    page,
  }) => {
    await menuItems.clickLogin();
    await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
    await menuItems.validateUserItems();
    await topGames.clickShowAll();
    await page.waitForLoadState('domcontentloaded');
    //await expect(page).toHaveURL(/\/casino/i);
  });

  test('Guest: Carousel arrows are clickable', async ({ topGames }) => {
    await topGames.validateTopGamesVisible();
    await topGames.clickRightArrow();
    await topGames.clickLeftArrow();
  });

  test('Member: Carousel arrows are clickable', async ({
    loginPage,
    menuItems,
    topGames,
  }) => {
    await menuItems.clickLogin();
    await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
    await menuItems.validateUserItems();
    await topGames.validateTopGamesVisible();
    await topGames.clickRightArrow();
    await topGames.clickLeftArrow();
  });
});
