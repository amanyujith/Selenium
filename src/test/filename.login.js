import { Builder, By, until, Browser } from "selenium-webdriver";
import assert from "assert";
import chrome from "selenium-webdriver/chrome.js";
import fs from "fs";

describe("LOGIN SESSION", function () {
    let driver;
    this.timeout(360000); // Set timeout for all tests

    before(async function () {
        const options = new chrome.Options();
        options.setUserPreferences({
            'profile.default_content_setting_values.media_stream_camera': 1,
            'profile.default_content_setting_values.media_stream_microphone': 1,
            'profile.default_content_setting_values.media_stream': 1,
            'profile.default_content_setting_values.notifications': 1,
            'profile.default_content_setting_values.automatic_downloads': 1,
            'media.navigator.permission.disabled': true,
            'media.autoplay.default': 0
        });
        
        driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();

        await driver.manage().window().maximize();
        await driver.get("http://localhost:3000/app/home");
    });

    // after(async function () {
    //     if (driver) {
    //         try {
    //             await driver.quit();
    //         } catch (error) {
    //             console.error("Error while quitting WebDriver:", error);
    //         }
    //     }
    // });

    it("login_invalid For User", async function () {
        const usernameField = await driver.wait(until.elementLocated(By.id("loginUserName")), 5000);
        const passwordField = await driver.wait(until.elementLocated(By.id("loginPassword")), 5000);

        await usernameField.click();
        await usernameField.sendKeys("amanyujith4444@gmail.com");
        await passwordField.click();
        await passwordField.sendKeys("123456");

        const loginButton = await driver.wait(until.elementLocated(By.id("loginButton")), 5000);
        await loginButton.click();

        const errorMessageElement = await driver.wait(until.elementLocated(By.css(".top-36")), 5000);
        const isDisplayed = await errorMessageElement.isDisplayed();

        assert.strictEqual(isDisplayed, true, "Error message is not displayed.");

        if (isDisplayed) {
            await usernameField.clear();
            await passwordField.clear();
        }
    });

    it("clicked the forgot password button and cancelled", async function () {
        const forgotButton = await driver.wait(until.elementLocated(By.id("ForgotPassword")), 5000);
        await forgotButton.click();

        const cancelButton = await driver.wait(until.elementLocated(By.id("ForgotPasswordCancelButton")), 5000);
        await cancelButton.click();

        const forgotButtonAgain = await driver.wait(until.elementLocated(By.id("ForgotPassword")), 5000);
        await forgotButtonAgain.click();
    });

    it("should display an error message for invalid email", async function () {
        const email = await driver.wait(until.elementLocated(By.id("forgotPasswordemailId")), 5000);
        await email.click();
        await email.sendKeys("kjhdfdshsdfd");

        const passwordReset = await driver.wait(until.elementLocated(By.id("PasswordResetButton")), 5000);
        await passwordReset.click();

        const errorMessageElement = await driver.wait(until.elementLocated(By.xpath("//div[text()='Invalid Mail ID']")), 5000);
        const isErrorDisplayed = await errorMessageElement.isDisplayed();

        assert.strictEqual(isErrorDisplayed, true, "Error message is not displayed as expected.");
    });

    it("should reset password with a valid email", async function () {
        const email = await driver.wait(until.elementLocated(By.id("forgotPasswordemailId")), 5000);
        await email.click();
        await email.clear();
        await email.sendKeys("a@gmail.com");

        const passwordReset = await driver.wait(until.elementLocated(By.id("PasswordResetButton")), 5000);
        await passwordReset.click();

        const resetMessageElement = await driver.wait(until.elementLocated(By.xpath("//div[text()='Password Reset']")), 5000);
        const isResetDisplayed = await resetMessageElement.isDisplayed();

        assert.strictEqual(isResetDisplayed, true, "Password reset message is not displayed as expected.");

        const okButton = await driver.wait(until.elementLocated(By.id("ForgotPasswordMailButton")), 5000);
        await okButton.click();
    });

    it("NCS App Test-Login Case", async function () {
        const usernameField = await driver.wait(until.elementLocated(By.id("loginUserName")), 5000);
        await usernameField.sendKeys("sodikjonjabbarov@netstratum.com");

        const passwordField = await driver.wait(until.elementLocated(By.id("loginPassword")), 5000);
        await passwordField.sendKeys("12345678ABC");

        const loginButton = await driver.wait(until.elementLocated(By.id("loginButton")), 5000);
        await loginButton.click();
    });

    describe("PBX", function () {
        it("PBX-SEARCH", async function () {
            const pbxSection = await driver.wait(until.elementLocated(By.id("PBXSECTION")), 10000);
            await pbxSection.click();
            await driver.executeScript("arguments[0].scrollIntoView(true);", await driver.findElement(By.id("PBXSECTION-LINK")));
            await driver.sleep(3000);  // Reduce fixed wait if unnecessary
        });
    });

    describe("Profile Dropdown", function () {
        it("Updating status", async function () {
            await driver.manage().window().maximize();
            await driver.findElement(By.id('ProfileBoxButtonTopBar')).click();
            await driver.wait(until.elementLocated(By.id("statusDropdown")), 5000).click();
            
            for (let i = 0; i <= 3; i++) {
                await driver.wait(until.elementLocated(By.id(`status-${i}`)), 5000).click();
                await driver.sleep(1000);
                await driver.findElement(By.id("statusDropdown")).click();
            }
        });

        it("Saving status", async function () {
            const saveButton = await driver.wait(until.elementLocated(By.id('save-status')), 5000);
            await saveButton.click();
            await driver.sleep(1000); // Sleep to ensure the action completes
        });

        it("Clearing status", async function () {
            const clearStatusButton = await driver.wait(until.elementLocated(By.id('clearStatusButton')), 5000);
            await clearStatusButton.click();
            await driver.sleep(2000);
        });

        it("Clicking preferences and selecting profile", async function () {
            const preferencesButton = await driver.wait(until.elementLocated(By.id("preferences")), 5000);
            await preferencesButton.click();
            await driver.sleep(2000);
            const profileButton = await driver.wait(until.elementLocated(By.id("Profile")), 5000);
            await profileButton.click();
            await driver.sleep(2000);
        });

        it("Updating phone number", async function () {
            const displayName = await driver.wait(until.elementLocated(By.id("displayName")), 5000);
            await displayName.click();
            const phoneNumberField = await driver.wait(until.elementLocated(By.id("phoneNumber")), 5000);
            await phoneNumberField.sendKeys('73567 91418');
            await driver.sleep(2000);
        });

        it("Uploading profile picture", async function () {
            const fileInput = await driver.findElement(By.id('profile-photo'));
            const filePath = 'C:\\Users\\amany\\Desktop\\Amanyu\\Amanyu.jpg';
            await fileInput.sendKeys(filePath);
            await driver.wait(until.elementLocated(By.id('updateImage')), 5000).click();
        });

        it("Removing profile picture", async function () {
            await driver.sleep(2000);
            const removeButton = await driver.wait(until.elementLocated(By.id("removeProfilePicture")), 5000);
            await removeButton.click();
        });

        it("Setting and clearing status", async function () {
            for (let i = 1; i <= 4; i++) {
                await driver.wait(until.elementLocated(By.id(`status-${i}`)), 5000).click();
                await driver.sleep(2000);
            }
            const clearStatusButton = await driver.wait(until.elementLocated(By.id("clear-status")), 5000);
            await clearStatusButton.click();
        });

        it("Setting timezone", async function () {
            const timezone = await driver.wait(until.elementLocated(By.id("timezone")), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", timezone);
            await timezone.click();
        });

        it("Saving changes", async function () {
            const saveButton = await driver.wait(until.elementLocated(By.id("saveallchanges")), 5000);
            await saveButton.click();
            await driver.sleep(2000);
        });

        it("Audio and video settings", async function () {
            const audioVideoSettings = await driver.wait(until.elementLocated(By.id("Audio & Video")), 5000);
            await audioVideoSettings.click();
            await driver.sleep(2000);
        });

        it("Notification settings", async function () {
            const notificationButton = await driver.wait(until.elementLocated(By.id("Notification")), 5000);
            await notificationButton.click();
            await driver.sleep(2000);
            const settings = ["all", "direct", "dnd", "custom"];
            for (const setting of settings) {
                await driver.wait(until.elementLocated(By.id(setting)), 5000).click();
                await driver.sleep(2000);
            }
        });

        it("Time settings", async function () {
            for (let i = 1; i <= 2; i++) {
                const clock = await driver.findElement(By.id(`clock-${i}`));
                await clock.click();
                await clock.click();
            }
        });

        it("Notification popup", async function () {
            const option = await driver.wait(until.elementLocated(By.id("optionDefault")), 5000);
            await option.click();
            await driver.actions().sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.ENTER).perform();
        });

        it("Notification sound", async function () {
            const muteSound = await driver.wait(until.elementLocated(By.id("muteSound")), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", muteSound);
            await muteSound.click();
            await muteSound.click();
        });

        it("About section", async function () {
            const aboutButton = await driver.wait(until.elementLocated(By.id("About")), 5000);
            await aboutButton.click();
        });

        it("Closing profile modal", async function () {
            const closeModalButton = await driver.wait(until.elementLocated(By.id("modalsetclose")), 5000);
            await closeModalButton.click();
        });

        it("Canceling log out", async function () {
            const profileButton = await driver.findElement(By.id('ProfileBoxButtonTopBar'));
            await profileButton.click();
            await driver.sleep(1000);
            const logoutButton = await driver.wait(until.elementLocated(By.id("logout")), 5000);
            await logoutButton.click();
            const cancelLogoutButton = await driver.wait(until.elementLocated(By.id("Logoutcancel")), 5000);
            await cancelLogoutButton.click();
        });

        it("Log out", async function () {
            await driver.sleep(2000);
            const logoutButton = await driver.wait(until.elementLocated(By.id("logout")), 5000);
            await logoutButton.click();
            const confirmLogoutButton = await driver.wait(until.elementLocated(By.id("Logoutok")), 5000);
            await confirmLogoutButton.click();
        });
    });
});

