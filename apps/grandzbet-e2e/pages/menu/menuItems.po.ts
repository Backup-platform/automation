import { Page } from '@playwright/test';
import {
    step,
    assertVisible,
    clickElement,
    assertNotVisible,
} from '@test-utils/navigation.po';

export class MenuItems {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    // Locators

    //Both
    private readonly register = () => this.page.locator('.shadow-header button.min-w-max.inline-flex.bg-primary');
    private readonly login = () => this.page.locator('button.bg-secondary-secondary:nth-child(2)');
    private readonly balance = () => this.page.locator('.shadow-header div[id*=radix]');
    private readonly myProfileButton = () => this.page.locator('.bg-tertiary-secondary.shadow-sm.text-greyLight');

    //Desktop specific
    private readonly depositDesktop = () => this.page.locator('.shadow-header [aria-haspopup=dialog].bg-primary');
    private readonly myBetsButtonDesktop = () => this.page.locator('.shadow-header [aria-haspopup=dialog].bg-secondary-secondary');
    private readonly burgerMenuButtonDesktop = () => this.page.locator('.shadow-header button.bg-tertiary-secondary.lg\\:flex');
    private readonly logo = () => this.page.locator('[alt*="Website logo"].sm\\:block');

    //Mobile specific  
    private readonly depositMobile = () => this.page.locator('.shadow-header span.bg-primary');
    private readonly myBetsButtonMobile = () => this.page.locator('.shadow-header .rounded-none');
    private readonly burgerMenuButtonMobile = () => this.page.locator('.shadow-header button.bg-tertiary-secondary.lg\\:hidden');
    private readonly logoMobile = () => this.page.locator('[alt*="Website logo"].sm\\:hidden');

    // Viewport-aware getters
    private readonly deposit = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.depositDesktop() : this.depositMobile();
    };
    private readonly myBetsButton = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.myBetsButtonDesktop() : this.myBetsButtonMobile();
    };
    private readonly burgerMenuButton = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.burgerMenuButtonDesktop() : this.burgerMenuButtonMobile();
    };
       
    private readonly logoElement = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.logo() : this.logoMobile();
    };

    //Desktop only
    private readonly searchImageDesktop = () => this.page.locator('.pointer-events-auto svg');
    private readonly searchButtonDesktop = () => this.page.locator('.ml-auto .relative input');

    
    // Actions
    public clickLogin = async () => await clickElement(this.login(), 'Login button');
    public clickRegister = async () => await clickElement(this.register(), 'Register button');
    public clickLogo = async () => await clickElement(await this.logoElement(), 'Website logo');

    // Add navigation method that accepts target
    public async navigateToPage(target: 'logo'): Promise<void> {
        const navigationMap = {
            'logo': () => this.clickLogo()
        } as const;
        
        await navigationMap[target]();
    }

    @step('I validate the menu items for a logged-in user')
    public async validateUserItems(softAssert = false): Promise<void> {
        await assertVisible(this.myProfileButton(), 'My Profile button', softAssert);
        await assertVisible(this.balance(), 'Balance button', softAssert);
        await assertVisible(await this.deposit(), 'Deposit button', softAssert);
        await assertVisible(await this.myBetsButton(), 'My Bets button', softAssert);
        await assertVisible(await this.burgerMenuButton(), 'Burger Menu button', softAssert);
        await assertNotVisible(this.login(), 'Login button', softAssert);
        await assertNotVisible(this.register(), 'Register button', softAssert);
    }

    @step('I validate the menu items for a Guest')
    public async validateGuestItems(softAssert = false): Promise<void> {
        await assertVisible(this.login(), 'Login button', softAssert);
        await assertVisible(this.register(), 'Register button', softAssert);
        await assertNotVisible(this.myProfileButton(), 'My Profile button', softAssert);
        await assertNotVisible(this.balance(), 'Balance button', softAssert);
        await assertNotVisible(await this.deposit(), 'Deposit button', softAssert);
        await assertNotVisible(await this.myBetsButton(), 'My Bets button', softAssert);
    }
}
