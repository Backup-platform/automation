import { GameProviders } from '../../pages/gameProviders.po';
import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page, banner }) => {
	await page.goto(`${process.env.URL}`);
	await banner.randomClickEscape();
	await banner.randomClickSkipSomething();
});

test.describe.skip('Check by provider', async () => {
	const providers = [
		[GameProviders.providers.onlyPlay],
		[GameProviders.providers.booming, GameProviders.providers.yggdrasil]
	];
	for (const game of providers) {
		test(`Validate ${game} Opens`, async ({ headerMenuDesktop, gameProviders, banner }) => {
			await headerMenuDesktop.validateSFLogoVisible();
			await headerMenuDesktop.clickGamesButton();
			await gameProviders.selectDesktopProvidersFromDropdown(game);
			//TODO: validate game page
		});
	}
});
