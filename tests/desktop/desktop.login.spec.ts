import { BottomMenu } from "../../pages/mobileMenu/bottomMenu.po";
import test, { expect } from "../../pages/utils/base.po";
import { assertUrl } from "../../pages/utils/navigation.po";
/*
test.beforeEach(async ({ page, banner, headerMenuDesktop, navigation }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
	await banner.clickEscapeInOptIn();
	await banner.randomClickSkipSomething();
	await banner.acceptCookies();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
	await banner.acceptTermsAndConditions();
});

test.describe("Login Page Smoke Tests", () => {
	//TODO: add tests that validate menu items are visible while logged in - soft assert.
	//TODO: add tests that validate menu items are visible while logged out - soft assert.
	//TODO: add more validations you are logged in or logged out. 

	test.describe("desktop", () => {
		test.beforeAll(({ }, testInfo) => {
			if (!testInfo.project.name.includes('desktop')) { test.skip(); }
		});
		test.use({ storageState: "playwright/.auth/noAuthentication.json" });
		test("Validate Login", async ({ loginPage, headerMenuDesktop, page }) => {
			await headerMenuDesktop.validateLoggedOutState(false);
			await headerMenuDesktop.clickLoginButton();
			await loginPage.validateLoginWindowElementsVisible(false);
			await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
			await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
			await headerMenuDesktop.validateLoggedInState(false);
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
				test(`Test login with ${fields.scenario}`, async ({ loginPage, headerMenuDesktop }) => {
					await headerMenuDesktop.clickLoginButton();
					await loginPage.actionLogin(fields.username, fields.password);
					await loginPage.validateInputErrorVisible();
				});
			}
		});
	});

	test.describe("mobile", () => {

		test.beforeAll(({ }, testInfo) => {
			if (!testInfo.project.name.includes('mobile')) { console.log(`Project ${testInfo.project.name} skipped`); test.skip(); }
		});

		test.use({ storageState: "playwright/.auth/noAuthentication.json" });
		test("Validate Login Mobile", async ({ loginPage, bottomMenu, page }) => {
			await bottomMenu.validateLoggedOutState(false);
			await bottomMenu.clickLoginButton();
			await loginPage.validateLoginWindowElementsVisible(false);
			await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
			await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
			await bottomMenu.validateLoggedInState(false);
		});

		test("Test all login page elements are visible", async ({ loginPage, bottomMenu }) => {
			await bottomMenu.clickLoginButton();
			await loginPage.validateLoginWindowElementsVisible(true);
		});

		test.describe("Login with wrong credentials", () => {
			test.use({ storageState: "playwright/.auth/noAuthentication.json" });
			const wrongCredentials = [
				{ scenario: 'Wrong Password', username: `${process.env.USER}`, password: "wrong_password" },
				{ scenario: 'Wrong Username', username: `wrong_username`, password: `${process.env.PASS}` },
			];
			for (const fields of wrongCredentials) {
				test(`Test login with ${fields.scenario}`, async ({ loginPage, bottomMenu }) => {
					await bottomMenu.clickLoginButton();
					await loginPage.validateLoginWindowElementsVisible(true);
					await loginPage.actionLogin(fields.username, fields.password);
					await loginPage.validateInputErrorVisible();
				});
			}
		});
	});
});

test.describe("Login Page Regression Tests", () => {
	test.describe("desktop", () => {
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

		//Tests made by marina
		test.use({ storageState: "playwright/.auth/noAuthentication.json" });
		test("Validate Empty Password tab", async ({ loginPage, headerMenuDesktop }) => {
			await headerMenuDesktop.clickLoginButton();
			await loginPage.fillUsername(`${process.env.USER}`);
			await loginPage.clickLoginButton();
			await loginPage.validateInputErrorVisible();
		});

		// Test Made by Marina
		test.use({ storageState: "playwright/.auth/noAuthentication.json" });
		test("Validate Empty Username and Password tab", async ({ loginPage, headerMenuDesktop }) => {
			await headerMenuDesktop.clickLoginButton();
			await loginPage.clickLoginButton();
			await loginPage.validateInputErrorVisible();
		});

		test.describe("Test Navigating to login from another page then going back via the back button", () => {
			test.use({ storageState: "playwright/.auth/noAuthentication.json" });

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
					await navigate({ headerMenuDesktop }); // Go to page via nav method
					await headerMenuDesktop.clickLoginButton(); // Open login modal
					await loginPage.validateLoginWindowElementsVisible(true);
					await loginPage.clickBackButton(); // Click back
					await expect(page).toHaveURL(`${process.env.URL}${url}`);
				});
			}
		});
	});

	test.describe("mobile", () => {
		test.beforeAll(({ }, testInfo) => {
			if (!testInfo.project.name.includes('mobile')) { test.skip(); }
		});

		test.use({ storageState: "playwright/.auth/noAuthentication.json" });
		test("Validate Empty Username tab", async ({ loginPage, bottomMenu }) => {
			await bottomMenu.clickLoginButton();
			await loginPage.fillPassword(`${process.env.PASS}`);
			await loginPage.clickLoginButton();
			await loginPage.validateInputErrorVisible();
		});

		test.use({ storageState: "playwright/.auth/noAuthentication.json" });
		test("Validate Empty Password tab", async ({ loginPage, bottomMenu }) => {
			await bottomMenu.clickLoginButton();
			await loginPage.fillUsername(`${process.env.USER}`);
			await loginPage.clickLoginButton();
			await loginPage.validateInputErrorVisible();
		});

		test.use({ storageState: "playwright/.auth/noAuthentication.json" });
		test("Validate Empty Username and Password tab", async ({ loginPage, bottomMenu }) => {
			await bottomMenu.clickLoginButton();
			await loginPage.clickLoginButton();
			await loginPage.validateInputErrorVisible();
		});

		test.describe("Test Navigating to login from another page then going back via the back button", () => {
			test.use({ storageState: "playwright/.auth/noAuthentication.json" });
			const navigationScenarios = [
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