/**
 * @fileoverview Bonus regression tests with API setup and teardown
 * 
 * This test suite validates bonus queue management scenarios using API setup for test data.
 * Each test uses the BonusApiFactory to grant specific bonuses that create the required
 * prerequisites for testing various bonus state transitions.
 * 
 * Test Categories:
 * - R1-R4: Cancel Active Bonus Scenarios (cross-type and same-category transitions)
 * - R5-R8: Zero Out Active Bonus Scenarios (wallet amount losses)
 * - R9-R12: Wagering Success Scenarios (wallet amount wins)
 * - R13-R16: Pending Queue Formation Tests (activation behaviors)
 * 
 * Bonus Cleanup:
 * - Automatic: test.afterAll() cancels all bonuses after the entire suite completes
 * - Manual: Run "Manual cleanup - Cancel all user bonuses" test independently for cleanup
 * 
 * Bonus IDs: Uses real bonus IDs (1770616, 1770618, 1770619, 1770764) mapped to 4 bonus types:
 * - DEPOSIT_FREE_SPINS: 1770619, NO_DEPOSIT_FREE_SPINS: 1770618
 * - DEPOSIT_CASH: 1770616, NO_DEPOSIT_CASH: 1770764
 * Test data setup includes descriptive comments for easy debugging and identification.
 */

import test from '../../../pages/base/base.po';
import { BonusApiClient, AleaApiClient } from '@sbt-monorepo/page-objects';
import type { Page } from '@playwright/test';
//TODO: test where we have initial cash and bonus - so the bonus amount does not change when winning/ losing.
interface TestData {
  bonusId: number;
  profileId: number;
  bonusAmount: number;
  profileBonusId: string;
  currency: string;
  comment: string;
}

interface BonusTestCase {
  testId: string;
  description: string;
  bonusSetup: Array<{ 
    bonus: typeof BONUS_IDS[keyof typeof BONUS_IDS]; 
    amount: number; 
    comment: string; 
    initialStatus: 'wagering' | 'pending' | 'available';
    statusAfterAction?: 'wagering' | 'pending' | 'available' | 'removed';
  }>;
  transitionType?: string;
}

/**
 * Standardized Bonus ID Mapping
 * Real bonus IDs for testing - just the 4 basic types
 */
const BONUS_IDS = {
  DEPOSIT_FREE_SPINS: { id: 1770619, name: 'Deposit Free Spins' },
  NO_DEPOSIT_FREE_SPINS: { id: 1770618, name: 'No Deposit Free Spins' },
  DEPOSIT_CASH: { id: 1770616, name: 'Deposit Cash Bonus' },
  NO_DEPOSIT_CASH: { id: 1770764, name: 'No Deposit Cash Bonus' }
} as const;



/**
 * Complete wagering by making multiple bets with wins to build up balance
 * Since account has 0 real money, we can only bet using bonus money initially
 */
async function completeWagering(aleaApi: AleaApiClient, bonusAmount: number): Promise<void> {
  // First bet: Bet half the bonus amount and win to build up balance
  const firstBet = Math.floor(bonusAmount / 2);
  const firstWin = firstBet * 2; // Win double what we bet
  await aleaApi.executeBettingCycle(firstBet, firstWin, 1, 'COMPLETED');
  
  // Second bet: Bet remaining amount to complete wagering
  const secondBet = bonusAmount - firstBet + firstWin;
  const secondWin = secondBet; // Win same amount to complete successfully
  await aleaApi.executeBettingCycle(secondBet, secondWin, 2, 'COMPLETED');
}

/**
 * Interface for menu page objects with proper typing
 */
interface MenuPageObjects {
  clickMyProfileButton(): Promise<void>;
}

interface ProfileMenuPageObjects {
  clickMyBonusesButton(): Promise<void>;
}

/**
 * Helper function to navigate to My Bonuses page
 * @param page - Page context 
 * @param menuItems - Menu items page object
 * @param profileMenu - Profile menu page object
 */
async function navigateToMyBonuses(
  page: Page, 
  menuItems: MenuPageObjects, 
  profileMenu: ProfileMenuPageObjects
): Promise<void> {
  await menuItems.clickMyProfileButton();
  await profileMenu.clickMyBonusesButton();
  await page.waitForTimeout(10000);
}

/**
 * Helper function to setup a complete test environment
 * @param request - API request context
 * @param testData - Test configuration data
 * @param page - Page context
 * @param menuItems - Menu items page object
 * @param profileMenu - Profile menu page object
 * @returns Object containing initialized API clients
 */
async function setupTestEnvironment(
  bonusApi: BonusApiClient,
  testData: TestData,
  aleaApi: AleaApiClient,
  testCase: BonusTestCase,
  page: Page
) {
  // Transform the new bonus format to the old format for the API client
  const transformedBonusSetup = testCase.bonusSetup.map(bonus => ({
    bonusId: bonus.bonus.id,
    amount: bonus.amount,
    comment: bonus.comment
  }));
  
  // Setup bonus queue using API client method
  await bonusApi.setupBonusQueue(testData, transformedBonusSetup);
  
  // Wait for page operations to complete
  await page.waitForTimeout(1000);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  // Navigate to My Bonuses page
  //await navigateToMyBonuses(page, menuItems, profileMenu);
  
  return { aleaApi };
}

test.beforeEach(async ({ page, menuItems, profileMenu }) => {
  await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
  await menuItems.clickMyProfileButton();
  await profileMenu.clickMyBonusesButton();
});

test.afterEach(async ({ bonusApi }) => {
  await bonusApi.cancelAllUserBonuses('Test teardown');
});

test.afterAll(async ({ bonusApi }) => {
  try {
    const allBonuses = await bonusApi.fetchAllUserBonuses();
    
    const counts = {
      active: allBonuses.activeBonuses?.length || 0,
      pending: allBonuses.pendingBonuses?.length || 0,
      issued: allBonuses.issuedBonuses?.length || 0,
      freeSpins: allBonuses.freeSpinsWaitingBonuses?.length || 0
    };
    
    const totalRemaining = counts.active + counts.pending + counts.issued + counts.freeSpins;
    
    if (totalRemaining > 0) {
      console.log(`Found ${totalRemaining} remaining bonuses on account`);
      console.log(`Active: ${counts.active}, Pending: ${counts.pending}, Issued: ${counts.issued}, Free Spins: ${counts.freeSpins}`);
    }
  } catch {
    // Silent failure for final check
  }
});

test.describe('Bonus Teardown Utility', () => {
  test('Manual cleanup - Cancel all user bonuses', async ({ bonusApi }) => {
    await bonusApi.cancelAllUserBonuses('Manual cleanup');
  });
});

test.describe('Cancel Active Bonus Scenarios', () => {
  const cancelActiveTestCases = [
    {
      testId: 'R1',
      description: 'Cancel FS-NoDeposit → Cash-Deposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 20, 
          comment: 'R1 - Active FS-NoDeposit bonus to be Canceled',
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH, 
          amount: 50, 
          comment: 'R1 - Pending Cash-Deposit bonus becomes Active',
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 30, 
          comment: 'R1 - Pending FS-Deposit bonus stays Pending Position 1',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 40, 
          comment: 'R1 - Pending Cash-NoDeposit bonus stays Pending Position 2',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'cross-type'
    },
    {
      testId: 'R2',
      description: 'Cancel FS-Deposit → FS-NoDeposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 25, 
          comment: 'R2 - Active FS-Deposit bonus to be Canceled',
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 15, 
          comment: 'R2 - Pending FS-NoDeposit bonus becomes Active',
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 35, 
          comment: 'R2 - Pending Cash-NoDeposit bonus stays Pending Position 1',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH, 
          amount: 45, 
          comment: 'R2 - Pending Cash-Deposit bonus stays Pending Position 2',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'same-category'
    },
    {
      testId: 'R3',
      description: 'Cancel Cash-NoDeposit → FS-Deposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 60, 
          comment: 'R3 - Active Cash-NoDeposit bonus to be Canceled',
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 30, 
          comment: 'R3 - Pending FS-Deposit bonus becomes Active',
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH, 
          amount: 70, 
          comment: 'R3 - Pending Cash-Deposit bonus stays Pending Position 1',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 20, 
          comment: 'R3 - Pending FS-NoDeposit bonus stays Pending Position 2',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'cross-type'
    },
    {
      testId: 'R4',
      description: 'Cancel Cash-Deposit → Cash-NoDeposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH, 
          amount: 80, 
          comment: 'R4 - Active Cash-Deposit bonus to be Canceled',
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 40, 
          comment: 'R4 - Pending Cash-NoDeposit bonus becomes Active',
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 25, 
          comment: 'R4 - Pending FS-NoDeposit bonus stays Pending Position 1',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 35, 
          comment: 'R4 - Pending FS-Deposit bonus stays Pending Position 2',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'same-category'
    }
  ];

  for (const testCase of cancelActiveTestCases) {
    test(`${testCase.testId} - ${testCase.description}`, async ({ bonusApi, testData, aleaApi, page, bonuses }) => {
      // Setup test environment
      await setupTestEnvironment(bonusApi, testData, aleaApi, testCase, page);
      
      // Action: Cancel active bonus via UI
      // TODO: Implement cancel bonus UI interaction
      
      // Navigate back to verify results
      await bonuses.navigateToMyBonuses();
      
      // Expected Result: Active bonus disappears, next pending becomes active, queue shifts up
      // Validation: Specific wallet amounts, transition type validation, queue reordering
    });
  }
});

test.describe.only('Zero Out Active Bonus Scenarios', () => {
  const zeroOutTestCases = [
    // {
    //   testId: 'R5',
    //   description: 'Zero out FS-NoDeposit → FS-Deposit becomes active',
    //   bonusSetup: [
    //     { bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, amount: 50, comment: 'R5 - Active FS-NoDeposit bonus to be Zeroed' },
    //     { bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, amount: 75, comment: 'R5 - Pending FS-Deposit bonus becomes Active after zero out' },
    //     { bonus: BONUS_IDS.NO_DEPOSIT_CASH, amount: 60, comment: 'R5 - Pending Cash-NoDeposit bonus stays Pending Position 1' },
    //     { bonus: BONUS_IDS.DEPOSIT_CASH, amount: 85, comment: 'R5 - Pending Cash-Deposit bonus stays Pending Position 2' }
    //   ],
    //   transitionType: 'same-category'
    // },
    // {
    //   testId: 'R6',
    //   description: 'Zero out FS-Deposit → Cash-NoDeposit becomes active',
    //   bonusSetup: [
    //     { bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, amount: 45, comment: 'R6 - Active FS-Deposit bonus to be Zeroed' },
    //     { bonus: BONUS_IDS.NO_DEPOSIT_CASH, amount: 55, comment: 'R6 - Pending Cash-NoDeposit bonus becomes Active after zero out' },
    //     { bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, amount: 30, comment: 'R6 - Pending FS-NoDeposit bonus stays Pending Position 1' },
    //     { bonus: BONUS_IDS.DEPOSIT_CASH, amount: 70, comment: 'R6 - Pending Cash-Deposit bonus stays Pending Position 2' }
    //   ],
    //   transitionType: 'cross-type'
    // },
    // {
    //   testId: 'R7',
    //   description: 'Zero out Cash-NoDeposit → Cash-Deposit becomes active',
    //   bonusSetup: [
    //     { bonus: BONUS_IDS.NO_DEPOSIT_CASH, amount: 45, comment: 'R7 - Active Cash-NoDeposit bonus to be Zeroed' },
    //     { bonus: BONUS_IDS.DEPOSIT_CASH, amount: 100, comment: 'R7 - Pending Cash-Deposit bonus becomes Active after zero out' },
    //     { bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, amount: 40, comment: 'R7 - Pending FS-Deposit bonus stays Pending Position 1' },
    //     { bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, amount: 35, comment: 'R7 - Pending FS-NoDeposit bonus stays Pending Position 2' }
    //   ],
    //   transitionType: 'same-category'
    // },
    // {
    //   testId: 'R8',
    //   description: 'Zero out Cash-Deposit → FS-NoDeposit becomes active',
    //   bonusSetup: [
    //     { bonus: BONUS_IDS.DEPOSIT_CASH, amount: 120, comment: 'R8 - Active Cash-Deposit bonus to be Zeroed' },
    //     { bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, amount: 25, comment: 'R8 - Pending FS-NoDeposit bonus becomes Active after zero out' },
    //     { bonus: BONUS_IDS.DEPOSIT_CASH, amount: 80, comment: 'R8 - Pending Cash-Deposit bonus stays Pending Position 1' },
    //     { bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, amount: 50, comment: 'R8 - Pending FS-Deposit bonus stays Pending Position 2' }
    //   ],
    //   transitionType: 'cross-type'
    // }
    {
      testId: 'R7.5',
      description: 'Zero out Cash-NoDeposit → Cash-NoDeposit becomes active (multiple instances)',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 45, 
          comment: 'R7.5 - Active Cash-NoDeposit bonus to be Zeroed', 
          initialStatus: 'wagering' as const, 
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 100, 
          comment: 'R7.5 - Pending Cash-NoDeposit bonus becomes Active after zero out', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 40, 
          comment: 'R7.5 - Pending FS-Deposit bonus stays Pending Position 1', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 35, 
          comment: 'R7.5 - Pending FS-NoDeposit bonus stays Pending Position 2', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'same-category'
    },
  ];

  for (const testCase of zeroOutTestCases) {
    test(`${testCase.testId} - ${testCase.description}`, async ({ bonusApi, testData, aleaApi, page, bonuses }) => {
      await setupTestEnvironment(bonusApi, testData, aleaApi, testCase, page);
      // 1. store the initial amounts

      // 2. Validate the setup bonuses BEFORE zero out (single comprehensive check)
      const expectedBonuses = testCase.bonusSetup.map(bonus => ({
        comment: bonus.bonus.name,
        expectedStatus: bonus.initialStatus
      }));

      // This already validates existence, status, and navigates to 'all' tab - no need for additional checks
      await bonuses.validateBonusSetup('all', expectedBonuses);

      // 3. Execute zero out action
      await aleaApi.executeBettingCycle(testCase.bonusSetup[0].amount, undefined, 1, 'COMPLETED');

      // Navigate back to refresh the page state
      await bonuses.navigateToMyBonuses();
      
      // 4. Validate state AFTER zero out
      // Should have one less bonus (4 → 3) in All tab
      await bonuses.validateCardCountInTab('all', testCase.bonusSetup.length - 1);
      
      // Validate the originally active bonus is gone
      await bonuses.validateBonusNotExists(testCase.bonusSetup[0].bonus.name);
      
      // Validate the originally pending bonus is now active
      await bonuses.validateBonusStatusByName(testCase.bonusSetup[1].bonus.name, 'wagering');
      
      // Expected Result: Active bonus disappears, next pending becomes active, queue shifts up
      // Validation: Specific wallet amounts (loss), transition type validation
    });
  }
});

test.describe('Wagering Success Scenarios', () => {
  const wageringSuccessTestCases = [
    {
      testId: 'R9',
      description: 'Wagering success FS-NoDeposit → FS-Deposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 40, 
          comment: 'R9 - Active FS-NoDeposit bonus for Wagering Success', 
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 60, 
          comment: 'R9 - Pending FS-Deposit bonus becomes Active', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 55, 
          comment: 'R9 - Pending Cash-NoDeposit bonus stays Pending Position 1', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH, 
          amount: 75, 
          comment: 'R9 - Pending Cash-Deposit bonus stays Pending Position 2', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'same-category'
    },
    {
      testId: 'R10',
      description: 'Wagering success FS-Deposit → Cash-NoDeposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 65, 
          comment: 'R10 - Active FS-Deposit bonus for Wagering Success', 
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 45, 
          comment: 'R10 - Pending Cash-NoDeposit bonus becomes Active', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 35, 
          comment: 'R10 - Pending FS-NoDeposit bonus stays Pending Position 1', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH, 
          amount: 85, 
          comment: 'R10 - Pending Cash-Deposit bonus stays Pending Position 2', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'cross-type'
    },
    {
      testId: 'R11',
      description: 'Wagering success Cash-NoDeposit → Cash-Deposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 70, 
          comment: 'R11 - Active Cash-NoDeposit bonus for Wagering Success', 
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH, 
          amount: 90, 
          comment: 'R11 - Pending Cash-Deposit bonus becomes Active', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 50, 
          comment: 'R11 - Pending FS-Deposit bonus stays Pending Position 1', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 30, 
          comment: 'R11 - Pending FS-NoDeposit bonus stays Pending Position 2', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'same-category'
    },
    {
      testId: 'R12',
      description: 'Wagering success Cash-Deposit → FS-NoDeposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH, 
          amount: 100, 
          comment: 'R12 - Active Cash-Deposit bonus for Wagering Success', 
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 20, 
          comment: 'R12 - Pending FS-NoDeposit bonus becomes Active', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH, 
          amount: 80, 
          comment: 'R12 - Pending Cash-Deposit bonus stays Pending Position 1', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 55, 
          comment: 'R12 - Pending FS-Deposit bonus stays Pending Position 2', 
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'cross-type'
    }
  ];

  for (const testCase of wageringSuccessTestCases) {
    test(`${testCase.testId} - ${testCase.description}`, async ({ bonusApi, testData, aleaApi, page, bonuses }) => {
      // Setup test environment
      await setupTestEnvironment(bonusApi, testData, aleaApi, testCase, page);
      
      // Execute wagering success (bet double the bonus amount)
      const activeBonusAmount = testCase.bonusSetup[0].amount;
      await completeWagering(aleaApi, activeBonusAmount);
      
      // Navigate back to verify results
      await bonuses.navigateToMyBonuses();

      // Action: Complete wagering on active bonus
      // Expected Result: Active bonus disappears, next pending becomes active, queue shifts up
      // Validation: Specific wallet amounts (win), transition type validation
    });
  }
});

test.describe('Pending Queue Formation Tests', () => {
  const pendingQueueTestCases = [
    {
      testId: 'R13',
      description: 'Cash-NoDeposit pending queue',
      activeBonus: { bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, amount: 80, comment: 'R13 - Active FS-Deposit stays Active' },
      pendingBonus: { bonus: BONUS_IDS.NO_DEPOSIT_CASH, amount: 60, comment: 'R13 - Available Cash-NoDeposit becomes Pending' }
    },
    {
      testId: 'R14',
      description: 'Cash-Deposit pending queue',
      activeBonus: { bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, amount: 30, comment: 'R14 - Active FS-NoDeposit stays Active' },
      pendingBonus: { bonus: BONUS_IDS.DEPOSIT_CASH, amount: 90, comment: 'R14 - Available Cash-Deposit becomes Pending' }
    },
    {
      testId: 'R15',
      description: 'FS-NoDeposit pending queue',
      activeBonus: { bonus: BONUS_IDS.DEPOSIT_CASH, amount: 110, comment: 'R15 - Active Cash-Deposit stays Active' },
      pendingBonus: { bonus: BONUS_IDS.NO_DEPOSIT_FREE_SPINS, amount: 25, comment: 'R15 - Available FS-NoDeposit becomes Pending' }
    },
    {
      testId: 'R16',
      description: 'FS-Deposit pending queue',
      activeBonus: { bonus: BONUS_IDS.NO_DEPOSIT_CASH, amount: 70, comment: 'R16 - Active Cash-NoDeposit stays Active' },
      pendingBonus: { bonus: BONUS_IDS.DEPOSIT_FREE_SPINS, amount: 50, comment: 'R16 - Available FS-Deposit becomes Pending' }
    }
  ];

  for (const testCase of pendingQueueTestCases) {
    test(`${testCase.testId} - ${testCase.description}`, async ({ bonusApi, testData, page, menuItems, profileMenu }) => {
      // Transform the bonus objects to the old format for the API client
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
      
      // Setup two-bonus scenario using API client method
      await bonusApi.setupTwoBonusScenario(
        testData,
        transformedActiveBonus,
        transformedPendingBonus
      );
      
      // Wait for page operations to complete
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
