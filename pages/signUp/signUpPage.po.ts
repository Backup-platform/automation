import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';



export class SignUp {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
    }

    //Locators
    readonly successEscapeButton = () => this.page.locator("#registration-modal-close-btn");
    private readonly successMessageHeading = () => this.page.locator("div[class*='registrationModal_heading']");
    private readonly successMessageImage = () => this.page.locator('img[class*="registrationModal_successImage"]');
    private readonly successMessageBody = () => this.page.locator('div[class*="registrationModal_bodyContainer"]');
    private readonly successMessageText = () => this.page.locator('div[class*="registrationModal_text_"]');
    private readonly successCloseButton = () => this.page.locator('button[class*="registrationModal_nextButton"]');

    
    //Actions
    @step('I validate successfull registration email sent instructions')
    public async validateRegistrationEmailSent(deviceUsed: String) {
            if (deviceUsed == 'Desktop Chrome') {
                await expect(this.successEscapeButton(), 'Escape Button is visible').toBeVisible();
            }
            await expect(this.successMessageHeading(), 'Success image title is visible').toBeVisible();
            //TODO: check other validations based on locale 
            await expect(this.successMessageHeading(), 'Validate text content of success image title').toContainText('Please verify your email');
            await expect(this.successMessageImage(), 'Success image is visible').toBeVisible();
            await expect(this.successMessageBody(), 'Success message body is visible').toBeVisible();
            //TODO: check other validations based on locale
            await expect(this.successMessageBody(), 'Validate text content of Success message body').toContainText('Please check your email to activate your account.');
            await expect(this.successMessageText(), 'Success message Text is visible').toBeVisible();
            //TODO: check other validations based on locale
            await expect(this.successMessageText(), 'Validate text content of Success message text').toContainText('If you did not receive the email please check in your spam folder');
            await expect(this.successCloseButton(), 'Close button is visible').toBeVisible();
            //TODO: check other validations based on locale
            await expect(this.successCloseButton(), 'Validate text content of Close button ').toContainText('close');
            await this.successCloseButton().click();
            await this.page.waitForURL(`${process.env.URL}`);
    }
}