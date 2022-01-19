const { Builder, By } = require("selenium-webdriver");

module.exports.forgotpassword = async function () {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.manage().window().maximize();
    await driver.get("http://localhost:3000/login");

    await driver.findElement(By.className("forget-password-login")).click();
    await driver
      .findElement(By.id("email-id"))
      .sendKeys("fakharayub98@gmail.com");
    await driver.findElement(By.className("button-forgotpassword")).click();
  } catch (error) {
    console.log("Error: " + error);
  }
};
