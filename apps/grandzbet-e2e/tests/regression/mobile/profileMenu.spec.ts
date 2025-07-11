import test from '../../../pages/base/base.po';
import { assertUrl } from '@test-utils/navigation-helpers';

test.beforeEach(async ({ page, popupHandlers }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
  	await popupHandlers.handleAllPopups();
});
test.describe('Regression', () => {
test.describe('Validate profile menu navigation', () => {
	const profileMenuScenarios = [
		{ scenario: 'My Bonuses Button', buttonGetter: 'myBonusesButtonElement', url: `myBonuses` },
		{ scenario: 'Personal Information Button', buttonGetter: 'personalInfoButtonElement', url: `personalInfo` },
		{ scenario: 'Verification Button', buttonGetter: 'verificationButtonElement', url: `verification` },
		{ scenario: 'History Button', buttonGetter: 'historyButtonElement', url: `history` },
		{ scenario: 'Limits Button', buttonGetter: 'limitsButtonElement', url: `responsibleGaming` },
		//{ scenario: 'Escape Button', buttonGetter: 'escapeButtonElement', url: `/login` },
	] as const;

	for (const { scenario, buttonGetter, url } of profileMenuScenarios) {
		test(`${scenario} navigation`, async ({ menuItems, profileMenu, page, cashierGeneral }) => {
			await menuItems.clickMyProfileButton();
			await profileMenu.validateProfileMenuElements();
			const profileButton = profileMenu[buttonGetter];
			await profileMenu.validateNavigation(profileButton, `${process.env.URL}/profile?tab=${url}`);
			//TODO: validate Page Elements when POM is ready ( future work )
			await profileMenu.validateProfileMenuDialogNotVisible();
			await menuItems.clickMyProfileButton();
			await profileMenu.validateProfileMenuElements();

			await profileMenu.clickDepositButton();
			await profileMenu.validateMenuHiddenByDeposit();
			await cashierGeneral.validateMainMenuVisible();
			await cashierGeneral.clickCloseButton();
			await cashierGeneral.validateMainMenuNotVisible();

			await profileMenu.clickEscapeButton();
			await profileMenu.validateProfileMenuDialogNotVisible();
			await assertUrl(page, `${process.env.URL}/profile?tab=${url}`, true);
		});
	}
});

    test.describe('Test logging out from other pages', () => {
        const navigationScenarios = [
            { scenario: 'Casino', action: (deps: any) => deps.navigationItems.clickCasinoButton() },
            { scenario: 'Promotions', action: (deps: any) => deps.navigationItems.clickPromotionsButton() }
        ];
        
        for (const { scenario, action } of navigationScenarios) {
            test(`Logout from ${scenario} page`, async ({ profileMenu, navigationItems, menuItems, page }) => {
                await action({ menuItems, navigationItems });
                await menuItems.clickMyProfileButton();
                await profileMenu.validateProfileMenuElements(true);
				await profileMenu.clickLogoutButton();
				await assertUrl(page, `${process.env.URL}`, true);
				await menuItems.validateGuestItems();
            });
        }
    });

	    test.describe('Test deposit from other pages', () => {
        const navigationScenarios = [
            { scenario: 'Casino', action: (deps: any) => deps.navigationItems.clickCasinoButton() },
            { scenario: 'Promotions', action: (deps: any) => deps.navigationItems.clickPromotionsButton() }
        ];
        
        for (const { scenario, action } of navigationScenarios) {
            test(`Deposit from ${scenario} page`, async ({ profileMenu, navigationItems, menuItems, cashierGeneral }) => {
                await action({ menuItems, navigationItems });
                await menuItems.clickMyProfileButton();
                await profileMenu.validateProfileMenuElements(true);
                await profileMenu.clickDepositButton();
				await profileMenu.validateMenuHiddenByDeposit();
                await cashierGeneral.validateMainMenuVisible();
            });
        }
    });

	test.describe('Test closing main menu escape from other pages', () => {
        const navigationScenarios = [
            { scenario: 'Casino', action: (deps: any) => deps.navigationItems.clickCasinoButton() },
            { scenario: 'Promotions', action: (deps: any) => deps.navigationItems.clickPromotionsButton() }
        ];
        
        for (const { scenario, action } of navigationScenarios) {
            test(`Closing from ${scenario} page`, async ({ profileMenu, navigationItems, menuItems }) => {
                await action({ menuItems, navigationItems });
                await menuItems.clickMyProfileButton();
                await profileMenu.validateProfileMenuElements(true);
				await profileMenu.clickEscapeButton();
				await profileMenu.validateProfileMenuDialogNotVisible();
            });
        }
    });
});
