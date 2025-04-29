import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, headerMenuDesktop }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
	await banner.clickEscapeInOptIn();
	await banner.randomClickSkipSomething();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
});

test.describe("Login Page Smoke Tests - Desktop", () => {
	test.beforeAll(({ }, testInfo) => {
		if (!testInfo.project.name.includes('desktop')) { test.skip(); }
	});
	test.use({ storageState: "playwright/.auth/noAuthentication.json" });

	test("Validate Login", async ({ loginPage, headerMenuDesktop, page }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
		await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
		await loginPage.validateDesktopLoginState(true);
	});

	test("Test all login page elements are visible", async ({ loginPage, headerMenuDesktop }) => {
		await headerMenuDesktop.clickLoginButton();
		await loginPage.validateLoginWindowElementsVisible(true);
	});

	test.describe("Login with wrong credentials", () => {
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
