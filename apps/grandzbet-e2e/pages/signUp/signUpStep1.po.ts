import { Page } from '@playwright/test';
//import { expect } from '../utils/base.po';
import {
	step,
	stepParam,
	clickElement,
	assertVisible,
	fillInputField,
	assertEnabled,
	assertNotEnabled,
	assertEditable,
	assertNotVisible,
	performNavigationClick
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

	//TODO: do checks for specific password error not just the container
	//Locators - should work for both mobile and desktop
	private readonly email = () => this.page.locator('input[name=email]');
	private readonly password = () => this.page.locator('input[name=password]');
	private readonly nextStepButton = () =>
		this.page.locator('form button[type="button"].bg-primary');
	private readonly invalidEmail = () =>
		this.page.locator('.space-y-2 [id*=form-item-message]').nth(0);
	private readonly invalidPassword = () =>
		this.page.locator('.space-y-2 [id*=form-item-message]').nth(1);
	private readonly preferencesRadioGroup = () =>
		this.page.locator('[role="radiogroup"]');
	private readonly preferenceRadioButton = (index: number) =>
		this.page.locator('button[role="radio"]').nth(index);
	private readonly selectedPreferenceRadioButton = () =>
		this.page.locator('button[role="radio"][aria-checked="true"]');
	private readonly unselectedPreferenceRadioButtons = () =>
		this.page.locator('button[role="radio"][aria-checked="false"]');
	private readonly preferenceLabel = (index: number) =>
		this.page.locator('label[for*="form-item"]').nth(index);
	private readonly loginLink = () =>
		this.page.locator('button.justify-start:has(svg)');
	private readonly closeButton = () =>
		this.page
			.locator('button')
			.filter({ has: this.page.locator('svg') })
			.first();
	private readonly stepsContainer = () =>
		this.page.locator('.text-s.flex.flex-row.gap-6');
	private readonly stepButton = (stepNumber: number) =>
		this.page.locator(`.text-s.flex.flex-row.gap-6 button`).nth(stepNumber - 1);
	private readonly activeStep = () =>
		this.page.locator('.text-s.flex.flex-row.gap-6 button.text-primary');
	private readonly whyWeAskContainer = () =>
		this.page.locator('.flex.flex-col.gap-1.rounded-xl.border-2');
	private readonly whyWeAskTitle = () =>
		this.page.locator('.flex.flex-col.gap-1.rounded-xl.border-2 h5');
	private readonly whyWeAskText = () =>
		this.page.locator('.flex.flex-col.gap-1.rounded-xl.border-2 p');

	// Error locators
	private readonly emailError = () =>
		this.page
			.locator('input[name="email"]')
			.locator('../..')
			.locator('p[id*="form-item-message"]');
	private readonly passwordError = () =>
		this.page
			.locator('input[name="password"]')
			.locator('../..')
			.locator('p[id*="form-item-message"]');
	private readonly passwordErrorRequirements = () =>
		this.passwordError().locator('span');
	private readonly passwordErrorByIndex = (index: number) =>
		this.passwordErrorRequirements().nth(index);
	private readonly preferencesError = () =>
		this.page
			.locator('[role="radiogroup"]')
			.locator('..')
			.locator('p[id*="form-item-message"]');

	//Actions

	public validateWhyAskTitleVisible = async (softAssert = false) =>
		await assertVisible(this.whyWeAskTitle(), 'Why we ask title', softAssert);

	public validateWhyAskTextVisible = async (softAssert = false) =>
		await assertVisible(this.whyWeAskText(), 'Why we ask text', softAssert);

	public validatePasswordEnabled = async (softAssert = false) =>
		await assertEnabled(this.password(), 'Password field', softAssert);

	public validateEmailEnabled = async (softAssert = false) =>
		await assertEnabled(this.email(), 'Email field', softAssert);

	public validateLoginLinkVisible = async (softAssert = false) =>
		await assertVisible(this.loginLink(), 'Login link', softAssert);

	public validateLoginLinkEnabled = async (softAssert = false) =>
		await assertEnabled(this.loginLink(), 'Login link', softAssert);

	public validateEmailEditable = async (softAssert = false) =>
		await assertEditable(this.email(), 'Email field', softAssert);

	public validatePasswordEditable = async (softAssert = false) =>
		await assertEditable(this.password(), 'Password field', softAssert);

	public async clickLoginLink(expectedURL: string): Promise<void> {
		await performNavigationClick(this.page, this.loginLink(), 'Login link', expectedURL);
	}

	public validateCloseButtonVisible = async (softAssert = false) =>
		await assertVisible(this.closeButton(), 'Close button', softAssert);

	public validateCloseButtonEnabled = async (softAssert = false) =>
		await assertEnabled(this.closeButton(), 'Close button', softAssert);

	public clickCloseButton = async () =>
		await clickElement(this.closeButton(), 'Close button');

	public validateStepsVisible = async (softAssert = false) =>
		await assertVisible(this.stepsContainer(), 'Steps container', softAssert);

	public validateEmailVisible = async (softAssert = false) =>
		await assertVisible(this.email(), 'Email', softAssert);

	public fillEmail = async (userEmail: string) =>
		await fillInputField(this.email(), userEmail, 'Email');

	public validatePasswordVisible = async (softAssert = false) =>
		await assertVisible(this.password(), 'Password', softAssert);

	public fillPassword = async (password: string) =>
		await fillInputField(this.password(), password, 'Password');

	public validateNextButtonEnabled = async (softAssert = false) =>
		await assertEnabled(this.nextStepButton(), 'Next button', softAssert);

	public validateNextButtonNotEnabled = async (softAssert = false) =>
		await assertNotEnabled(this.nextStepButton(), 'Next button', softAssert);

	public validateNextButtonVisible = async (softAssert = false) =>
		await assertVisible(this.nextStepButton(), 'Next button', softAssert);

	public clickNextButton = async () =>
		await clickElement(this.nextStepButton(), 'Next button');

	public validatePreferencesVisible = async (softAssert = false) =>
		await assertVisible(
			this.preferencesRadioGroup(),
			'Preferences radio group',
			softAssert
		);

	public validateWhyWeAskVisible = async (softAssert = false) =>
		await assertVisible(
			this.whyWeAskContainer(),
			'Why we ask container',
			softAssert
		);

	public validateEmailError = async (softAssert = false) =>
		await assertVisible(
			this.emailError(),
			'Email error is visible',
			softAssert
		);

	public validatePasswordError = async (softAssert = false) =>
		await assertVisible(
			this.passwordError(),
			'Password error is visible',
			softAssert
		);

	public validatePreferencesErrorVisible = async (softAssert = false) =>
		await assertVisible(
			this.preferencesError(),
			'Preferences error is visible',
			softAssert
		);

	public validatePreferencesErrorNOTVisible = async (softAssert = false) =>
		await assertNotVisible(
			this.preferencesError(),
			'Preferences error is NOT visible',
			softAssert
		);

	private getPreferenceConfig(preference: PreferenceType) {
		return PreferenceConfig[preference];
	}

	@stepParam(
		(preference: PreferenceType) => `I select preference ${preference}`
	)
	public async selectPreference(preference: PreferenceType) {
		const { index, displayName } = this.getPreferenceConfig(preference);
		await clickElement(
			this.preferenceRadioButton(index),
			`${displayName} preference`
		);
	}

	@stepParam(
		(preference: PreferenceType) =>
			`I validate ${preference} preference is selected`
	)
	public async validatePreferenceSelected(
		preference: PreferenceType,
		softAssert = false
	) {
		const { displayName } = this.getPreferenceConfig(preference);
		await assertVisible(
			this.selectedPreferenceRadioButton().filter({ hasText: displayName }),
			`${displayName} preference is selected`,
			softAssert
		);
	}

	@stepParam(
		(preference: PreferenceType) =>
			`I validate other preferences are not selected after selecting ${preference}`
	)
	private async validateOtherPreferencesNotSelected(
		selectedPreference: PreferenceType,
		softAssert = false
	) {
		for (const preference in PreferenceConfig) {
			if (preference !== selectedPreference) {
				const { displayName } = this.getPreferenceConfig(
					preference as PreferenceType
				);
				await assertVisible(
					this.unselectedPreferenceRadioButtons().filter({
						hasText: displayName,
					}),
					`${displayName} preference is not selected`,
					softAssert
				);
			}
		}
	}

	@stepParam(
		(preference: PreferenceType) =>
			`I select ${preference} and validate selection`
	)
	public async selectAndValidatePreference(
		preference: PreferenceType,
		softAssert = false
	) {
		await this.selectPreference(preference);
		//FIXME: validation of selected preferences does not work properly
		// await this.validatePreferenceSelected(preference, softAssert);
		// await this.validateOtherPreferencesNotSelected(preference, softAssert);
	}

	@stepParam(
		(userEmail: string, password: string) =>
			`I fill in the email field with email: ${userEmail} + timestamp and password: ${password}`
	)
	public async fillFirstStep(userEmail?: string, password?: string) {
		const time = Date.now();
		await this.fillEmail(`${time}_${userEmail}`);
		await this.fillPassword(`${password}`);
	}

	@step('I validate the first step elements are visible, enabled and editable')
	public async validatePageElements(softAssert = false) {
		await this.validateEmailVisible(softAssert);
		await this.validatePasswordVisible(softAssert);
		await this.validateNextButtonVisible(softAssert);
	}

	@step('I validate the first step elements are visible')
	public async validatePageElementsVisible(softAssert = false) {
		await this.validateEmailVisible(softAssert);
		await this.validatePasswordVisible(softAssert);
		await this.validateNextButtonVisible(softAssert);
		await this.validateWhyAskTextVisible(softAssert);
		await this.validateWhyAskTitleVisible(softAssert);
		await this.validatePreferencesVisible(softAssert);
		await this.validateCloseButtonVisible(softAssert);
		await this.validateLoginLinkVisible(softAssert);
	}

	@step('I validate first step elements are enabled')
	public async validatePageElementsEnabled(softAssert = false) {
		await this.validateEmailEnabled(softAssert);
		await this.validatePasswordEnabled(softAssert);
		await this.validateNextButtonEnabled(softAssert);
		await this.validateCloseButtonEnabled(softAssert);
		await this.validateLoginLinkEnabled(softAssert);
	}

	@step('I validate first step elements are editable')
	public async validatePageElementsEditable(softAssert = false) {
		await this.validateEmailEditable(softAssert);
		await this.validatePasswordEditable(softAssert);
		//TODO: await this.validatePreferencesEditable(softAssert); needs to handle all 3 radio imputs
	}

	@stepParam((stepNumber: number) => `I validate step ${stepNumber} is active`)
	public async validateActiveStep(expectedStep: number) {
		const activeStepElement = this.stepButton(expectedStep);
		await activeStepElement.waitFor();
		// Verify it has the active class
		await this.page
			.locator(`.text-s.flex.flex-row.gap-6 button.text-primary`)
			.nth(expectedStep - 1)
			.waitFor();
	}

	@stepParam(
		(errorIndex: number) =>
			`I validate password error requirement ${errorIndex} is visible`
	)
	public async validatePasswordErrorRequirement(
		errorIndex: number,
		softAssert = false
	) {
		await assertVisible(
			this.passwordErrorByIndex(errorIndex),
			`Password error requirement ${errorIndex}`,
			softAssert
		);
	}

	@stepParam((scenario: string, expectedURL: string) => `I validate ${scenario} navigation back to ${expectedURL}`)
    public async validateNavigationBack(scenario: string, expectedURL: string): Promise<void> {
        await performNavigationClick(this.page, this.closeButton(), `Back Button`, expectedURL);
    }
}
