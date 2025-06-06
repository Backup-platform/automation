import test from '../../pages/utils/base.po';
import path from 'path';
const testdata = JSON.parse(JSON.stringify(require("../../test-data/promotion.cards.json")));


test.beforeEach(async ({ page, banner }) => {
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
test.describe(`Testing promotion details as a member`, async () => {
	for (const promotion of testdata) {
		test(`Validate page elements for ${promotion.title}`, async ({ promotions, promotionDetails, promotionTabs }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.validateURL(promotion.title, promotion.readMoreURL);
			await promotionDetails.validatePageElementsMobile();
			await promotionDetails.validateCardElementsMobileVisible();
			await promotionTabs.validateCardElements('details');
			await promotionDetails.validateTermsAndConditionsDropdown();
			await promotionDetails.clickShowAllButton();
			await promotions.validateURL();
		});

		test(`Validate page elements content for ${promotion.title}`, async ({ promotions, promotionDetails }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.validateCardElementsMobileContent(promotion.title, promotion.subtitle);
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
		test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
		test(`Validate page elements for ${promotion.title}`, async ({ promotions, promotionDetails, promotionTabs }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.validatePageElementsMobile();
			await promotionDetails.validateCardElementsMobileVisible();
			await promotionTabs.validateCardElements('details');
			await promotionDetails.validateTermsAndConditionsDropdown();
			await promotionDetails.clickShowAllButton();
			await promotions.validateURL();
		});

		test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
		test(`Validate content of page elements for ${promotion.title}`, async ({ promotions, promotionDetails }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.validateCardElementsMobileContent(promotion.title, promotion.subtitle);
		});

		test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
		test(`Validate ${promotion.title} content Sign Up button opens the register modal`, async ({ promotionDetails, promotions }) => {
			await promotions.clickReadMoreButton(promotion.cardNumber, promotion.readMoreURL);
			await promotionDetails.clickContentGreenButton();
			await promotionDetails.validateRegisterModalVisible();
		});
	}
});
});