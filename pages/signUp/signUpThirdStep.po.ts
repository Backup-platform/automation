import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation, step, stepParam } from '../utils/navigation.po';

export type Country = 'France' | 'Canada';
export type CountryCode = '+33' | '+1';
export type thirdStepFields = { checkbox: boolean, country?: Country, city?: string, address?: string, postcode?: string, countryCode?: CountryCode, phone?: string };
export type ErrorFieldsLocator = 'email' | 'password' | 'firstName' | 'lastName' | 'city' | 'address' | 'zipCode'

export class SignUpThirdStep {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
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
    @step('I validate the city field is visible')
    public async validateCityVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.city(), softAssert, 'City field');
    }

    @step('I fill the city field')
    public async fillCity(city: string) {
        await this.navigation.fillInputField(this.city(), city, false, 'City field');
    }

    @step('I validate the address field is visible')
    public async validateAddressVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.address(), softAssert, 'Address field');
    }

    @step('I fill the address field')
    public async fillAddress(address: string) {
        await this.navigation.fillInputField(this.address(), address, false, 'Address field');
    }

    @step('I validate the post code field is visible')
    public async validatePostCodeVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.postCode(), softAssert, 'Post code field');
    }

    @step('I fill the post code field')
    public async fillPostCode(postCode: string) {
        await this.navigation.fillInputField(this.postCode(), postCode, false, 'Post code field');
    }

    @step('I validate the phone field is visible')
    public async validatePhoneVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.phone(), softAssert, 'Phone field');
    }

    @step('I fill the phone field')
    public async fillPhone(phone: string) {
        await this.navigation.fillInputField(this.phone(), phone, false, 'Phone field');
    }

    @step('I validate the country button is visible')
    public async validateCountryButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.desktopCountryButton().or(this.mobileCountryButton()), softAssert, 'Country button');
    }

    @step('I validate the age checkbox is visible')
    public async validateAgeCheckboxVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.ageCheckbox(), softAssert, 'Age checkbox');
    }

    @step('I click the Age Checkbox')
    public async clickAgeChecbox() {
        await this.navigation.clickElement(this.ageCheckbox(), false, 'Age Checkbox');
    }

    @step('I validate the enter button is visible')
    public async validateEnterButtonVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.enterButton(), softAssert, 'Enter button');
    }

    @step('I click the Enter button')
    public async clickEnterButton() {
        await this.navigation.clickElement(this.enterButton(), false, 'Enter button');
    }

    @step('I validate the enter button is enabled')
    public async validateEnterEnabled(expectedStatus: boolean) {
        await expect(await this.enterButton().isEnabled(),
            'Expect Enter button isEnabled to be: ' + expectedStatus).toBe(expectedStatus);
    }

    @stepParam((fieldWithError: ErrorFieldsLocator) => `I validate the ${fieldWithError} error is visible`)
    public async validateError(fieldWithError: ErrorFieldsLocator) {
        await this.navigation.assertVisible(this.fieldError(fieldWithError), false, `Field error ${fieldWithError}`);
        //await expect(this.fieldError(fieldWithError), 'I validate that the ' + fieldWithError + ' error is visible').toBeVisible();
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

    public async fillPartialThirdStep({ checkbox, country, city, address, postcode, countryCode, phone }: thirdStepFields) {
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

    @step('I fill the third registration step')
    public async fillThirdStep(city: string, address: string, postcode: string, phone: string, country: Country, countryCode: CountryCode) {
        await this.selectCountry(country);
        await this.fillCity(city);
        await this.fillAddress(address);
        await this.fillPostCode(postcode);
        await this.selectCountryCode(countryCode)
        await this.fillPhone(phone);
        await this.clickAgeChecbox();
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

}