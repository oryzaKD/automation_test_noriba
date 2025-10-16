describe('Example E2E', () => {
  it('visits the Cypress Kitchen Sink', () => {
    cy.visit('https://example.cypress.io');
    cy.contains('Kitchen Sink');
  });
});


