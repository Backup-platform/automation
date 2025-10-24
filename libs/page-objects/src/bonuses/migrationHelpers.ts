import { BonusTestCase, BonusTestInstance, BonusTemplate } from './bonusTypes';
import { BonusAction } from './bonusConstants';
import { createBonusTestCase, createBonusTestInstance } from './bonusTemplates';

interface LegacyBonusId {
  id: number;
  name: string;
  bonusRequirement: 'deposit' | 'no_deposit';
  bonusType: 'cash' | 'free_spins';
}

interface LegacyBonusTestCase {
  testId: string;
  description: string;
  bonusSetup: Array<{
    bonus: LegacyBonusId;
    amount: number;
    comment: string;
    initialStatus: 'available' | 'wagering' | 'pending';
    statusAfterAction?: 'available' | 'wagering' | 'pending' | 'removed';
  }>;
  transitionType?: string;
}

function getLegacyTemplateKey(legacyBonus: LegacyBonusId): string {
  const idToTemplateMap: Record<number, string> = {
    1770619: 'DEPOSIT_FREE_SPINS',
    1770618: 'NO_DEPOSIT_FREE_SPINS',
    1770616: 'DEPOSIT_CASH',
    1770764: 'NO_DEPOSIT_CASH'
  };

  const templateKey = idToTemplateMap[legacyBonus.id];
  if (!templateKey) {
    throw new Error(`Unknown bonus ID: ${legacyBonus.id}. Please add it to the template mapping.`);
  }

  return templateKey;
}

function convertLegacyBonusSetupItem(legacyItem: LegacyBonusTestCase['bonusSetup'][0], bonusTemplates: Record<string, BonusTemplate>): BonusTestInstance {
  const templateKey = getLegacyTemplateKey(legacyItem.bonus);
  const template = bonusTemplates[templateKey];
  
  if (!template) {
    throw new Error(`Template not found for key: ${templateKey}. Please ensure the template is available in your app-specific bonus templates.`);
  }
  
  let action: keyof typeof BonusAction = 'DO_NOTHING';
  if (legacyItem.comment.toLowerCase().includes('cancel')) {
    action = 'CANCEL';
  } else if (legacyItem.comment.toLowerCase().includes('zero out')) {
    action = 'ZERO_OUT';
  } else if (legacyItem.comment.toLowerCase().includes('wagering')) {
    action = 'WAGERING_SUCCESS';
  }

  return createBonusTestInstance(
    template,
    legacyItem.amount,
    legacyItem.initialStatus,
    legacyItem.statusAfterAction,
    BonusAction[action],
    legacyItem.comment
  );
}

export function migrateLegacyTestCase(legacyTestCase: LegacyBonusTestCase, bonusTemplates: Record<string, BonusTemplate>): BonusTestCase {
  const bonusInstances = legacyTestCase.bonusSetup.map(item => convertLegacyBonusSetupItem(item, bonusTemplates));
  return createBonusTestCase(bonusInstances);
}

export function migrateLegacyTestCases(legacyTestCases: LegacyBonusTestCase[], bonusTemplates: Record<string, BonusTemplate>): BonusTestCase[] {
  return legacyTestCases.map(testCase => migrateLegacyTestCase(testCase, bonusTemplates));
}

/**
 * Usage example for your current test structure:
 * 
 * ```typescript
 * // In your test file, instead of using the old structure:
 * // const cancelActiveTestCases = [ ... ];
 * 
 * // Use the new system:
 * import { BonusTestScenarios } from '@sbt-monorepo/page-objects';
 * const cancelActiveTestCases = BonusTestScenarios.getCancelActiveBonusTests();
 * 
 * // Or migrate existing arrays:
 * const migratedTests = migrateLegacyTestCases(oldTestCaseArray);
 * ```
 */
