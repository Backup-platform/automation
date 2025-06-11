import test from "../../../pages/base/base.po";
import path from 'path';
import { MenuItems } from '../../../pages/menu/menuItems.po';
import { NavigationItems } from '../../../pages/menu/navigationItems.po';

test.beforeEach(async ({ page, menuItems, signUpStep1 }) => {
    await page.goto(`${process.env.URL}`);
    // await banner.clickEscapeInOptIn();
    // await banner.randomClickSkipSomething();    
    // await banner.acceptCookies();
    // await banner.bannerNewDesign();
    // await banner.bannerHiThere();
    // await banner.acceptTermsAndConditions();
    await menuItems.clickRegister();
    //await signUpStep1.validatePageElements(true); 
});

test.describe('Signup Regression Tests - Desktop', () => {
    test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
    test('Validate Preference has only one active option', async ({ signUpStep1 }) => {
        await signUpStep1.fillPassword('Password@1');

        await signUpStep1.selectAndValidatePreference('CASINO', true);
        await signUpStep1.clickNextButton();
        await signUpStep1.validatePreferencesErrorNOTVisible(true);
        await signUpStep1.validateEmailError(true);

        await signUpStep1.selectAndValidatePreference('SPORT', true);
        await signUpStep1.clickNextButton();
        await signUpStep1.validatePreferencesErrorNOTVisible(true);
        await signUpStep1.validateEmailError(true);

        await signUpStep1.selectAndValidatePreference('ALL', true);
        await signUpStep1.clickNextButton();
        await signUpStep1.validatePreferencesErrorNOTVisible(true);
        await signUpStep1.validateEmailError(true);
    });

    test('Validate Login button navigation', async ({ signUpStep1, loginPage }) => {
        await signUpStep1.clickLoginLink(`${process.env.URL}/login?backUrl=/`);
        await loginPage.validatePageElements(true);
    });

    test.describe('Validate SignUp with non-compliant email', () => {
        const invalidEmails = [
            { scenario: 'Missing @', email: "Somemailsomething.com" },
            { scenario: 'Missing @ section', email: "Somemail" },
            { scenario: 'Missing domain', email: "Somemail@.com" },
            { scenario: 'Missing suffix', email: "Somemail@something." },
            { scenario: 'Missing prefix', email: "@something.com" },
            { scenario: 'One Letter suffix', email: "Somemail@something.c" },
        ];

        // Move storage state to describe level
        test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });

        for (const fields of invalidEmails) {
            test(`Test ${fields.scenario}`, async ({ signUpStep1 }) => {
                await signUpStep1.fillEmail(fields.email);
                await signUpStep1.fillPassword('Password@1');
                await signUpStep1.selectAndValidatePreference('ALL');
                await signUpStep1.clickNextButton();
                await signUpStep1.validateEmailError(true);
            });
        }
    });

    test.describe('Validate SignUp with non-compliant password', () => {
        const invalidPasswords = [
            { scenario: '7 character', password: "Passw1@" },
            { scenario: 'Missing Lowercase Characters', password: "PASSWORD1@" },
            { scenario: 'Missing Uppercase Characters', password: "password1@" },
            { scenario: 'Missing Number', password: "Password@" },
            { scenario: 'Non-latin characters used', password: "Парола1" }
        ];

        // Move storage state to describe level
        test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
        
        for (const fields of invalidPasswords) {
            test(`Test ${fields.scenario}`, async ({ signUpStep1 }) => {
                await signUpStep1.fillPassword(fields.password);
                await signUpStep1.fillEmail('abv@abv.bg');
                await signUpStep1.selectAndValidatePreference('SPORT');
                await signUpStep1.clickNextButton();
                await signUpStep1.validatePasswordError();
            });
        }
    });

    test.describe('Test going back from sign up page via the back button', () => {
    const navigationScenarios: Array<{
      scenario: string;
      url: string;
      navigate: (params: {
        menuItems: MenuItems;
        navigationItems: NavigationItems;
      }) => Promise<void>;
    }> = [
      {
        scenario: 'LandingPage',
        url: '',
        navigate: async ({ menuItems }) => await menuItems.clickLogo(),
      },
      {
        scenario: 'Casino',
        url: '/games',
        navigate: async ({ navigationItems }) =>
          await navigationItems.clickCasinoButton(),
      },
      {
        scenario: 'Promotions',
        url: '/promotions',
        navigate: async ({ navigationItems }) =>
          await navigationItems.clickPromotionsButton(),
      },
    ];
    for (const { scenario, url, navigate } of navigationScenarios) {
      test(`Test return back to ${scenario}`, async ({
        signUpStep1,
        navigationItems,
        menuItems,
        page
      }) => {
        await signUpStep1.clickCloseButton();
        await navigate({ navigationItems, menuItems });
        //await page.waitForEvent('load');
        await menuItems.clickRegister();
        await signUpStep1.validatePageElements(true);
        await signUpStep1.validateNavigationBack(
          scenario,
          `${process.env.URL}${url}`
        );
      });
    }
  });


    // test.describe('Validate SignUp with Missing Second Stage field', () => {
    //     const secondStepFields = [
    //         { scenario: 'Missing First Name', firstName: undefined, lastName: 'lastName', DOB: '02/05/2001', gender: 'FEMALE' },
    //         { scenario: 'Missing Last Name', firstName: 'firstName', lastName: undefined, DOB: '02/05/2001', gender: 'FEMALE' },
    //         { scenario: 'Missing DOB', firstName: 'firstName', lastName: 'lastName', DOB: undefined, gender: 'MALE' },
    //         { scenario: 'Missing Gender', firstName: 'firstName', lastName: 'lastName', DOB: '02/05/2001', gender: undefined },
    //     ];
    //     for (const fields of secondStepFields) {
    //         test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
    //         test(`Test ${fields.scenario}`, async ({ signUpFirstStep, signUpSecondStep }) => {
    //             await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@1');
    //             await signUpFirstStep.clickNextButton();
    //             await signUpSecondStep.fillPartialSecondStep(fields as secondStepFields);
    //             await signUpSecondStep.validateAlmostDoneNotEnabled(false);
    //         });
    //     }
    // });

    // test.describe('Validate SignUp with Missing Third Stage field', () => {
    //     const thirdStepFields = [
    //         { scenario: 'Missing City', city: undefined, address: '1337 Blvrd', postcode: '42', countryCode: '+1', phone: '3065344301', checkbox: true, country: 'Canada' },
    //         { scenario: 'Missing Address', city: 'Toronto', address: undefined, postcode: '42', countryCode: '+1', phone: '3065344301', checkbox: true, country: 'Canada' },
    //         { scenario: 'Missing Postcode', city: 'Toronto', address: '1337 Blvrd', postcode: undefined, countryCode: '+1', phone: '3065344301', checkbox: true, country: 'Canada' },
    //         { scenario: 'Missing Phone', city: 'Toronto', address: '1337 Blvrd', postcode: '42', countryCode: '+1', phone: undefined, checkbox: true, country: 'Canada' },
    //         { scenario: 'Uncheck Age Checkbox', city: 'Toronto', address: '1337 Blvrd', postcode: '42', countryCode: '+1', phone: '3065344301', checkbox: false, country: 'Canada' },
    //     ];
    //     for (const fields of thirdStepFields) {
    //         test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
    //         test(`Test ${fields.scenario}`, async ({ signUpFirstStep, signUpSecondStep, signUpThirdStep }) => {
    //             await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@');
    //             await signUpFirstStep.clickNextButton();
    //             await signUpSecondStep.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
    //             await signUpSecondStep.clickAlmostDoneButton();
    //             await signUpThirdStep.fillPartialThirdStep(fields as thirdStepFields);
    //             await signUpThirdStep.validateEnterEnabled(false);
    //         });
    //     }
    // });
    
    // test.describe('Test second step', () => {
    //     const secondStepFields = [
    //         { scenario: 'One Letter First Name', firstName: 'a', lastName: 'a', DOB: '02/05/2001', gender: 'MALE' },
    //         { scenario: 'One Letter and space', firstName: 'a ', lastName: 'a ', DOB: '02/05/2001', gender: 'FEMALE' },
    //     ];
    //     for (const fields of secondStepFields) {
    //         test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
    //         test(`Validate fields with non compliant text ${fields.scenario}`, async ({ signUpFirstStep, signUpSecondStep }) => {
    //             await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@1');
    //             await signUpFirstStep.clickNextButton();
    //             await signUpSecondStep.fillPartialSecondStep(fields as secondStepFields);
    //             await signUpSecondStep.validateError('firstName');
    //             await signUpSecondStep.validateError('lastName');
    //             await signUpSecondStep.validateAlmostDoneNotEnabled(false);
    //         });
    //     }
    // });

    // test.describe('Test third step', () => {
    //     const thirdStepFields = [
    //         { scenario: 'One Letter', country: 'Canada', city: 'a', address: 'a', postcode: 'a', countryCode: '+1', phone: '3065344301', checkbox: true },
    //         { scenario: 'One Letter and space', country: 'Canada', city: 'a ', address: 'a ', postcode: 'a ', countryCode: '+1', phone: '3065344301', checkbox: true },
    //     ];
    //     for (const fields of thirdStepFields) {
    //         test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
    //         test(`Validate fields with non compliant text ${fields.scenario}`, async ({ signUpFirstStep, signUpSecondStep, signUpThirdStep }) => {
    //             await signUpFirstStep.fillFirstStep("Somemail@something.com", 'Password@1');
    //             await signUpFirstStep.clickNextButton();
    //             await signUpSecondStep.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
    //             await signUpSecondStep.clickAlmostDoneButton();
    //             await signUpThirdStep.fillPartialThirdStep(fields as thirdStepFields);
    //             await signUpThirdStep.validateError('city');
    //             await signUpThirdStep.validateError('address');
    //             await signUpThirdStep.validateError('zipCode');
    //             await signUpThirdStep.validateEnterEnabled(false);
    //         });
    //     }
    // });
});
