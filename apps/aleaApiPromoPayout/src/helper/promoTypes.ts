export enum PromoType {
  FREE_SPIN = 'FREE_SPIN',
  PRIZE = 'PRIZE',
  TOURNAMENT = 'TOURNAMENT',
  SPIN_GIFT = 'SPIN_GIFT',
  CASHBACK = 'CASHBACK',
  OPERATOR_FREE_SPIN = 'OPERATOR_FREE_SPIN',
}

export function enumValues<T extends Record<string, string | number>>(e: T) {
  return Object.values(e).filter(v => typeof v === 'string') as Array<T[keyof T]>;
}