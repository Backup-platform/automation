import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';

export class LandingPageFAQ {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page)
    }

    // Locators
    readonly faqTitle = () => this.page.locator('.faq-content');
    readonly faqContainer = () => this.page.locator('#faq-container');
    readonly faqDropdowns = () => this.page.locator('div[class*="faqSection_faqContentContainer_"]');
    readonly faqReadMoreSections = () => this.page.locator('div[class*="faqSection_faqMoreInfoContent_"]');
    readonly faqDropdownAt = (index: number) => this.faqDropdowns().nth(index);
    readonly faqReadMoreSectionAt = (index: number) => this.faqReadMoreSections().nth(index);

    // Helper method to validate element visibility with consistent messaging
    private async _validateElementVisible(element: Locator, elementName: string, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(element, softAssert, elementName);
    }

    // Public validation methods
    public async validateFaqTitleVisible(softAssert = false): Promise<void> {
        await this._validateElementVisible(this.faqTitle(), 'FAQ title', softAssert);
    }

    public async validateFaqContainerVisible(softAssert = false): Promise<void> {
        await this._validateElementVisible(this.faqContainer(), 'FAQ container', softAssert);
    }

    public async validateFaqDropdownVisible(index: number, softAssert = false): Promise<void> {
        await this._validateElementVisible(this.faqDropdownAt(index), `FAQ dropdown number ${index}`, softAssert);
    }

    public async validateFaqReadMoreSectionVisible(index: number, softAssert = false): Promise<void> {
        await this._validateElementVisible(this.faqReadMoreSectionAt(index), `FAQ "Read More" number ${index}`, softAssert);
    }

    public async clickFaqDropdown(index: number): Promise<void> {
        await this.navigation.clickElement(this.faqDropdownAt(index), `FAQ dropdown number ${index}`);
    }

    @step('I validate FAQ elements are visible')
    public async validateFaqElements(softAssert = false): Promise<void> {
        // Validate main containers
        await this.validateFaqTitleVisible(softAssert);
        await this.validateFaqContainerVisible(softAssert);

        const totalDropdowns = await this.faqDropdowns().count();

        // Validate each dropdown and its read more section
        for (let i = 0; i < totalDropdowns; i++) {
            await test.step(`I validate dropdown #${i} and read more section`, async () => {
                await this.validateFaqDropdownVisible(i, softAssert);
                //TODO: it is shown await expect(await this.faqReadMoreSections().nth(i), 'Initial more info window is not visible').not.toBeVisible()
                await this.clickFaqDropdown(i);
                await this.validateFaqReadMoreSectionVisible(i, softAssert);
            });
        }

        // Verify counts match
        expect(await totalDropdowns, 'Expect the same amount of dropdowns as read more sections')
            .toEqual(await this.faqReadMoreSections().count());
    }
}