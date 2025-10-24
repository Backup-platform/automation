# Backoffice Wallet Transfer Authorization Issue

## Summary
The `automationuser` backoffice account successfully authenticates and has extensive Keycloak roles but **cannot execute the `updateBalance` mutation** due to application-level authorization restrictions.

## Evidence

### ✅ What Works
1. **Authentication**: `automationuser` successfully obtains backoffice token from Keycloak
2. **Token Validation**: Token is valid and contains extensive roles
3. **Wallet Query**: `wallets(profileId)` query succeeds and returns wallet data
4. **Keycloak Roles**: User has comprehensive role assignments:
   - `admin`
   - `operations-admin`
   - `operations`
   - `management`
   - `customer-support`
   - `kyc`
   - And many realm-management roles

### ❌ What Fails
**Mutation**: `updateBalance` with the following error:
```json
{
  "message": "Authorization exception",
  "path": ["updateBalance"],
  "extensions": {
    "classification": "DataFetchingException",
    "code": "forbidden",
    "exception": "io.zerodt.casino.infrastructure.exceptions.ForbiddenException"
  }
}
```

## Comparison with Working User

### Working User: "misho"
- **Username**: `misho`
- **Keycloak Roles**: `operations`, `operations-admin` (fewer roles than automationuser)
- **Can Execute**: `updateBalance` mutation ✅
- **Evidence**: HAR file from manual browser session (2025-10-21 17:13:28)

### Failing User: "automationuser"
- **Username**: `automationuser`
- **Keycloak Roles**: `admin`, `operations-admin`, `operations`, `management`, `customer-support`, `kyc` (more roles)
- **Can Execute**: `updateBalance` mutation ❌
- **Error**: `ForbiddenException` at application layer

## Request Comparison

### Working Request (misho)
```json
{
  "operationName": "TransferMoney",
  "variables": {
    "transfer": {
      "amount": 60,
      "currency": "CAD",
      "deposit": false,
      "reason": "COMPENSATION",
      "comment": ""
    },
    "walletId": 1794900,
    "password": [84, 101, 115, 116, 112, 97, 115, 115, 49, 50, 51, 33]
  }
}
```
**Result**: HTTP 200, mutation succeeded

### Failing Request (automationuser)
```json
{
  "operationName": "TransferMoney",
  "variables": {
    "transfer": {
      "amount": 10,
      "currency": "CAD",
      "deposit": false,
      "reason": "COMPENSATION",
      "comment": "Test wallet clear"
    },
    "walletId": 1794900,
    "password": [84, 101, 115, 116, 112, 97, 115, 115, 49, 50, 51, 33]
  }
}
```
**Result**: HTTP 200, but GraphQL error with `code: "forbidden"`

## Analysis

### Authorization Layer
The authorization check occurs at the **application/service layer** (GraphQL resolver), NOT at the Keycloak level:
- Keycloak authentication: ✅ Success (token issued)
- Keycloak role check: ✅ Bypassed (user has all necessary Keycloak roles)
- **Application permission check**: ❌ Failed (`ForbiddenException`)

### Hypothesis
The backend service implements **user-specific permissions** beyond Keycloak roles. This could be:
1. **Database-level user permissions table** mapping users to allowed operations
2. **User attribute/group membership** not reflected in JWT token
3. **Hardcoded allow-list** for wallet management operations
4. **Audit trail requirement** requiring specific user accounts for financial operations

## Diagnostic Test Results

### Test File
`apps/grandzbet-e2e/tests/regression/desktop/backoffice-wallet-transfer.spec.ts`

### Test Outcomes
1. ✅ **Token acquisition**: Success
2. ✅ **Token claims inspection**: Shows all expected roles
3. ✅ **Wallet query**: Returns wallet data successfully
4. ❌ **Wallet transfer**: ForbiddenException

### Test Command
```powershell
npx nx test grandzbet-e2e -- --grep "Test backoffice wallet transfer directly"
```

## Requested Action

### Option 1: Grant Permission (Preferred)
Grant the `automationuser` the required application-level permission to execute `updateBalance` mutation.

**Steps**:
1. Identify the permission system (database table, config file, service layer)
2. Add `automationuser` to the wallet management allow-list
3. Verify the permission is applied (may require cache clear or service restart)

### Option 2: Provide Alternative Account
Provide automation team with credentials for a backoffice user that has wallet transfer permissions (similar to "misho" user).

**Requirements**:
- Username and password for programmatic access
- Environment variables:
  - `BACKOFFICE_USER`: username with wallet permissions
  - `BACKOFFICE_PASS`: corresponding password

### Option 3: Service Configuration
If authorization is role-based but with different role names, update the service configuration to accept `operations-admin` role for `updateBalance` mutation.

## Impact on Testing

### Current Workaround
Tests handle the authorization failure gracefully:
- Wallet normalization methods catch the error and log warnings
- Test execution continues (non-blocking)
- Main bonus cancellation scenario passes

### Desired State
With proper permissions:
- Clean wallet baseline before tests (normalize to 0)
- Accurate post-test wallet validation
- Proper test data cleanup after test execution
- Deterministic test results with controlled wallet states

## Contact
**Automation Team**: Ready to assist with debugging or implementing alternative approaches once backend configuration is clarified.

**Date**: October 21, 2025
**Branch**: `ENG-6504-casino-bonuses`
**Priority**: Medium (test passing but with warnings)
