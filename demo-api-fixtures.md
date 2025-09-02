# API Fixtures Implementation - Before vs After

## Summary

We've successfully implemented the API fixtures pattern to eliminate repetitive BonusApiFactory setup in every test. This provides cleaner test syntax and better maintainability.

## Before (Old Pattern)
Every test required manual API client setup:

```typescript
test('Some bonus test', async ({ request, page, menuItems, profileMenu }) => {
  // Repetitive setup in every test
  const bonusApi: BonusApiClient = BonusApiFactory.createStageClient(request);
  const testData: TestData = BonusApiFactory.getDefaultTestData();
  const aleaApi = await BonusApiFactory.createAleaClientWithSession(
    request, 'stage', 'mpetrov15@sbtsolution.com', 'Mpetrov15@sbtsolution.com'
  );
  
  // Test implementation...
  await bonusApi.setupBonusQueue(testData, bonusSetup);
  await aleaApi.getBalance();
});
```

## After (New Fixtures Pattern)
API clients are automatically provided as fixtures:

```typescript
test('Some bonus test', async ({ bonusApi, testData, aleaApi, page, menuItems, profileMenu }) => {
  // Clean test with pre-configured API clients
  await bonusApi.setupBonusQueue(testData, bonusSetup);
  await aleaApi.getBalance();
  
  // Focus on test logic, not setup
});
```

## Benefits

1. **Reduced Boilerplate**: Eliminated 4-5 lines of repetitive setup per test
2. **Better Readability**: Tests focus on business logic, not infrastructure
3. **Consistency**: All API clients configured the same way
4. **Maintainability**: Configuration changes happen in one place
5. **Type Safety**: Full TypeScript support for all fixtures

## Implementation Details

### New Folder Structure
```
libs/page-objects/src/
├── api/
│   ├── bonus/
│   │   ├── bonusApi.ts
│   │   └── bonusApiFactory.ts
│   ├── alea/
│   │   └── aleaApi.ts
│   └── fixtures/
│       └── apiFixtures.ts
```

### Fixture Functions
- `createBonusApiFixture()` - Pre-configured BonusApiClient
- `createAleaApiFixture()` - Pre-configured AleaApiClient  
- `createTestDataFixture()` - Default test data

### Integration
- Combined with existing page object fixtures in `base.po.ts`
- Available in all tests that use `test` from `base.po.ts`
- No breaking changes to existing tests

## Usage Examples

### Bonus Setup Test
```typescript
test('Setup bonus queue', async ({ bonusApi, testData }) => {
  await bonusApi.setupBonusQueue(testData, [
    { bonusId: 1770616, amount: 100, comment: 'Test bonus' }
  ]);
});
```

### Balance Check Test  
```typescript
test('Check balance', async ({ aleaApi }) => {
  const balance = await aleaApi.getBalance();
  expect(balance).toBeGreaterThan(0);
});
```

### Combined API Operations
```typescript
test('Full bonus workflow', async ({ bonusApi, aleaApi, testData }) => {
  await bonusApi.setupBonusQueue(testData, bonusSetup);
  const initialBalance = await aleaApi.getBalance();
  // ... test logic
  const finalBalance = await aleaApi.getBalance();
  expect(finalBalance).toBeGreaterThan(initialBalance);
});
```

## Migration Path

To migrate existing tests:
1. Replace `{ request, ... }` with `{ bonusApi, testData, aleaApi, ... }`
2. Remove manual `BonusApiFactory.createStageClient(request)` calls
3. Remove manual `BonusApiFactory.getDefaultTestData()` calls  
4. Remove manual `BonusApiFactory.createAleaClientWithSession()` calls
5. Use the provided fixtures directly

This change will save significant time in the 541-line `bonuses.spec.ts` file and improve test maintainability across the entire codebase.
