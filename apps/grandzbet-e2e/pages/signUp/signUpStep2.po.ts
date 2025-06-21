import { Locator, Page } from '@playwright/test';
import { 
    step, 
    clickElement, 
    assertVisible, 
    fillInputField, 
    assertEditable,
    stepParam, 
    selectDropdownOption,
    parseDateString,
    callMethodIfDefined,
    compositeLocator,
    CompositeLocator
} from '@test-utils/navigation.po';
    // Define types inline - no external dependencies
    type Gender = 'MALE' | 'FEMALE';
export class SignUpStep2 {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }



    // Locators
    private readonly firstName = compositeLocator(() => this.page.locator("input[name='firstName']"), 'First name field');
    private readonly lastName = compositeLocator(() => this.page.locator("input[name='lastName']"), 'Last name field');
    private readonly dateOfBirth = compositeLocator(() => this.page.locator("input[name='birthDate']"), 'Date of birth field');
    private readonly genderDropdown = compositeLocator(() => this.page.locator('input[aria-haspopup="dialog"]:not([name="birthDate"])'), 'Gender dropdown');
    private readonly genderExpandedDropdown = compositeLocator(() => this.page.locator('[cmdk-root] [role="listbox"]'), 'Gender dropdown options');
    private readonly genderArrowIcon = compositeLocator(() => this.page.locator('.pointer-events-auto svg'), 'Gender arrow icon');
    //private readonly nextButton = compositeLocator(() => this.page.locator("form button[type='button'].bg-primary"), 'Next button');
    private readonly firstNameError = compositeLocator(() => this.page.locator(`div:has(input[name='firstName']) ~ p.text-error`), 'First Name field error');
    private readonly lastNameError = compositeLocator(() => this.page.locator(`div:has(input[name='lastName']) ~ p.text-error`), 'Last Name field error');
    private readonly birthDateError = compositeLocator(() => this.page.locator(`div:has(input[name='birthDate']) ~ p.text-error`), 'Date of Birth field error');
    private readonly genderError = compositeLocator(() => this.page.locator(`div:has(input[aria-haspopup="dialog"]:not([name="birthDate"])) ~ p.text-error`), 'Gender field error');
    private readonly calendarContainer = compositeLocator(() => this.page.locator('.space-y-4.rdp-caption_start.rdp-caption_end'), 'Calendar container');
    private readonly monthDropdown = compositeLocator(() => this.page.locator('.flex.flex-row-reverse.justify-center.gap-1 button[role="combobox"]').first(), 'Month dropdown');
    private readonly yearDropdown = compositeLocator(() => this.page.locator('.flex.flex-row-reverse.justify-center.gap-1 button[role="combobox"]').last(), 'Year dropdown');
    private readonly calendarOptionsList = compositeLocator(() => this.page.locator('[role="listbox"]'), 'Calendar options list');
    private readonly genderMaleOption = compositeLocator(() => this.page.locator('[role="option"][data-value="male"]'), 'Male gender option');
    private readonly genderFemaleOption = compositeLocator(() => this.page.locator('[role="option"][data-value="female"]'), 'Female gender option');

    private readonly dayButton = (day: string) => 
        compositeLocator(() => this.page.locator(`button[role="gridcell"]:has-text("${day}"):not(.text-muted-foreground)`).first(), `Day: ${day}`);
    private readonly yearOption = (year: string) => 
        compositeLocator(() => this.page.locator(`[role="option"]:has-text("${year}")`), `Year: ${year}`);
    private readonly monthOption = (month: string) => 
        compositeLocator(() => this.page.locator(`[role="option"]:has-text("${month}")`), `Month: ${month}`);

    private getGenderOption(gender: Gender): Locator {
        return gender === 'MALE' ? this.genderMaleOption.locator() : this.genderFemaleOption.locator();
    }

    //Actions

    public validateFirstNameVisible = async (softAssert = false) => await assertVisible(this.firstName, softAssert);

    public validateFirstNameEditable = async (softAssert = false) => await assertEditable(this.firstName, softAssert);

    public validateLastNameVisible = async (softAssert = false) => await assertVisible(this.lastName, softAssert);

    public validateLastNameEditable = async (softAssert = false) => await assertEditable(this.lastName, softAssert);

    public validateDOBVisible = async (softAssert = false) => await assertVisible(this.dateOfBirth, softAssert);

    public validateDOBEditable = async (softAssert = false) => await assertEditable(this.dateOfBirth, softAssert);

    public validateGenderDropdownVisible = async (softAssert = false) => await assertVisible(this.genderDropdown, softAssert);

    public validateGenderOptionsVisible = async (softAssert = false) => await assertVisible(this.genderExpandedDropdown, softAssert);

    public validateGenderArrowIconVisible = async (softAssert = false) => await assertVisible(this.genderArrowIcon, softAssert);

	public validateError = async ( errorElement: CompositeLocator, softAssert = false ) => await assertVisible(errorElement, softAssert);

	public clickGenderDropdown = async () => await clickElement(this.genderDropdown);

    public fillFirstName = async (firstName: string) => await fillInputField(this.firstName, firstName);

    public fillLastName = async (lastName: string) => await fillInputField(this.lastName, lastName);

    public async selectGender(selectedGender: Gender) {
        const genderOption = this.getGenderOption(selectedGender);
        await selectDropdownOption(
            this.genderDropdown.locator(), 
            this.genderExpandedDropdown.locator(), 
            genderOption, 
            this.genderDropdown.name, 
            `Gender: ${selectedGender}`
        );
    }

    @stepParam((dateString: string) => (`Select date of birth: ${dateString}`))
    public async selectDateOfBirth(dateString: string) {
        const { year, month, day } = parseDateString(dateString);
        await clickElement(this.dateOfBirth);
        await selectDropdownOption(this.yearDropdown, this.calendarOptionsList, this.yearOption(year));
        await selectDropdownOption(this.monthDropdown, this.calendarOptionsList, this.monthOption(month));
        await clickElement(this.dayButton(day));
    }

    // Inline interface definition - no external dependencies
    public async fillPartialSecondStep(fields: {
        firstName?: string; 
        lastName?: string; 
        DOB?: string; 
        gender?: Gender;
    }): Promise<void> {
        const { firstName, lastName, DOB, gender } = fields;

        if (firstName && lastName && DOB && gender) {
            await this.fillSecondStep(firstName, lastName, DOB, gender);
        } else {
            await callMethodIfDefined(firstName, this.fillFirstName, 'set first name', this);
            await callMethodIfDefined(lastName, this.fillLastName, 'set last name', this);
            await callMethodIfDefined(gender, this.selectGender, 'set a gender', this);
            await callMethodIfDefined(DOB, this.selectDateOfBirth, 'set date of birth', this);
        }
    }

    @step('I fill the second registration step')
    public async fillSecondStep(firstName: string, lastName: string, DOB: string, gender: Gender) {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.selectDateOfBirth(DOB);
        await this.selectGender(gender);
    }

    @step('I validate second step elements are visible and editable')
    public async validateSecondStepElements(softAssert = false) {
        await assertVisible(this.firstName, softAssert);
        await assertEditable(this.firstName, softAssert);
        await assertVisible(this.lastName, softAssert);
        await assertEditable(this.lastName, softAssert);
        await assertVisible(this.dateOfBirth, softAssert);
        await assertEditable(this.dateOfBirth, softAssert);
        // Validate other elements are visible
        // await assertVisible(this.genderDropdown.locator(), this.genderDropdown.name, softAssert);
        // await assertVisible(this.nextButton.locator(), this.nextButton.name, softAssert);
    }

    // Replace validateErrorByType with validateFieldError
    public async validateFieldError(fieldName: 'firstName' | 'lastName' | 'birthDate' | 'gender', softAssert = false): Promise<void> {
        const fieldErrorMap = {
            'firstName': this.firstNameError,
            'lastName': this.lastNameError,
            'birthDate': this.birthDateError,
            'gender': this.genderError
        } as const;
        
        await this.validateError(fieldErrorMap[fieldName], softAssert);
    }
}