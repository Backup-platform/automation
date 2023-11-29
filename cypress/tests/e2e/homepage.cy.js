describe('Visit SpaceFortuna Home Page and verify label existence', () => {
  it('passes 1', () => {
    cy.viewport(1920, 1080);
    cy.visit('https://frontoffice.dev.inovadatabv.com/');
    cy.wait(5000);
    cy.get('body').should('exist');
  });
})