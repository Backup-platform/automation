import { CardDetails } from "../../../../pages/openCashier/cardDetails";
import test, { expect } from "../../../../pages/utils/base.po";
import  { PaymentIQ } from "../../../../pages/openCashier/paymentIQ.po"; 

test.beforeEach(async ({ page, banner, paymentIQ }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: "load" });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
    await paymentIQ.deleteAccountIfDropdownVisible(true);
    await banner.acceptTermsAndConditions();
    await banner.randomBannerHiThere();
});

const testData = [
    { cardAmount: '10', cardNumber: '4111111111111111', cardExpiry: '12/25', cvvCard: '123' }
];

test.describe("Mobile end to end tests", () => {
    testData.forEach(({ cardAmount, cardNumber, cardExpiry, cvvCard }) => {
        test(`Validate cashier Deposit and Withdrawal with amount ${cardAmount}`, async ({ bottomMenu, cashierMain, cashierDeposit, cashierWithdraw, page }) => {
            const card: CardDetails = {
                amount: cardAmount,
                number: cardNumber,
                expiry: cardExpiry,
                cvv: cvvCard
            };

            //Get initial balance
            let balanceFromHeader = await bottomMenu.getBalanceAmount();
            await bottomMenu.clickDepositButton();
            let balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await expect(balanceFromHeader).toEqual(balanceFromCashier);

            //Perform deposit and validate actions
            await cashierMain.validateAllModalElementsVisible();
            await page.waitForTimeout(1000); //FIXME: wait for the modal to be visible
            await cashierDeposit.performDepositFlow(false, 0, card);

            //validate amount after deposit
            await cashierDeposit.clickHomeButton();
            await expect(await bottomMenu.getBalanceAmount()).toEqual(balanceFromHeader + parseFloat(cardAmount));
            balanceFromHeader = await bottomMenu.getBalanceAmount();

            await bottomMenu.clickDepositButton();
            await expect(await cashierMain.getRealMoneyBalance()).toEqual(balanceFromCashier + parseFloat(cardAmount));
            balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await expect(balanceFromCashier).toEqual(balanceFromHeader);
            await page.waitForTimeout(1000); //FIXME: wait for the modal to be visible
            //Perform withdraw and validate actions
            await cashierMain.clickWithdrawAndValidate();
            await cashierWithdraw.performWithdrawFlow(false, 0, card);

            //validate amount after withdraw
            await cashierDeposit.clickHomeButton();
            await expect(await bottomMenu.getBalanceAmount()).toEqual(balanceFromHeader - parseFloat(cardAmount));
            balanceFromHeader = await bottomMenu.getBalanceAmount();

            await bottomMenu.clickDepositButton();
            await expect(await cashierMain.getRealMoneyBalance()).toEqual(balanceFromCashier - parseFloat(cardAmount));
            balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await expect(balanceFromCashier).toEqual(balanceFromHeader);
            await cashierMain.clickCloseButton();
        });
    });
});

