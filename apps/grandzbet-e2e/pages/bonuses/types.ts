import type { BonusStatusType } from '@sbt-monorepo/page-objects/bonuses';

export const BONUS_TAB_KEYS = ['available', 'active', 'pending'] as const;

export type BonusTab = typeof BONUS_TAB_KEYS[number];

export type BonusCardStatus = BonusStatusType;

export const BONUS_STATUS_TO_TAB: Record<BonusCardStatus, BonusTab> = {
  available: 'available',
  wagering: 'active',
  pending: 'pending'
} as const;
