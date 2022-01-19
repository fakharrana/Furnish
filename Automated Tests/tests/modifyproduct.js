const { Builder, By, until } = require("selenium-webdriver");

module.exports.modifyproduct = async function () {
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

    await driver.wait(until.elementLocated(By.id("modify-product-button-1")));
    await driver.findElement(By.id("modify-product-button-1")).click();

    await driver.wait(until.elementLocated(By.id("product-name")));
    await driver.findElement(By.id("product-name")).clear();
    await driver
      .findElement(By.id("product-name"))
      .sendKeys("Modified Clovis Velvet Square Arm Sofa");

    await driver.findElement(By.id("product-description")).clear();
    await driver.wait(until.elementLocated(By.id("product-description")));
    await driver
      .findElement(By.id("product-description"))
      .sendKeys("Modified Clovis Velvet Square Arm Sofa Description");

    await driver.findElement(By.id("product-price")).clear();
    await driver.wait(until.elementLocated(By.id("product-price")));
    await driver.findElement(By.id("product-price")).sendKeys("35000");

    await driver.findElement(By.id("product-quantity")).clear();
    await driver.wait(until.elementLocated(By.id("product-quantity")));
    await driver.findElement(By.id("product-quantity")).sendKeys("150");

    await driver.findElement(By.id("modify-product-button")).click();
  } catch (error) {
    console.log("Error: " + error);
  }
};
