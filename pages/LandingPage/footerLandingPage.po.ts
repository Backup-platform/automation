import { Locator, Page } from '@playwright/test';
import { Navigation, step, stepParam } from '../utils/navigation.po';
import test from '../utils/base.po';

export class FooterLandingPage {
    readonly page: Page;
    readonly navigation: Navigation;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new Navigation(page);
    }

    // Locators
    //TODO: add nthelements to the locators
    readonly footerLinksContainer = () => this.page.locator('#footer-links-container');
    readonly footerLinksSections = () => this.page.locator('div[class*="footer_footerNavContainer_"]');
    readonly footerLinkSection = (nthSection: number) => this.footerLinksSections().nth(nthSection);
    readonly footerLinksTitles = (nthSection: number) => this.footerLinkSection(nthSection).locator('div[class*="footer_footerNavigationTitle_"]');
    readonly footerLinks = (nthSection: number) => this.footerLinkSection(nthSection).locator('a[class*="footer_footerNavigationLink_"]').or(
        this.page.locator('div[class*="footer_footerNavigationLink_"]'));
    readonly footerLink = (nthSection: number, nthLink: number) => this.footerLinkSection(nthSection).locator('a[class*="footer_footerNavigationLink_"]').nth(nthLink).or(
        this.page.locator('div[class*="footer_footerNavigationLink_"]').nth(nthLink));
    

    readonly footerProvidersContainer = () => this.page.locator('#footer-providers-container');
    readonly paymentMethods = () => this.page.locator('img[class*="footer_paymentMethod_"]');
    readonly paymentMethod = (nthElement: number) => this.paymentMethods().nth(nthElement);

    readonly footerPaymentMethodsContainer = () => this.page.locator('#footer-payment-methods-container');
    readonly providers = () => this.page.locator('img[class*="footer_providerLogo_"]');
    readonly provider = (nthElement: number) => this.providers().nth(nthElement);

    readonly footerLicensesContainer = () => this.page.locator('#footer-licenses-container');
    readonly footerLanguageSwitcher = () => this.page.locator('div[class*="footer_languageSwitcher_"]'); 
    readonly licenses = () => this.page.locator('#footer-licenses-container p');
    readonly certificates = () => this.page.locator('#footer-certificates-container div');
    readonly certificate = (nthElement: number) => this.certificates().nth(nthElement);


    // Actions
    public async validateLinksContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerLinksContainer(), softAssert, 'Footer links container');
    }

    public async validateLinksSectionVisible(nthSection: number, softAssert = false): Promise<void> {
        const section = this.footerLinksSections().nth(nthSection);
        await this.navigation.assertVisible(section, softAssert,
            `Expect links section number ${nthSection} to be visible`);
    }

    public validateLinksTitleVisible = (nthSection: number, softAssert = false) => 
        this.navigation.assertVisible(this.footerLinksTitles(nthSection), softAssert, `title of links section number ${nthSection}`);

    public async validateLinkVisible(nthSection: number, nthLink: number, softAssert = false): Promise<void> {
        await this.navigation.assertAttribute(this.footerLink(nthSection, nthLink), 'href', false, `Link #${nthLink} in section #${nthSection}`);
    }

    public async validateProvidersContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerProvidersContainer(), softAssert, 'Providers container');
    }

    @stepParam((nthElement: number) => `I validate payment method number ${nthElement}`)
    public async validatePaymentMethodsVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validateProvidersContainerVisible(softAssert);
        await this.navigation.validateAttributes(this.paymentMethod(nthElement), 
            `Payment method #${nthElement}`, {srcset: null, src:null});
    }

    public async validatePaymentMethodsContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerPaymentMethodsContainer(), softAssert, 'Footer payment methods container');
    }

    @stepParam((nthElement: number) => `I validate provider number ${nthElement}`)
    public async validateProviderVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validatePaymentMethodsContainerVisible(softAssert);
        await this.navigation.validateAttributes(this.provider(nthElement), `Provider number ${nthElement}`, {srcset: null, src: null});
    }

    public async validateLicensesContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerLicensesContainer(), softAssert, 'Footer licenses container');
    }

    public async validateLanguageSwitcherVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerLanguageSwitcher(), softAssert, 'Footer language switcher');
    }

    public async validateLicensesVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.licenses(), softAssert, 'Footer licenses');
    }

    public async validateCertificatesVisible(index: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.certificate(index), softAssert, `Certificate number ${index} in footer`);
    }

    public async clickLink(nthLink: number): Promise<void> {
        await this.navigation.clickElement(this.footerLinks(nthLink), `Footer link number ${nthLink}`);
    }

    @step('I validate all elements in footer section')
    public async validateSections(): Promise<void> {
        await this.validatePaymentMethodsContainerVisible();
        await this.validateProvidersContainerVisible();
        await this.validateLanguageSwitcherVisible();
        await this.validateLicensesVisible();
    }

    @step('I validate all certificates in the footer')
    public async validateCertificates(softAssert = false): Promise<void> {
        await this.navigation.iterateElements(this.certificates(),
            (index) => this.validateCertificatesVisible(index, softAssert)
        );
    }

    @step('I validate all links')
    public async validateLinks(softAssert = false, linksToCheck = 1): Promise<void> {
        await this.navigation.iterateElements(this.footerLinksSections(),
            async (sectionIndex) => {
                await this.validateLinksSectionVisible(sectionIndex, softAssert);
                await this.navigation.iterateElements(this.footerLinks(sectionIndex),
                    (linkIndex) => this.validateLinkVisible(sectionIndex, linkIndex, softAssert),
                    linksToCheck
                );
            }
        );
    }

    @step('I validate all payment methods')
    public async validatePaymentMethods(softAssert = false): Promise<void> {
        await this.navigation.iterateElements(this.paymentMethods(),
            (index) => this.validatePaymentMethodsVisible(index, softAssert)
        );
    }

    @step('I validate all providers')
    public async validateProviders(softAssert = false): Promise<void> {
        await this.navigation.iterateElements(this.providers(),
            (index) => this.validateProviderVisible(index, softAssert)
        );
    }

    @step('I validate all elements in footer section')
    public async validateSectionElements(softAssert = false, linksToCheck = 1): Promise<void> {
        await this.validatePaymentMethodsContainerVisible();
        await this.validateProvidersContainerVisible();
        await this.validateLicensesVisible();
        await test.step('I validate all certificates in the footer', async () => {
            for (let c = 0; c < await this.certificates().count(); c++) {
                await this.validateCertificatesVisible(c);
            }
        });

        await test.step('I validate all links', async () => {
            for (let i = 0; i < await this.footerLinksSections().count() - 1; i++) {
                await this.validateLinksSectionVisible(i, softAssert);
                for (let j = 0; j < linksToCheck; j++) {
                    await this.validateLinkVisible(i, j);
                }
            }
        });
    }
}
