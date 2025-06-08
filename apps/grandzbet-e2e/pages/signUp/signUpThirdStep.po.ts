import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { step, stepParam, clickElement,assertVisible, fillInputField, assertEditable, assertCondition } from '@test-utils/navigation.po';

export type Country = 'France' | 'Canada';
export type CountryCode = '+33' | '+1';
export type thirdStepFields = { checkbox: boolean, country?: Country, city?: string, address?: string, postcode?: string, countryCode?: CountryCode, phone?: string };
export type ErrorFieldsLocator = 'email' | 'password' | 'firstName' | 'lastName' | 'city' | 'address' | 'zipCode'

export class SignUpThirdStep {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //Locators - should work for both mobile and desktop
    private readonly desktopCountryButton = () => this.page.getByRole('button', { name: 'Country', exact: true }).or(
        this.page.getByRole('button', { name: 'Pays', exact: true })
    );
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
    private readonly fieldError = (fieldError: ErrorFieldsLocator) => this.page.locator(`label[class*="field_error"][for*=${fieldError}]`);

    //Actions
    public validateCityVisible = async (softAssert = false) => await assertVisible(this.city(), 'City field', softAssert);

    public fillCity = async (city: string) => await fillInputField(this.city(), city, 'City field');

    public validateAddressVisible = async (softAssert = false) => await assertVisible(this.address(), 'Address field', softAssert);

    public fillAddress = async (address: string) => await fillInputField(this.address(), address, 'Address field');

    public validatePostCodeVisible = async (softAssert = false) => await assertVisible(this.postCode(), 'Post code field', softAssert);

    public fillPostCode = async (postCode: string) => await fillInputField(this.postCode(), postCode, 'Post code field');

    public validatePhoneVisible = async (softAssert = false) => await assertVisible(this.phone(), 'Phone field', softAssert);

    public fillPhone = async (phone: string) => await fillInputField(this.phone(), phone, 'Phone field');

    public validateCountryButtonVisible = async (softAssert = false) =>
        await assertVisible(this.desktopCountryButton().or(this.mobileCountryButton()), 'Country button', softAssert);

    public validateAgeCheckboxVisible = async (softAssert = false) =>
        await assertVisible(this.ageCheckbox(), 'Age checkbox', softAssert);

    public clickAgeCheckbox = async () => await clickElement(this.ageCheckbox(), 'Age Checkbox');

    public validateEnterButtonVisible = async (softAssert = false) =>
        await assertVisible(this.enterButton(), 'Enter button', softAssert);

    public clickEnterButton = async () => await clickElement(this.enterButton(), 'Enter button');

    public validateError = async (fieldWithError: ErrorFieldsLocator) =>
        await assertVisible(this.fieldError(fieldWithError), `Field error ${fieldWithError}`);

    public validateEnterEnabled = async (expectedStatus: boolean, softAssert= false) =>
        await assertCondition(this.enterButton(), 'enabled', expectedStatus, 'Enter button', softAssert);

    @stepParam((field: Locator, description: string) =>
        `I validate visibility of ${description} field`)
    private async validateField(field: Locator, description: string) {
        await assertVisible(field, `${description} is visible`);
        await assertEditable(field, `${description} is editable`);
    }

    private async fillFieldIfDefined<T>(
        fieldValue: T | undefined,
        fillMethod: (value: T) => Promise<void>,
        stepDescription: string
    ) {
        if (fieldValue !== undefined) {
            await fillMethod.call(this, fieldValue);
        } else {
            await test.step(stepDescription, async () => {
                // intentionally left blank
            });
        }
    }

    @step('I select country')
    public async selectCountry(countrySelected: Country) {
        await expect(this.desktopCountryButton().or(this.mobileCountryButton())).toBeVisible();
        if (await this.mobileCountryButton().isVisible()) {
            await this.mobileCountryButton().selectOption(countrySelected);
        } else {
            await this.desktopCountryButton().click();
            await this.page.getByText(countrySelected).click();
        }
    }

    @step('I select Phone country code')
    public async selectCountryCode(countryCodeSelected: CountryCode) {
        await expect(this.desktopCountryCodeButton().or(this.mobileCountryCodes())).toBeVisible();
        if (await this.mobileCountryCodes().isVisible()) {
            await this.mobileCountryCodes().selectOption(countryCodeSelected);
        } else {
            await this.desktopCountryCodeButton().click();
            await this.desktopCountryCodeList().getByText(countryCodeSelected, { exact: true }).click();
        }
    }

    @step('I fill the third registration step with available values')
    public async fillPartialThirdStep(fields: thirdStepFields): Promise<void> {
        const { checkbox, country, city, address, postcode, countryCode, phone } = fields;

        await this.fillFieldIfDefined(country, this.selectCountry, 'I do not set country');
        await this.fillFieldIfDefined(city, this.fillCity, 'I do not set city');
        await this.fillFieldIfDefined(address, this.fillAddress, 'I do not set address');
        await this.fillFieldIfDefined(postcode, this.fillPostCode, 'I do not set postcode');
        await this.fillFieldIfDefined(countryCode, this.selectCountryCode, 'I do not set country code');
        await this.fillFieldIfDefined(phone, this.fillPhone, 'I do not set phone');
    
        if (checkbox) {
            await this.clickAgeCheckbox();
        } else {
            await test.step('I do not check the age checkbox', async () => {
                // intentionally left blank
            });
        }
    }

    @step('I fill all required fields in the third registration step')
    public async fillThirdStep(city: string, address: string, postcode: string, phone: string, country: Country, countryCode: CountryCode) {
        await this.selectCountry(country);
        await this.fillCity(city);
        await this.fillAddress(address);
        await this.fillPostCode(postcode);
        await this.selectCountryCode(countryCode)
        await this.fillPhone(phone);
        await this.clickAgeCheckbox();
    }

    public async validateThirdStepElements() {
        await test.step(`I validate third registration step elements`, async () => {
            await this.validateField(this.mobileCountryButton().or(this.desktopCountryButton()), 'Country button');
            await this.validateField(this.city(), 'City field');
            await this.validateField(this.address(), 'Address field');
            await this.validateField(this.postCode(), 'Post code field');
            await this.validateField(this.phone(), 'Phone field');
            await this.validateField(this.ageCheckbox(), 'Age checkbox');
            await assertVisible(this.enterButton(), 'Enter button');
        });
    }

}