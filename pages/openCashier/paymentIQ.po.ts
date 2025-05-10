import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam, assertAttribute, assertElementContainsText, clickElement,assertVisible, fillInputField, assertEditable, assertEnabled, assertNotEnabled } from '../utils/navigation.po';

export class PaymentIQ {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page); // Initialize navigation
    }

    // Locators

    // Frame Locator
    readonly cashierIframe = () => this.page.frameLocator('#cashierIframe');
    readonly paymentDetailsIframe = () => this.page.frameLocator('#cashierIframe');

    //innerIframe for card data
    readonly innerIframe = () => this.paymentDetailsIframe().frameLocator('#hosted-field-single-iframe');
    readonly cardName = () => this.innerIframe().locator('input[id="frmNameCC"]');
    readonly cardNumber = () => this.innerIframe().locator('input[id="frmCCNum"]');
    readonly expirationDate = () => this.innerIframe().locator('input[id="frmCCExp"]');
    readonly cvv = () => this.innerIframe().locator('input[id="frmCCCVC"]');
    readonly cashier = () => this.paymentDetailsIframe().locator('#cashier');
    readonly logoContainer = () => this.paymentDetailsIframe().locator('.logo-container');
    readonly predefinedAmountsContainer = () => this.paymentDetailsIframe().locator('.predefinedvalues');
    readonly predefinedAmount = () => this.paymentDetailsIframe().locator('.predefinedvalues-btn');
    readonly selectCardDropdown = () => this.paymentDetailsIframe().locator('div.dropdown-container.dropdown-border');
    readonly deleteAccountButton = () => this.paymentDetailsIframe().locator('span[class*="remove-account"]');
    readonly vueCancelButton = () => this.paymentDetailsIframe().locator('button[class*="vue-dialog-button"]:nth-of-type(1)');
    readonly vueDeleteButton = () => this.paymentDetailsIframe().locator('button[class*="vue-dialog-button"]:nth-of-type(2)');

    readonly singlePredefinedAmount = (nthCard: number) => this.predefinedAmountsContainer().nth(nthCard);
    readonly singlePredefinedAmountButton = (nthCard: number) =>
        this.singlePredefinedAmount(nthCard).locator('button.predefinedvalue');
    readonly amountInput = () =>
        this.paymentDetailsIframe().locator('input[name="setAmount"]');
    readonly setAmmountButton = () =>
        this.paymentDetailsIframe().locator('.btn.cashier-button.submit-button');

    // Base Locator for Rows in the IFrame
    readonly summaryRow = (rowIndex: number) => this.cashierIframe().locator(`.success-message.flex.space-between:nth-of-type(${rowIndex})`);
    readonly rowLabel = (rowIndex: number) => this.summaryRow(rowIndex).locator('[class*="label"]');
    readonly rowValue = (rowIndex: number) => this.summaryRow(rowIndex).locator('[class*="value"]');

    // Specific Rows for Deposit Summary
    readonly accountDepositLabel = () => this.rowLabel(1);
    readonly accountDepositValue = () => this.rowValue(1);

    readonly amountDepositedToPlayerAccountLabel = () => this.rowLabel(2);
    readonly amountDepositedToPlayerAccountValue = () => this.rowValue(2);

    readonly feeDepositLabel = () => this.rowLabel(3);
    readonly feeDepositValue = () => this.rowValue(3);

    readonly amountWithdrawnDepositLabel = () => this.rowLabel(4);
    readonly amountWithdrawnDepositValue = () => this.rowValue(4);

    readonly paymentReferenceDepositLabel = () => this.rowLabel(5);
    readonly paymentReferenceDepositValue = () => this.rowValue(5);

    readonly transactionIdDepositLabel = () => this.rowLabel(6);
    readonly transactionIdDepositValue = () => this.rowValue(6);

    // Specific Rows for Withdraw Summary
    readonly accountWithdrawLabel = () => this.rowLabel(1);
    readonly accountWithdrawValue = () => this.rowValue(1);

    readonly amountWithdrawnLabel = () => this.rowLabel(2);
    readonly amountWithdrawnValue = () => this.rowValue(2);

    readonly feeWithdrawLabel = () => this.rowLabel(3);
    readonly feeWithdrawValue = () => this.rowValue(3);

    readonly amountDepositedWithdrawLabel = () => this.rowLabel(4);
    readonly amountDepositedWithdrawValue = () => this.rowValue(4);

    readonly transactionIdWithdrawLabel = () => this.rowLabel(5);
    readonly transactionIdWithdrawValue = () => this.rowValue(5);


    // Actions for Modal Visibility
    //TODO: this needs steps from the specs

    public clickPredefinedAmount = async (nthAmount: number) => 
        await clickElement(this.singlePredefinedAmountButton(nthAmount), `Predefined amount button ${nthAmount}`);

    public validatePredefinedAmountsContainerVisible = async (softAssert = false) => 
        await assertVisible(this.predefinedAmountsContainer(), softAssert, 'Predefined amounts container');

    public fillAmount = async (amount: string) => 
        await fillInputField(this.amountInput(), amount, 'Amount input field');

    public clickSetAmount = async () => 
        await clickElement(this.setAmmountButton(), 'Set amount button');

    public fillCardNumber = async (cardNumber: string) => 
        await fillInputField(this.cardNumber(), cardNumber, 'Card number input');

    public fillCardName = async () => 
        await fillInputField(this.cardName(), 'Test User', 'Card name input');

    public fillExpirationDate = async (expirationDate: string) => 
        await fillInputField(this.expirationDate(), expirationDate, 'Expiration date input');

    public fillCVV = async (cvv: string) => 
        await fillInputField(this.cvv(), cvv, 'CVV input');

    public clickPredefinedAmountButton = async (nthCard: number) => 
        await clickElement(this.singlePredefinedAmountButton(nthCard), `Predefined amount button ${nthCard}`);

    public fillAmountInput = async (amount: string) => 
        await fillInputField(this.amountInput(), amount, 'Amount input field');

    public clickSetAmountButton = async () => 
        await clickElement(this.setAmmountButton(), 'Set amount button');

    public validatePredefinedAmountVisible = async (nthCard: number, softAssert = false) => 
        await assertVisible(this.singlePredefinedAmountButton(nthCard), softAssert, `Predefined amount button ${nthCard}`);

    public validateAmountInputVisible = async (softAssert = false) => 
        await assertVisible(this.amountInput(), softAssert, 'Amount input field');

    public validateSetAmountButtonVisible = async (softAssert = false) => 
        await assertVisible(this.setAmmountButton(), softAssert, 'Set amount button');

    @step('I validate details section elements are visible')
    public async validateDetailsSectionElements(softAssert = false): Promise<void> {
        await this.validatePredefinedAmountsContainerVisible(softAssert);
        await this.validateAmountInputVisible(softAssert);
        await this.validateSetAmountButtonVisible(softAssert);
        await this.validateCardDetailsFieldsVisible(softAssert);
    }

    @step('I fill the card details')
    public async fillCardDetails(moneyAmount: string, cardNumber: string, expirationDate: string, cvv: string, softAssert = false): Promise<void> {
        await this.fillAmountInput(moneyAmount);
        await this.fillCardNumber(cardNumber);
        await this.fillCardName();
        await this.fillExpirationDate(expirationDate);
        await this.fillCVV(cvv);
    }

    @step('I validate that card details fields are visible')
    public async validateCardDetailsFieldsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.cardNumber(), softAssert, 'Card number input');
        await assertVisible(this.expirationDate(), softAssert, 'Expiration date input');
        await assertVisible(this.cvv(), softAssert, 'CVV input');
    }

    @step('I delete the account if the select card dropdown is visible')
    public async deleteAccountIfDropdownVisible(softAssert = false): Promise<void> {
        await this.page.addLocatorHandler(this.deleteAccountButton(), async () => {
            await clickElement(this.deleteAccountButton(), 'Delete account button');
            await clickElement(this.vueDeleteButton(), 'Vue delete button');
        });
    }

    @step('I validate all deposit iframe locators are visible')
    public async validateDepositIframeLocatorsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.accountDepositLabel(), softAssert, 'Account deposit label');
        await assertVisible(this.accountDepositValue(), softAssert, 'Account deposit value');

        await assertVisible(this.amountDepositedToPlayerAccountLabel(), softAssert, 'Amount deposited to player account label');
        await assertVisible(this.amountDepositedToPlayerAccountValue(), softAssert, 'Amount deposited to player account value');

        await assertVisible(this.feeDepositLabel(), softAssert, 'Fee deposit label');
        await assertVisible(this.feeDepositValue(), softAssert, 'Fee deposit value');

        await assertVisible(this.amountWithdrawnDepositLabel(), softAssert, 'Amount withdrawn deposit label');
        await assertVisible(this.amountWithdrawnDepositValue(), softAssert, 'Amount withdrawn deposit value');

        await assertVisible(this.paymentReferenceDepositLabel(), softAssert, 'Payment reference deposit label');
        await assertVisible(this.paymentReferenceDepositValue(), softAssert, 'Payment reference deposit value');

        await assertVisible(this.transactionIdDepositLabel(), softAssert, 'Transaction ID deposit label');
        await assertVisible(this.transactionIdDepositValue(), softAssert, 'Transaction ID deposit value');
    }

    @step('I validate all withdrawal iframe locators are visible')
    public async validateWithdrawIframeLocatorsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.accountWithdrawLabel(), softAssert, 'Account withdraw label');
        await assertVisible(this.accountWithdrawValue(), softAssert, 'Account withdraw value');

        await assertVisible(this.amountWithdrawnLabel(), softAssert, 'Amount withdrawn label');
        await assertVisible(this.amountWithdrawnValue(), softAssert, 'Amount withdrawn value');

        await assertVisible(this.feeWithdrawLabel(), softAssert, 'Fee withdraw label');
        await assertVisible(this.feeWithdrawValue(), softAssert, 'Fee withdraw value');

        await assertVisible(this.amountDepositedWithdrawLabel(), softAssert, 'Amount deposited withdraw label');
        await assertVisible(this.amountDepositedWithdrawValue(), softAssert, 'Amount deposited withdraw value');

        await assertVisible(this.transactionIdWithdrawLabel(), softAssert, 'Transaction ID withdraw label');
        await assertVisible(this.transactionIdWithdrawValue(), softAssert, 'Transaction ID withdraw value');
    }
}