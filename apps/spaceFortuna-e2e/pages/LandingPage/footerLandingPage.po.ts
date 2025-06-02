import { Page } from '@playwright/test';
import { step, stepParam, assertAttribute, iterateElements, clickElement, assertVisible, validateAttributes } from '@test-utils/navigation.po';
import test from '../utils/base.po';

export class FooterLandingPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    readonly footerLinksContainer = () => this.page.locator('#footer-links-container');
    readonly footerLinksSections = () => this.page.locator('div[class*="footer_footerNavContainer_"]');
    readonly footerLinkSection = (nthSection: number) => this.footerLinksSections().nth(nthSection);
    readonly footerLinksTitles = (nthSection: number) => this.footerLinkSection(nthSection).locator('div[class*="footer_footerNavigationTitle_"]');
    readonly footerLinks = (nthSection: number) => this.footerLinkSection(nthSection).locator('a[class*="footer_footerNavigationLink_"]').or(
        this.page.locator('div[class*="footer_footerNavigationLink_"]'));
    readonly footerLink = (nthSection: number, nthLink: number) => this.footerLinks(nthSection).nth(nthLink);

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
    public validateLinksContainerVisible = async (softAssert = false) =>
        await assertVisible(this.footerLinksContainer(), 'Footer links container', softAssert);

    public validateLinksSectionVisible = async (nthSection: number, softAssert = false) =>
        await assertVisible(this.footerLinkSection(nthSection), `Section number ${nthSection}`, softAssert);

    public validateLinksTitleVisible = async (nthSection: number, softAssert = false) =>
        await assertVisible(this.footerLinksTitles(nthSection), `title of links section number ${nthSection}`, softAssert);

    public validateLinkVisible = async (nthSection: number, nthLink: number, softAssert = false) =>
        await assertAttribute(this.footerLink(nthSection, nthLink), 'href', `Link #${nthLink} in section #${nthSection}`, softAssert);

    public validateProvidersContainerVisible = async (softAssert = false) =>
        await assertVisible(this.footerProvidersContainer(), 'Providers container', softAssert);

    public validatePaymentMethodsContainerVisible = async (softAssert = false) =>
        await assertVisible(this.footerPaymentMethodsContainer(), 'Footer payment methods container', softAssert);

    public validateLicensesContainerVisible = async (softAssert = false) =>
        await assertVisible(this.footerLicensesContainer(), 'Footer licenses container', softAssert);

    public validateLanguageSwitcherVisible = async (softAssert = false) =>
        await assertVisible(this.footerLanguageSwitcher(), 'Footer language switcher', softAssert);

    public validateLicensesVisible = async (softAssert = false) =>
        await assertVisible(this.licenses(), 'Footer licenses', softAssert);

    public validateCertificatesVisible = async (index: number, softAssert = false) =>
        await assertVisible(this.certificate(index), `Certificate number ${index} in footer`, softAssert);

    public clickLink = async (nthSection: number, nthLink: number) =>
        await clickElement(this.footerLink(nthSection, nthLink), `Footer link number ${nthLink}`);

    public iterateCertificates = async (softAssert = false) =>
        await iterateElements(this.certificates(),
            (index) => this.validateCertificatesVisible(index, softAssert), 'Footer certificates'
        );

    public iteratePaymentMethods = async (softAssert = false) =>
        await iterateElements(this.paymentMethods(), (index) =>
            this.validatePaymentMethodsVisible(index, softAssert), 'Footer payment methods'
        );

    public validateProviders = async (softAssert = false) =>
        await iterateElements(this.providers(), (index) =>
            this.validateProviderVisible(index, softAssert), 'Footer providers'
        );

    @stepParam((nthElement: number) => `I validate payment method number ${nthElement}`)
    public async validatePaymentMethodsVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validateProvidersContainerVisible(softAssert);
        await validateAttributes(this.paymentMethod(nthElement),
            `Payment method #${nthElement}`, { srcset: null, src: null });
    }

    @stepParam((nthElement: number) => `I validate provider number ${nthElement}`)
    public async validateProviderVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validatePaymentMethodsContainerVisible(softAssert);
        await validateAttributes(this.provider(nthElement), 
            `Provider number ${nthElement}`, { srcset: null, src: null });
    }

    @step('I validate all elements in footer section')
    public async validateSections(): Promise<void> {
        await this.validatePaymentMethodsContainerVisible();
        await this.validateProvidersContainerVisible();
        await this.validateLanguageSwitcherVisible();
        await this.validateLicensesVisible();
    }

    @step('I validate all links')
    public async validateLinks(softAssert = false, linksToCheck = 1): Promise<void> {
        await iterateElements(this.footerLinksSections(),
            async (sectionIndex) => {
                await this.validateLinksSectionVisible(sectionIndex, softAssert);
                await iterateElements(this.footerLinks(sectionIndex),
                    (linkIndex) => this.validateLinkVisible(sectionIndex, linkIndex, softAssert), 'Footer links',
                    linksToCheck
                );
            }
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