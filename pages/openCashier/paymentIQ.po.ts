import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';

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
    public async clickPredefinedAmount(nthAmount: number, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.singlePredefinedAmountButton(nthAmount), softAssert, `Predefined amount button ${nthAmount}`);
    }

    public async validatePredefinedAmountsContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.predefinedAmountsContainer(), softAssert, 'Predefined amounts container');
    }

    public async fillAmount(amount: string, softAssert = false): Promise<void> {
        await this.navigation.fillInputField(this.amountInput(), amount, softAssert, 'Amount input field');
    }

    public async clickSetAmount(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.setAmmountButton(), softAssert, 'Set amount button');
    }

    public async fillCardNumber(cardNumber: string, softAssert = false): Promise<void> {
        await this.navigation.fillInputField(this.cardNumber(), cardNumber, softAssert, 'Card number input');
    }

    public async fillCardName(softAssert = false): Promise<void> {
        await this.navigation.fillInputField(this.cardName(), 'Test User', softAssert, 'Card name input');
    }

    public async fillExpirationDate(expirationDate: string, softAssert = false): Promise<void> {
        await this.navigation.fillInputField(this.expirationDate(), expirationDate, softAssert, 'Expiration date input');
    }

    public async fillCVV(cvv: string, softAssert = false): Promise<void> {
        await this.navigation.fillInputField(this.cvv(), cvv, softAssert, 'CVV input');
    }

    public async clickPredefinedAmountButton(nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.singlePredefinedAmountButton(nthCard), softAssert, `Predefined amount button ${nthCard}`);
    }

    public async fillAmountInput(amount: string, softAssert = false): Promise<void> {
        await this.navigation.fillInputField(this.amountInput(), amount, softAssert, 'Amount input field');
    }

    public async clickSetAmountButton(softAssert = false): Promise<void> {
        await this.navigation.clickElement(this.setAmmountButton(), softAssert, 'Set amount button');
    }

    public async validatePredefinedAmountVisible(nthCard: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.singlePredefinedAmountButton(nthCard), softAssert, `Predefined amount button ${nthCard}`);
    }

    public async validateAmountInputVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.amountInput(), softAssert, 'Amount input field');
    }

    public async validateSetAmountButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.setAmmountButton(), softAssert, 'Set amount button');
    }

    @step('I validate details section elements are visible')
    public async validateDetailsSectionElements(softAssert = false): Promise<void> {
        await this.validatePredefinedAmountsContainerVisible(softAssert);
        await this.validateAmountInputVisible(softAssert);
        await this.validateSetAmountButtonVisible(softAssert);
        await this.validateCardDetailsFieldsVisible(softAssert);
    }

    @step('I fill the card details')
    public async fillCardDetails(moneyAmount: string, cardNumber: string, expirationDate: string, cvv: string, softAssert = false): Promise<void> {
        await this.fillAmountInput(moneyAmount, softAssert);
        await this.fillCardNumber(cardNumber, softAssert);
        await this.fillCardName(softAssert);
        await this.fillExpirationDate(expirationDate, softAssert);
        await this.fillCVV(cvv, softAssert);
    }

    @step('I validate that card details fields are visible')
    public async validateCardDetailsFieldsVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.cardNumber(), softAssert, 'Card number input');
        await this.navigation.assertVisible(this.expirationDate(), softAssert, 'Expiration date input');
        await this.navigation.assertVisible(this.cvv(), softAssert, 'CVV input');
    }

    @step('I delete the account if the select card dropdown is visible')
    public async deleteAccountIfDropdownVisible(softAssert = false): Promise<void> {
        await this.page.addLocatorHandler(this.deleteAccountButton(), async () => {
            await this.navigation.clickElement(this.deleteAccountButton(), softAssert, 'Delete account button');
            await this.navigation.clickElement(this.vueDeleteButton(), softAssert, 'Vue delete button');
        });
    }

    @step('I validate all deposit iframe locators are visible')
    public async validateDepositIframeLocatorsVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountDepositLabel(), softAssert, 'Account deposit label');
        await this.navigation.assertVisible(this.accountDepositValue(), softAssert, 'Account deposit value');

        await this.navigation.assertVisible(this.amountDepositedToPlayerAccountLabel(), softAssert, 'Amount deposited to player account label');
        await this.navigation.assertVisible(this.amountDepositedToPlayerAccountValue(), softAssert, 'Amount deposited to player account value');

        await this.navigation.assertVisible(this.feeDepositLabel(), softAssert, 'Fee deposit label');
        await this.navigation.assertVisible(this.feeDepositValue(), softAssert, 'Fee deposit value');

        await this.navigation.assertVisible(this.amountWithdrawnDepositLabel(), softAssert, 'Amount withdrawn deposit label');
        await this.navigation.assertVisible(this.amountWithdrawnDepositValue(), softAssert, 'Amount withdrawn deposit value');

        await this.navigation.assertVisible(this.paymentReferenceDepositLabel(), softAssert, 'Payment reference deposit label');
        await this.navigation.assertVisible(this.paymentReferenceDepositValue(), softAssert, 'Payment reference deposit value');

        await this.navigation.assertVisible(this.transactionIdDepositLabel(), softAssert, 'Transaction ID deposit label');
        await this.navigation.assertVisible(this.transactionIdDepositValue(), softAssert, 'Transaction ID deposit value');
    }

    @step('I validate all withdrawal iframe locators are visible')
    public async validateWithdrawIframeLocatorsVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.accountWithdrawLabel(), softAssert, 'Account withdraw label');
        await this.navigation.assertVisible(this.accountWithdrawValue(), softAssert, 'Account withdraw value');

        await this.navigation.assertVisible(this.amountWithdrawnLabel(), softAssert, 'Amount withdrawn label');
        await this.navigation.assertVisible(this.amountWithdrawnValue(), softAssert, 'Amount withdrawn value');

        await this.navigation.assertVisible(this.feeWithdrawLabel(), softAssert, 'Fee withdraw label');
        await this.navigation.assertVisible(this.feeWithdrawValue(), softAssert, 'Fee withdraw value');

        await this.navigation.assertVisible(this.amountDepositedWithdrawLabel(), softAssert, 'Amount deposited withdraw label');
        await this.navigation.assertVisible(this.amountDepositedWithdrawValue(), softAssert, 'Amount deposited withdraw value');

        await this.navigation.assertVisible(this.transactionIdWithdrawLabel(), softAssert, 'Transaction ID withdraw label');
        await this.navigation.assertVisible(this.transactionIdWithdrawValue(), softAssert, 'Transaction ID withdraw value');
    }
}