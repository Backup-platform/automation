import test, { expect } from '../../pages/utils/base.po';
const testdata = JSON.parse(JSON.stringify(require("../../test-data/promotion.cards.json")));


test.beforeEach(async ({ page, banner, headerMenuDesktop, landingPage }) => {
	await test.step('go to url', async () => {
		await page.goto(`${process.env.URL}`);
	});
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
	await banner.randomClickEscape();
	await banner.randomClickSkipSomething();
	await landingPage.acceptCookiesBannerRandom();
	await headerMenuDesktop.validateLogoVisible();
	await headerMenuDesktop.clickPromotions();
	console.log(testdata);
});

test.describe.skip('Skip', async () => {
test.describe(`Testing promotion details as a member`, async () => {
	for (const promotion of testdata) {
		test(`Validate page elements for ${promotion.title}`, async ({ promotions, promotionDetails, promotionTabs }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.validateURL(promotion.title, promotion.readMoreURL);
			await promotionDetails.validatePageElements();
			await promotionDetails.validateCardElementsVisible();
			await promotionTabs.validateCardElements(promotionTabs.promoDetailsPageLocator());
			await promotionDetails.validateTermsAndConditionsDropdown();
			await promotionDetails.clickShowAllButton();
			await promotions.validateURL();
		});

		test(`Validate content of page elements for ${promotion.title}`, async ({ promotions, promotionDetails }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.validateCardElementsContent(promotion.title, promotion.subtitle, promotion.memberTextButton);
		});

		test(`Validate ${promotion.title} card deposit button opens the wallet modal`, async ({ promotionDetails, promotions }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.clickCardGreenButton();
			await promotionDetails.validateWalletModalVisible();
		});

		test(`Validate ${promotion.title} content deposit button opens the wallet modal`, async ({ promotionDetails, promotions }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.clickContentGreenButton();
			await promotionDetails.validateWalletModalVisible();
		});
	}
});

test.describe(`Testing promotion details as a guest`, async () => {
	for (const promotion of testdata) {
		test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
		test(`Validate page elements for ${promotion.title}`, async ({ promotions, promotionDetails, promotionTabs }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.validatePageElements();
			await promotionDetails.validateCardElementsVisible();
			await promotionTabs.validateCardElements(promotionTabs.promoDetailsPageLocator());
			await promotionDetails.validateTermsAndConditionsDropdown();
			await promotionDetails.clickShowAllButton();
			await promotions.validateURL();
		});

		test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
		test(`Validate content of page elements for ${promotion.title}`, async ({ promotions, promotionDetails, headerMenuDesktop }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.validateCardElementsContent(promotion.title, promotion.subtitle, promotion.guestTextButton);
		});

		test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
		test(`Validate ${promotion.title} card Sign Up button opens the register modal`, async ({ promotionDetails, promotions, headerMenuDesktop }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.clickCardGreenButton();
			await promotionDetails.validateRegisterModalVisible();
		});

		test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
		test(`Validate ${promotion.title} content Sign Up button opens the register modal`, async ({ promotionDetails, promotions, headerMenuDesktop }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.clickContentGreenButton();
			await promotionDetails.validateRegisterModalVisible();
		});
	}
});
});