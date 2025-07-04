import { Page } from '@playwright/test';
import { step } from '@test-utils/decorators';
import { assertVisible } from '@test-utils/assertions';
import { clickElement } from '@test-utils/interactions';
import { compositeLocator } from '@test-utils/core-types';

export class NavigationItems {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    private readonly desktop = compositeLocator(() => this.page.locator('.lg\\:flex'), 'Desktop navigation');
    private readonly mobile = compositeLocator(() => this.page.locator('.bg-tertiary-secondary'), 'Mobile navigation');
    
    private readonly vipDesktop = compositeLocator(() => this.desktop.locator().locator('a[href="/vip"]'), 'VIP link (Desktop)');
    private readonly promotionsDesktop = compositeLocator(() => this.desktop.locator().locator('a[href="/promotions"]'), 'Promotions link (Desktop)');
    private readonly sportsBettingDesktop = compositeLocator(() => this.desktop.locator().locator('a[href="/sports-betting#/live"]'), 'Sports Betting link (Desktop)');
    private readonly sportsBettingOverviewDesktop = compositeLocator(() => this.desktop.locator().locator('a[href="/sports-betting#/overview"]'), 'Sports Betting Overview link (Desktop)');
    private readonly liveCasinoDesktop = compositeLocator(() => this.desktop.locator().locator('a[href="/games/live-casino"]'), 'Live Casino link (Desktop)');
    private readonly casinoDesktop = compositeLocator(() => this.desktop.locator().locator('a[href="/games"]'), 'Casino link (Desktop)');

    private readonly vipMobile = compositeLocator(() => this.mobile.locator().locator('a[href="/vip"]'), 'VIP link (Mobile)');
    private readonly promotionsMobile = compositeLocator(() => this.mobile.locator().locator('a[href="/promotions"]'), 'Promotions link (Mobile)');
    private readonly sportsBettingMobile = compositeLocator(() => this.mobile.locator().locator('a[href="/sports-betting#/live"]'), 'Sports Betting link (Mobile)');
    private readonly sportsBettingOverviewMobile = compositeLocator(() => this.mobile.locator().locator('a[href="/sports-betting#/overview"]'), 'Sports Betting Overview link (Mobile)');
    private readonly liveCasinoMobile = compositeLocator(() => this.mobile.locator().locator('a[href="/games/live-casino"]'), 'Live Casino link (Mobile)');
    private readonly casinoMobile = compositeLocator(() => this.mobile.locator().locator('a[href="/games"]'), 'Casino link (Mobile)');

    private readonly vip = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.vipDesktop : this.vipMobile;
    };
    private readonly promotions = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.promotionsDesktop : this.promotionsMobile;
    };
    private readonly sportsBetting = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.sportsBettingDesktop : this.sportsBettingMobile;
    };
    private readonly sportsBettingOverview = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.sportsBettingOverviewDesktop : this.sportsBettingOverviewMobile;
    };
    private readonly liveCasino = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.liveCasinoDesktop : this.liveCasinoMobile;
    };
    private readonly casino = async () => {
        const viewport = this.page.viewportSize();
        return viewport && viewport.width >= 1024 ? this.casinoDesktop : this.casinoMobile;
    };

    // Actions
    public clickCasinoButton = async () => await clickElement(await this.casino());
    public clickLiveCasinoButton = async () => await clickElement(await this.liveCasino());
    public clickSportsBettingButton = async () => await clickElement(await this.sportsBetting());
    public clickSportsBettingOverviewButton = async () => await clickElement(await this.sportsBettingOverview());
    public clickPromotionsButton = async () => await clickElement(await this.promotions());
    public clickVipButton = async () => await clickElement(await this.vip());

    // Add navigation method that accepts target
    public async navigateToPage(target: 'casino' | 'promotions' | 'liveCasino' | 'sportsBetting' | 'sportsBettingOverview' | 'vip'): Promise<void> {
        const navigationMap = {
            'casino': () => this.clickCasinoButton(),
            'promotions': () => this.clickPromotionsButton(),
            'liveCasino': () => this.clickLiveCasinoButton(),
            'sportsBetting': () => this.clickSportsBettingButton(),
            'sportsBettingOverview': () => this.clickSportsBettingOverviewButton(),
            'vip': () => this.clickVipButton()
        } as const;
        
        await navigationMap[target]();
    }

    @step('I validate the header navigation items are visible')
    public async validateItemsVisible(softAssert = true): Promise<void> {
        await assertVisible(await this.vip(), softAssert);
        await assertVisible(await this.promotions(), softAssert);
        await assertVisible(await this.sportsBetting(), softAssert);
        await assertVisible(await this.sportsBettingOverview(), softAssert);
        await assertVisible(await this.liveCasino(), softAssert);
        await assertVisible(await this.casino(), softAssert);
    }
}
