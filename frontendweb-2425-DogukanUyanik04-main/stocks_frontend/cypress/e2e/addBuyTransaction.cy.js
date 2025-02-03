describe('Buy Stock', () => {
  beforeEach(() => {
    cy.login('dogukanuyanik9140@gmail.com', 'Dogukan12');
  });

  it('should allow buying a stock', () => {

    cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com/buy/1'); // 👈 1
    cy.get('[data-cy=quantity-input]').should('have.value', '1'); // 👈 2
    cy.get('[data-cy=buy-button]').should('be.enabled'); // 👈 2

    cy.get('[data-cy=quantity-input]').clear().type('2'); // 👈 2

    cy.get('body').click(0, 0);
    cy.get('[data-cy=buy-button]').click(); // 👈 3

    cy.get('[data-cy=success-message]').should('contain', 'Successfully bought'); // 👈 4
  });

   it('should show error for insufficient balance', () => {
     cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com/buy/1'); // 👈 1

     cy.get('[data-cy=quantity-input]').clear().type('100'); // 👈 2
     cy.get('[data-cy=buy-button]').click(); // 👈 3

    cy.get('[data-cy=error-message]').should('contain', 'Insufficient balance'); // 👈 4
   });
});


