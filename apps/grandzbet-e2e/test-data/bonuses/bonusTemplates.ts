import type { BonusTemplate } from '@sbt-monorepo/page-objects/bonuses';
import { BonusTemplateKey } from '@sbt-monorepo/page-objects/bonuses';

export type BonusTemplateKeyLiteral = keyof typeof BonusTemplateKey;

export const BONUS_TEMPLATES: Record<BonusTemplateKeyLiteral, BonusTemplate> = {
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

export const LEGACY_BONUS_IDS = {
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
