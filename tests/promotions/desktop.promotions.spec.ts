import test, { expect } from '../../pages/utils/base.po';
//const cardSizeByResolution = require( "../../test-data/promotion.cards.sizes.json");
import cardSizes from '../../test-data/promotion.card.sizes.json';
const testdata = JSON.parse(JSON.stringify(require("../../test-data/promotion.cards.json")));


test.beforeEach(async ({ page, banner, headerMenuDesktop, landingPage  }) => {
	await test.step('go to url', async () => {
		await page.goto(`${process.env.URL}`);
	});
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
	await landingPage.acceptCookiesBannerRandom();
	await headerMenuDesktop.validateLogoVisible();
});

test.describe('Testing Promotions page as a member', async () => {
	test('Validate card elements', async ({ promotions, viewport, headerMenuDesktop}) => {
		await headerMenuDesktop.clickPromotions();
		await promotions.validateURL();
		await promotions.validatePromoContainer();
		await promotions.validatePromotionCards(JSON.parse(JSON.stringify(cardSizes)), 5, viewport);
		// const viewportHeight = viewport?.width.toString();
		// Object.entries(cardSizes).map(async ([key, value]) => {
		// 	if (key === viewportHeight) {
		// 		await promotions.validateCardSize(value, 5);
		// 	}
		// });
	});
});

test.describe('Testing Promotions page as a guest', async () => {
	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Validate card elements', async ({ promotions, viewport, headerMenuDesktop}) => {
		await headerMenuDesktop.clickPromotions();
		await promotions.validateURL();
		await promotions.validatePromoContainer();
		await promotions.validatePromotionCards(JSON.parse(JSON.stringify(cardSizes)), 5, viewport);
	});
});

test.describe('Testing Promotion Tabs as a member', async () => {
	test('Validate Home Page', async ({ promotionTabs }) => {
		await promotionTabs.validateCardElements(promotionTabs.homePageLocator());

	});

	test('Validate Loyalty Page', async ({ promotionTabs, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoyalty();
		await promotionTabs.validateCardElements(promotionTabs.loyaltyPageLocator());
	});
});


test.describe('Testing Promotion Tabs as a guest', async () => {
	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Validate Home Page', async ({ promotionTabs, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoyalty();
		await promotionTabs.validateCardElements(promotionTabs.loyaltyPageLocator());
	});

	test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
	test('Validate Loyalty Page', async ({ promotionTabs }) => {
		await promotionTabs.validateCardElements(promotionTabs.homePageLocator());
	});
});


test.describe('Validate promotions page card content', async () => {

	test.describe('Testing as a member', async () => {

		test('Validate content of cards', async ({ promotions, headerMenuDesktop}) => {
			await headerMenuDesktop.clickPromotions();
			await promotions.validateURL();
			await promotions.validatePromoContainer();
			await promotions.validateCardCount(Number(testdata.length));
			for (const promotion of testdata) {
				await promotions.validateCardElementsContent(promotion.title, promotion.subtitle, promotion.memberTextButton, promotion.cardNumber, promotion.readMoreURL);
			}
		});

		for (const promotion of testdata) {
			test(`Validate navigation to promotion details for card: ${promotion.title}`, async ({ promotions, promotionDetails, headerMenuDesktop}) => {
				await headerMenuDesktop.clickPromotions();
				await promotions.validateURL();
				await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
				await promotionDetails.validateURL(promotion.title, promotion.readMoreURL);
			});

			test(`Validate deposit button opens the wallet modal for card: ${promotion.title}`, async ({ promotions, headerMenuDesktop}) => {
				await headerMenuDesktop.clickPromotions();
				await promotions.validateURL();
				await promotions.clickGreenButton(promotion.cardNumber);
				await promotions.validateWalletModalVisible();
			});
		}
	});


	test.describe('Testing as a guest', async () => {

		test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
		test('Validate content of cards', async ({ promotions, headerMenuDesktop}) => {
			await headerMenuDesktop.clickPromotions();
			await promotions.validateURL();
			await promotions.validatePromoContainer();
			await promotions.validateCardCount(Number(testdata.length));
			for (const promotion of testdata) {
				await promotions.validateCardElementsContent(promotion.title, promotion.subtitle, promotion.guestTextButton, promotion.cardNumber, promotion.readMoreURL);
			}
		});

		for (const promotion of testdata) {
			test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
			test(`Validate navigation to promotion details for card: ${promotion.title} for guests`, async ({ promotions, promotionDetails, headerMenuDesktop}) => {
				await headerMenuDesktop.clickPromotions();
				await promotions.validateURL();
				await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
				await promotionDetails.validateURL(promotion.title, promotion.readMoreURL);
			});

			test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
			test(`Validate deposit button opens the wallet modal for card: ${promotion.title}`, async ({ promotions, headerMenuDesktop}) => {
				await headerMenuDesktop.clickPromotions();
				await promotions.validateURL();
				await promotions.clickGreenButton(promotion.cardNumber);
				await promotions.validateRegisterModalVisible();
			});
		}
	});
});

