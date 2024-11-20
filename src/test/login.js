import { Builder, By, until } from "selenium-webdriver";
import assert from "assert";
import chrome from "selenium-webdriver/chrome.js";
import fs from "fs"; // Updated to use ES module import

let driver;

describe("LOGIN SESSION", function () {
    this.timeout(120000); // Set timeout for all tests

    // Initialize the WebDriver for Chrome before tests
    before(async function () {
        const options = new chrome.Options();
        driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    });

    // Close WebDriver after all tests complete
    after(async function () {
        try {
            await driver.quit();
        } catch (error) {
            console.error("Error while quitting WebDriver:", error);
        }
    });

    // Load the app's home URL before each test for consistency
    beforeEach(async function () {
        try {
            const allWindows = await driver.getAllWindowHandles();
            if (allWindows.length > 0) {
                await driver.switchTo().window(allWindows[0]); // Ensure main window is in focus
            }
            await driver.get("http://localhost:3000/app/home"); // Replace with actual URL of your app
        } catch (error) {
            console.error("Error during beforeEach hook:", error);
        }
    });

    it("login_invalid For User", async function () {
        const usernameField = await driver.wait(until.elementLocated(By.id("loginUserName")), 10000);
        const passwordField = await driver.wait(until.elementLocated(By.id("loginPassword")), 10000);

        await usernameField.sendKeys("amanyujith4444@gmail.com");
        await passwordField.sendKeys("123456");
        await driver.findElement(By.id("loginButton")).click();

        const errorMessageElement = await driver.wait(until.elementLocated(By.css(".top-36")), 10000);
        const isDisplayed = await errorMessageElement.isDisplayed();
        assert.strictEqual(isDisplayed, true, "Error message is not displayed.");

        if (isDisplayed) {
            await usernameField.clear();
            await passwordField.clear();
        }
    });

    it("clicked the forgot password button and cancelled", async function () {
        const forgotButton = await driver.wait(until.elementLocated(By.id("ForgotPassword")), 10000);
        await forgotButton.click();

        const cancelButton = await driver.wait(until.elementLocated(By.id("ForgotPasswordCancelButton")), 10000);
        await cancelButton.click();

        const forgotButtonAgain = await driver.wait(until.elementLocated(By.id("ForgotPassword")), 10000);
        await forgotButtonAgain.click();
    });

    it("should display an error message for invalid email", async function () {
        try {
            const emailField = await driver.wait(until.elementLocated(By.id("forgotPasswordemailId")), 30000);

            await emailField.sendKeys("kjhdfdshsdfd");
            await driver.findElement(By.id("PasswordResetButton")).click();

            const errorMessageElement = await driver.wait(until.elementLocated(By.xpath("//div[text()='Invalid Mail ID']")), 20000);
            const isErrorDisplayed = await errorMessageElement.isDisplayed();
            assert.strictEqual(isErrorDisplayed, true, "Error message is not displayed as expected.");
        } catch (error) {
            console.error("Error message element not found in time:", error);

            // Capture screenshot for debugging if test fails
            const screenshot = await driver.takeScreenshot();
            fs.writeFileSync('error_screenshot_invalid_email.png', screenshot, 'base64');
            throw error; // Re-throw to register as test failure
        }
    });

    it("should reset password with a valid email", async function () {
        try {
            const emailField = await driver.wait(until.elementLocated(By.id("forgotPasswordemailId")), 30000);

            await emailField.clear();
            await emailField.sendKeys("a@gmail.com");
            
            // Check if PasswordResetButton is present, adjust the click
            const resetButton = await driver.wait(until.elementLocated(By.id("PasswordResetButton")), 30000);
            await resetButton.click();

            const resetMessageElement = await driver.wait(until.elementLocated(By.xpath("//div[text()='Password Reset']")), 20000);
            const isResetDisplayed = await resetMessageElement.isDisplayed();
            assert.strictEqual(isResetDisplayed, true, "Password reset message is not displayed as expected.");

            const okButton = await driver.wait(until.elementLocated(By.id("ForgotPasswordMailButton")), 10000);
            await okButton.click();
        } catch (error) {
            console.error("Password reset failed:", error);

            // Capture screenshot for debugging if test fails
            const screenshot = await driver.takeScreenshot();
            fs.writeFileSync('error_screenshot_password_reset.png', screenshot, 'base64');
            throw error; // Re-throw to register as test failure
        }
    });

    it("NCS App Test-Login Case", async function () {
        const usernameField = await driver.wait(until.elementLocated(By.id("loginUserName")), 10000);
        const passwordField = await driver.wait(until.elementLocated(By.id("loginPassword")), 10000);

        await usernameField.sendKeys("sodikjonjabbarov@netstratum.com");
        await passwordField.sendKeys("12345678ABC");
        await driver.findElement(By.id("loginButton")).click();
    });
});
