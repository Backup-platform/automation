import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../login/loginPage.po';
import { MenuItems } from '../menu/menuItems.po';
import { NavigationItems } from '../menu/navigationItems.po';

type pages = {
	loginPage: LoginPage;
	menuItems: MenuItems;
	navigationItems: NavigationItems;
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
});

export default test;
export const expect = test.expect;
export const describe = test.describe;
