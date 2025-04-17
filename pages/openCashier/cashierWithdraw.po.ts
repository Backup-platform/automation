import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';


export class CashierWithdraw {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
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
    public async validateStepsContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.stepsContainer(), softAssert, 'Deposit steps');
    }

    public async validatePaymentStepDesktopVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.paymentDesktopStep(), softAssert, 'Payment step (desktop)');
    }

    public async validateSummaryStepDesktopVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.summaryDesktopStep(), softAssert, 'Summary step (desktop)');
    }

    public async validatePaymentStepMobileVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.paymentMobileStep(), softAssert, 'Payment step (mobile)');
    }

    public async validateDetailsStepMobileVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.detailsMobileStep(), softAssert, 'Details step (mobile)');
    }

    public async validateSummaryStepMobileVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.summaryMobileStep(), softAssert, 'Summary step (mobile)');
    }

    public async validateContinueButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.continueButton(), softAssert, 'Continue button');
    }

    public async validateSuccessModalImageVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.successModalImage(), softAssert, 'Success modal image');
    }

    public async validateSuccessModalCashierVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.successModalCashier(), softAssert, 'Success modal cashier');
    }

    public async validateHomeButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.homeButton(), softAssert, 'Home button');
    }

    public async validateBackButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.backButton(), softAssert, 'Back button');
    }

    public async validatePaymentMethodsVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.paymentMethodsWrapper(), softAssert, 'Payment methods wrapper');
    }

    public async validatePaymentMethodsHeadingVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.paymentMethodsHeading(), softAssert, 'Payment methods heading');
    }

    public async validatePaymentCardVisible(nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.paymentSingleCard(nthCard), softAssert, `Payment card with number: ${nthCard}`);
    }

    public async validateDetailsPIQSectionVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.depositPIQSection(), softAssert, 'Details PIQ section');
    }

    public async validatePaymentContinueButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.continueButton(), softAssert, 'Continue button');
    }

    // Actions for Interactions
    public async clickContinueButton(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.continueButton(), softAssert, 'Continue button');
    }

    public async clickHomeButton(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.homeButton(), softAssert, 'Home button');
    }

public async clickBackButton(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.backButton(), softAssert, 'Back button');
    }

    public async selectPaymentCard(nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.paymentSingleCard(nthCard), softAssert, `Payment card ${nthCard}`);
    }

    @step('I validate payment step elements are visible (mobile)')
    public async validatePaymentStepElementsMobile(softAssert = false): Promise<void> {
        await this.validatePaymentContinueButtonVisible(softAssert);
        await this.navigation.assertEnabled(this.continueButton(), softAssert, 'Continue button');
        await this.navigation.assertNotVisible(this.depositPIQSection(), softAssert, 'Details PIQ section');
        await this.validatePaymentStepElements(softAssert);
    }

    @step('I validate payment step elements are visible (desktop)')
    public async validatePaymentStepElementsDesktop(softAssert = false): Promise<void> {
        await this.navigation.assertNotVisible(this.continueButton(), softAssert, 'Continue button');
        await this.validateDetailsPIQSectionVisible(softAssert);
        await this.validatePaymentStepElements(softAssert);
    }

    @step('I validate payment step elements are visible (common)')
    public async validatePaymentStepElements(softAssert = false): Promise<void> {
        await this.validatePaymentMethodsVisible(softAssert);
        await this.validatePaymentMethodsHeadingVisible(softAssert);
        await  this.navigation.assertNotVisible(this.backButton(), softAssert, 'Back button');
        await this.navigation.iterateElements(this.paymentCards(), async (index) => {
            await this.validatePaymentCardVisible(index, softAssert);
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
        await this.navigation.assertNotVisible(this.successModalImage(), softAssert);
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
        await this.navigation.assertNotVisible(this.paymentDesktopStep(), softAssert, 'Payment step (desktop)');
        await this.navigation.assertNotVisible(this.summaryDesktopStep(), softAssert, 'Summary step (desktop)');
    }

    @step('I validate withdraw steps counter (desktop)')
    public async validateStepsCounterDesktop(softAssert = false): Promise<void> {
        await this.validateStepsContainerVisible(softAssert);
        await this.validatePaymentStepDesktopVisible(softAssert);
        await this.validateSummaryStepDesktopVisible(softAssert);
        await this.navigation.assertNotVisible(this.summaryMobileStep(), softAssert, 'Summary step (mobile)');
        await this.navigation.assertNotVisible(this.detailsMobileStep(), softAssert, 'Details step (desktop)');
    }

}