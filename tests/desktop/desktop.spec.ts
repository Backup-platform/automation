import { GameProviders } from '../../pages/gameProviders.po';
import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page }) => {
	await page.goto('https://stage.spacefortuna1.com');
});

test.describe('Check by provider', async () => {
	/**
	 * TODO: figure out how to do data / fixtures in the describe block
	 * 
	 * let gameProviders = new GameProviders();
	 * test.use({testing.providers.booming});
	 */
	const providers = [
		[GameProviders.providers.onlyPlay],
		[GameProviders.providers.booming, GameProviders.providers.yggdrasil]
	];
	for (const game of providers) {
		test(`Validate ${game} Opens`, async ({ headerMenuDesktop, gameProviders, banner }) => {
			await banner.bannerNewDesign();
			await banner.bannerHiThere();
			await headerMenuDesktop.validateLogoVisible();
			await headerMenuDesktop.clickGames();
			await gameProviders.selectDesktopProvidersFromDropdown(game);
			//TODO: validate game page
		});
	}
});
