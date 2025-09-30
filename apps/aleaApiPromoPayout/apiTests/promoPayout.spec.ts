import { test, expect } from '@playwright/test';
import { Transactions } from '../src/api/AleaServises.js';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { randomAmount, randomPlace } from '../src/helper/randomValus.js'
import { PromoType, enumValues } from '../src/helper/promoTypes.js';


// !!!
// The test must to be runnned sequentially, because in parallel tests fail.
// The reason is that we use only one player.  
// The balance is updated dianamically and the actual result is different from the expected result.

test.describe.serial('Transactions API Happy Path', () => {
  for (const promoType of enumValues(PromoType)) {
    test(`PromoPayout: :_${promoType}_HappyPath`, async () => {
      const transactions = new Transactions();
      const playerID = process.env.PlayerID_SF_DEV || '';

      const promoId = uuidv4().toString();
      const amount = randomAmount();
      const balanceBefore = await transactions.getBalance(playerID);
      const bonusId = process.env.BONUS_ID;
      const cost = Number(process.env.COST);

      let place: string | undefined;
      if (promoType === PromoType.TOURNAMENT) {
        place = randomPlace();
      }

      const result = await transactions.sendPromoPayout(promoType, playerID, amount, promoId, place, bonusId, cost)

      expect(Number(result.realBalance)).toBeCloseTo(balanceBefore.realBalance + amount, 2);
      expect(Number(result.bonusBalance)).toBeCloseTo(balanceBefore.bonusBalance);

      expect(result.isAlreadyProcessed).toBeFalsy;
      expect(result.id).toEqual(promoId);

    })

    test(`PromoPayout: :_${promoType}_resultDuplicate`, async () => {
      const transactions = new Transactions();
      const playerID = process.env.PlayerID_SF_DEV || '';

      const promoId = uuidv4().toString();
      const amount = randomAmount();
      const balanceBefore = await transactions.getBalance(playerID);
      const bonusId = process.env.BONUS_ID;
      const cost = Number(process.env.COST);

      let place: string | undefined;
      if (promoType === PromoType.TOURNAMENT) {
        place = randomPlace();
      }

      const result = await transactions.sendPromoPayout(promoType, playerID, amount, promoId, place, bonusId , cost)
      const resultDuplicate = await transactions.sendPromoPayout(promoType, playerID, amount, promoId, place, bonusId , cost)

      expect(Number(result.realBalance)).toBeCloseTo(balanceBefore.realBalance + amount, 2);
      expect(Number(result.bonusBalance)).toBeCloseTo(balanceBefore.bonusBalance, 2);

      expect(result.isAlreadyProcessed).toBeFalsy;
      expect(result.id).toEqual(promoId);

      expect(Number(resultDuplicate.realBalance)).toBeCloseTo(balanceBefore.realBalance + amount, 2);
      expect(Number(resultDuplicate.bonusBalance)).toBeCloseTo(balanceBefore.bonusBalance, 2);

      expect(resultDuplicate.isAlreadyProcessed).toBeTruthy;
      expect(result.id).toEqual(promoId);
    });
  }
});



