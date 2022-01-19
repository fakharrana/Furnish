const { Builder, By, until } = require("selenium-webdriver");

module.exports.deleteproduct = async function () {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.manage().window().maximize();
    await driver.get("http://localhost:3000/login");
    await driver
      .findElement(By.id("email-id"))
      .sendKeys("fakharayub98@gmail.com");
    await driver.findElement(By.id("password-id")).sendKeys("12345678");
    await driver.findElement(By.id("login-button")).click();

    await driver.wait(until.elementLocated(By.id("products-page")));
    await driver.findElement(By.id("products-page")).click();

    await driver.wait(until.elementLocated(By.id("delete-product-button-1")));
    await driver.findElement(By.id("delete-product-button-1")).click();

    await driver.wait(until.elementLocated(By.className("modal-content")));
    await driver.wait(until.elementLocated(By.className("btn-danger")));
    await driver.findElement(By.className("btn-danger")).click();
  } catch (error) {
    console.log("Error: " + error);
  }
};
