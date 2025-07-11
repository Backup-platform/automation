import { Page } from '@playwright/test';
import { assertVisible } from '@test-utils/assertions';
import { clickElement } from '@test-utils/interactions';
import { compositeLocator } from '@test-utils/core-types';
import { iterateElements } from '@test-utils/utilities';
import { validateAttributesContaining } from '@test-utils/attributes';
import { validateOnlyOneElementActiveGroup } from '@test-utils/attributes';
import { step } from '@test-utils/decorators';

export class Deposit {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private readonly bonusList = compositeLocator(() => 
        this.page.locator('#bonus-list'), 'Bonus List');

    private readonly paymentMethodsSection = compositeLocator(() =>
        this.page.locator('.grid.w-full.grid-cols-2.gap-4'), 'Payment Methods Section');

    private readonly paymentMethods = () => compositeLocator(() =>
        this.page.locator('.grid.w-full.grid-cols-2.gap-4 > div'), `All Payment Methods`);

    private readonly paymentMethod = (index: number) => compositeLocator(() =>
        this.paymentMethods().locator().nth(index), `Payment Method ${index}`);

    private readonly ACTIVE_PAYMENT_METHOD_ATTRIBUTES = { class: 'border-primary' };

    // --- Validation methods ---
    public assertBonusListVisible = async(softAssert = false) => 
        await assertVisible(this.bonusList, softAssert);

    public assertPaymentMethodsSectionVisible = async (softAssert = false): Promise<void> =>
        await assertVisible(this.paymentMethodsSection, softAssert);

    private assertPaymentMethodVisible = async (index: number, softAssert = false): Promise<void> =>
        await assertVisible(this.paymentMethod(index), softAssert);

    public assertPaymentMethodActive = async (index: number): Promise<void> =>
        await validateAttributesContaining(this.paymentMethod(index), { 'class': this.ACTIVE_PAYMENT_METHOD_ATTRIBUTES.class });

    @step('I validate that only one payment method is active at a time')
    public async assertOnlyOnePaymentMethodActive(activeIndex: number): Promise<void> {
        const totalMethods = await this.paymentMethods().locator().count();
        const elements = [];
        for (let i = 0; i < totalMethods; i++) {
            elements.push(this.paymentMethod(i));
        }
        await validateOnlyOneElementActiveGroup(
            elements,
            activeIndex,
            this.ACTIVE_PAYMENT_METHOD_ATTRIBUTES,
            false,
            'payment methods'
        );
    }

    @step('I validate all payment methods are visible and functional')
    public async assertAllPaymentMethodsVisible(softAssert = false): Promise<void> {
        await iterateElements(
            this.paymentMethods().locator(),
            async (methodIndex) => {
                await this.assertPaymentMethodVisible(methodIndex, softAssert);
            }
        );
    }

    @step('I select payment method by index')
    public async selectPaymentMethod(index: number): Promise<void> {
        await clickElement(this.paymentMethod(index));
        await this.assertOnlyOnePaymentMethodActive(index);
    }
}