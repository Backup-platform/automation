import { Locator, Page } from '@playwright/test';
//import { expect } from '../utils/base.po';
import { step, stepParam, assertElementContainsText, clickElement,assertVisible, fillInputField, assertEnabled, assertNotEnabled  } from '@test-utils/navigation.po';

export type ErrorFieldsLocator = 'email' | 'password' | 'firstName' | 'lastName' | 'city' | 'address' | 'zipCode'

export class SignUpFirstStep {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //Locators - should work for both mobile and desktop
    private readonly email = () => this.page.locator("input[name=email]");
    private readonly password = () => this.page.locator("input[name=password]");
    private readonly nextStepButton = () => this.page.locator(".bg-primary");
    private readonly invalidEmail = () => this.page.locator('.space-y-2 [id*=form-item-message]').nth(0);
    private readonly invalidPassword = () => this.page.locator('.space-y-2 [id*=form-item-message]').nth(1);
    private readonly preferencesRadioGroup = () => this.page.locator('[role="radiogroup"]');
    private readonly preferenceRadioButton = (index: number) => this.page.locator('button[role="radio"]').nth(index);
    private readonly preferenceRadioInput = (index: number) => this.page.locator('input[type="radio"]').nth(index);
    private readonly preferenceLabel = (index: number) => this.page.locator('label[for*="form-item"]').nth(index);
    private readonly firstPreference = () => this.preferenceRadioButton(0); // Casino
    private readonly secondPreference = () => this.preferenceRadioButton(1); // Sport  
    private readonly thirdPreference = () => this.preferenceRadioButton(2); // Both/All
    private readonly loginLink = () => this.page.locator('button').filter({ has: this.page.locator('svg') }).last();
    private readonly closeButton = () => this.page.locator('button').filter({ has: this.page.locator('svg') }).first();
    private readonly stepsContainer = () => this.page.locator('.text-s.flex.flex-row.gap-6');
    private readonly stepButton = (stepNumber: number) => this.page.locator(`.text-s.flex.flex-row.gap-6 button`).nth(stepNumber - 1);
    private readonly activeStep = () => this.page.locator('.text-s.flex.flex-row.gap-6 button.text-primary');
    private readonly whyWeAskContainer = () => this.page.locator('.flex.flex-col.gap-1.rounded-xl.border-2');
    private readonly whyWeAskTitle = () => this.page.locator('.flex.flex-col.gap-1.rounded-xl.border-2 h5');
    private readonly whyWeAskText = () => this.page.locator('.flex.flex-col.gap-1.rounded-xl.border-2 p');
    //    private readonly fieldError = (fieldError: ErrorFieldsLocator) => this.page.locator(`label[class*="field_error"][for*=${fieldError}]`);

    private async validateFieldVisibility(fieldLocator: Locator, fieldName: string, softAssert = false) {
        await assertVisible(fieldLocator, `${fieldName} field`, softAssert);
    }

    private async fillField(fieldLocator: Locator, value: string, fieldName: string) {
        await fillInputField(fieldLocator, value, `${fieldName} field`);
    }

    public validateEmailVisible = async (softAssert = false) =>
        await this.validateFieldVisibility(this.email(), 'Email', softAssert);

    public fillEmail = async (userEmail: string) =>
        await this.fillField(this.email(), userEmail, 'Email');    

    public validatePasswordVisible = async (softAssert = false) =>
        await this.validateFieldVisibility(this.password(), 'Password', softAssert);
    
    public fillPassword = async (password: string) =>
        await this.fillField(this.password(), password, 'Password');

    public validateNextButtonEnabled = async (softAssert = false) =>
        await assertEnabled(this.nextStepButton(), 'Next button', softAssert);

    public validateNextButtonNotEnabled = async (softAssert = false) =>
        await assertNotEnabled(this.nextStepButton(), 'Next button', softAssert);

    public validateNextButtonVisible = async (softAssert = false) =>
        await assertVisible(this.nextStepButton(), 'Next button', softAssert);

    public clickNextButton = async () =>
        await clickElement(this.nextStepButton(), 'Next button');

    public validatePasswordStrengthMeter = async (softAssert = false) =>
        await assertVisible(this.passwordStrength(), 'Password strength meter', softAssert);

    public validateError = async (fieldWithError: ErrorFieldsLocator) => 
        await assertVisible(this.fieldError(fieldWithError), `Field error ${fieldWithError}`, false);

    @stepParam((preference: string) => `I select preference ${preference}`)
    public async selectPreference(preference: 'CASINO' | 'SPORT' | 'ALL') {
        const index = preference === 'CASINO' ? 0 : preference === 'SPORT' ? 1 : 2;
        await clickElement(this.preferenceRadioButton(index), `${preference} preference`);
    }

    public validatePreferencesVisible = async (softAssert = false) =>
        await assertVisible(this.preferencesRadioGroup(), 'Preferences radio group', softAssert);

    @stepParam((preference: string) => `I validate ${preference} preference is selected`)
    public async validatePreferenceSelected(preference: 'CASINO' | 'SPORT' | 'ALL') {
        const index = preference === 'CASINO' ? 0 : preference === 'SPORT' ? 1 : 2;
        await this.page.locator('button[role="radio"]').nth(index).locator('[aria-checked="true"]').waitFor();
    }

    @stepParam((userEmail: string, password: string) => 
        `I fill in the email field with email ${userEmail} and password ${password}`)
    public async fillFirstStep(userEmail?: string, password?: string) {
        const time = Date.now();
        await this.fillEmail(`${time}_${userEmail}`);
        await this.fillPassword(`${time}_${password}`);
    }

    private async validatePasswordReminderState(reminderText: string, shouldShowMinus: boolean, softAssert = false) {
        await assertElementContainsText(
            this.passwordRemindersContainer(),
            reminderText,
            'Password reminder container',
            softAssert
        );

        const reminders = await this.passwordReminders().all();

        for (const reminder of reminders) {
            const text = await reminder.innerText();
            const isMatch = text.trim() === reminderText.trim();
    
            const minusLocator = reminder.locator(this.passwordReminderMinus());
            const checkLocator = reminder.locator(this.passwordReminderCheck());
    
            const expectMinusVisible = isMatch ? shouldShowMinus : !shouldShowMinus;
            const expectCheckVisible = isMatch ? !shouldShowMinus : shouldShowMinus;
    
            await expect(minusLocator, `Minus icon for "${text}"`).toBeVisible({ visible: expectMinusVisible });
            await expect(checkLocator, `Check icon for "${text}"`).toBeVisible({ visible: expectCheckVisible });
        }
    }

    @stepParam((reminderText: string) => `Password reminder for ${reminderText} is check and the others are minus`)
    public async validatePasswordCheck(reminderText: string) {
        await this.validatePasswordReminderState(reminderText, false);
    }

    @step()
    public async validatePasswordMinus(reminderText: string) {
        await this.validatePasswordReminderState(reminderText, true);
    }

    @step('I validate the first registration step elements')
    public async validatePageElements() {
        await this.validateEmailVisible();
        await this.validatePasswordVisible();
        await this.validateNextButtonVisible();
    }

    public validateLoginLinkVisible = async (softAssert = false) =>
        await assertVisible(this.loginLink(), 'Login link', softAssert);

    public clickLoginLink = async () =>
        await clickElement(this.loginLink(), 'Login link');

    public validateCloseButtonVisible = async (softAssert = false) =>
        await assertVisible(this.closeButton(), 'Close button', softAssert);

    public clickCloseButton = async () =>
        await clickElement(this.closeButton(), 'Close button');

    public validateStepsVisible = async (softAssert = false) =>
        await assertVisible(this.stepsContainer(), 'Steps container', softAssert);

    @stepParam((stepNumber: number) => `I validate step ${stepNumber} is active`)
    public async validateActiveStep(expectedStep: number) {
        const activeStepElement = this.stepButton(expectedStep);
        await activeStepElement.waitFor();
        // Verify it has the active class
        await this.page.locator(`.text-s.flex.flex-row.gap-6 button.text-primary`).nth(expectedStep - 1).waitFor();
    }

    public validateWhyWeAskVisible = async (softAssert = false) =>
        await assertVisible(this.whyWeAskContainer(), 'Why we ask container', softAssert);
}