import test, { expect } from '../pages/utils/base.po';

test.beforeEach(async ({ page }) => {
	await page.goto('https://stage.spacefortuna1.com');
});


test.skip('Validate game is interactable', async ({ bottomMenu, gameProviders, page, context }) => {
/**
 * TODO: design a scenario for navigating to a game validating it works and goes back to landing page.
 */

	const game = ['#producer-Betsoft '];
	// await bottomMenu.validateLogoVisible();
	// await bottomMenu.validateBottomNavVisible();
	// await bottomMenu.clickGames();
	await gameProviders.selectMobileProvidersFromDropdown(game);
	//await page.locator('#apply-filters-btn').click();
	//await page.locator('div[id="1514-gcs"]>div>div>button').click();
	await page.locator('div').filter({ hasText: /^collectshortcutDragon & PhoenixBetsoftplay now$/ }).locator('button').click();
	await page.waitForTimeout(17000);
	await page.locator('body > span:nth-child(2) > span:nth-child(1) > span:nth-child(8) > span > span > span').click({ force: true });
	//await page.locator('img[src*="m_home_button"]').click({force:true});
	await page.waitForLoadState('domcontentloaded');
	//await page.waitForTimeout(10000);
	//await page.locator('div[id="1514-gcs"]>div>div>button').click();
	await page.waitForTimeout(5000);
	await page.locator('div[id="1514-gcs"]>div>div>button').click();
	await page.waitForTimeout(5000);
	//await page.locator('div[class*="gamePlay_sideControls"] a[href*="games/all"]').click();
	//await page.locator('.popup__button.popup__button--confirm').click();
	//const allPages = await context.pages();
	//console.log(allPages.length);
	//await expect(page.frameLocator('iframe[src*="fruityboobsparty"]').locator('.desktop.firefox.landscape')).toBeVisible();
	//await page.frameLocator('iframe[src*="fruityboobsparty"]').locator('.popup__box .popup__buttons .popup__button.popup__button--confirm').click();
	//await page.frameLocator('iframe[src*="5a836d008a8ac62d8fd073b20e955017_335"]').locator('.popup__button').scrollIntoViewIfNeeded();
	//await page.frameLocator('iframe[src*="5a836d008a8ac62d8fd073b20e955017_335"]').locator('.popup__button').click();
	//await page.waitForTimeout(7000);
});