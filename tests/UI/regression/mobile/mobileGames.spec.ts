import { GameProviders } from '../../../../pages/gameProviders.po';
import test, { expect } from '../../../../pages/utils/base.po';

test.beforeEach(async ({ page, banner }) => {
	await page.goto(`${process.env.URL}`);
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
});

test.describe.skip('Test mobile game is responsive', () => {
	const providers = [
		[GameProviders.providers.onlyPlay],
		[GameProviders.providers.booming, GameProviders.providers.yggdrasil]
	];
	for (const game of providers) {
		test(`Validate ${game} Opens`, async ({ footerMenuMobile, gameProviders }) => {
			await footerMenuMobile.validateLogoVisible();
			await footerMenuMobile.validateBottomNavVisible();
			await footerMenuMobile.clickGames();
			await gameProviders.selectMobileProvidersFromDropdown(game);
			//TODO: validate game page
			// await page.locator('div[id="5men\:FruityBoobsParty-gcs"]>div>div>button').click();
			// await page.waitForTimeout(17000);
			// await page.locator('div[class*="gamePlay_sideControls"] a[href*="games/all"]').click();
			// await page.locator('.popup__button.popup__button--confirm').click();
			// await page.waitForTimeout(12000);
			// const allPages = await context.pages();
			// console.log(allPages.length);
			// await expect(page.frameLocator('iframe[src*="fruityboobsparty"]').locator('.desktop.firefox.landscape')).toBeVisible();
			// await page.frameLocator('iframe[src*="fruityboobsparty"]').locator('.popup__box .popup__buttons .popup__button.popup__button--confirm').click();
			// await page.frameLocator('iframe[src*="5a836d008a8ac62d8fd073b20e955017_335"]').locator('.popup__button').scrollIntoViewIfNeeded();
			// await page.frameLocator('iframe[src*="5a836d008a8ac62d8fd073b20e955017_335"]').locator('.popup__button').click();
			// await page.waitForTimeout(7000);
		});
	}
});