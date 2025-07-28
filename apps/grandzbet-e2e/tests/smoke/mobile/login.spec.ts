import test from '../../../pages/base/base.po';
import path from 'path';

test.beforeEach(async ({ page }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
});

test.describe("Login Page Smoke Tests - mobile", () => {
	test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });

	test("Validate Login", async ({ loginPage, menuItems, page, navigationItems }) => {
		await menuItems.validateGuestItems();
		await menuItems.clickLogin();
		await loginPage.validatePageElementsVisible();
		await loginPage.actionLogin(`${process.env.USER}`, `${process.env.PASS}`);
		await page.waitForURL(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
		await menuItems.validateUserItems();
		await navigationItems.validateItemsVisible();
	});

	test("Test all login page elements are visible", async ({ loginPage, menuItems }) => {
		await menuItems.clickLogin();
		await loginPage.validatePageElementsVisible(true);
		await loginPage.validatePageElementsEnabled(true);
		await loginPage.validatePageElementsEditable(true);
	});

	test ("Test login with empty email and password fields", async ({ loginPage, menuItems }) => {
		await menuItems.clickLogin();
		await loginPage.validatePageElementsVisible(false);
		await loginPage.fillUsername('');
		await loginPage.fillPassword('');
		await loginPage.clickLoginButton();
		await loginPage.validateEmailError(true);
		await loginPage.validatePasswordError(true);
	});

	test("Test wrong username and password", async ({ loginPage, menuItems }) => {
		await menuItems.validateGuestItems();
		await menuItems.clickLogin();
		await loginPage.validatePageElementsVisible();
		await loginPage.actionLogin(`wrong_username@mail.com`, `wrong_password`);
		await loginPage.validateInvalidCredentialsError();
	});

	// test.describe("Login with wrong credentials", () => {
	// 	const wrongCredentials: Array<{ scenario: string; username: string; password: string; field: 'email' | 'password' | 'credentials' }> = [
	// 		{ scenario: `Wrong password`, username: `${process.env.USER}`, password: "wrong_password", field: 'credentials' },
	// 		{ scenario: `Wrong email`, username: `wrong_username@mail.com`, password: `${process.env.PASS}`, field: 'credentials' },
	// 		{ scenario: `Invalid email`, username: `wrong_username`, password: `${process.env.PASS}`, field: 'email' },
	// 	];
	// 	for (const fields of wrongCredentials) {
	// 		test(`Test login with ${fields.scenario}`, async ({ loginPage, menuItems }) => {
	// 			await menuItems.clickLogin();
	// 			await loginPage.validateLoginWindowElementsVisible(true);
	// 			await loginPage.actionLogin(fields.username, fields.password);
	// 			await loginPage.validateLoginError(fields.field);
	// 		});
	// 	}
	// });
});
