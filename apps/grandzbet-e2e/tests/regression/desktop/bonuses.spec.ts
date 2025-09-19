import test, { expect } from '../../../pages/base/base.po';
import { BonusApiClient, AleaApiClient, PaymentIqApiClient } from '@sbt-monorepo/page-objects';
import { Wallet } from '../../../pages/wallet/wallet.po';
import { Bonuses } from '../../../pages/bonuses/bonuses.po';
import type { Page } from '@playwright/test';
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

export const BONUS_IDS = {
  DEPOSIT_FREE_SPINS: { 
    id: 1770619, 
    name: 'NS-DEP-FS-Auto Title',
    bonusRequirement: 'deposit' as const,
    bonusType: 'free_spins' as const
  },
  NO_DEPOSIT_FREE_SPINS: { 
    id: 1770618, 
    name: 'NS-ND-FS-Auto Title',
    bonusRequirement: 'no_deposit' as const,
    bonusType: 'free_spins' as const
  },
  DEPOSIT_CASH: { 
    id: 1770616, 
    name: 'NS-DEP-Auto title',
    bonusRequirement: 'deposit' as const,
    bonusType: 'cash' as const
  },
  NO_DEPOSIT_CASH: { 
    id: 1770764, 
    name: 'NS-ND-Auto title',
    bonusRequirement: 'no_deposit' as const,
    bonusType: 'cash' as const
  }
} as const;


async function completeWagering(aleaApi: AleaApiClient, bonusAmount: number): Promise<void> {
  await test.step(`Complete wagering requirement for ${bonusAmount} CAD bonus`, async () => {
    const firstBet = Math.floor(bonusAmount / 2);
    const firstWin = firstBet * 2;
    await aleaApi.executeBettingCycle(firstBet, firstWin, 1, 'COMPLETED');
    
    const secondBet = bonusAmount - firstBet + firstWin;
    const secondWin = secondBet;
    await aleaApi.executeBettingCycle(secondBet, secondWin, 2, 'COMPLETED');
  });
}

async function zeroOutDepositCashBonus(aleaApi: AleaApiClient, bonusAmount: number, realMoneyAmount = 10): Promise<void> {
  await test.step(`Zero out deposit cash bonus: ${realMoneyAmount} CAD real money + ${bonusAmount} CAD bonus`, async () => {
    if (realMoneyAmount > 0) {
      await aleaApi.executeBettingCycle(realMoneyAmount, undefined, 1, 'COMPLETED');
    }
    
    await aleaApi.executeBettingCycle(bonusAmount, undefined, 2, 'COMPLETED');
  });
}

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

async function setupTestEnvironment(
  bonusApi: BonusApiClient,
  testData: TestData,
  aleaApi: AleaApiClient,
  paymentIqApi: PaymentIqApiClient | null | undefined,
  testCase: BonusTestCase,
  page: Page
) {
  return await test.step('Setup test environment and bonus queue', async () => {
    const transformedBonusSetup = testCase.bonusSetup.map(bonus => ({
      bonusId: bonus.bonus.id,
      amount: bonus.amount,
      comment: bonus.comment,
      initialStatus: bonus.initialStatus,
      bonusRequirement: bonus.bonus.bonusRequirement,
      bonusType: bonus.bonus.bonusType
    }));
    
    await bonusApi.setupBonusQueue(testData, transformedBonusSetup, aleaApi, paymentIqApi || undefined);
    await page.waitForTimeout(1000);
    
    return { aleaApi };
  });
}

async function cleanupRealMoneyViaAPI(
  bonusApi: BonusApiClient,
  testData: TestData,
  wallet: Wallet
): Promise<void> {
  await test.step('Clean up real money using API', async () => {
    console.log('DEBUG: Starting API-based real money cleanup...');
    
    // Get current wallets
    const wallets = await bonusApi.getWallets(testData.profileId);
    const cadWallet = wallets.find(wallet => wallet.currency === 'CAD');
    
    if (!cadWallet) {
      console.log('DEBUG: No CAD wallet found - no cleanup needed');
      return;
    }
    
    console.log(`DEBUG: Found CAD wallet - ID: ${cadWallet.id}, Balance: ${cadWallet.balance}`);
    
    if (cadWallet.balance > 0) {
      console.log(`DEBUG: Removing ${cadWallet.balance} CAD from wallet via API...`);
      const result = await bonusApi.removeMoney(
        cadWallet.id, 
        cadWallet.balance, 
        'CAD', 
        'Test cleanup - Remove real money before bonus testing'
      );
      
      console.log(`DEBUG: API cleanup result - New balance: ${result.balance}`);
      
      // Refresh wallet display to reflect API changes
      await wallet.page.reload({ waitUntil: 'domcontentloaded' });
      await wallet.page.waitForTimeout(2000);
    } else {
      console.log('DEBUG: No real money found - no cleanup needed');
    }
  });
}

test.beforeEach(async ({ page, menuItems, profileMenu, bonusApi }) => {
  await bonusApi.cancelAllUserBonuses('Pre-test cleanup');
  await page.waitForTimeout(2000);
  
  await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
  await menuItems.clickMyProfileButton();
  await profileMenu.clickMyBonusesButton();
});

test.afterEach(async ({ bonusApi, page }) => {
  await bonusApi.cancelAllUserBonuses('Test teardown');
  await page.waitForTimeout(3000);
});

test.afterAll(async ({ bonusApi }) => {
    await bonusApi.fetchAllUserBonuses();
});

test.describe('Bonus Teardown Utility', () => {
  test('Manual cleanup - Cancel all user bonuses', async ({ bonusApi }) => {
    await bonusApi.cancelAllUserBonuses('Manual cleanup');
  });
});

// Helper function to validate active bonus exists (fail fast)
function validateActiveBonusExists(testCase: BonusTestCase): {
  activeBonus: typeof testCase.bonusSetup[0];
  newActiveBonus?: typeof testCase.bonusSetup[0];
} {
  const activeBonus = testCase.bonusSetup.find(bonus => bonus.initialStatus === 'wagering');
  if (!activeBonus) {
    throw new Error(`Test ${testCase.testId} requires an active bonus but none found in test setup`);
  }

  const newActiveBonus = testCase.bonusSetup.find(bonus => 
    bonus.initialStatus === 'pending' && bonus.statusAfterAction === 'wagering'
  );

  return { activeBonus, newActiveBonus };
}

// Helper function to validate wallet balances after cancellation
async function validatePostCancellationWalletBalances(
  wallet: Wallet,
  bonuses: Bonuses,
  newActiveBonus?: { amount: number }
): Promise<void> {
  await test.step('Validate wallet balances after cancellation', async () => {
    await bonuses.navigateToMyBonuses();
    await bonuses.page.reload();
    
    const bonusBalance = await wallet.getBonusFromDropdown();
    
    if (newActiveBonus) {
      // Multi-bonus scenario: Check for new active bonus amount
      const expectedBonusFormats = [
        `${newActiveBonus.amount}.00 CAD`,
        `€${newActiveBonus.amount}.00`,
        `${newActiveBonus.amount}.00 €`,
        `${newActiveBonus.amount} CAD`,
        `€${newActiveBonus.amount}`,
      ];
      
      const bonusMatches = expectedBonusFormats.some(format => bonusBalance === format);
      expect(bonusMatches, 
        `Expected bonus balance to be ${newActiveBonus.amount} in some currency format, but got: "${bonusBalance}"`
      ).toBe(true);
    } else {
      // Single bonus scenario: Should have no bonus balance after cancellation
      expect(bonusBalance).toMatch(/0\.00|€0\.00|0 CAD/);
    }
  });
}

// Simplified setup helper (focused only on environment setup)
async function setupBonusScenario(
  bonusApi: BonusApiClient,
  testData: TestData,
  aleaApi: AleaApiClient,
  paymentIqApi: PaymentIqApiClient,
  testCase: BonusTestCase,
  page: Page
): Promise<void> {
  await setupTestEnvironment(bonusApi, testData, aleaApi, paymentIqApi, testCase, page);
}

// Helper function to validate bonus setup with proper navigation
async function validateBonusSetupWithNavigation(
  bonuses: Bonuses,
  page: Page,
  expectedBonuses: Array<{ comment: string; expectedStatus: 'wagering' | 'pending' | 'available' }>,
  stepName: string
): Promise<void> {
  await test.step(stepName, async () => {
    await page.waitForTimeout(2000);
    await bonuses.navigateToMyBonuses();
    await bonuses.page.reload();
    await page.waitForTimeout(2000);
    await bonuses.validateBonusSetupAcrossAllTabs(expectedBonuses);
  });
}

test.describe.only('Cancel Active Bonus Scenarios', () => {
  const cancelActiveTestCases = [
    {
      testId: 'R1',
      description: 'Cancel Cash-NoDeposit → Cash-NoDeposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 15, 
          comment: 'R1 - Active Cash-NoDeposit bonus to be Canceled',
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R1 - Pending Deposit bonus becomes Active',
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 15, 
          comment: 'R1 - Pending Cash-NoDeposit bonus stays Pending Position 1',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 15, 
          comment: 'R1 - Pending Cash-NoDeposit bonus stays Pending Position 2',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'cross-type'
    },
    {
      testId: 'R2',
      description: 'Cancel Cash-NoDeposit → Cash-NoDeposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 15, 
          comment: 'R2 - Active Cash-NoDeposit bonus to be Canceled',
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 15, 
          comment: 'R2 - Pending Cash-NoDeposit bonus becomes Active',
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 15, 
          comment: 'R2 - Pending Cash-NoDeposit bonus stays Pending Position 1',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R2 - Pending Deposit bonus stays Pending Position 2',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'same-category'
    },
    {
      testId: 'R3',
      description: 'Cancel Cash-NoDeposit → Cash-NoDeposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 15, 
          comment: 'R3 - Active Cash-NoDeposit bonus to be Canceled',
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 15, 
          comment: 'R3 - Pending Cash-NoDeposit bonus becomes Active',
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R3 - Pending Deposit bonus stays Pending Position 1',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 15, 
          comment: 'R3 - Pending Cash-NoDeposit bonus stays Pending Position 2',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'cross-type'
    },
    {
      testId: 'R4',
      description: 'Cancel Cash-NoDeposit → Cash-NoDeposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R4 - Active Cash-Deposit bonus to be Canceled',
          initialStatus: 'wagering' as const,
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 15, 
          comment: 'R4 - Pending Cash-NoDeposit bonus becomes Active',
          initialStatus: 'pending' as const,
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 15, 
          comment: 'R4 - Pending Cash-NoDeposit bonus stays Pending Position 1',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS  
          amount: 15, 
          comment: 'R4 - Pending Cash-NoDeposit bonus stays Pending Position 2',
          initialStatus: 'pending' as const,
          statusAfterAction: 'pending' as const 
        }
      ],
        transitionType: 'same-category'
    }
  ];

  for (const testCase of cancelActiveTestCases) {
    test(`${testCase.testId} - ${testCase.description}`, async ({ bonusApi, testData, aleaApi, paymentIqApi, page, bonuses, wallet }) => {
      test.setTimeout(120000);
      
      const { activeBonus, newActiveBonus } = validateActiveBonusExists(testCase);
      
      await setupBonusScenario(bonusApi, testData, aleaApi, paymentIqApi, testCase, page);
      
      // Validate initial bonus setup
      const initialExpectedBonuses = testCase.bonusSetup.map(bonus => ({
        comment: bonus.bonus.name,
        expectedStatus: bonus.initialStatus
      }));
      
      await validateBonusSetupWithNavigation(
        bonuses, 
        page, 
        initialExpectedBonuses, 
        'Validate initial bonus setup'
      );

      await bonuses.cancelBonusByName(activeBonus.bonus.name, true);

      if (testCase.bonusSetup.length > 1) {
        const expectedFinalBonuses = testCase.bonusSetup
          .filter((bonus): bonus is typeof bonus & { statusAfterAction: 'wagering' | 'pending' | 'available' } => 
            bonus.statusAfterAction !== 'removed' && bonus.statusAfterAction !== undefined
          )
          .map(bonus => ({
            comment: bonus.bonus.name,
            expectedStatus: bonus.statusAfterAction
          }));

        await validateBonusSetupWithNavigation(
          bonuses, 
          page, 
          expectedFinalBonuses, 
          'Validate bonuses after cancellation'
        );
      }

      await validatePostCancellationWalletBalances(wallet, bonuses, newActiveBonus);
    });
  }
});

test.describe.only('Zero Out Active Bonus Scenarios', () => {
  const zeroOutTestCases = [
    {
      testId: 'R5',
      description: 'Zero out Cash-NoDeposit → Cash-Deposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 15, 
          comment: 'R5 - Active Cash-NoDeposit bonus to be Zeroed', 
          initialStatus: 'wagering' as const, 
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R5 - Pending Cash-Deposit bonus becomes Active after zero out', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 15, 
          comment: 'R5 - Pending Cash-NoDeposit bonus stays Pending Position 1', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R5 - Pending Cash-Deposit bonus stays Pending Position 2', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'same-category'
    },
    {
      testId: 'R6',
      description: 'Zero out Cash-Deposit → Cash-NoDeposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R6 - Active Cash-Deposit bonus to be Zeroed', 
          initialStatus: 'wagering' as const, 
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 20, 
          comment: 'R6 - Pending Cash-NoDeposit bonus becomes Active after zero out', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 20, 
          comment: 'R6 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R6 - Pending Cash-Deposit bonus stays Pending Position 2', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'cross-type'
    },
    {
      testId: 'R7',
      description: 'Zero out Cash-NoDeposit → Cash-Deposit becomes active',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 45, 
          comment: 'R7 - Active Cash-NoDeposit bonus to be Zeroed', 
          initialStatus: 'wagering' as const, 
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R7 - Pending Cash-Deposit bonus becomes Active after zero out', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS
          amount: 40, 
          comment: 'R7 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 35, 
          comment: 'R7 - Pending Cash-NoDeposit bonus stays Pending Position 2', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'same-category'
    },
    {
      testId: 'R8',
      description: 'Zero out Cash-Deposit → Cash-Deposit becomes active (FS claiming not implemented)',
      bonusSetup: [
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R8 - Active Cash-Deposit bonus to be Zeroed', 
          initialStatus: 'wagering' as const, 
          statusAfterAction: 'removed' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
          amount: 25, 
          comment: 'R8 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        },
        { 
          bonus: BONUS_IDS.DEPOSIT_CASH,
          amount: 10, 
          comment: 'R8 - Pending Cash-Deposit bonus becomes Active after zero out', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'wagering' as const 
        },
        { 
          bonus: BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS
          amount: 50, 
          comment: 'R8 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)', 
          initialStatus: 'pending' as const, 
          statusAfterAction: 'pending' as const 
        }
      ],
      transitionType: 'cross-type'
    },
  ];

  for (const testCase of zeroOutTestCases) {
    test(`${testCase.testId} - ${testCase.description}`, async ({ bonusApi, testData, aleaApi, paymentIqApi, page, bonuses, wallet }) => {
      test.setTimeout(120000);
      
      await setupTestEnvironment(bonusApi, testData, aleaApi, paymentIqApi, testCase, page);
      
      await cleanupRealMoneyViaAPI(bonusApi, testData, wallet);
      
      const initialExpectedBonuses = testCase.bonusSetup.map(bonus => ({
        comment: bonus.bonus.name,
        expectedStatus: bonus.initialStatus
      }));
      
      await page.waitForTimeout(2500);
      await bonuses.navigateToMyBonuses();
      await bonuses.validateBonusSetupAcrossAllTabs(initialExpectedBonuses);
      
      const expectedActiveBonusAmount = testCase.bonusSetup.find(bonus => bonus.initialStatus === 'wagering')?.amount;
      const newActiveBonusAmount = testCase.bonusSetup.find(bonus => bonus.initialStatus === 'pending')?.amount;
      
      if (!expectedActiveBonusAmount || !newActiveBonusAmount) {
        throw new Error('Could not determine expected bonus amounts from test setup');
      }

      const activeBonus = testCase.bonusSetup.find(bonus => bonus.initialStatus === 'wagering');
      if (!activeBonus) {
        throw new Error('Could not find active bonus in test setup');
      }
      
      // Check if the active bonus is a deposit cash bonus
      const isDepositCashBonus = activeBonus.bonus.bonusRequirement === 'deposit' && activeBonus.bonus.bonusType === 'cash';
      
      if (isDepositCashBonus) {
        // For deposit cash bonuses: bet real money first (added by PaymentIQ), then bonus money
        await zeroOutDepositCashBonus(aleaApi, expectedActiveBonusAmount);
      } else {
        // For non-deposit bonuses: standard zero out (only bonus money to lose)
        await aleaApi.executeBettingCycle(expectedActiveBonusAmount, undefined, 1, 'COMPLETED');
      }

      await page.waitForTimeout(3750);

      await bonuses.navigateToMyBonuses();
      await bonuses.page.reload();
      await page.waitForTimeout(3750);
      
      const expectedFinalBonuses = testCase.bonusSetup
        .filter(bonus => bonus.statusAfterAction !== 'removed')
        .map(bonus => ({
          comment: bonus.bonus.name,
          expectedStatus: bonus.statusAfterAction
        }))
        .filter(bonus => bonus.expectedStatus !== undefined);

      await bonuses.validateBonusSetupAcrossAllTabs(expectedFinalBonuses);
      
      await test.step('Validate wallet balances after zero out', async () => {
        // Wait a bit longer for the bonus transition to complete
        await bonuses.navigateToMyBonuses();
        await bonuses.page.reload(); //TODO: to be removed once the navigation is fixed and refreshes the wallet as well. 
        
        // Get final wallet balances
        const bonusBalance = await wallet.getBonusFromDropdown();
        const realMoneyBalance = await wallet.getRealMoneyFromDropdown();
        
        // Check for currency format - might be Euro format
        const expectedBonusFormats = [
          `${newActiveBonusAmount}.00 CAD`,  // Canadian Dollar format
          `€${newActiveBonusAmount}.00`,     // Euro format with amount
          `${newActiveBonusAmount}.00 €`,    // Euro format (amount first)
          `${newActiveBonusAmount} CAD`,     // Without .00
          `€${newActiveBonusAmount}`,        // Euro without .00
        ];
        
        const bonusMatches = expectedBonusFormats.some(format => bonusBalance === format);
        
        // Assert with flexible format checking
        expect(bonusMatches, 
          `Expected bonus balance to be ${newActiveBonusAmount} in some currency format, but got: "${bonusBalance}"`
        ).toBe(true);
        
        // Assert that real money balance is still 0 (we only had bonus money)
        expect(realMoneyBalance).toMatch(/0\.00|€0\.00/);
      });
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
          amount: 10, 
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
          amount: 10, 
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
          amount: 10, 
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
          amount: 10, 
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
          amount: 10, 
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
    test(`${testCase.testId} - ${testCase.description}`, async ({ bonusApi, testData, aleaApi, page, bonuses, wallet }) => {
      // Setup test environment  
      const paymentIqApi = null; // Temporarily disabled until fixture is working
      
      await setupTestEnvironment(bonusApi, testData, aleaApi, paymentIqApi, testCase, page);
      
      await cleanupRealMoneyViaAPI(bonusApi, testData, wallet);
      
      // 1. Store initial wallet amounts
      const initialRealMoney = await wallet.getRealMoneyBalanceValue();
      const initialBonusBalance = await wallet.getCasinoBonusBalanceValue();
      const initialTotalBalance = await wallet.getTotalFromDropdown();
      
      // Execute wagering success (bet double the bonus amount)
      const activeBonusAmount = testCase.bonusSetup[0].amount;
      await completeWagering(aleaApi, activeBonusAmount);
      
      // Navigate back to verify results
      await bonuses.navigateToMyBonuses();

      // 2. Validate final wallet amounts after wagering success
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
      pendingBonus: { bonus: BONUS_IDS.DEPOSIT_CASH, amount: 10, comment: 'R14 - Available Cash-Deposit becomes Pending' }
    },
    {
      testId: 'R15',
      description: 'FS-NoDeposit pending queue',
      activeBonus: { bonus: BONUS_IDS.DEPOSIT_CASH, amount: 10, comment: 'R15 - Active Cash-Deposit stays Active' },
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
