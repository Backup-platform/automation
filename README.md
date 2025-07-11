# Test Automation Framework

A comprehensive Playwright test automation framework built with Nx monorepo for gaming platform testing.

## Overview

This project provides automated testing for multiple gaming platforms using Playwright and TypeScript, organized in an Nx monorepo structure for scalability and maintainability.

### Test Applications

- **`grandzbet-e2e`** - Main E2E test suite for GrandZbet platform
- **`spaceFortuna-e2e`** - E2E tests for SpaceFortuna platform  
- **`aleaAPI`** - API testing suite for Alea gaming services
- **`test-utils`** - Shared helper functions and utilities library

### Goals

- **Reliable Testing** - Robust test automation across multiple gaming platforms
- **Modular Design** - Reusable helper functions and page objects
- **Developer Experience** - Easy-to-use commands and clear documentation
- **Scalability** - Nx monorepo structure for managing multiple test projects

## Quick Start

### Prerequisites

- Node.js (latest LTS)
- npm or yarn

### Installation

```bash
# Clone and install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Verify Setup

```bash
# Run helper validation tests
nx run test-utils:validate-helpers

# Run smoke tests
nx run grandzbet-e2e:test:smoke

# Open interactive test UI
nx run grandzbet-e2e:test:ui
```

### Basic Commands

```bash
# Run all tests for a project
nx run grandzbet-e2e:test
nx run spaceFortuna-e2e:test
nx run aleaAPI:test

# Interactive testing
nx run grandzbet-e2e:test:ui

# View test reports
nx run grandzbet-e2e:show-report
```

## Documentation

Comprehensive documentation is available in the `docs/` folder:

## Project Structure

```
apps/
  grandzbet-e2e/       # Main E2E test suite
  spaceFortuna-e2e/    # SpaceFortuna tests
  aleaAPI/             # API testing
libs/
  test-utils/          # Shared utilities and helpers
  page-objects/        # Reusable page objects
docs/                  # Documentation
```

## Development

All commands should be run from the project root directory.

### Running Tests

- Use `nx run project:test` for basic test execution
- Use `nx run project:test:ui` for interactive debugging
- See [Running Tests and Commands](docs/running-tests-and-commands.md) for complete reference

## Getting Help

- Check the `docs/` folder for detailed guides
- Use `nx run project:test --help` to see available options
- Run `nx list` to see all available commands
