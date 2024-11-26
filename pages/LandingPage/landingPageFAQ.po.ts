import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation } from '../utils/navigation.po';

export class LandingPageFAQ {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page)
    }

    readonly faqTitle = () => this.page.locator('.faq-content');
    readonly faqContainer = () => this.page.locator('#faq-container');
    readonly faqDropdowns = () => this.page.locator('div[class*="faqSection_faqContentContainer_"]');
    readonly faqReadMoreSections = () => this.page.locator('div[class*="faqSection_faqMoreInfoContent_"]');

    public async validateFaqTitleVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.faqTitle(), softAssert,
            'Expect FAQ title to be visible');
    }

    public async validateFaqContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.faqContainer(), softAssert,
            'Expect FAQ container to be visible');
    }

    public async validateFaqDropdownVisible(nthElement: number, softAssert = false): Promise<void> {
        const faqDropdown = this.faqDropdowns().nth(nthElement);
        await this.navigation.assertVisible(faqDropdown, softAssert,
            `Expect FAQ dropdown number ${nthElement} to be visible`);
    }

    public async validateFaqReadMoreSectionVisible(nthElement: number, softAssert = false): Promise<void> {
        const faqReadMoreSection = this.faqReadMoreSections().nth(nthElement);
        await this.navigation.assertVisible(faqReadMoreSection, softAssert,
            `Expect FAQ "Read More" section number ${nthElement} to be visible`);
    }

    public async clickFaqDropdown(nthElement: number, softAssert = false): Promise<void> {
        await test.step(`I click on FAQ dropdown number ${nthElement}`, async () => {
            const faqDropdown = this.faqDropdowns().nth(nthElement);
            await this.navigation.clickElement(faqDropdown, softAssert,
                `Expect FAQ dropdown number ${nthElement} to be visible before clicking`);
        });
    }

    public async validateFaqElements(softAssert = false): Promise<void> {
        await test.step('I check if the FAQ elements are visible', async () => {
            await this.validateFaqTitleVisible(softAssert);
            await this.validateFaqContainerVisible(softAssert);

            const totalDropdowns = await this.faqDropdowns().count();
            for (let i = 0; i < totalDropdowns; i++) {
                await this.validateFaqDropdownVisible(i, softAssert);
                //TODO: it is shown await expect(await this.faqReadMoreSections().nth(i), 'Initial more info window is not visible').not.toBeVisible()
                await this.clickFaqDropdown(i, softAssert);
                await this.validateFaqReadMoreSectionVisible(i, softAssert);
            }
            expect(await totalDropdowns, 'There is the same ammount of dropdowns as read more sections'
            ).toEqual(await this.faqReadMoreSections().count());
        });
    }

}