import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam, assertAttribute, assertElementContainsText, clickElement, assertVisible, assertNotVisible, fillInputField, assertEditable, assertEnabled, assertNotEnabled, iterateElements } from '../utils/navigation.po';


export class CashierWithdraw {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
    }

    // Locators
    //TODO: this needs steps from the specs


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
        await assertVisible(this.stepsContainer(), softAssert, 'Deposit steps');

    public validatePaymentStepDesktopVisible = async (softAssert = false) => 
        await assertVisible(this.paymentDesktopStep(), softAssert, 'Payment step (desktop)');

    public validateSummaryStepDesktopVisible = async (softAssert = false) => 
        await assertVisible(this.summaryDesktopStep(), softAssert, 'Summary step (desktop)');

    public validatePaymentStepMobileVisible = async (softAssert = false) => 
        await assertVisible(this.paymentMobileStep(), softAssert, 'Payment step (mobile)');

    public validateDetailsStepMobileVisible = async (softAssert = false) => 
        await assertVisible(this.detailsMobileStep(), softAssert, 'Details step (mobile)');

    public validateSummaryStepMobileVisible = async (softAssert = false) => 
        await assertVisible(this.summaryMobileStep(), softAssert, 'Summary step (mobile)');

    public validateContinueButtonVisible = async (softAssert = false) => 
        await assertVisible(this.continueButton(), softAssert, 'Continue button');

    public validateSuccessModalImageVisible = async (softAssert = false) => 
        await assertVisible(this.successModalImage(), softAssert, 'Success modal image');

    public validateSuccessModalCashierVisible = async (softAssert = false) => 
        await assertVisible(this.successModalCashier(), softAssert, 'Success modal cashier');

    public validateHomeButtonVisible = async (softAssert = false) => 
        await assertVisible(this.homeButton(), softAssert, 'Home button');

    public validateBackButtonVisible = async (softAssert = false) => 
        await assertVisible(this.backButton(), softAssert, 'Back button');

    public validatePaymentMethodsVisible = async (softAssert = false) => 
        await assertVisible(this.paymentMethodsWrapper(), softAssert, 'Payment methods wrapper');

    public validatePaymentMethodsHeadingVisible = async (softAssert = false) => 
        await assertVisible(this.paymentMethodsHeading(), softAssert, 'Payment methods heading');

    public validatePaymentCardVisible = async (nthCard: number, softAssert = false) => 
        await assertVisible(this.paymentSingleCard(nthCard), softAssert, `Payment card with number: ${nthCard}`);

    public validateDetailsPIQSectionVisible = async (softAssert = false) => 
        await assertVisible(this.depositPIQSection(), softAssert, 'Details PIQ section');

    public validatePaymentContinueButtonVisible = async (softAssert = false) => 
        await assertVisible(this.continueButton(), softAssert, 'Continue button');

    // Actions for Interactions
    public clickContinueButton = async () => 
        await clickElement(this.continueButton(), 'Continue button');

    public clickHomeButton = async () => 
        await clickElement(this.homeButton(), 'Home button');

    public clickBackButton = async () => 
        await clickElement(this.backButton(), 'Back button');

    public selectPaymentCard = async (nthCard: number) => 
        await clickElement(this.paymentSingleCard(nthCard), `Payment card ${nthCard}`);

    @step('I validate payment step elements are visible (mobile)')
    public async validatePaymentStepElementsMobile(softAssert = false): Promise<void> {
        await this.validatePaymentContinueButtonVisible(softAssert);
        await assertEnabled(this.continueButton(), softAssert, 'Continue button');
        await assertNotVisible(this.depositPIQSection(), softAssert, 'Details PIQ section');
        await this.validatePaymentStepElements(softAssert);
    }

    @step('I validate payment step elements are visible (desktop)')
    public async validatePaymentStepElementsDesktop(softAssert = false): Promise<void> {
        await assertNotVisible(this.continueButton(), softAssert, 'Continue button');
        await this.validateDetailsPIQSectionVisible(softAssert);
        await this.validatePaymentStepElements(softAssert);
    }

    @step('I validate payment step elements are visible (common)')
    public async validatePaymentStepElements(softAssert = false): Promise<void> {
        await this.validatePaymentMethodsVisible(softAssert);
        await this.validatePaymentMethodsHeadingVisible(softAssert);
        await assertNotVisible(this.backButton(), softAssert, 'Back button');
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
        await assertNotVisible(this.successModalImage(), softAssert);
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
        await assertNotVisible(this.paymentDesktopStep(), softAssert, 'Payment step (desktop)');
        await assertNotVisible(this.summaryDesktopStep(), softAssert, 'Summary step (desktop)');
    }

    @step('I validate withdraw steps counter (desktop)')
    public async validateStepsCounterDesktop(softAssert = false): Promise<void> {
        await this.validateStepsContainerVisible(softAssert);
        await this.validatePaymentStepDesktopVisible(softAssert);
        await this.validateSummaryStepDesktopVisible(softAssert);
        await assertNotVisible(this.summaryMobileStep(), softAssert, 'Summary step (mobile)');
        await assertNotVisible(this.detailsMobileStep(), softAssert, 'Details step (desktop)');
    }

}