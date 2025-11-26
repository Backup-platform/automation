import test, { expect } from '../../../pages/base/base.po';
import { BonusTestScenarios } from '../../../test-data/bonuses';
import { 
  prepareBonusScenario,
  logServerBonuses,
  findActiveBonus,
  findNextActiveBonus,
  cleanupRealMoneyViaAPI,
  expectedInitialStatusesFor,
  assertFinalBonuses,
  assertWalletBonusAfterCancellation,
  isDepositCashBonus,
  zeroOutBonus,
  assertWalletAfterWageringSuccess,
  BALANCE_TOLERANCE
} from '../../../pages/bonuses/bonusTestUtilities';

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
  await bonusApi.ensureWalletBalance(testData.profileId, 0, { tolerance: BALANCE_TOLERANCE, commentPrefix: 'Post-test restore' });
  await page.waitForTimeout(2000);
});

test.afterAll(async ({ bonusApi }) => {
    await bonusApi.fetchAllUserBonuses();
});

test.describe('Bonus Teardown Utility', () => {
  test('Manual cleanup - Cancel all user bonuses', async ({ bonusApi }) => {
    await bonusApi.cancelAllUserBonuses('Manual cleanup');
  });
});

test.describe('Cancel Active Bonus Scenarios', () => {
  test.describe.configure({ timeout: 120000, mode: 'serial' });
  const cancelActiveTestCases = BonusTestScenarios.getCancelActiveBonusTests();

  for (const [index, testCase] of cancelActiveTestCases.entries()) {
    const testName = `Cancel Active Bonus Test ${index + 1} - ${testCase.bonuses.length} bonuses`;
    test(testName, async ({ bonusApi, testData, bonusPage, bonusBusiness, wallet, aleaApi, paymentIqApi }) => {
      
      await prepareBonusScenario({ bonusApi, testCase, profileId: testData.profileId, aleaApi, paymentIqApi });
      
      await bonusPage.refresh();
      await logServerBonuses(bonusApi);

      const active = findActiveBonus(testCase);

      await bonusBusiness.assertBonuses(expectedInitialStatusesFor(testCase));
      await bonusBusiness.cancelBonusByName(active.template.name, true);
      
      await assertFinalBonuses(bonusBusiness, testCase);
      
      await assertWalletBonusAfterCancellation(wallet, testCase);

    });
  }
});

test.describe('Zero Out Active Bonus Scenarios', () => {
  test.describe.configure({ timeout: 120000, mode: 'serial' });
  const zeroOutTestCases = BonusTestScenarios.getZeroOutActiveBonusTests();

  for (const [index, testCase] of zeroOutTestCases.entries()) {
    const testName = `Zero Out Active Bonus Test ${index + 1} - ${testCase.bonuses.length} bonuses`;
    test(testName, async ({ bonusApi, testData, aleaApi, bonusPage, bonusBusiness, wallet, paymentIqApi }) => {
      
      await prepareBonusScenario({ bonusApi, testCase, profileId: testData.profileId, aleaApi, paymentIqApi });
      await cleanupRealMoneyViaAPI(bonusApi, testData, wallet);
      await bonusPage.refresh();
      
      const activeBonus = findActiveBonus(testCase);
      const nextActiveBonus = findNextActiveBonus(testCase);
      
      await bonusBusiness.assertBonuses(expectedInitialStatusesFor(testCase));
      
      // Execute zero-out betting cycles
      await zeroOutBonus(aleaApi, bonusApi, { 
        cleanupRealMoney: isDepositCashBonus(activeBonus),
        testData,
        wallet,
        pollInterval: 2000, 
        pollTimeout: 20000 
      });

      await bonusPage.refresh();
      
      await assertFinalBonuses(bonusBusiness, testCase);
      
      // Use creditedAmount for deposit bonuses, amount for no-deposit bonuses
      const newActiveBonusAmount = nextActiveBonus?.creditedAmount ?? nextActiveBonus?.amount;
      expect(newActiveBonusAmount, 'Could not determine next active bonus amount from test setup').toBeDefined();
      
      await test.step('Validate wallet balances after zero out', async () => {
          const snapshot = await wallet.getSnapshot();
          // Numeric assertions are more robust than relying on formatted strings
          expect(snapshot.casinoBonus, 'Bonus amount after zero-out should match next active bonus amount').toBe(newActiveBonusAmount);
          expect(snapshot.real, 'Real money balance should be zero after zero-out').toBeCloseTo(0, 2);
      });
    });
  }
});

test.describe('Wagering Success Scenarios', () => {
  test.describe.configure({ timeout: 120000, mode: 'serial' });
  const wageringSuccessTestCases = BonusTestScenarios.getWageringSuccessTests();

  for (const [index, testCase] of wageringSuccessTestCases.entries()) {
    const testName = `Wagering Success Test ${index + 1} - ${testCase.bonuses.length} bonuses`;
    test(testName, async ({ bonusApi, testData, aleaApi, wallet, bonusBusiness, paymentIqApi, page }) => {
      
      await prepareBonusScenario({ bonusApi, testCase, profileId: testData.profileId, aleaApi, paymentIqApi });
      await cleanupRealMoneyViaAPI(bonusApi, testData, wallet);
      
      await bonusBusiness.assertBonuses(expectedInitialStatusesFor(testCase));

          const apiClient = aleaApi as {
            executeBettingCycle: (betAmount: number, winAmount: number | undefined, cycleNumber: number, roundStatus: string) => Promise<unknown>;
          };
          
          // First bet: reaches 50% wagering
          await test.step(`First bet: ${5} CAD (reaches 50% wagering)`, async () => {
          await apiClient.executeBettingCycle(5, 5, 1, 'COMPLETED');
          });
          
          // Second bet: completes wagering to 100%
          // await test.step(`Second bet: ${5} CAD (completes wagering to 100%)`, async () => {
          //   await apiClient.executeBettingCycle(5, 5, 2, 'COMPLETED');
          // });
      
      //await completeWageringRequirement(aleaApi, activeBonus, bonusPage);
          await page.waitForTimeout(10000);
          await test.step(`First bet: ${5} CAD (reaches 100% wagering)`, async () => {
          await apiClient.executeBettingCycle(5, 7.5, 1, 'COMPLETED');
          });
      //await assertFinalBonuses(bonusBusiness, testCase);
                await page.waitForTimeout(10000);
      await assertWalletAfterWageringSuccess(wallet, testCase);
    });
  }
});

test.describe('TBD Tests - Pending Developer Clarification', () => {
  test.skip('TBD1 - Pending Queue Formation', async () => {
    // Description: Test available bonus activation creating pending queue
    // Developer Question: How should we handle bonus activation UI? Auto-claim vs manual claim?
  });

  test.skip('TBD2 - Network error during activation', async () => {
    // Description: Test activation failure due to network issues
    // Developer Question: What happens when activation API call fails?
  });

  test.skip('TBD2 - Browser refresh during activation', async () => {
    // Description: Test page refresh during bonus activation
    // Developer Question: How does system handle refresh during state change?
  });

  test.skip('TBD3 - Multiple browser tabs with bonuses page', async () => {
    // Description: Test concurrent bonus page usage
    // Developer Question: How does system handle multiple active sessions or different browser tabs?
  });

  test.skip('TBD4 - Available bonus grant date ordering', async () => {
    // Description: Test correct ordering of available bonuses by grant date
    // Developer Question: Should this be UI test or API test?
  });

  test.skip('TBD5 - Progress bar edge values', async () => {
    // Description: Test 0% and 100% progress states display correctly
    // Developer Question: Are there any functional differences between different bonus types?
  });
});

