import { CardDetails } from "../../../../pages/openCashier/cardDetails";
import test, { expect } from "../../../../pages/utils/base.po";
import  { PaymentIQ } from "../../../../pages/openCashier/paymentIQ.po"; 

test.beforeEach(async ({ page, banner, paymentIQ }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: "load" });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
    await paymentIQ.deleteAccountIfDropdownVisible(true);
    await banner.acceptTermsAndConditions();
});

const testData = [
    { cardAmount: '10', cardNumber: '4111111111111111', cardExpiry: '12/25', cvvCard: '123' }
];

test.describe("Desktop end to end tests", () => {
    testData.forEach(({ cardAmount, cardNumber, cardExpiry, cvvCard }) => {
        test(`Validate cashier Deposit and Withdrawal with amount ${cardAmount}`, async ({ headerMenuDesktop, cashierMain, cashierDeposit, cashierWithdraw, paymentIQ }) => {
            const card: CardDetails = {
                amount: cardAmount,
                number: cardNumber,
                expiry: cardExpiry,
                cvv: cvvCard
            };

            //Get initial balance
            let balanceFromHeader = await headerMenuDesktop.getBalanceAmmount();
            await headerMenuDesktop.clickDepositButton();
            let balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await expect(balanceFromHeader).toEqual(balanceFromCashier);

            //Perform deposit and validate actions
            await cashierMain.validateAllModalElementsVisible();
            await cashierDeposit.performDepositFlow(true, 0, card);

            //validate amount after deposit
            await cashierDeposit.clickHomeButton();
            await expect(await headerMenuDesktop.getBalanceAmmount()).toEqual(balanceFromHeader + parseFloat(cardAmount));
            balanceFromHeader = await headerMenuDesktop.getBalanceAmmount();
            
            await headerMenuDesktop.clickDepositButton();
            await expect(await cashierMain.getRealMoneyBalance()).toEqual(balanceFromCashier + parseFloat(cardAmount));
            balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await expect(balanceFromCashier).toEqual(balanceFromHeader);

            //Perform withdraw and validate actions
            await cashierMain.clickWithdrawAndValidate();
            await cashierWithdraw.performWithdrawFlow(true, 0, card);

            //validate amount after withdraw
            await cashierDeposit.clickHomeButton();
            await expect(await headerMenuDesktop.getBalanceAmmount()).toEqual(balanceFromHeader - parseFloat(cardAmount));
            balanceFromHeader = await headerMenuDesktop.getBalanceAmmount();
            
            await headerMenuDesktop.clickDepositButton();
            await expect(await cashierMain.getRealMoneyBalance()).toEqual(balanceFromCashier - parseFloat(cardAmount));
            balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await expect(balanceFromCashier).toEqual(balanceFromHeader);
            await cashierMain.clickCloseButton();
        });
    });
});