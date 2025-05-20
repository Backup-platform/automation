import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { step, stepParam, assertVisible, clickElement } from '../utils/navigation.po';

export class LandingPageFAQ {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    readonly faqTitle = () => this.page.locator('.faq-content');
    readonly faqContainer = () => this.page.locator('#faq-container');
    readonly faqDropdowns = () => this.page.locator('div[class*="faqSection_faqContentContainer_"]');
    readonly faqReadMoreSections = () => this.page.locator('div[class*="faqSection_faqMoreInfoContent_"]');
    readonly faqDropdownAt = (index: number) => this.faqDropdowns().nth(index);
    readonly faqReadMoreSectionAt = (index: number) => this.faqReadMoreSections().nth(index);

    // Actions
    public validateFaqTitleVisible = async (softAssert = false) => 
        await assertVisible(this.faqTitle(), 'FAQ title', softAssert);

    public validateFaqContainerVisible = async (softAssert = false) =>
        await assertVisible(this.faqContainer(), 'FAQ container', softAssert);

    public validateFaqDropdownVisible = async (index: number, softAssert = false) =>
        await assertVisible(this.faqDropdownAt(index), `FAQ dropdown number ${index}`, softAssert);

    public validateFaqReadMoreSectionVisible = async (index: number, softAssert = false) =>
        await assertVisible(this.faqReadMoreSectionAt(index), `FAQ "Read More" number ${index}`, softAssert);

    public clickFaqDropdown = async (index: number) => 
        await clickElement(this.faqDropdownAt(index), `FAQ dropdown number ${index}`);

    @step('I validate FAQ elements are visible')
    public async validateFaqElements(softAssert = false): Promise<void> {
        await this.validateFaqTitleVisible(softAssert);
        await this.validateFaqContainerVisible(softAssert);

        const totalDropdowns = await this.faqDropdowns().count();

        for (let i = 0; i < totalDropdowns; i++) {
            await test.step(`I validate dropdown #${i} and read more section`, async () => {
                await this.validateFaqDropdownVisible(i, softAssert);
                //TODO: it is shown await expect(await this.faqReadMoreSections().nth(i), 'Initial more info window is not visible').not.toBeVisible()
                await this.clickFaqDropdown(i);
                await this.validateFaqReadMoreSectionVisible(i, softAssert);
            });
        }

        await expect(await totalDropdowns, 'Expect the same amount of dropdowns as read more sections')
            .toEqual(await this.faqReadMoreSections().count());
    }
}