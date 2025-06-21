import { Page } from '@playwright/test';
import {
	step,
	stepParam,
	clickElement,
	assertVisible,
	fillInputField,
	assertEnabled,
	assertEditable,
	assertNotVisible,
	validateAttributes,
	compositeLocator,
	CompositeLocator,
} from '@test-utils/navigation.po';

type PreferenceType = 'CASINO' | 'SPORT' | 'ALL';

const PreferenceConfig: Record<
	PreferenceType,
	{ index: number; displayName: string }
> = {
	CASINO: { index: 0, displayName: 'Casino' },
	SPORT: { index: 1, displayName: 'Sport' },
	ALL: { index: 2, displayName: 'Both/All' },
};

export class SignUpStep1 {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	// Locators

	private readonly email = compositeLocator(() => 
		this.page.locator('input[name=email]'), 'Email field');
	
	private readonly password = compositeLocator(() => 
		this.page.locator('input[name=password]'), 'Password field');
	
	private readonly preferencesRadioGroup = compositeLocator(() => 
		this.page.locator('[role="radiogroup"]'), 'Preferences radio group');
	
	private readonly preferenceRadioButton = (preference: PreferenceType) => 
		compositeLocator(() => 
			this.page.locator(`button[role="radio"][value="${preference}"]`), 
			`${PreferenceConfig[preference].displayName} preference`);

	private readonly selectedPreferenceRadioButtons = compositeLocator(() => 
		this.page.locator('[aria-checked="true"][data-state="checked"]'), 'Selected preferences');

	private readonly unselectedPreferenceRadioButtons = compositeLocator(() => 
		this.page.locator('[aria-checked="false"][data-state="unchecked"]'), 'Unselected preferences');

	private readonly preferenceLabel = (index: number) => 
		compositeLocator(() => 
			this.page.locator('label[for*="form-item"]').nth(index), 
			`Preference label ${index}`);

	private readonly whyWeAskContainer = compositeLocator(() => 
		this.page.locator('.flex.flex-col.gap-1.rounded-xl.border-2'), 'Why we ask container');
	
	private readonly whyWeAskTitle = compositeLocator(() => 
		this.page.locator('.flex.flex-col.gap-1.rounded-xl.border-2 h5'), 'Why we ask title');
	
	private readonly whyWeAskText = compositeLocator(() => 
		this.page.locator('.flex.flex-col.gap-1.rounded-xl.border-2 p'), 'Why we ask text');

	// Error locators
	private readonly emailError = compositeLocator(() => 
		this.page
			.locator('input[name="email"]')
			.locator('../..')
			.locator('p[id*="form-item-message"]'), 'Email error');
	
	private readonly passwordError = compositeLocator(() => 
		this.page
			.locator('input[name="password"]')
			.locator('../..')
			.locator('p[id*="form-item-message"]'), 'Password error');
	
	private readonly passwordErrorRequirements = compositeLocator(() => 
		this.passwordError.locator().locator('span'), 'Password error requirements');
	
	private readonly passwordErrorByIndex = (index: number) => 
		compositeLocator(() => 
			this.passwordErrorRequirements.locator().nth(index), 
			`Password error requirement ${index}`);
	
	private readonly preferencesError = compositeLocator(() => 
		this.page
			.locator('[role="radiogroup"]')
			.locator('..')
			.locator('p[id*="form-item-message"]'), 'Preferences error');

	// Actions
	public validateWhyAskTitleVisible = async (softAssert = false) => await assertVisible(this.whyWeAskTitle, softAssert);

	public validateWhyAskTextVisible = async (softAssert = false) => await assertVisible(this.whyWeAskText, softAssert);

	public validateEmailVisible = async (softAssert = false) => await assertVisible(this.email, softAssert);

	public validatePasswordVisible = async (softAssert = false) => await assertVisible(this.password, softAssert);

	public validatePreferencesVisible = async (softAssert = false) => await assertVisible(this.preferencesRadioGroup, softAssert);

	public validateWhyWeAskVisible = async (softAssert = false) => await assertVisible(this.whyWeAskContainer, softAssert);

	public validatePasswordEnabled = async (softAssert = false) => await assertEnabled(this.password, softAssert);

	public validateEmailEnabled = async (softAssert = false) => await assertEnabled(this.email, softAssert);

	public validateEmailEditable = async (softAssert = false) => await assertEditable(this.email, softAssert);

	public validatePasswordEditable = async (softAssert = false) => await assertEditable(this.password, softAssert);

	public fillEmail = async (userEmail: string) => await fillInputField(this.email, userEmail);

	public fillPassword = async (password: string) => await fillInputField(this.password, password);

	public validatePreferencesErrorNOTVisible = async (softAssert = false) => await assertNotVisible(this.preferencesError, softAssert);

	// Add the missing validateError method
	private validateError = async (errorElement: CompositeLocator, softAssert = false) => {
		await assertVisible(errorElement, softAssert);
	}

	@stepParam(
		(errorIndex: number) =>
			`I validate password error requirement ${errorIndex} is visible`
	)
	public async validatePasswordErrorRequirement(
		errorIndex: number,
		softAssert = false
	) {
		await assertVisible(this.passwordErrorByIndex(errorIndex), softAssert);
	}

	private getPreferenceConfig(preference: PreferenceType) {
		return PreferenceConfig[preference];
	}

	private async validatePreference(preference: PreferenceType, isSelected: boolean, softAssert = false) {
		const { displayName } = this.getPreferenceConfig(preference);
		const attributes = {
			'aria-checked': isSelected ? 'true' : 'false',
			'data-state': isSelected ? 'checked' : 'unchecked',
		};

		// Validate attributes
		await validateAttributes(
			this.preferenceRadioButton(preference).locator(),
			`${displayName} preference`,
			attributes,
			softAssert
		);

		// Validate checkmark visibility
		const checkmarkLocator = this.preferenceRadioButton(preference).locator().locator('span svg');
		await (isSelected ? assertVisible : assertNotVisible)(
			checkmarkLocator,
			`${displayName} checkmark indicator`,
			softAssert
		);
	}

	@stepParam((preference: PreferenceType) => `I select preference ${preference}`)
	public async selectPreference(preference: PreferenceType) {
		await clickElement(this.preferenceRadioButton(preference));
	}

	@stepParam((preference: PreferenceType) => `I validate all preferences with ${preference} selected`)
	private async validateAllPreferences(selectedPreference: PreferenceType, softAssert = false) {
		const allPreferences = Object.keys(PreferenceConfig) as PreferenceType[];
		for (const preference of allPreferences) {
			await this.validatePreference(preference, preference === selectedPreference, softAssert);
		}
	}

	@stepParam((preference: PreferenceType) => `I select ${preference} and validate all radio buttons`)
	public async selectAndValidatePreference(preference: PreferenceType, softAssert = false) {
		await this.selectPreference(preference);
		await this.validateAllPreferences(preference, softAssert);
	}

	@stepParam((userEmail: string, password: string) =>
		`I fill in the email field with email: ${userEmail} + timestamp and password: ${password}`
	)
	public async fillFirstStep(userEmail?: string, password?: string, preference: PreferenceType = 'ALL') {
		const time = Date.now();
		await this.fillEmail(`${time}_${userEmail}`);
		await this.fillPassword(`${password}`);
		await this.selectAndValidatePreference(preference);
	}

	@step('I validate the first step elements are visible, enabled and editable')
	public async validatePageElements(softAssert = false) {
		await this.validatePageElementsVisible(softAssert);
		await this.validatePageElementsEnabled(softAssert);
		await this.validatePageElementsEditable(softAssert);
	}

	@step('I validate the first step elements are visible')
	public async validatePageElementsVisible(softAssert = false) {
		await this.validateEmailVisible(softAssert);
		await this.validatePasswordVisible(softAssert);
		await this.validateWhyAskTextVisible(softAssert);
		await this.validateWhyAskTitleVisible(softAssert);
		await this.validatePreferencesVisible(softAssert);
	}

	@step('I validate first step elements are enabled')
	public async validatePageElementsEnabled(softAssert = false) {
		await this.validateEmailEnabled(softAssert);
		await this.validatePasswordEnabled(softAssert);
	}

	@step('I validate first step elements are editable')
	public async validatePageElementsEditable(softAssert = false) {
		await this.validateEmailEditable(softAssert);
		await this.validatePasswordEditable(softAssert);
		//TODO: await this.validatePreferencesEditable(softAssert); needs to handle all 3 radio imputs
	}

	// Type-safe error validation method for step 1
	public async validateFieldError(fieldName: 'email' | 'password' | 'preferences', softAssert = false): Promise<void> {
        const fieldErrorMap = {
            'email': this.emailError,
            'password': this.passwordError,
            'preferences': this.preferencesError
        } as const;
        
        await this.validateError(fieldErrorMap[fieldName], softAssert);
    }
}

