import test, { expect } from '../../../pages/base/base.po';
import { BonusPage, BonusBusiness } from '../../../pages/bonuses';

test.beforeEach(async ({ page }) => {
  await page.goto(`${process.env.URL}`, { waitUntil: 'domcontentloaded' });
});

test.describe.skip('Basic Activation + Cancellation Tests', () => {
  test('S1 - Cash-NoDeposit activation and cancellation', async ({ page, bonusCard }) => {
    // Create the POM layers
    const bonusPage = new BonusPage(page);
    const bonusBusiness = new BonusBusiness(bonusCard, bonusPage);
    
    // Prerequisite: 0 bonuses
    // TODO: Implement these methods in BonusBusiness when smoke tests are enabled
    // await bonusBusiness.clickActivateByName(['Available Cash-NoDeposit']);
    // await bonusBusiness.validateActiveTabContent();
    // Action 1: Activate "Available Cash-NoDeposit becomes Active"
    // Action 2: Cancel active bonus
    // Result 1: Bonus becomes active/wagering
    // Result 2: Bonus disappears completely
    // Validation: Button states, progress bar, tab movements, specific wallet amounts
  });

  test('S2 - Cash-Deposit activation and cancellation', async () => {
    // Prerequisite: 0 bonuses
    // Action 1: Activate "Available Cash-Deposit becomes Active"
    // Action 2: Cancel active bonus
    // Result 1: Bonus becomes active/wagering
    // Result 2: Bonus disappears completely
    // Validation: Button states, progress bar, tab movements, specific wallet amounts
  });

  test('S3 - FS-NoDeposit activation and cancellation', async () => {
    // Prerequisite: 0 bonuses
    // Action 1: Activate "Available FS-NoDeposit becomes Active"
    // Action 2: Cancel active bonus
    // Result 1: Bonus becomes active/wagering
    // Result 2: Bonus disappears completely
    // Validation: Button states, progress bar, tab movements, specific wallet amounts
  });

  test('S4 - FS-Deposit activation and cancellation', async () => {
    // Prerequisite: 0 bonuses
    // Action 1: Activate "Available FS-Deposit becomes Active"
    // Action 2: Cancel active bonus
    // Result 1: Bonus becomes active/wagering
    // Result 2: Bonus disappears completely
    // Validation: Button states, progress bar, tab movements, specific wallet amounts
  });
});

test.describe('Additional Smoke Tests', () => {
  test.only("Test wallet dropdown balance reading", async ({ page, wallet }) => {
    console.log('🎯 Testing wallet dropdown functionality...');
    
    await page.goto(`${process.env.URL}/casino`);
    
    // Test reading balance from collapsed state
    await test.step('Read balance from collapsed state', async () => {
      const collapsedBalance = await wallet.getBalanceFromCollapsed();
      console.log(`💰 Collapsed balance: ${collapsedBalance}`);
    });

    // Test reading balance using dropdown methods
    await test.step('Read balance using dropdown methods', async () => {
      const totalBalance = await wallet.getTotalFromDropdown();
      const bonusBalance = await wallet.getBonusFromDropdown();
      const realMoneyBalance = await wallet.getRealMoneyFromDropdown();
      
      console.log(`💰 Balance readings:
      Total: ${totalBalance}
      Bonus: ${bonusBalance}  
      Real Money: ${realMoneyBalance}`);
    });
  });

  test("Zero out 40 CAD bonus by betting, verify amounts are accurate", async ({ page, bonusApi, testData, aleaApi, wallet }) => {
    console.log('🎯 Starting bonus zero-out test with amount validation...');
    
    // Setup bonuses in order: 40 CAD first (should be active), 30 CAD second (should be pending)
    await bonusApi.setupBonusQueue(testData, [
      { bonusId: 1770764, amount: 40, comment: 'Active 40 CAD bonus for zero-out' },
      { bonusId: 1770764, amount: 30, comment: 'Pending 30 CAD bonus' }
    ]);
    
    // Get initial balances using dropdown
    await test.step('Read initial wallet balances from dropdown', async () => {
      const initialRealMoney = await wallet.getRealMoneyFromDropdown();
      const initialBonus = await wallet.getBonusFromDropdown();
      const initialTotal = await wallet.getTotalFromDropdown();
      
      console.log(`💰 Initial balances from dropdown:
      Real Money: ${initialRealMoney}
      Bonus: ${initialBonus}
      Total: ${initialTotal}`);
    });

    // Zero out the 40 CAD bonus by betting
    const totalBonusAmount = 40; // This should be the active bonus amount
    const betAmount = 1;
    const numBets = Math.ceil(totalBonusAmount / betAmount);

    console.log(`🎲 Will place ${numBets} bets of ${betAmount} CAD each to zero out ${totalBonusAmount} CAD bonus`);

    for (let i = 0; i < numBets; i++) {
      await test.step(`Bet ${i + 1}/${numBets}: Betting ${betAmount} CAD`, async () => {
        await aleaApi.placeBet({ amount: betAmount });
        console.log(`🎯 Bet ${i + 1} placed - ${betAmount} CAD`);
        
        // Small delay to allow balance updates
        await page.waitForTimeout(100);
      });
    }

    console.log(`✅ Completed ${numBets} bets, total wagered: ${numBets * betAmount} CAD`);

    // Check final balances using dropdown
    await test.step('Verify final wallet balances from dropdown', async () => {
      // Wait a moment for balance to update
      await page.waitForTimeout(1000);
      
      const finalRealMoney = await wallet.getRealMoneyFromDropdown();
      const finalBonus = await wallet.getBonusFromDropdown();
      const finalTotal = await wallet.getTotalFromDropdown();
      
      console.log(`💰 Final balances from dropdown:
      Real Money: ${finalRealMoney}
      Bonus: ${finalBonus}
      Total: ${finalTotal}`);

      // Verify the bonus is zeroed out
      expect(finalBonus).toBe('0.00 CAD');
    });
  });

  test('S5 - Tab navigation and content validation', async () => {
    // Prerequisite: 1 "Active FS-Deposit in Active Tab" + 2 pending + 3 available (6 total)
    // Action: Navigate through all tabs
    // Expected Result: Each tab shows correct bonuses with proper filtering
    // Validation: Tab filtering, bonus counts, ordering
  });

  test('S6 - Card element validation for all bonus types', async ({ page, bonusCard }) => {
    // Create the POM layers
    const bonusPage = new BonusPage(page);
    const bonusBusiness = new BonusBusiness(bonusCard, bonusPage);
    
    // Prerequisite: 4 available bonuses (1 of each type)
    // Action: Validate card elements + click "More Info" on each
    // Expected Result: All cards show correct UI elements and additional info
    // Validation: Card UI validation, button text (Claim vs Deposit), more info functionality
    // TODO: Implement card element validation methods when smoke tests are enabled
  });

  test('S7 - Rapid clicking protection on Claim button', async ({ page, bonusCard }) => {
    // Create the POM layers
    const bonusPage = new BonusPage(page);
    const bonusBusiness = new BonusBusiness(bonusCard, bonusPage);
    
    // Prerequisite: 1 "Available Cash-NoDeposit for rapid clicking test"
    // Action: Click Claim button rapidly 5+ times
    // Expected Result: Only one activation occurs
    // Validation: NoDeposit rapid click protection
    // TODO: Implement rapid clicking protection test when smoke tests are enabled
  });
});
