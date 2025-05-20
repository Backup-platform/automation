import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { step, stepParam, assertElementContainsText, clickElement,assertVisible, fillInputField, assertEnabled, assertNotEnabled  } from '../utils/navigation.po';

export type ErrorFieldsLocator = 'email' | 'password' | 'firstName' | 'lastName' | 'city' | 'address' | 'zipCode'

export class SignUpFirstStep {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //Locators - should work for both mobile and desktop
    private readonly email = () => this.page.locator("#email");
    private readonly password = () => this.page.locator("#password");
    private readonly nextStepButton = () => this.page.locator("#registration-next-step-btn");
    private readonly passwordRemindersContainer = () => this.page.locator('.mt-2.gap-2');
    private readonly passwordReminders = () => this.page.locator('.mt-2 .gap-2');
    private readonly passwordReminderMinus = () => this.page.locator("span[class*='passwordRequirements_x_']");
    private readonly passwordReminderCheck = () => this.page.locator("span[class*='passwordRequirements_check_']");
    private readonly fieldError = (fieldError: ErrorFieldsLocator) => this.page.locator(`label[class*="field_error"][for*=${fieldError}]`);
    public readonly emailError = () => this.page.locator('label[class*="field_error"][for*="email"]');
    public readonly passwordError = () => this.page.locator('label[class*="field_error"][for*="password"]');
    private readonly passwordStrength = () => this.page.locator('progress[class*="passwordMeter_password_strength_meter_progress"]');

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
}