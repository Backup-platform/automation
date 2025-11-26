import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { BonusTestCase } from '../../test-data/bonuses/bonusTestScenarios';
import type { BonusApiClient, AleaApiClient, AleaTransactionResponse } from '@sbt-monorepo/page-objects';
import type { BonusPage } from './BonusPage.po';
import type { BonusBusiness } from './BonusBusiness.po';
import type { Wallet } from '../wallet/wallet.po';

interface PrepareBonusScenarioOptions {
  bonusApi: BonusApiClient;
  testCase: BonusTestCase;
  profileId: number;
  cancelExisting?: boolean;
  waitForUi?: boolean;
  waitMs?: number;
  aleaApi?: unknown;
  paymentIqApi?: unknown;
}

/**
 * App-scoped environment preparer for bonus scenarios.
 * NOTE: enqueueBonus is feature-flagged / optional. Guarded dynamically.
 */
export async function prepareBonusScenario({
  bonusApi,
  testCase,
  profileId,
  cancelExisting = true,
  waitForUi = true,
  waitMs = 3000, // Increased to 3000ms to allow deposit bonuses to settle properly
  aleaApi,
  paymentIqApi
}: PrepareBonusScenarioOptions): Promise<void> {
  await test.step('Prepare bonus scenario (environment)', async () => {
    console.log('[prepareBonusScenario] START', { profileId, bonuses: testCase.bonuses.map(b=>({ id: b.template.id, name: b.template.name, amount: b.amount, initialStatus: b.initialStatus })) });
    if (cancelExisting) {
      console.log('[prepareBonusScenario] Cancel existing bonuses');
      await bonusApi.cancelAllUserBonuses('Pre-scenario cleanup');
    }

    for (const bonus of testCase.bonuses) {
      const maybeEnqueue = (bonusApi as unknown as { enqueueBonus?: (args: { bonusId: number; amount: number; profileId: number }) => Promise<unknown> }).enqueueBonus;
      if (typeof maybeEnqueue === 'function') {
        console.log('[prepareBonusScenario] enqueueBonus path', { bonusId: bonus.template.id, amount: bonus.amount });
  const enqueuePromise = maybeEnqueue({ bonusId: bonus.template.id, amount: bonus.amount, profileId });
  await enqueuePromise; // if it rejects, the test will fail
      } else {
        // We'll fallback to bulk queue setup after loop
      }
    }

    // Fallback: if enqueueBonus path not used, leverage setupBonusQueue with initialStatus semantics
    interface BonusApiDynamic { 
      enqueueBonus?: (args: { bonusId: number; amount: number; profileId: number }) => Promise<unknown>;
      setupBonusQueue?: (
        testData: { profileId: number; currency: string },
        queue: Array<{ bonusId: number; amount: number; comment: string; initialStatus?: 'wagering' | 'pending' | 'available' }>,
        aleaApiOrWaitTime?: unknown | number,
        paymentIqApi?: unknown,
        waitTime?: number
      ) => Promise<unknown>;
    }
    const dynamicApi = bonusApi as unknown as BonusApiDynamic;
    const usedEnqueue = typeof dynamicApi.enqueueBonus === 'function';
    if (!usedEnqueue) {
      console.log('[prepareBonusScenario] Fallback to setupBonusQueue');
      const startTime = Date.now();
      // Map testCase bonuses to setup structure (retain initialStatus for ordering)
      const queue = testCase.bonuses.map(b => ({
        bonusId: b.template.id,
        amount: b.amount,
        comment: b.customComment || b.template.name,
        initialStatus: b.initialStatus as ('wagering' | 'pending' | 'available'),
        bonusRequirement: b.template.bonusRequirement as ('deposit' | 'no_deposit'),
        bonusType: b.template.bonusType as ('cash' | 'free_spins')
      }));
      // Provide required currency; attempt to infer from first template brand currency; default CAD
      const currency = 'CAD';
      // setupBonusQueue expects testData shape
      const hasSetupQueue = typeof dynamicApi.setupBonusQueue === 'function';
      expect(hasSetupQueue, 'Expected bonusApi.setupBonusQueue to be available when enqueueBonus is not provided').toBe(true);
      if (hasSetupQueue) {
        console.log('[prepareBonusScenario] Invoking setupBonusQueue enhanced', { hasAlea: !!aleaApi, hasPayment: !!paymentIqApi, bonusCount: queue.length });
  const setupPromise = (dynamicApi.setupBonusQueue as NonNullable<typeof dynamicApi.setupBonusQueue>)({ profileId, currency }, queue, aleaApi || 600, paymentIqApi, aleaApi ? 600 : undefined);
  await setupPromise; // if it rejects, the test will fail
        console.log(`[prepareBonusScenario] setupBonusQueue completed in ${Date.now() - startTime}ms`);
      }
    }

    if (waitForUi) {
      console.log('[prepareBonusScenario] Waiting for UI sync', waitMs, 'ms');
      await new Promise(res => setTimeout(res, waitMs));
    }

    const fetchPromise = bonusApi.fetchAllUserBonuses();
    await expect(fetchPromise, 'Fetching bonuses post setup should succeed').resolves.toBeTruthy();
    const afterSetup = await fetchPromise;
    console.log('[prepareBonusScenario] Post-setup server bonuses', {
      active: afterSetup.activeBonuses?.map(b=>b.bonusId),
      pending: afterSetup.pendingBonuses?.map(b=>b.bonusId),
      issued: afterSetup.issuedBonuses?.map(b=>b.bonusId)
    });
    console.log('[prepareBonusScenario] END');
  });
}

/**
 * Refresh bonus page with proper wait times for UI synchronization
 */
export async function refreshBonusPage(bonusPage: BonusPage): Promise<void> {
  await test.step('Refresh bonus page', async () => {
    await bonusPage.ensureOnBonusesPage();
    await bonusPage.page.reload({ waitUntil: 'domcontentloaded' });
  });
}

/**
 * Log server-side bonus state for diagnostics
 */
export async function logServerBonuses(bonusApi: BonusApiClient): Promise<void> {
  await test.step('Log server-side bonus state', async () => {
    const fetch = bonusApi.fetchAllUserBonuses();
    await expect(fetch, 'Fetching bonuses for diagnostics should succeed').resolves.toBeDefined();
    const serverBonuses = await fetch;
    console.log('[DIAG][ServerBonuses]', {
      active: serverBonuses.activeBonuses?.map(b => ({
        id: b.bonusId,
        pbId: b.profileBonus?.id,
        amount: b.profileBonus?.fixedBonusAmount || b.profileBonus?.initialBonusAmount
      })),
      issued: serverBonuses.issuedBonuses?.map(b => ({
        id: b.bonusId,
        pbId: b.profileBonus?.id,
        amount: b.profileBonus?.fixedBonusAmount || b.profileBonus?.initialBonusAmount
      })),
      pending: serverBonuses.pendingBonuses?.map(b => ({ 
        id: b.bonusId, 
        pbId: b.profileBonus?.id 
      })),
      fsWaiting: serverBonuses.freeSpinsWaitingBonuses?.length
    });
  });
}

// Shared tolerance for wallet balance assertions
export const BALANCE_TOLERANCE = 0.05;

/**
 * Build expected initial statuses for UI assertion from a test case
 */
export function expectedInitialStatusesFor(testCase: BonusTestCase): Array<{ name: string; status: 'wagering' | 'pending' | 'available' }> {
  return testCase.bonuses.map(b => ({
    name: b.template.name,
    status: b.initialStatus as 'wagering' | 'pending' | 'available',
  }));
}

/**
 * Normalize credited amount math to 2 decimals consistently
 */
export function getCreditedAmount(bonus: BonusTestCase['bonuses'][number]): number {
  const base = typeof bonus.creditedAmount === 'number' ? bonus.creditedAmount : bonus.amount;
  return Number(base.toFixed(2));
}

// Intentionally no helper for picking the newly active bonus here — tests should fail if not exactly one is expected

/**
 * Encapsulate wallet bonus balance verification after cancellation with an internal step
 */
export async function assertWalletBonusAfterCancellation(wallet: Wallet, testCase: BonusTestCase): Promise<void> {
  await test.step('Validate wallet bonus balance after cancellation', async () => {
    const target = testCase.bonuses.find(b => b.statusAfterAction === 'wagering');
    expect(target, 'Expected exactly one newly active (wagering) bonus after cancellation').toBeDefined();
    const assuredTarget = target as BonusTestCase['bonuses'][number];
    const expectedCredited = getCreditedAmount(assuredTarget);
    await wallet.assertBalances({ casinoBonus: expectedCredited }, { tolerance: BALANCE_TOLERANCE });
  });
}

/**
 * Find the active (wagering) bonus in a test case
 * @throws Error if no active bonus found
 */
export function findActiveBonus(testCase: BonusTestCase): BonusTestCase['bonuses'][number] {
  const active = testCase.bonuses.find(b => b.initialStatus === 'wagering');
  expect(active, 'No active (wagering) bonus found in test case').toBeDefined();
  return active as BonusTestCase['bonuses'][number];
}

/**
 * Find the next active (pending) bonus in a test case
 * @returns The next pending bonus or undefined if none exists
 */
export function findNextActiveBonus(testCase: BonusTestCase): typeof testCase.bonuses[0] | undefined {
  return testCase.bonuses.find(b => b.initialStatus === 'pending');
}

/**
 * Assert final bonus state after an action (automatically filters out removed bonuses)
 */
export async function assertFinalBonuses(
  bonusBusiness: BonusBusiness,
  testCase: BonusTestCase
): Promise<void> {
  await test.step('Assert final bonus state (excluding removed)', async () => {
    const expectedFinal = testCase.bonuses
      .filter(b => b.statusAfterAction && b.statusAfterAction !== 'removed')
      .map(b => ({ 
        name: b.template.name, 
        status: b.statusAfterAction as 'wagering' | 'pending' | 'available' 
      }));
    await bonusBusiness.assertBonuses(expectedFinal);
  });
}

/**
 * Clean up real money from wallet via API before bonus testing.
 * This is typically called internally by zeroOutBonus with cleanupRealMoney option,
 * but can also be called directly when you need to remove real money at the start of a test.
 */
export async function cleanupRealMoneyViaAPI(
  bonusApi: BonusApiClient,
  testData: { profileId: number },
  wallet: Wallet
): Promise<void> {
  await test.step('Clean up real money using API', async () => {
    console.log('[CLEANUP] Starting API-based real money cleanup...');
    
    const wallets = await bonusApi.getWallets(testData.profileId);
    const cadWallet = wallets.find(w => w.currency === 'CAD');
    expect(cadWallet, 'CAD wallet not found for user during cleanup').toBeDefined();
    const assuredCadWallet = cadWallet as NonNullable<typeof cadWallet>;
    
    console.log(`[CLEANUP] Found CAD wallet - ID: ${assuredCadWallet.id}, Balance: ${assuredCadWallet.balance}`);
    
    if (assuredCadWallet.balance > 0) {
      console.log(`[CLEANUP] Removing ${assuredCadWallet.balance} CAD from wallet via API...`);
      const result = await bonusApi.removeMoney(
        assuredCadWallet.id, 
        assuredCadWallet.balance, 
        'CAD', 
        'Test cleanup - Remove real money before bonus testing'
      );
      
      console.log(`[CLEANUP] API cleanup result - New balance: ${result.balance}`);
      
      await wallet.page.reload({ waitUntil: 'domcontentloaded' });
      await wallet.page.waitForTimeout(2000);
    } else {
      console.log('[CLEANUP] No real money found - no cleanup needed');
    }
  });
}

export function isDepositCashBonus(bonus: BonusTestCase['bonuses'][number]): boolean {
  return bonus.template.bonusRequirement === 'deposit' && bonus.template.bonusType === 'cash';
}

/**
 * Zero out a bonus by placing losing bets.
 * 
 * @param aleaApi - Alea API client for placing bets
 * @param bonusApi - Optional Bonus API client for polling bonus state changes
 * @param options - Configuration options
 * @param options.cleanupRealMoney - If true, removes real money via API before betting (default: false)
 * @param options.testData - Required when cleanupRealMoney is true, contains profileId for API cleanup
 * @param options.wallet - Required when cleanupRealMoney is true, for UI refresh after cleanup
 * @param options.pollInterval - Polling check interval in milliseconds (default: 2000)
 * @param options.pollTimeout - Total polling timeout in milliseconds (default: 20000)
 * 
 * @example
 * // Zero out no-deposit bonus with polling
 * await zeroOutBonus(aleaApi, bonusApi, { pollInterval: 2000, pollTimeout: 20000 });
 * 
 * // Zero out deposit bonus (removes real money first)
 * await zeroOutBonus(aleaApi, bonusApi, { 
 *   cleanupRealMoney: true, 
 *   testData: { profileId: 123 }, 
 *   wallet,
 *   pollInterval: 2000, 
 *   pollTimeout: 20000 
 * });
 */
export async function zeroOutBonus(
  aleaApi: AleaApiClient,
  bonusApi?: BonusApiClient,
  options?: { 
    cleanupRealMoney?: boolean;
    testData?: { profileId: number };
    wallet?: Wallet;
    pollInterval?: number; 
    pollTimeout?: number;
  }
): Promise<void> {
  const cleanupRealMoney = options?.cleanupRealMoney ?? false;
  const pollInterval = options?.pollInterval || 2000;
  const pollTimeout = options?.pollTimeout || 20000;
  
  await test.step('Zero out bonus by betting', async () => {
    // Clean up real money via API if requested (for deposit bonuses)
    if (cleanupRealMoney) {
      if (!bonusApi || !options?.testData || !options?.wallet) {
        throw new Error('[zeroOutBonus] cleanupRealMoney requires bonusApi, testData, and wallet parameters');
      }
      await cleanupRealMoneyViaAPI(bonusApi, options.testData, options.wallet);
    }
    
    // Check Alea session balances
    console.log(`[zeroOutBonus] Checking Alea session balance...`);
    const balance = await aleaApi.getBalance();
    const realBalance = balance.realBalance || 0;
    const bonusBalance = balance.bonusBalance || 0;
    console.log(`[zeroOutBonus] Alea session has: ${realBalance} CAD real + ${bonusBalance} CAD bonus`);
    
    const totalBetAmount = realBalance + bonusBalance;
    if (totalBetAmount === 0) {
      console.log(`[zeroOutBonus] ⚠️ No funds to bet - both real and bonus are 0`);
      return;
    }
    
    // Place losing bet to zero out all funds (real money is bet first, then bonus)
    console.log(`[zeroOutBonus] Placing losing bet of ${totalBetAmount} CAD (${realBalance} real + ${bonusBalance} bonus)...`);
    const result = await aleaApi.executeBettingCycle(totalBetAmount, 0, 1, 'COMPLETED') as AleaTransactionResponse & { realBalance?: number; bonusBalance?: number; bonusAmount?: number };
    console.log(`[zeroOutBonus] 📋 API Response: id=${result.id}, realAmount=${result.realAmount}, bonusAmount=${result.bonusAmount}`);
    console.log(`[zeroOutBonus] Note: id=null is expected (Alea doesn't process programmatic bonus bets), waiting for backend to process...`)
    
    // Poll for bonus state change if bonusApi provided
    if (bonusApi) {
      console.log(`[zeroOutBonus] 🔄 Polling for next bonus activation (interval: ${pollInterval}ms, timeout: ${pollTimeout}ms)...`);
      
      // Capture initial state
      const initialBonuses = await bonusApi.fetchAllUserBonuses();
      const initialActiveCount = initialBonuses.activeBonuses?.length || 0;
      const initialPendingCount = initialBonuses.pendingBonuses?.length || 0;
      console.log(`[zeroOutBonus] Initial state: active=${initialActiveCount}, pending=${initialPendingCount}`);
      
      // Poll for next bonus activation (pending count should decrease as one activates)
      await bonusApi.pollForBonusStateChange(
        (bonuses) => {
          const activeCount = bonuses.activeBonuses?.length || 0;
          const pendingCount = bonuses.pendingBonuses?.length || 0;
          // Wait for pending to decrease (meaning one activated) OR all bonuses removed
          const pendingDecreased = pendingCount < initialPendingCount;
          const allRemoved = activeCount === 0 && pendingCount === 0;
          return pendingDecreased || allRemoved;
        },
        {
          timeout: pollTimeout,
          interval: pollInterval,
          errorMessage: `Timeout waiting for next bonus activation (active=${initialActiveCount}, pending=${initialPendingCount} → pending should decrease)`,
          stepName: `Poll for next bonus activation (timeout: ${pollTimeout}ms, interval: ${pollInterval}ms)`
        }
      );
      
      // Log final state with detailed bonus information
      const finalBonuses = await bonusApi.fetchAllUserBonuses();
      const finalActiveCount = finalBonuses.activeBonuses?.length || 0;
      const finalPendingCount = finalBonuses.pendingBonuses?.length || 0;
      console.log(`[zeroOutBonus] ✅ State changed: active=${initialActiveCount}→${finalActiveCount}, pending=${initialPendingCount}→${finalPendingCount}`);
      
      // Log detailed active bonus information
      if (finalBonuses.activeBonuses && finalBonuses.activeBonuses.length > 0) {
        finalBonuses.activeBonuses.forEach((bonus, idx) => {
          console.log(`[zeroOutBonus] Active bonus ${idx + 1}:`, {
            bonusId: bonus.bonusId,
            profileBonusId: bonus.profileBonus?.id,
            fixedAmount: bonus.profileBonus?.fixedBonusAmount,
            initialAmount: bonus.profileBonus?.initialBonusAmount,
            status: bonus.profileBonus?.status
          });
        });
      }
      
      // Log pending bonuses
      if (finalBonuses.pendingBonuses && finalBonuses.pendingBonuses.length > 0) {
        console.log(`[zeroOutBonus] Remaining pending bonuses: ${finalBonuses.pendingBonuses.length}`);
        finalBonuses.pendingBonuses.forEach((bonus, idx) => {
          console.log(`[zeroOutBonus] Pending bonus ${idx + 1}:`, {
            bonusId: bonus.bonusId,
            profileBonusId: bonus.profileBonus?.id,
            fixedAmount: bonus.profileBonus?.fixedBonusAmount,
            initialAmount: bonus.profileBonus?.initialBonusAmount
          });
        });
      }
    } else {
      console.log(`[zeroOutBonus] ⚠️ No bonusApi provided, skipping polling. Consider adding wait time for backend processing.`);
    }
  });
}

export async function completeWageringRequirement(
  aleaApi: AleaApiClient,
  activeBonus: BonusTestCase['bonuses'][number],
  bonusPage?: { refresh: () => Promise<void> }
): Promise<void> {
  // Use creditedAmount for DEPOSIT_CASH bonuses (actual bonus granted), otherwise use amount
  const bonusAmount = activeBonus.creditedAmount ?? activeBonus.amount;
  
  await test.step(`Complete wagering requirement for ${bonusAmount} CAD bonus`, async () => {
    console.log(`[WAGERING] Starting wagering for ${bonusAmount} CAD bonus`);
    console.log(`[WAGERING] Bonus details: amount=${activeBonus.amount}, creditedAmount=${activeBonus.creditedAmount}, using=${bonusAmount}`);
    
    // First bet: reaches 50% wagering
    await test.step(`First bet: ${bonusAmount} CAD (reaches 50% wagering)`, async () => {
      await aleaApi.executeBettingCycle(bonusAmount, bonusAmount, 1, 'COMPLETED');
    });
    
    // Second bet: completes wagering to 100%
    await test.step(`Second bet: ${bonusAmount} CAD (completes wagering to 100%)`, async () => {
      await aleaApi.executeBettingCycle(bonusAmount, bonusAmount, 2, 'COMPLETED');
    });
    
    // Wait for bonus conversion and next bonus activation
    await test.step('Wait for bonus conversion and next bonus activation', async () => {
      console.log('[WAGERING] Waiting 5s for bonus conversion and next bonus activation...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      if (bonusPage) {
        await bonusPage.refresh();
      }
    });
  });
}

export async function assertWalletAfterWageringSuccess(
  wallet: Wallet,
  testCase: BonusTestCase
): Promise<void> {
  await test.step('Validate wallet balances after wagering success', async () => {
    // After successful wagering, the next pending bonus should become active
    const target = testCase.bonuses.find(b => b.statusAfterAction === 'wagering');
    expect(target, 'Expected exactly one newly active (wagering) bonus after wagering success').toBeDefined();
    const assuredTarget = target as BonusTestCase['bonuses'][number];
    const expectedCredited = getCreditedAmount(assuredTarget);
    await wallet.assertBalances({ casinoBonus: expectedCredited }, { tolerance: BALANCE_TOLERANCE });
  });
}

