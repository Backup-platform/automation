import test, { expect } from '../../pages/utils/base.po';
const testdata = JSON.parse(JSON.stringify(require("../../test-data/promotion.cards.json")));
import cardSizes from '../../test-data/promotion.card.sizes.json';


test.beforeEach(async ({ page, banner, headerMenuDesktop, landingPage, promotions }) => {
	await test.step('go to url', async () => {
		await page.goto(`${process.env.URL}`);
	});
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
});
test.describe.skip('Skip', async () => {
test.describe('Testing Promotions page as a member', async () => {
	test('Validate card elements', async ({ promotions, viewport, headerMenuDesktop }) => {
		await headerMenuDesktop.clickPromotionsButton();
		await promotions.validateURL();
		await promotions.validatePromoContainer();
		await promotions.validatePromotionCards(JSON.parse(JSON.stringify(cardSizes)), 5, viewport);
	});
});

test.describe('Testing Promotions page as a guest', async () => {
	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Validate card elements', async ({ promotions, viewport, headerMenuDesktop }) => {
		await headerMenuDesktop.clickPromotionsButton();
		await promotions.validateURL();
		await promotions.validatePromoContainer();
		await promotions.validatePromotionCards(JSON.parse(JSON.stringify(cardSizes)), 5, viewport);
	});
});

test.describe('Testing Promotion Tabs as a member', async () => {
	test('Validate Home Page', async ({ promotionTabs, headerMenuDesktop }) => {
		//await headerMenuDesktop.clickHome();
		await promotionTabs.validateCardElements(promotionTabs.homePageLocator());
	});

	test('Validate loyalty page', async ({ promotionTabs, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoyaltyButton();
		await promotionTabs.validateCardElements(promotionTabs.loyaltyPageLocator());
	});
});


test.describe('Testing Promotion Tabs as a guest', async () => {
	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Validate Home Page', async ({ promotionTabs }) => {
		await promotionTabs.validateCardElements(promotionTabs.homePageLocator());
	});

	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Validate loyalty page', async ({ promotionTabs, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoyaltyButton();
		await promotionTabs.validateCardElements(promotionTabs.loyaltyPageLocator());
	});
});


test.describe('Validate promotions page card content', async () => {

	test.describe('Testing as a member', async () => {

		test('Validate content of cards', async ({ promotions, headerMenuDesktop }) => {
			await headerMenuDesktop.clickPromotionsButton();
			await promotions.validateURL();
			await promotions.validatePromoContainer();
			await promotions.validateCardCount(Number(testdata.length));
			for (const promotion of testdata) {
				await promotions.validateCardElementsContent(promotion.title, promotion.subtitle, promotion.memberTextButton, promotion.cardNumber, promotion.readMoreURL);
			}
		});

		for (const promotion of testdata) {
			test(`Validate read more navigation for card with title ${promotion.title} for members`, async ({ promotions, promotionDetails, headerMenuDesktop }) => {
				await headerMenuDesktop.clickPromotionsButton();
				await promotions.validateURL();
				await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
				await promotionDetails.validateURL(promotion.title, promotion.readMoreURL);
			});

			test(`Validate clicking deposit opens the wallet modal for card with title ${promotion.title}`, async ({ promotions, headerMenuDesktop}) => {
				await headerMenuDesktop.clickPromotionsButton();
				await promotions.validateURL();
				await promotions.clickGreenButton(promotion.cardNumber);
				await promotions.validateWalletModalVisible();
			});
		}
	});

	test.describe('Testing as a guest', async () => {

		test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
		test('Validate content of cards', async ({ promotions, headerMenuDesktop }) => {
			await headerMenuDesktop.clickPromotionsButton();
			await promotions.validateURL();
			await promotions.validatePromoContainer();
			await promotions.validateCardCount(Number(testdata.length));
			for (const promotion of testdata) {
				await promotions.validateCardElementsContent(promotion.title, promotion.subtitle, promotion.guestTextButton, promotion.cardNumber, promotion.readMoreURL);
			}
		});

		for (const promotion of testdata) {
			test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
			test(`Validate read more navigation for card with title ${promotion.title}`, async ({ promotions, promotionDetails, headerMenuDesktop }) => {
				await headerMenuDesktop.clickPromotionsButton();
				await promotions.validateURL();
				await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
				await promotionDetails.validateURL(promotion.title, promotion.readMoreURL);
			});

			test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
			test(`Validate clicking Sign Up opens the Sign Up modal for card with title ${promotion.title}`, async ({ promotions, headerMenuDesktop}) => {
				await headerMenuDesktop.clickPromotionsButton();
				await promotions.validateURL();
				await promotions.clickGreenButton(promotion.cardNumber);
				await promotions.validateRegisterModalVisible();
			});
		}
	});
});
});
