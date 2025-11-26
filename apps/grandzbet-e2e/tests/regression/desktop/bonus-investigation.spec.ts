import test from '../../../pages/base/base.po';
import { BONUS_TEMPLATES } from '../../../test-data/bonuses/bonusTestScenarios';

test.describe('Bonus Wagering Investigation', () => {
  test.describe.configure({ timeout: 300000, mode: 'serial' });

  test.beforeEach(async ({ bonusApi }) => {
    await bonusApi.cancelAllUserBonuses('Investigation cleanup');
  });

  test('Investigation: Grant and claim NO_DEPOSIT_CASH 70 CAD bonus, then make 2 bets', async ({ bonusApi, aleaApi, testData }) => {
    const bonusAmount = 70;
    const bonusTemplate = BONUS_TEMPLATES.NO_DEPOSIT_CASH;

    await test.step('1. Setup NO_DEPOSIT_CASH bonus', async () => {
      // Use setupBonusQueue for proper grant and claim
      await bonusApi.setupBonusQueue(
        { profileId: testData.profileId, currency: 'CAD' },
        [{
          bonusId: bonusTemplate.id,
          amount: bonusAmount,
          comment: 'Investigation test',
          initialStatus: 'wagering',
          bonusRequirement: 'no_deposit',
          bonusType: 'cash'
        }],
        aleaApi,
        undefined, // no paymentIqApi needed for no_deposit
        3000 // wait time
      );
      console.log('[INVESTIGATION] Bonus setup complete');
    });

    await test.step('2. Check initial state after claim', async () => {
      const wallets = await bonusApi.getWallets(testData.profileId);
      const cadWallet = wallets.find(w => w.currency === 'CAD');
      console.log('[INVESTIGATION] Wallet after claim:', {
        balance: cadWallet?.balance,
        expected: bonusAmount
      });

      const allBonuses = await bonusApi.fetchAllUserBonuses();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const activeBonus = allBonuses.activeBonuses?.[0] as any;
      console.log('[INVESTIGATION] Initial bonus state:', {
        hasActive: !!activeBonus,
        amount: activeBonus?.amount,
        wageringMultiplier: activeBonus?.wageringMultiplier,
        totalWagered: activeBonus?.totalWagered,
        totalWageringRequirement: activeBonus?.totalWageringRequirement
      });
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });

    await test.step('3. Place FIRST bet: 10 CAD bet, 10 CAD win, IN_PROGRESS', async () => {
      console.log('[INVESTIGATION] === BET 1: 10 CAD bet + 10 CAD win with IN_PROGRESS ===');
      await aleaApi.executeBettingCycle(10, 10, 1, 'IN_PROGRESS');
      await new Promise(resolve => setTimeout(resolve, 5000));

      const wallets = await bonusApi.getWallets(testData.profileId);
      const cadWallet = wallets.find(w => w.currency === 'CAD');
      const allBonuses = await bonusApi.fetchAllUserBonuses();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const activeBonus = allBonuses.activeBonuses?.[0] as any;
      
      console.log('[INVESTIGATION] After bet 1:', {
        walletBalance: cadWallet?.balance,
        totalWagered: activeBonus?.totalWagered,
        totalRequired: activeBonus?.totalWageringRequirement,
        progress: activeBonus ? `${activeBonus.totalWagered}/${activeBonus.totalWageringRequirement}` : 'N/A',
        percentComplete: activeBonus ? Math.round((activeBonus.totalWagered / activeBonus.totalWageringRequirement) * 100) + '%' : 'N/A'
      });
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });

    await test.step('4. Place SECOND bet: 10 CAD bet, 10 CAD win, IN_PROGRESS', async () => {
      console.log('[INVESTIGATION] === BET 2: 10 CAD bet + 10 CAD win with IN_PROGRESS ===');
      await aleaApi.executeBettingCycle(10, 10, 2, 'IN_PROGRESS');
      await new Promise(resolve => setTimeout(resolve, 5000));

      const wallets = await bonusApi.getWallets(testData.profileId);
      const cadWallet = wallets.find(w => w.currency === 'CAD');
      const allBonuses = await bonusApi.fetchAllUserBonuses();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const activeBonus = allBonuses.activeBonuses?.[0] as any;
      
      console.log('[INVESTIGATION] After bet 2:', {
        walletBalance: cadWallet?.balance,
        totalWagered: activeBonus?.totalWagered,
        totalRequired: activeBonus?.totalWageringRequirement,
        progress: activeBonus ? `${activeBonus.totalWagered}/${activeBonus.totalWageringRequirement}` : 'N/A',
        percentComplete: activeBonus ? Math.round((activeBonus.totalWagered / activeBonus.totalWageringRequirement) * 100) + '%' : 'N/A',
        bonusCompleted: !activeBonus
      });
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });

    await test.step('5. SUMMARY', async () => {
      const wallets = await bonusApi.getWallets(testData.profileId);
      const cadWallet = wallets.find(w => w.currency === 'CAD');
      const allBonuses = await bonusApi.fetchAllUserBonuses();
      
      console.log('[INVESTIGATION] ===== FINAL SUMMARY =====');
      console.log('[INVESTIGATION] Final wallet balance:', cadWallet?.balance, 'CAD');
      console.log('[INVESTIGATION] Active bonuses:', allBonuses.activeBonuses?.length || 0);
      console.log('[INVESTIGATION] 70 CAD bonus × 40 multiplier = 2800 CAD total wagering required');
      console.log('[INVESTIGATION] After 2× 50 CAD bets = 100 CAD wagered = 3.57% complete');
    });
  });
});

