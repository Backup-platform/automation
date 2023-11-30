const registrationTestData = require('../../../fixtures/e2e/users/registration.json');

describe('Visit SpaceFortuna Home Page and verify label existence', () => {
  const testConfiguration = {};

  before(() => {
    cy.fixture('e2e/environment.json').then((environment) => {
      testConfiguration.host = environment.hosts.frontoffice;
    });
  });

  Object.keys(registrationTestData.invalidPayloads).forEach(key => {
    const invalidTestPayload = registrationTestData.invalidPayloads[key];

    it('Registration with invalid test data on first step should not proceed further', () => {
      cy.viewport(1920, 1080);
      cy.visit(testConfiguration.host);
      cy.get('#header-sign-up-btn').click();
      cy.get('#email').clear().type(invalidTestPayload.email);
      cy.get('#password').clear().type(invalidTestPayload.password);
      cy.get('#registration-next-step-btn').should('be.disabled');
    });
  })
})