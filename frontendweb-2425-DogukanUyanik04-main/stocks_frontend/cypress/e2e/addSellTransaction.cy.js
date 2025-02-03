describe('Sell Stock', () => {
  beforeEach(() => {
    cy.login('dogukanuyanik9140@gmail.com', 'Dogukan12');
  });

  it('should allow selling a stock', () => {
    cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com/sell/1'); // 👈 1

    cy.get('[data-cy=quantity-input]').should('have.value', '1'); // 👈 2
    cy.get('[data-cy=sell-button]').should('be.enabled'); // 👈 2

    cy.get('[data-cy=quantity-input]').clear().type('2'); // 👈 2

    cy.get('[data-cy=sell-button]').click(); // 👈 3

    cy.get('[data-cy=success-message]').should('contain', 'Successfully sold'); // 👈 4
  });



  it('should show error for insufficient stocks', () => {
    cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com/sell/1'); // 👈 1

    cy.get('[data-cy=quantity-input]').clear().type('100'); // 👈 2
    cy.get('[data-cy=sell-button]').click(); // 👈 3

    cy.get('[data-cy=error-message]').should('contain', 'You do not have enough shares to sell'); // 👈 4
  });
});
