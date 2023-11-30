const { getTargetTestTypeFolder, getTargetTestFlag } = require("./util/environment-functions");

module.exports = {
  e2e: {
    specPattern: `cypress/tests/${getTargetTestTypeFolder()}/**/*.cy${getTargetTestFlag()}.{js,jsx,ts,tsx}`,
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
