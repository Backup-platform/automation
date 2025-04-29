import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, headerMenuDesktop }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
	await banner.clickEscapeInOptIn();
	await banner.randomClickSkipSomething();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
});

test.describe("Login Page Regression Tests - Desktop", () => {
	test.beforeAll(({ }, testInfo) => {
		if (!testInfo.project.name.includes('desktop')) { test.skip(); }
	});
	test.use({ storageState: "playwright/.auth/noAuthentication.json" });

	test("Validate Empty Username tab", async ({ loginPage, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.fillPassword(`${process.env.PASS}`);
		await loginPage.clickLoginButton();
		await loginPage.validateInputErrorVisible();
	});

	test("Validate Empty Password tab", async ({ loginPage, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.fillUsername(`${process.env.USER}`);
		await loginPage.clickLoginButton();
		await loginPage.validateInputErrorVisible();
	});

	test("Validate Empty Username and Password tab", async ({ loginPage, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.clickLoginButton();
		await loginPage.validateInputErrorVisible();
	});

	test.describe("Test Navigating to login from another page then going back via the back button", () => {
		const preconditionStartPage = [
			{ scenario: 'LandingPage', URL: '' },
			{ scenario: 'CrashGames', URL: 'crash-games/all' },
			{ scenario: 'LiveCasino', URL: 'live-casino/all' },
			{ scenario: 'Tournament', URL: 'tournament-promotions' },
			{ scenario: 'Games', URL: 'games/all' },
			{ scenario: 'Promotions', URL: 'promotions' },
			{ scenario: 'VIP', URL: 'vip' },
			{ scenario: 'Loyalty', URL: 'loyalty' },
			{ scenario: 'PromotionDetails', URL: 'promotions/mercury-33' },
			{ scenario: 'SimplePageAboutUS', URL: 'simplePage/AboutUs' },
			{ scenario: 'SimplePageBonusTerms', URL: 'simplePage/BonusTerms' },
			{ scenario: 'SimplePageAnti-MoneyLaundering', URL: 'simplePage/Anti-MoneyLaundering' },
			{ scenario: 'SimplePageCookiePolicy', URL: 'simplePage/CookiePolicy' },
			{ scenario: 'SimplePageTOS', URL: 'simplePage/TermsAndConditions' },
			{ scenario: 'SlotGamePlayScreen', URL: 'play/alea/pragmatic-play-sweet-bonanza' },
			{ scenario: 'LiveGameBlackjack', URL: 'live-casino/blackjack' },
		];
		for (const pageToStartFrom of preconditionStartPage) {
			test(`Test clicking back on login returns to ${pageToStartFrom.scenario}`, async ({ page, loginPage, headerMenuDesktop }) => {
				await page.goto(`${process.env.URL}` + pageToStartFrom.URL, { waitUntil: 'domcontentloaded' });
				await headerMenuDesktop.clickLoginButton();
				await loginPage.validateLoginWindowElementsVisible(true);
				await loginPage.clickBackButton();
				await expect(page).toHaveURL(`${process.env.URL}` + pageToStartFrom.URL);
			});
		}
	});
});
