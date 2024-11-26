import { secondStepFields, thirdStepFields } from '../../pages/signUp.po';
import test, { expect } from '../../pages/utils/base.po';

var projectName: string | String;
test.beforeEach(async ({ page, banner, headerMenuDesktop }) => {
    projectName = test.info().project.name;
    await page.goto(`${process.env.URL}`);
    await headerMenuDesktop.clickRegisterButton();
    await banner.randomClickEscape();
	await banner.randomClickSkipSomething();
});

test.describe('Signup Smoke Tests Desktop', () => {

    test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
    test('Validate SignUp', async ({ signUp, page, loginPage }) => {
        await signUp.fillFirstStep("Somemail@something.com", 'Password@');
        await signUp.clickNextButton();
        await signUp.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
        await signUp.clickAlmostDoneButton();
        await signUp.fillThirdStep('Toronto', '1337 Blvrd', '42', '3065344301', 'Canada', '+1');
        await signUp.clickEnterButton();
        await signUp.validateRegistrationEmailSent(projectName);
        await loginPage.validateLoggedIn();
    });

    test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
    test('Validate SignUp with no credentials', async ({ signUp }) => {
        await signUp.validateNextButtonEnabled(false);
    });

    test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
    test('Validate SignUp with no email', async ({ signUp }) => {
        await signUp.fillPassword('Password@1');
        await signUp.validateNextButtonEnabled(false);
    });

    test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
    test('Validate SignUp with no password', async ({ signUp }) => {
        await signUp.fillEmail('abc@abv.bg');
        await signUp.validateNextButtonEnabled(false);
    });
    
    //TODO: make a test for duplicate emails
    
    test.describe('Validate SignUp with Missing Second Stage field', () => {
        const seconStepFields = [
            { scenario: 'Missing First Name', firstName: undefined, lastName: 'lastName', DOB: '02/05/2001', gender: 'FEMALE' },
            { scenario: 'Missing Last Name', firstName: 'firstName', lastName: undefined, DOB: '02/05/2001', gender: 'FEMALE' },
            { scenario: 'Missing DOB', firstName: 'firstName', lastName: 'lastName', DOB: undefined, gender: 'MALE'},
            { scenario: 'Missing Gender', firstName: 'firstName', lastName: 'lastName', DOB: '02/05/2001', gender: undefined },
        ];
        for (const fields of seconStepFields) {
            test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
            test(`Test ${fields.scenario}`, async ({ signUp }) => {
                await signUp.fillFirstStep("Somemail@something.com", 'Password@1');
                await signUp.clickNextButton();
                await signUp.fillPartialSecondStep(fields as secondStepFields );
                await signUp.validateAlmostDoneEnabled(false);
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
            test(`Test ${fields.scenario}`, async ({ signUp }) => {
                await signUp.fillFirstStep("Somemail@something.com", 'Password@');
                await signUp.clickNextButton();
                await signUp.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
                await signUp.clickAlmostDoneButton();
                await signUp.fillPartialThirdStep(fields as thirdStepFields);
                await signUp.validateEnterEnabled(false);
            });
        }
    });
});


test.describe('Sign up regression Tests Desktop', () => {
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
            test(`Test ${fields.scenario} `, async ({ signUp }) => {
                await signUp.fillEmail(fields.email);
                await signUp.fillPassword('Password@1');
                await signUp.validateNextButtonEnabled(false);
                await signUp.validateError('email');
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
            test(`Test ${fields.scenario} `, async ({ signUp }) => {
                await signUp.fillPassword(fields.password);
                await signUp.fillEmail('abv@abv.bg');
                await signUp.validatePasswordMinus(fields.passReminder);
                await signUp.validateNextButtonEnabled(false);
                await signUp.validateError('password');
            });
        }
    });



    test.describe('Test second step', () => {
        const secondStepFields = [
            { scenario: 'One Letter First Name', firstName: 'a', lastName: 'a', DOB: '02/05/2001', gender: 'MALE' },
            { scenario: 'One Letter and space', firstName: 'a ', lastName: 'a ', DOB: '02/05/2001', gender: 'Female' },
        ];
        for (const fields of secondStepFields) {
            test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
            test(`Validate fields with non compliant text ${fields.scenario}`, async ({ signUp }) => {
                await signUp.fillFirstStep("Somemail@something.com", 'Password@1');
                await signUp.clickNextButton();
                await signUp.fillPartialSecondStep(fields as secondStepFields);
                await signUp.validateError('firstName');
                await signUp.validateError('lastName');
                await signUp.validateEnterEnabled(false);
            });
        }
    });

    test.describe('Test third step', () => {
        const thirdStepFields = [
            { scenario: 'One Letter', country: 'Canada' , city: 'a', address: 'a', postcode: 'a', countryCode: '+1' , phone: '3065344301', checkbox: true },
            { scenario: 'One Letter and space',  country: 'Canada' , city: 'a ', address: 'a ', postcode: 'a ', countryCode: '+1' , phone: '3065344301', checkbox: true },
        ];
        for (const fields of thirdStepFields) {
            test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
            test(`Validate fields with non compliant text ${fields.scenario}`, async ({ signUp }) => {
                await signUp.fillFirstStep("Somemail@something.com", 'Password@1');
                await signUp.clickNextButton();
                await signUp.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
                await signUp.clickAlmostDoneButton();
                await signUp.fillPartialThirdStep(fields as thirdStepFields);
                await signUp.validateError('city');
                await signUp.validateError('address');
                await signUp.validateError('zipCode');
                await signUp.validateEnterEnabled(false);
            });
        }
    });
});

