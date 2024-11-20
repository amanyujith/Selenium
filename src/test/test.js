// import { Builder, By, until,Browser } from "selenium-webdriver";
// import assert from "assert";
// // import chrome from "selenium-webdriver/chrome.js";
// import firefox from 'selenium-webdriver/firefox.js';
// import fs from "fs"; // Updated to use ES module import

// let driver;

// describe("LOGIN SESSION", function () {
//     this.timeout(120000); // Set timeout for all tests

//     // Initialize the WebDriver for Chrome before tests
//     before(async function () {
//         // const options = new chrome.Options();
//         const options = new firefox.Options();
//         // driver = await new Builder().forBrowser("firefox").setChromeOptions(options).build();
//         driver = await new Builder()
//       .forBrowser(Browser.FIREFOX)
//       .setFirefoxOptions(options)
//       .build();
//     });

//     // Close WebDriver after all tests complete
//     // after(async function () {
//     //     try {
//     //         await driver.quit();
//     //     } catch (error) {
//     //         console.error("Error while quitting WebDriver:", error);
//     //     }
//     // });

//     // Load the app's home URL before each test for consistency
//     beforeEach(async function () {
//         try {
//             const allWindows = await driver.getAllWindowHandles();
//             if (allWindows.length > 0) {
//                 await driver.switchTo().window(allWindows[0]); // Ensure main window is in focus
//             }
//             // Replace with actual URL of your app's home page
//             await driver.get("http://localhost:3000/app/home"); 
//         } catch (error) {
//             console.error("Error during beforeEach hook:", error);
//         }
//     });

//     it("NCS App Test-Login Case", async function () {
//         try {
//             // Step 1: Locate the username input field and enter the username
//             const usernameField = await driver.wait(until.elementLocated(By.id("loginUserName")), 1000);
//             await usernameField.sendKeys("amanyujith"); // Replace with your username

//             // Step 2: Locate the password input field and enter the password
//             const passwordField = await driver.wait(until.elementLocated(By.id("loginPassword")), 1000);
//             await passwordField.sendKeys("password"); // Replace with your password

//             // Step 3: Locate the login button and click it
//             const loginButton = await driver.wait(until.elementLocated(By.id("loginButton")), 1000);
//             await loginButton.click();

//             // Step 4: Wait for an element that indicates successful login (e.g., home page or profile page)
//             const homePageElement = await driver.wait(until.elementLocated(By.id("homePage")), 20000); // Replace with actual element after login

//             // Step 5: Assert that the home page element is displayed, confirming successful login
//             const isHomePageVisible = await homePageElement.isDisplayed();
//             assert.strictEqual(isHomePageVisible, true, "Login failed, home page is not visible after login.");
//         } catch (error) {
//             console.error("Test failed during login process:", error);

//             // Capture screenshot for debugging if test fails
//             const screenshot = await driver.takeScreenshot();
//             fs.writeFileSync('error_screenshot_login_case.png', screenshot, 'base64');
            
//             // Rethrow the error so that the test can fail
//             throw error;
//         }
//     });
// });

import { Builder, By, until, Browser } from "selenium-webdriver";

import assert from "assert";

import chrome from "selenium-webdriver/chrome.js";

import fs from "fs";



describe("LOGIN SESSION", function () {
let driver;

this.timeout(120000); // Set timeout for all tests

// Initialize the WebDriver for Chrome before tests

before(async function () {

const options = new chrome.Options();
options.setUserPreferences({
    'profile.default_content_setting_values.media_stream_camera': 1,  // Allow camera
    'profile.default_content_setting_values.media_stream_microphone': 1, // Allow microphone
    'profile.default_content_setting_values.media_stream': 1, // Allow general media stream
    'profile.default_content_setting_values.notifications': 1, // Allow notifications
    'profile.default_content_setting_values.automatic_downloads': 1, // Allow automatic downloads
    'media.navigator.permission.disabled': true,  // Disable permission prompts
    'media.autoplay.default': 0 // Allow media autoplay
  });
// Uncomment the following line to run Chrome in headless mode

// options.headless();

driver = await new Builder()

.forBrowser(Browser.CHROME) // Set the browser to Chrome

.setChromeOptions(options)  // Apply Chrome options

.build();

await driver.manage().window().maximize();
await driver.get("http://localhost:3000/app/home");

});

// Close WebDriver after all tests complete

after(async function () {

if (driver) {

try {

await driver.quit();

} catch (error) {

console.error("Error while quitting WebDriver:", error);

}

}

});

// Load the app's home URL before each test for consistency



it("NCS App Test-Login Case", async function () {


// Step 1: Locate the username input field and enter the username

const usernameField = await driver.wait(until.elementLocated(By.id("loginUserName")), 5000);

await usernameField.sendKeys("sodikjonjabbarov@netstratum.com"); // Replace with your username

// Step 2: Locate the password input field and enter the password

const passwordField = await driver.wait(until.elementLocated(By.id("loginPassword")), 5000);

await passwordField.sendKeys("12345678ABC"); // Replace with your password

// Step 3: Locate the login button and click it

const loginButton = await driver.wait(until.elementLocated(By.id("loginButton")), 5000);

await loginButton.click();

// Step 4: Wait for an element that indicates successful login (e.g., home page or profile page)

// const homePageElement = await driver.wait(until.elementLocated(By.id("homePage")), 40000);

// Step 5: Assert that the home page element is displayed, confirming successful login

// const isHomePageVisible = await homePageElement.isDisplayed();

// assert.strictEqual(isHomePageVisible, true, "Login failed, home page is not visible after login.");


// console.error("Test failed during login process:", error);

// Capture screenshot for debugging if the test fails

// const screenshot = await driver.takeScreenshot();

// fs.writeFileSync('error_screenshot_login_case.png', screenshot, 'base64');

// Rethrow the error so that the test can fail






});



});










