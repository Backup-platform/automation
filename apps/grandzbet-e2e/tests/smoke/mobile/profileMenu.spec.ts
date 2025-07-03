import test from '../../../pages/base/base.po';
import { assertUrl } from '@test-utils';

test.beforeEach(async ({ page, popupHandlers }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
  	await popupHandlers.handleAllPopups();
});
	test.describe('Profile Menu Tests', () => {
	test("Validate profile menu elements", async ({ profileMenu, menuItems }) => {
		await menuItems.clickMyProfileButton();
		await profileMenu.validateProfileMenuElements();
	});

	test("Test Logout from landing page", async ({ menuItems, profileMenu }) => {
		await menuItems.clickMyProfileButton();
		await profileMenu.validateProfileMenuElements();
		await profileMenu.clickLogoutButton();
		await menuItems.validateGuestItems();
	});

	test("Test Close from landing page", async ({ menuItems, profileMenu, page }) => {
		await menuItems.clickMyProfileButton();
		await profileMenu.validateProfileMenuElements();
		await profileMenu.clickEscapeButton();
		await assertUrl(page, `${process.env.URL}`, true);
		await profileMenu.validateProfileMenuDialogNotVisible();
	});

	test("Test Deposit from landing page", async ({ menuItems, profileMenu, cashierGeneral }) => {
		await menuItems.clickMyProfileButton();
		await profileMenu.validateProfileMenuElements();
		await profileMenu.clickDepositButton();
		await profileMenu.validateMenuHiddenByDeposit();
		await cashierGeneral.validateMainMenuVisible();
	});
});
