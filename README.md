# automation
This repository will house the automation tests for the Casino Platform, Front Office &amp; Back Office.

## Prerequisites

### 1. Install Node.js and NPM

You need [Node.js](https://nodejs.org/) and [NPM](https://www.npmjs.com/) installed. If you don’t have them:

- **Windows/MacOS/Linux:**  
  - Go to [https://nodejs.org/en/download/](https://nodejs.org/en/download/) and download the LTS version of Node.js.
  - Follow the installer steps. This will install both Node.js and NPM.
  
- **Check installations:**
  ```bash
  node -v
  npm -v

### 2. Install Playwright (and related dependencies)
    Once you have Node.js and NPM Clone the repository.
    Navigate into the cloned directory
    Install all dependencies including Playwright: npm install
    Install Playwright browsers: npx playwright install

### 3. Running Tests 
    To run all tests: npx playwright test

    If you have specific scripts defined in package.json 
    (for example, to run a set of smoke tests): npm run test:landingPageSmoke
    
### 4. Additional Resources

    Playwright Documentation
    Node.js Documentation
    NPM Documentation
