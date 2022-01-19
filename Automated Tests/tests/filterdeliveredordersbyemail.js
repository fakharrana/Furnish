const { Builder, By, until } = require("selenium-webdriver");

module.exports.filterdeliveredordersbyemail = async function () {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.manage().window().maximize();
    await driver.get("http://localhost:3000/login");
    await driver
      .findElement(By.id("email-id"))
      .sendKeys("fakharayub98@gmail.com");
    await driver.findElement(By.id("password-id")).sendKeys("12345678");
    await driver.findElement(By.id("login-button")).click();

    await driver.wait(until.elementLocated(By.id("delivered-page")));
    await driver.findElement(By.id("delivered-page")).click();

    await driver.wait(until.elementLocated(By.id("filter-by-email")));
    await driver.findElement(By.id("filter-by-email")).sendKeys("fakharrana98@hotmail.com");
  } catch (error) {
    console.log("Error: " + error);
  }
};
