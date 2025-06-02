import test from "../../../pages/utils/base.po";
import { BurgerMenu } from "../../../pages/mobileMenu/burgerMenu.po";
import path from 'path';

test.beforeEach(async ({ page, banner }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
	await banner.clickEscapeInOptIn();
	await banner.randomClickSkipSomething();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
    await banner.acceptCookies();
    await banner.acceptTermsAndConditions();
});

test.describe("Login Page Regression Tests - Mobile", () => {
	test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });

	test("Validate Empty Username tab", async ({ loginPage, bottomMenu }) => {
		await bottomMenu.clickLoginButton();
		await loginPage.fillPassword(`${process.env.PASS}`);
		await loginPage.clickLoginButton();
		await loginPage.validateInputErrorVisible();
	});

	test("Validate Empty Password tab", async ({ loginPage, bottomMenu }) => {
		await bottomMenu.clickLoginButton();
		await loginPage.fillUsername(`${process.env.USER}`);
		await loginPage.clickLoginButton();
		await loginPage.validateInputErrorVisible();
	});

	test("Validate Empty Username and Password tab", async ({ loginPage, bottomMenu }) => {
		await bottomMenu.clickLoginButton();
		await loginPage.clickLoginButton();
		await loginPage.validateInputErrorVisible();
	});
	test.describe("Test Navigating to login from another page then going back via the back button", () => {
		const navigationScenarios: Array<{
			scenario: string;
			url: string;
			navigate: (params: { burgerMenu: BurgerMenu }) => Promise<void>;
		}> = [
			{
				scenario: 'Loyalty',
				url: '/loyalty',
				navigate: async ({ burgerMenu }) => await burgerMenu.clickLoyaltyButton(),
			},
			{
				scenario: 'VIP',
				url: '/vip',
				navigate: async ({ burgerMenu }) => await burgerMenu.clickVIPButton(),
			},
			{
				scenario: 'Promotions',
				url: '/promotions',
				navigate: async ({ burgerMenu }) => await burgerMenu.clickPromotionsButton(),
			},
			{
				scenario: 'Games',
				url: '/games/all',
				navigate: async ({ burgerMenu }) => await burgerMenu.clickGamesButton(),
			},
			{
				scenario: 'Home',
				url: '',
				navigate: async ({ burgerMenu }) => await burgerMenu.clickHomeButton(),
			}
			// Add more as needed
		];
		for (const { scenario, url, navigate } of navigationScenarios) {
			test(`Test clicking back on login returns to ${scenario}`, async ({ loginPage, bottomMenu, burgerMenu }) => {
				await navigate({ burgerMenu: burgerMenu });
				await bottomMenu.clickLoginButton();
				await loginPage.validateLoginWindowElementsVisible(true);
				await loginPage.validateNavigationBack(scenario, `${process.env.URL}${url}`);
			});
		}
	});
});
