import {
  BonusTestCase,
  BonusTemplate,
  createBonusTestCase,
  createBonusTestInstance
} from '@sbt-monorepo/page-objects/bonuses';
import type {
  BonusActionType,
  BonusStatusType,
  FrontendObservableStateType,
  BonusRequirement,
  BonusType
} from '@sbt-monorepo/page-objects/bonuses';
import { BONUS_TEMPLATES, LEGACY_BONUS_IDS, type BonusTemplateKeyLiteral } from './bonusTemplates';

// Re-export type for local helpers needing only scenario type without full factory surface
export type { BonusTestCase };
export { BONUS_TEMPLATES, LEGACY_BONUS_IDS } from './bonusTemplates';
export type { BonusTemplateKeyLiteral } from './bonusTemplates';

export const getBonusTemplateById = (id: number): BonusTemplate | undefined => {
  return Object.values(BONUS_TEMPLATES).find(template => template.id === id);
};

export const getBonusTemplatesByRequirement = (requirement: BonusRequirement): BonusTemplate[] => {
  return Object.values(BONUS_TEMPLATES).filter(template => template.bonusRequirement === requirement);
};

export const getBonusTemplatesByType = (type: BonusType): BonusTemplate[] => {
  return Object.values(BONUS_TEMPLATES).filter(template => template.bonusType === type);
};

export const createLocalBonusTestInstance = (
  templateKey: BonusTemplateKeyLiteral,
  amount: number,
  initialStatus: BonusStatusType,
  statusAfterAction?: FrontendObservableStateType,
  action: BonusActionType = 'do_nothing',
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



export class BonusTestScenarios {
  static getCancelActiveBonusTests(): BonusTestCase[] {
    return [
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'wagering', 'removed', 'cancel'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R1 - Active Cash-NoDeposit bonus to be Canceled
        // Deposit bonus: configured amount 10, percentage 50% -> credited 5 at activation
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'wagering', 'do_nothing', undefined, 5), // R1 - Pending Deposit bonus becomes Active (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'pending', 'pending', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R1 - Pending Cash-NoDeposit bonus stays Pending Position 1
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing') // R1 - Pending Cash-NoDeposit bonus stays Pending Position 2
      ]),

      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'wagering', 'removed', 'cancel'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R2 - Active Cash-NoDeposit bonus to be Canceled
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'pending', 'wagering', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R2 - Pending Cash-NoDeposit bonus becomes Active
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'pending', 'pending', 'do_nothing'), // R2 - Pending Cash-NoDeposit bonus stays Pending Position 1
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing', undefined, 5) // R2 - Pending Deposit bonus stays Pending Position 2 (credited 5)
      ]),

      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'wagering', 'removed', 'cancel'), // R3 - Active Cash-NoDeposit bonus to be Canceled
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'pending', 'wagering', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R3 - Pending Cash-NoDeposit bonus becomes Active
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing', undefined, 5), // R3 - Pending Deposit bonus stays Pending Position 1 (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'pending', 'pending', 'do_nothing') // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R3 - Pending Cash-NoDeposit bonus stays Pending Position 2
      ]),

      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'wagering', 'removed', 'cancel', undefined, 5), // R4 - Active Cash-Deposit bonus to be Canceled (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'pending', 'wagering', 'do_nothing'), // R4 - Pending Cash-NoDeposit bonus becomes Active
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'pending', 'pending', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R4 - Pending Cash-NoDeposit bonus stays Pending Position 1
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'pending', 'pending', 'do_nothing') // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R4 - Pending Cash-NoDeposit bonus stays Pending Position 2
      ])
    ];
  }

  static getZeroOutActiveBonusTests(): BonusTestCase[] {
    return [
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'wagering', 'removed', 'zero_out'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R5 - Active Cash-NoDeposit bonus to be Zeroed
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'wagering', 'do_nothing', undefined, 5), // R5 - Pending Cash-Deposit bonus becomes Active after zero out (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 15, 'pending', 'pending', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R5 - Pending Cash-NoDeposit bonus stays Pending Position 1
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing', undefined, 5) // R5 - Pending Cash-Deposit bonus stays Pending Position 2 (credited 5)
      ]),

      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'wagering', 'removed', 'zero_out', undefined, 5), // R6 - Active Cash-Deposit bonus to be Zeroed (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 20, 'pending', 'wagering', 'do_nothing'), // R6 - Pending Cash-NoDeposit bonus becomes Active after zero out
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 20, 'pending', 'pending', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R6 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing', undefined, 5) // R6 - Pending Cash-Deposit bonus stays Pending Position 2 (credited 5)
      ]),

      // R7 - Zero out Cash-NoDeposit → Cash-Deposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 45, 'wagering', 'removed', 'zero_out'), // R7 - Active Cash-NoDeposit bonus to be Zeroed
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'wagering', 'do_nothing', undefined, 5), // R7 - Pending Cash-Deposit bonus becomes Active after zero out (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 40, 'pending', 'pending', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R7 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 35, 'pending', 'pending', 'do_nothing') // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R7 - Pending Cash-NoDeposit bonus stays Pending Position 2
      ]),

      // R8 - Zero out Cash-Deposit → Cash-Deposit becomes active (FS claiming not implemented)
      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'wagering', 'removed', 'zero_out', undefined, 5), // R8 - Active Cash-Deposit bonus to be Zeroed (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 25, 'pending', 'pending', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R8 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'wagering', 'do_nothing', undefined, 5), // R8 - Pending Cash-Deposit bonus becomes Active after zero out (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 50, 'pending', 'pending', 'do_nothing') // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R8 - Pending Cash-NoDeposit bonus stays Pending (FS claiming not implemented)
      ])
    ];
  }

  static getWageringSuccessTests(): BonusTestCase[] {
    return [
      // R9 - Wagering success Cash-NoDeposit → Cash-Deposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 70, 'wagering', 'removed', 'wagering_success'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R9 - Active Cash-NoDeposit bonus for Wagering Success
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'wagering', 'do_nothing', undefined, 5), // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R9 - Pending Cash-Deposit bonus becomes Active (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 55, 'pending', 'pending', 'do_nothing'), // R9 - Pending Cash-NoDeposit bonus stays Pending Position 1
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing', undefined, 5) // R9 - Pending Cash-Deposit bonus stays Pending Position 2 (credited 5)
      ]),

      // R10 - Wagering success Cash-Deposit → Cash-NoDeposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'wagering', 'removed', 'wagering_success', undefined, 5), // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R10 - Active Cash-Deposit bonus for Wagering Success (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 45, 'pending', 'wagering', 'do_nothing'), // R10 - Pending Cash-NoDeposit bonus becomes Active
        // createLocalBonusTestInstance('NO_DEPOSIT_CASH', 35, 'pending', 'pending', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R10 - Pending Cash-NoDeposit bonus stays Pending Position 1
        // createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing', undefined, 5) // R10 - Pending Cash-Deposit bonus stays Pending Position 2 (credited 5)
      ]),

      // R11 - Wagering success Cash-NoDeposit → Cash-Deposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 70, 'wagering', 'removed', 'wagering_success'), // R11 - Active Cash-NoDeposit bonus for Wagering Success
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'wagering', 'do_nothing', undefined, 5), // R11 - Pending Cash-Deposit bonus becomes Active (credited 5)
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing', undefined, 5), // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R11 - Pending Cash-Deposit bonus stays Pending Position 1 (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 30, 'pending', 'pending', 'do_nothing') // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R11 - Pending Cash-NoDeposit bonus stays Pending Position 2
      ]),

      // R12 - Wagering success Cash-Deposit → Cash-NoDeposit becomes active
      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'wagering', 'removed', 'wagering_success', undefined, 5), // R12 - Active Cash-Deposit bonus for Wagering Success (credited 5)
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 20, 'pending', 'wagering', 'do_nothing'), // TODO: FS claiming is not yet implemented properly - changed from NO_DEPOSIT_FREE_SPINS // R12 - Pending Cash-NoDeposit bonus becomes Active
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing', undefined, 5), // R12 - Pending Cash-Deposit bonus stays Pending Position 1 (credited 5)
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'pending', 'pending', 'do_nothing', undefined, 5) // TODO: FS claiming is not yet implemented properly - changed from DEPOSIT_FREE_SPINS // R12 - Pending Cash-Deposit bonus stays Pending Position 2 (credited 5)
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
        createLocalBonusTestInstance('DEPOSIT_FREE_SPINS', 80, 'wagering', 'wagering', 'do_nothing'), // R13 - Active FS-Deposit stays Active
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 60, 'available', 'pending', 'do_nothing') // R13 - Available Cash-NoDeposit becomes Pending
      ]),

      // R14 - Cash-Deposit pending queue
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_FREE_SPINS', 30, 'wagering', 'wagering', 'do_nothing'), // R14 - Active FS-NoDeposit stays Active
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'available', 'pending', 'do_nothing') // R14 - Available Cash-Deposit becomes Pending
      ]),

      // R15 - FS-NoDeposit pending queue
      createBonusTestCase([
        createLocalBonusTestInstance('DEPOSIT_CASH', 10, 'wagering', 'wagering', 'do_nothing'), // R15 - Active Cash-Deposit stays Active
        createLocalBonusTestInstance('NO_DEPOSIT_FREE_SPINS', 25, 'available', 'pending', 'do_nothing') // R15 - Available FS-NoDeposit becomes Pending
      ]),

      // R16 - FS-Deposit pending queue
      createBonusTestCase([
        createLocalBonusTestInstance('NO_DEPOSIT_CASH', 70, 'wagering', 'wagering', 'do_nothing'), // R16 - Active Cash-NoDeposit stays Active
        createLocalBonusTestInstance('DEPOSIT_FREE_SPINS', 50, 'available', 'pending', 'do_nothing') // R16 - Available FS-Deposit becomes Pending
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

}