import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam,  assertAttribute, assertElementContainsText, clickElement, assertVisible, assertNotVisible, fillInputField, assertEditable, assertEnabled, assertNotEnabled, iterateElements } from '../utils/navigation.po';

export class CashierDeposit {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page)
    }

    // Locators
    //TODO: active step
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
    //TODO: add deposit with bonus

    //Payment
    readonly paymentMethodsWrapper = () => this.page.locator('div[class*="paymentMethods_paymentMethodsWrapper_"]');
    readonly paymentMethodsHeading = () => this.page.locator('span[class*="paymentMethods_heading_"]');
    readonly paymentContinueButton = () => this.page.locator('#payment-methods-continue-btn');

    //TODO: cards should be handled more gracefully 
    readonly paymentMethodCardContainer = () => this.page.locator('#payment-methods-container');
    readonly paymentCards = () => this.page.locator('div[class*="paymentMethods_paymentMethodCard_"]');
    readonly paymentSingleCard = (cardIndex: number) => this.page.locator(`#payment-method-${cardIndex}`);

    //Details - no unique locators

    //Success
    readonly successModalImage = () => this.page.locator("#payment-action-success");
    readonly successModalCashier = () => this.page.locator('div[class*="walletModal_cashierContainer_"][class*="walletModal_h85_"]');
    readonly homeButton = () => this.page.locator('#home-button');


    //TODO: details section
    //TODO: needs steps from the specs


    // Actions
    public validateBackButtonVisible = async (softAssert = false) => 
        await assertVisible(this.backButton(), softAssert, 'Back button');

    public clickBackButton = async () => 
        await clickElement(this.backButton(), 'Back button');

    public validateDepoitWithoutBonusVisible = async (softAssert = false) => 
        await assertVisible(this.depositWithoutBonus(), softAssert, 'Deposit without bonus button');

    public clickDepositWithoutBonus = async () => 
        await clickElement(this.depositWithoutBonus(), 'Deposit without bonus button');

    public selectPaymentCard = async (nthCard: number) => 
        await clickElement(this.paymentSingleCard(nthCard), `Payment card ${nthCard}`);

    public validatePaymentMethodsHeadingVisible = async (softAssert = false) => 
        await assertVisible(this.paymentMethodsHeading(), softAssert, 'Payment methods heading');

    public validateStepsContainerVisible = async (softAssert = false) => 
        await assertVisible(this.stepsContainer(), softAssert, 'Deposit steps');

    public validateBonusStepVisible = async (softAssert = false) => 
        await assertVisible(this.bonusStep(), softAssert, 'Bonus step');

    public validatePaymentStepVisible = async (softAssert = false) => 
        await assertVisible(this.paymentStep(), softAssert, 'Payment step');

    public validateDetailsStepMobileVisible = async (softAssert = false) => 
        await assertVisible(this.detailsMobileStep(), softAssert, 'Details step (mobile)');

    public validateSummaryStepDesktopVisible = async (softAssert = false) => 
        await assertVisible(this.summaryDesktopStep(), softAssert, 'Summary step (desktop)');

    public validateSummaryStepMobileVisible = async (softAssert = false) => 
        await assertVisible(this.summaryMobileStep(), softAssert, 'Summary step (mobile)');

    public validateBonusStepModalVisible = async (softAssert = false) => 
        await assertVisible(this.modalContainer(), softAssert, 'Bonus step modal');

    public validatePaymentMethodsVisible = async (softAssert = false) => 
        await assertVisible(this.paymentMethodsWrapper(), softAssert, 'Payment methods wrapper');

    public validatePaymentCardVisible = async (nthCard: number, softAssert = false) => 
        await assertVisible(this.paymentSingleCard(nthCard), softAssert, `Payment card with number: ${nthCard} `);

    public validateSuccessModalImageVisible = async (softAssert = false) => 
        await assertVisible(this.successModalImage(), softAssert, 'Success modal image');

    public validateSuccessModalCashierVisible = async (softAssert = false) => 
        await assertVisible(this.successModalCashier(), softAssert, 'Success modal cashier');

    public validatePaymentContinueButtonVisible = async (softAssert = false) => 
        await assertVisible(this.paymentContinueButton(), softAssert, 'Continue button');

    public clickPaymentContinueButton = async () => 
        await clickElement(this.paymentContinueButton(), 'Continue button');

    public validateDetailsPIQSectionVisible = async (softAssert = false) => 
        await assertVisible(this.depositPIQSection(), softAssert, 'Details PIQ section');

    public clickHomeButton = async () => 
        await clickElement(this.homeButton(), 'Home button');

    public validateHomeButtonVisible = async (softAssert = false) => 
        await assertVisible(this.homeButton(), softAssert, 'Home button');

    @step('I validate the elements of the active step are visible') 
    public async validateActiveStepElements(softAssert = false): Promise<void> {
        //TODO: only validate the elements that are active
    }

    @step('I validate bonus step elements are visible')
    public async validateBonusStepElements(softAssert = false): Promise<void> {
        await this.validateBonusStepVisible(softAssert);
        await this.validateBonusStepModalVisible(softAssert);
        await this.validateDepoitWithoutBonusVisible(softAssert);
    }

    @step('I validate payment step elements are visible (mobile)')
    public async validatePaymentStepElementsMobile(softAssert = false): Promise<void> {
        await this.validatePaymentContinueButtonVisible(softAssert);
        await assertEnabled(this.paymentContinueButton(), softAssert, 'Continue button');
        await assertNotVisible(this.depositPIQSection(), softAssert, 'Details PIQ section');
        await this.validatePaymentStepElements(softAssert);
    }

    @step('I validate payment step elements are visible (desktop)')
    public async validatePaymentStepElementsDesktop(softAssert = false): Promise<void> {
        await assertNotVisible(this.paymentContinueButton(), softAssert, 'Continue button');
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
        await assertNotVisible(this.successModalImage(), softAssert);
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
        await assertNotVisible(this.summaryDesktopStep(), softAssert, 'Summary step (desktop)');
    }

    @step('I validate payment steps counter (desktop) are visible')
    public async validateStepsCounterDesktop(softAssert = false): Promise<void> {
        await this.validateStepCounterVisible(softAssert);
        await this.validateSummaryStepDesktopVisible(softAssert);
        await assertNotVisible(this.summaryMobileStep(), softAssert, 'Summary step (mobile)');
        await assertNotVisible(this.detailsMobileStep(), softAssert, 'Summary step (desktop)');
    }

    @step('I validate that the summary step (common) is visible')
    public async validateStepCounterVisible(softAssert = false): Promise<void> {
        await this.validateStepsContainerVisible(softAssert);
        await this.validateBonusStepVisible(softAssert);
        await this.validatePaymentStepVisible(softAssert);
    }
}