import { Page } from '@playwright/test';
import { step, assertVisible, assertElementContainsText, assertUrl, clickElement } from '@test-utils/navigation.po';

export class SignUpEmail {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //Locators
    readonly successEscapeButton = () => this.page.locator("#registration-modal-close-btn");
    private readonly successMessageHeading = () => this.page.locator("div[class*='registrationModal_heading']");
    private readonly successMessageImage = () => this.page.locator('img[class*="registrationModal_successImage"]');
    private readonly successMessageBody = () => this.page.locator('div[class*="registrationModal_bodyContainer"]');
    private readonly successMessageText = () => this.page.locator('div[class*="registrationModal_text_"]');
    private readonly successCloseButton = () => this.page.locator('button[class*="registrationModal_nextButton"]');

    
    //Actions
    @step('I validate successful registration email sent instructions')
    public async validateRegistrationEmailSent(deviceUsed: string) {
        if (deviceUsed === 'Desktop Chrome') {
            await assertVisible(this.successEscapeButton(), 'Escape Button', false);
        }

        await assertVisible(this.successMessageHeading(), 'Success title', false);
        await assertElementContainsText(this.successMessageHeading(), 'Please verify your email', 'Success title', false);

        await assertVisible(this.successMessageImage(), 'Success image', false);

        await assertVisible(this.successMessageBody(), 'Success message body', false);
        await assertElementContainsText(this.successMessageBody(), 'Please check your email to activate your account.', 'Success message body', false);

        await assertVisible(this.successMessageText(), 'Success message text', false);
        await assertElementContainsText(this.successMessageText(), 'If you did not receive the email please check in your spam folder', 'Success message text', false);

        await assertVisible(this.successCloseButton(), 'Close button', false);
        await assertElementContainsText(this.successCloseButton(), 'close', 'Close button', false);

        await clickElement(this.successCloseButton(), 'Close button');
        await assertUrl(this.page, `${process.env.URL}`, true);
    }
}