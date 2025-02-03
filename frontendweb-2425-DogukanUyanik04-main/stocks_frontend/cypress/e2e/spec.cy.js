describe('General', () => {
  it('draait de applicatie', () => {
    cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com'); 
    cy.get('h1').should('exist'); 
  });

  it('should login', () => {
    cy.login('dogukanuyanik9140@gmail.com', 'Dogukan12'); 
  });
});