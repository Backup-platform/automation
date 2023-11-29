// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.overwrite("log", function(log, ...args) {
    if (Cypress.browser.isHeadless) {
        return cy.task("log", args, { log: false }).then(() => {
            return log(...args);
        });
    } else {
        console.log(...args);
        return log(...args);
    }
});

Cypress.on('uncaught:exception', (error, runnable) => {
    return false;
});