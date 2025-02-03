Cypress.Commands.add('login', (email, password) => {
  Cypress.log({
    displayName: 'login',
  });

  cy.intercept('/api/sessions').as('login');
  cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com/login');

  cy.get('[data-cy=email_input]').clear();
  cy.get('[data-cy=email_input]').type(email);

  cy.get('[data-cy=password_input]').clear();
  cy.get('[data-cy=password_input]').type(password);

  cy.get('[data-cy=submit_btn]').click();
  cy.wait('@login');
});

Cypress.Commands.add('logout', () => {
  Cypress.log({
    displayName: 'logout',
  });

  cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com');
  cy.get('[data-cy=logout_btn]').click();
});