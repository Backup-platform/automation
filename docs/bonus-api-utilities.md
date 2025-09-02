# Bonus API Utilities

This module provides Playwright-compatible API utilities for testing bonus functionality. It converts your Postman collection requests into reusable TypeScript functions that can be integrated with your existing page object tests.

**Location**: `libs/page-objects/src/` - Co-located with bonus page objects for better organization.

## Quick Start

### Basic Usage

```typescript
import { test } from '@playwright/test';
import { BonusApiFactory } from '@sbt-monorepo/page-objects';

test('my bonus test', async ({ request }) => {
  // Create API client
  const bonusApi = BonusApiFactory.createStageClient(request);
  
  // Fetch bonuses
  const bonuses = await bonusApi.fetchAllUserBonuses();
  console.log('Active bonuses:', bonuses.activeBonuses?.length || 0);
});
```

### With Custom Credentials

```typescript
import { BonusApiFactory } from '@sbt-monorepo/page-objects';

const bonusApi = BonusApiFactory.create(request, {
  environment: 'stage',
  username: 'your-email@example.com',
  password: 'your-password'
});
```

## Available Methods

### Authentication
- `getFrontOfficeToken()` - Get token for front office operations
- `getBackOfficeToken()` - Get token for back office operations
- `clearTokens()` - Clear stored tokens
- `getTokens()` - Get current token state

### Bonus Data Fetching
- `fetchAllUserBonuses(locale?)` - Fetch all bonus types (active, pending, issued, free spins)
- `fetchActiveBonuses(locale?)` - Fetch only active bonuses
- `fetchPendingBonuses(locale?)` - Fetch only pending bonuses
- `fetchAvailableBonuses(locale?)` - Fetch only available (issued) bonuses

### Bonus Actions
- `grantBonus(data)` - Grant bonus via back office
- `claimProfileBonus(id, currency, transactionId?)` - Claim bonus via front office
- `cancelProfileBonus(id, comment?)` - Cancel bonus via back office
- `cancelBonus(id)` - Cancel bonus via front office
- `claimBonus(id)` - Claim bonus via front office

### Validation
- `validateBonusCardStructure(locale?)` - Validate API response structure

## Integration with Page Objects

### Example: API + UI Validation

```typescript
import { test, expect } from '@playwright/test';
import { BonusApiFactory } from '@sbt-monorepo/page-objects';
// import { BonusesPage } from '../pages/bonuses.po'; // Your page object

test('validate bonus data consistency', async ({ page, request }) => {
  const bonusApi = BonusApiFactory.createStageClient(request);
  
  // Get data from API
  const apiData = await bonusApi.fetchActiveBonuses();
  
  // Navigate to UI and compare
  await page.goto('/account/bonuses');
  // const bonusesPage = new BonusesPage(page);
  // const uiCount = await bonusesPage.getActiveBonusCount();
  // expect(uiCount).toBe(apiData.length);
});
```

### Example: Test Data Setup

```typescript
test('grant and claim bonus flow', async ({ page, request }) => {
  const bonusApi = BonusApiFactory.createStageClient(request);
  const testData = BonusApiFactory.getDefaultTestData();
  
  // Step 1: Grant bonus via API
  await bonusApi.grantBonus({
    bonusId: testData.bonusId,
    profileId: testData.profileId,
    bonusAmount: 25,
    comment: 'Test bonus'
  });
  
  // Step 2: Verify in UI
  await page.goto('/account/bonuses');
  // Use your page objects to interact with UI
  
  // Step 3: Claim via API
  const bonuses = await bonusApi.fetchAvailableBonuses();
  if (bonuses.length > 0) {
    await bonusApi.claimProfileBonus(
      bonuses[0].profileBonus.id,
      testData.currency
    );
  }
});
```

## Configuration

### Environment Support
- `stage` - Stage environment (default)
- `prod` - Production environment  
- `dev` - Development environment

### Default Test Data
```typescript
const testData = BonusApiFactory.getDefaultTestData();
// Returns:
// {
//   bonusId: 1770764,
//   profileId: 254171,
//   bonusAmount: 10,
//   profileBonusId: '1774254',
//   currency: 'CAD',
//   comment: 'test'
// }
```

## Advanced Usage

### Custom Environment Configuration

```typescript
import { BonusApiClient } from '@sbt-monorepo/page-objects';

const customConfig = {
  baseUrl: 'https://your-custom-gw.com',
  authUrl: 'https://your-keycloak.com',
  backofficeUrl: 'https://your-backoffice-gw.com',
  username: 'user@example.com',
  password: 'password'
};

const bonusApi = new BonusApiClient(request, customConfig);
```

### Error Handling

```typescript
try {
  const result = await bonusApi.grantBonus(data);
  console.log('Success:', result);
} catch (error) {
  console.error('API call failed:', error.message);
  // Handle error appropriately
}
```

### Utility Functions

The `BonusTestUtils` class provides additional helpers:

```typescript
import { BonusTestUtils } from '../tests/utils/bonusApiIntegration.spec';

const utils = new BonusTestUtils(page, bonusApi);

// Set up test data
const bonusId = await utils.setupTestBonus(50);

// Wait for specific condition
await utils.waitForBonusCondition(
  (bonuses) => bonuses.activeBonuses.length > 0
);

// Clean up after test
await utils.cleanupTestBonuses();
```

## Corresponding Postman Requests

Each method corresponds to a request in your `bonus-testing.postman_collection.json`:

| API Method | Postman Request |
|------------|----------------|
| `getFrontOfficeToken()` | Get FrontOffice Token |
| `getBackOfficeToken()` | Get BackOffice Token |
| `fetchAllUserBonuses()` | Fetch All User Bonuses |
| `fetchActiveBonuses()` | Fetch Active Bonuses Only |
| `fetchPendingBonuses()` | Fetch Pending Bonuses Only |
| `fetchAvailableBonuses()` | Fetch Available Bonuses Only |
| `grantBonus()` | Grant Bonus (BackOffice) |
| `claimProfileBonus()` | Claim Profile Bonus (FrontOffice) |
| `cancelProfileBonus()` | Cancel Profile Bonus (BackOffice) |
| `cancelBonus()` | Cancel Bonus |
| `claimBonus()` | Claim Bonus |
| `validateBonusCardStructure()` | Validate Bonus Card Structure |

## TypeScript Types

All methods are fully typed. Key interfaces:

```typescript
interface UserBonus {
  bonusId: number;
  cmsBonus: Record<string, unknown> | null;
  canCancel: boolean;
  profileBonus: ProfileBonus;
}

interface BonusResponse {
  status: string;
  message: string;
  description: string;
}

interface UserBonusesResponse {
  activeBonuses?: UserBonus[];
  pendingBonuses?: UserBonus[];
  issuedBonuses?: UserBonus[];
  freeSpinsWaitingBonuses?: UserBonus[];
}
```

## Best Practices

1. **Always authenticate first** - Methods will auto-authenticate if needed
2. **Use test data constants** - Use `BonusApiFactory.getDefaultTestData()` for consistency
3. **Handle different environments** - Use the factory for different environments
4. **Combine with UI tests** - Use API for setup/validation, UI for user interactions
5. **Clean up test data** - Remove test bonuses after tests complete
6. **Error handling** - Wrap API calls in try-catch blocks
7. **Parameterize tests** - Use collection variables equivalent data structures

## Troubleshooting

### Common Issues

**Authentication Failures:**
```typescript
// Clear tokens and retry
bonusApi.clearTokens();
await bonusApi.getFrontOfficeToken();
```

**Network Timeouts:**
- Check environment URLs in `BonusApiFactory.ENVIRONMENT_CONFIGS`
- Verify credentials are correct
- Ensure test environment is accessible

**Type Errors:**
- Import types explicitly: ````typescript
// Import types explicitly: `import { type UserBonus } from '@sbt-monorepo/page-objects'``
- Check that response structure matches expected interfaces

### Debug Information

```typescript
// Check token state
console.log('Tokens:', bonusApi.getTokens());

// Validate API structure
const isValid = await bonusApi.validateBonusCardStructure();
console.log('API structure valid:', isValid);

// Log detailed responses
const bonuses = await bonusApi.fetchAllUserBonuses();
console.log('API Response:', JSON.stringify(bonuses, null, 2));
```
