import { test as base } from '@playwright/test';
import { LoginPage } from '../loginPage.po';
import { LandingPage } from '../LandingPage/landingPage.po';
import { HeaderMenuDesktop } from '../headerMenuDesktop.po';
import { FooterMenuMobile } from '../footerMenuMobile.po';
import { GameProviders } from '../gameProviders.po';
import { Banner } from '../banner.po';
import { Promotions } from '../promotions.po';
import { PromotionDetails } from '../promotion.details.po';
import { PromotionTabs } from '../promotionTabs.po';
import { SignUp } from '../signUp.po';
import { WalletModal } from '../walletModal.po';
import { ResetPasswordFrame } from '../resetPasswordFrame.po';
import { Navigation } from './navigation.po';
import { LandingPageCarousel } from '../LandingPage/landingPageCarousel.po';
import { TopCategories } from '../LandingPage/topCategories.po';
import { GamesCategories } from '../LandingPage/gamesCategories.po';
import { LandingPageFAQ } from '../LandingPage/landingPageFAQ.po';
import { PromotionsLandingPage } from '../LandingPage/promotionsLandingPage.po';
import { FooterLandingPage } from '../LandingPage/footerLandingPage.po';

type pages = {
	loginPage: LoginPage;
	landingPage: LandingPage;
	headerMenuDesktop: HeaderMenuDesktop;
	footerMenuMobile: FooterMenuMobile;
	gameProviders: GameProviders;
	banner: Banner;
	promotions: Promotions;
	promotionDetails: PromotionDetails;
	promotionTabs: PromotionTabs;
	signUp: SignUp;
	walletModal: WalletModal;
	resetPasswordFrame: ResetPasswordFrame;
	navigation: Navigation;
	landingPageCarousel: LandingPageCarousel;
	topCategories: TopCategories;
	gamesCategories: GamesCategories;
	landingPageFAQ: LandingPageFAQ;
	promotionsLandingPage: PromotionsLandingPage;
	footerLandingPage: FooterLandingPage;
}

const test = base.extend<pages>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
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
	signUp: async ({ page }, use) => {
		await use(new SignUp(page));
	},
	walletModal: async ({ page }, use) => {
		await use(new WalletModal(page));
	},
	resetPasswordFrame: async ({ page }, use) => {
		await use(new ResetPasswordFrame(page));
	},
	navigation: async ({ page }, use) => {
		await use(new Navigation(page));
	},
	landingPageCarousel: async ({ page }, use) => {
		await use(new LandingPageCarousel(page));
	},
	topCategories: async ({ page }, use) => {
		await use(new TopCategories(page));
	},
	gamesCategories: async ({ page }, use) => {
		await use(new GamesCategories(page));
	},
	landingPageFAQ: async ({ page }, use) => {
		await use(new LandingPageFAQ(page));
	},
	promotionsLandingPage: async ({ page }, use) => {
		await use(new PromotionsLandingPage(page));
	},
	footerLandingPage: async ({ page }, use) => {
		await use(new FooterLandingPage(page));
	},
});

export default test;
export const expect = test.expect;
export const describe = test.describe;
