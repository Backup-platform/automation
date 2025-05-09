import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';

export type Gender = 'MALE' | 'FEMALE';
export type secondStepFields = { firstName?: string, lastName?: string, DOB?: string, gender?: Gender };
export type ErrorFieldsLocator = 'email' | 'password' | 'firstName' | 'lastName' | 'city' | 'address' | 'zipCode'

export class SignUpSecondStep {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
    }

    //Locators - should work for both mobile and desktop
    private readonly firstName = () => this.page.locator("#firstName");
    private readonly lastName = () => this.page.locator("#lastName");
    private readonly dateOfBirthTextArea = () => this.page.locator(".react-datepicker__input-container .p-1");

    //TODO: check if this is still needed //private readonly genderDropdown = () => this.page.locator("#gender").getByText('Gender');
    private readonly genderOptionsContainer = () => this.page.locator("#gender");
    private readonly mobileGenderDropdown = () => this.page.locator('select[class*="select_dropdownButton_"]');
    private readonly desktopGenderDropdown = () => this.page.locator('button[class*="select_dropdownButton_"]');
    private readonly genderButton = () => this.mobileGenderDropdown().or(this.desktopGenderDropdown());
    private readonly genderSelection = (selectedGender: Gender) => this.page.locator('li[value="' + selectedGender + '"]');
    private readonly almostDoneButton = () => this.page.locator("#registration-enter-universe-btn");
    private readonly fieldError = (fieldError: ErrorFieldsLocator) => this.page.locator(`label[class*="field_error"][for*=${fieldError}]`);

    //Actions

    public validateFirstNameVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.firstName(), softAssert, 'First name field');

    public fillFirstName = async (firstName: string) =>
        await this.navigation.fillInputField(this.firstName(), firstName, 'First name field');

    public validateLastNameVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.lastName(), softAssert, 'Last name field');

    public fillLastName = async (lastName: string) =>
        await this.navigation.fillInputField(this.lastName(), lastName, 'Last name field');

    public validateDOBVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.dateOfBirthTextArea(), softAssert, 'Date of birth field');

    //TODO: step param
    //TODO: add locators
    @step('I fill the date of birth field')
    public async fillDOB(dateOfBirth: string) {
        await this.navigation.fillInputField(this.dateOfBirthTextArea(), dateOfBirth, 'Date of birth field');
        if (await this.page.locator("[class*='styles_datePickerCalendar_']").isVisible()) {
            await this.page.locator('[class*=styles_icon_].mr-1').click();
        }
    }

    public validateLastNameEditable = async (softAssert = false) =>
        await this.navigation.assertEditable(this.lastName(), softAssert, 'Last name field');

    public validateFirstNameEditable = async (softAssert = false) =>
        await this.navigation.assertEditable(this.firstName(), softAssert, 'First name field');

    public validateDOBEditable = async (softAssert = false) =>
        await this.navigation.assertEditable(this.dateOfBirthTextArea(), softAssert, 'Date of birth field');

    public validateGenderButtonVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.genderButton(), softAssert, 'Gender button');

    public validateGenderContainerVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.genderOptionsContainer(), softAssert, 'Gender container');
    
    public validateAlmostDoneButtonVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.almostDoneButton(), softAssert, 'Almost done button');

    public validateAlmostDoneButtonEnabled = async (softAssert = false) =>
        await this.navigation.assertEnabled(this.almostDoneButton(), softAssert, 'Almost Done button');

    public validateAlmostDoneNotEnabled = async (softAssert = false) =>
        await this.navigation.assertNotEnabled(this.almostDoneButton(), softAssert, 'Almost Done button');

    public clickAlmostDoneButton = async () =>
        await this.navigation.clickElement(this.almostDoneButton(), 'Almost Done button');

    public validateError = async (fieldWithError: ErrorFieldsLocator) =>
        await this.navigation.assertVisible(this.fieldError(fieldWithError), false, `Field error ${fieldWithError}`);


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

    @step('I fill the second registration step with partial values')
    public async fillPartialSecondStep({ firstName, lastName, DOB, gender }: secondStepFields) {
        firstName != undefined ? await this.fillFirstName(firstName) :
            await test.step('I do not set first name', async () => { });
        lastName != undefined ? await this.fillLastName(lastName) :
            await test.step('I do not set last name', async () => { });
        DOB != undefined ? await this.fillDOB(DOB) :
            await test.step('I do not set DOB', async () => { });
        gender != undefined ? await this.selectGender(gender) :
            await test.step('I do not set a gender', async () => { });
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