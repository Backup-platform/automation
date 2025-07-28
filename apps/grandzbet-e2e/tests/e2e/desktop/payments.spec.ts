import test from '../../../pages/base/base.po';

test.beforeEach(async ({ page, paymentIQ }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: "load" });
    await paymentIQ.deleteAccountIfDropdownVisible();
});

test.describe.skip('Validate payments', () => {
      
      const calculateExpectedBalance = (currentBalance: string, amount: number): string => {
            const numericValue = parseFloat(currentBalance.replace(/[^0-9.-]/g, ''));
            const newNumericValue = (numericValue + amount).toFixed(2);
            const currencyFormat = currentBalance.replace(/[0-9.-]/g, '');
            return currencyFormat + newNumericValue;
      };
      
      test(`Cashier e2e scenario`, async ({ cashierGeneral, menuItems, wallet }) => {
            await menuItems.clickBalanceButton();

            //initial wallet balances
            const initialRealMoney = await wallet.getRealMoneyBalanceValue();
            const initialTotalBalance = await wallet.getTotalBalanceValue();

            await wallet.clickDepositButton();
            await cashierGeneral.completeFullDepositFlow(0, '25');
            await cashierGeneral.clickCloseButton();            

            //wallet balances after deposit (+25)
            const depositAmount = 25;
            const expectedRealMoneyAfterDeposit = calculateExpectedBalance(initialRealMoney, depositAmount);
            const expectedTotalAfterDeposit = calculateExpectedBalance(initialTotalBalance, depositAmount);

            await wallet.validateRealMoneyBalanceEquals(expectedRealMoneyAfterDeposit);
            await wallet.validateTotalBalanceEquals(expectedTotalAfterDeposit);
            
            await wallet.clickDepositButton();
            await cashierGeneral.completeFullWithdrawFlow(0, '25');
            await cashierGeneral.clickCloseButton();            

            //wallet balances after withdraw (-25)
            const withdrawAmount = -25;
            const expectedRealMoneyAfterWithdraw = calculateExpectedBalance(expectedRealMoneyAfterDeposit, withdrawAmount);
            const expectedTotalAfterWithdraw = calculateExpectedBalance(expectedTotalAfterDeposit, withdrawAmount);
            
            await wallet.validateRealMoneyBalanceEquals(expectedRealMoneyAfterWithdraw);
            await wallet.validateTotalBalanceEquals(expectedTotalAfterWithdraw);

            //back to initial values (deposit +25, then withdraw -25 = original)
            await wallet.validateRealMoneyBalanceEquals(initialRealMoney);
            await wallet.validateTotalBalanceEquals(initialTotalBalance);
      });
});