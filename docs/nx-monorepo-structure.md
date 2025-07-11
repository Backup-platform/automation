# Nx Monorepo Structure

Our test automation framework uses Nx to organize multiple test projects and shared libraries in one repository. This guide explains how projects are structured and how to work with them.

## What is a Monorepo?

A **monorepo** (monolithic repository) is a software development strategy where code for multiple related projects is stored in a single repository. Unlike traditional approaches where each project has its own repository, a monorepo contains multiple projects that can share code, dependencies, and tooling.

### Key Monorepo Concepts:

- **Single repository** - All projects live in one Git repository
- **Shared dependencies** - Common libraries and tools are shared across projects
- **Coordinated releases** - Changes can be tested across all projects simultaneously
- **Code sharing** - Utilities and common code can be easily reused
- **Unified tooling** - Same build tools, testing frameworks, and CI/CD across projects

### Our Automation-Focused Monorepo

Unlike typical application monorepos that build and deploy software products, our monorepo is specifically designed for **test automation**. We're not building applications to ship to users - instead, we're organizing test suites and shared testing utilities that validate different applications and APIs.

## About Nx

Nx is a build system that manages multiple projects in one repository while keeping them organized and optimized. Each project has clear boundaries and dependencies, with powerful caching and task orchestration.

## Repository Structure

```
automation/                           # Root workspace
├── apps/                            # Test application projects
│   ├── aleaAPI/                     # API testing suite
│   ├── grandzbet-e2e/               # GrandZbet E2E test suite
│   └── spaceFortuna-e2e/            # SpaceFortuna E2E test suite
├── libs/                            # Shared libraries
│   ├── page-objects/                # Shared page object utilities
│   └── test-utils/                  # Helper functions & utilities
├── docs/                            # Project documentation
├── instructions/                    # Setup and usage instructions
├── dist/                           # Build outputs (generated)
├── test-results/                   # Test execution results (generated)
├── playwright-report/              # HTML test reports (generated)
├── tmp/                           # Temporary files (generated)
├── .nx/                           # Nx cache (generated)
├── nx.json                        # Nx workspace configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.base.json             # Base TypeScript configuration
├── tsconfig.json                  # Root TypeScript configuration
├── eslint.config.mjs              # ESLint configuration
├── playwright.config.ts           # Root Playwright configuration
└── README.md                      # Project overview
```

## Project Types

### Apps (Test Application Projects)

Test projects that can be run independently. Each represents a complete test suite for a specific application or API:

**`aleaAPI`** - API testing suite for Alea services. Tests REST endpoints, validates responses, and checks data integrity.

**`grandzbet-e2e`** - End-to-end test suite for GrandZbet application. Tests complete user workflows, UI interactions, and business scenarios.

**`spaceFortuna-e2e`** - End-to-end test suite for SpaceFortuna application. Tests promotions, UI components, and user journeys.

### Libs (Shared Libraries)

Reusable code that multiple test projects can import and use:

**`page-objects`** - Common page object patterns, base classes, and utilities used across E2E test projects.

**`test-utils`** - Helper functions for assertions, interactions, text extraction, attribute validation, and general utilities.

## Project Dependencies

```
grandzbet-e2e     spaceFortuna-e2e     aleaAPI
      ↓                  ↓                ↓
   page-objects      page-objects    (minimal deps for now)
      ↓                  ↓                
   test-utils         test-utils      
```

- **E2E projects** depend on both `page-objects` and `test-utils` libraries
- **API projects** primarily use `test-utils` for helper functions (may use some page-objects utilities)
- **Libraries** can depend on other libraries but never on app projects
- **No circular dependencies** - clear hierarchy prevents dependency conflicts

### Import Examples

```typescript
// In E2E projects (grandzbet-e2e, spaceFortuna-e2e)
import { assertVisible, clickElement } from '@test-utils';
import { basePage } from '@page-objects';

// In API projects (aleaAPI)
import { assertVisible, getText } from '@test-utils';

// In any project using test-utils
import { compositeLocator, fillInputField } from '@test-utils';
```

## Basic Nx Commands

```bash
# Run specific project tests
nx run grandzbet-e2e:test
nx run spaceFortuna-e2e:test  
nx run aleaAPI:test
nx run test-utils:validate-helpers

# Run with specific configurations
nx run grandzbet-e2e:test:smoke
nx run grandzbet-e2e:test:regression

# Run multiple projects
nx run-many --target=test --projects=grandzbet-e2e,spaceFortuna-e2e

# Run only affected projects (based on git changes)
nx affected:test
```

## Key Benefits of Our Monorepo Structure

- **Project isolation** - Each test suite runs independently with its own configuration
- **Code reuse** - Shared libraries eliminate duplication of common testing utilities
- **Consistency** - Same patterns and helper functions across all test projects
- **Scalability** - Easy to add new test suites for additional applications
- **Performance** - Nx caching speeds up test runs and builds
- **Coordinated testing** - Run tests across multiple applications to validate integrations
- **Clear boundaries** - No circular dependencies, clean separation of concerns
- **Shared tooling** - Same TypeScript config, ESLint rules, and Playwright setup

## Monorepo vs Traditional Approach

**Traditional approach:** Each test suite in its own repository
- ❌ Duplicated helper functions across repositories
- ❌ Inconsistent patterns and configurations
- ❌ Difficult to share improvements across test suites
- ❌ Complex dependency management

**Our monorepo approach:** All test suites and shared utilities in one repository
- ✅ Shared helper functions and patterns
- ✅ Consistent configuration across all test projects
- ✅ Easy to propagate improvements to all test suites
- ✅ Simplified dependency management and versioning

## Development Tips

### Adding New Test Suites

1. **Choose the right location**: 
   - API tests → Create new project in `apps/` (e.g., `apps/newAPI/`)
   - UI tests → Create new project in `apps/` (e.g., `apps/newApp-e2e/`)

2. **Use shared libraries**:
   - Import helpers from `@test-utils`
   - Use page object patterns from `@page-objects` (for UI tests)

3. **Follow naming conventions**:
   - API projects: `{serviceName}API`
   - E2E projects: `{appName}-e2e`

### Adding Helper Functions

1. Add to appropriate module in `test-utils` library (`libs/test-utils/src/`)
2. Write validation tests in `libs/test-utils/src/validation-tests/`
3. Export from `libs/test-utils/src/index.ts`
4. Update documentation if needed

### Adding Shared Page Objects

1. Add to `page-objects` library (`libs/page-objects/src/`)
2. Use composite locators and helper functions
3. Export from `libs/page-objects/src/index.ts`

## Why This Structure Works for Test Automation

Our monorepo structure is specifically designed for test automation needs:

1. **Multiple test targets** - Different applications (GrandZbet, SpaceFortuna) and APIs (Alea) can be tested independently
2. **Shared testing utilities** - Common patterns like composite locators and helper functions are reused across all test suites
3. **Consistent reporting** - Same test step structure and reporting across all projects
4. **Coordinated releases** - Changes to shared libraries automatically propagate to all test projects
5. **Efficient CI/CD** - Nx affected commands run only the tests that need to run based on code changes

This structure scales well as new applications need testing - simply add a new project in `apps/` and leverage the existing shared libraries and patterns.

Understanding this structure helps you navigate the codebase and contribute effectively to the test automation framework.
