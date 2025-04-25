describe('SauceDemo Login Test', () => {
  it('logs in successfully with valid credentials', () => {
    // Visit the login page (baseUrl is set in cypress.config.js)
    cy.visit('/');

    // Enter login credentials
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    // Assert user is redirected to the inventory page
    cy.get('.app_logo').should('be.visible');
  });
  
  it('displays an error with an invalid password', () => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('wrong_password');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Username and password do not match');
  });
    
  it('displays an error with an invalid username', () => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('wrong_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Username and password do not match');
  });

  it('displays an error for locked out user', () => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('locked_out_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Sorry, this user has been locked out.');
  });

  it('displays an error when fields are empty', () => {
    cy.visit('/');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Username is required');
  });
});