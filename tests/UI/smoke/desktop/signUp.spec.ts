import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, headerMenuDesktop }) => {
    await page.goto(`${process.env.URL}`);
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await headerMenuDesktop.clickRegisterButton();
});

test.describe('Signup Smoke Tests - Desktop', () => {
    test.use({ storageState: 'playwright/.auth/noAuthentication.json' });

    test('Validate SignUp', async ({ signUp, loginPage, signUpFirstStep, signUpSecondStep, signUpThirdStep }) => {
        await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@');
        await signUpFirstStep.clickNextButton();
        await signUpSecondStep.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
        await signUpSecondStep.clickAlmostDoneButton();
        await signUpThirdStep.fillThirdStep('Toronto', '1337 Blvrd', '42', '3065344301', 'Canada', '+1');
        await signUpThirdStep.clickEnterButton();
        await signUp.validateRegistrationEmailSent(test.info().project.name);
        await loginPage.validateDesktopLoginState(true);
    });

    test('Validate SignUp with no credentials', async ({ signUpFirstStep }) => {
        await signUpFirstStep.validateNextButtonNotEnabled(false);
    });

    test('Validate SignUp with no email', async ({ signUpFirstStep }) => {
        await signUpFirstStep.fillPassword('Password@1');
        await signUpFirstStep.validateNextButtonNotEnabled(false);
    });

    test('Validate SignUp with no password', async ({ signUpFirstStep }) => {
        await signUpFirstStep.fillEmail('abc@abv.bg');
        await signUpFirstStep.validateNextButtonNotEnabled(false);
    });
});
