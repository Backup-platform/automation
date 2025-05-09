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
    public validateCityVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.city(), softAssert, 'City field');

    public fillCity = async (city: string) =>
        await this.navigation.fillInputField(this.city(), city, 'City field');

    public validateAddressVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.address(), softAssert, 'Address field');

    public fillAddress = async (address: string) =>
        await this.navigation.fillInputField(this.address(), address, 'Address field');

    public validatePostCodeVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.postCode(), softAssert, 'Post code field');

    public fillPostCode = async (postCode: string) =>
        await this.navigation.fillInputField(this.postCode(), postCode, 'Post code field');

    public validatePhoneVisible = (softAssert = false) =>
        this.navigation.assertVisible(this.phone(), softAssert, 'Phone field');

    public fillPhone = async (phone: string) =>
        await this.navigation.fillInputField(this.phone(), phone, 'Phone field');

    public validateCountryButtonVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.desktopCountryButton().or(this.mobileCountryButton()), softAssert, 'Country button');

    public validateAgeCheckboxVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.ageCheckbox(), softAssert, 'Age checkbox');

    public clickAgeCheckbox = async () =>
        await this.navigation.clickElement(this.ageCheckbox(), 'Age Checkbox');

    public validateEnterButtonVisible = async (softAssert = false) =>
        await this.navigation.assertVisible(this.enterButton(), softAssert, 'Enter button');

    public clickEnterButton = async () =>
        await this.navigation.clickElement(this.enterButton(), 'Enter button');

    //TODO: use navigation class
    public async validateEnterEnabled(expectedStatus: boolean) {
        //await this.navigation.assertEnabled(this.enterButton(), expectedStatus, 'Enter button');
        await expect(await this.enterButton().isEnabled(),
            'Expect Enter button isEnabled to be: ' + expectedStatus).toBe(expectedStatus);
    }

    public validateError = async (fieldWithError: ErrorFieldsLocator) =>
        await this.navigation.assertVisible(this.fieldError(fieldWithError), false, `Field error ${fieldWithError}`);

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

    //TODO: add step
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
        checkbox == true ? await this.clickAgeCheckbox() :
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
        await this.clickAgeCheckbox();
    }

    //TODO: add step and use navigation class
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