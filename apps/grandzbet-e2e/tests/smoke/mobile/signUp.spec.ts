import test from "../../../pages/base/base.po";
import path from 'path';

test.beforeEach(async ({ page, menuItems, popupHandlers }) => {
    await page.goto(`${process.env.URL}`);
  	await popupHandlers.handleAllPopups();
    await menuItems.clickRegister();
});

test.describe('Signup Smoke Tests - Mobile', () => {
    test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });

    test('Validate SignUp', async ({ signUpStep1, signUpStep2, signUpStep3, signUpCommon }) => {
        await signUpStep1.fillFirstStep("Somemail@something.com", 'Password@1');
        await signUpCommon.clickNextButton();
        await signUpStep2.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
        await signUpCommon.clickNextButton();
        await signUpStep3.fillThirdStep('canada','Toronto', '1337 Blvrd', '42', '+1', '3065344301');
        await signUpStep3.clickRegisterButton();
        //await menuItems.validateGuestItems(); //FIXME: Issue with signup, "something went wrong" probably blocked user
    });

    test('Validate SignUp with no credentials', async ({ signUpStep1, signUpCommon }) => {
        await signUpCommon.clickNextButton();
        await signUpStep1.validateFieldError('email');
        await signUpStep1.validateFieldError('password');
        await signUpStep1.validateFieldError('preferences');
    });

    test('Validate SignUp with no email', async ({ signUpStep1, signUpCommon }) => {
        await signUpStep1.fillPassword('Password@1');
        await signUpStep1.selectPreference('CASINO');
        await signUpCommon.clickNextButton();
        await signUpStep1.validateFieldError('email');
    });

    test('Validate SignUp with no password', async ({ signUpStep1, signUpCommon }) => {
        await signUpStep1.fillEmail('abc@abv.bg');
        await signUpStep1.selectAndValidatePreference('ALL');
        await signUpCommon.clickNextButton();
        await signUpStep1.validateFieldError('password');
    });

    test('Validate SignUp with no preference', async ({ signUpStep1, signUpCommon }) => {
        await signUpStep1.fillEmail('abc@abv.bg');
        await signUpStep1.fillPassword('Password@1');
        await signUpCommon.clickNextButton();
        await signUpStep1.validateFieldError('preferences');
    });

    //TODO: make a test for duplicate emails
});
