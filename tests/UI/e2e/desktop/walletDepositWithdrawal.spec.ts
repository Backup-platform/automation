import { CardDetails } from "../../../../pages/openCashier/cardDetails";
import test, { expect } from "../../../../pages/utils/base.po";
import  { PaymentIQ } from "../../../../pages/openCashier/paymentIQ.po"; 
import { assertEqualWithMessage } from '../../../../pages/utils/assertions';

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
            await assertEqualWithMessage(balanceFromHeader, balanceFromCashier, 
                `Header balance ${balanceFromHeader} = cashier balance ${balanceFromCashier} before deposit`);

            //Perform deposit and validate actions
            await cashierMain.validateAllModalElementsVisible();
            await cashierDeposit.performDepositFlow(true, 0, card);

            //validate amount after deposit
            await cashierDeposit.clickHomeButton();
            await assertEqualWithMessage(
                await headerMenuDesktop.getBalanceAmmount(),
                balanceFromHeader + parseFloat(cardAmount),
                `Header balance ${await headerMenuDesktop.getBalanceAmmount()} should increase by ${parseFloat(cardAmount)} amount after deposit`
            );
            balanceFromHeader = await headerMenuDesktop.getBalanceAmmount();
            
            await headerMenuDesktop.clickDepositButton();
            await assertEqualWithMessage(
                await cashierMain.getRealMoneyBalance(),
                balanceFromCashier + parseFloat(cardAmount),
                `Cashier balance ${await cashierMain.getRealMoneyBalance()} should increase by ${parseFloat(cardAmount)} amount after deposit`
            );
            balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await assertEqualWithMessage(
                balanceFromCashier,
                balanceFromHeader,
                `Header ${balanceFromHeader} = cashier ${balanceFromCashier} should match after deposit`
            );

            //Perform withdraw and validate actions
            await cashierMain.clickWithdrawAndValidate();
            await cashierWithdraw.performWithdrawFlow(true, 0, card);

            //validate amount after withdraw
            await cashierDeposit.clickHomeButton();
            await assertEqualWithMessage(
                await headerMenuDesktop.getBalanceAmmount(),
                balanceFromHeader - parseFloat(cardAmount),
                `Header balance ${await headerMenuDesktop.getBalanceAmmount()} should decrease by ${parseFloat(cardAmount)} amount after withdrawal`
            );
            balanceFromHeader = await headerMenuDesktop.getBalanceAmmount();
            
            await headerMenuDesktop.clickDepositButton();
            await assertEqualWithMessage(
                await cashierMain.getRealMoneyBalance(),
                balanceFromCashier - parseFloat(cardAmount),
                `Cashier balance ${await cashierMain.getRealMoneyBalance()} should decrease by ${parseFloat(cardAmount)} amount after withdrawal`
            );
            balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await assertEqualWithMessage(
                balanceFromCashier,
                balanceFromHeader,
                `Header ${balanceFromHeader} = cashier ${balanceFromCashier} should match after withdrawal`
            );
            await cashierMain.clickCloseButton();
        });
    });
});