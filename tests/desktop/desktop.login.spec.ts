import test, { expect } from "../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, headerMenuDesktop, navigation }) => {
	await page.goto(`${process.env.URL}`, {waitUntil: "load" });
	await banner.randomClickEscape();
	await banner.randomClickSkipSomething();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
});

test.describe("Login Page Smoke Tests", () => {
	test.use({ storageState: "playwright/.auth/noAuthentication.json" });
	test("Validate Login", async ({ loginPage, headerMenuDesktop, navigation, page }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
		await page.waitForURL(`${process.env.URL}`, {waitUntil: "load" });
		await headerMenuDesktop.validateHeaderElements(true);
		await loginPage.validateLoggedIn();
	});

	test("Test all login page elements are visible", async ({ loginPage, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.validateLoginWindowElementsVisible(true);
	});

	test.describe("Login with wrong credentials", () => {
		test.use({ storageState: "playwright/.auth/noAuthentication.json" });
		const wrongCredentials = [
			{ scenario: 'Wrong Password', username: `${process.env.USER}`, password: "wrong_password" },
			{ scenario: 'Wrong Username', username: `wrong_username`, password: `${process.env.PASS}` },
		];
		for (const fields of wrongCredentials) {
			test(`Test login with ${fields.scenario}`, async ({ loginPage, headerMenuDesktop}) => {
				await headerMenuDesktop.clickLoginButton();
				await loginPage.actionLogin(fields.username, fields.password);
				await loginPage.validateInputErrorVisible();
			});
		}
	});
});

test.describe("Login Page Regression Tests", () => {
	test.use({ storageState: "playwright/.auth/noAuthentication.json" });
	test("Validate Empty Username tab", async ({ loginPage, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.fillPassword(`${process.env.PASS}`);
		await loginPage.clickLoginButton();
		await loginPage.validateInputErrorVisible();
	});

	/**
	 * Tests made by marina
	 */
	test.use({ storageState: "playwright/.auth/noAuthentication.json" });
	test("Validate Empty Password tab", async ({ loginPage, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.fillUsername(`${process.env.USER}`);
		await loginPage.clickLoginButton();
		await loginPage.validateInputErrorVisible();
	});

	/**
	 * Test Made by Marina
	 */
	test.use({ storageState: "playwright/.auth/noAuthentication.json" });
	test("Validate Empty Username and Password tab", async ({ loginPage, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.clickLoginButton();
		await loginPage.validateInputErrorVisible();
	});

	test.describe("Test Navigating to login from another page then going back via the back button", () => {
		test.use({ storageState: "playwright/.auth/noAuthentication.json" });
		const preconditionStartPage = [
			{ scenario: 'LandingPage', URL: '' },
			{ scenario: 'CrashGames', URL: 'crash-games/all' },
			{ scenario: 'LiveCasino', URL: 'live-casino/all' },
			{ scenario: 'Tournament', URL: 'tournament-promotions' },
			{ scenario: 'Games', URL: 'games/all' },
			{ scenario: 'Promotions', URL: 'promotions' },
			{ scenario: 'VIP', URL: 'vip' },
			{ scenario: 'Loyalty', URL: 'loyalty' },
			{ scenario: 'PromotionDetails', URL: 'mercury-33' },
			{ scenario: 'SimplePageAboutUS', URL: 'simplePage/AboutUs' },
			{ scenario: 'SimplePageBonusTerms', URL: 'simplePage/BonusTerms' },
			{ scenario: 'SimplePageAnti-MoneyLaundering', URL: 'simplePage/Anti-MoneyLaundering' },
			{ scenario: 'SimplePageCookiePolicy', URL: 'simplePage/CookiePolicy' },
			{ scenario: 'SimplePageTOS', URL: 'simplePage/TermsAndConditions' },
			{ scenario: 'SlotGamePlayScreen', URL: 'play/alea/pragmatic-play-sweet-bonanza' },
			{ scenario: 'LiveGameBlackjack', URL: 'live-casino/blackjack' },
		];
		for (const pageToStartFrom of preconditionStartPage) {
			test.use({ storageState: "playwright/.auth/noAuthentication.json" });
			test(`Test clicking back on login returns to ${pageToStartFrom.scenario}`, async ({ page, loginPage, headerMenuDesktop }) => {
				await page.goto(`${process.env.URL}` + pageToStartFrom.URL, {waitUntil: "load" });
				await headerMenuDesktop.clickLoginButton();
				await loginPage.validateLoginWindowElementsVisible(true);
				await loginPage.clickBackButton();
				await expect(page).toHaveURL(`${process.env.URL}` + pageToStartFrom.URL);
			});
		}
	});


	//TODO: reset button navigation


});

/**
 * e2e tests - fill in the spaces for marina's tests.
 * 
 */

/* TODO: Tests Made By Marina - move to reset password page
test.describe("Reset Password", () => {
	test("Valid email for Reset password", async ({landingPage, loginPage	}) => {
		await landingPage.clickLoginButton();
		await loginPage.clickResetPasswordLink();
		await loginPage.fillResetEmail(`${process.env.USER}`);
		await loginPage.clickLoginButton();
		await loginPage.validateSendEmail();
	});

	test("Invalid email for Reset password", async ({landingPage, loginPage, resetPasswordFrame }) => {
		await landingPage.clickLoginButton();
		await loginPage.clickResetPasswordLink();
		await loginPage.fillResetEmail(`invalid_username@.com`);

		///////////////////////////////////////Do nbot move them
		const email = loginPage.loginWindow().locator(loginPage.resetEmail());
		await email.fill(`invalid_username`);
		////////////////////////////////////

		await loginPage.clickLoginButton();
		//await logInIFrame.validateWrongUsernameUsed();

		await resetPasswordFrame.validateBrowserErrorIsShown(email, "@");
	});

	test("Empty email tab for Reset password", async ({ landingPage, loginPage }) => {
		await landingPage.clickLoginButton();
		await loginPage.clickResetPasswordLink();
		await loginPage.fillResetEmail(``);
		await loginPage.clickLoginButton();
		await loginPage.validateNoUsernameUsed();
	});

	test('Invalid email without "@" for Reset password', async ({landingPage, loginPage, resetPasswordFrame }) => {
		await landingPage.clickLoginButton();
		await loginPage.clickResetPasswordLink();
		//await logInIFrame.fillResetEmail(`invalid_username`);
		const email = loginPage.loginWindow().locator(loginPage.resetEmail());
		await email.fill(`invalid_username`);
		await loginPage.clickLoginButton();
		//await logInIFrame.validateWrongUsernameUsed();

		await resetPasswordFrame.validateBrowserErrorIsShown(email, "@");
	});

	test('Invalid email without text after "@" for Reset password', async ({landingPage, loginPage, resetPasswordFrame }) => {
		await landingPage.clickLoginButton();
		await loginPage.clickResetPasswordLink();
		const email = loginPage.loginWindow().locator(loginPage.resetEmail());
		await email.fill(`invalid_username`);
		await loginPage.fillResetEmail(`invalid_username@`);
		await loginPage.clickLoginButton();
		//await logInIFrame.validateWrongUsernameUsed();

		await resetPasswordFrame.validateBrowserErrorIsShown(email, "@");
	});

});
*/
