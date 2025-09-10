import { remote } from 'webdriverio';

const caps = {
  platformName: 'iOS',
  browserName: 'Safari',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone 16 Plus',
  'appium:platformVersion': '18.6',
  'appium:noReset': true,
};

const run = async () => {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: caps,
  });

  try {
    await driver.url('https://www.saucedemo.com/');
    const username = await driver.$('#user-name');
    const password = await driver.$('#password');
    const loginBtn = await driver.$('#login-button');

    await username.setValue('standard_user');
    await password.setValue('secret_sauce');
    await loginBtn.click();

    const menuBtn = await driver.$('#react-burger-menu-btn');
    await menuBtn.click();

    const logoutLink = await driver.$('#logout_sidebar_link');
    await logoutLink.click();

    console.log('Logout successful');

  } finally {
    await driver.terminateApp('com.apple.mobilesafari');
    await driver.deleteSession();
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});