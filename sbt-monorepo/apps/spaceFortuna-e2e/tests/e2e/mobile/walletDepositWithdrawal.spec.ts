import { CardDetails } from "../../../pages/openCashier/cardDetails";
import test from "../../../pages/utils/base.po";
import { assertEqualWithMessage } from '../../../pages/utils/assertions';


test.beforeEach(async ({ page, banner, paymentIQ }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: "load" });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
    await paymentIQ.deleteAccountIfDropdownVisible();
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
            await assertEqualWithMessage(
                balanceFromHeader,
                balanceFromCashier,
                `Menu balance ${balanceFromHeader} = cashier balance ${balanceFromCashier} before deposit`
            );

            //Perform deposit and validate actions
            await cashierMain.validateAllModalElementsVisible();
            await page.waitForTimeout(1000); //FIXME: wait for the modal to be visible
            await cashierDeposit.performDepositFlow(false, 0, card);

            //validate amount after deposit
            await cashierDeposit.clickHomeButton();
            await assertEqualWithMessage(
                await bottomMenu.getBalanceAmount(),
                balanceFromHeader + parseFloat(cardAmount),
                `Menu balance ${await bottomMenu.getBalanceAmount()} should increase by ${parseFloat(cardAmount)} amount after deposit`
            );
            balanceFromHeader = await bottomMenu.getBalanceAmount();

            await bottomMenu.clickDepositButton();
            await assertEqualWithMessage(
                await cashierMain.getRealMoneyBalance(),
                balanceFromCashier + parseFloat(cardAmount),
                `Cashier balance ${await cashierMain.getRealMoneyBalance()} should increase by ${parseFloat(cardAmount)} amount after deposit`
            );
            balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await assertEqualWithMessage(
                balanceFromCashier,
                balanceFromHeader,
                `Menu ${balanceFromHeader} = cashier ${balanceFromCashier} should match after deposit`
            );
            await page.waitForTimeout(1000); //FIXME: wait for the modal to be visible
            //Perform withdraw and validate actions
            await cashierMain.clickWithdrawAndValidate();
            await cashierWithdraw.performWithdrawFlow(false, 0, card);

            //validate amount after withdraw
            await cashierDeposit.clickHomeButton();
            await assertEqualWithMessage(
                await bottomMenu.getBalanceAmount(),
                balanceFromHeader - parseFloat(cardAmount),
                `Menu balance ${await bottomMenu.getBalanceAmount()} should decrease by ${parseFloat(cardAmount)} amount after withdrawal`
            );
            balanceFromHeader = await bottomMenu.getBalanceAmount();

            await bottomMenu.clickDepositButton();
            await assertEqualWithMessage(
                await cashierMain.getRealMoneyBalance(),
                balanceFromCashier - parseFloat(cardAmount),
                `Cashier balance ${await cashierMain.getRealMoneyBalance()} should decrease by ${parseFloat(cardAmount)} amount after withdrawal`
            );
            balanceFromCashier = await cashierMain.getRealMoneyBalance();
            await assertEqualWithMessage(
                balanceFromCashier,
                balanceFromHeader,
                `Menu ${balanceFromHeader} = cashier ${balanceFromCashier} should match after withdrawal`
            );
            await cashierMain.clickCloseButton();
        });
    });
});

