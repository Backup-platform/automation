import test from "../../../pages/base/base.po";
import path from 'path';

test.beforeEach(async ({ page, menuItems }) => {
    await page.goto(`${process.env.URL}`);
    // await banner.clickEscapeInOptIn();
    // await banner.randomClickSkipSomething();
    // await banner.bannerNewDesign();
    // await banner.bannerHiThere();
    // await banner.acceptCookies();
    // await banner.acceptTermsAndConditions();
    await menuItems.clickRegister();
});

test.describe('Signup Smoke Tests - Desktop', () => {
    test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });

    // test('Validate SignUp', async ({ signUpEmail, loginPage, signUpStep1, signUpSecondStep, signUpThirdStep }) => {
    //     await signUpStep1.fillFirstStep("Somemail@something.com", 'Password@');
    //     await signUpStep1.clickNextButton();
    //     await signUpSecondStep.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
    //     await signUpSecondStep.clickAlmostDoneButton();
    //     await signUpThirdStep.fillThirdStep('Toronto', '1337 Blvrd', '42', '3065344301', 'Canada', '+1');
    //     await signUpThirdStep.clickEnterButton();
    //     await signUpEmail.validateRegistrationEmailSent(test.info().project.name);
    //     await loginPage.validateLoginWindowElementsVisible(false);
    // });

    test('Validate SignUp with no credentials', async ({ signUpStep1 }) => {
        await signUpStep1.clickNextButton();
        await signUpStep1.validateEmailError();
        await signUpStep1.validatePasswordError();
        await signUpStep1.validatePreferencesErrorVisible();
    });

    test('Validate SignUp with no email', async ({ signUpStep1 }) => {
        await signUpStep1.fillPassword('Password@1');
        await signUpStep1.selectPreference('CASINO');
        await signUpStep1.clickNextButton();
        await signUpStep1.validateEmailError();
    });

    test('Validate SignUp with no password', async ({ signUpStep1 }) => {
        await signUpStep1.fillEmail('abc@abv.bg');
        await signUpStep1.selectAndValidatePreference('ALL');
        await signUpStep1.clickNextButton();
        await signUpStep1.validatePasswordError();
    });

    test('Validate SignUp with no preference', async ({ signUpStep1 }) => {
        await signUpStep1.fillEmail('abc@abv.bg');
        await signUpStep1.fillPassword('Password@1');
        await signUpStep1.clickNextButton();
        await signUpStep1.validatePreferencesErrorVisible();
    });

    //TODO: make a test for duplicate emails
});
