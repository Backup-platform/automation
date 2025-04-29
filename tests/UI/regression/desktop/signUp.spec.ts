import test, { expect } from "../../../../pages/utils/base.po";

test.beforeEach(async ({ page, banner, headerMenuDesktop }) => {
    await page.goto(`${process.env.URL}`);
    await banner.clickEscapeInOptIn();
    await banner.randomClickSkipSomething();
    await headerMenuDesktop.clickRegisterButton();
});

test.describe('Signup Regression Tests - Desktop', () => {
    test.describe('Validate SignUp with Missing email sections', () => {
        const invalidEmails = [
            { scenario: 'Missing @', email: "Somemailsomething.com" },
            { scenario: 'Missing domain', email: "Somemail@" },
            { scenario: 'Missing suffix', email: "Somemail@something." },
        ];

        for (const fields of invalidEmails) {
            test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
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
            { scenario: '7 characters', password: "Passw1@", reminder: 'Please input at least 8 characters' },
            { scenario: 'Missing number', password: "Password@", reminder: 'Please input a number (0-9)' },
        ];

        for (const fields of invalidPasswords) {
            test.use({ storageState: 'playwright/.auth/noAuthentication.json' });
            test(`Test ${fields.scenario}`, async ({ signUpFirstStep }) => {
                await signUpFirstStep.fillPassword(fields.password);
                await signUpFirstStep.fillEmail('abv@abv.bg');
                await signUpFirstStep.validatePasswordMinus(fields.reminder);
                await signUpFirstStep.validateNextButtonNotEnabled(false);
                await signUpFirstStep.validateError('password');
            });
        }
    });
});
