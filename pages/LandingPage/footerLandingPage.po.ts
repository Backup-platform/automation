import { Locator, Page } from '@playwright/test';
import test, { expect } from '../utils/base.po';
import { Navigation } from '../utils/navigation.po';
import { pathToFileURL } from 'url';

export class FooterLandingPage {

	readonly page: Page;
	readonly navigation: Navigation;

	constructor(page: Page) {
		this.page = page;
		this.navigation = new Navigation(page)
	}

	//Locators
	readonly sectionNumber: string;
	readonly footerLinksContainer = () => this.page.locator('#footer-links-container');
	readonly footerLinksSections = () => this.page.locator(`div[class*="footer_footerNavContainer_"]`);
	readonly footerLinksTitles = () => this.page.locator('div[class*="footer_footerNavigationTitle_"]');
	readonly footerLinks = () => this.page.locator('a[class*="footer_footerNavigationLink_"]').or(
        this.page.locator('div[class*="footer_footerNavigationLink_"]'));
	
	readonly footerProvidersContainer = () => this.page.locator('#footer-providers-container');
    readonly paymentMethods = () => this.page.locator('img[class*="footer_paymentMethod_"]');

	readonly footerPaymentMethodsContainer = () => this.page.locator('#footer-payment-methods-container');
    readonly providers = () => this.page.locator('img[class*="footer_providerLogo_"]');

	readonly footerLiscensesContainer = () => this.page.locator('#footer-licenses-container');
    readonly footerLanguageSwitcher = () => this.page.locator('div[class*="footer_languageSwitcher_"]'); 
    readonly licenses = () => this.page.locator('#footer-licenses-container p');
    readonly certificates = () => this.page.locator('#footer-certificates-container div');


    public async validateFooterLinksContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerLinksContainer(), softAssert, 
            'Expect the footer links container to be visible');
    }
    
    public async validateFooterLinksSectionVisible(nthSection: number, softAssert = false): Promise<void> {
        const section = this.footerLinksSections().nth(nthSection);
        await this.navigation.assertVisible(section, softAssert, 
            `Expect footer links section number ${nthSection} to be visible`);
    }
    
    public async validateFooterLinksTitleVisible(nthSection: number, softAssert = false): Promise<void> {
        const title = this.footerLinksSections().nth(nthSection).locator(this.footerLinksTitles());

        await this.navigation.assertVisible(title, softAssert, 
            `Expect title of footer links section number ${nthSection} to be visible`);
    }
    
    public async validateFooterLinkVisible(nthSection: number, nthLink: number, softAssert = false): Promise<void> {
        const section = this.footerLinksSections().nth(nthSection);
        const link = section.locator(this.footerLinks()).nth(nthLink);

        await this.navigation.assertVisible(link, softAssert, `Link # ${nthLink} in section # ${nthSection}`);
        await this.navigation.assertAttributes(link, 'href');
    }
      
    public async validateFooterProvidersContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerProvidersContainer(), softAssert, 'Providers Container');
    }

    public async validatePaymentMethodsVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validateFooterProvidersContainerVisible();
        await this.navigation.assertVisible(this.paymentMethods().nth(nthElement), softAssert, `Payment method # ${nthElement}`);
        await this.navigation.assertAttributes(this.paymentMethods().nth(nthElement), 'srcset');
        await this.navigation.assertAttributes(this.paymentMethods().nth(nthElement), 'src');
    }    
    
    public async validateFooterPaymentMethodsContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerPaymentMethodsContainer(), softAssert, 
            'Expect the footer payment methods container to be visible');
    }

    public async validateProvidersVisible(nthElement: number, softAssert = false): Promise<void> {
        await this.validateFooterPaymentMethodsContainerVisible();
        await this.navigation.assertVisible(this.providers().nth(nthElement), softAssert, `Provider number ${nthElement}`);
        await this.navigation.assertAttributes(this.providers().nth(nthElement), 'srcset');
        await this.navigation.assertAttributes(this.providers().nth(nthElement), 'src');
    }
    
    public async validateFooterLicensesContainerVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerLiscensesContainer(), softAssert, 
            'Expect the footer licenses container to be visible');
    }
    
    public async validateFooterLanguageSwitcherVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.footerLanguageSwitcher(), softAssert, 
            'Expect the footer language switcher to be visible');
    }

    public async validateLicensesVisible(softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.licenses(), softAssert, 'Expect footer licenses to be visible');
    }

    public async validateCertificatesVisible(index: number, softAssert = false): Promise<void> {
        await this.navigation.assertVisible(this.certificates().nth(index), softAssert, 
            `Expect Certificate number ${index} in footer to be visible`);
    }
    
    public async clickFooterLink(nthLink: number, softAssert = false): Promise<void> {
        await test.step(`I click on footer link number ${nthLink}`, async () => {
            const footerLink = this.footerLinks().nth(nthLink);
            await this.navigation.clickElement(footerLink, softAssert, 
                `Expect footer link number ${nthLink} to be visible`);
        });
    }
    
    public async validateFooterSections(): Promise<void> {
        await test.step(`I validate all elements in footer section`, async () => {
            await this.validateFooterPaymentMethodsContainerVisible();
            await this.validateFooterProvidersContainerVisible();
            await this.validateFooterLanguageSwitcherVisible();
            await this.validateLicensesVisible();
        });
    }

    public async validateCertificates(softAssert = false): Promise<void> {
        await test.step(`I validate all certificates in the footer`, async () => {
            await this.navigation.iterateElements(this.certificates(), (index) => this.validateCertificatesVisible(index, softAssert)
            );
        });
    }

    public async validateFooterLinks(softAssert = false, linksToCheck = 1): Promise<void> {
        await test.step(`I validate all footer links`, async () => {
            await this.navigation.iterateElements(this.footerLinksSections(),
                async (sectionIndex) => {
                    await this.validateFooterLinksSectionVisible(sectionIndex, softAssert);
                    await this.navigation.iterateElements(this.footerLinks(),
                        (linkIndex) => this.validateFooterLinkVisible(sectionIndex, linkIndex, softAssert), linksToCheck
                    );
                }
            );
        });
    }

    public async validatePaymentMethods(softAssert = false): Promise<void> {
        await test.step(`I validate all payment methods`, async () => {
            await this.navigation.iterateElements(
                this.paymentMethods(),
                (index) => this.validatePaymentMethodsVisible(index, softAssert)
            );
        });
    }

    public async validateProviders(softAssert = false): Promise<void> {
        await test.step(`I validate all providers`, async () => {
            await this.navigation.iterateElements(
                this.providers(),
                (index) => this.validateProvidersVisible(index, softAssert)
            );
        });
    }
    
}