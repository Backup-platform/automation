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
    readonly footerLinksContainer = () => this.page.locator('#footer-links-container');
    readonly footerLinksSections = () => this.page.locator('div[class*="footer_footerNavContainer_"]');
    readonly footerLinksTitles = () => this.page.locator('div[class*="footer_footerNavigationTitle_"]');
    readonly footerLinks = () => this.page.locator('a[class*="footer_footerNavigationLink_"]').or(
        this.page.locator('div[class*="footer_footerNavigationLink_"]')
    );

    readonly footerProvidersContainer = () => this.page.locator('#footer-providers-container');
    readonly paymentMethods = () => this.page.locator('img[class*="footer_paymentMethod_"]');

    readonly footerPaymentMethodsContainer = () => this.page.locator('#footer-payment-methods-container');
    readonly providers = () => this.page.locator('img[class*="footer_providerLogo_"]');

    readonly footerLicensesContainer = () => this.page.locator('#footer-licenses-container');
    readonly footerLanguageSwitcher = () => this.page.locator('div[class*="footer_languageSwitcher_"]'); 
    readonly licenses = () => this.page.locator('#footer-licenses-container p');
    readonly certificates = () => this.page.locator('#footer-certificates-container div');


    // Actions
    public async validateLinksContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerLinksContainer(), softAssert,
            'Expect the footer links container to be visible');
    }

    public async validateLinksSectionVisible(nthSection: number, softAssert = false): Promise<void> {
        const section = this.footerLinksSections().nth(nthSection);
        await this.navigation.assertVisible(section, softAssert,
            `Expect links section number ${nthSection} to be visible`);
    }

    public async validateLinksTitleVisible(nthSection: number, softAssert = false): Promise<void> {
        const title = this.footerLinksSections().nth(nthSection).locator(this.footerLinksTitles());
        await this.navigation.assertVisible(title, softAssert,
            `Expect title of links section number ${nthSection} to be visible`);
    }

    @stepParam((nthSection: number, nthLink: number) => `I validate link number ${nthLink} in section number ${nthSection}`)
    public async validateLinkVisible(nthSection: number, nthLink: number, softAssert = false): Promise<void> {
        const section = this.footerLinksSections().nth(nthSection);
        const link = section.locator(this.footerLinks()).nth(nthLink);

        await this.navigation.assertVisible(link, softAssert, `Link #${nthLink} in section #${nthSection}`);
        await this.navigation.assertAttribute(link, 'href');
    }

    public async validateProvidersContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerProvidersContainer(), softAssert,
            'Expect the providers container to be visible');
    }

    @stepParam((nthElement: number) => `I validate payment method number ${nthElement}`)
    public async validatePaymentMethodsVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validateProvidersContainerVisible(softAssert);
        const paymentMethod = this.paymentMethods().nth(nthElement);
        await this.navigation.assertVisible(paymentMethod, softAssert, `Payment method #${nthElement}`);
        await this.navigation.assertAttribute(paymentMethod, 'srcset');
        await this.navigation.assertAttribute(paymentMethod, 'src');
    }

    public async validatePaymentMethodsContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerPaymentMethodsContainer(), softAssert,
            'Expect the footer payment methods container to be visible');
    }

    @stepParam((nthElement: number) => `I validate provider number ${nthElement}`)
    public async validateProvidersVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validatePaymentMethodsContainerVisible(softAssert);
        const provider = this.providers().nth(nthElement);
        await this.navigation.assertVisible(provider, softAssert, `Provider number ${nthElement}`);
        await this.navigation.assertAttribute(provider, 'srcset');
        await this.navigation.assertAttribute(provider, 'src');
    }

    public async validateLicensesContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerLicensesContainer(), softAssert,
            'Expect the footer licenses container to be visible');
    }

    public async validateLanguageSwitcherVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerLanguageSwitcher(), softAssert,
            'Expect the footer language switcher to be visible');
    }

    public async validateLicensesVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.licenses(), softAssert,
            'Expect footer licenses to be visible');
    }

    public async validateCertificatesVisible(index: number, softAssert = false): Promise<void> {
        const certificate = this.certificates().nth(index);
        await this.navigation.assertVisible(certificate, softAssert,
            `Expect certificate number ${index} in footer to be visible`);
    }

    @stepParam((nthLink: number) => `I click on footer link number ${nthLink}`)
    public async clickLink(nthLink: number, softAssert = false): Promise<void> {
        const footerLink = this.footerLinks().nth(nthLink);
        await this.navigation.clickElement(footerLink, softAssert,
            `Expect footer link number ${nthLink} to be visible`);
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
                await this.navigation.iterateElements(this.footerLinks(),
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
            (index) => this.validateProvidersVisible(index, softAssert)
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
