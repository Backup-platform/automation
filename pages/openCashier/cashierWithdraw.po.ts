import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { step, clickElement, assertVisible, assertNotVisible, assertEnabled, iterateElements } from '../utils/navigation.po';
import { PaymentIQ } from './paymentIQ.po';
import { CardDetails } from './cardDetails';


export class CashierWithdraw {
    readonly page: Page;
    readonly paymentIQ: PaymentIQ;

    constructor(page: Page) {
        this.page = page;
        this.paymentIQ = new PaymentIQ(page);
    }

    // Locators

    readonly stepsContainer = () => this.page.locator('div[class*="walletModalHeading_withdrawalSteps_"]');
    readonly paymentDesktopStep = () => this.page.locator('#wallet-modal-payment-details-step-desktop');
    readonly summaryDesktopStep = () => this.page.locator('#wallet-modal-withdraw-summary-step-desktop');
    readonly paymentMobileStep = () => this.page.locator('#wallet-modal-withdraw-payment-step-mobile');
    readonly detailsMobileStep = () => this.page.locator('#wallet-modal-withdraw-details-step-mobile');
    readonly summaryMobileStep = () => this.page.locator('#wallet-modal-withdraw-summary-step-mobile');

    readonly continueButton = () => this.page.locator('#payment-methods-continue-btn');
    readonly successModalImage = () => this.page.locator("#payment-action-success");
    readonly successModalCashier = () => this.page.locator('div[class*="walletModal_cashierContainer_"][class*="walletModal_h85_"]');
    readonly homeButton = () => this.page.locator('#home-button');

    readonly backButton = () => this.page.locator('div[class*="walletModalHeading_backButton_"]');
    readonly depositPIQSection = () => this.page.locator('#cashier.piq-cashier-wrapper');

    readonly paymentMethodsWrapper = () => this.page.locator('div[class*="paymentMethods_paymentMethodsWrapper_"]');
    readonly paymentMethodsHeading = () => this.page.locator('span[class*="paymentMethods_heading_"]');

    readonly paymentMethodCardContainer = () => this.page.locator('#payment-methods-container');
    readonly paymentCards = () => this.page.locator('div[class*="paymentMethods_paymentMethodCard_"]');
    readonly paymentSingleCard = (cardIndex: number) => this.page.locator(`#payment-method-${cardIndex}`);


    // Actions for Validations
    public validateStepsContainerVisible = async (softAssert = false) =>
        await assertVisible(this.stepsContainer(), `Deposit steps`, softAssert);

    public validatePaymentStepDesktopVisible = async (softAssert = false) =>
        await assertVisible(this.paymentDesktopStep(), `Payment step (desktop)`, softAssert);

    public validateSummaryStepDesktopVisible = async (softAssert = false) =>
        await assertVisible(this.summaryDesktopStep(), `Summary step (desktop)`, softAssert);

    public validatePaymentStepMobileVisible = async (softAssert = false) =>
        await assertVisible(this.paymentMobileStep(), `Payment step (mobile)`, softAssert);

    public validateDetailsStepMobileVisible = async (softAssert = false) =>
        await assertVisible(this.detailsMobileStep(), `Details step (mobile)`, softAssert);

    public validateSummaryStepMobileVisible = async (softAssert = false) =>
        await assertVisible(this.summaryMobileStep(), `Summary step (mobile)`, softAssert);

    public validateContinueButtonVisible = async (softAssert = false) =>
        await assertVisible(this.continueButton(), `Continue button`, softAssert);

    public validateSuccessModalImageVisible = async (softAssert = false) =>
        await assertVisible(this.successModalImage(), `Success modal image`, softAssert);

    public validateSuccessModalCashierVisible = async (softAssert = false) =>
        await assertVisible(this.successModalCashier(), `Success modal cashier`, softAssert);

    public validateHomeButtonVisible = async (softAssert = false) =>
        await assertVisible(this.homeButton(), `Home button`, softAssert);

    public validateBackButtonVisible = async (softAssert = false) =>
        await assertVisible(this.backButton(), `Back button`, softAssert);

    public validatePaymentMethodsVisible = async (softAssert = false) =>
        await assertVisible(this.paymentMethodsWrapper(), `Payment methods wrapper`, softAssert);

    public validatePaymentMethodsHeadingVisible = async (softAssert = false) =>
        await assertVisible(this.paymentMethodsHeading(), `Payment methods heading`, softAssert);

    public validatePaymentCardVisible = async (nthCard: number, softAssert = false) =>
        await assertVisible(this.paymentSingleCard(nthCard), `Payment card with number: ${nthCard}`, softAssert);

    public validateDetailsPIQSectionVisible = async (softAssert = false) =>
        await assertVisible(this.depositPIQSection(), `Details PIQ section`, softAssert);

    public validatePaymentContinueButtonVisible = async (softAssert = false) =>
        await assertVisible(this.continueButton(), `Continue button`, softAssert);

    // Actions for Interactions
    public clickContinueButton = async () =>
        await clickElement(this.continueButton(), `Continue button`);

    public clickHomeButton = async () =>
        await clickElement(this.homeButton(), `Home button`);

    public clickBackButton = async () =>
        await clickElement(this.backButton(), `Back button`);

    public selectPaymentCard = async (nthCard: number) =>
        await clickElement(this.paymentSingleCard(nthCard), `Payment card ${nthCard}`);

    @step('I validate payment step elements are visible (mobile)')
    public async validatePaymentStepElementsMobile(softAssert = false): Promise<void> {
        await this.validatePaymentContinueButtonVisible(softAssert);
        await assertEnabled(this.continueButton(), `Continue button`, softAssert);
        await assertNotVisible(this.depositPIQSection(), `Details PIQ section`, softAssert);
        await this.validatePaymentStepElements(softAssert);
    }

    @step('I validate payment step elements are visible (desktop)')
    public async validatePaymentStepElementsDesktop(softAssert = false): Promise<void> {
        await assertNotVisible(this.continueButton(), `Continue button`, softAssert);
        await this.validateDetailsPIQSectionVisible(softAssert);
        await this.validatePaymentStepElements(softAssert);
    }

    @step('I validate payment step elements are visible (common)')
    public async validatePaymentStepElements(softAssert = false): Promise<void> {
        await this.validatePaymentMethodsVisible(softAssert);
        await this.validatePaymentMethodsHeadingVisible(softAssert);
        await assertNotVisible(this.backButton(), `Back button`, softAssert);
        await iterateElements(this.paymentCards(), async (index) => {
            await this.validatePaymentCardVisible(index, softAssert), 'Payment card'
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

    @step('I validate withdraw steps counter (mobile)')
    public async validateStepsCounterMobile(softAssert = false): Promise<void> {
        await this.validateStepsContainerVisible(softAssert);
        await this.validatePaymentStepMobileVisible(softAssert);
        await this.validateDetailsStepMobileVisible(softAssert);
        await this.validateSummaryStepMobileVisible(softAssert);
        await assertNotVisible(this.paymentDesktopStep(), `Payment step (desktop)`, softAssert);
        await assertNotVisible(this.summaryDesktopStep(), `Summary step (desktop)`, softAssert);
    }

    @step('I validate withdraw steps counter (desktop)')
    public async validateStepsCounterDesktop(softAssert = false): Promise<void> {
        await this.validateStepsContainerVisible(softAssert);
        await this.validatePaymentStepDesktopVisible(softAssert);
        await this.validateSummaryStepDesktopVisible(softAssert);
        await assertNotVisible(this.summaryMobileStep(), `Summary step (mobile)`, softAssert);
        await assertNotVisible(this.detailsMobileStep(), `Details step (mobile)`, softAssert);
    }

    @step('I perform full withdraw flow')
    public async performWithdrawFlow(isDesktop: boolean, paymentTypeIndex: number, card: CardDetails): Promise<void> {
        if (isDesktop) {
            await this.performDesktopWithdrawFlow(card);
        } else {
            await this.performMobileWithdrawFlow(card);
        }
    }

    // Private methods for desktop and mobile withdraw flows
    private async performDesktopWithdrawFlow(card: CardDetails): Promise<void> {
        await this.validateStepsCounterDesktop();
        await this.validatePaymentStepElementsDesktop();
        //await this.selectPaymentCard(paymentTypeIndex);
        await this.paymentIQ.performWithdrawAndValidate(card.amount);
        await this.validateSummaryStepElementsDesktop();
    }

    private async performMobileWithdrawFlow(card: CardDetails): Promise<void> {
        await this.validateStepsCounterMobile();
        await this.validatePaymentStepElementsMobile();
        //await this.selectPaymentCard(paymentTypeIndex);
        await this.clickContinueButton();
        await this.validateDetailsStepElementsMobile();
        await this.paymentIQ.performWithdrawAndValidate(card.amount);
        await this.validateSummaryStepElementsMobile();
    }
}