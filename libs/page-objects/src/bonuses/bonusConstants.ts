// Simplified type system - using native TypeScript union types instead of constant objects

export type BonusActionType = 'cancel' | 'zero_out' | 'wagering_success' | 'do_nothing';
export type BonusStatusType = 'available' | 'wagering' | 'pending';
export type FrontendObservableStateType = 'available' | 'wagering' | 'pending' | 'removed';

// Kept for template key type safety in BONUS_TEMPLATES Record
export const BonusTemplateKey = {
  NO_DEPOSIT_CASH: 'NO_DEPOSIT_CASH',
  DEPOSIT_CASH: 'DEPOSIT_CASH',
  DEPOSIT_FREE_SPINS: 'DEPOSIT_FREE_SPINS',
  NO_DEPOSIT_FREE_SPINS: 'NO_DEPOSIT_FREE_SPINS'
} as const;

export type BonusTemplateKeyType = typeof BonusTemplateKey[keyof typeof BonusTemplateKey];

// Legacy constant objects for backward compatibility (deprecated - use types directly)
/** @deprecated Use BonusActionType union type instead */
export const BonusAction = {
  CANCEL: 'cancel' as const,
  ZERO_OUT: 'zero_out' as const, 
  WAGERING_SUCCESS: 'wagering_success' as const,
  DO_NOTHING: 'do_nothing' as const
};

/** @deprecated Use BonusStatusType union type instead */
export const BonusStatus = {
  AVAILABLE: 'available' as const,
  WAGERING: 'wagering' as const,
  PENDING: 'pending' as const
};

/** @deprecated Use FrontendObservableStateType union type instead */
export const FrontendObservableState = {
  AVAILABLE: 'available' as const,
  WAGERING: 'wagering' as const,
  PENDING: 'pending' as const,
  REMOVED: 'removed' as const
};