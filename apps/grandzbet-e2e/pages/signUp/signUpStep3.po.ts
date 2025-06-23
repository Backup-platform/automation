import { Page } from '@playwright/test';
import { 
    step, 
    stepParam, 
    clickElement, 
    assertVisible, 
    fillInputField, 
    assertEditable, 
    assertCondition, 
    callMethodIfDefined,
    compositeLocator,
    CompositeLocator,
    selectDropdownOption
} from '@test-utils/navigation.po';

type Country = 'australia' | 'austria' | 'canada' | 'finland' | 'ghana' | 'gibraltar' | 'greece' | 
    'italy' | 'latvia' | 'new zealand' | 'norway' | 'singapore' | 'sweden';
type CountryCode = '+1'| '+33' | '+32' | '+358' | '+590' | '+224' | '+245' | '+592' | 
    '+594' | '+44-1624' | '+44-1534' | '+262' | '+352' | '+261' | '+596' | '+230' | '+47' | '+687' | '+64' | '+689' | '+378' | '+1-869' | '+508' | '+1-784' | '+1-758' | '+41' | '+681';

export class SignUpStep3 {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    
    //TODO: ask devlopers for country dropdown data-value language attribute
    // Clean Composite Locators based on actual HTML structure
    private readonly countryDropdown = compositeLocator(() => 
        this.page.locator('input[aria-haspopup="dialog"][readonly]').first(), 'Country dropdown');
    
    private readonly countryExpandedDropdown = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"].popover-content-width-full'), 'Country expanded dropdown');

    private readonly countryOption = (country: string) => 
        compositeLocator(() => this.page.locator(`[cmdk-item][role="option"][data-value="${country.toLowerCase()}"]`), `Country option: ${country}`);

    private readonly city = compositeLocator(() => 
        this.page.locator('input[name="city"]'), 'City field');
    
    private readonly address = compositeLocator(() => 
        this.page.locator('input[name="address"]'), 'Address field');
    
    private readonly zipCode = compositeLocator(() => 
        this.page.locator('input[name="zipCode"]'), 'Zip Code field');
    
    private readonly phoneNumberDropdown = compositeLocator(() => 
        this.page.locator('input[aria-haspopup="dialog"][readonly]').last(), 'Phone number dropdown');
    
    private readonly phoneCodeExpandedDropdown = compositeLocator(() => 
        this.page.locator('div[role="dialog"][data-state="open"].popover-content-width-full'), 'Phone code expanded dropdown');

    private readonly phoneCodeOption = (countryCode: string) => 
        compositeLocator(() => this.page.locator(`[cmdk-item][role="option"][data-value="${countryCode}"]`), `Phone code option: ${countryCode}`);

    private readonly phoneNumberOptions = compositeLocator(() => 
        this.page.locator('input[name="phoneNumber.number"]'), 'Phone number options');
    
    private readonly exclusiveOffersCheckbox = compositeLocator(() => 
        this.page.locator('button[role="checkbox"]').first(), 'Exclusive offers checkbox');
    
    private readonly termsAndConditionsCheckbox = compositeLocator(() => 
        this.page.locator('button[role="checkbox"]').last(), 'Terms and conditions checkbox');
    
    private readonly registerButton = compositeLocator(() => 
        this.page.locator('form button.bg-primary'), 'Register button');

    private readonly cityError = compositeLocator(() => 
        this.page.locator(`div:has(input[name='city']) ~ p.text-error`), 'City field error');
    
    private readonly addressError = compositeLocator(() => 
        this.page.locator(`div:has(input[name='address']) ~ p.text-error`), 'Address field error');
    
    private readonly zipCodeError = compositeLocator(() => 
        this.page.locator(`div:has(input[name='zipCode']) ~ p.text-error`), 'Zip Code field error');
    
    private readonly phoneNumberError = compositeLocator(() => 
        this.page.locator(`div:has(input[name='phoneNumber.number']) ~ p.text-error`), 'Phone number field error');
    
    private readonly termsAndConditionsError = compositeLocator(() => 
        this.page.locator('button[role="checkbox"][aria-invalid="true"] ~ p.text-error'), 'Terms and conditions error');

    public fillCity = async (city: string) => 
        await fillInputField(this.city, city);

    public fillAddress = async (address: string) => 
        await fillInputField(this.address, address);

    public fillPostCode = async (postCode: string) => 
        await fillInputField(this.zipCode, postCode);

    public fillPhoneNumber = async (phone: string) => 
        await fillInputField(this.phoneNumberOptions, phone);

    public clickTermsAndConditionsCheckbox = async () => 
        await clickElement(this.termsAndConditionsCheckbox);

    public clickExclusiveOffersCheckbox = async () => 
        await clickElement(this.exclusiveOffersCheckbox);

    public clickRegisterButton = async () => 
        await clickElement(this.registerButton);

    public validateCityVisible = async (softAssert = false) => 
        await assertVisible(this.city, softAssert);

    public validateAddressVisible = async (softAssert = false) => 
        await assertVisible(this.address, softAssert);

    public validateZipCodeVisible = async (softAssert = false) => 
        await assertVisible(this.zipCode, softAssert);

    public validatePhoneNumberInputVisible = async (softAssert = false) => 
        await assertVisible(this.phoneNumberOptions, softAssert);

    public validateCountryDropdownVisible = async (softAssert = false) =>
        await assertVisible(this.countryDropdown, softAssert);

    public validatePhoneNumberDropdownVisible = async (softAssert = false) =>
        await assertVisible(this.phoneNumberDropdown, softAssert);

    public validateTermsAndConditionsCheckboxVisible = async (softAssert = false) =>
        await assertVisible(this.termsAndConditionsCheckbox, softAssert);

    public validateExclusiveOffersCheckboxVisible = async (softAssert = false) =>
        await assertVisible(this.exclusiveOffersCheckbox, softAssert);

    public validateRegisterButtonVisible = async (softAssert = false) =>
        await assertVisible(this.registerButton, softAssert);

    public validateRegisterButtonEnabled = async (expectedStatus: boolean, softAssert = false) =>
        await assertCondition(this.registerButton.locator(), 'enabled', expectedStatus, this.registerButton.name, softAssert);

    public validateError = async (errorElement: CompositeLocator, softAssert = false) => {
        await assertVisible(errorElement, softAssert);
    }

    public async selectCountry(countrySelected: string) {
        await this.page.waitForTimeout(2000); // Wait for the dropdown to be ready
        await selectDropdownOption(
            this.countryDropdown,
            this.countryExpandedDropdown,
            this.countryOption(countrySelected)
        );
    }

    public async selectCountryCode(countryCodeSelected: string) {
        await selectDropdownOption(
            this.phoneNumberDropdown,
            this.phoneCodeExpandedDropdown,
            this.phoneCodeOption(countryCodeSelected)
        );
    }

    @stepParam((field: CompositeLocator) => `I validate visibility of ${field.name}`)
    private async validateField(field: CompositeLocator) {
        await assertVisible(field);
        await assertEditable(field);
    }

    @step('I fill the third registration step with available values')
    public async fillPartialThirdStep(fields: {
        checkbox?: boolean;
        country?: Country; 
        city?: string; 
        address?: string; 
        postcode?: string; 
        countryCode?: CountryCode; 
        phone?: string;
    }): Promise<void> {
        const { checkbox, country, city, address, postcode, countryCode, phone } = fields;
        
        if (country && city && address && postcode && countryCode && phone && checkbox) {
            await this.fillThirdStep(country, city, address, postcode, countryCode, phone);
        } else {
            await callMethodIfDefined(country, this.selectCountry, 'set country', this);
            await callMethodIfDefined(city, this.fillCity, 'set city', this);
            await callMethodIfDefined(address, this.fillAddress, 'set address', this);
            await callMethodIfDefined(postcode, this.fillPostCode, 'set postcode', this);
            await callMethodIfDefined(countryCode, this.selectCountryCode, 'set country code', this);
            await callMethodIfDefined(phone, this.fillPhoneNumber, 'set phone', this);
            await callMethodIfDefined(checkbox, this.clickTermsAndConditionsCheckbox, 'check terms and conditions checkbox', this);
        }
    }

    @step('I fill all required fields in the third registration step')
    public async fillThirdStep(country: Country, city: string, address: string, postcode: string, countryCode: CountryCode, phone: string) {
        await this.selectCountry(country);
        await this.fillCity(city);
        await this.fillAddress(address);
        await this.fillPostCode(postcode);
        await this.selectCountryCode(countryCode)
        await this.fillPhoneNumber(phone);
        await this.clickTermsAndConditionsCheckbox();
    }

    @step('I validate third step elements are visible and editable')
    public async validateThirdStepElements() {
            await this.validateField(this.countryDropdown);
            await this.validateField(this.city);
            await this.validateField(this.address);
            await this.validateField(this.zipCode);
            await this.validateField(this.phoneNumberOptions);
            await assertVisible(this.termsAndConditionsCheckbox);
            await assertVisible(this.exclusiveOffersCheckbox);
            await assertVisible(this.registerButton);
    }

    // Replace validateErrorByType with validateFieldError
    public async validateFieldError(fieldName: 'city' | 'address' | 'zipCode' | 'phoneNumber' | 'termsAndConditions', softAssert = false): Promise<void> {
        const fieldErrorMap = {
            'city': this.cityError,
            'address': this.addressError,
            'zipCode': this.zipCodeError,
            'phoneNumber': this.phoneNumberError,
            'termsAndConditions': this.termsAndConditionsError
        } as const;
        
        await this.validateError(fieldErrorMap[fieldName], softAssert);
    }
}