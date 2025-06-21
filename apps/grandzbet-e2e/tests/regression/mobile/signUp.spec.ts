import test from "../../../pages/base/base.po";
import path from 'path';

test.beforeEach(async ({ page, popupHandlers }) => {
    await page.goto(`${process.env.URL}`);
  	await popupHandlers.handleAllPopups();
});

test.describe('Signup Regression Tests', () => {
    test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
    test('Validate Preference has only one active option', async ({ signUpStep1, menuItems, signUpCommon }) => {
        await menuItems.clickRegister();
        await signUpStep1.fillPassword('Password@1');

        await signUpStep1.selectAndValidatePreference('CASINO',true);
        await signUpCommon.clickNextButton();
        await signUpStep1.validatePreferencesErrorNOTVisible(true);
        await signUpStep1.validateFieldError('email', true);

        await signUpStep1.selectAndValidatePreference('SPORT', true);
        await signUpCommon.clickNextButton();
        await signUpStep1.validatePreferencesErrorNOTVisible(true);
        await signUpStep1.validateFieldError('email', true);

        await signUpStep1.selectAndValidatePreference('ALL', true);
        await signUpCommon.clickNextButton();
        await signUpStep1.validatePreferencesErrorNOTVisible(true);
        await signUpStep1.validateFieldError('email', true);
    });

    test('Validate Login button navigation', async ({ loginPage, menuItems, signUpCommon }) => {
        await menuItems.clickRegister();
        await signUpCommon.clickLoginLink(`${process.env.URL}/login?backUrl=/`);
        await loginPage.validatePageElements(true);
    });

    test.describe('Validate SignUp with non-compliant first step fields', () => {
        const invalidFirstStepData = [
            // Email validation tests
            { scenario: 'Missing @', email: "Somemailsomething.com", password: 'Password@1', preference: 'ALL', expectedError: 'email' },
            { scenario: 'Missing @ section', email: "Somemail", password: 'Password@1', preference: 'ALL', expectedError: 'email' },
            { scenario: 'Missing domain', email: "Somemail@.com", password: 'Password@1', preference: 'ALL', expectedError: 'email' },
            { scenario: 'Missing suffix', email: "Somemail@something.", password: 'Password@1', preference: 'ALL', expectedError: 'email' },
            { scenario: 'Missing prefix', email: "@something.com", password: 'Password@1', preference: 'ALL', expectedError: 'email' },
            { scenario: 'One Letter suffix', email: "Somemail@something.c", password: 'Password@1', preference: 'ALL', expectedError: 'email' },
            // Password validation tests
            { scenario: '7 character password', email: 'abv@abv.bg', password: "Passw1@", preference: 'SPORT', expectedError: 'password' },
            { scenario: 'Missing Lowercase Characters', email: 'abv@abv.bg', password: "PASSWORD1@", preference: 'SPORT', expectedError: 'password' },
            { scenario: 'Missing Uppercase Characters', email: 'abv@abv.bg', password: "password1@", preference: 'SPORT', expectedError: 'password' },
            { scenario: 'Missing Number', email: 'abv@abv.bg', password: "Password@", preference: 'SPORT', expectedError: 'password' },
            { scenario: 'Non-latin characters used', email: 'abv@abv.bg', password: "Парола1", preference: 'SPORT', expectedError: 'password' }
        ] as const;

        test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
        for (const { scenario, email, password, preference, expectedError } of invalidFirstStepData) {
            test(`Test ${scenario}`, async ({ signUpStep1, menuItems, signUpCommon }) => {
                await menuItems.clickRegister();
                await signUpStep1.fillEmail(email);
                await signUpStep1.fillPassword(password);
                await signUpStep1.selectAndValidatePreference(preference);
                await signUpCommon.clickNextButton();
                await signUpStep1.validateFieldError(expectedError, true);
            });
        }
    });

	//FIXME:
    test.describe('Test going back from sign up page via the back button', () => {
        const navigationScenarios = [
            { scenario: 'LandingPage', url: '', action: (deps: any) => deps.menuItems.clickLogo() },
            { scenario: 'Casino', url: '/games', action: (deps: any) => deps.navigationItems.clickCasinoButton() },
            { scenario: 'Promotions', url: '/promotions', action: (deps: any) => deps.navigationItems.clickPromotionsButton() }
        ];
        
        for (const { scenario, url, action } of navigationScenarios) {
            test(`Test return back to ${scenario}`, async ({ signUpStep1, navigationItems, menuItems, signUpCommon, page }) => {
                await action({ menuItems, navigationItems });
                await page.waitForLoadState('domcontentloaded');
                await menuItems.clickRegister();
                await signUpStep1.validatePageElements(true);
                await signUpCommon.validateNavigationBack(`${process.env.URL}${url}`);
            });
        }
    });


    test.describe('Validate SignUp with Missing or wrong Second Stage field', () => {
    const testCases = [
        ['Missing First Name', { lastName: 'lastName', DOB: '22/05/2001', gender: 'FEMALE' }, 'firstName'],
        ['Missing Last Name', { firstName: 'firstName', DOB: '22/05/2001', gender: 'FEMALE' }, 'lastName'],
        ['Missing DOB', { firstName: 'firstName', lastName: 'lastName', gender: 'MALE' }, 'birthDate'],
        ['Missing Gender', { firstName: 'firstName', lastName: 'lastName', DOB: '02/05/2001' }, 'gender'],
        ['One Letter First Name', { firstName: 'a', lastName: 'ab', DOB: '02/05/2001', gender: 'MALE' }, 'firstName'],
		['One Letter Last Name', { firstName: 'ab', lastName: 'a', DOB: '02/05/2001', gender: 'MALE' }, 'lastName'],
    ] as const;

    for (const [scenario, fields, expectedErrorField] of testCases) {
        test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
        test(`Test ${scenario}`, async ({ signUpStep1, signUpStep2, menuItems, signUpCommon }) => {
			await menuItems.clickRegister();
            await signUpStep1.fillFirstStep("mpetrov15@sbtsolution.com", 'Mpetrov15@sbtsolution.com');
            await signUpCommon.clickNextButton();
            await signUpStep2.fillPartialSecondStep(fields);
            await signUpCommon.clickNextButton();
            await signUpStep2.validateFieldError(expectedErrorField);
        });
    }
});

    test.describe('Validate SignUp with Missing Third Stage field', () => {
        const thirdStepTestCases = [
            ['Missing City', { address: '1337 Blvrd', postcode: '42', countryCode: '+1', phone: '3065344301', checkbox: true, country: 'canada' }, 'city'],
            ['Missing Address', { city: 'Toronto', postcode: '42', countryCode: '+1', phone: '3065344301', checkbox: true, country: 'canada' }, 'address'],
            ['Missing Postcode', { city: 'Toronto', address: '1337 Blvrd', countryCode: '+1', phone: '3065344301', checkbox: true, country: 'canada' }, 'zipCode'],
            ['Missing Phone', { city: 'Toronto', address: '1337 Blvrd', postcode: '42', countryCode: '+1', checkbox: true, country: 'canada' }, 'phoneNumber'],
            ['Uncheck Age Checkbox', { city: 'Toronto', address: '1337 Blvrd', postcode: '42', countryCode: '+1', phone: '3065344301', country: 'canada' }, 'termsAndConditions'],
            ['One Letter', { city: 'a', address: '42', postcode: 'a', countryCode: '+1', phone: '3065344301', country: 'canada' }, 'city'],
        ] as const;
        
        for (const [scenario, fields, expectedErrorField] of thirdStepTestCases) {
            test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });
            test(`Test ${scenario}`, async ({ signUpStep1, signUpStep2, signUpStep3, menuItems, signUpCommon }) => {
				await menuItems.clickRegister();
                await signUpStep1.fillFirstStep("Somemail@something.com", 'Password@1');
                await signUpCommon.clickNextButton();
                await signUpStep2.fillSecondStep('firstName', 'lastName', '02/05/2001', 'MALE');
                await signUpCommon.clickNextButton();
                await signUpStep3.fillPartialThirdStep(fields);
                await signUpStep3.clickRegisterButton();
                await signUpStep3.validateFieldError(expectedErrorField);
            });
        }
    });
});