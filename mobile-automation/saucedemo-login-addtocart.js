// /test-mobile/saucedemo-login-addtocart.js
import { remote } from 'webdriverio';

const caps = {
  platformName: 'iOS',
  browserName: 'Safari',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone 16 Plus',
  'appium:platformVersion': '18.6',   // <-- add this
  'appium:noReset': true
};

// Common selectors on saucedemo.com
const sel = {
  username: '#user-name',
  password: '#password',
  loginBtn: '#login-button',
  inventoryItem: '.inventory_item:first-child .inventory_item_name',
  addToCartBtn: '.inventory_item:first-child button',
  cartIcon: '.shopping_cart_link',
  cartBadge: '.shopping_cart_badge',
  checkoutBtn: '#checkout',
  firstName: '#first-name',
  lastName: '#last-name',
  postalCode: '#postal-code',
  continueBtn: '#continue',
  finishBtn: '#finish',
  thankYou: '.complete-header'
};

const run = async () => {
  // 1) Connect to Appium (Appium 2/3 uses '/' not /wd/hub)
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: caps
  });

  try {
    // 2) Go to site
    await driver.url('https://www.saucedemo.com/');

    // 3) Login
    await (await driver.$(sel.username)).setValue('standard_user');
    await (await driver.$(sel.password)).setValue('secret_sauce');
    await (await driver.$(sel.loginBtn)).click();

    // 4) Add first item to cart
    await driver.$(sel.inventoryItem).waitForDisplayed({ timeout: 10000 });
    const itemName = await (await driver.$(sel.inventoryItem)).getText();
    await (await driver.$(sel.addToCartBtn)).click();

    // 5) Open cart and validate badge
    await (await driver.$(sel.cartIcon)).click();
    await (await driver.$(sel.cartBadge)).waitForDisplayed({ timeout: 10000 });

    // 6) Checkout flow
    await (await driver.$(sel.checkoutBtn)).click();
    await (await driver.$(sel.firstName)).setValue('Beau');
    await (await driver.$(sel.lastName)).setValue('Palmer');
    await (await driver.$(sel.postalCode)).setValue('73120');
    await (await driver.$(sel.continueBtn)).click();
    await (await driver.$(sel.finishBtn)).click();

    // 7) Assert success
    await (await driver.$(sel.thankYou)).waitForDisplayed({ timeout: 10000 });
    const doneText = await (await driver.$(sel.thankYou)).getText();

    console.log('✔ Added item:', itemName);
    console.log('✔ Checkout result:', doneText);
  } finally {
    try {
    await driver.execute('mobile: terminateApp', { bundleId: 'com.apple.mobilesafari' });
  } catch (e) {
    console.warn('terminateApp failed:', e?.message || e);
  }
    await driver.terminateApp('com.apple.mobilesafari'); console.log('Closed Safari');
    await driver.deleteSession();
  }
};

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});