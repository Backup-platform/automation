import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, bottomMenu }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
	await banner.clickEscapeInOptIn();
	await banner.randomClickSkipSomething();
	await banner.bannerNewDesign();
	await banner.bannerHiThere();
});

test.describe("Login Page Smoke Tests - Mobile", () => {
	test.beforeAll(({ }, testInfo) => {
		if (!testInfo.project.name.includes('mobile')) { test.skip(); }
	});
	test.use({ storageState: "playwright/.auth/noAuthentication.json" });

	test("Validate Login Mobile", async ({ loginPage, bottomMenu, page }) => {
		await bottomMenu.clickLoginButton();
		await loginPage.validateLoginWindowElementsVisible(true);
		await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
		await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
		await loginPage.validateMobileLoginState(true);
	});

	test("Test all login page elements are visible", async ({ loginPage, bottomMenu }) => {
		await bottomMenu.clickLoginButton();
		await loginPage.validateLoginWindowElementsVisible(true);
	});

	test.describe("Login with wrong credentials", () => {
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
