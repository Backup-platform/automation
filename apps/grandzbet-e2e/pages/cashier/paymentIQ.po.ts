import { Page } from '@playwright/test';
import {
    assertVisible,
    compositeLocator,
    clickElement,
    compositeFrameLocator,
    fillInputField,
    step,
    validateAllElementsVisibility
} from '@test-utils/navigation.po';

export class PaymentIQ {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators


    // Frame Locators 
    private readonly cashierIframeSelector = '#cashierIframe';
    private getCashierFrame = () => this.page.frameLocator(this.cashierIframeSelector);
    
    private readonly hostedFieldIframeSelector = '#hosted-field-single-iframe';
    private getHostedFieldFrame = () => this.getCashierFrame().frameLocator(this.hostedFieldIframeSelector);

    // Card Input Fields
    private readonly cardName = compositeLocator(() => 
        this.getHostedFieldFrame().locator('input[id="frmNameCC"]'), 'Card Name Input');

    private readonly cardNumber = compositeLocator(() => 
        this.getHostedFieldFrame().locator('input[id="frmCCNum"]'), 'Card Number Input');

    private readonly expirationDate = compositeLocator(() => 
        this.getHostedFieldFrame().locator('input[id="frmCCExp"]'), 'Expiration Date Input');

    private readonly cvv = compositeLocator(() => 
        this.getHostedFieldFrame().locator('input[id="frmCCCVC"]'), 'CVV Input');

    // Main Elements
    private readonly cashier = compositeLocator(() => 
        this.getCashierFrame().locator('#cashier'), 'Cashier Container');

    private readonly logoContainer = compositeLocator(() => 
        this.getCashierFrame().locator('.logo-container'), 'Logo Container');

    private readonly predefinedAmountsContainer = compositeLocator(() => 
        this.getCashierFrame().locator('.predefinedvalues'), 'Predefined Amounts Container');

    private readonly predefinedAmount = compositeLocator(() => 
        this.getCashierFrame().locator('.predefinedvalues-btn'), 'Predefined Amount Button');

    private readonly selectCardDropdown = compositeLocator(() => 
        this.getCashierFrame().locator('div.dropdown-container.dropdown-border'), 'Select Card Dropdown');

    private readonly deleteAccountButton = compositeLocator(() => 
        this.getCashierFrame().locator('span[class*="remove-account"]'), 'Delete Account Button');

    private readonly vueCancelButton = compositeLocator(() => 
        this.getCashierFrame().locator('button[class*="vue-dialog-button"]:nth-of-type(1)'), 'Vue Cancel Button');

    private readonly vueDeleteButton = compositeLocator(() => 
        this.getCashierFrame().locator('button[class*="vue-dialog-button"]:nth-of-type(2)'), 'Vue Delete Button');

    private readonly singlePredefinedAmount = (nthCard: number) => compositeLocator(() =>
        this.predefinedAmountsContainer.locator().nth(nthCard).locator('button.predefinedvalue'), `Single Predefined Amount ${nthCard}`);

    private readonly amountInput = compositeLocator(() =>
        this.getCashierFrame().locator('input[name="setAmount"]'), 'Amount Input');

    private readonly setAmountButton = compositeLocator(() =>
        this.getCashierFrame().locator('.btn.cashier-button.submit-button'), 'Set Amount Button');

    // Summary Row Locators
    private readonly summaryRow = (rowIndex: number) => compositeLocator(() => 
        this.getCashierFrame().locator(`.success-message.flex.space-between:nth-of-type(${rowIndex})`), `Summary Row ${rowIndex}`);

    private readonly rowLabel = (rowIndex: number) => compositeLocator(() => 
        this.summaryRow(rowIndex).locator().locator('[class*="label"]'), `Row Label ${rowIndex}`);

    private readonly rowValue = (rowIndex: number) => compositeLocator(() => 
        this.summaryRow(rowIndex).locator().locator('[class*="value"]'), `Row Value ${rowIndex}`);

    // Specific Rows for Deposit Summary
    private readonly accountDepositLabel = compositeLocator(() => 
        this.rowLabel(1).locator(), 'Account Deposit Label');
    private readonly accountDepositValue = compositeLocator(() => 
        this.rowValue(1).locator(), 'Account Deposit Value');

    private readonly amountDepositedToPlayerAccountLabel = compositeLocator(() => 
        this.rowLabel(2).locator(), 'Amount Deposited To Player Account Label');
    private readonly amountDepositedToPlayerAccountValue = compositeLocator(() => 
        this.rowValue(2).locator(), 'Amount Deposited To Player Account Value');

    private readonly feeDepositLabel = compositeLocator(() => 
        this.rowLabel(3).locator(), 'Fee Deposit Label');
    private readonly feeDepositValue = compositeLocator(() => 
        this.rowValue(3).locator(), 'Fee Deposit Value');

    private readonly amountWithdrawnDepositLabel = compositeLocator(() => 
        this.rowLabel(4).locator(), 'Amount Withdrawn Deposit Label');
    private readonly amountWithdrawnDepositValue = compositeLocator(() => 
        this.rowValue(4).locator(), 'Amount Withdrawn Deposit Value');

    private readonly paymentReferenceDepositLabel = compositeLocator(() => 
        this.rowLabel(5).locator(), 'Payment Reference Deposit Label');
    private readonly paymentReferenceDepositValue = compositeLocator(() => 
        this.rowValue(5).locator(), 'Payment Reference Deposit Value');

    private readonly transactionIdDepositLabel = compositeLocator(() => 
        this.rowLabel(6).locator(), 'Transaction ID Deposit Label');
    private readonly transactionIdDepositValue = compositeLocator(() => 
        this.rowValue(6).locator(), 'Transaction ID Deposit Value');

    // Specific Rows for Withdraw Summary
    private readonly accountWithdrawLabel = compositeLocator(() => 
        this.rowLabel(1).locator(), 'Account Withdraw Label');
    private readonly accountWithdrawValue = compositeLocator(() => 
        this.rowValue(1).locator(), 'Account Withdraw Value');

    private readonly amountWithdrawnLabel = compositeLocator(() => 
        this.rowLabel(2).locator(), 'Amount Withdrawn Label');
    private readonly amountWithdrawnValue = compositeLocator(() => 
        this.rowValue(2).locator(), 'Amount Withdrawn Value');

    private readonly feeWithdrawLabel = compositeLocator(() => 
        this.rowLabel(3).locator(), 'Fee Withdraw Label');
    private readonly feeWithdrawValue = compositeLocator(() => 
        this.rowValue(3).locator(), 'Fee Withdraw Value');

    private readonly amountDepositedWithdrawLabel = compositeLocator(() => 
        this.rowLabel(4).locator(), 'Amount Deposited Withdraw Label');
    private readonly amountDepositedWithdrawValue = compositeLocator(() => 
        this.rowValue(4).locator(), 'Amount Deposited Withdraw Value');

    private readonly transactionIdWithdrawLabel = compositeLocator(() => 
        this.rowLabel(5).locator(), 'Transaction ID Withdraw Label');
    private readonly transactionIdWithdrawValue = compositeLocator(() => 
        this.rowValue(5).locator(), 'Transaction ID Withdraw Value');
    
    private readonly depositElementsMap = {
        account: { label: this.accountDepositLabel, value: this.accountDepositValue },
        amountDeposited: { label: this.amountDepositedToPlayerAccountLabel, value: this.amountDepositedToPlayerAccountValue },
        fee: { label: this.feeDepositLabel, value: this.feeDepositValue },
        amountWithdrawn: { label: this.amountWithdrawnDepositLabel, value: this.amountWithdrawnDepositValue },
        paymentReference: { label: this.paymentReferenceDepositLabel, value: this.paymentReferenceDepositValue },
        transactionId: { label: this.transactionIdDepositLabel, value: this.transactionIdDepositValue }
    } as const;

    private readonly withdrawElementsMap = {
        account: { label: this.accountWithdrawLabel, value: this.accountWithdrawValue },
        amountWithdrawn: { label: this.amountWithdrawnLabel, value: this.amountWithdrawnValue },
        fee: { label: this.feeWithdrawLabel, value: this.feeWithdrawValue },
        amountDeposited: { label: this.amountDepositedWithdrawLabel, value: this.amountDepositedWithdrawValue },
        transactionId: { label: this.transactionIdWithdrawLabel, value: this.transactionIdWithdrawValue }
    } as const;

    public clickPredefinedAmount = async (nthAmount: number) =>
        await clickElement(this.singlePredefinedAmount(nthAmount));

    public validatePredefinedAmountsContainerVisible = async (softAssert = false) =>
        await assertVisible(this.predefinedAmountsContainer, softAssert);

    public fillAmount = async (amount: string) =>
        await fillInputField(this.amountInput, amount);

    public fillCardNumber = async (cardNumber: string) =>
        await fillInputField(this.cardNumber, cardNumber);

    public fillCardName = async () =>
        await fillInputField(this.cardName, 'Test User');

    public fillExpirationDate = async (expirationDate: string) =>
        await fillInputField(this.expirationDate, expirationDate);

    public fillCVV = async (cvv: string) =>
        await fillInputField(this.cvv, cvv);

    public clickSetAmountButton = async () =>
        await clickElement(this.setAmountButton);

    public validatePredefinedAmountVisible = async (nthCard: number, softAssert = false) =>
        await assertVisible(this.singlePredefinedAmount(nthCard), softAssert);

    public validateAmountInputVisible = async (softAssert = false) =>
        await assertVisible(this.amountInput, softAssert);    public validateSetAmountButtonVisible = async (softAssert = false) =>
        await assertVisible(this.setAmountButton, softAssert);

    @step('I validate details section elements are visible')
    public async validateDetailsSectionElements(softAssert = false): Promise<void> {
        await this.validatePredefinedAmountsContainerVisible(softAssert);
        await this.validateAmountInputVisible(softAssert);
        await this.validateSetAmountButtonVisible(softAssert);
        await this.validateCardDetailsFieldsVisible(softAssert);
    }

    @step('I fill the card details')
    public async fillCardDetails(moneyAmount: string, cardNumber: string, expirationDate: string, cvv: string): Promise<void> {
        await this.fillAmount(moneyAmount);
        await this.fillCardNumber(cardNumber);
        await this.fillCardName();
        await this.fillExpirationDate(expirationDate);
        await this.fillCVV(cvv);
    }

    @step('I validate that card details fields are visible')
    public async validateCardDetailsFieldsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.cardNumber, softAssert);
        await assertVisible(this.expirationDate, softAssert);
        await assertVisible(this.cvv, softAssert);
    }

    @step('I delete the account if the select card dropdown is visible')
    public async deleteAccountIfDropdownVisible(): Promise<void> {
        await this.page.addLocatorHandler(this.deleteAccountButton.locator(), async () => {
            await clickElement(this.deleteAccountButton);
            await clickElement(this.vueDeleteButton);
        });
    }       
    
    @step('I validate all deposit iframe locators are visible')
    public async validateDepositSuccessElements(softAssert = false): Promise<void> {
        await validateAllElementsVisibility(this.depositElementsMap, softAssert);
    }   
    
    @step('I validate all withdrawal iframe locators are visible')
    public async validateWithdrawSuccessElements(softAssert = false): Promise<void> {
        await validateAllElementsVisibility(this.withdrawElementsMap, softAssert);
    }

    @step(`I perform a deposit and validate paymentIQ elements`)
    public async performDepositAndValidate(moneyAmount: string, cardNumber: string, expirationDate: string, cvv: string): Promise<void> {
        await this.deleteAccountIfDropdownVisible();
        await this.fillCardDetails(moneyAmount, cardNumber, expirationDate, cvv);
        await this.clickSetAmountButton();
        await this.validateDepositSuccessElements();
    }

    @step(`I perform a withdraw and validate paymentIQ elements`)
    public async performWithdrawAndValidate(moneyAmount: string): Promise<void> {
        await this.fillAmount(moneyAmount);
        await this.clickSetAmountButton();
        await this.validateWithdrawSuccessElements();
    }
}