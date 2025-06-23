import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../login/loginPage.po';
import { MenuItems } from '../menu/menuItems.po';
import { NavigationItems } from '../menu/navigationItems.po';
import { SignUpStep1 } from '../signUp/signUpStep1.po';
import { SignUpStep2 } from '../signUp/signUpStep2.po';
import { SignUpStep3 } from '../signUp/signUpStep3.po';
import { PopupHandlers } from '../popupHandlers.po';
import { SignUpCommon } from '../signUp/signUpCommon.po';

type pages = {
	loginPage: LoginPage;
	menuItems: MenuItems;
	navigationItems: NavigationItems;
	signUpStep1: SignUpStep1;
	signUpStep2: SignUpStep2;
	signUpStep3: SignUpStep3;
	popupHandlers: PopupHandlers;
	signUpCommon: SignUpCommon;
}

function createPageFixture<T>(PageObject: new (page: Page) => T) {
	return async (
		{ page }: { page: Page },
		use: (fixture: T) => Promise<void>
	): Promise<void> => {
	  await use(new PageObject(page));
	};
}

const test = base.extend<pages>({
	loginPage: createPageFixture(LoginPage),
	menuItems: createPageFixture(MenuItems),
	navigationItems: createPageFixture(NavigationItems),
	signUpStep1: createPageFixture(SignUpStep1),
	signUpStep2: createPageFixture(SignUpStep2),
	signUpStep3: createPageFixture(SignUpStep3),
	popupHandlers: createPageFixture(PopupHandlers),
	signUpCommon: createPageFixture(SignUpCommon),
});

export default test;
export const expect = test.expect;
export const describe = test.describe;
