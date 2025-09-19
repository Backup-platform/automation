// Quick debug script to check card structure
const { test, expect } = require('@playwright/test');

test('Debug cards', async ({ page }) => {
  // Navigate to bonuses page
  await page.goto('https://stage.grandzbet7.com/en/?openBonuses=true');
  
  // Wait for page load
  await page.waitForTimeout(3000);
  
  // Check if cards exist
  const cards = await page.locator('[data-testid="bonus-card"]').all();
  console.log(`Found ${cards.length} cards`);
  
  // Check each card
  for (let i = 0; i < cards.length; i++) {
    try {
      const titleElements = await cards[i].locator('h5').all();
      console.log(`Card ${i}: Found ${titleElements.length} h5 elements`);
      
      for (let j = 0; j < titleElements.length; j++) {
        const text = await titleElements[j].textContent();
        console.log(`  H5 ${j}: "${text}"`);
      }
    } catch (error) {
      console.log(`Error with card ${i}:`, error);
    }
  }
});
