# Running Tests

Quick reference for running tests in our Nx monorepo with Playwright.

**Run all commands from the project root directory** (`c:\Users\User\Documents\automation`).

## Test Projects

- **`grandzbet-e2e`** - Main E2E test suite
- **`spaceFortuna-e2e`** - SpaceFortuna E2E tests  
- **`aleaAPI`** - API test suite
- **`test-utils`** - Helper function validation

Commands are defined in each project's `project.json` file under the `targets` section.

## Basic Commands

```bash
# Run all tests
nx run grandzbet-e2e:test
nx run spaceFortuna-e2e:test
nx run aleaAPI:test
nx run test-utils:validate-helpers

# Interactive UI mode
nx run grandzbet-e2e:test:ui
nx run test-utils:validate-helpers:ui

# Debug mode
nx run grandzbet-e2e:test:debug
nx run aleaAPI:test:debug

# View reports
nx run grandzbet-e2e:show-report
nx run aleaAPI:show-report
```

## Test Categories

```bash
# Smoke tests (quick validation)
nx run grandzbet-e2e:test:smoke
nx run spaceFortuna-e2e:test:smoke

# Regression tests (comprehensive)
nx run grandzbet-e2e:test:regression
nx run spaceFortuna-e2e:test:regression

# E2E tests (full workflows)
nx run grandzbet-e2e:test:e2e
nx run spaceFortuna-e2e:test:e2e
```

## Targeting Specific Tests

### Run Single Tests

```bash
# By file path
nx run grandzbet-e2e:test -- tests/smoke/desktop/login.spec.ts

# By test name pattern
nx run grandzbet-e2e:test -- --grep "login"

# Using test.only() in code
test.only("specific test", async ({ page }) => {
  // Test code
});
```

### Test Options

```bash
# Headed mode (visible browser)
nx run grandzbet-e2e:test -- --headed

# Debug mode
nx run grandzbet-e2e:test -- --debug

# Specific project in config
nx run grandzbet-e2e:test -- --project=desktop
```

## Multiple Projects & Performance

```bash
# Run multiple projects
nx run-many --target=test --projects=grandzbet-e2e,spaceFortuna-e2e

# Run only affected tests
nx affected:test

# Skip Nx cache
nx run grandzbet-e2e:test --skip-nx-cache

# Clear cache
nx reset
```

## Quick Reference

**Daily workflow:**
```bash
nx run grandzbet-e2e:test:smoke    # Quick validation
nx run grandzbet-e2e:test:ui       # Interactive development
nx run grandzbet-e2e:test -- --headed  # Debug with visible browser
```

**Specific targeting:**
```bash
nx run grandzbet-e2e:test -- --grep "login"
nx run grandzbet-e2e:test -- tests/smoke/desktop/login.spec.ts
```

Use predefined Nx commands for organized execution and combine with Playwright options for specific test targeting.

**Command locations:**
- `apps/grandzbet-e2e/project.json` - E2E test commands
- `apps/spaceFortuna-e2e/project.json` - SpaceFortuna test commands  
- `apps/aleaAPI/project.json` - API test commands
- `libs/test-utils/project.json` - Helper validation commands
