import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../login/loginPage.po';
import { MenuItems } from '../menu/menuItems.po';
import { NavigationItems } from '../menu/navigationItems.po';
import { SignUpStep1 } from '../signUp/signUpStep1.po';

type pages = {
	loginPage: LoginPage;
	menuItems: MenuItems;
	navigationItems: NavigationItems;
	signUpStep1: SignUpStep1;
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
});

export default test;
export const expect = test.expect;
export const describe = test.describe;
