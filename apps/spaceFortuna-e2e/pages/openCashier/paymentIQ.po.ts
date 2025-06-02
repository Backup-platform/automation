import { Locator, Page } from '@playwright/test';
import { step, clickElement, assertVisible, fillInputField } from '@test-utils/navigation.po';

export class PaymentIQ {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators

    // Frame Locator
    readonly cashierIframe = () => this.page.frameLocator('#cashierIframe');

    //innerIframe for card data
    readonly innerIframe = () => this.cashierIframe().frameLocator('#hosted-field-single-iframe');
    readonly cardName = () => this.innerIframe().locator('input[id="frmNameCC"]');
    readonly cardNumber = () => this.innerIframe().locator('input[id="frmCCNum"]');
    readonly expirationDate = () => this.innerIframe().locator('input[id="frmCCExp"]');
    readonly cvv = () => this.innerIframe().locator('input[id="frmCCCVC"]');
    readonly cashier = () => this.cashierIframe().locator('#cashier');
    readonly logoContainer = () => this.cashierIframe().locator('.logo-container');
    readonly predefinedAmountsContainer = () => this.cashierIframe().locator('.predefinedvalues');
    readonly predefinedAmount = () => this.cashierIframe().locator('.predefinedvalues-btn');
    readonly selectCardDropdown = () => this.cashierIframe().locator('div.dropdown-container.dropdown-border');
    readonly deleteAccountButton = () => this.cashierIframe().locator('span[class*="remove-account"]');
    readonly vueCancelButton = () => this.cashierIframe().locator('button[class*="vue-dialog-button"]:nth-of-type(1)');
    readonly vueDeleteButton = () => this.cashierIframe().locator('button[class*="vue-dialog-button"]:nth-of-type(2)');

    readonly singlePredefinedAmount = (nthCard: number) =>
        this.predefinedAmountsContainer().nth(nthCard).locator('button.predefinedvalue');
    readonly amountInput = () =>
        this.cashierIframe().locator('input[name="setAmount"]');
    readonly setAmmountButton = () =>
        this.cashierIframe().locator('.btn.cashier-button.submit-button');

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
    public clickPredefinedAmount = async (nthAmount: number) =>
        await clickElement(this.singlePredefinedAmount(nthAmount), `Predefined amount button ${nthAmount}`);

    public validatePredefinedAmountsContainerVisible = async (softAssert = false) =>
        await assertVisible(this.predefinedAmountsContainer(), `Predefined amounts container`, softAssert);

    public fillAmount = async (amount: string) =>
        await fillInputField(this.amountInput(), amount, `Amount input field`);

    public fillCardNumber = async (cardNumber: string) =>
        await fillInputField(this.cardNumber(), cardNumber, `Card number input`);

    public fillCardName = async () =>
        await fillInputField(this.cardName(), 'Test User', 'Card name input');

    public fillExpirationDate = async (expirationDate: string) =>
        await fillInputField(this.expirationDate(), expirationDate, 'Expiration date input');

    public fillCVV = async (cvv: string) =>
        await fillInputField(this.cvv(), cvv, 'CVV input');

    public clickSetAmountButton = async () =>
        await clickElement(this.setAmmountButton(), 'Set amount button');

    public validatePredefinedAmountVisible = async (nthCard: number, softAssert = false) =>
        await assertVisible(this.singlePredefinedAmount(nthCard), `Predefined amount button ${nthCard}`, softAssert);

    public validateAmountInputVisible = async (softAssert = false) =>
        await assertVisible(this.amountInput(), `Amount input field`, softAssert);

    public validateSetAmountButtonVisible = async (softAssert = false) =>
        await assertVisible(this.setAmmountButton(), `Set amount button`, softAssert);

    private async validateVisibility(label: Locator, value: Locator, name: string, softAssert = false) {
        await assertVisible(label, `${name} label`, softAssert);
        await assertVisible(value, `${name} value`, softAssert);
    }

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
        await assertVisible(this.cardNumber(), `Card number input`, softAssert);
        await assertVisible(this.expirationDate(), `Expiration date input`, softAssert);
        await assertVisible(this.cvv(), `CVV input`, softAssert);
    }

    @step('I delete the account if the select card dropdown is visible')
    public async deleteAccountIfDropdownVisible(): Promise<void> {
        await this.page.addLocatorHandler(this.deleteAccountButton(), async () => {
            await clickElement(this.deleteAccountButton(), 'Delete account button');
            await clickElement(this.vueDeleteButton(), 'Vue delete button');
        });
    }

    @step('I validate all deposit iframe locators are visible')
    public async validateDepositSuccessElements(softAssert = false): Promise<void> {
        await this.validateVisibility(this.accountDepositLabel(), this.accountDepositValue(), 'Account deposit', softAssert);
        await this.validateVisibility(this.amountDepositedToPlayerAccountLabel(), this.amountDepositedToPlayerAccountValue(), 'Amount deposited to player account', softAssert);
        await this.validateVisibility(this.feeDepositLabel(), this.feeDepositValue(), 'Fee deposit', softAssert);
        await this.validateVisibility(this.amountWithdrawnDepositLabel(), this.amountWithdrawnDepositValue(), 'Amount withdrawn deposit', softAssert);
        await this.validateVisibility(this.paymentReferenceDepositLabel(), this.paymentReferenceDepositValue(), 'Payment reference deposit', softAssert);
        await this.validateVisibility(this.transactionIdDepositLabel(), this.transactionIdDepositValue(), 'Transaction ID deposit', softAssert);
    }

    @step('I validate all withdrawal iframe locators are visible')
    public async validateWithdrawSuccessElements(softAssert = false): Promise<void> {
        await this.validateVisibility(this.accountWithdrawLabel(), this.accountWithdrawValue(), 'Account withdraw', softAssert);
        await this.validateVisibility(this.amountWithdrawnLabel(), this.amountWithdrawnValue(), 'Amount withdrawn', softAssert);
        await this.validateVisibility(this.feeWithdrawLabel(), this.feeWithdrawValue(), 'Fee withdraw', softAssert);
        await this.validateVisibility(this.amountDepositedWithdrawLabel(), this.amountDepositedWithdrawValue(), 'Amount deposited withdraw', softAssert);
        await this.validateVisibility(this.transactionIdWithdrawLabel(), this.transactionIdWithdrawValue(), 'Transaction ID withdraw', softAssert);
    }

    @step(`I perform a deposit and validate paymentIQ elements`)
    public async performDepositAndValidate(moneyAmount: string, cardNumber: string, expirationDate: string, cvv: string): Promise<void> {
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