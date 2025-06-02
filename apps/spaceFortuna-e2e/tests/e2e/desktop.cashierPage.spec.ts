// // import test, { expect } from "../../../pages/utils/base.po";

// // test.beforeEach(async ({ page, banner }) => {
// //     await page.goto(`${process.env.URL}`, { waitUntil: "load" });
// //     await banner.clickEscapeInOptIn();
// //     await banner.randomClickSkipSomething();
// //     await banner.sideBannerClickCloseBtn();
// //     await banner.randomBannerHiThere();
// //     await banner.acceptCookies();
// //     await banner.randomBannerNewDesign();
// //     //await paymentIQ.deleteAccountIfDropdownVisible(true);
// //     await banner.acceptTermsAndConditions();
// // });

// // const testData = [
// //     { amount: '10', cardNumber: '4111111111111111', expiry: '12/25', cvv: '123' }
// // ];

// // test.describe("Landing Page Smoke Tests", () => {
// //     test.describe("Desktop", () => {
// //         test.beforeEach(async ({ }, testInfo) => {
// //             if (!testInfo.project.name.includes('desktop')) { test.skip(); }
// //         });

// //         testData.forEach(({ amount, cardNumber, expiry, cvv }) => {
// //             test(`Validate cashier with amount ${amount}`, async ({ headerMenuDesktop, cashierMain, cashierDeposit, cashierWithdraw, paymentIQ }) => {

// //                 // Deposit flow up to payment
// //                 const { initialRealMoney } = await cashierDeposit.depositFlowUpToPayment({
// //                     isDesktop: true,
// //                     clickDeposit: () => headerMenuDesktop.clickDepositButton(),
// //                     getBalance: () => headerMenuDesktop.getBalanceAmmount()
// //                 });

// //                 // PaymentIQ actions
// //                 await paymentIQ.fillCardDetails(amount, cardNumber, expiry, cvv);
// //                 await paymentIQ.clickSetAmountButton();

// //                 // Deposit flow after payment
// //                 const { realMoneyAfterDepositMenu } = await cashierDeposit.depositFlowAfterPayment({
// //                     isDesktop: true, getBalance: () => headerMenuDesktop.getBalanceAmmount()
// //                 });

// //                 await expect(await realMoneyAfterDepositMenu).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

// //                 // Validate summary from cashier modal
// //                 const { realMoneyAfterDepositCahier } = await cashierDeposit.validateDepositSummaryFromCashierModal({
// //                     isDesktop: true,
// //                     clickDeposit: () => headerMenuDesktop.clickDepositButton(),
// //                     getCashierRealMoney: async () => parseFloat(await cashierMain.headingRealMoney().innerText()),
// //                     expectedAmount: initialRealMoney + parseFloat(amount)
// //                 });
// //                 await expect(realMoneyAfterDepositCahier).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

// //                 // Withdraw flow up to payment
// //                 await cashierMain.openWithdrawModalAndValidate();
// //                 await cashierWithdraw.withdrawFlowUpToPayment({ isDesktop: true });

// //                 // PaymentIQ actions for withdraw
// //                 await paymentIQ.fillAmount(amount);
// //                 await paymentIQ.clickSetAmountButton();

// //                 // Withdraw flow after payment
// //                 const { realMoneyAfterWithdrawMenu } = await cashierWithdraw.withdrawFlowAfterPayment({
// //                     isDesktop: true, getBalance: () => headerMenuDesktop.getBalanceAmmount()
// //                 });
// //                 await expect(await realMoneyAfterWithdrawMenu).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);

// //                 // Validate withdraw summary from cashier modal
// //                 const { realMoneyAfterWithdrawCahier } = await cashierWithdraw.validateWithdrawSummaryFromCashierModal({
// //                     isDesktop: true,
// //                     clickDeposit: () => headerMenuDesktop.clickDepositButton(),
// //                     getCashierRealMoney: async () => parseFloat(await cashierMain.headingRealMoney().innerText()),
// //                     expectedAmount: realMoneyAfterDepositMenu - parseFloat(amount)
// //                 });
// //                 await expect(realMoneyAfterWithdrawCahier).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);
// //             });
// //         });
// //     });

// //     test.describe("Mobile", () => {
// //         test.beforeEach(async ({ }, testInfo) => {
// //             if (!testInfo.project.name.includes('mobile')) { test.skip(); }
// //         });

// //         testData.forEach(({ amount, cardNumber, expiry, cvv }) => {
// //             test(`Validate cashier with amount ${amount}`, async ({ bottomMenu, cashierMain, cashierDeposit, cashierWithdraw, paymentIQ }) => {

// //                 // Deposit flow up to payment
// //                 const { initialRealMoney } = await cashierDeposit.depositFlowUpToPayment({
// //                     isDesktop: false,
// //                     clickDeposit: () => bottomMenu.clickDepositButton(),
// //                     getBalance: () => bottomMenu.getBalanceAmount()
// //                 });

// //                 // PaymentIQ actions
// //                 await paymentIQ.fillCardDetails(amount, cardNumber, expiry, cvv);
// //                 await paymentIQ.clickSetAmountButton();

// //                 // Deposit flow after payment
// //                 const { realMoneyAfterDepositMenu } = await cashierDeposit.depositFlowAfterPayment({
// //                     isDesktop: false,
// //                     getBalance: () => bottomMenu.getBalanceAmount()
// //                 });

// //                 await expect(await realMoneyAfterDepositMenu).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

// //                 // Validate summary from cashier modal
// //                 const { realMoneyAfterDepositCahier } = await cashierDeposit.validateDepositSummaryFromCashierModal({
// //                     isDesktop: false,
// //                     clickDeposit: () => bottomMenu.clickDepositButton(),
// //                     getCashierRealMoney: async () => parseFloat(await cashierMain.headingRealMoney().innerText()),
// //                     expectedAmount: initialRealMoney + parseFloat(amount)
// //                 });
// //                 await expect(realMoneyAfterDepositCahier).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

// //                 // Withdraw flow up to payment
// //                 await cashierMain.openWithdrawModalAndValidate();
// //                 await cashierWithdraw.withdrawFlowUpToPayment({ isDesktop: false });

// //                 // PaymentIQ actions for withdraw
// //                 await paymentIQ.fillAmount(amount);
// //                 await paymentIQ.clickSetAmountButton();

// //                 // Withdraw flow after payment
// //                 const { realMoneyAfterWithdrawMenu } = await cashierWithdraw.withdrawFlowAfterPayment({
// //                     isDesktop: false,
// //                     getBalance: () => bottomMenu.getBalanceAmount()
// //                 });
// //                 await expect(await realMoneyAfterWithdrawMenu).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);

// //                 // Validate withdraw summary from cashier modal
// //                 const { realMoneyAfterWithdrawCahier } = await cashierWithdraw.validateWithdrawSummaryFromCashierModal({
// //                     isDesktop: false,
// //                     clickDeposit: () => bottomMenu.clickDepositButton(),
// //                     getCashierRealMoney: async () => parseFloat(await cashierMain.headingRealMoney().innerText()),
// //                     expectedAmount: realMoneyAfterDepositMenu - parseFloat(amount)
// //                 });
// //                 await expect(realMoneyAfterWithdrawCahier).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);
// //             });
// //         });
// //     });
// // });

// test.use({ storageState: 'apps/spaceFortuna-e2e/playwright/.auth/noAuthentication.json' });

// import test, { expect } from "../../pages/utils/base.po";

// test.beforeEach(async ({ page, banner }) => {
//     await page.goto(`${process.env.URL}`, { waitUntil: "load" });
//     await banner.clickEscapeInOptIn();
//     await banner.randomClickSkipSomething();
//     await banner.sideBannerClickCloseBtn();
//     await banner.randomBannerHiThere();
//     await banner.acceptCookies();
//     await banner.randomBannerNewDesign();
//     //await paymentIQ.deleteAccountIfDropdownVisible(true);
//     await banner.acceptTermsAndConditions();
// });

// const testData = [
//     { amount: '10', cardNumber: '4111111111111111', expiry: '12/25', cvv: '123' }
// ];

// test.describe("Landing Page Smoke Tests", () => {
//     test.describe("Desktop", () => {
//         test.beforeEach(async ({ }, testInfo) => {
//             if (!testInfo.project.name.includes('desktop')) { test.skip(); }
//         });

//         testData.forEach(({ amount, cardNumber, expiry, cvv }) => {
//             test(`Validate cashier with amount ${amount}`, async ({ headerMenuDesktop, cashierMain, cashierDeposit, cashierWithdraw, paymentIQ }) => {

//                 // Deposit flow up to payment
//                 const { initialRealMoney } = await cashierDeposit.depositFlowUpToPayment({
//                     isDesktop: true,
//                     clickDeposit: () => headerMenuDesktop.clickDepositButton(),
//                     getBalance: () => headerMenuDesktop.getBalanceAmmount()
//                 });

//                 // PaymentIQ actions
//                 await paymentIQ.fillCardDetails(amount, cardNumber, expiry, cvv);
//                 await paymentIQ.clickSetAmountButton();

//                 // Deposit flow after payment
//                 const { realMoneyAfterDepositMenu } = await cashierDeposit.depositFlowAfterPayment({
//                     isDesktop: true, getBalance: () => headerMenuDesktop.getBalanceAmmount()
//                 });

//                 await expect(await realMoneyAfterDepositMenu).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

//                 // Validate summary from cashier modal
//                 const { realMoneyAfterDepositCahier } = await cashierDeposit.validateDepositSummaryFromCashierModal({
//                     isDesktop: true,
//                     clickDeposit: () => headerMenuDesktop.clickDepositButton(),
//                     getCashierRealMoney: async () => parseFloat(await cashierMain.headingRealMoney().innerText()),
//                     expectedAmount: initialRealMoney + parseFloat(amount)
//                 });
//                 await expect(realMoneyAfterDepositCahier).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

//                 // Withdraw flow up to payment
//                 await cashierMain.openWithdrawModalAndValidate();
//                 await cashierWithdraw.withdrawFlowUpToPayment({ isDesktop: true });

//                 // PaymentIQ actions for withdraw
//                 await paymentIQ.fillAmount(amount);
//                 await paymentIQ.clickSetAmountButton();

//                 // Withdraw flow after payment
//                 const { realMoneyAfterWithdrawMenu } = await cashierWithdraw.withdrawFlowAfterPayment({
//                     isDesktop: true, getBalance: () => headerMenuDesktop.getBalanceAmmount()
//                 });
//                 await expect(await realMoneyAfterWithdrawMenu).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);

//                 // Validate withdraw summary from cashier modal
//                 const { realMoneyAfterWithdrawCahier } = await cashierWithdraw.validateWithdrawSummaryFromCashierModal({
//                     isDesktop: true,
//                     clickDeposit: () => headerMenuDesktop.clickDepositButton(),
//                     getCashierRealMoney: async () => parseFloat(await cashierMain.headingRealMoney().innerText()),
//                     expectedAmount: realMoneyAfterDepositMenu - parseFloat(amount)
//                 });
//                 await expect(realMoneyAfterWithdrawCahier).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);
//             });
//         });
//     });

//     test.describe("Mobile", () => {
//         test.beforeEach(async ({ }, testInfo) => {
//             if (!testInfo.project.name.includes('mobile')) { test.skip(); }
//         });

//         testData.forEach(({ amount, cardNumber, expiry, cvv }) => {
//             test(`Validate cashier with amount ${amount}`, async ({ bottomMenu, cashierMain, cashierDeposit, cashierWithdraw, paymentIQ }) => {

//                 // Deposit flow up to payment
//                 const { initialRealMoney } = await cashierDeposit.depositFlowUpToPayment({
//                     isDesktop: false,
//                     clickDeposit: () => bottomMenu.clickDepositButton(),
//                     getBalance: () => bottomMenu.getBalanceAmount()
//                 });

//                 // PaymentIQ actions
//                 await paymentIQ.fillCardDetails(amount, cardNumber, expiry, cvv);
//                 await paymentIQ.clickSetAmountButton();

//                 // Deposit flow after payment
//                 const { realMoneyAfterDepositMenu } = await cashierDeposit.depositFlowAfterPayment({
//                     isDesktop: false,
//                     getBalance: () => bottomMenu.getBalanceAmount()
//                 });

//                 await expect(await realMoneyAfterDepositMenu).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

//                 // Validate summary from cashier modal
//                 const { realMoneyAfterDepositCahier } = await cashierDeposit.validateDepositSummaryFromCashierModal({
//                     isDesktop: false,
//                     clickDeposit: () => bottomMenu.clickDepositButton(),
//                     getCashierRealMoney: async () => parseFloat(await cashierMain.headingRealMoney().innerText()),
//                     expectedAmount: initialRealMoney + parseFloat(amount)
//                 });
//                 await expect(realMoneyAfterDepositCahier).toBeCloseTo(await initialRealMoney + parseFloat(amount), 2);

//                 // Withdraw flow up to payment
//                 await cashierMain.openWithdrawModalAndValidate();
//                 await cashierWithdraw.withdrawFlowUpToPayment({ isDesktop: false });

//                 // PaymentIQ actions for withdraw
//                 await paymentIQ.fillAmount(amount);
//                 await paymentIQ.clickSetAmountButton();

//                 // Withdraw flow after payment
//                 const { realMoneyAfterWithdrawMenu } = await cashierWithdraw.withdrawFlowAfterPayment({
//                     isDesktop: false,
//                     getBalance: () => bottomMenu.getBalanceAmount()
//                 });
//                 await expect(await realMoneyAfterWithdrawMenu).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);

//                 // Validate withdraw summary from cashier modal
//                 const { realMoneyAfterWithdrawCahier } = await cashierWithdraw.validateWithdrawSummaryFromCashierModal({
//                     isDesktop: false,
//                     clickDeposit: () => bottomMenu.clickDepositButton(),
//                     getCashierRealMoney: async () => parseFloat(await cashierMain.headingRealMoney().innerText()),
//                     expectedAmount: realMoneyAfterDepositMenu - parseFloat(amount)
//                 });
//                 await expect(realMoneyAfterWithdrawCahier).toBeCloseTo(await realMoneyAfterDepositMenu - parseFloat(amount), 2);
//             });
//         });
//     });
// });

