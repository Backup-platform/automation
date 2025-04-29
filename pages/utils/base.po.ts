import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../loginPage.po';
import { LandingPage } from '../LandingPage/landingPage.po';
import { HeaderMenuDesktop } from '../headerMenuDesktop.po';
import { FooterMenuMobile } from '../footerMenuMobile.po';
import { GameProviders } from '../gameProviders.po';
import { Banner } from '../banner.po';
import { Promotions } from '../promotions.po';
import { PromotionDetails } from '../promotion.details.po';
import { PromotionTabs } from '../promotionTabs.po';
import { SignUp } from '../signUp/signUpPage.po';
import { WalletModal } from '../walletModal.po';
import { ResetPasswordFrame } from '../resetPasswordFrame.po';
import { Navigation } from './navigation.po';
import { LandingPageCarousel } from '../LandingPage/landingPageCarousel.po';
import { TopCategories } from '../LandingPage/topCategories.po';
import { GamesCategories } from '../LandingPage/gamesCategories.po';
import { LandingPageFAQ } from '../LandingPage/landingPageFAQ.po';
import { PromotionsLandingPage } from '../LandingPage/promotionsLandingPage.po';
import { FooterLandingPage } from '../LandingPage/footerLandingPage.po';
import { BurgerMenu } from '../mobileMenu/burgerMenu.po';
import { BottomMenu } from '../mobileMenu/bottomMenu.po';
import { SignUpFirstStep } from '../signUp/signUpFirstStep.po';
import { SignUpSecondStep } from '../signUp/signUpSecondStep.po';
import { SignUpThirdStep } from '../signUp/signUpThirdStep.po';
import { AccountModal } from '../myProfile/accountModal.po';
import { CashierMain } from '../openCashier/cashierMain.po';
import { CashierDeposit } from '../openCashier/cashierDeposit.po';
import { PaymentIQ } from '../openCashier/paymentIQ.po';
import { CashierWithdraw } from '../openCashier/cashierWithdraw.po';

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
	bottomMenu: BottomMenu;
	burgerMenu: BurgerMenu;
	signUpFirstStep: SignUpFirstStep;
	signUpSecondStep: SignUpSecondStep;
	signUpThirdStep: SignUpThirdStep;
	accountModal: AccountModal;
	cashierMain: CashierMain;
	cashierDeposit: CashierDeposit;
	cashierWithdraw: CashierWithdraw;
	paymentIQ: PaymentIQ;
}

function createPageFixture<T>(PageObject: new (page: Page) => T) {
	return async ({ page }, use, testInfo) => {
	  console.log(`Initializing ${PageObject.name} for project: ${testInfo.project.name}`);
	  await use(new PageObject(page));
	};
  }

const test = base.extend<pages>({
	loginPage: createPageFixture(LoginPage),
	landingPage: createPageFixture(LandingPage),
	headerMenuDesktop: createPageFixture(HeaderMenuDesktop),
	footerMenuMobile: createPageFixture(FooterMenuMobile),
	gameProviders: createPageFixture(GameProviders),
	banner: createPageFixture(Banner),
	promotions: createPageFixture(Promotions),
	promotionDetails: createPageFixture(PromotionDetails),
	promotionTabs: createPageFixture(PromotionTabs),
	signUp: createPageFixture(SignUp),
	walletModal: createPageFixture(WalletModal),
	resetPasswordFrame: createPageFixture(ResetPasswordFrame),
	navigation: createPageFixture(Navigation),
	landingPageCarousel: createPageFixture(LandingPageCarousel),
	topCategories: createPageFixture(TopCategories),
	gamesCategories: createPageFixture(GamesCategories),
	landingPageFAQ: createPageFixture(LandingPageFAQ),
	promotionsLandingPage: createPageFixture(PromotionsLandingPage),
	footerLandingPage: createPageFixture(FooterLandingPage),
	bottomMenu: createPageFixture(BottomMenu),
	burgerMenu: createPageFixture(BurgerMenu),
	signUpFirstStep: createPageFixture(SignUpFirstStep),
	signUpSecondStep: createPageFixture(SignUpSecondStep),
	signUpThirdStep: createPageFixture(SignUpThirdStep),
	accountModal: createPageFixture(AccountModal),
	cashierMain: createPageFixture(CashierMain),
	cashierDeposit: createPageFixture(CashierDeposit),
	cashierWithdraw: createPageFixture(CashierWithdraw),
	paymentIQ: createPageFixture(PaymentIQ),
});

export default test;
export const expect = test.expect;
export const describe = test.describe;
