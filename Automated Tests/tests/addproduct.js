const { Builder, By, until } = require("selenium-webdriver");

module.exports.addproduct = async function () {
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

    await driver.wait(until.elementLocated(By.id("add-product-button")));
    await driver.findElement(By.id("add-product-button")).click();

    await driver.wait(until.elementLocated(By.id("product-name")));
    await driver
      .findElement(By.id("product-name"))
      .sendKeys("Clovis Velvet Square Arm Sofa");

    await driver.wait(until.elementLocated(By.id("product-category")));
    await driver.findElement(By.id("product-category")).sendKeys("Sofa");

    await driver.wait(until.elementLocated(By.id("product-description")));
    await driver
      .findElement(By.id("product-description"))
      .sendKeys("Clovis Velvet Square Arm Sofa");

    await driver.wait(until.elementLocated(By.id("product-price")));
    await driver.findElement(By.id("product-price")).sendKeys("30000");

    await driver.wait(until.elementLocated(By.id("product-quantity")));
    await driver.findElement(By.id("product-quantity")).sendKeys("100");

    await driver.wait(until.elementLocated(By.id("thumbnail")));
    await driver
      .findElement(By.id("thumbnail"))
      .sendKeys(
        "C:/Users/Fakhar/Desktop/Products/Sofa/Clovis Velvet Square Arm Sofa/Thumbnail.jpg"
      );

    await driver.wait(until.elementLocated(By.id("images")));
    let image_1 =
      "C:/Users/Fakhar/Desktop/Products/Sofa/Clovis Velvet Square Arm Sofa/Image-1.jpg";
    let image_2 =
      "C:/Users/Fakhar/Desktop/Products/Sofa/Clovis Velvet Square Arm Sofa/Image-2.jpg";
    let image_3 =
      "C:/Users/Fakhar/Desktop/Products/Sofa/Clovis Velvet Square Arm Sofa/Image-3.jpg";
    await driver
      .findElement(By.id("images"))
      .sendKeys(image_1 + "\n" + image_2 + "\n" + image_3);

    await driver.wait(until.elementLocated(By.id("model")));
    await driver
      .findElement(By.id("model"))
      .sendKeys(
        "C:/Users/Fakhar/Desktop/Products/Sofa/Clovis Velvet Square Arm Sofa/model.glb"
      );

    await driver.findElement(By.id("save-product-button")).click();
  } catch (error) {
    console.log("Error: " + error);
  }
};
