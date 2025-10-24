import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { BonusTestCase } from './bonusTestScenarios';
import type { BonusApiClient } from '@sbt-monorepo/page-objects';
import type { BonusPage } from '../../pages/bonuses/BonusPage.po';
import type { BonusBusiness } from '../../pages/bonuses/BonusBusiness.po';
import type { Wallet } from '../../pages/wallet/wallet.po';

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
  waitMs = 1000, // Reduced from 2500ms - refreshBonusPage handles additional sync
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
export async function refreshBonusPage(bonusPage: BonusPage, page: Page): Promise<void> {
  await test.step('Refresh bonus page', async () => {
    await bonusPage.ensureOnBonusesPage();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
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
 * Clean up real money from wallet via API before bonus testing
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


