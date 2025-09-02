import test from "../../../pages/base/base.po";
import path from 'path';
import { MenuItems } from '../../../pages/menu/menuItems.po';
import { NavigationItems } from '../../../pages/menu/navigationItems.po';

test.beforeEach(async ({ page }) => {
	await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
});

test.describe("Login Page Regression Tests - Mobile", () => {
	test.use({ storageState: path.resolve(__dirname, '../../../playwright/.auth/noAuthentication.json') });

test.describe('Login with no credentials', () => {
    const wrongCredentials: Array<{
      scenario: string;
      username: string;
      password: string;
      error: 'email' | 'password' | 'credentials';
    }> = [
      {
        scenario: `Empty password`,
        username: `${process.env.USER}`,
        password: '',
        error: 'password',
      },
      {
        scenario: `Empty email`,
        username: '',
        password: `${process.env.PASS}`,
        error: 'email',
      },
	  			{ scenario: `Wrong password`, username: `${process.env.USER}`, password: "wrong_password", error: 'credentials' },
			{ scenario: `Wrong email`, username: `wrong_username@mail.com`, password: `${process.env.PASS}`, error: 'credentials' },
			{ scenario: `Invalid email`, username: `wrong_username`, password: `${process.env.PASS}`, error: 'email' },
      //   { TODO: figure out how to handle this case
      //     scenario: `Empty both`,
      //     username: '',
      //     password: '',
      //     error: 'credentials',
      //   }
    ];
    for (const fields of wrongCredentials) {
      test(`Validate ${fields.scenario} tab`, async ({
        loginPage,
        menuItems,
      }) => {
        await menuItems.clickLogin();
        await loginPage.actionLogin(fields.username, fields.password);
        await loginPage.validateLoginError(fields.error);
      });
    }
  });

	test.describe("Test going back from login page via the back button", () => {
		const navigationScenarios: Array<{
			scenario: string;
			url: string;
			navigate: (params: { 		
				menuItems: MenuItems;
				navigationItems: NavigationItems;
			}) => Promise<void>;
		}> = [
			{
				scenario: 'Home Page',
				url: '',
				navigate: async ({ menuItems }) => await menuItems.clickLogo(),
			},
			{
				scenario: 'promotions',
				url: '/promotions',
				navigate: async ({ navigationItems }) => await navigationItems.clickPromotionsButton(),
			},
			{
				scenario: 'Casino',
				url: '/games',
				navigate: async ({ navigationItems }) => await navigationItems.clickCasinoButton(),
			}
		];
		for (const { scenario, url, navigate } of navigationScenarios) {
			test(`Test return back to ${scenario}`, async ({ loginPage, navigationItems, menuItems }) => {
				await navigate({ navigationItems, menuItems });
				await menuItems.clickLogin();
				await loginPage.validatePageElementsVisible(true);
				await loginPage.validateNavigationBack(scenario, `${process.env.URL}${url}`);
			});
		}
	});
});
