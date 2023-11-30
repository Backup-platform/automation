describe('Visit SpaceFortuna Home Page and verify label existence', () => {
  const testConfiguration = {};

  before(() => {
    cy.fixture('e2e/environment.json').then((environment) => {
      testConfiguration.host = environment.hosts.wallet;
    });

    cy.fixture('api/wallet/bonus-history.fixture.json').then((bonusHistoryTestData) => {
      testConfiguration.bonusHistoryTestData = bonusHistoryTestData;
    });
  });

  it('passes 1', () => {
    cy.viewport(1920, 1080);
    cy.visit('https://frontoffice.dev.inovadatabv.com/');
    cy.wait(5000);
    cy.get('body').should('exist');
  });
})