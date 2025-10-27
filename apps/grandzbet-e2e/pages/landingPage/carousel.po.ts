import { Page, expect } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { assertVisible, assertEnabled } from '@test-utils/assertions';
import { compositeLocator } from '@test-utils/core-types';



export class LandingPageCarousel {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ---locators ---

    private readonly container = compositeLocator(() => this.page.locator('section#home-hero').first(), 'Carousel container');
    private readonly image = compositeLocator(() => this.page.locator('#home-hero img').first(), 'Carousel Image');
    private readonly title = compositeLocator(() => this.page.locator('p.font-roboto.text-2xl.font-bold').first(), 'Carousel title');
    private readonly subtitle = compositeLocator(() => this.page.locator('p.font-rubik.text-base.font-normal.text-greyLight').first(), 'Carousel subtitle');
    private readonly tag = compositeLocator(() => this.page.locator('#tag').first(), 'Carousel tag');
    private readonly dots = compositeLocator(() => this.page.locator('div.relative.flex-row.gap-2').first(), 'Carousel dots');
    private readonly activeDot = compositeLocator(() => this.page.locator('div.flex-row.gap-2 button.bg-primary').first(), 'Carousel active dot');
     private readonly ctaButton = compositeLocator(() => this.page.locator('#home-hero button').first(),'Carousel cta button');



    // --- assertions ---


    @step('Carousel: Elements visibility')

    public async validateElementsVisible(softAssert = false): Promise<void> {

        await assertVisible(this.container, softAssert);

        await assertVisible(this.image, softAssert);

        await assertVisible(this.title, softAssert);

        await assertVisible(this.subtitle, softAssert);

        await assertVisible(this.tag, softAssert);

        await assertVisible(this.dots, softAssert);

        await assertVisible(this.activeDot, softAssert);

        await assertVisible(this.ctaButton, softAssert);

    }


}
