const { Builder, By, until } = require("selenium-webdriver");

module.exports.filterproductsbyname = async function () {
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

    await driver.wait(until.elementLocated(By.id("filter-by-name")));
    await driver.findElement(By.id("filter-by-name")).sendKeys("Clovis Velvet Square Arm Sofa");
  } catch (error) {
    console.log("Error: " + error);
  }
};
