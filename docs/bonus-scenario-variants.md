# Bonus Scenario Variants Archive

This document preserves the legacy bonus scenario combinations that were previously embedded as commented examples in `apps/grandzbet-e2e/test-data/bonuses/bonusTestScenarios.ts`. They serve as guidance for future scenario expansion without polluting the executable catalog.

## Cancel Active Bonus Variants (R2–R4)

All variants share the same TODO: **FS claiming is not yet implemented properly**, so free-spin templates remain substituted with `NO_DEPOSIT_CASH` until the claiming flow is automated.

### R2 – Cancel Cash-NoDeposit → Cash-NoDeposit Becomes Active
- Active bonus to cancel: `NO_DEPOSIT_CASH`, amount 15, status `wagering`, removed after action `cancel`.
- Pending bonus promoted to active: `NO_DEPOSIT_CASH`, amount 15, initial status `pending`, transitions to `wagering`.
- Queue remainder:
  - `NO_DEPOSIT_CASH`, amount 15, initial status `pending`, stays `pending` (position 1).
  - `DEPOSIT_CASH`, amount 10, initial status `pending`, stays `pending` (position 2).

### R3 – Cancel Cash-NoDeposit → Deposit Cash Becomes Active
- Active bonus to cancel: `NO_DEPOSIT_CASH`, amount 15, status `wagering`, removed after `cancel`.
- Pending bonus promoted to active: `NO_DEPOSIT_CASH`, amount 15, initial status `pending`, transitions to `wagering`.
- Queue remainder:
  - `DEPOSIT_CASH`, amount 10, initial status `pending`, stays `pending` (position 1).
  - `NO_DEPOSIT_CASH`, amount 15, initial status `pending`, stays `pending` (position 2).

### R4 – Cancel Cash-Deposit → Cash-NoDeposit Becomes Active
- Active bonus to cancel: `DEPOSIT_CASH`, amount 10, status `wagering`, removed after `cancel`.
- Pending bonus promoted to active: `NO_DEPOSIT_CASH`, amount 15, initial status `pending`, transitions to `wagering`.
- Queue remainder:
  - `NO_DEPOSIT_CASH`, amount 15, initial status `pending`, stays `pending` (position 1).
  - `NO_DEPOSIT_CASH`, amount 15, initial status `pending`, stays `pending` (position 2).

## Using These Variants

When ready to reactivate any combination:
1. Copy the structure into `BonusTestScenarios.getCancelActiveBonusTests()`.
2. Replace the literal statuses with the `createLocalBonusTestInstance` arguments shown above.
3. Remove the placeholder cash bonuses once FS claiming automation is available.


// Legacy bonus structure for extracted test cases (temporary until migration complete)
export interface LegacyBonusTestCase {
  testId: string;
  description: string;
  bonusSetup: Array<{ 
    bonus: {
      id: number;
      name: string;
      bonusRequirement: BonusRequirement;
      bonusType: BonusType;
    }; 
    amount: number; 
    comment: string; 
    initialStatus: BonusStatusType;
    statusAfterAction?: FrontendObservableStateType;
  }>;
  transitionType?: string;
}

export interface PendingQueueTestCase {
  testId: string;
  description: string;
  activeBonus: { 
    bonus: {
      id: number;
      name: string;
      bonusRequirement: BonusRequirement;
      bonusType: BonusType;
    };
    amount: number; 
    comment: string; 
  };
  pendingBonus: { 
    bonus: {
      id: number;
      name: string;
      bonusRequirement: BonusRequirement;
      bonusType: BonusType;
    };
    amount: number; 
    comment: string; 
  };
}

  static getCancelActiveBonusLegacyTests(): LegacyBonusTestCase[] {
    return [
      {
        testId: 'R1',
        description: 'Cancel Cash-NoDeposit → Cash-NoDeposit becomes active',
        bonusSetup: [
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 15, 
            comment: 'R1 - Active Cash-NoDeposit bonus to be Canceled',
            initialStatus: 'wagering' as const,
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
            amount: 10, 
            comment: 'R1 - Pending Deposit bonus becomes Active',
            initialStatus: 'pending' as const,
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 15, 
            comment: 'R1 - Pending Cash-NoDeposit bonus stays Pending Position 1',
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
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
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 15, 
            comment: 'R2 - Active Cash-NoDeposit bonus to be Canceled',
            initialStatus: 'wagering' as const,
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 15, 
            comment: 'R2 - Pending Cash-NoDeposit bonus becomes Active',
            initialStatus: 'pending' as const,
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
            amount: 15, 
            comment: 'R2 - Pending Cash-NoDeposit bonus stays Pending Position 1',
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
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
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
            amount: 15, 
            comment: 'R3 - Active Cash-NoDeposit bonus to be Canceled',
            initialStatus: 'wagering' as const,
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 15, 
            comment: 'R3 - Pending Cash-NoDeposit bonus becomes Active',
            initialStatus: 'pending' as const,
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
            amount: 10, 
            comment: 'R3 - Pending Deposit bonus stays Pending Position 1',
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
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
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
            amount: 10, 
            comment: 'R4 - Active Cash-Deposit bonus to be Canceled',
            initialStatus: 'wagering' as const,
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
            amount: 15, 
            comment: 'R4 - Pending Cash-NoDeposit bonus becomes Active',
            initialStatus: 'pending' as const,
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 15, 
            comment: 'R4 - Pending Cash-NoDeposit bonus stays Pending Position 1',
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS  
            amount: 15, 
            comment: 'R4 - Pending Cash-NoDeposit bonus stays Pending Position 2',
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          }
        ],
        transitionType: 'same-category'
      }
    ];
  }

  static getZeroOutActiveBonusLegacyTests(): LegacyBonusTestCase[] {
    return [
      {
        testId: 'R5',
        description: 'Zero out Cash-NoDeposit → Cash-Deposit becomes active',
        bonusSetup: [
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 15, 
            comment: 'R5 - Active Cash-NoDeposit bonus to be Zeroed', 
            initialStatus: 'wagering' as const, 
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
            amount: 10, 
            comment: 'R5 - Pending Cash-Deposit bonus becomes Active after zero out', 
            initialStatus: 'pending' as const, 
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 15, 
            comment: 'R5 - Pending Cash-NoDeposit bonus stays Pending Position 1', 
            initialStatus: 'pending' as const, 
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
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
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
            amount: 10, 
            comment: 'R6 - Active Cash-Deposit bonus to be Zeroed', 
            initialStatus: 'wagering' as const, 
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
            amount: 20, 
            comment: 'R6 - Pending Cash-NoDeposit bonus becomes Active after zero out', 
            initialStatus: 'pending' as const, 
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 20, 
            comment: 'R6 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)', 
            initialStatus: 'pending' as const, 
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
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
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
            amount: 45, 
            comment: 'R7 - Active Cash-NoDeposit bonus to be Zeroed', 
            initialStatus: 'wagering' as const, 
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
            amount: 10, 
            comment: 'R7 - Pending Cash-Deposit bonus becomes Active after zero out', 
            initialStatus: 'pending' as const, 
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS
            amount: 40, 
            comment: 'R7 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)', 
            initialStatus: 'pending' as const, 
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
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
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
            amount: 10, 
            comment: 'R8 - Active Cash-Deposit bonus to be Zeroed', 
            initialStatus: 'wagering' as const, 
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS
            amount: 25, 
            comment: 'R8 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)', 
            initialStatus: 'pending' as const, 
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH,
            amount: 10, 
            comment: 'R8 - Pending Cash-Deposit bonus becomes Active after zero out', 
            initialStatus: 'pending' as const, 
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS
            amount: 50, 
            comment: 'R8 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)', 
            initialStatus: 'pending' as const, 
            statusAfterAction: 'pending' as const 
          }
        ],
        transitionType: 'cross-type'
      }
    ];
  }

  static getWageringSuccessLegacyTests(): LegacyBonusTestCase[] {
    return [
      {
        testId: 'R9',
        description: 'Wagering success FS-NoDeposit → FS-Deposit becomes active',
        bonusSetup: [
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
            amount: 40, 
            comment: 'R9 - Active FS-NoDeposit bonus for Wagering Success', 
            initialStatus: 'wagering' as const,
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_FREE_SPINS, 
            amount: 60, 
            comment: 'R9 - Pending FS-Deposit bonus becomes Active', 
            initialStatus: 'pending' as const,
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
            amount: 55, 
            comment: 'R9 - Pending Cash-NoDeposit bonus stays Pending Position 1', 
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH, 
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
            bonus: LEGACY_BONUS_IDS.DEPOSIT_FREE_SPINS, 
            amount: 65, 
            comment: 'R10 - Active FS-Deposit bonus for Wagering Success', 
            initialStatus: 'wagering' as const,
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
            amount: 45, 
            comment: 'R10 - Pending Cash-NoDeposit bonus becomes Active', 
            initialStatus: 'pending' as const,
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
            amount: 35, 
            comment: 'R10 - Pending FS-NoDeposit bonus stays Pending Position 1', 
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH, 
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
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
            amount: 70, 
            comment: 'R11 - Active Cash-NoDeposit bonus for Wagering Success', 
            initialStatus: 'wagering' as const,
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH, 
            amount: 10, 
            comment: 'R11 - Pending Cash-Deposit bonus becomes Active', 
            initialStatus: 'pending' as const,
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_FREE_SPINS, 
            amount: 50, 
            comment: 'R11 - Pending FS-Deposit bonus stays Pending Position 1', 
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
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
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH, 
            amount: 10, 
            comment: 'R12 - Active Cash-Deposit bonus for Wagering Success', 
            initialStatus: 'wagering' as const,
            statusAfterAction: 'removed' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
            amount: 20, 
            comment: 'R12 - Pending FS-NoDeposit bonus becomes Active', 
            initialStatus: 'pending' as const,
            statusAfterAction: 'wagering' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH, 
            amount: 10, 
            comment: 'R12 - Pending Cash-Deposit bonus stays Pending Position 1', 
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          },
          { 
            bonus: LEGACY_BONUS_IDS.DEPOSIT_FREE_SPINS, 
            amount: 55, 
            comment: 'R12 - Pending FS-Deposit bonus stays Pending Position 2', 
            initialStatus: 'pending' as const,
            statusAfterAction: 'pending' as const 
          }
        ],
        transitionType: 'cross-type'
      }
    ];
  }

  static getPendingQueueTests(): PendingQueueTestCase[] {
    return [
      {
        testId: 'R13',
        description: 'Cash-NoDeposit pending queue',
        activeBonus: { 
          bonus: LEGACY_BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 80, 
          comment: 'R13 - Active FS-Deposit stays Active' 
        },
        pendingBonus: { 
          bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 60, 
          comment: 'R13 - Available Cash-NoDeposit becomes Pending' 
        }
      },
      {
        testId: 'R14',
        description: 'Cash-Deposit pending queue',
        activeBonus: { 
          bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 30, 
          comment: 'R14 - Active FS-NoDeposit stays Active' 
        },
        pendingBonus: { 
          bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH, 
          amount: 10, 
          comment: 'R14 - Available Cash-Deposit becomes Pending' 
        }
      },
      {
        testId: 'R15',
        description: 'FS-NoDeposit pending queue',
        activeBonus: { 
          bonus: LEGACY_BONUS_IDS.DEPOSIT_CASH, 
          amount: 10, 
          comment: 'R15 - Active Cash-Deposit stays Active' 
        },
        pendingBonus: { 
          bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_FREE_SPINS, 
          amount: 25, 
          comment: 'R15 - Available FS-NoDeposit becomes Pending' 
        }
      },
      {
        testId: 'R16',
        description: 'FS-Deposit pending queue',
        activeBonus: { 
          bonus: LEGACY_BONUS_IDS.NO_DEPOSIT_CASH, 
          amount: 70, 
          comment: 'R16 - Active Cash-NoDeposit stays Active' 
        },
        pendingBonus: { 
          bonus: LEGACY_BONUS_IDS.DEPOSIT_FREE_SPINS, 
          amount: 50, 
          comment: 'R16 - Available FS-Deposit becomes Pending' 
        }
      }
    ];
  }

  static getAllLegacyTestCases(): LegacyBonusTestCase[] {
    return [
      ...this.getCancelActiveBonusLegacyTests(),
      ...this.getZeroOutActiveBonusLegacyTests(),
      ...this.getWageringSuccessLegacyTests()
    ];
  }
}
