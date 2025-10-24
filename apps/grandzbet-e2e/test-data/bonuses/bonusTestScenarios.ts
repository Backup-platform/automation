import { 
  BonusTestCase, 
  BonusAction, 
  BonusStatus, 
  FrontendObservableState, 
  BonusTemplateKey,
  BonusTemplate,
  createBonusTestCase, 
  createBonusTestInstance 
} from '@sbt-monorepo/page-objects/bonuses';

// Re-export type for local helpers needing only scenario type without full factory surface
export type { BonusTestCase };

// GrandBet-specific bonus templates (environment-specific test data)
export const BONUS_TEMPLATES: Record<keyof typeof BonusTemplateKey, BonusTemplate> = {
  DEPOSIT_FREE_SPINS: {
    id: 1770619,
    name: 'NS-DEP-FS-Auto Title',
    bonusRequirement: 'deposit',
    bonusType: 'free_spins',
    wageringModel: 'non_sticky',
    minDeposit: 10,
    maxDeposit: 1000,
    wageringMultiplier: 40,
    currencies: ['CAD', 'EUR', 'USD'],
    brands: ['grandzbet', 'spacefortuna']
  },

  NO_DEPOSIT_FREE_SPINS: {
    id: 1770618,
    name: 'NS-ND-FS-Auto Title',
    bonusRequirement: 'no_deposit',
    bonusType: 'free_spins',
    wageringModel: 'non_sticky',
    minBonusAmount: 5,
    maxBonusAmount: 50,
    wageringMultiplier: 40,
    expiryDays: 7,
    currencies: ['CAD', 'EUR', 'USD'],
    brands: ['grandzbet', 'spacefortuna']
  },

  DEPOSIT_CASH: {
    id: 1770616,
    name: 'NS-DEP-Auto title',
    bonusRequirement: 'deposit',
    bonusType: 'cash',
    wageringModel: 'non_sticky',
    minDeposit: 10,
    maxDeposit: 1000,
    minBonusAmount: 5,
    maxBonusAmount: 500,
    bonusPercentage: 50,
    wageringMultiplier: 40,
    zeroOutAmount: 0.01,
    rollOverDays: 30,
    currencies: ['CAD', 'EUR', 'USD'],
    brands: ['grandzbet', 'spacefortuna']
  },

  NO_DEPOSIT_CASH: {
    id: 1770764,
    name: 'NS-ND-Auto title',
    bonusRequirement: 'no_deposit',
    bonusType: 'cash',
    wageringModel: 'non_sticky',
    minBonusAmount: 5,
    maxBonusAmount: 100,
    wageringMultiplier: 40,
    zeroOutAmount: 0.01,
    rollOverDays: 7,
    expiryDays: 7,
    currencies: ['CAD', 'EUR', 'USD'],
    brands: ['grandzbet', 'spacefortuna']
  }
} as const;

// Helper functions for working with GrandBet bonus templates
export const getBonusTemplateById = (id: number): BonusTemplate | undefined => {
  return Object.values(BONUS_TEMPLATES).find(template => template.id === id);
};

export const getBonusTemplatesByRequirement = (requirement: 'deposit' | 'no_deposit'): BonusTemplate[] => {
  return Object.values(BONUS_TEMPLATES).filter(template => template.bonusRequirement === requirement);
};

export const getBonusTemplatesByType = (type: 'cash' | 'free_spins'): BonusTemplate[] => {
  return Object.values(BONUS_TEMPLATES).filter(template => template.bonusType === type);
};

export const createLocalBonusTestInstance = (
  templateKey: keyof typeof BONUS_TEMPLATES,
  amount: number,
  initialStatus: typeof BonusStatus[keyof typeof BonusStatus],
  statusAfterAction?: typeof FrontendObservableState[keyof typeof FrontendObservableState],
  action?: typeof BonusAction[keyof typeof BonusAction],
  customComment?: string,
  creditedAmount?: number
) => {
  return createBonusTestInstance(
    BONUS_TEMPLATES[templateKey],
    amount,
    initialStatus,
    statusAfterAction,
    action,
    customComment,
    creditedAmount
  );
};

// Legacy bonus structure for extracted test cases (temporary until migration complete)
export interface LegacyBonusTestCase {
  testId: string;
  description: string;
  bonusSetup: Array<{ 
    bonus: {
      id: number;
      name: string;
      bonusRequirement: 'deposit' | 'no_deposit';
      bonusType: 'cash' | 'free_spins';
    }; 
    amount: number; 
    comment: string; 
    initialStatus: 'wagering' | 'pending' | 'available';
    statusAfterAction?: 'wagering' | 'pending' | 'available' | 'removed';
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
      bonusRequirement: 'deposit' | 'no_deposit';
      bonusType: 'cash' | 'free_spins';
    };
    amount: number; 
    comment: string; 
  };
  pendingBonus: { 
    bonus: {
      id: number;
      name: string;
      bonusRequirement: 'deposit' | 'no_deposit';
      bonusType: 'cash' | 'free_spins';
    };
    amount: number; 
    comment: string; 
  };
}

const LEGACY_BONUS_IDS = {
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

export class BonusTestScenarios {
  static getCancelActiveBonusTests(): BonusTestCase[] {
    return [
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.CANCEL), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R1 - Active Cash-NoDeposit bonus to be Canceled
  // Deposit bonus: configured amount 10, percentage 50% -> credited 5 at activation
  createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING, undefined /* comment */, 5), // R1 - Pending Deposit bonus becomes Active (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R1 - Pending Cash-NoDeposit bonus stays Pending Position 1
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R1 - Pending Cash-NoDeposit bonus stays Pending Position 2
      ]),

      // createBonusTestCase([
      //   createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.CANCEL), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R2 - Active Cash-NoDeposit bonus to be Canceled
      //   createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R2 - Pending Cash-NoDeposit bonus becomes Active
      //   createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // R2 - Pending Cash-NoDeposit bonus stays Pending Position 1
      //   createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R2 - Pending Deposit bonus stays Pending Position 2
      // ]),

      // createBonusTestCase([
      //   createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.CANCEL), // R3 - Active Cash-NoDeposit bonus to be Canceled
      //   createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R3 - Pending Cash-NoDeposit bonus becomes Active
      //   createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // R3 - Pending Deposit bonus stays Pending Position 1
      //   createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R3 - Pending Cash-NoDeposit bonus stays Pending Position 2
      // ]),

      // createBonusTestCase([
      //   createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.CANCEL), // R4 - Active Cash-Deposit bonus to be Canceled
      //   createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R4 - Pending Cash-NoDeposit bonus becomes Active
      //   createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R4 - Pending Cash-NoDeposit bonus stays Pending Position 1
      //   createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R4 - Pending Cash-NoDeposit bonus stays Pending Position 2
      // ])
    ];
  }

  static getZeroOutActiveBonusTests(): BonusTestCase[] {
    return [
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.ZERO_OUT), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R5 - Active Cash-NoDeposit bonus to be Zeroed
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R5 - Pending Cash-Deposit bonus becomes Active after zero out
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R5 - Pending Cash-NoDeposit bonus stays Pending Position 1
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R5 - Pending Cash-Deposit bonus stays Pending Position 2
      ]),

      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.ZERO_OUT), // R6 - Active Cash-Deposit bonus to be Zeroed
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 20, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R6 - Pending Cash-NoDeposit bonus becomes Active after zero out
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 20, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R6 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R6 - Pending Cash-Deposit bonus stays Pending Position 2
      ]),

      // R7 - Zero out Cash-NoDeposit → Cash-Deposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 45, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.ZERO_OUT), // R7 - Active Cash-NoDeposit bonus to be Zeroed
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R7 - Pending Cash-Deposit bonus becomes Active after zero out
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 40, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R7 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 35, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R7 - Pending Cash-NoDeposit bonus stays Pending Position 2
      ]),

      // R8 - Zero out Cash-Deposit → Cash-Deposit becomes active (FS claiming not implemented)
      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.ZERO_OUT), // R8 - Active Cash-Deposit bonus to be Zeroed
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 25, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R8 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R8 - Pending Cash-Deposit bonus becomes Active after zero out
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 50, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R8 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)
      ])
    ];
  }

  static getWageringSuccessTests(): BonusTestCase[] {
    return [
      // R9 - Wagering success FS-NoDeposit → FS-Deposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_FREE_SPINS', 40, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.WAGERING_SUCCESS), // R9 - Active FS-NoDeposit bonus for Wagering Success
        createLocalBonusTestInstance('DEPOSIT_FREE_SPINS', 60, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R9 - Pending FS-Deposit bonus becomes Active
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 55, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // R9 - Pending Cash-NoDeposit bonus stays Pending Position 1
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R9 - Pending Cash-Deposit bonus stays Pending Position 2
      ]),

      // R10 - Wagering success FS-Deposit → Cash-NoDeposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_FREE_SPINS', 65, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.WAGERING_SUCCESS), // R10 - Active FS-Deposit bonus for Wagering Success
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 45, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R10 - Pending Cash-NoDeposit bonus becomes Active
        createLocalBonusTestInstance('NO_DEPOSIT_FREE_SPINS', 35, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // R10 - Pending FS-NoDeposit bonus stays Pending Position 1
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R10 - Pending Cash-Deposit bonus stays Pending Position 2
      ]),

      // R11 - Wagering success Cash-NoDeposit → Cash-Deposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 70, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.WAGERING_SUCCESS), // R11 - Active Cash-NoDeposit bonus for Wagering Success
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R11 - Pending Cash-Deposit bonus becomes Active
        createLocalBonusTestInstance('DEPOSIT_FREE_SPINS', 50, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // R11 - Pending FS-Deposit bonus stays Pending Position 1
        createLocalBonusTestInstance('NO_DEPOSIT_FREE_SPINS', 30, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R11 - Pending FS-NoDeposit bonus stays Pending Position 2
      ]),

      // R12 - Wagering success Cash-Deposit → FS-NoDeposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.WAGERING, FrontendObservableState.REMOVED, BonusAction.WAGERING_SUCCESS), // R12 - Active Cash-Deposit bonus for Wagering Success
        createLocalBonusTestInstance('NO_DEPOSIT_FREE_SPINS', 20, BonusStatus.PENDING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R12 - Pending FS-NoDeposit bonus becomes Active
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING), // R12 - Pending Cash-Deposit bonus stays Pending Position 1
        createLocalBonusTestInstance('DEPOSIT_FREE_SPINS', 55, BonusStatus.PENDING, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R12 - Pending FS-Deposit bonus stays Pending Position 2
      ])
    ];
  }

  static getTestsByAction(action: string): BonusTestCase[] {
    const allTests = [
      ...this.getCancelActiveBonusTests(),
      ...this.getZeroOutActiveBonusTests(),
      ...this.getWageringSuccessTests()
    ];

    return allTests.filter((testCase: BonusTestCase) => 
      testCase.bonuses.some(bonus => bonus.action === action)
    );
  }

  static getPendingQueueFormationTests(): BonusTestCase[] {
    return [
      // R13 - Cash-NoDeposit pending queue
      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_FREE_SPINS', 80, BonusStatus.WAGERING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R13 - Active FS-Deposit stays Active
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 60, BonusStatus.AVAILABLE, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R13 - Available Cash-NoDeposit becomes Pending
      ]),

      // R14 - Cash-Deposit pending queue
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_FREE_SPINS', 30, BonusStatus.WAGERING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R14 - Active FS-NoDeposit stays Active
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.AVAILABLE, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R14 - Available Cash-Deposit becomes Pending
      ]),

      // R15 - FS-NoDeposit pending queue
      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, BonusStatus.WAGERING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R15 - Active Cash-Deposit stays Active
        createLocalBonusTestInstance('NO_DEPOSIT_FREE_SPINS', 25, BonusStatus.AVAILABLE, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R15 - Available FS-NoDeposit becomes Pending
      ]),

      // R16 - FS-Deposit pending queue
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 70, BonusStatus.WAGERING, FrontendObservableState.WAGERING, BonusAction.DO_NOTHING), // R16 - Active Cash-NoDeposit stays Active
        createLocalBonusTestInstance('DEPOSIT_FREE_SPINS', 50, BonusStatus.AVAILABLE, FrontendObservableState.PENDING, BonusAction.DO_NOTHING) // R16 - Available FS-Deposit becomes Pending
      ])
    ];
  }

  static getAllTestCases(): BonusTestCase[] {
    return [
      ...this.getCancelActiveBonusTests(),
      ...this.getZeroOutActiveBonusTests(),
      ...this.getWageringSuccessTests(),
      ...this.getPendingQueueFormationTests()
    ];
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
