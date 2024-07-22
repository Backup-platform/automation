import { GameProviders } from '../../pages/gameProviders.po';
import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page, banner }) => {
	await page.goto('https://stage.spacefortuna1.com/en');
	await banner.randomClickEscape();
	await banner.randomClickSkipSomething();
});

test.describe('Check by provider', async () => {
	const providers = [
		[GameProviders.providers.onlyPlay],
		[GameProviders.providers.booming, GameProviders.providers.yggdrasil]
	];
	for (const game of providers) {
		test(`Validate ${game} Opens`, async ({ headerMenuDesktop, gameProviders, banner }) => {
			await headerMenuDesktop.validateLogoVisible();
			await headerMenuDesktop.clickGames();
			await gameProviders.selectDesktopProvidersFromDropdown(game);
			//TODO: validate game page
		});
	}
});
