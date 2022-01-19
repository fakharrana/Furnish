const { Builder, By, until } = require("selenium-webdriver");

module.exports.filterpositivereviewsbyproductname = async function () {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.manage().window().maximize();
    await driver.get("http://localhost:3000/login");
    await driver
      .findElement(By.id("email-id"))
      .sendKeys("fakharayub98@gmail.com");
    await driver.findElement(By.id("password-id")).sendKeys("12345678");
    await driver.findElement(By.id("login-button")).click();

    await driver.wait(until.elementLocated(By.id("reviewanalysis-page")));
    await driver.findElement(By.id("reviewanalysis-page")).click();

    await driver.wait(until.elementLocated(By.id("positive-reviews-button")));
    await driver.findElement(By.id("positive-reviews-button")).click();

    await driver.wait(until.elementLocated(By.id("filter-by-product-name")));
    await driver
      .findElement(By.id("filter-by-product-name"))
      .sendKeys("Clovis Velvet Square Arm Sofa");
  } catch (error) {
    console.log("Error: " + error);
  }
};
