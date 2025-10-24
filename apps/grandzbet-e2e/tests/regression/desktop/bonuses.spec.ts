import test, { expect } from '../../../pages/base/base.po';
import { BonusTestScenarios } from '../../../test-data/bonuses';
import { 
  prepareBonusScenario,
  refreshBonusPage,
  logServerBonuses,
  findActiveBonus,
  findNextActiveBonus,
  assertFinalBonuses,
  cleanupRealMoneyViaAPI,
  expectedInitialStatusesFor,
  assertWalletBonusAfterCancellation,
  BALANCE_TOLERANCE
} from '../../../test-data/bonuses/bonusTestUtilities';
import type { Page } from '@playwright/test';

interface MenuPageObjects {
  clickMyProfileButton(): Promise<void>;
}

interface ProfileMenuPageObjects {
  clickMyBonusesButton(): Promise<void>;
}

async function navigateToMyBonuses(
  page: Page, 
  menuItems: MenuPageObjects, 
  profileMenu: ProfileMenuPageObjects
): Promise<void> {
  await test.step('Navigate to My Bonuses section', async () => {
    await menuItems.clickMyProfileButton();
    await profileMenu.clickMyBonusesButton();
    await page.waitForTimeout(2500);
  });
}

test.beforeEach(async ({ page, menuItems, profileMenu, bonusApi, testData }) => {
  // Cleanup bonuses before test
  await bonusApi.cancelAllUserBonuses('Pre-test cleanup');
  // Normalize wallet to 0 baseline for test isolation
  await bonusApi.ensureWalletBalance(testData.profileId, 0, { tolerance: 0.01, commentPrefix: 'Pre-test baseline' });
  await page.waitForTimeout(1500);

  await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
  await menuItems.clickMyProfileButton();
  await profileMenu.clickMyBonusesButton();
});

test.afterEach(async ({ bonusApi, testData, page }) => {
  // Cancel any leftover bonuses
  await bonusApi.cancelAllUserBonuses('Test teardown');
  // Restore wallet to clean state for next test
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
  test.describe.configure({ timeout: 120000 });
  const cancelActiveTestCases = BonusTestScenarios.getCancelActiveBonusTests();

  for (const [index, testCase] of cancelActiveTestCases.entries()) {
    const testName = `Cancel Active Bonus Test ${index + 1} - ${testCase.bonuses.length} bonuses`;
    test(testName, async ({ bonusApi, testData, page, bonusPage, bonusBusiness, wallet, aleaApi, paymentIqApi }) => {
      
      await prepareBonusScenario({ bonusApi, testCase, profileId: testData.profileId, aleaApi, paymentIqApi });
      await refreshBonusPage(bonusPage, page);
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
  const zeroOutTestCases = BonusTestScenarios.getZeroOutActiveBonusTests();

  for (const [index, testCase] of zeroOutTestCases.entries()) {
    const testName = `Zero Out Active Bonus Test ${index + 1} - ${testCase.bonuses.length} bonuses`;
    test(testName, async ({ bonusApi, testData, aleaApi, paymentIqApi, page, bonusPage, bonusBusiness, wallet }) => {
      test.setTimeout(120000);
      
      await prepareBonusScenario({ bonusApi, testCase, profileId: testData.profileId, aleaApi, paymentIqApi });
      await cleanupRealMoneyViaAPI(bonusApi, testData, wallet);
      await refreshBonusPage(bonusPage, page);
      
      await bonusBusiness.assertBonuses(
        testCase.bonuses.map(b => ({ name: b.template.name, status: b.initialStatus as 'wagering' | 'pending' | 'available' }))
      );
      
      const activeBonus = findActiveBonus(testCase);
      const nextActiveBonus = findNextActiveBonus(testCase);
      const expectedActiveBonusAmount = activeBonus.amount;
      const newActiveBonusAmount = nextActiveBonus?.amount;
      
      if (!newActiveBonusAmount) {
        throw new Error('Could not determine next active bonus amount from test setup');
      }
      
      const isDepositCashBonus = activeBonus.template.bonusRequirement === 'deposit' && activeBonus.template.bonusType === 'cash';
      
      if (isDepositCashBonus) {
        await test.step(`Zero out deposit cash bonus: 10 real + ${expectedActiveBonusAmount} bonus`, async () => {
          await aleaApi.executeBettingCycle(10, undefined, 1, 'COMPLETED');
          await aleaApi.executeBettingCycle(expectedActiveBonusAmount, undefined, 2, 'COMPLETED');
        });
      } else {
        await aleaApi.executeBettingCycle(expectedActiveBonusAmount, undefined, 1, 'COMPLETED');
      }

      await page.waitForTimeout(3750);

      await bonusPage.goto();
      await bonusPage.page.reload();
      await page.waitForTimeout(3750);
      
      await assertFinalBonuses(bonusBusiness, testCase);
      
      await test.step('Validate wallet balances after zero out', async () => {
        await bonusPage.goto();
        await bonusPage.page.reload();
        
        const bonusBalance = await wallet.getBonusFromDropdown();
        const realMoneyBalance = await wallet.getRealMoneyFromDropdown();
        const expectedBonusFormats = [
          `${newActiveBonusAmount}.00 CAD`,  // Canadian Dollar format
          `€${newActiveBonusAmount}.00`,     // Euro format with amount
          `${newActiveBonusAmount}.00 €`,    // Euro format (amount first)
          `${newActiveBonusAmount} CAD`,     // Without .00
          `€${newActiveBonusAmount}`,        // Euro without .00
        ];
        
        const bonusMatches = expectedBonusFormats.some(format => bonusBalance === format);
        
        expect(bonusMatches, 
          `Expected bonus balance to be ${newActiveBonusAmount} in some currency format, but got: "${bonusBalance}"`
        ).toBe(true);
        
        expect(realMoneyBalance).toMatch(/0\.00|€0\.00/);
      });
    });
  }
});

test.describe('Wagering Success Scenarios', () => {
  const wageringSuccessTestCases = BonusTestScenarios.getWageringSuccessTests();

  for (const [index, testCase] of wageringSuccessTestCases.entries()) {
    const testName = `Wagering Success Test ${index + 1} - ${testCase.bonuses.length} bonuses`;
    test(testName, async ({ bonusApi, testData, aleaApi, page, bonusPage, wallet }) => {
      await prepareBonusScenario({ bonusApi, testCase, profileId: testData.profileId, aleaApi, paymentIqApi: undefined });
      await cleanupRealMoneyViaAPI(bonusApi, testData, wallet);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      
      const initialRealMoney = await wallet.getRealMoneyBalanceValue();
      const initialBonusBalance = await wallet.getCasinoBonusBalanceValue();
      const initialTotalBalance = await wallet.getTotalFromDropdown();
      const activeBonusAmount = testCase.bonuses[0].amount;
      await test.step(`Complete wagering requirement for ${activeBonusAmount} CAD bonus`, async () => {
        const firstBet = Math.floor(activeBonusAmount / 2);
        const firstWin = firstBet * 2;
        await aleaApi.executeBettingCycle(firstBet, firstWin, 1, 'COMPLETED');
        const secondBet = activeBonusAmount - firstBet + firstWin;
        const secondWin = secondBet;
        await aleaApi.executeBettingCycle(secondBet, secondWin, 2, 'COMPLETED');
      });
      
      await bonusPage.goto();
      const finalRealMoney = await wallet.getRealMoneyBalanceValue();
      const finalBonusBalance = await wallet.getCasinoBonusBalanceValue();
      const finalTotalBalance = await wallet.getTotalFromDropdown();
      
      // Convert string balances to numbers for comparison
      const initialRealMoneyNum = parseFloat(initialRealMoney);
      const initialBonusBalanceNum = parseFloat(initialBonusBalance);
      const initialTotalBalanceNum = parseFloat(initialTotalBalance);
      const finalRealMoneyNum = parseFloat(finalRealMoney);
      const finalBonusBalanceNum = parseFloat(finalBonusBalance);
      const finalTotalBalanceNum = parseFloat(finalTotalBalance);
      
      // For wagering success: bonus amount should be converted to real money
      // Real money should increase by the wagered bonus amount
      const expectedFinalRealMoney = initialRealMoneyNum + activeBonusAmount;
      await expect(finalRealMoneyNum, `Real money should increase by ${activeBonusAmount} after wagering success`).toBe(expectedFinalRealMoney);
      
      // Bonus balance should decrease by the wagered amount (bonus completed)
      const expectedFinalBonusBalance = initialBonusBalanceNum - activeBonusAmount;
      await expect(finalBonusBalanceNum, `Bonus balance should decrease by ${activeBonusAmount} after completion`).toBe(expectedFinalBonusBalance);
      
      // Total balance should remain the same (bonus converted to real money)
      await expect(finalTotalBalanceNum, 'Total balance should remain unchanged after wagering success').toBe(initialTotalBalanceNum);

      // Action: Complete wagering on active bonus
      // Expected Result: Active bonus disappears, next pending becomes active, queue shifts up
      // Validation: Specific wallet amounts (win), transition type validation
    });
  }
});

test.describe('Pending Queue Formation Tests', () => {
  const pendingQueueTestCases = BonusTestScenarios.getPendingQueueTests();

  for (const testCase of pendingQueueTestCases) {
    test(`${testCase.testId} - ${testCase.description}`, async ({ bonusApi, testData, page, menuItems, profileMenu }) => {
      const transformedActiveBonus = {
        bonusId: testCase.activeBonus.bonus.id,
        amount: testCase.activeBonus.amount,
        comment: testCase.activeBonus.comment
      };
      
      const transformedPendingBonus = {
        bonusId: testCase.pendingBonus.bonus.id,
        amount: testCase.pendingBonus.amount,
        comment: testCase.pendingBonus.comment
      };
      
      await bonusApi.setupTwoBonusScenario(testData, transformedActiveBonus, transformedPendingBonus);
      await page.waitForTimeout(2000);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      
      // Navigate to My Bonuses page
      await navigateToMyBonuses(page, menuItems, profileMenu);
      
      // Action: Activate available bonus (test implementation needed)
      // TODO: Implement bonus activation UI interaction
      
      // Expected Result: Active bonus stays active, available bonus becomes pending
      // Validation: Pending tab appearance, disabled Cancel button, warning message, All tab ordering
    });
  }
});

test.describe('TBD Tests - Pending Developer Clarification', () => {
  test.skip('TBD1 - Network error during activation', async () => {
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

test.describe('API Validation Tests', () => {
  test('Validate Get Wallets API', async ({ bonusApi, testData }) => {
    test.setTimeout(60000);
    
    console.log('=== GET WALLETS API VALIDATION ===');
    
    // Step 1: Get user wallets
    console.log('Step 1: Getting user wallets...');
    const wallets = await bonusApi.getWallets(testData.profileId);
    console.log('Wallets found:', JSON.stringify(wallets, null, 2));
    
    // Verify we got at least one wallet
    if (wallets.length === 0) {
      throw new Error('No wallets found for user');
    }
    
    console.log(`✓ Found ${wallets.length} wallet(s)`);
    
    // Verify wallet structure
    for (const wallet of wallets) {
      if (typeof wallet.id !== 'number') {
        throw new Error(`Invalid wallet ID: ${wallet.id}`);
      }
      if (typeof wallet.balance !== 'number') {
        throw new Error(`Invalid wallet balance: ${wallet.balance}`);
      }
      if (typeof wallet.currency !== 'string') {
        throw new Error(`Invalid wallet currency: ${wallet.currency}`);
      }
      console.log(`✓ Wallet ${wallet.id}: ${wallet.balance} ${wallet.currency}`);
    }
    
    console.log('=== GET WALLETS API VALIDATION COMPLETE ===');
  });

  test('Validate Transfer Money API', async ({ bonusApi, testData }) => {
    test.setTimeout(60000);
    
    console.log('=== TRANSFER MONEY API VALIDATION ===');
    
    // Step 1: Get user wallets to find the CAD wallet
    console.log('Step 1: Getting user wallets...');
    const wallets = await bonusApi.getWallets(testData.profileId);
    console.log('Wallets found:', JSON.stringify(wallets, null, 2));
    
    // Find CAD wallet
    const cadWallet = wallets.find(wallet => wallet.currency === 'CAD');
    if (!cadWallet) {
      throw new Error('CAD wallet not found for user');
    }
    
    console.log(`Found CAD wallet: ID=${cadWallet.id}, Balance=${cadWallet.balance}`);
    const initialBalance = cadWallet.balance;
    
    // Step 2: Add 10 CAD to the wallet
    console.log('Step 2: Adding 10 CAD to wallet...');
    const addResult = await bonusApi.addMoney(cadWallet.id, 10, 'CAD', 'API Test - Add money');
    console.log('Add money result:', JSON.stringify(addResult, null, 2));
    
    // Verify balance increased
    const expectedBalanceAfterAdd = initialBalance + 10;
    if (addResult.balance !== expectedBalanceAfterAdd) {
      throw new Error(`Expected balance ${expectedBalanceAfterAdd} after adding money, but got ${addResult.balance}`);
    }
    console.log(`✓ Balance correctly increased to ${addResult.balance}`);
    
    // Step 3: Remove 5 CAD from the wallet
    console.log('Step 3: Removing 5 CAD from wallet...');
    const removeResult = await bonusApi.removeMoney(cadWallet.id, 5, 'CAD', 'API Test - Remove money');
    console.log('Remove money result:', JSON.stringify(removeResult, null, 2));
    
    // Verify balance decreased
    const expectedBalanceAfterRemove = expectedBalanceAfterAdd - 5;
    if (removeResult.balance !== expectedBalanceAfterRemove) {
      throw new Error(`Expected balance ${expectedBalanceAfterRemove} after removing money, but got ${removeResult.balance}`);
    }
    console.log(`✓ Balance correctly decreased to ${removeResult.balance}`);
    
    // Step 4: Clean up - remove the remaining 5 CAD to restore original balance
    console.log('Step 4: Cleaning up - restoring original balance...');
    const cleanupResult = await bonusApi.removeMoney(cadWallet.id, 5, 'CAD', 'API Test - Cleanup');
    console.log('Cleanup result:', JSON.stringify(cleanupResult, null, 2));
    
    // Verify balance is back to original
    if (cleanupResult.balance !== initialBalance) {
      console.warn(`Warning: Balance not fully restored. Expected ${initialBalance}, got ${cleanupResult.balance}`);
    } else {
      console.log(`✓ Balance successfully restored to original ${cleanupResult.balance}`);
    }
    
    console.log('=== TRANSFER MONEY API VALIDATION COMPLETE ===');
  });
});
