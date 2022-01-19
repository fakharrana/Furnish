const { Builder, By, until } = require("selenium-webdriver");

module.exports.changepassword = async function () {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.manage().window().maximize();
    await driver.get("http://localhost:3000/login");
    await driver
      .findElement(By.id("email-id"))
      .sendKeys("fakharayub98@gmail.com");
    await driver.findElement(By.id("password-id")).sendKeys("12345678");
    await driver.findElement(By.id("login-button")).click();

    await driver.wait(until.elementLocated(By.id("admin-dropdown")));
    dropdown = await driver.findElement(By.id("admin-dropdown"));
    await driver.actions({ bridge: true }).move({ origin: dropdown }).perform();
    await driver.findElement(By.id("changepassword-button")).click();

    await driver.findElement(By.id("oldpassword-id")).sendKeys("12345678");
    await driver.findElement(By.id("newpassword-id")).sendKeys("87654321");
    await driver.findElement(By.className("button-changepassword")).click();
  } catch (error) {
    console.log("Error: " + error);
  }
};
