import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';

export type ErrorFieldsLocator = 'email' | 'password' | 'firstName' | 'lastName' | 'city' | 'address' | 'zipCode'

export class SignUpFirstStep {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
    }

    //Locators - should work for both mobile and desktop
    private readonly email = () => this.page.locator("#email");
    private readonly password = () => this.page.locator("#password");
    private readonly nextStepButton = () => this.page.locator("#registration-next-step-btn");
    private readonly passwordRemindersContainer = () => this.page.locator('.mt-2.gap-2');
    private readonly passwordReminders = () => this.page.locator('.mt-2 .gap-2');
    private readonly passwordReminderMinus = () => this.page.locator("span[class*='passwordRequirements_minus_']");
    private readonly passwordReminderCheck = () => this.page.locator("span[class*='passwordRequirements_check_']");
    private readonly fieldError = (fieldError: ErrorFieldsLocator) => this.page.locator(`label[class*="field_error"][for*=${fieldError}]`);
    public readonly emailError = () => this.page.locator('label[class*="field_error"][for*="email"]');
    public readonly passwordError = () => this.page.locator('label[class*="field_error"][for*="password"]');
    private readonly passwordStrength = () => this.page.locator('progress[class*="passwordMeter_password_strength_meter_progress"]');

    @step('I validate the email field is visible')
    public async validateEmailVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.email(), softAssert, 'Email field');
    }

    @step('I fill the email field')
    public async fillEmail(userEmail: string) {
        await this.navigation.fillInputField(this.email(), userEmail, false, 'Email field');
    }

    @step('I validate the password field is visible')
    public async validatePasswordVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.password(), softAssert, 'Password field');
    }

    @step('I fill the password field')
    public async fillPassword(password: string) {
        await this.navigation.fillInputField(this.password(), password, false, 'Password field');
    }

    @step('I validate the next button is enabled')
    public async validateNextButtonEnabled(softAssert = false): Promise<void> {
        await this.navigation.assertEnabled(this.nextStepButton(), softAssert, 'Next button');
    }


    public async validateNextButtonNotEnabled(softAssert = false): Promise<void> {
        await this.navigation.assertNotEnabled(this.nextStepButton(), softAssert, 'Next button');
    }

    @step('I validate the next button is visible')
    public async validateNextButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.nextStepButton(), softAssert, 'Next button');
    }

    @step('I click the Next button')
    public async clickNextButton() {
        await this.navigation.clickElement(this.nextStepButton(), false, 'Next button');
    }

    @step('I fill the first registration step')
    public async fillFirstStep(userEmail?: string, password?: string) {
        const time = Date.now();
        await this.fillEmail(time + '_' + userEmail);
        await this.fillPassword(time + '_' + password);
        //TODO: make a method to add a datetime to email
    }

    @stepParam((reminderText: string) => `Password reminder for ${reminderText} is check and the others are minus`)
    public async validatePasswordCheck(reminderText: string) {
        await this.validatePasswordReminder(reminderText, false);
    }

    @step('I validate the password strength meter is visible')
    public async validatePasswordStrengthMeter() {
        await this.navigation.assertVisible(this.passwordStrength(), false, 'Password strength meter');
        //TODO: await expect(this.passwordStrength()).toBeVisible();
    }

    @stepParam((fieldWithError: ErrorFieldsLocator) => `I validate the ${fieldWithError} error is visible`)
    public async validateError(fieldWithError: ErrorFieldsLocator) {
        await this.navigation.assertVisible(this.fieldError(fieldWithError), false, `Field error ${fieldWithError}`);
        //TODO: await expect(this.fieldError(fieldWithError), 'I validate that the ' + fieldWithError + ' error is visible').toBeVisible();
    }

    @step()
    public async validatePasswordMinus(reminderText: string) {
        await this.validatePasswordReminder(reminderText, true);
    }

    @step('I validate the first registration step elements')
    public async validatePageElements() {
        await this.validateEmailVisible();
        await this.validatePasswordVisible();
        await this.validateNextButtonVisible();
    }

    @step('I validate the first registration step elements')
    private async validatePasswordReminder(reminderText: string, shouldShowMinus: boolean) {
        await this.navigation.assertElementContainsText(this.passwordRemindersContainer(), reminderText, false, 'Password reminder is visible');

        const reminders = await this.passwordReminders().all();
        for (const reminder of reminders) {
            const isMatchingReminder = await reminder.innerText() === reminderText;
            const minusVisible = isMatchingReminder ? shouldShowMinus : !shouldShowMinus;
            const checkVisible = isMatchingReminder ? !shouldShowMinus : shouldShowMinus;

            await expect(reminder.locator(this.passwordReminderMinus()), `Expect ${await reminder.innerText()} to have minus visible: ${minusVisible}`)
                .toBeVisible({ visible: minusVisible });
            await expect(reminder.locator(this.passwordReminderCheck()), `Expect ${await reminder.innerText()} to have check visible: ${checkVisible}`)
                .toBeVisible({ visible: checkVisible });
        }
    }
}

