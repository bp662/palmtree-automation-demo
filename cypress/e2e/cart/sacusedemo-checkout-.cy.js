describe('Add to Cart Test', () => {
    it('adds a product to the cart and validates it is displayed', () => {
      cy.visit('/');
  
      // Log in with valid credentials
      cy.get('[data-test="username"]').type('standard_user');
      cy.get('[data-test="password"]').type('secret_sauce');
      cy.get('[data-test="login-button"]').click();
  
      // Add an item to the cart
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  
      // Verify cart badge updates
      cy.get('.shopping_cart_badge').should('contain.text', '1');
  
      // Navigate to cart
      cy.get('.shopping_cart_link').click();
  
      // Validate item is in cart
      cy.contains('.inventory_item_name', 'Sauce Labs Backpack').should('be.visible');
    });

    it('completes the checkout process successfully', () => {
      cy.visit('/');

      // Log in with valid credentials
      cy.get('[data-test="username"]').type('standard_user');
      cy.get('[data-test="password"]').type('secret_sauce');
      cy.get('[data-test="login-button"]').click();

      // Add an item to the cart
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();

      // Go to the cart
      cy.get('.shopping_cart_link').click();

      // Begin checkout
      cy.get('[data-test="checkout"]').click();

      // Fill out checkout form
      cy.get('[data-test="firstName"]').type('Beau');
      cy.get('[data-test="lastName"]').type('Palmer');
      cy.get('[data-test="postalCode"]').type('12345');
      cy.get('[data-test="continue"]').click();

      // Finish checkout
      cy.get('[data-test="finish"]').click();

      // Confirm checkout success
      cy.contains('Thank you for your order!').should('be.visible');
    });
  });