import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { step, clickElement, assertVisible, assertNotVisible, assertEnabled, iterateElements } from '../utils/navigation.po';
import { PaymentIQ } from './paymentIQ.po';
import { CardDetails } from './cardDetails';

export class CashierDeposit {
    readonly page: Page;
    readonly paymentIQ: PaymentIQ;

    constructor(page: Page) {
        this.page = page;
        this.paymentIQ = new PaymentIQ(page);
    }

    // Locators
    readonly stepsContainer = () => this.page.locator('div[class*="walletModalHeading_depositSteps_"]');
    readonly bonusStep = () => this.page.locator('#wallet-modal-bonus-step');
    readonly paymentStep = () => this.page.locator('#wallet-modal-payment-step');
    readonly detailsMobileStep = () => this.page.locator('#wallet-modal-details-step-mobile');
    readonly summaryDesktopStep = () => this.page.locator('#wallet-modal-summary-step-desktop');
    readonly summaryMobileStep = () => this.page.locator('#wallet-modal-summary-step-mobile');

    readonly backButton = () => this.page.locator('div[class*="walletModalHeading_backButton_"]');
    readonly depositPIQSection = () => this.page.locator('#cashier.piq-cashier-wrapper');

    //Choose Bonus step
    readonly modalContainer = () => this.page.locator('#wallet-modal-body-container');
    readonly depositWithoutBonus = () => this.page.locator('#wallet-continue-without-bonus-btn');

    //Payment
    readonly paymentMethodsWrapper = () => this.page.locator('div[class*="paymentMethods_paymentMethodsWrapper_"]');
    readonly paymentMethodsHeading = () => this.page.locator('span[class*="paymentMethods_heading_"]');
    readonly paymentContinueButton = () => this.page.locator('#payment-methods-continue-btn');

    readonly paymentMethodCardContainer = () => this.page.locator('#payment-methods-container');
    readonly paymentCards = () => this.page.locator('div[class*="paymentMethods_paymentMethodCard_"]');
    readonly paymentSingleCard = (cardIndex: number) => this.page.locator(`#payment-method-${cardIndex}`);

    //Details - no unique locators

    //Success
    readonly successModalImage = () => this.page.locator("#payment-action-success");
    readonly successModalCashier = () => this.page.locator('div[class*="walletModal_cashierContainer_"][class*="walletModal_h85_"]');
    readonly homeButton = () => this.page.locator('#home-button');

    // Actions
    public validateBackButtonVisible = async (softAssert = false) =>
        await assertVisible(this.backButton(), 'Back button', softAssert);

    public clickBackButton = async () =>
        await clickElement(this.backButton(), 'Back button');

    public validateDepositWithoutBonusVisible = async (softAssert = false) =>
        await assertVisible(this.depositWithoutBonus(), 'Deposit without bonus button', softAssert);

    public clickDepositWithoutBonus = async () =>
        await clickElement(this.depositWithoutBonus(), 'Deposit without bonus button');

    public selectPaymentCard = async (nthCard: number) =>
        await clickElement(this.paymentSingleCard(nthCard), `Payment card ${nthCard}`);

    public validatePaymentMethodsHeadingVisible = async (softAssert = false) =>
        await assertVisible(this.paymentMethodsHeading(), 'Payment methods heading', softAssert);

    public validateStepsContainerVisible = async (softAssert = false) =>
        await assertVisible(this.stepsContainer(), 'Deposit steps', softAssert);

    public validateBonusStepVisible = async (softAssert = false) =>
        await assertVisible(this.bonusStep(), 'Bonus step', softAssert);

    public validatePaymentStepVisible = async (softAssert = false) =>
        await assertVisible(this.paymentStep(), 'Payment step', softAssert);

    public validateDetailsStepMobileVisible = async (softAssert = false) =>
        await assertVisible(this.detailsMobileStep(), 'Details step (mobile)', softAssert);

    public validateSummaryStepDesktopVisible = async (softAssert = false) =>
        await assertVisible(this.summaryDesktopStep(), 'Summary step (desktop)', softAssert);

    public validateSummaryStepMobileVisible = async (softAssert = false) =>
        await assertVisible(this.summaryMobileStep(), 'Summary step (mobile)', softAssert);

    public validateBonusStepModalVisible = async (softAssert = false) =>
        await assertVisible(this.modalContainer(), 'Bonus step modal', softAssert);

    public validatePaymentMethodsVisible = async (softAssert = false) =>
        await assertVisible(this.paymentMethodsWrapper(), 'Payment methods wrapper', softAssert);

    public validatePaymentCardVisible = async (nthCard: number, softAssert = false) =>
        await assertVisible(this.paymentSingleCard(nthCard), `Payment card with number: ${nthCard} `, softAssert);

    public validateSuccessModalImageVisible = async (softAssert = false) =>
        await assertVisible(this.successModalImage(), `Success modal image`, softAssert);

    public validateSuccessModalCashierVisible = async (softAssert = false) =>
        await assertVisible(this.successModalCashier(), `Success modal cashier`, softAssert);

    public validateContinueButtonVisible = async (softAssert = false) =>
        await assertVisible(this.paymentContinueButton(), `Continue button`, softAssert);

    public clickContinueButton = async () =>
        await clickElement(this.paymentContinueButton(), 'Continue button');

    public validateDetailsPIQSectionVisible = async (softAssert = false) =>
        await assertVisible(this.depositPIQSection(), `Details PIQ section`, softAssert);

    public clickHomeButton = async () =>
        await clickElement(this.homeButton(), 'Home button');

    public validateHomeButtonVisible = async (softAssert = false) =>
        await assertVisible(this.homeButton(), `Home button`, softAssert);

    @step('I validate the elements of the active step are visible')
    public async validateActiveStepElements(softAssert = false): Promise<void> {
    }

    @step('I validate bonus step elements are visible')
    public async validateBonusStepElements(softAssert = false): Promise<void> {
        await this.validateBonusStepVisible(softAssert);
        await this.validateBonusStepModalVisible(softAssert);
        await this.validateDepositWithoutBonusVisible(softAssert);
    }

    @step('I validate payment step elements are visible (mobile)')
    public async validatePaymentStepElementsMobile(softAssert = false): Promise<void> {
        await this.validateContinueButtonVisible(softAssert);
        await assertEnabled(this.paymentContinueButton(), `Continue button`, softAssert);
        await assertNotVisible(this.depositPIQSection(), `Details PIQ section`, softAssert);
        await this.validatePaymentStepElements(softAssert);
    }

    @step('I validate payment step elements are visible (desktop)')
    public async validatePaymentStepElementsDesktop(softAssert = false): Promise<void> {
        await assertNotVisible(this.paymentContinueButton(), `Continue button`, softAssert);
        await this.validateDetailsPIQSectionVisible(softAssert);
        await this.validatePaymentStepElements(softAssert);
    }

    @step('I validate payment step elements are visible (common)')
    public async validatePaymentStepElements(softAssert = false): Promise<void> {
        await this.validatePaymentMethodsVisible(softAssert);
        await this.validatePaymentMethodsHeadingVisible(softAssert);
        await this.validateBackButtonVisible(softAssert);
        await iterateElements(this.paymentCards(), async (index) => {
            await this.validatePaymentCardVisible(index, softAssert), `Payment cards`;
        });
    }

    @step('I validate details step elements are visible (mobile)')
    public async validateDetailsStepElementsMobile(softAssert = false): Promise<void> {
        await this.validateDetailsStepMobileVisible(softAssert);
        await this.validateBackButtonVisible(softAssert);
        await this.validateDetailsPIQSectionVisible(softAssert);
    }

    @step('I validate summary step elements (desktop)')
    public async validateSummaryStepElementsDesktop(softAssert = false): Promise<void> {
        await this.validateSuccessModalImageVisible(softAssert);
        await this.validateSummaryStepElements(softAssert);
    }

    @step('I validate summary step elements (mobile)')
    public async validateSummaryStepElementsMobile(softAssert = false): Promise<void> {
        await assertNotVisible(this.successModalImage(), `Success modal image`, softAssert);
        await this.validateSummaryStepElements(softAssert);
    }

    @step('I validate summary step elements (common)')
    public async validateSummaryStepElements(softAssert = false): Promise<void> {
        await this.validateSuccessModalCashierVisible(softAssert);
        await this.validateDetailsPIQSectionVisible(softAssert);
        await this.validateHomeButtonVisible(softAssert);
    }

    @step('I validate deposit steps counter (mobile) are visible')
    public async validateStepsCounterMobile(softAssert = false): Promise<void> {
        await this.validateStepCounterVisible(softAssert);
        await this.validateDetailsStepMobileVisible(softAssert);
        await this.validateSummaryStepMobileVisible(softAssert);
        await assertNotVisible(this.summaryDesktopStep(), `Summary step (desktop)`, softAssert);
    }

    @step('I validate payment steps counter (desktop) are visible')
    public async validateStepsCounterDesktop(softAssert = false): Promise<void> {
        await this.validateStepCounterVisible(softAssert);
        await this.validateSummaryStepDesktopVisible(softAssert);
        await assertNotVisible(this.summaryMobileStep(), `Summary step (mobile)`, softAssert);
        await assertNotVisible(this.detailsMobileStep(), `Details step (mobile)`, softAssert);
    }

    @step('I validate that the summary step (common) is visible')
    public async validateStepCounterVisible(softAssert = false): Promise<void> {
        await this.validateStepsContainerVisible(softAssert);
        await this.validateBonusStepVisible(softAssert);
        await this.validatePaymentStepVisible(softAssert);
    }

    @step('I perform full deposit flow')
    public async performDepositFlow(isDesktop: boolean, paymentTypeIndex: number, card: CardDetails): Promise<void> {
        if (isDesktop) {
            await this.performDesktopDepositFlow(card);
        } else {
            await this.performMobileDepositFlow(card);
        }
    }

    // Private methods for desktop and mobile deposit flows
    private async performDesktopDepositFlow(card: CardDetails): Promise<void> {
        await this.validateStepsCounterDesktop();
        await this.clickDepositWithoutBonus();
        await this.validatePaymentStepElementsDesktop();
                //await this.selectPaymentCard(paymentTypeIndex);
        await this.paymentIQ.performDepositAndValidate(card.amount, card.number, card.expiry, card.cvv);
        await this.validateSummaryStepElementsDesktop();
    }

    private async performMobileDepositFlow(card: CardDetails): Promise<void> {
        await this.validateStepsCounterMobile();
        await this.clickDepositWithoutBonus();
        await this.validatePaymentStepElementsMobile();
                //await this.selectPaymentCard(paymentTypeIndex);
        await this.clickContinueButton();
        await this.validateDetailsStepElementsMobile();
        await this.paymentIQ.performDepositAndValidate(card.amount, card.number, card.expiry, card.cvv);
        await this.validateSummaryStepElementsMobile();
    }
}