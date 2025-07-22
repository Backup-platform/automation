import test, { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { assertVisible, assertDisabled, assertEnabled, assertNotEditable, assertEditable, assertNotVisible } from '@test-utils/assertions';
import { fillElement, clickElement, ensureButtonCheckboxIsChecked, ensureButtonCheckboxIsUnchecked } from '@test-utils';
import { validateAttributesExact } from '@test-utils/attributes';
import { compositeLocator } from '@test-utils/core-types';
import { MenuItems } from '../menu/menuItems.po';
import { ProfileMenu } from '../menu/profileMenu.po';


export class PersonalInfo {
    readonly page: Page;
    private menuItems: MenuItems;
    private profileMenu: ProfileMenu;

    constructor(page: Page) {
        this.page = page;
        this.menuItems = new MenuItems(page);
        this.profileMenu = new ProfileMenu(page);
    }

    // Locators

    private readonly nameFieldSelector = '#account-information .flex.w-full.flex-col.items-start.gap-1\\.5:first-child';
    private readonly dobFieldSelector = '#account-information .flex.items-start.gap-6 .flex.w-full.flex-col:first-child';
    private readonly currencyFieldSelector = '#account-information .flex.items-start.gap-6 .flex.w-full.flex-col:last-child';
    private readonly emailFieldSelector = '#account-information .flex.w-full.flex-col.items-start.gap-1\\.5:nth-child(3)';
    private readonly phoneFieldSelector = '#account-information .flex.w-full.flex-col.items-start.gap-1\\.5:last-child'
    private readonly checkedAttributes = {"aria-checked": "true", "data-state": "checked"}
    private readonly uncheckedAttributes = {"aria-checked": "false", "data-state": "unchecked"}

    private readonly personalInfoHeader = compositeLocator(() => this.page.locator('#personal-info-header'), 'Personal Info Header');

    // Account Information Section
    private readonly accountInfoHeader = compositeLocator(() => this.page.locator('#account-information h5'), 'Account Info Header');
    
    private readonly nameLabel = compositeLocator(() => this.page.locator(`${this.nameFieldSelector} label`), 'Name Label');
    private readonly nameInput = compositeLocator(() => this.page.locator(`${this.nameFieldSelector} input`), 'Name Input Field');
    
    private readonly dobLabel = compositeLocator(() => this.page.locator(`${this.dobFieldSelector} label`), 'Date of Birth Label');
    private readonly dobInput = compositeLocator(() => this.page.locator(`${this.dobFieldSelector} input`), 'Date of Birth Input Field');
    
    private readonly currencyLabel = compositeLocator(() => this.page.locator(`${this.currencyFieldSelector} label`), 'Currency Label');
    private readonly currencyInput = compositeLocator(() => this.page.locator(`${this.currencyFieldSelector} input`), 'Currency Input Field');
    
    private readonly emailLabel = compositeLocator(() => this.page.locator(`${this.emailFieldSelector} label`), 'Email Label');
    private readonly emailInput = compositeLocator(() => this.page.locator(`${this.emailFieldSelector} input`), 'Email Input Field');
    
    private readonly phoneLabel = compositeLocator(() => this.page.locator(`${this.phoneFieldSelector} label`), 'Phone Label');
    private readonly phoneInput = compositeLocator(() => this.page.locator(`${this.phoneFieldSelector} input`), 'Phone Input Field');

    // Password Section
    private readonly changePasswordHeader = compositeLocator(() => this.page.locator('#change-password h3'), 'Change Password Header');
    
    private readonly oldPasswordLabel = compositeLocator(() => this.page.locator('form .space-y-2:first-child label'), 'Old Password Label');
    private readonly oldPasswordInput = compositeLocator(() => this.page.locator('input[name="oldPassword"]'), 'Old Password Input Field');
    private readonly oldPasswordToggle = compositeLocator(() => this.page.locator('input[name="oldPassword"]').locator('..').locator('.absolute.inset-y-0.right-0'), 'Old Password Toggle');
    
    private readonly newPasswordLabel = compositeLocator(() => this.page.locator('form .space-y-2:nth-child(2) label'), 'New Password Label');
    private readonly newPasswordInput = compositeLocator(() => this.page.locator('input[name="newPassword"]'), 'New Password Input Field');
    private readonly newPasswordToggle = compositeLocator(() => this.page.locator('input[name="newPassword"]').locator('..').locator('.absolute.inset-y-0.right-0'), 'New Password Toggle');
    
    private readonly confirmPasswordLabel = compositeLocator(() => this.page.locator('form .space-y-2:last-child label'), 'Confirm Password Label');
    private readonly confirmPasswordInput = compositeLocator(() => this.page.locator('input[name="confirmNewPassword"]'), 'Confirm Password Input Field');
    private readonly confirmPasswordToggle = compositeLocator(() => this.page.locator('input[name="confirmNewPassword"]').locator('..').locator('.absolute.inset-y-0.right-0'), 'Confirm Password Toggle');
    
    private readonly updatePasswordButton = compositeLocator(() => this.page.locator('form .flex.flex-col.gap-1\\.5.pt-5 button'), 'Update Password Button');

    // Checkboxes 
    private readonly communicationPreferencesHeader = compositeLocator(() => this.page.locator('.my-3.flex.items-center.gap-1 span'), 'Communication Preferences Header');
    private readonly communicationPreferencesDivider = compositeLocator(() => this.page.locator('.my-3.flex.items-center.gap-1 .h-\\[2px\\].flex-grow'), 'Communication Preferences Divider');
    
    private readonly emailOffersCheckbox = compositeLocator(() => this.page.locator('#offersEmail'), 'Email Offers Checkbox');
    private readonly emailOffersLabel = compositeLocator(() => this.page.locator('label[for="offersEmail"]'), 'Email Offers Label');
    private readonly emailOffersCheckIcon = compositeLocator(() => this.page.locator('#offersEmail span svg'), 'Email Offers Check Icon');
    
    private readonly smsOffersCheckbox = compositeLocator(() => this.page.locator('#offersSms'), 'SMS Offers Checkbox');
    private readonly smsOffersLabel = compositeLocator(() => this.page.locator('label[for="offersSms"]'), 'SMS Offers Label');
    private readonly smsOffersCheckIcon = compositeLocator(() => this.page.locator('#offersSms span svg'), 'SMS Offers Check Icon');

    // Toast Messages

    private readonly successToast = compositeLocator(() => 
        this.page.locator('[class*="go2072408551"][style*="background: rgb(33, 124, 59)"]'), 'Success Toast');

    private readonly failureToast = compositeLocator(() => 
        this.page.locator('[class*="go2072408551"][style*="background: rgb(220, 55, 59)"]'), 'Failure Toast');

    private readonly successToastMessage = compositeLocator(() => 
        this.successToast.locator().locator('[role="status"][aria-live="polite"]'), 'Success Toast Message');

    private readonly failureToastMessage = compositeLocator(() => 
        this.failureToast.locator().locator('[role="status"][aria-live="polite"]'), 'Failure Toast Message');

    private readonly successToastIcon = compositeLocator(() => 
        this.successToast.locator().locator('span svg'), 'Success Toast Icon');

    private readonly failureToastIcon = compositeLocator(() => 
        this.failureToast.locator().locator('span svg'), 'Failure Toast Icon');

    private readonly passwordError = compositeLocator(() => 
		this.page
			.locator('input[name="oldPassword"]')
			.locator('../..')
			.locator('p[id*="form-item-message"]'), ' OldPassword error');

    private readonly newPasswordError = compositeLocator(() => 
	    this.page
		.locator('input[name="newPassword"]')
		.locator('../..')
		.locator('p[id*="form-item-message"]'), ' NewPassword error');

    private readonly confirmPasswordError = compositeLocator(() => 
		this.page
			.locator('input[name="confirmNewPassword"]')
			.locator('../..')
			.locator('p[id*="form-item-message"]'), ' Confirm New Password error');

    // Actions
    public clickUpdatePasswordButton = async () => {
        await this.updatePasswordButton.locator().click();
        await this.page.waitForTimeout(2000); //prevent account from being locked in case of negative test scenarios
    }

    public toggleEmailOffersOn = async () => await this.emailOffersCheckbox.locator().check();

    public toggleSmsOffersOn = async () => await this.smsOffersCheckbox.locator().check();

    public toggleEmailOffersOff = async () => await this.emailOffersCheckbox.locator().uncheck();

    public toggleSmsOffersOff = async () => await this.smsOffersCheckbox.locator().uncheck();

    public toggleOldPasswordVisibility = async () => await clickElement(this.oldPasswordToggle);

    public toggleNewPasswordVisibility = async () => await clickElement(this.newPasswordToggle);

    public toggleConfirmPasswordVisibility = async () => await clickElement(this.confirmPasswordToggle);

    public isUpdatePasswordButtonDisabled = async () => await assertDisabled(this.updatePasswordButton);

    public isUpdatePasswordButtonEnabled = async () => await assertEnabled(this.updatePasswordButton);

    public isPasswordErrorVisible = (softAssert = false) => assertVisible(this.passwordError, softAssert);

    public isNewPasswordErrorVisible = (softAssert = false) => assertVisible(this.newPasswordError, softAssert);

    public isConfirmPasswordErrorVisible = (softAssert = false) => assertVisible(this.confirmPasswordError, softAssert);

    public async fillOldPassword(password: string): Promise<void> {
        await fillElement(this.oldPasswordInput, password);
    }

    public async fillNewPassword(password: string): Promise<void> {
        await fillElement(this.newPasswordInput, password);
    }

    public async fillConfirmPassword(password: string): Promise<void> {
        await fillElement(this.confirmPasswordInput, password);
    }

    @step('Validate old password field is hidden (type="password")')
    public async validateOldPasswordIsHidden(): Promise<void> {
        await validateAttributesExact(this.oldPasswordInput, { type: 'password' });
    }

    @step('Validate old password field is visible (type="text")')
    public async validateOldPasswordIsVisible(): Promise<void> {
        await validateAttributesExact(this.oldPasswordInput, { type: 'text' });
    }

    @step('Validate new password field is hidden (type="password")')
    public async validateNewPasswordIsHidden(): Promise<void> {
        await validateAttributesExact(this.newPasswordInput, { type: 'password' });
    }

    @step('Validate new password field is visible (type="text")')
    public async validateNewPasswordIsVisible(): Promise<void> {
        await validateAttributesExact(this.newPasswordInput, { type: 'text' });
    }

    @step('Validate confirm password field is hidden (type="password")')
    public async validateConfirmPasswordIsHidden(): Promise<void> {
        await validateAttributesExact(this.confirmPasswordInput, { type: 'password' });
    }

    @step('Validate confirm password field is visible (type="text")')
    public async validateConfirmPasswordIsVisible(): Promise<void> {
        await validateAttributesExact(this.confirmPasswordInput, { type: 'text' });
    }

    public async checkEmailOffers(): Promise<void> {
        await ensureButtonCheckboxIsChecked(this.emailOffersCheckbox, this.checkedAttributes);
    }

    public async uncheckEmailOffers(): Promise<void> {
        await ensureButtonCheckboxIsUnchecked(this.emailOffersCheckbox, this.uncheckedAttributes);
    }

    public async checkSmsOffers(): Promise<void> {
        await ensureButtonCheckboxIsChecked(this.smsOffersCheckbox, this.checkedAttributes);
    }

    public async uncheckSmsOffers(): Promise<void> {
        await ensureButtonCheckboxIsUnchecked(this.smsOffersCheckbox, this.uncheckedAttributes);
    }

    @step('Validate email offers checkbox is checked')
    public async validateEmailOffersChecked(): Promise<void> {
        await validateAttributesExact(this.emailOffersCheckbox, this.checkedAttributes);
        await assertVisible(this.emailOffersCheckIcon);
    }

    @step('Validate email offers checkbox is unchecked')
    public async validateEmailOffersUnchecked(): Promise<void> {
        await validateAttributesExact(this.emailOffersCheckbox, this.uncheckedAttributes);
        await assertNotVisible(this.emailOffersCheckIcon);
    }

    @step('Validate SMS offers checkbox is checked')
    public async validateSmsOffersChecked(): Promise<void> {
        await validateAttributesExact(this.smsOffersCheckbox, this.checkedAttributes);
        await assertVisible(this.smsOffersCheckIcon);
    }

    @step('Validate SMS offers checkbox is unchecked')
    public async validateSmsOffersUnchecked(): Promise<void> {
        await validateAttributesExact(this.smsOffersCheckbox, this.uncheckedAttributes);
        await assertNotVisible(this.smsOffersCheckIcon);
    }

    @step('Navigate to Personal Info page')
    public async navigateToPage(): Promise<void> {
        await this.menuItems.clickMyProfileButton();
        await this.profileMenu.clickPersonalInfoButton();
    }

    @step('I validate all account info fields are visible')
    public async validateAccountInfoFieldsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.accountInfoHeader, softAssert);
        await assertVisible(this.nameLabel, softAssert);
        await assertVisible(this.nameInput, softAssert);
        await assertVisible(this.dobLabel, softAssert);
        await assertVisible(this.dobInput, softAssert);
        await assertVisible(this.currencyLabel, softAssert);
        await assertVisible(this.currencyInput, softAssert);
        await assertVisible(this.emailLabel, softAssert);
        await assertVisible(this.emailInput, softAssert);
        await assertVisible(this.phoneLabel, softAssert);
        await assertVisible(this.phoneInput, softAssert);
    }

    @step('I validate all password fields are visible')
    public async validatePasswordFieldsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.changePasswordHeader, softAssert);
        await assertVisible(this.oldPasswordLabel, softAssert);
        await assertVisible(this.oldPasswordInput, softAssert);
        await assertVisible(this.oldPasswordToggle, softAssert);
        await assertVisible(this.newPasswordLabel, softAssert);
        await assertVisible(this.newPasswordInput, softAssert);
        await assertVisible(this.newPasswordToggle, softAssert);
        await assertVisible(this.confirmPasswordLabel, softAssert);
        await assertVisible(this.confirmPasswordInput, softAssert);
        await assertVisible(this.confirmPasswordToggle, softAssert);
        await assertVisible(this.updatePasswordButton, softAssert);
    }

    @step('I validate communication preferences checkboxes are visible')
    public async validateCommunicationPreferencesCheckboxesVisible(softAssert = false): Promise<void> {
        await assertVisible(this.communicationPreferencesDivider, softAssert);
        await assertVisible(this.communicationPreferencesHeader, softAssert);
        await assertVisible(this.emailOffersCheckbox, softAssert);
        await assertVisible(this.emailOffersLabel, softAssert);
        await assertVisible(this.smsOffersCheckbox, softAssert);
        await assertVisible(this.smsOffersLabel, softAssert);
    }

    @step('I validate all personal info elements are visible')
    public async validateAllPersonalInfoElementsVisible(softAssert = false): Promise<void> {
        await assertVisible(this.personalInfoHeader, softAssert);
        await this.validateAccountInfoFieldsVisible(softAssert);
        await this.validatePasswordFieldsVisible(softAssert);
        await this.validateCommunicationPreferencesCheckboxesVisible(softAssert);
    }

    @step('I validate all account info fields are not editable')
    public async validateAccountInfoFieldsNotEditable(softAssert = false): Promise<void> {
        await assertNotEditable(this.nameInput, softAssert);
        await assertNotEditable(this.dobInput, softAssert);
        await assertNotEditable(this.currencyInput, softAssert);
        await assertNotEditable(this.emailInput, softAssert);
        await assertNotEditable(this.phoneInput, softAssert);
    }

    @step('I validate all account info fields are disabled')
    public async validateAccountInfoFieldsDisabled(softAssert = false): Promise<void> {
        await assertDisabled(this.nameInput, softAssert);
        await assertDisabled(this.dobInput, softAssert);
        await assertDisabled(this.currencyInput, softAssert);
        await assertDisabled(this.emailInput, softAssert);
        await assertDisabled(this.phoneInput, softAssert);
    }

    @step('I validate all password fields are editable')
    public async validatePasswordFieldsEditable(softAssert = false): Promise<void> {
        await assertEditable(this.oldPasswordInput, softAssert);
        await assertEditable(this.newPasswordInput, softAssert);
        await assertEditable(this.confirmPasswordInput, softAssert);
    }

    @step('I validate all password fields are enabled')
    public async validatePasswordFieldsEnabled(softAssert = false): Promise<void> {
        await assertEnabled(this.oldPasswordInput, softAssert);
        await assertEnabled(this.newPasswordInput, softAssert);
        await assertEnabled(this.confirmPasswordInput, softAssert);
    }

    @step('I validate password change success toast appears')
    public async validatePasswordChangeSuccessToast(softAssert = false): Promise<void> {
        await assertVisible(this.successToast, softAssert);
        await assertVisible(this.successToastMessage, softAssert);
        await assertVisible(this.successToastIcon, softAssert);
    }

    @step('I validate password change failure toast appears')
    public async validatePasswordChangeFailureToast(softAssert = false): Promise<void> {
        await assertVisible(this.failureToast, softAssert);
        await assertVisible(this.failureToastMessage, softAssert);
        await assertVisible(this.failureToastIcon, softAssert);
    }

    @step('I validate no toast messages are visible')
    public async validateNoToastMessages(softAssert = false): Promise<void> {
        await assertNotVisible(this.successToast, softAssert);
        await assertNotVisible(this.failureToast, softAssert);
    }

    @step('I validate entering non-compliant passwords in new password field shows error messages')
    public async fillAndValidateNewPasswordError(wrongPasswords: string[], softAssert = false): Promise<void> {
        for (const password of wrongPasswords) {
            await test.step(`Fill new password with: ${password}`, async () => {
                await fillElement(this.newPasswordInput, password);
                await fillElement(this.confirmPasswordInput, password);
                await assertVisible(this.newPasswordError, softAssert);
            });
        }
    }
}