const getTargetTestTypeFolder = () => {
  return process.env.TARGET_TEST_TYPE || "**";
}

const getTargetTestFlag = () => {
  return process.env.TARGET_TEST_FLAG ? process.env.TARGET_TEST_FLAG + ".*." : "*.";
}

module.exports = {
  e2e: {
    specPattern: `cypress/tests/${getTargetTestTypeFolder()}/**/${getTargetTestFlag()}cy.{js,jsx,ts,tsx}`,
    setupNodeEvents(on, config) {
      on("task", {
        log(args) {
          console.log(...args);
          return null;
        }
      });
    },
  },
};
