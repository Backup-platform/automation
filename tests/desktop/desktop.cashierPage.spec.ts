import test, { expect } from "../../pages/utils/base.po";


test.beforeEach(async ({ page, banner, paymentIQ }) => {
    await page.goto(`${process.env.URL}`, { waitUntil: "load" });
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await banner.sideBannerClickCloseBtn();
    await banner.randomBannerHiThere();
    await banner.acceptCookies();
    await banner.randomBannerNewDesign();
    await paymentIQ.deleteAccountIfDropdownVisible(true);
});

const testData = [
    { amount: '10', cardNumber: '4111111111111111', expiry: '12/25', cvv: '123' }
];

test.describe("Landing Page Smoke Tests", () => {
    test.describe("Desktop", () => {
        test.beforeEach(async ({ }, testInfo) => {
            if (!testInfo.project.name.includes('desktop')) { test.skip(); }
        });

        testData.forEach(({ amount, cardNumber, expiry, cvv }) => {
            test(`Validate cashier with amount ${amount}`, async ({ headerMenuDesktop, cashierMain, cashierDeposit, page, cashierWithdraw, paymentIQ }) => {

                const initialRealMoney = await headerMenuDesktop.getBalanceAmmount();

                await headerMenuDesktop.clickDepositButton();
                await cashierMain.validateAllModalElementsVisible();
                await cashierDeposit.validateStepsCounterDesktop();
                await cashierDeposit.validateActiveStepElements();
                await cashierDeposit.validateBonusStepElements();
                await cashierDeposit.clickDepositWithoutBonus();
                await cashierDeposit.validatePaymentStepElementsDesktop(true);
                await paymentIQ.fillCardDetails(amount, cardNumber, expiry, cvv);
                await paymentIQ.clickSetAmountButton();
                await cashierDeposit.validateSummaryStepElementsDesktop();
                await paymentIQ.validateDepositIframeLocatorsVisible();

                await cashierDeposit.clickHomeButton();
                const realMoneyAfterDepositMenu = await headerMenuDesktop.getBalanceAmmount();
                await expect(await realMoneyAfterDepositMenu).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

                await headerMenuDesktop.clickDepositButton();
                const realMoneyAfterDepositCahier = parseFloat(await cashierMain.headingRealMoney().innerText());
                await expect(await realMoneyAfterDepositCahier).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

                await cashierMain.validateAllModalElementsVisible();
                await cashierMain.clickWithdrawHeading();
                await cashierMain.validateAllModalElementsVisible();
                await cashierWithdraw.validateStepsCounterDesktop();
                await cashierWithdraw.validatePaymentStepElementsDesktop();
                await paymentIQ.fillAmount(amount);
                await paymentIQ.clickSetAmountButton();
                await cashierWithdraw.validateSummaryStepElementsDesktop();
                await paymentIQ.validateWithdrawIframeLocatorsVisible();

                await cashierWithdraw.clickHomeButton();
                const realMoneyAfterWithdrawMenu = await headerMenuDesktop.getBalanceAmmount();
                await expect(await realMoneyAfterWithdrawMenu).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);

                await headerMenuDesktop.clickDepositButton();
                const realMoneyAfterWithdrawCahier = parseFloat(await cashierMain.headingRealMoney().innerText());
                await expect(await realMoneyAfterWithdrawCahier).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);
            });
        });
    });

    test.describe("Mobile", () => {
        test.beforeEach(async ({ }, testInfo) => {
            if (!testInfo.project.name.includes('mobile')) { test.skip(); }
        });

        testData.forEach(({ amount, cardNumber, expiry, cvv }) => {
            test(`Validate cashier with amount ${amount}`, async ({ footerMenuMobile, cashierMain, cashierDeposit, page, cashierWithdraw, paymentIQ }) => {

                const initialRealMoney = await footerMenuMobile.getWalletBalance();

                await footerMenuMobile.clickDepositButton();
                await cashierMain.validateAllModalElementsVisible();
                await cashierDeposit.validateStepsCounterMobile();
                await cashierDeposit.validateBonusStepElements();
                await cashierDeposit.clickDepositWithoutBonus();
                await cashierDeposit.validatePaymentStepElementsMobile();
                await cashierDeposit.clickPaymentContinueButton();
                await cashierDeposit.validateDetailsStepElementsMobile();
                await paymentIQ.fillCardDetails(amount, cardNumber, expiry, cvv);
                await paymentIQ.clickSetAmountButton();
                await cashierDeposit.validateSummaryStepElementsMobile();
                await paymentIQ.validateDepositIframeLocatorsVisible();

                await cashierDeposit.clickHomeButton();
                const realMoneyAfterDepositMenu = await footerMenuMobile.getWalletBalance();
                await expect(await realMoneyAfterDepositMenu).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

                await footerMenuMobile.clickDepositButton();
                const realMoneyAfterDepositCahier = parseFloat(await cashierMain.headingRealMoney().innerText());
                await expect(await realMoneyAfterDepositCahier).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

                await cashierMain.validateAllModalElementsVisible();
                await cashierMain.clickWithdrawHeading();
                await cashierMain.validateAllModalElementsVisible();
                await cashierWithdraw.validateStepsCounterMobile();
                await cashierWithdraw.validatePaymentStepElementsMobile();
                await cashierWithdraw.clickContinueButton();
                await cashierWithdraw.validateDetailsStepElementsMobile();
                await paymentIQ.fillAmount(amount);
                await paymentIQ.clickSetAmountButton();
                await cashierWithdraw.validateSummaryStepElementsMobile();
                await paymentIQ.validateWithdrawIframeLocatorsVisible();

                await cashierWithdraw.clickHomeButton();
                const realMoneyAfterWithdrawMenu = await footerMenuMobile.getWalletBalance();
                await expect(await realMoneyAfterWithdrawMenu).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);

                await footerMenuMobile.clickDepositButton();
                const realMoneyAfterWithdrawCahier = parseFloat(await cashierMain.headingRealMoney().innerText());
                await expect(await realMoneyAfterWithdrawCahier).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);
            });
        });
    });
});

