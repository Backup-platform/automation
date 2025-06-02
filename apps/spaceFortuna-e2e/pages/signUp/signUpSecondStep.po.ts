import { Page } from '@playwright/test';
import test from '../utils/base.po';
import { step, clickElement, assertVisible, fillInputField, assertEditable, assertEnabled, assertNotEnabled } from '@test-utils/navigation.po';

export type Gender = 'MALE' | 'FEMALE';
export type secondStepFields = { firstName?: string, lastName?: string, DOB?: string, gender?: Gender };
export type ErrorFieldsLocator = 'email' | 'password' | 'firstName' | 'lastName' | 'city' | 'address' | 'zipCode'

export class SignUpSecondStep {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //Locators - should work for both mobile and desktop
    private readonly firstName = () => this.page.locator("#firstName");
    private readonly lastName = () => this.page.locator("#lastName");
    private readonly dateOfBirthTextArea = () => this.page.locator(".react-datepicker__input-container .p-1");
    private readonly genderOptionsContainer = () => this.page.locator("#gender");
    private readonly mobileGenderDropdown = () => this.page.locator('select[class*="select_dropdownButton_"]');
    private readonly desktopGenderDropdown = () => this.page.locator('button[class*="select_dropdownButton_"]');
    private readonly genderButton = () => this.mobileGenderDropdown().or(this.desktopGenderDropdown());
    private readonly genderSelection = (selectedGender: Gender) => this.page.locator('li[value="' + selectedGender + '"]');
    private readonly almostDoneButton = () => this.page.locator("#registration-enter-universe-btn");
    private readonly fieldError = (fieldError: ErrorFieldsLocator) => this.page.locator(`label[class*="field_error"][for*=${fieldError}]`);

    //Actions

    public validateFirstNameVisible = async (softAssert = false) =>
        await assertVisible(this.firstName(), 'First name field', softAssert);

    public fillFirstName = async (firstName: string) =>
        await fillInputField(this.firstName(), firstName, 'First name field');

    public validateLastNameVisible = async (softAssert = false) =>
        await assertVisible(this.lastName(), 'Last name field', softAssert);

    public fillLastName = async (lastName: string) =>
        await fillInputField(this.lastName(), lastName, 'Last name field');

    public validateDOBVisible = async (softAssert = false) =>
        await assertVisible(this.dateOfBirthTextArea(), 'Date of birth field', softAssert);

    public validateLastNameEditable = async (softAssert = false) =>
        await assertEditable(this.lastName(), 'Last name field', softAssert);

    public validateFirstNameEditable = async (softAssert = false) =>
        await assertEditable(this.firstName(), 'First name field', softAssert);

    public validateDOBEditable = async (softAssert = false) =>
        await assertEditable(this.dateOfBirthTextArea(), 'Date of birth field', softAssert);

    public validateGenderButtonVisible = async (softAssert = false) =>
        await assertVisible(this.genderButton(), 'Gender button', softAssert);

    public validateGenderContainerVisible = async (softAssert = false) =>
        await assertVisible(this.genderOptionsContainer(), 'Gender container', softAssert);

    public validateAlmostDoneButtonVisible = async (softAssert = false) =>
        await assertVisible(this.almostDoneButton(), 'Almost done button', softAssert);

    public validateAlmostDoneButtonEnabled = async (softAssert = false) =>
        await assertEnabled(this.almostDoneButton(), 'Almost Done button', softAssert);

    public validateAlmostDoneNotEnabled = async (softAssert = false) =>
        await assertNotEnabled(this.almostDoneButton(), 'Almost Done button', softAssert);

    public clickAlmostDoneButton = async () =>
        await clickElement(this.almostDoneButton(), 'Almost Done button');

    public validateError = async (fieldWithError: ErrorFieldsLocator, softAssert = false) =>
        await assertVisible(this.fieldError(fieldWithError), `Field error ${fieldWithError}`, softAssert);

    @step('I fill the date of birth field')
    public async fillDOB(dateOfBirth: string) {
        await fillInputField(this.dateOfBirthTextArea(), dateOfBirth, 'Date of birth field');
        if (await this.page.locator("[class*='styles_datePickerCalendar_']").isVisible()) {
            await this.page.locator('[class*=styles_icon_].mr-1').click();
        }
    }

    @step('I select gender')
    public async selectGender(selectedGender: Gender) {
        await this.validateGenderButtonVisible();
        if (await this.mobileGenderDropdown().isVisible()) {
            await this.mobileGenderDropdown().selectOption({ value: selectedGender });
        } else {
            await this.genderButton().click();
            await this.genderSelection(selectedGender).click();
        }
    }

    private async fillFieldIfDefined<T>(fieldValue: T | undefined, fillMethod: (value: T) => Promise<void>, stepDescription: string) {
        if (fieldValue !== undefined) {
            await fillMethod.call(this, fieldValue);
        } else {
            await test.step(stepDescription, async () => {
                // intentionally left blank
            });
        }
    }

    public async fillPartialSecondStep(fields: secondStepFields): Promise<void> {
        const { firstName, lastName, DOB, gender } = fields;

        if (firstName && lastName && DOB && gender) {
            await this.fillSecondStep(firstName, lastName, DOB, gender);
        } else {
            await this.fillFieldIfDefined(firstName, this.fillFirstName, 'I do not set first name');
            await this.fillFieldIfDefined(lastName, this.fillLastName, 'I do not set last name');
            await this.fillFieldIfDefined(DOB, this.fillDOB, 'I do not set DOB');
            await this.fillFieldIfDefined(gender, this.selectGender, 'I do not set a gender');
        }
    }

    @step('I fill the second registration step')
    public async fillSecondStep(firstName: string, lastName: string, DOB: string, gender: Gender) {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillDOB(DOB);
        await this.selectGender(gender);
    }

    public async validateSecondStepElements() {
        await test.step(`I validate second registration step elements`, async () => {
            await this.validateFirstNameVisible();
            await this.validateFirstNameEditable();
            await this.validateLastNameVisible();
            await this.validateLastNameEditable();
            await this.validateDOBVisible();
            await this.validateDOBEditable();
            await this.validateGenderContainerVisible();
            await this.validateAlmostDoneButtonVisible();
            await this.validateAlmostDoneButtonEnabled();
        });
    }
}