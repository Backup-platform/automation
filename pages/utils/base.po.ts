import { test as base } from '@playwright/test';
import { LogInIFrame } from '../logInIFrame.po';
import { LandingPage } from '../landingPage.po';
import { HeaderMenuDesktop } from '../headerMenuDesktop.po';
import { FooterMenuMobile } from '../footerMenuMobile.po';
import { GameProviders } from '../gameProviders.po';
import { Banner } from '../banner.po';
import { Promotions } from '../promotions.po';
import { PromotionDetails } from '../promotion.details.po';
import { PromotionTabs } from '../promotionTabs.po';

type pages = {
	logInIFrame: LogInIFrame;
	landingPage: LandingPage;
	headerMenuDesktop: HeaderMenuDesktop;
	footerMenuMobile: FooterMenuMobile;
	gameProviders: GameProviders;
	banner: Banner;
	promotions: Promotions;
	promotionDetails: PromotionDetails;
	promotionTabs: PromotionTabs;
}

const test = base.extend<pages>({
	logInIFrame: async ({ page }, use) => {
		await use(new LogInIFrame(page));
	},
	landingPage: async ({ page }, use) => {
		await use(new LandingPage(page));
	},
	headerMenuDesktop: async ({ page }, use) => {
		await use(new HeaderMenuDesktop(page));
	},
	footerMenuMobile: async ({ page }, use) => {
		await use(new FooterMenuMobile(page));
	},
	gameProviders: async ({ page }, use) => {
		await use(new GameProviders(page));
	},
	banner: async ({ page }, use) => {
		await use(new Banner(page));
	},
	promotions: async ({ page }, use) => {
		await use(new Promotions(page));
	},
	promotionDetails: async ({ page }, use) => {
		await use(new PromotionDetails(page));
	},
	promotionTabs: async ({ page }, use) => {
		await use(new PromotionTabs(page));
	},
});

export default test;
export const expect = test.expect;
export const describe = test.describe;