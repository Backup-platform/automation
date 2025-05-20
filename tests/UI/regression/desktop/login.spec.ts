import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
	await banner.clickEscapeInOptIn();
	await banner.randomClickSkipSomething();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();  
    await banner.acceptCookies();
    await banner.acceptTermsAndConditions();
});

test.describe("Login Page Regression Tests - Desktop", () => {

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
		const navigationScenarios = [
			{ scenario: 'LandingPage', url: '', navigate: async ({ headerMenuDesktop }) => await headerMenuDesktop.clickSFLogo() },
			{ scenario: 'CrashGames', url: '/crash-games/all', navigate: async ({ headerMenuDesktop }) => await headerMenuDesktop.clickCrashButton() },
			{ scenario: 'LiveCasino', url: '/live-casino/all', navigate: async ({ headerMenuDesktop }) => await headerMenuDesktop.clickLiveButton() },
			{ scenario: 'Tournament', url: '/tournament-promotions', navigate: async ({ headerMenuDesktop }) => await headerMenuDesktop.clickTournamentButton() },
			{ scenario: 'Games', url: '/games/all', navigate: async ({ headerMenuDesktop }) => await headerMenuDesktop.clickGamesButton() },
			{ scenario: 'Promotions', url: '/promotions', navigate: async ({ headerMenuDesktop }) => await headerMenuDesktop.clickPromotionsButton() },
			{ scenario: 'VIP', url: '/vip', navigate: async ({ headerMenuDesktop }) => await headerMenuDesktop.clickVIPButton() },
			{ scenario: 'Loyalty', url: '/loyalty', navigate: async ({ headerMenuDesktop }) => await headerMenuDesktop.clickLoyaltyButton() },
		];
		for (const { scenario, url, navigate } of navigationScenarios) {
			test(`Test clicking back on login returns to ${scenario}`, async ({ page, loginPage, headerMenuDesktop }) => {
				await navigate({ headerMenuDesktop });
				await headerMenuDesktop.clickLoginButton()
				await loginPage.validateLoginWindowElementsVisible(true);
				await loginPage.clickBackButton(`${process.env.URL}${url}`);
			});
		}
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

});
