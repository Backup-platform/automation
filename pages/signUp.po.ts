import { Locator, Page } from '@playwright/test';
import test, { expect } from './utils/base.po';

export type Gender = 'Male' | 'Female';
export type Country = 'France' | 'Canada';
export type CountryCode = '+33' | '+1';
export type ErrorFieldsLocator = 'email' | 'password' | 'firstName' | 'lastName' | 'city' | 'address' | 'zipCode'
export type thirdStepFields = {checkbox: boolean, country?: Country, city?: string, address?: string, postcode?: string, countryCode?: CountryCode, phone?: string};
export type secondStepFields = {firstName?: string, lastName?: string, DOB?: string, gender?: Gender};

export class SignUp {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    //TODO: validate sign up window elements
    //TODO: make a method that interacts with the callendar 
    private readonly email = () => this.page.locator("#email");
    private readonly password = () => this.page.locator("#password");
    private readonly nextStepButton = () => this.page.locator("#registration-next-step-btn");
    private readonly firstName = () => this.page.locator("#firstName");
    private readonly lastName = () => this.page.locator("#lastName");
    private readonly dateOfBirthTextArea = () => this.page.locator(".react-datepicker__input-container .p-1");
    private readonly genderDropdown = () => this.page.locator("#gender").getByText('Gender');
    private readonly genderGeneral = () => this.page.locator("#gender");
    private readonly mobileGenderDropdown = () => this.page.locator('select[class*="select_dropdownButton_"]'); 
    private readonly desktopGenderDropdown = () => this.page.locator('button[class*="select_dropdownButton_"]'); 
    private readonly almostDoneButton = () => this.page.locator("#registration-enter-universe-btn");
    private readonly desktopCountryButton = () => this.page.getByRole('button', { name: 'Country' });
    private readonly mobileCountryButton = () => this.page.locator('#country');
    private readonly desktopCountryCodeButton = () => this.page.locator(".mt-4 button[class*='styles_button_']");
    private readonly desktopCountryCodeList = () => this.page.locator(".mt-4 ul[class*='styles_list_']");
    private readonly mobileCountryCodes = () => this.page.locator("#phoneCode");
    private readonly city = () => this.page.locator("#city");
    private readonly address = () => this.page.locator("#address");
    private readonly postCode = () => this.page.locator("#zipCode");
    private readonly phone = () => this.page.locator("#phone");
    private readonly ageCheckbox = () => this.page.locator(".m-2:nth-child(2) .px-1");
    private readonly enterButton = () => this.page.locator("#registration-enter-universe-btn");
    private readonly successEscapeButton = () => this.page.locator("#registration-modal-close-btn");
    private readonly successMessageHeading = () => this.page.locator("div[class*='registrationModal_heading']");
    private readonly successMessageImage = () => this.page.locator('img[class*="registrationModal_successImage"]');
    private readonly successMessageBody = () => this.page.locator('div[class*="registrationModal_bodyContainer"]');
    private readonly successMessageText = () => this.page.locator('div[class*="registrationModal_text_"]');
    private readonly successCloseButton = () => this.page.locator('button[class*="registrationModal_nextButton"]');
    private readonly passwordRemindersContainer = () => this.page.locator('.mt-2.gap-2');
    private readonly passwordReminders = () => this.page.locator('.mt-2 .gap-2');
    private readonly passwordReminderMinus = () => this.page.locator("span[class*='passwordRequirements_minus_']");
    private readonly passwordReminderCheck = () => this.page.locator("span[class*='passwordRequirements_check_']");
    private readonly fieldError = (fieldError: ErrorFieldsLocator) => this.page.locator(`label[class*="field_error"][for*=${fieldError}]`);
    public readonly emailError = () => this.page.locator('label[class*="field_error"][for*="email"]');
    public readonly passwordError = () => this.page.locator('label[class*="field_error"][for*="password"]');
    private readonly passwordStrength = () => this.page.locator('progress[class*="passwordMeter_password_strength_meter_progress"]');

    public async fillEmail(userEmail: string) {
        await test.step('I fill the email field', async () => {
            await expect(this.email(), 'Expect email field is visible').toBeVisible();
            await expect(this.email(), 'Expect email field is editable').toBeEditable();
            await this.email().fill(userEmail);
        });
    }

    public async fillPassword(password: string) {
        await test.step('I fill the password field', async () => {
            await expect(this.password(), 'Expect password field is visible').toBeVisible();
            await expect(this.password(), 'Expect password field is editable').toBeEditable();
            await this.password().fill(password);
        });
    }

    public async fillFirstName(firstName: string) {
        await test.step('I fill the first name field', async () => {
            await expect(this.firstName(), 'Expect first name field is visible').toBeVisible();
            await expect(this.firstName(), 'Expect first name field is editable').toBeEditable();
            await this.firstName().fill(firstName);
        });
    }

    public async fillLastName(lastName: string) {
        await test.step('I fill the last name field', async () => {
            await expect(this.lastName(), 'Expect last name field is visible').toBeVisible();
            await expect(this.lastName(), 'Expect last name field is editable').toBeEditable();
            await this.lastName().fill(lastName);
        });
    }

    public async fillDOB(dateOfBirth: string) {
        await test.step('I fill the date of birth field', async () => {
            await expect(this.dateOfBirthTextArea(), 'Expect DOB field is visible').toBeVisible();
            await expect(this.dateOfBirthTextArea(), 'Expect DOB is editable').toBeEditable();
            await this.dateOfBirthTextArea().fill(dateOfBirth);
            if(await this.page.locator("[class*='styles_datePickerCalendar_']").isVisible()) {
                await this.page.locator('[class*=styles_icon_].mr-1').click();//'.text-center.mt-6 .ml-3').click();
            }//TODO: add locators for those 
        });

    }

    public async fillCity(city: string) {
        await test.step('I fill the city field', async () => {
            await expect(this.city(), 'Expect the city field is visible').toBeVisible();
            await expect(this.city(), 'Expect the city field is editable').toBeEditable();
            await this.city().fill(city);
        });
    }

    public async fillAddress(address: string) {
        await test.step('I fill the Address field', async () => {
            await expect(this.address(), 'Expect the Address field is visible').toBeVisible();
            await expect(this.address(), 'Expect the Address field is editable').toBeEditable();
            await this.address().fill(address);
        });
    }

    public async fillPostCode(postCode: string) {
        await test.step('I fill the Post Code field', async () => {
            await expect(this.postCode(), 'Expect the Post Code field is visible').toBeVisible();
            await expect(this.postCode(), 'Expect the Post Code field is editable').toBeEditable();
            await this.postCode().fill(postCode);
        });
    }

    public async selectGender(selectedGender: Gender) {
        await test.step('I select gender', async () => {
            await expect(this.desktopGenderDropdown().or(this.mobileGenderDropdown())).toBeVisible();
            if (await this.mobileGenderDropdown().isVisible()) {
                await this.mobileGenderDropdown().selectOption(selectedGender);
            } else {
                await this.genderDropdown().click();
                await this.genderGeneral().getByText(selectedGender, { exact: true }).click();
            }
        });
    }

    public async selectCountry(countrySelected: Country) {
        await test.step('I select country', async () => {
            await expect(this.desktopCountryButton().or(this.mobileCountryButton())).toBeVisible();
            if (await this.mobileCountryButton().isVisible()) {
                await this.mobileCountryButton().selectOption(countrySelected);
            } else {
                await this.desktopCountryButton().click();
                await this.page.getByText(countrySelected).click();
            }
        });
    }

    public async selectCountryCode(countryCodeSelected: CountryCode) {
        await test.step('I select Phone country code', async () => {
            await expect(this.desktopCountryCodeButton().or(this.mobileCountryCodes())).toBeVisible();
            if (await this.mobileCountryCodes().isVisible()) {
                await this.mobileCountryCodes().selectOption(countryCodeSelected);
            } else {
                await this.desktopCountryCodeButton().click();
                await this.desktopCountryCodeList().getByText(countryCodeSelected, { exact: true }).click();
            }
        });
    }

    public async fillPhone(phone: string) {
        await test.step('I fill the Phone field', async () => {
            await expect(this.phone(), 'Expect the Phone field is visible').toBeVisible();
            await expect(this.phone(), 'Expect the Phone field is editable').toBeEditable();
            await this.phone().fill(phone);
        });
    }

    public async clickAgeChecbox() {
        await test.step('I click Age Checkbox', async () => {
            await expect(this.ageCheckbox(), 'Expect the Age Checkbox is visible').toBeVisible();
            await this.ageCheckbox().click();
        });
    }

    public async clickNextButton() {
        await test.step(`I click the Next button`, async () => {
            await expect(this.nextStepButton(), 'Expect Next Button is visible').toBeVisible();
            await expect(this.nextStepButton(), 'Expect Next Button is enabled').toBeEnabled();
            await this.nextStepButton().click();
        });
    }

    public async clickAlmostDoneButton() {
        await test.step(`I click the Almost Done button`, async () => {
            await expect(this.almostDoneButton(), 'Expect Almost Done button is visible').toBeVisible();
            await expect(this.almostDoneButton(), 'Expect Almost Done button is editable').toBeEnabled();
            await this.almostDoneButton().click();
        })
    }

    public async clickEnterButton() {
        await test.step(`I click the Enter button`, async () => {
            await expect(this.enterButton(), 'Expect Enter button is visible').toBeVisible();
            //await expect(this.enterButton(), 'Expect Enter button is enabled').toBeEnabled();
            await this.enterButton().click();
        });
    }

    public async fillFirstStep(userEmail?: string, password?: string) {
        const time = new Date();
        await this.fillEmail(time.getTime() + '_' + userEmail);
        await this.fillPassword(time.getTime() + '_' + password);
        //TODO: make a method to add a datetime to email
    }

    public async fillPartialSecondStep({firstName, lastName, DOB, gender} : secondStepFields ) {
        firstName != undefined ? await this.fillFirstName(firstName) :
            await test.step('I do not set first name', async () => { });
        lastName != undefined ? await this.fillLastName(lastName) :
            await test.step('I do not set last name', async () => { });
        DOB != undefined ? await this.fillDOB(DOB) :
            await test.step('I do not set DOB', async () => { });
        gender != undefined ? await this.selectGender(gender) :
            await test.step('I do not set a gender', async () => { });
    }

    public async fillSecondStep(firstName: string, lastName: string, DOB: string, gender: Gender) {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillDOB(DOB);
        await this.selectGender(gender);
    }


    public async fillPartialThirdStep({checkbox, country, city, address, postcode, countryCode, phone}: thirdStepFields) {
        country != undefined ? await this.selectCountry(country) :
            await test.step('I do not set country', async () => { });
        city != undefined ? await this.fillCity(city) :
            await test.step('I do not set city', async () => { });
        address != undefined ? await this.fillAddress(address) :
            await test.step('I do not set Address', async () => { });
        postcode != undefined ? await this.fillPostCode(postcode) :
            await test.step('I do not set postcode', async () => { });
        countryCode != undefined ? await this.selectCountryCode(countryCode) :
            await test.step('I do not set phone country code', async () => { });
        phone != undefined ? await this.fillPhone(phone) :
            await test.step('I do not set phone', async () => { });
        checkbox == true ? await this.clickAgeChecbox() :
            await test.step('I do not check the Age checkbox', async () => { });
    }


    public async fillThirdStep(city: string, address: string, postcode: string, phone: string, country: Country, countryCode: CountryCode) {
        await this.selectCountry(country);
        await this.fillCity(city);
        await this.fillAddress(address);
        await this.fillPostCode(postcode);
        await this.selectCountryCode(countryCode)
        await this.fillPhone(phone);
        await this.clickAgeChecbox();
    }

    public async validatePasswordReminders2(passwordReminder: string) {
        await test.step('I validate password reminders', async () => {
                await expect(this.passwordRemindersContainer(), 'Password reminder container is visible').toBeVisible();
                await expect(this.passwordRemindersContainer(), `Password reminder contains ${passwordReminder}`).toContainText(passwordReminder);
        });
    }

    private async validatePasswordReminder(reminderText: string, shouldShowMinus: boolean) {
        await expect(this.passwordRemindersContainer(), 'Password reminder is visible').toBeVisible();
        await expect(this.passwordRemindersContainer(), `Password reminder contains ${reminderText}`).toContainText(reminderText);

        for (const parent of await this.passwordReminders().all()) {

            const isMatchingReminder = await parent.innerText() === reminderText;
            const shouldMinusBeVisible = isMatchingReminder ? shouldShowMinus : !shouldShowMinus;
            const shouldCheckBeVisible = isMatchingReminder ? !shouldShowMinus : shouldShowMinus;

            await expect.soft(parent.filter({ has: this.passwordReminderMinus() }),
                `Expect ${await parent.innerText()} is ${shouldMinusBeVisible} a Minus `)
                .toBeVisible({ visible: shouldMinusBeVisible });
            await expect.soft(parent.filter({ has: this.passwordReminderCheck() }),
                `Expect ${await parent.innerText()} is ${shouldCheckBeVisible} a Check`)
                .toBeVisible({ visible: shouldCheckBeVisible });
        }
    }

    public async validatePasswordCheck(reminderText: string) {
        await test.step(`Password reminder for ${reminderText} is check and the others are minus`, async () => {
            await this.validatePasswordReminder(reminderText, false);
        });
    }

    public async validatePasswordMinus(reminderText: string) {
        await test.step(`Password reminder for ${reminderText} is minus and the others are checks`, async () => {
            await this.validatePasswordReminder(reminderText, true);
        });
    }

    public async validateFirstStepElements() {
        await test.step(`I validate first registration step elements`, async () => {
            await expect(this.email(), 'Email field is visible').toBeVisible();
            await expect(this.password(), 'Password field is visible').toBeEditable();
            await expect(this.nextStepButton(), 'Next step Button is visible').toBeVisible();
        });
    }

    public async validateSecondStepElements() {
        await test.step(`I validate second registration step elements`, async () => {
            await expect(this.firstName()).toBeVisible();
            await expect(this.firstName()).toBeEditable();
            await expect(this.lastName()).toBeVisible();
            await expect(this.lastName()).toBeEditable();
            await expect(this.dateOfBirthTextArea()).toBeVisible();
            await expect(this.dateOfBirthTextArea()).toBeEditable();
            await expect(this.genderDropdown()).toBeVisible();
            await expect(this.genderDropdown()).toBeEditable();
            await expect(this.almostDoneButton()).toBeVisible();
            //TODO: expect messages
        });
    }

    public async validateThirdStepElements() {
        await test.step(`I validate third registration step elements`, async () => {
            await expect(this.mobileCountryButton().or(this.desktopCountryButton())).toBeVisible();
            await expect(this.mobileCountryButton().or(this.desktopCountryButton())).toBeEnabled();
            await expect(this.mobileCountryButton().or(this.desktopCountryButton())).toBeEditable();
            await expect(this.city()).toBeVisible();
            await expect(this.city()).toBeEditable();
            await expect(this.address()).toBeVisible();
            await expect(this.address()).toBeEditable();
            await expect(this.postCode()).toBeVisible();
            await expect(this.postCode()).toBeEditable();
            await expect(this.phone()).toBeVisible();
            await expect(this.phone()).toBeEditable();
            await expect(this.ageCheckbox()).toBeVisible();
            await expect(this.ageCheckbox()).toBeEnabled();
            await expect(this.ageCheckbox()).toBeEditable();
            await expect(this.enterButton()).toBeVisible();
            //TODO: expect messages
        });
    }

    public async validateRegistrationEmailSent() {
        await test.step(`I validate successfull registration email sent instructions`, async () => {
            await expect(this.successEscapeButton(), 'Escape Button is visible').toBeVisible();
            await expect(this.successMessageHeading(), 'Success image title is visible').toBeVisible();
            await expect(this.successMessageHeading(), 'Validate text content of success image title').toContainText('Please verify your email');
            await expect(this.successMessageImage(), 'Success image is visible').toBeVisible();
            await expect(this.successMessageBody(), 'Success message body is visible').toBeVisible();
            await expect(this.successMessageBody(), 'Validate text content of Success message body').toContainText('Please check your email to activate your account.');
            await expect(this.successMessageText(), 'Success message Text is visible').toBeVisible();
            await expect(this.successMessageText(), 'Validate text content of Success message text').toContainText('If you did not receive the email please check in your spam folder');
            await expect(this.successCloseButton(), 'Close button is visible').toBeVisible();
            await expect(this.successCloseButton(), 'Validate text content of Close button ').toContainText('close');
            await this.successCloseButton().click(); 
        });
    }

    public async validateNextButtonEnabled(expectedStatus: boolean) {
        await expect(await this.nextStepButton().isEnabled(),
            'Expect next button isEnabled to be: ' + expectedStatus).toBe(expectedStatus);
    }

    public async validatePasswordStrengthMeter() {
        await test.step('Password strength meter is visible', async () => {
            await expect(this.passwordStrength()).toBeVisible();
        });
    }

    public async validateAlmostDoneEnabled(expectedStatus: boolean) {
        await expect(await this.almostDoneButton().isEnabled(),
            'Expect Almost Done button isEnabled to be: ' + expectedStatus).toBe(expectedStatus);
    }

    public async validateEnterEnabled(expectedStatus: boolean) {
        await expect(await this.enterButton().isEnabled(),
            'Expect Enter button isEnabled to be: ' + expectedStatus).toBe(expectedStatus);
    }

    public async validateError(fieldWithError: ErrorFieldsLocator) {
        await expect(this.fieldError(fieldWithError), 'I validate that the ' + fieldWithError + ' error is visible').toBeVisible();
    }

}