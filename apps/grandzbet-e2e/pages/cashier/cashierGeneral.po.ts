import { Page } from '@playwright/test';
import { PaymentIQ } from './paymentIQ.po';
import { Deposit } from './deposit.po';
import { Withdraw } from './withdraw.po';
import {
    assertVisible,
    assertNotVisible,
    assertEnabled,
    assertNotEnabled
} from '@test-utils/assertions';
import { clickElement } from '@test-utils/interactions';
import { compositeLocator } from '@test-utils/core-types';
import { step } from '@test-utils/decorators';
import { validateOnlyOneElementActiveGroup } from '@test-utils/attributes';

export type StepType = 'deposit' | 'withdraw';
export type StepNumber = 1 | 2 | 3 | 4;

export class CashierGeneral {
    readonly page: Page;
    readonly paymentIQ: PaymentIQ;
    readonly deposit: Deposit;
    readonly withdraw: Withdraw;

    constructor(page: Page) {
        this.page = page;
        this.paymentIQ = new PaymentIQ(page);
        this.deposit = new Deposit(page);
        this.withdraw = new Withdraw(page);
    }

    // Constants for UI state classes
    private readonly ACTIVE_STEP_CLASSES = {class:'text-primary'};
    private readonly ACTIVE_TAB_CLASSES = {class:'bg-primary-secondary'};

    // Locators
    readonly mainMenu = compositeLocator(() => this.page.locator('#cashier-menu'), 'Cashier Main Menu');
    
    readonly closeButton = compositeLocator(() => 
        this.page.locator('#cashier-menu button.absolute.right-4.top-4'), 'Cashier Close Button');

    readonly depositButton = compositeLocator(() =>
        this.page.locator('.flex.items-start.justify-start.gap-4.text-white button').first(), 'Deposit Tab Button');
    
    readonly withdrawButton = compositeLocator(() => 
        this.page.locator('.flex.items-start.justify-start.gap-4.text-white button').nth(1), 'Withdraw Tab Button');
    
    readonly depositMenu = compositeLocator(() => this.page.locator('#deposit-menu'), 'Deposit Menu');

    readonly withdrawMenu = compositeLocator(() => this.page.locator('#withdraw-menu'), 'Withdraw Menu');

    readonly depositWithoutBonusButton = compositeLocator(() => 
        this.page.locator('.absolute.bottom-0 button'), 'Deposit Without Bonus Button');

    readonly nextButton = compositeLocator(() => this.page.locator('.sticky.bottom-0 button'), 'Next Button');

    readonly getStep = (stepType: StepType, stepNumber: StepNumber) => compositeLocator(() => 
        this.page.locator(`#${stepType}-menu .flex.min-w-max p`).nth(stepNumber - 1), 
        `${stepType.charAt(0).toUpperCase() + stepType.slice(1)} Step ${stepNumber}`);

    // Validation methods
    public validateMainMenuVisible = async () => await assertVisible(this.mainMenu);
    public validateMainMenuNotVisible = async () => await assertNotVisible(this.mainMenu);
    public validateCloseButtonVisible = async () => await assertVisible(this.closeButton);    
    public validateMenuVisible = async (stepType: StepType) => 
        await assertVisible(stepType === 'deposit' ? this.depositMenu : this.withdrawMenu);
    public validateMenuNotVisible = async (stepType: StepType) => 
        await assertNotVisible(stepType === 'deposit' ? this.depositMenu : this.withdrawMenu);  
    public validateNextButtonDisabled = async () => await assertNotEnabled(this.nextButton);
    public validateNextButtonEnabled = async () => await assertEnabled(this.nextButton);

    // Tab button activity validation
    public validateTabButtonActive = async (stepType: StepType) => {
        await validateOnlyOneElementActiveGroup(
            [this.depositButton, this.withdrawButton],
            stepType === 'deposit' ? 0 : 1,
            this.ACTIVE_TAB_CLASSES,
            false,
            'tab buttons'
        );
    };

    // Click actions
    public clickCloseButton = async () => await clickElement(this.closeButton);
    public clickTabButton = async (stepType: StepType) => 
        await clickElement(stepType === 'deposit' ? this.depositButton : this.withdrawButton);
    public clickNextButton = async () => await clickElement(this.nextButton);

    // Step navigation
    @step('Navigate to specific step')
    public async goToStep(stepType: StepType, stepNumber: StepNumber): Promise<void> {
        const stepLocator = this.getStep(stepType, stepNumber);
        await clickElement(stepLocator);
        await this.validateOnlyOneStepActive(stepType, stepNumber);
    }

    @step('Validate only one step is active at a time')
    public async validateOnlyOneStepActive(stepType: StepType, activeStepNumber: StepNumber): Promise<void> {
        const maxSteps = stepType === 'deposit' ? 4 : 3;
        const elements = [];
        for (let stepNum = 1; stepNum <= maxSteps; stepNum++) {
            elements.push(this.getStep(stepType, stepNum as StepNumber));
        }
        const activeIndex = activeStepNumber - 1;
        await validateOnlyOneElementActiveGroup(
            elements,
            activeIndex,
            this.ACTIVE_STEP_CLASSES,
            false,
            `${stepType} steps`
        );
    }

    @step('Switch between deposit and withdraw tabs')
    public async switchBetweenTabs(targetTab: StepType): Promise<void> {
        await this.clickTabButton(targetTab);
        await this.validateMenuVisible(targetTab);
        await this.validateTabButtonActive(targetTab);
    }

    public validateDepositSuccessElements = async () => 
        await this.paymentIQ.validateDepositSuccessElements();

    public validateWithdrawSuccessElements = async () => 
        await this.paymentIQ.validateWithdrawSuccessElements();

    @step('Complete Deposit Step 1')
    public async completeDepositStep1(): Promise<void> {
        await this.deposit.assertBonusListVisible();
        await clickElement(this.depositWithoutBonusButton);
    }

    public async selectPaymentMethod(stepType: StepType, index: number): Promise<void> {
        await (stepType === 'deposit' ? 
            this.deposit.selectPaymentMethod(index) : 
            this.withdraw.selectPaymentMethod(index));
    }

    @step('Complete Deposit Step 2')
    public async completeDepositStep2(paymentMethodIndex = 0): Promise<void> {
        await this.deposit.assertPaymentMethodsSectionVisible();
        await this.deposit.assertAllPaymentMethodsVisible();
        await this.deposit.selectPaymentMethod(paymentMethodIndex);
        await this.deposit.assertOnlyOnePaymentMethodActive(paymentMethodIndex);
        await this.clickNextButton();
    }

    @step('Complete Deposit Step 3')
    public async completeDepositStep3(
        moneyAmount = '25', 
        cardNumber = '4444493318246892', 
        expirationDate = '12/25', 
        cvv = '123'
    ): Promise<void> {
        await this.paymentIQ.fillCardDetails(moneyAmount, cardNumber, expirationDate, cvv);
        await this.paymentIQ.clickSetAmountButton();
    }

    @step('Complete Withdraw Step 1')
    public async completeWithdrawStep1(paymentMethodIndex = 0): Promise<void> {
        await this.withdraw.assertPaymentMethodsSectionVisible();
        await this.withdraw.assertAllPaymentMethodsVisible();
        await this.withdraw.selectPaymentMethod(paymentMethodIndex);
        await this.withdraw.assertOnlyOnePaymentMethodActive(paymentMethodIndex);
        await this.clickNextButton();
    }

    @step('Complete Withdraw Step 2')
    public async completeWithdrawStep2(moneyAmount = '25'): Promise<void> {
        await this.paymentIQ.fillAmount(moneyAmount);
        await this.paymentIQ.clickSetAmountButton();
    }

    @step('Complete full deposit flow')
    public async completeFullDepositFlow(
        paymentMethodIndex = 0,
        amount = '25'
    ): Promise<void> {
        await this.switchBetweenTabs('deposit');
        await this.completeDepositStep1();
        await this.completeDepositStep2(paymentMethodIndex);
        await this.completeDepositStep3(amount);
        await this.validateDepositSuccessElements();
    }

    @step('Complete full withdraw flow')
    public async completeFullWithdrawFlow(
        paymentMethodIndex = 0,
        amount = '25'
    ): Promise<void> {
        await this.switchBetweenTabs('withdraw');
        await this.completeWithdrawStep1(paymentMethodIndex);
        await this.completeWithdrawStep2(amount);
        await this.validateWithdrawSuccessElements();
    }
}
