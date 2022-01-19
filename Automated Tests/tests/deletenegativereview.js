const { Builder, By, until } = require("selenium-webdriver");

module.exports.deletenegativereview = async function () {
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

    await driver.wait(until.elementLocated(By.id("negative-reviews-button")));
    await driver.findElement(By.id("negative-reviews-button")).click();

    await driver.wait(until.elementLocated(By.id("delete-review-button-1")));
    await driver.findElement(By.id("delete-review-button-1")).click();

    await driver.wait(until.elementLocated(By.className("modal-content")));
    await driver.wait(until.elementLocated(By.className("model-delete-button")));
    await driver.findElement(By.className("model-delete-button")).click();
  } catch (error) {
    console.log("Error: " + error);
  }
};
