const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    overwrite: false,
    html: true,
    json: true,
  },
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Log browser events or configure plugins here
      on('before:browser:launch', (browser = {}, launchOptions) => {
        console.log('Launching browser:', browser.name);
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-save-password-bubble');
          launchOptions.args.push('--disable-features=AutofillServerCommunication,PasswordManagerEnabled');
          launchOptions.args.push('--disable-blink-features=PasswordCredential');
          launchOptions.args.push('--password-store=basic');
          launchOptions.args.push('--incognito');
        }
        return launchOptions;
      });
    },
  },
});
