
export type BalanceResponse = {
  realBalance: number;
  bonusBalance: number;
};

export type PromoPayoutResponse = {
  id: string;
  realBalance: number;
  bonusBalance: number;
  isAlreadyProcessed: boolean;
};
