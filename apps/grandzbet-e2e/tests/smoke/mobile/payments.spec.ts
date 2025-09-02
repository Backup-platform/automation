import test from '../../../pages/base/base.po';

test.beforeEach(async ({ page, paymentIQ }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
      await paymentIQ.deleteAccountIfDropdownVisible();
});

test.describe('Navigate to cashier', () => 
{
      test('Navigate to cashier from wallet', async ({ menuItems, wallet, cashierGeneral }) => {
            await menuItems.clickBalanceButton();
            await wallet.clickDepositButton();
            await cashierGeneral.validateMainMenuVisible();
            await cashierGeneral.clickCloseButton();
            await cashierGeneral.validateMainMenuNotVisible();
      });

      test('Navigate to cashier from main menu', async ({ menuItems, cashierGeneral }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.validateMainMenuVisible();
            await cashierGeneral.clickCloseButton();
            await cashierGeneral.validateMainMenuNotVisible();
      });

      test('Navigate to cashier from my profile', async ({ menuItems, cashierGeneral, profileMenu }) => {
            await menuItems.clickMyProfileButton();
            await profileMenu.clickDepositButton();
            await cashierGeneral.validateMainMenuVisible();
            await cashierGeneral.clickCloseButton();
            await cashierGeneral.validateMainMenuNotVisible();
      });
});

test.describe('Validate payment method options', () => {      
      test('Deposit ', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.goToStep('deposit', 2);
            await cashierGeneral.validateNextButtonDisabled();

            await cashierGeneral.selectPaymentMethod('deposit', 0);
            await cashierGeneral.validateNextButtonEnabled();

            await cashierGeneral.selectPaymentMethod('deposit', 1);
            await cashierGeneral.validateNextButtonEnabled();
            await cashierGeneral.clickCloseButton();
      });
      
      test('Withdraw ', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.clickTabButton('withdraw');
            await cashierGeneral.validateNextButtonDisabled();

            await cashierGeneral.selectPaymentMethod('withdraw', 0);
            await cashierGeneral.validateNextButtonEnabled();

            await cashierGeneral.selectPaymentMethod('withdraw', 1);
            await cashierGeneral.validateNextButtonEnabled();

            await cashierGeneral.clickCloseButton();
      });
});

test.describe('Validate cashier deposit/withdraw tab button activity', () => {
    test('Tab buttons show correct active state', async ({ cashierGeneral, menuItems }) => {
        await menuItems.clickDepositButton();

        await cashierGeneral.validateTabButtonActive('deposit');
        await cashierGeneral.switchBetweenTabs('withdraw');
        await cashierGeneral.switchBetweenTabs('deposit');
        await cashierGeneral.clickCloseButton();
    });
});