import test, { expect } from "../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, headerMenuDesktop }) => {
	await page.goto(`${process.env.URL}`);
	await banner.randomClickEscape();
	await banner.randomClickSkipSomething();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
	//await headerMenuDesktop.validateLogoVisible();
	//await headerMenuDesktop.validateDesktopHeaderVisible();
});

test.describe("Login Desktop", () => {
	test.use({ storageState: "playwright/.auth/noAuthentication.json" });
	test("Validate Login", async ({ landingPage, logInIFrame, headerMenuDesktop }) => {
		await landingPage.clickLoginButton();
		await logInIFrame.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
		await headerMenuDesktop.validateDepositVisible();
		await headerMenuDesktop.validateBalanceVisible();
		await headerMenuDesktop.validateMyProfileVisible();
		//TODO: //await headerMenuDesktop.clickMyProfile();
	});

	test.use({ storageState: "playwright/.auth/noAuthentication.json" });
	test("Validate Wrong Password Login", async ({ landingPage, logInIFrame }) => {
		await landingPage.clickLoginButton();
		await logInIFrame.actionLogin(`${process.env.USER}`, "wrong_password");
		await logInIFrame.validateWrongPasswordUsed();
	});

	test.use({ storageState: "playwright/.auth/noAuthentication.json" });
	test("Validate Wrong Username Login", async ({ landingPage, logInIFrame }) => {
		await landingPage.clickLoginButton();
		await logInIFrame.actionLogin(`wrong_username`, `${process.env.PASS}`);
		await logInIFrame.validateWrongPasswordUsed();
	});

	test.use({ storageState: "playwright/.auth/noAuthentication.json" });
	test("Validate Empty Username tab", async ({landingPage, logInIFrame }) => {
		await landingPage.clickLoginButton();
		await logInIFrame.fillPassword(`${process.env.PASS}`);
		await logInIFrame.clickLoginButton();
		await logInIFrame.validateWrongUsernameUsed();
	});

	test.use({ storageState: "playwright/.auth/noAuthentication.json" });
	test("Validate Empty Password tab", async ({landingPage, logInIFrame }) => {
		await landingPage.clickLoginButton();
		await logInIFrame.fillUsername(`${process.env.USER}`);
		await logInIFrame.clickLoginButton();
		await logInIFrame.validateNoPasswordUsed();
	});

	test.describe("Reset Password", () => {
		test("Valid email for Reset password", async ({landingPage, logInIFrame	}) => {
			await landingPage.clickLoginButton();
			await logInIFrame.clickResetPasswordButton();
			await logInIFrame.fillResetEmail(`${process.env.USER}`);
			await logInIFrame.clickSubmitButton();
			await logInIFrame.validateSendEmail();
		});

		test("Invalid email for Reset password", async ({landingPage, logInIFrame, resetPasswordFrame }) => {
			await landingPage.clickLoginButton();
			await logInIFrame.clickResetPasswordButton();
			await logInIFrame.fillResetEmail(`invalid_username@.com`);

			///////////////////////////////////////Do nbot move them
			const email = logInIFrame.loginWindow().locator(logInIFrame.resetEmail());
			await email.fill(`invalid_username`);
			////////////////////////////////////

			await logInIFrame.clickSubmitButton();
			//await logInIFrame.validateWrongUsernameUsed();

			await resetPasswordFrame.validateBrowserErrorIsShown(email, "@");
		});

		test("Empty email tab for Reset password", async ({ landingPage, logInIFrame }) => {
			await landingPage.clickLoginButton();
			await logInIFrame.clickResetPasswordButton();
			await logInIFrame.fillResetEmail(``);
			await logInIFrame.clickSubmitButton();
			await logInIFrame.validateNoUsernameUsed();
		});

		test('Invalid email without "@" for Reset password', async ({landingPage, logInIFrame, resetPasswordFrame }) => {
			await landingPage.clickLoginButton();
			await logInIFrame.clickResetPasswordButton();
			//await logInIFrame.fillResetEmail(`invalid_username`);
			const email = logInIFrame.loginWindow().locator(logInIFrame.resetEmail());
			await email.fill(`invalid_username`);
			await logInIFrame.clickSubmitButton();
			//await logInIFrame.validateWrongUsernameUsed();

			await resetPasswordFrame.validateBrowserErrorIsShown(email, "@");
		});

		test('Invalid email without text after "@" for Reset password', async ({landingPage, logInIFrame, resetPasswordFrame }) => {
			await landingPage.clickLoginButton();
			await logInIFrame.clickResetPasswordButton();
			const email = logInIFrame.loginWindow().locator(logInIFrame.resetEmail());
			await email.fill(`invalid_username`);
			await logInIFrame.fillResetEmail(`invalid_username@`);
			await logInIFrame.clickSubmitButton();
			//await logInIFrame.validateWrongUsernameUsed();

			await resetPasswordFrame.validateBrowserErrorIsShown(email, "@");
		});
	});
});
