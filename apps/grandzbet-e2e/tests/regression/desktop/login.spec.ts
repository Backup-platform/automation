import test from '../../../pages/base/base.po';
import path from 'path';
import { MenuItems } from '../../../pages/menu/menuItems.po';
import { NavigationItems } from '../../../pages/menu/navigationItems.po';
import { expect } from 'playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(`${process.env.URL}`, { waitUntil: 'load' });
});

test.describe('Login Page Regression Tests - Desktop', () => {
  test.use({
    storageState: path.resolve(
      __dirname,
      '../../../playwright/.auth/noAuthentication.json'
    ),
  });

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
        {
          scenario: `Wrong password`,
          username: `${process.env.USER}`,
          password: 'wrong_password',
          error: 'credentials',
        },
        {
          scenario: `Wrong email`,
          username: `wrong_username@mail.com`,
          password: `${process.env.PASS}`,
          error: 'credentials',
        },
        {
          scenario: `Invalid email`,
          username: `wrong_username`,
          password: `${process.env.PASS}`,
          error: 'email',
        },
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

  test.describe('Test going back from login page via the back button', () => {
    const navigationScenarios: Array<{
      scenario: string;
      url: string;
      navigate: (params: {
        menuItems: MenuItems;
        navigationItems: NavigationItems;
      }) => Promise<void>;
    }> = [
        {
          scenario: 'LandingPage',
          url: '',
          navigate: async ({ menuItems }) =>
            await menuItems.clickLogo(),
        },
        {
          scenario: 'Casino',
          url: '/games',
          navigate: async ({ navigationItems }) =>
            await navigationItems.clickCasinoButton(),
        },
        {
          scenario: 'Promotions',
          url: '/promotions',
          navigate: async ({ navigationItems }) =>
            await navigationItems.clickPromotionsButton(),
        },
      ];
    for (const { scenario, url, navigate } of navigationScenarios) {
      test(`Test return back to ${scenario}`, async ({
        loginPage,
        navigationItems,
        menuItems,
      }) => {
        await navigate({ navigationItems, menuItems });
        await menuItems.clickLogin();
        await loginPage.validatePageElementsVisible(true);
        await loginPage.validateNavigationBack(
          scenario,
          `${process.env.URL}${url}`
        );
      });
    }
  });

  test.describe('Login tests for GB - DEV', () => {

    test('Successful login with correct credentials', async ({ page }) => {

      await page.goto('https://grandzbet7.dev.inovadatabv.com/');

      await page.click('text=Log In');

      await page.fill('input[name="email"]', 'lmakedonska@sbtsolution.com');

      await page.fill('input[name="password"]', '123456Lorka@');

      await page.click('button[type="submit"]:has-text("Log In")');

      await expect(page.locator('button[type="button"]:has-text("Deposit")')).toBeVisible({ timeout: 10000 });
    });


    test('Successful login with correct credentials with "page.locator().FILL" ', async ({ page }) => {

      await page.goto('https://grandzbet7.dev.inovadatabv.com/');

      await page.click('text=Log In');

      await page.locator('input[name="email"]').fill('lmakedonska@sbtsolution.com');

      await page.locator('input[name="password"]').fill('123456Lorka@');

      await page.click('button[type="submit"]:has-text("Log In")');

      await expect(page.locator('button[type="button"]:has-text("Deposit")')).toBeVisible({ timeout: 10000 });
    });


    test('Unsuccessful login with valid email and empty password field', async ({ page }) => {

      await page.goto('https://grandzbet7.dev.inovadatabv.com/');

      await page.click('text=Log In');

      await page.locator('input[name="email"]').fill('lmakedonska@sbtsolution.com');

      await page.locator('input[name="password"]').fill('');

      await page.locator('form > button[type=submit]').click()

      await expect(page.locator('text=Password is required')).toBeVisible();

    });


    test('Unsuccessful login with valid email and wrong password', async ({ page }) => {

      await page.goto('https://grandzbet7.dev.inovadatabv.com/');

      await page.click('text=Log In');

      await page.locator('input[name="email"]').fill('lmakedonska@sbtsolution.com');

      await page.locator('input[name="password"]').fill('11222sss');

      await page.locator('form > button[type=submit]').click()

      await expect(page.locator('text=Invalid user credentials')).toBeVisible();

    });


    test('Unsuccessful login with empty email field', async ({ page }) => {

      await page.goto('https://grandzbet7.dev.inovadatabv.com/');

      await page.click('text=Log In');

      await page.locator('input[name="password"]').fill('123456Lorka@');

      await page.locator('button:has-text("Log In")').click();

      await expect(page.locator('text=Invalid email')).toBeVisible();

    });


    test('Show / Hide password button is working', async ({ page }) => {

      await page.goto('https://grandzbet7.dev.inovadatabv.com/');

      await page.click('text=Log In');

      await page.locator('input[name="email"]').fill('lmakedonska@sbtsolution.com');

      await page.locator('input[name="password"]').fill('123456Lorka@');

      const showPasswordIcon = page.locator('div.absolute.inset-y-0.right-0.flex.cursor-pointer svg');

      await showPasswordIcon.click();

      const passwordInput = page.locator('input[name="password"]');

      await expect(passwordInput).toHaveAttribute('type', 'text');

      await expect(passwordInput).toHaveValue('123456Lorka@');

      await showPasswordIcon.click();

      await expect(passwordInput).toHaveAttribute('type', 'password');

    });


    test('Successful login with correct credentials and click on ENTER button', async ({ page }) => {

      await page.goto('https://grandzbet7.dev.inovadatabv.com/');

      await page.click('text=Log In');

      await page.fill('input[name="email"]', 'lmakedonska@sbtsolution.com');

      await page.fill('input[name="password"]', '123456Lorka@');

      await page.keyboard.press('Enter');

      await expect(page.locator('button[type="button"]:has-text("Deposit")')).toBeVisible({ timeout: 10000 });

    });

    test('Successful login canselation through the Close button', async ({ page }) => {

      await page.goto('https://grandzbet7.dev.inovadatabv.com/');

      await page.click('text=Log In');

      await page.fill('input[name="email"]', 'lmakedonska@sbtsolution.com');

      await page.fill('input[name="password"]', '123456Lorka@');

      await page.click('text=Close');




    });

    test.describe('Forgot password', () => {

      test('Successfully send an email for forgotten password', async ({ page }) => {

        await page.goto('https://grandzbet7.dev.inovadatabv.com/');

        await page.click('text=Log In');

        await page.click('text=Reset password');

        await expect(page.getByText('Do you need help?')).toBeVisible();

        await page.fill('input[name="email"]', 'lmakedonska@sbtsolution.com');

        await page.click('text=Submit');

        await expect(page.getByText('An e-mail has been sent to you with instructions on how to reset your password.')).toBeVisible();

      });

      test('Empty email adress field and click on SUBMIT button', async ({ page }) => {

        await page.goto('https://grandzbet7.dev.inovadatabv.com/');

        await page.click('text=Log In');

        await page.click('text=Reset password');

        await expect(page.locator('text=Forgot Password?')).toBeVisible();

        await page.click('text=Submit');

        await expect(page.locator('text=Invalid email')).toBeVisible();


      });


    });


    test('Clicking Create Account opens registration form', async ({ page }) => {

      await page.goto('https://grandzbet7.dev.inovadatabv.com/');

      await page.click('text=Log In');

      await page.getByRole('button', { name: /Create Account/i }).click();

      await expect(page.locator('text=Register')).toBeVisible();

    });


    
  });

});