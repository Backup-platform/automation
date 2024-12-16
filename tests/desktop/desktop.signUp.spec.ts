import { SignUpFirstStep } from '../../pages/signUp/signUpFirstStep.po';
import { secondStepFields, SignUpSecondStep } from '../../pages/signUp/signUpSecondStep.po';
import { thirdStepFields, SignUpThirdStep } from '../../pages/signUp/signUpThirdStep.po';
import test, { expect } from '../../pages/utils/base.po';

var projectName: string | String;
test.beforeEach(async ({ page, banner, headerMenuDesktop }) => {
    projectName = test.info().project.name;
    await page.goto(`${process.env.URL}`);
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
});

test.describe('Signup Smoke Tests', () => {

    test.describe("desktop", () => {
        test.beforeEach(async ({ headerMenuDesktop }, testInfo) => {
            if (!testInfo.project.name.includes('desktop')) { test.skip(); }
            await headerMenuDesktop.clickRegisterButton();
        });

        test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
        test('Validate SignUp', async ({ signUp, loginPage, signUpFirstStep, signUpSecondStep, signUpThirdStep }) => {
            await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@');
            await signUpFirstStep.clickNextButton();
            await signUpSecondStep.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
            await signUpSecondStep.clickAlmostDoneButton();
            await signUpThirdStep.fillThirdStep('Toronto', '1337 Blvrd', '42', '3065344301', 'Canada', '+1');
            await signUpThirdStep.clickEnterButton();
            await signUp.validateRegistrationEmailSent(projectName);
            await loginPage.validateDesktopLoginState(true);
        });

        test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
        test('Validate SignUp with no credentials', async ({ signUpFirstStep }) => {
            await signUpFirstStep.validateNextButtonNotEnabled(false);
        });

        test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
        test('Validate SignUp with no email', async ({ signUpFirstStep }) => {
            await signUpFirstStep.fillPassword('Password@1');
            await signUpFirstStep.validateNextButtonNotEnabled(false);
        });

        test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
        test('Validate SignUp with no password', async ({ signUpFirstStep }) => {
            await signUpFirstStep.fillEmail('abc@abv.bg');
            await signUpFirstStep.validateNextButtonNotEnabled(false);
        });

        //TODO: make a test for duplicate emails

        test.describe('Validate SignUp with Missing Second Stage field', () => {
            const seconStepFields = [
                { scenario: 'Missing First Name', firstName: undefined, lastName: 'lastName', DOB: '02/05/2001', gender: 'FEMALE' },
                { scenario: 'Missing Last Name', firstName: 'firstName', lastName: undefined, DOB: '02/05/2001', gender: 'FEMALE' },
                { scenario: 'Missing DOB', firstName: 'firstName', lastName: 'lastName', DOB: undefined, gender: 'MALE' },
                { scenario: 'Missing Gender', firstName: 'firstName', lastName: 'lastName', DOB: '02/05/2001', gender: undefined },
            ];
            for (const fields of seconStepFields) {
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
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
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
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
    });

    test.describe("mobile", () => {
        test.beforeEach(async ({ bottomMenu }, testInfo) => {
            if (!testInfo.project.name.includes('mobile')) { console.log(`Project ${testInfo.project.name} skipped`); test.skip(); }
            await bottomMenu.clickRegisterButton();
        });

        test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
        test('Validate SignUp', async ({ signUp, signUpFirstStep, signUpSecondStep, signUpThirdStep, loginPage }) => {
            //await signUp.validateFirstStepElements();
            await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@');
            await signUpFirstStep.clickNextButton();
            await signUpSecondStep.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
            await signUpSecondStep.clickAlmostDoneButton();
            await signUpThirdStep.fillThirdStep('Toronto', '1337 Blvrd', '42', '3065344301', 'Canada', '+1');
            await signUpThirdStep.clickEnterButton();
            await signUp.validateRegistrationEmailSent(projectName);
            await loginPage.validateMobileLoginState(true);
        });

        test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
        test('Validate SignUp with no credentials', async ({ signUpFirstStep }) => {
            await signUpFirstStep.validateNextButtonNotEnabled(false);
        });

        test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
        test('Validate SignUp with no email', async ({ signUpFirstStep }) => {
            await signUpFirstStep.fillPassword('Password@1');
            await signUpFirstStep.validateNextButtonNotEnabled(false);
        });

        test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
        test('Validate SignUp with no password', async ({ signUpFirstStep }) => {
            await signUpFirstStep.fillEmail('abc@abv.bg');
            await signUpFirstStep.validateNextButtonNotEnabled(false);
        });

        //TODO: make a test for duplicate emails

        test.describe('Validate SignUp with Missing Second Stage field', () => {
            const seconStepFields = [
                { scenario: 'Missing First Name', firstName: undefined, lastName: 'lastName', DOB: '02/05/2001', gender: 'FEMALE' },
                { scenario: 'Missing Last Name', firstName: 'firstName', lastName: undefined, DOB: '02/05/2001', gender: 'FEMALE' },
                { scenario: 'Missing DOB', firstName: 'firstName', lastName: 'lastName', DOB: undefined, gender: 'MALE' },
                { scenario: 'Missing Gender', firstName: 'firstName', lastName: 'lastName', DOB: '02/05/2001', gender: undefined },
            ];
            for (const fields of seconStepFields) {
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
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
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
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
    });
});


test.describe('Signup Regression Tests', () => {
    test.describe('Desktop', () => {
        test.beforeEach(async ({ headerMenuDesktop }, testInfo) => {
            if (!testInfo.project.name.includes('desktop')) { test.skip(); }
            await headerMenuDesktop.clickRegisterButton();
        });


        test.describe('Validate SignUp with Missing email sections', () => {
            const thirdStepFields = [
                { scenario: 'Missing @', email: "Somemailsomething.com" },
                { scenario: 'Missing @ section', email: "Somemail" },
                { scenario: 'Missing domain', email: "Somemail@.com" },
                { scenario: 'Missing suffix', email: "Somemail@something." },
                { scenario: 'Missing prefix', email: "@something.com" },
                { scenario: 'One Letter suffix', email: "Somemail@something.c" },
            ];

            for (const fields of thirdStepFields) {
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
                test(`Test ${fields.scenario} `, async ({ signUpFirstStep, signUpSecondStep, signUpThirdStep }) => {
                    await signUpFirstStep.fillEmail(fields.email);
                    await signUpFirstStep.fillPassword('Password@1');
                    await signUpFirstStep.validateNextButtonNotEnabled(false);
                    await signUpFirstStep.validateError('email');
                });
            }
        });

        test.describe('Validate SignUp with non compliant password', () => {
            const thirdStepFields = [
                { scenario: '7 character', password: "Passw1@", passReminder: 'Please input at least 8 characters' },
                { scenario: 'Missing Lowercase Characters', password: "PASSWORD1@", passReminder: 'Please input a lowercase character (a-z)' },
                { scenario: 'Missing Uppercase Characters', password: "password1@", passReminder: 'Please input a uppercase character (A-Z)' },
                { scenario: 'Missing Number', password: "Password@", passReminder: 'Please input a number (0-9)' },
                //TODO: 'Removal of complians reminders when you fulfill them'
            ];
            for (const fields of thirdStepFields) {
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
                test(`Test ${fields.scenario} `, async ({ signUpFirstStep }) => {
                    await signUpFirstStep.fillPassword(fields.password);
                    await signUpFirstStep.fillEmail('abv@abv.bg');
                    await signUpFirstStep.validatePasswordMinus(fields.passReminder);
                    await signUpFirstStep.validateNextButtonNotEnabled(false);
                    await signUpFirstStep.validateError('password');
                });
            }
        });



        test.describe('Test second step', () => {
            const secondStepFields = [
                { scenario: 'One Letter First Name', firstName: 'a', lastName: 'a', DOB: '02/05/2001', gender: 'MALE' },
                { scenario: 'One Letter and space', firstName: 'a ', lastName: 'a ', DOB: '02/05/2001', gender: 'FEMALE' },
            ];
            for (const fields of secondStepFields) {
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
                test(`Validate fields with non compliant text ${fields.scenario}`, async ({ signUpFirstStep, signUpSecondStep, signUpThirdStep }) => {
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
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
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


    test.describe('Mobile', () => {

        test.beforeEach(async ({ bottomMenu }, testInfo) => {
            if (!testInfo.project.name.includes('mobile')) { test.skip(); }
            await bottomMenu.clickRegisterButton();
        });


        test.describe('Validate SignUp with Missing email sections', () => {
            const thirdStepFields = [
                { scenario: 'Missing @', email: "Somemailsomething.com" },
                { scenario: 'Missing @ section', email: "Somemail" },
                { scenario: 'Missing domain', email: "Somemail@.com" },
                { scenario: 'Missing suffix', email: "Somemail@something." },
                { scenario: 'Missing prefix', email: "@something.com" },
                { scenario: 'One Letter suffix', email: "Somemail@something.c" },
            ];

            for (const fields of thirdStepFields) {
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
                test(`Test ${fields.scenario} `, async ({ signUpFirstStep }) => {
                    await signUpFirstStep.fillEmail(fields.email);
                    await signUpFirstStep.fillPassword('Password@1');
                    await signUpFirstStep.validateNextButtonNotEnabled(false);
                    await signUpFirstStep.validateError('email');
                });
            }
        });

        test.describe('Validate SignUp with non compliant password', () => {
            const thirdStepFields = [
                { scenario: '7 character', password: "Passw1@", passReminder: 'Please input at least 8 characters' },
                { scenario: 'Missing Lowercase Characters', password: "PASSWORD1@", passReminder: 'Please input a lowercase character (a-z)' },
                { scenario: 'Missing Uppercase Characters', password: "password1@", passReminder: 'Please input a uppercase character (A-Z)' },
                { scenario: 'Missing Number', password: "Password@", passReminder: 'Please input a number (0-9)' },
                //TODO: 'Removal of complians reminders when you fulfill them'
            ];
            for (const fields of thirdStepFields) {
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
                test(`Test ${fields.scenario} `, async ({ signUpFirstStep }) => {
                    await signUpFirstStep.fillPassword(fields.password);
                    await signUpFirstStep.fillEmail('abv@abv.bg');
                    await signUpFirstStep.validatePasswordMinus(fields.passReminder);
                    await signUpFirstStep.validateNextButtonNotEnabled(false);
                    await signUpFirstStep.validateError('password');
                });
            }
        });



        test.describe('Test second step', () => {
            const secondStepFields = [
                { scenario: 'One Letter First Name', firstName: 'a', lastName: 'a', DOB: '02/05/2001', gender: 'MALE' },
                { scenario: 'One Letter and space', firstName: 'a ', lastName: 'a ', DOB: '02/05/2001', gender: 'FEMALE' },
            ];
            for (const fields of secondStepFields) {
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
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
                test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
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
});
