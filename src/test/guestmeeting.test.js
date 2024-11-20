// import { Builder, By, until } from 'selenium-webdriver';
// import firefox from 'selenium-webdriver/firefox.js';
// import assert from 'assert';
// import path from 'path';
// let driver;
// before(async function () {
// this.timeout(30000);
// // Set up Firefox options
// const firefoxOptions = new firefox.Options();
// firefoxOptions.addArguments('--use-fake-ui-for-media-stream'); // Automatically grant permissions for audio/video
// firefoxOptions.addArguments('--allow-insecure-localhost'); // Allow insecure localhost
// firefoxOptions.addArguments('--disable-popup-blocking'); // Disable popup blocking
// const videoFilePath = "C:\Users\Joseph\Downloads\claire_qcif-5.994Hz-labels.y4m";
// // Resolve full path if needed
// // Set preferences for fake media stream
// firefoxOptions.setPreference('media.navigator.permission.disabled', true); // Automatically allow video access
// firefoxOptions.setPreference('media.navigator.streams.fake', true); // Use fake media streams
// firefoxOptions.setPreference('media.navigator.streams.fake.video_file', videoFilePath); // Path to your video file
// firefoxOptions.setPreference('media.peerconnection.video.enabled', true); // Enable video
// firefoxOptions.setPreference('media.peerconnection.audio.enabled', false); // Disable audio (microphone access)
// // Build the driver with Firefox options
// driver = await new Builder()
// .forBrowser('firefox')
// .setFirefoxOptions(firefoxOptions)
// .build();
// await driver.get("https://netstratum.ncsapp.com/app/home");
// await driver.manage().window().maximize();
// });
// after(async function () {
// if (driver) {
// // await driver.quit();
// }
// });
// describe('Login Page', function () {
// this.timeout(30000);
// it("Join Meeting", async function () {
// const joinMeetingButton = await driver.wait(
// until.elementLocated(By.id('JoinaMeeting')), 10000
// );
// await driver.wait(until.elementIsVisible(joinMeetingButton), 10000);
// await joinMeetingButton.click();
// });
// it("Enter Meeting ID", async function () {
// const meetingID = await driver.findElement(By.id("meetingID"));
// await meetingID.click();
// await meetingID.sendKeys("9128951842");
// const joinMeeting = await driver.findElement(By.id("joinMeeting"));
// await joinMeeting.click();
// });
// it("Enable Video", async function () {
// const videoButton = await driver.wait(until.elementLocated(By.id('videoButton')), 10000);
// await driver.wait(until.elementIsVisible(videoButton), 10000);
// await videoButton.click();
// });
// it("Type Username and Join", async function () {
// const userName = await driver.findElement(By.id("userName"));
// await userName.sendKeys("Guest");
// const joinButton = await driver.findElement(By.id("joinButton"));
// await joinButton.click();
// });
//});
// import { Builder, By, until } from 'selenium-webdriver';
// import firefox from 'selenium-webdriver/firefox.js'; // Import Firefox options

// function generateRandomAlphabetString(length) {
//     return Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
// }

// // Function to run tests for a single driver instance
// async function runTestInstance(browserIndex) {
//     const firefoxOptions = new firefox.Options();
    
//     // Firefox doesn't have the same flags as Chrome, but you can add similar options
//     firefoxOptions.setPreference('media.navigator.streams.fake', true); // Use fake media stream
//     firefoxOptions.setPreference('media.navigator.permission.disabled', true); // Disable media stream permissions
//     firefoxOptions.addArguments('--width=1920'); // Set window size
//     firefoxOptions.addArguments('--height=1080');

//     const driver = await new Builder()
//         .forBrowser('firefox') // Use Firefox instead of Chrome
//         //.usingServer('http://192.168.1.110:4444/wd/hub') // Uncomment if using a remote Selenium server
//         //.usingServer('http://134.195.41.150:4444/wd/hub')
//         .setFirefoxOptions(firefoxOptions) // Set Firefox options
//         .build();

//     try {
//         await driver.get("https://netstratum.ncsapp.com/app/home");

//         // Test cases
//         await joinMeeting(driver);
//         await enterMeetingID(driver);
//         await enableVideo(driver);
//         await typeUsernameAndJoin(driver);

//         // Quit the driver after 1 minute
//         setTimeout(async () => {
//             await driver.quit();
//             console.log(`Driver for instance ${browserIndex + 1} quit after 1 minute.`);
//         }, 1 * 60 * 1000);

//     } catch (error) {
//         console.error(`Error in instance ${browserIndex + 1}:`, error);
//         await driver.quit(); // Ensure driver quits on error
//     }
// }

// // Individual test functions
// async function joinMeeting(driver) {
//     const joinMeetingButton = await driver.wait(until.elementLocated(By.id('JoinaMeeting')), 10000);
//     await driver.wait(until.elementIsVisible(joinMeetingButton), 10000);
//     await joinMeetingButton.click();
// }

// async function enterMeetingID(driver) {
//     const meetingID = await driver.findElement(By.id("meetingID"));
//     await meetingID.click();
//     await meetingID.sendKeys("9128951842");

//     const joinMeeting = await driver.findElement(By.id("joinMeeting"));
//     await joinMeeting.click();
// }

// async function enableVideo(driver) {
//     const videoButton = await driver.wait(until.elementLocated(By.id('videoButton')), 10000);
//     await driver.wait(until.elementIsVisible(videoButton), 10000);
//     await videoButton.click();
// }

// async function typeUsernameAndJoin(driver) {
//     const userName = await driver.findElement(By.id("userName"));
//     const guestName = 'Selenium ' + generateRandomAlphabetString(7);
//     await userName.sendKeys(guestName);

//     const joinButton = await driver.findElement(By.id("joinButton"));
//     await joinButton.click();
// }

// // Main function to run multiple instances
// async function main() {
//     const numberOfInstances = 5; // Adjust the number of instances as needed
//     const testPromises = [];

//     for (let i = 0; i < numberOfInstances; i++) {
//         testPromises.push(runTestInstance(i));
//     }

//     await Promise.all(testPromises);
// }

// main().catch(console.error);
import { Builder, By, until } from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox.js'; // Import Firefox options
import { describe, it } from 'mocha';
import assert from 'assert';

// Generate random alphabet string
function generateRandomAlphabetString(length) {
    return Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
}

// Individual test functions
async function joinMeeting(driver) {
    const joinMeetingButton = await driver.wait(until.elementLocated(By.id('JoinaMeeting')), 10000);
    await driver.wait(until.elementIsVisible(joinMeetingButton), 10000);
    await joinMeetingButton.click();
}

async function enterMeetingID(driver) {
    const meetingID = await driver.findElement(By.id("meetingID"));
    await meetingID.click();
    await meetingID.sendKeys("9128951842");

    const joinMeeting = await driver.findElement(By.id("joinMeeting"));
    await joinMeeting.click();
}

async function enableVideo(driver) {
    const videoButton = await driver.wait(until.elementLocated(By.id('videoButton')), 10000);
    await driver.wait(until.elementIsVisible(videoButton), 10000);
    await videoButton.click();
}

async function typeUsernameAndJoin(driver) {
    const userName = await driver.findElement(By.id("userName"));
    const guestName = 'Selenium ' + generateRandomAlphabetString(7);
    await userName.sendKeys(guestName);

    const joinButton = await driver.findElement(By.id("joinButton"));
    await joinButton.click();
}

// Function to run tests for a single driver instance
async function runTestInstance(browserIndex) {
    const firefoxOptions = new firefox.Options();

    firefoxOptions.setPreference('media.navigator.streams.fake', true); // Use fake media stream
    firefoxOptions.setPreference('media.navigator.permission.disabled', true); // Disable media stream permissions
    firefoxOptions.addArguments('--width=1920'); // Set window size
    firefoxOptions.addArguments('--height=1080');

    const driver = await new Builder()
        .forBrowser('firefox') // Use Firefox instead of Chrome
        //.usingServer('http://192.168.1.110:4444/wd/hub') // Uncomment if using a remote Selenium server
        //.usingServer('http://134.195.41.150:4444/wd/hub')
        .setFirefoxOptions(firefoxOptions) // Set Firefox options
        .build();

    try {
        await driver.get("https://netstratum.ncsapp.com/app/home");

        // Test cases
        await joinMeeting(driver);
        await enterMeetingID(driver);
        await enableVideo(driver);
        await typeUsernameAndJoin(driver);

        // Quit the driver after 1 minute
        setTimeout(async () => {
            await driver.quit();
            console.log(`Driver for instance ${browserIndex + 1} quit after 1 minute.`);
        }, 1 * 60 * 1000);

    } catch (error) {
        console.error(`Error in instance ${browserIndex + 1}:`, error);
        await driver.quit(); // Ensure driver quits on error
    }
}

// Main function to run multiple instances
describe('NetStratum Meeting Tests', function () {
    this.timeout(120000); // Set timeout for the entire suite (2 minutes)

    const numberOfInstances = 5; // Adjust the number of instances as needed

    for (let i = 0; i < numberOfInstances; i++) {
        it(`should run test instance ${i + 1}`, async function () {
            await runTestInstance(i);
        });
    }
});
