import test, { expect } from '../../../pages/base/base.po';
import { BONUS_TEMPLATES } from '../../../test-data/bonuses';
import { 
  logServerBonuses,
  refreshBonusPage,
  zeroOutBonus,
  BALANCE_TOLERANCE
} from '../../../pages/bonuses/bonusTestUtilities';

console.log(`[MODULE-LOAD] bonuses.spec.ts loaded at ${new Date().toISOString()}`);

test.beforeEach(async ({ page, menuItems, profileMenu, bonusApi, testData }) => {
  await bonusApi.cancelAllUserBonuses('Pre-test cleanup');
  await bonusApi.ensureWalletBalance(testData.profileId, 0, { tolerance: 0.01, commentPrefix: 'Pre-test baseline' });
  await page.waitForTimeout(1500);

  await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
  await menuItems.clickMyProfileButton();
  await profileMenu.clickMyBonusesButton();
});

test.afterEach(async ({ bonusApi, testData, page }) => {
  await bonusApi.cancelAllUserBonuses('Test teardown');
  await bonusApi.ensureWalletBalance(testData.profileId, 0, { tolerance: 0.01, commentPrefix: 'Post-test restore' });
  await page.waitForTimeout(2000);
});

test.describe('Activation and Cancellation Tests', () => {
  test.describe.configure({ timeout: 120000 });

  const activationCancellationScenarios = [
    {
      id: 'S1',
      description: 'Cash-NoDeposit',
      template: BONUS_TEMPLATES.NO_DEPOSIT_CASH,
      amount: 50,
      comment: BONUS_TEMPLATES.NO_DEPOSIT_CASH.name,
      initialStatus: 'wagering' as const,
      expectedBalanceAfterActivation: { casinoBonus: 50 },
      expectedBalanceAfterCancel: { casinoBonus: 0, real: 0 },
    },
    {
      id: 'S2',
      description: 'Cash-Deposit',
      template: BONUS_TEMPLATES.DEPOSIT_CASH,
      amount: 20,
      comment: BONUS_TEMPLATES.DEPOSIT_CASH.name,
      initialStatus: 'wagering' as const,
      expectedBalanceAfterActivation: { casinoBonus: 10, real: 20 }, // 50% of deposit
      expectedBalanceAfterCancel: { casinoBonus: 0, real: 20 },
    },
    {
      id: 'S3',
      description: 'Cash-NoDeposit (TODO: Should be FS-NoDeposit)',
      template: BONUS_TEMPLATES.NO_DEPOSIT_CASH,
      amount: 25,
      comment: BONUS_TEMPLATES.NO_DEPOSIT_CASH.name,
      initialStatus: 'wagering' as const,
      expectedBalanceAfterActivation: { casinoBonus: 25 },
      expectedBalanceAfterCancel: { casinoBonus: 0, real: 0 },
    },
    {
      id: 'S4',
      description: 'Cash-Deposit (TODO: Should be FS-Deposit)',
      template: BONUS_TEMPLATES.DEPOSIT_CASH,
      amount: 30,
      comment: BONUS_TEMPLATES.DEPOSIT_CASH.name,
      initialStatus: 'wagering' as const,
      expectedBalanceAfterActivation: { casinoBonus: 15, real: 30 }, // 50% of deposit
      expectedBalanceAfterCancel: { casinoBonus: 0, real: 30 },
    },
  ];

  for (const scenario of activationCancellationScenarios) {
    test(`${scenario.id} - ${scenario.description}`, async ({ testData, bonusBusiness, wallet}) => {
      await bonusBusiness.setupAndActivateBonus({ testData, scenario, waitTime: 3000 });

      await bonusBusiness.assertSingleActive(scenario.template.name);
      await wallet.assertBalances(scenario.expectedBalanceAfterActivation, { tolerance: BALANCE_TOLERANCE });

      await bonusBusiness.cancelBonusByName(scenario.template.name, true);
      await bonusBusiness.assertNoActiveBonus();
      await bonusBusiness.assertBonusNotVisibleAnywhere(scenario.template.name);

      await wallet.assertBalances(scenario.expectedBalanceAfterCancel, { tolerance: BALANCE_TOLERANCE });
    });
  }
});


test.describe('Additional Smoke Tests', () => {
  test.describe.configure({ timeout: 120000 });

  test('S5 - Tab navigation and content validation', async ({ testData, bonusBusiness }) => {
    const scenario = [
      { template: BONUS_TEMPLATES.NO_DEPOSIT_CASH, amount: 40, comment: 'Active Cash-NoDeposit', initialStatus: 'wagering' },
      { template: BONUS_TEMPLATES.NO_DEPOSIT_CASH, amount: 30, comment: 'Pending Cash-NoDeposit 1', initialStatus: 'pending' },
      { template: BONUS_TEMPLATES.NO_DEPOSIT_CASH, amount: 25, comment: 'Pending Cash-NoDeposit 2', initialStatus: 'pending' },
      { template: BONUS_TEMPLATES.NO_DEPOSIT_CASH, amount: 50, comment: 'Available Cash-NoDeposit 1', initialStatus: 'available' },
      { template: BONUS_TEMPLATES.DEPOSIT_CASH, amount: 20, comment: 'Available Cash-Deposit 2', initialStatus: 'available' },
      { template: BONUS_TEMPLATES.NO_DEPOSIT_CASH, amount: 35, comment: 'Available Cash-NoDeposit 3', initialStatus: 'available' }
    ];

    await bonusBusiness.setupAndActivateBonus({ testData, scenario, waitTime: 3000 });

    await bonusBusiness.validateCardCountInTab('active', 1);
    await bonusBusiness.validateCardCountInTab('pending', 2);
    await bonusBusiness.validateCardCountInTab('available', 3);
  });


  test('S6 - Wagering progress bar and percentage truncation', async ({ bonusBusiness, testData, aleaApi, bonusCard, bonusPage
  }) => {
    const scenario = {
      template: BONUS_TEMPLATES.DEPOSIT_CASH,
      amount: 60,
      comment: 'S6 - Progress bar',
      initialStatus: 'wagering' as const
    };

    await bonusBusiness.setupAndActivateBonus({ testData, scenario, waitTime: 3000 });
    await aleaApi.executeBettingCycle(scenario.amount / 3);
    await bonusPage.refresh();

    await bonusBusiness.assertSingleActive(scenario.template.name);

    await test.step('Validate progress bar and percentage truncation', async () => {
      const percentText = await bonusCard.getProgressPercentForActiveBonus();

      // Assert the text contains a percentage and the expected value structure
      expect(percentText).toMatch(/\d+\.?\d*% \([\d.]+ of [\d.]+\)/);

      // Extract and check the percentage value safely
      const percentMatch = percentText.match(/([\d.]+)%/);
      expect(percentMatch).not.toBeNull();
      const percent = percentMatch ? parseFloat(percentMatch[1]) : 0;
      expect(percent).toBeGreaterThanOrEqual(0);
      expect(percent).toBeLessThanOrEqual(100);

      // Optionally, check decimal places (max 2)
      const decimalPart = percentText.split('.')[1]?.split('%')[0];
      expect(!decimalPart || decimalPart.length <= 2).toBeTruthy();

      // Assert the SVG progress bar width matches the percentage (within 1%)
      const svgLocator = bonusCard.page.locator(
        '#profile-myBonuses div.rounded-2xl.bg-tertiary-secondary.p-4 svg[width="247"]'
      ).first();
      const svgHtml = await svgLocator.innerHTML();
      // Extract the d attribute for the colored path (the one with fill="url(...)")
      // Try to match both single and double quotes, and allow for attribute order/whitespace
      const coloredPathMatch = svgHtml.match(/<path[^>]*d=['"]([^'"]+)['"][^>]*fill=['"]url\([^)]+\)['"][^>]*>/)
        || svgHtml.match(/<path[^>]*fill=['"]url\([^)]+\)['"][^>]*d=['"]([^'"]+)['"][^>]*>/);
      expect(coloredPathMatch).not.toBeNull();
      const dAttr = coloredPathMatch ? (coloredPathMatch[1] || coloredPathMatch[2]) : '';
      // Extract the X value from the d attribute (e.g., ...H50... means width 50)
      const hMatch = dAttr.match(/H(\d+(?:\.\d+)?)/);
      expect(hMatch).not.toBeNull();
      const barWidth = hMatch ? parseFloat(hMatch[1]) : 0;
      // The full bar is 245 units (from H2 to H245 in the background path)
      const fullBarWidth = 245;
      const barPercent = (barWidth / fullBarWidth) * 100;
      // Compare to the percent from the text, allow +/- 1%
      expect(Math.abs(barPercent - percent)).toBeLessThanOrEqual(1);
    });
  });

  test.skip('S7 - Rapid clicking on Claim button', async ({ testData, bonusPage, bonusBusiness }) => {
    const scenario = { template: BONUS_TEMPLATES.NO_DEPOSIT_CASH, amount: 30, comment: 'Rapid clicking test' };

    await bonusBusiness.setupAndActivateBonus({
      testData,
      scenario,
      waitTime: 3000
    });

    await test.step('Rapidly click Claim button 5+ times', async () => {
      // TODO: Implement rapid clicking test
      // - Find the Claim button
      // - Click it 5-10 times rapidly
      // - Verify only one bonus activation occurred
      // - Check that duplicate API calls were prevented
    });

    await test.step('Verify: Only one activation occurred', async () => {
      await bonusPage.refresh();
      await bonusBusiness.assertBonuses([{ name: scenario.template.name, status: 'wagering' }]);
    });
  });

  test('Zero out bonus by betting - verify pending activates', async ({ bonusApi, testData, aleaApi, wallet, bonusPage, bonusBusiness 
  }) => {

    const scenario = [
      {
        template: BONUS_TEMPLATES.NO_DEPOSIT_CASH,
        amount: 40,
        initialStatus: 'wagering',
        comment: 'Active Cash-NoDeposit'
      },
      {
        template: BONUS_TEMPLATES.NO_DEPOSIT_CASH,
        amount: 30,
        initialStatus: 'pending',
        comment: 'Pending Cash-NoDeposit'
      }
    ];

    await bonusBusiness.setupAndActivateBonus({ testData, scenario, waitTime: 1000 });

    await bonusBusiness.validateCardCountInTab('active', 1);
    await bonusBusiness.validateCardCountInTab('pending', 1);

    await wallet.assertBalances({ casinoBonus: 40, real: 0 }, { tolerance: BALANCE_TOLERANCE });

    await test.step('Zero out active bonus by betting all funds', async () => {
      await zeroOutBonus(aleaApi, bonusApi, { cleanupRealMoney: true, testData, wallet, pollInterval: 2000, pollTimeout: 20000 });
      await refreshBonusPage(bonusPage);
      await logServerBonuses(bonusApi);
    });

    await bonusBusiness.validateCardCountInTab('active', 1);
    await bonusBusiness.validateCardCountInTab('pending', 0);

    await wallet.assertBalances({ casinoBonus: 30, real: 0 }, { tolerance: BALANCE_TOLERANCE });
  });

});
