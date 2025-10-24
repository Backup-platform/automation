import type { BonusActionType, BonusStatusType, FrontendObservableStateType } from './bonusConstants';

export type BonusRequirement = 'deposit' | 'no_deposit';
export type BonusType = 'cash' | 'free_spins';
export type WageringModel = 'sticky' | 'non_sticky' | 'no_wager';

export type { BonusActionType, BonusStatusType, FrontendObservableStateType };

export interface BonusTemplate {
  id: number;
  name: string;
  bonusRequirement: BonusRequirement;
  bonusType: BonusType;
  wageringModel?: WageringModel;
  minDeposit?: number;
  maxDeposit?: number;
  minBonusAmount?: number;
  maxBonusAmount?: number;
  bonusPercentage?: number;
  wageringMultiplier?: number;
  zeroOutAmount?: number;
  rollOverDays?: number;
  expiryDays?: number;
  currencies?: string[];
  brands?: string[];
}

export interface BonusTestInstance {
  template: BonusTemplate;
  amount: number;
  /**
   * Actual credited amount that appears in wallet at the validation point.
   * Especially relevant for percentage-based deposit bonuses where the full configured
   * amount represents the deposit value but only percentage * deposit is credited.
   */
  creditedAmount?: number;
  initialStatus: BonusStatusType;
  statusAfterAction?: FrontendObservableStateType;
  action?: BonusActionType;
  customComment?: string;
}

export interface BonusTestCase {
  bonuses: BonusTestInstance[];
}

export interface TestData {
  bonusId: number;
  profileId: number;
  bonusAmount: number;
  profileBonusId: string;
  currency: string;
  comment: string;
}
