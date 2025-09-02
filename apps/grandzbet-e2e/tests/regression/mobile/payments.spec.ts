import test from '../../../pages/base/base.po';

test.beforeEach(async ({ page, paymentIQ }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
      await paymentIQ.deleteAccountIfDropdownVisible();
});

      //TODO: negative test - navigate from step 3 to step 2 and attempt to go back to step 3 ( you shouldnt be able to do that )
      //TODO: swap active bonuses. 
      //TODO: validate back button and functionality navigation in steps 
test.describe('Cashier Steps navigation', () => {      

      test('Deposit: Step 1 to Step 2', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.validateOnlyOneStepActive('deposit', 1);
            await cashierGeneral.goToStep('deposit', 2);
            await cashierGeneral.clickCloseButton();
      });

      test('Deposit Direct: Step 2 to Step 1', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.validateOnlyOneStepActive('deposit', 1);
            await cashierGeneral.goToStep('deposit', 2);
            await cashierGeneral.goToStep('deposit', 1);
            await cashierGeneral.clickCloseButton();
      });

      test('Deposit Direct: Step 3 to Step 1', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.validateOnlyOneStepActive('deposit', 1);
            await cashierGeneral.completeDepositStep1();
            await cashierGeneral.completeDepositStep2(0);
            await cashierGeneral.goToStep('deposit', 3);
            await cashierGeneral.clickCloseButton();
      });

      test('Deposit Direct: Step 3 to Step 2', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.validateOnlyOneStepActive('deposit', 1);
            await cashierGeneral.completeDepositStep1();
            await cashierGeneral.completeDepositStep2(0);
            await cashierGeneral.goToStep('deposit', 2);
            await cashierGeneral.clickCloseButton();
      });

      test('Deposit Direct: Step 4 to Step 1', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.validateOnlyOneStepActive('deposit', 1);
            await cashierGeneral.completeDepositStep1();
            await cashierGeneral.completeDepositStep2(0);
            await cashierGeneral.completeDepositStep3('25', '4444493318246892', '12/25', '123');
            await cashierGeneral.goToStep('deposit', 1);
            await cashierGeneral.clickCloseButton();
      });

      test('Deposit Direct: Step 4 to Step 2', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.validateOnlyOneStepActive('deposit', 1);
            await cashierGeneral.completeDepositStep1();
            await cashierGeneral.completeDepositStep2(0);
            await cashierGeneral.completeDepositStep3('25', '4444493318246892', '12/25', '123');
            await cashierGeneral.goToStep('deposit', 2);
            await cashierGeneral.clickCloseButton();
      });

      test('Deposit Next: Step 2 to Step 3 (after selecting payment method)', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.goToStep('deposit', 1);
            await cashierGeneral.completeDepositStep1();
            await cashierGeneral.completeDepositStep2(0);
            await cashierGeneral.clickCloseButton();
      });

      test('Deposit Next: Step 3 to Step 4 (after making deposit)', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.validateOnlyOneStepActive('deposit', 1);
            await cashierGeneral.completeDepositStep1();
            await cashierGeneral.completeDepositStep2(0);
            await cashierGeneral.completeDepositStep3('25', '4444493318246892', '12/25', '123');
            await cashierGeneral.clickCloseButton();
      });

      test('Withdraw Direct: Step 1 to Step 2', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.clickTabButton('withdraw');
            await cashierGeneral.validateOnlyOneStepActive('withdraw', 1);
            await cashierGeneral.completeWithdrawStep1(0);
            await cashierGeneral.validateOnlyOneStepActive('withdraw', 2);
            await cashierGeneral.clickCloseButton();
      });

      test('Withdraw Direct: Step 2 to Step 1', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.clickTabButton('withdraw');
            await cashierGeneral.validateOnlyOneStepActive('withdraw', 1);
            await cashierGeneral.completeWithdrawStep1(0);
            await cashierGeneral.validateOnlyOneStepActive('withdraw', 2);
            await cashierGeneral.goToStep('withdraw', 1);
            await cashierGeneral.clickCloseButton();
      });

      test('Withdraw Direct: Step 3 to Step 1', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.clickTabButton('withdraw');
            await cashierGeneral.validateOnlyOneStepActive('withdraw', 1);
            await cashierGeneral.completeWithdrawStep1(0);
            await cashierGeneral.completeWithdrawStep2('25');
            await cashierGeneral.goToStep('withdraw', 1);
            await cashierGeneral.clickCloseButton();
      });

      test('Withdraw Direct: Step 3 to Step 2', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.clickTabButton('withdraw');
            await cashierGeneral.validateOnlyOneStepActive('withdraw', 1);
            await cashierGeneral.completeWithdrawStep1(0);
            await cashierGeneral.completeWithdrawStep2('25');
            await cashierGeneral.goToStep('withdraw', 2);
            await cashierGeneral.clickCloseButton();
      });

      test('Withdraw Next: Step 1 to Step 2 (after selecting payment method)', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.clickTabButton('withdraw');
            await cashierGeneral.validateOnlyOneStepActive('withdraw', 1);
            await cashierGeneral.completeWithdrawStep1(0);
            await cashierGeneral.clickCloseButton();
      });

      test('Withdraw Next: Step 2 to Step 3 (after entering amount)', async ({ cashierGeneral, menuItems }) => {
            await menuItems.clickDepositButton();
            await cashierGeneral.clickTabButton('withdraw');
            await cashierGeneral.validateOnlyOneStepActive('withdraw', 1);
            await cashierGeneral.completeWithdrawStep1(0);
            await cashierGeneral.completeWithdrawStep2('25');
            await cashierGeneral.clickCloseButton();
      });
});