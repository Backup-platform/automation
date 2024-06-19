import { secondStepFields, thirdStepFields } from '../../pages/signUp.po';
import test, { expect } from '../../pages/utils/base.po';

test.beforeEach(async ({ page, banner, headerMenuDesktop }) => {
    await page.goto('https://stage.spacefortuna1.com/en');
    await banner.bannerNewDesign();
    await banner.bannerHiThere();
    if(await headerMenuDesktop.isLoginVisible()) {
        await headerMenuDesktop.clickSignUpButton();
    } else {
        await page.locator('a[class*="styles_buttons_"]').click()
    }
    //await headerMenuDesktop.clickSignUpButton(); //TODO: Desktop
    //await page.locator('a[class*="styles_buttons_"]').click(); //TODO: Mobile
});

test.describe('Signup Smoke Tests Desktop', () => {
    //TODO: make a test for duplicate emails 
    test('Validate SignUp', async ({ signUp, banner }) => {
        await banner.bannerNewDesign();
        await banner.bannerHiThere();
        await signUp.fillFirstStep("Somemail@something.com", 'Password@');
        await signUp.clickNextButton();
        await signUp.fillSecondStep('firstName', 'lastName', '02/05/2001', 'Male');
        await signUp.clickAlmostDoneButton();
        await signUp.fillThirdStep('Toronto', '1337 Blvrd', '42', '3065344301', 'Canada', '+1');
        await signUp.clickEnterButton();
        await signUp.validateRegistrationEmailSent();
    });

    test('Validate SignUp with no credentials', async ({ signUp, banner }) => {
        banner.bannerNewDesign();
        banner.bannerHiThere();
        await signUp.validateNextButtonEnabled(false);
    });

    test('Validate SignUp with no email', async ({ signUp , banner}) => {
        await banner.bannerNewDesign();
        await banner.bannerHiThere();
        await signUp.fillPassword('Password@1');
        await signUp.validateNextButtonEnabled(false);
    });

    test('Validate SignUp with no password', async ({ signUp , banner}) => {
        await banner.bannerNewDesign();
        await banner.bannerHiThere();
        await signUp.fillEmail('abc@abv.bg');
        await signUp.validateNextButtonEnabled(false);
    });

    test.describe('Validate SignUp with Missing Second Stage field', () => {
        const seconStepFields = [
            { scenario: 'Missing First Name', firstName: undefined, lastName: 'lastName', DOB: '02/05/2001', gender: 'Female' },
            { scenario: 'Missing Last Name', firstName: 'firstName', lastName: undefined, DOB: '02/05/2001', gender: 'Female' },
            { scenario: 'Missing DOB', firstName: 'firstName', lastName: 'lastName', DOB: undefined, gender: 'Male'},
            { scenario: 'Missing Gender', firstName: 'firstName', lastName: 'lastName', DOB: '02/05/2001', gender: undefined },
        ];
        for (const fields of seconStepFields) {
            test(`Test ${fields.scenario}`, async ({ signUp , banner }) => {
                await banner.bannerNewDesign();
                await banner.bannerHiThere();
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
            test(`Test ${fields.scenario}`, async ({ signUp, banner }) => {
                await banner.bannerNewDesign();
                await banner.bannerHiThere();
                await signUp.fillFirstStep("Somemail@something.com", 'Password@');
                await signUp.clickNextButton();
                await signUp.fillSecondStep('firstName', 'lastName', '02/05/2001', 'Male');
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
            test(`Test ${fields.scenario} `, async ({ signUp, banner }) => {
                await banner.bannerNewDesign();
                await banner.bannerHiThere();
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
            test(`Test ${fields.scenario} `, async ({ signUp, banner }) => {
                await banner.bannerNewDesign();
                await banner.bannerHiThere();
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
            { scenario: 'One Letter First Name', firstName: 'a', lastName: 'a', DOB: '02/05/2001', gender: 'Male' },
            { scenario: 'One Letter and space', firstName: 'a ', lastName: 'a ', DOB: '02/05/2001', gender: 'Female' },
        ];
        for (const fields of secondStepFields) {
            test(`Validate fields with non compliant text ${fields.scenario}`, async ({ signUp, banner }) => {
                await banner.bannerNewDesign();
                await banner.bannerHiThere();
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
            test(`Validate fields with non compliant text ${fields.scenario}`, async ({ signUp, banner }) => {
                await banner.bannerNewDesign();
                await banner.bannerHiThere();
                await signUp.fillFirstStep("Somemail@something.com", 'Password@1');
                await signUp.clickNextButton();
                await signUp.fillSecondStep('firstName', 'lastName', '02/05/2001', 'Male');
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

