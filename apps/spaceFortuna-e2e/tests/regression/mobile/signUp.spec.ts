import test from "../../../pages/utils/base.po";
import { secondStepFields } from '../../../pages/signUp/signUpSecondStep.po';
import { thirdStepFields } from '../../../pages/signUp/signUpThirdStep.po';
import path from 'path';

test.beforeEach(async ({ page, banner, bottomMenu }) => {
    await page.goto(`${process.env.URL}`);
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();    
    await banner.acceptCookies();
    await banner.bannerNewDesign();
    await banner.bannerHiThere();
    await banner.acceptTermsAndConditions();
    await bottomMenu.clickRegisterButton();
});

test.describe('Signup Regression Tests - Mobile', () => {
    test.describe('Validate SignUp with Missing email sections', () => {
        const invalidEmails = [
            { scenario: 'Missing @', email: "Somemailsomething.com" },
            { scenario: 'Missing @ section', email: "Somemail" },
            { scenario: 'Missing domain', email: "Somemail@.com" },
            { scenario: 'Missing suffix', email: "Somemail@something." },
            { scenario: 'Missing prefix', email: "@something.com" },
            { scenario: 'One Letter suffix', email: "Somemail@something.c" }
        ];

        for (const fields of invalidEmails) {
            test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
            test(`Test ${fields.scenario}`, async ({ signUpFirstStep }) => {
                await signUpFirstStep.fillEmail(fields.email);
                await signUpFirstStep.fillPassword('Password@1');
                await signUpFirstStep.validateNextButtonNotEnabled(false);
                await signUpFirstStep.validateError('email');
            });
        }
    });

    test.describe('Validate SignUp with non-compliant password', () => {
        const invalidPasswords = [
            { scenario: '7 character', password: "Passw1@", passReminder: 'Please input at least 8 characters' },
            { scenario: 'Missing Lowercase Characters', password: "PASSWORD1@", passReminder: 'Please input a lowercase character (a-z)' },
            { scenario: 'Missing Uppercase Characters', password: "password1@", passReminder: 'Please input a uppercase character (A-Z)' },
            { scenario: 'Missing Number', password: "Password@", passReminder: 'Please input a number (0-9)' },
            //TODO: only latin letters validations
            //TODO: 'Removal of complians reminders when you fulfill them'
        ];

        for (const fields of invalidPasswords) {
            test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
            test(`Test ${fields.scenario}`, async ({ signUpFirstStep }) => {
                await signUpFirstStep.fillPassword(fields.password);
                await signUpFirstStep.fillEmail('abv@abv.bg');
                await signUpFirstStep.validatePasswordMinus(fields.passReminder);
                await signUpFirstStep.validateNextButtonNotEnabled(false);
                await signUpFirstStep.validateError('password');
            });
        }
    });

    test.describe('Validate SignUp with Missing Second Stage field', () => {
        const seconStepFields = [
            { scenario: 'Missing First Name', firstName: undefined, lastName: 'lastName', DOB: '02/05/2001', gender: 'FEMALE' },
            { scenario: 'Missing Last Name', firstName: 'firstName', lastName: undefined, DOB: '02/05/2001', gender: 'FEMALE' },
            { scenario: 'Missing DOB', firstName: 'firstName', lastName: 'lastName', DOB: undefined, gender: 'MALE' },
            { scenario: 'Missing Gender', firstName: 'firstName', lastName: 'lastName', DOB: '02/05/2001', gender: undefined },
        ];
        for (const fields of seconStepFields) {
            test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
            test(`Test ${fields.scenario}`, async ({ signUpFirstStep, signUpSecondStep }) => {
                await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@1');
                await signUpFirstStep.clickNextButton();
                await signUpSecondStep.fillPartialSecondStep(fields as secondStepFields);
                await signUpSecondStep.validateAlmostDoneNotEnabled(false);
            });
        }
    });

    test.describe('Validate SignUp with Missing Third Stage field', () => {
        const thirdStepFields = [
            { scenario: 'Missing City', city: undefined, address: '1337 Blvrd', postcode: '42', countryCode: '+1', phone: '3065344301', checkbox: true, country: 'Canada' },
            { scenario: 'Missing Address', city: 'Toronto', address: undefined, postcode: '42', countryCode: '+1', phone: '3065344301', checkbox: true, country: 'Canada' },
            { scenario: 'Missing Postcode', city: 'Toronto', address: '1337 Blvrd', postcode: undefined, countryCode: '+1', phone: '3065344301', checkbox: true, country: 'Canada' },
            { scenario: 'Missing Phone', city: 'Toronto', address: '1337 Blvrd', postcode: '42', countryCode: '+1', phone: undefined, checkbox: true, country: 'Canada' },
            { scenario: 'Uncheck Age Checkbox', city: 'Toronto', address: '1337 Blvrd', postcode: '42', countryCode: '+1', phone: '3065344301', checkbox: false, country: 'Canada' },
        ];
        for (const fields of thirdStepFields) {
            test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
            test(`Test ${fields.scenario}`, async ({ signUpFirstStep, signUpSecondStep, signUpThirdStep }) => {
                await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@');
                await signUpFirstStep.clickNextButton();
                await signUpSecondStep.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
                await signUpSecondStep.clickAlmostDoneButton();
                await signUpThirdStep.fillPartialThirdStep(fields as thirdStepFields);
                await signUpThirdStep.validateEnterEnabled(false);
            });
        }
    });
    test.describe('Test second step', () => {
        const secondStepFields = [
            { scenario: 'One Letter First Name', firstName: 'a', lastName: 'a', DOB: '02/05/2001', gender: 'MALE' },
            { scenario: 'One Letter and space', firstName: 'a ', lastName: 'a ', DOB: '02/05/2001', gender: 'FEMALE' },
        ];
        for (const fields of secondStepFields) {
            test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
            test(`Validate fields with non compliant text ${fields.scenario}`, async ({ signUpFirstStep, signUpSecondStep }) => {
                await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@1');
                await signUpFirstStep.clickNextButton();
                await signUpSecondStep.fillPartialSecondStep(fields as secondStepFields);
                await signUpSecondStep.validateError('firstName');
                await signUpSecondStep.validateError('lastName');
                await signUpSecondStep.validateAlmostDoneNotEnabled(false);
            });
        }
    });


    test.describe('Test third step', () => {
        const thirdStepFields = [
            { scenario: 'One Letter', country: 'Canada', city: 'a', address: 'a', postcode: 'a', countryCode: '+1', phone: '3065344301', checkbox: true },
            { scenario: 'One Letter and space', country: 'Canada', city: 'a ', address: 'a ', postcode: 'a ', countryCode: '+1', phone: '3065344301', checkbox: true },
        ];
        for (const fields of thirdStepFields) {
            test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
            test(`Validate fields with non compliant text ${fields.scenario}`, async ({ signUpFirstStep, signUpSecondStep, signUpThirdStep }) => {
                await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@1');
                await signUpFirstStep.clickNextButton();
                await signUpSecondStep.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
                await signUpSecondStep.clickAlmostDoneButton();
                await signUpThirdStep.fillPartialThirdStep(fields as thirdStepFields);
                await signUpThirdStep.validateError('city');
                await signUpThirdStep.validateError('address');
                await signUpThirdStep.validateError('zipCode');
                await signUpThirdStep.validateEnterEnabled(false);
            });
        }
    }); 
});
