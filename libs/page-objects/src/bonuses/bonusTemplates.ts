import { BonusTemplate, BonusTestInstance, BonusTestCase } from './bonusTypes';
import { BonusStatusType, FrontendObservableStateType, BonusActionType } from './bonusConstants';

/**
 * Factory function to create a bonus test instance.
 * Note: This now requires a BonusTemplate to be passed in rather than referencing
 * environment-specific templates. App-specific bonus templates should be defined
 * in the respective app's test-data folder.
 */
export const createBonusTestInstance = (
  template: BonusTemplate,
  amount: number,
  initialStatus: BonusStatusType,
  statusAfterAction?: FrontendObservableStateType,
  action?: BonusActionType,
  customComment?: string,
  creditedAmount?: number
): BonusTestInstance => {
  // Auto-calculate credited amount for percentage-based deposit cash bonuses if not explicitly provided
  let derivedCredited = creditedAmount;
  if (derivedCredited === undefined && template.bonusRequirement === 'deposit' && template.bonusType === 'cash') {
    const pct = typeof template.bonusPercentage === 'number' ? template.bonusPercentage : 100;
    let calc = (amount * pct) / 100;
    if (typeof template.minBonusAmount === 'number' && calc < template.minBonusAmount) calc = template.minBonusAmount;
    if (typeof template.maxBonusAmount === 'number' && calc > template.maxBonusAmount) calc = template.maxBonusAmount;
    derivedCredited = parseFloat(calc.toFixed(2));
  }
  return {
    template,
    amount,
    creditedAmount: derivedCredited,
    initialStatus,
    statusAfterAction,
    action,
    customComment
  };
};

export const createBonusTestCase = (bonuses: BonusTestInstance[]): BonusTestCase => {
  return { bonuses };
};



