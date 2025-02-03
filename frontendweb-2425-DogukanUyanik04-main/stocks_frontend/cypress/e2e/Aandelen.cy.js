describe('AandeelLijst Component', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://stocks-webserv.onrender.com/api/aandelen',
      { fixture: 'aandelen.json' }
    ).as('getStocks');

    cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com/aandeelpagina');
  });

  it('should display the list of stocks correctly', () => {
    cy.wait('@getStocks');

    cy.get('.list-group-item').should('have.length', 3);

    cy.get('.list-group-item').first().within(() => {
      cy.contains('Google'); 
      cy.contains('GOOG');   
      cy.contains('1500 $'); 
    });

    cy.get('.list-group-item').each((item) => {
      cy.wrap(item).contains('Buy').should('be.visible');
      cy.wrap(item).contains('Sell').should('be.visible');
    });
  });

  it('should filter stocks based on search input', () => {
    cy.get('input#search').type('Apple');
    cy.get('[data-cy=stocks_search_btn]').click();

    cy.get('.list-group-item').should('have.length', 1);
    cy.contains('Apple');
    cy.contains('AAPL');
    cy.contains('1300 $');
  });

  it('should redirect to login when clicking Buy or Sell without authentication', () => {
    cy.get('.list-group-item').first().within(() => {
      cy.get('[data-cy=stocks_buy_btn]').click();
    });

    cy.url().should('include', '/login');
  });

  it('should display loading state when fetching stocks', () => {
    cy.intercept('GET', 'https://stocks-webserv.onrender.com/api/aandelen', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000);
      });
    }).as('slowResponse');

    cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com/aandeelpagina');
    cy.get('.list-group').should('not.exist'); 
    cy.get('div').contains('Loading...').should('be.visible');
    cy.wait('@slowResponse');
    cy.get('.list-group').should('be.visible'); 
  });

  it('should display an error message if the API call fails', () => {
    cy.intercept('GET', 'https://stocks-webserv.onrender.com/api/aandelen', {
      statusCode: 500,
      body: {
        error: 'Internal server error',
      },
    }).as('apiFailure');

    cy.visit('https://frontendweb-2425-dogukanuyanik04.onrender.com/aandeelpagina');
    cy.get('[data-cy=axios_error_message]').should('be.visible');
  });
});
