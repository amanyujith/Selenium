// import { Browser, Builder, By, Key, until } from "selenium-webdriver";
// import assert from "assert";
// import firefox from 'selenium-webdriver/firefox.js';
// import { utimes } from "fs";

// describe("ncs-app", async function () {
//   let driver;
//   let vars;
//   before(async function () {
//     this.timeout(150000);
//     driver = await new Builder().forBrowser(Browser.FIREFOX).build();
//     await driver.manage().window().maximize();
//     await driver.get("http://localhost:3000/app/home");

//     vars = {};
//   });
//   after(async function () {
//     // await driver.quit();
//   });
import { Browser, Builder, By, Key, until } from "selenium-webdriver";
import assert from "assert";
import firefox from 'selenium-webdriver/firefox.js';

describe("ncs-app", async function () {
  let driver;
  let vars;

  before(async function () {
    this.timeout(15000000);

    // Create Firefox options and set preferences
    const options = new firefox.Options();
    options.setPreference('media.navigator.permission.disabled', true);  // Disable permission prompts for media devices
    options.setPreference('media.navigator.video.enabled', true);       // Enable video
    options.setPreference('media.navigator.audio.enabled', true);       // Enable audio
    options.setPreference('media.autoplay.default', 0);                // Allow autoplay of media
    options.setPreference('permissions.default.camera', 1);            // Allow camera access
    options.setPreference('permissions.default.microphone', 1);        // Allow microphone access
    options.setPreference('permissions.default.desktop', 1);           // Allow screen sharing access

    // Initialize the WebDriver with the Firefox options
    driver = await new Builder()
      .forBrowser(Browser.FIREFOX)
      .setFirefoxOptions(options)
      .build();

    await driver.manage().window().maximize();
    await driver.get("https://us3-test.ncsapp.com/app");
    await driver.sleep(10000);
    vars = {};
  });

  after(async function () {
    if (driver) {
      //await driver.quit(); // Close the browser if the driver is defined
    }
  });
  describe("LOGIN SESSION", async function () {
    this.timeout(120000);
    it("Trying logging in a invalid user", async function () {
      let usernameField = await driver.findElement(By.id("loginUserName"));
      let passwordField = await driver.findElement(By.id("loginPassword"));

      await usernameField.click();
      await usernameField.sendKeys("amanyujith");

      await passwordField.click();
      await passwordField.sendKeys("123456");

      await driver.findElement(By.id("loginButton")).click();

      let errorMessageElement = await driver.wait(
        until.elementLocated(By.css(".top-36")),
        5000
      );
      
    });
    it("Error message is displayed",async function () {
      let isDisplayed = await errorMessageElement.isDisplayed();
      assert.strictEqual(isDisplayed, true, "Error message is not displayed.");
      if (await errorMessageElement.isDisplayed()) {
        await usernameField.clear();
        await passwordField.clear();
      }
    })

    
    it(" clicked the forgot password button and cancelled", async function () {
      const forgotButton = await driver.findElement(By.id("ForgotPassword"));
      await forgotButton.click();
  
      const cancelButton = await driver.findElement(By.id("ForgotPasswordCancelButton"));
      await cancelButton.click();
  
      const forgotButtonAgain = await driver.wait(
          until.elementLocated(By.id("ForgotPassword")),
          5000
      );
      await forgotButtonAgain.click();
  });
  
  it("should display an error message for invalid email", async function () {
      const email = await driver.findElement(By.id("forgotPasswordemailId"));
      await email.click();
      await email.sendKeys("kjhdfdshsdfd");
  
      const passwordReset = await driver.findElement(By.id("PasswordResetButton"));
      await passwordReset.click();
  
      const errorMessageElement = await driver.wait(
          until.elementLocated(By.xpath("//div[text()='Invalid Mail ID']")),
          5000
      );
      const isErrorDisplayed = await errorMessageElement.isDisplayed();
      assert.strictEqual(
          isErrorDisplayed,
          true,
          "Error message is not displayed as expected."
      );
  });
  
  it("should reset password with a valid email ", async function () {
      const email = await driver.findElement(By.id("forgotPasswordemailId"));
      await email.click();
      await email.clear(); 
      await email.sendKeys("a@gmail.com");
  
      const passwordReset = await driver.findElement(By.id("PasswordResetButton"));
      await passwordReset.click();
  
      const resetMessageElement = await driver.wait(
          until.elementLocated(By.xpath("//div[text()='Password Reset']")),
          5000
      );
      const isResetDisplayed = await resetMessageElement.isDisplayed();
      assert.strictEqual(
          isResetDisplayed,
          true,
          "Password reset message is not displayed as expected"
      );
  
      const okButton = await driver.wait(
          until.elementLocated(By.id("ForgotPasswordMailButton")),
          5000
      );
      await okButton.click();
  });
  
    it("NCS App Test-Login Case", async function () {
      await driver.findElement(By.id("loginUserName")).click();
      await driver
        .findElement(By.id("loginUserName"))
        .sendKeys("amanyujith");
      await driver.findElement(By.id("loginPassword")).click();
      await driver.findElement(By.id("loginPassword")).sendKeys("password");
      await driver.findElement(By.id("loginButton")).click();
    });

  });

  
    describe("CHAT", async function () {
      this.timeout(100000);
      before(async function () {
        await driver.sleep(30000);
      });
      it("chatSearch", async function () {
        await driver.executeScript("window.scrollTo(0,0)");
        const search = await driver.wait(
          until.elementLocated(By.id("searchChatGroupsFilesChat")),5000
        );
        await search.click();
        await search.sendKeys("dilshad");

        const searchContainer = await driver.findElement(
          By.id("searchItemContainer")
        );

        await driver.sleep(5000);
        const searchResults = await searchContainer.findElements(
          By.id("searchResultItem")

        );
        const searchResult = await searchResults[searchResults.length - 1];
        await searchResult.click();
      });

      it("chatInterface", async function () {
        await driver.sleep(1000);
        const originalWindow = await driver.getWindowHandle();
        await driver.executeScript("window.scrollTo(0,0)");
        await driver.sleep(5000);

        //sending text
        const inputArea = await driver.findElement(By.css(".notranslate"));
        await inputArea.click();
        await inputArea.sendKeys("This is a test text");
        const sendButtton = await driver.wait(
          until.elementLocated(By.id("sendMessageButton1")),
          5000
        );
        await sendButtton.click();

        const chatMessages = await driver.findElements(
          By.css("#chatMsg > div")
        );
        const lastTextMessage = await chatMessages[
          chatMessages.length - 1
        ].getText();
        assert(
          lastTextMessage.includes("This is a test text"),
          "Text message not sent correctly."
        );
        console.log(lastTextMessage);

        //sending image

        // const fileUpload = await driver.findElement(By.id("handleOpenFileDialog"));
        await driver
          .findElement(By.css(".flex-row > input"))
          .sendKeys('C:\\Users\\amany\\Desktop\\Amanyu\\Amanyu.jpg');
        await driver.sleep(10000);
        await driver
          .wait(until.elementLocated(By.id("sendMessageButton1")), 5000)
          .click();

        const fileMessages = await driver.findElements(By.css(".group-files"));
        const lastFileMessage = await fileMessages[fileMessages.length - 1];
        assert(lastFileMessage, "File message not sent correctly.");

        //sending audio

        await driver.findElement(By.css("#startRecording")).click();
        await driver.findElement(By.css(".inline-block:nth-child(5)")).click();
        await driver.findElement(By.css(".inline-block:nth-child(5)")).click();
        await driver.findElement(By.css(".inline-block:nth-child(6)")).click();
        await driver
          .wait(until.elementLocated(By.id("sendMessageButton1")), 5000)
          .click();
        await driver.executeScript("window.scrollTo(0,0)");

        const audioMessages = await driver.findElements(By.css(".audioWave"));
        const lastAudioMessage = await audioMessages[audioMessages.length - 1];
        assert(lastAudioMessage, "Audio message not sent correctly.");

        //starting call

        await driver.executeScript("window.scrollTo(0,0)");

        await driver.executeScript(`
          const overlay = document.getElementById('webpack-dev-server-client-overlay');
          if (overlay) {
              overlay.parentNode.removeChild(overlay);
          }
      `);

        const startAudioCallButton = await driver.wait(
          until.elementLocated(By.id("startAudioCall")),
          10000 // Wait up to 10 seconds
      );
  
      await driver.wait(until.elementIsVisible(startAudioCallButton), 10000);
      await startAudioCallButton.click();

        let options = new firefox.Options();
        options.addArguments("-private");
        let driverB = await new Builder()
          .forBrowser("firefox")
          .setFirefoxOptions(options)
          .build();
        await driverB.manage().window().maximize();
        await driverB.get("https://us3-test.ncsapp.com/app");
        const newWindowHandle = await driverB.getWindowHandle();
        await driverB.findElement(By.id("loginPassword")).sendKeys("password");
        await driverB
          .findElement(By.id("loginUserName"))
          .sendKeys("dilshad");

        await driverB.findElement(By.id("loginButton")).click();

        // await driverB.sleep(10000);

        const chatSectionB = await driverB.wait(
          until.elementLocated(By.id("CHATSECTION"))
        );
        await chatSectionB.click();

        await driverB
          .findElement(By.id("e69d57c3-2270-4084-a113-69b27b445ffb"))
          .click();
        await driverB.executeScript("window.scrollTo(0,0)");
        await driverB.sleep(5000);
        await driverB.findElement(By.id("JoinExistingCall")).click();

        // const Answer = await driver.wait(
        //   until.elementLocated(By.xpath("//button/div[text()='Answer']")),
        //   5000
        // );

        // await Answer.click();
        await driverB.sleep(5000);

        await driver.switchTo().window(originalWindow);
        await driver.executeScript(`
          const overlay = document.getElementById('webpack-dev-server-client-overlay');
          if (overlay) {
              overlay.parentNode.removeChild(overlay);
          }
      `);
        await driver.sleep(10000);

        await driver.findElement(By.id("miniplayercontrols")).click();
        await driver.findElement(By.id("videoButtonMini")).click();
        await driver
          .findElement(By.css(".gap-4 > div > .cursor-pointer"))
          .click();
        await driver.findElement(By.css(".mb-\\[3px\\] > svg")).click();
        await driver.findElement(By.id("AddMembersearch")).click();

        await driver.findElement(By.id("AddMembersearch")).sendKeys("amany");
        await driver.sleep(5000)
        const checkBox = await driver.wait(
          until.elementLocated(By.id("group_members")),
          5000
        );
        const searchResult = await checkBox.getAttribute('value')
        assert.strictEqual(searchResult,"38ae006e-db07-4df4-bb2d-3ed895be699e", "chat invite failed")
        await driver.executeScript("arguments[0].click();", checkBox);
        // await driver.findElement(By.id("group_members")).click()
        await driver.findElement(By.id("PostInvite")).click();
        await driver.findElement(By.id("callHangUp")).click(); 
        
        await driverB.switchTo().window(newWindowHandle);
        await driverB.executeScript(`
          const overlay = document.getElementById('webpack-dev-server-client-overlay');
          if (overlay) {
              overlay.parentNode.removeChild(overlay);
          }
      `);
        await driverB.sleep(1000);
        await driverB.findElement(By.id("callHangUp")).click();
        await driverB.quit();
        await driver.switchTo().window(originalWindow);



      });
      });

//       //starting meeting section 

    describe("MEETING SESSION", async function() {
      this.timeout(100000);
    describe("Scheduling a meeting and canceling it", async function() {
    //await driver.get("https://netstratum.ncsapp.com/app/home")
    try{
   it("Entering to Schedule meeting section in Meeting section",async function () {
    const meeting =  await driver.wait(until.elementLocated(By.id("MEETINGSECTION")));
    await meeting.click();
    await driver.wait(until.elementLocated(By.id("schedule_Meeting")),5000).click();
   })
   it("Entering description for the meeting",async function () {
    await driver.wait(until.elementLocated(By.id("descriptionMeeting")),5000).sendKeys("Schedule Discussion about new project");
   })
   it("Selecting the meeting date",async function () {
    const calender = await driver.wait(until.elementLocated(By.id("handleFirstCalenderMeet")),5000);
    await calender.click();
    const todayElement = await driver.wait(
      until.elementLocated(By.css(".react-datepicker__day--today")),
      10000
  );
  const tomorrowElement = await driver.executeScript("return arguments[0].nextElementSibling;", todayElement);
    await tomorrowElement.click();
    await calender.click();
   })
    it("Setting meeting time",async function () {
      const setTime = await driver.wait(until.elementLocated(By.id('setTime')),5000);
    await setTime.click();
    await driver.findElement(By.css("div.rc-time-picker-panel-select ul li:nth-child(11)")).click();
    await setTime.click();
    })
    it("selecting recurring meeting option",async function () {
      const recurringCheckbox = await driver.findElement(By.id("recurringMeeting"));
    await driver.executeScript("arguments[0].click();", recurringCheckbox);
    })
    it("Selecting the occurance of the meeting",async function () {
      const optionDefaults = await driver.wait(until.elementsLocated(By.id("optionDefault")));
      console.log(optionDefaults.length);
      const recurringDefault = await optionDefaults[0];
      await recurringDefault.click();
      const weekly = await driver.findElement(By.id("daily"));
      await weekly.click();
      const repeatDefault = await optionDefaults[1];
      await repeatDefault.click();
      const twoDay = await driver.findElement(By.id("2"));
      await twoDay.click();
      const radioDaily = await driver.findElement(By.id("radioDaily"));
      await radioDaily.click();
      const handleSecondCalenderMeet = await driver.findElement(By.id("handleSecondCalenderMeet"));
      handleSecondCalenderMeet.click();
  
      await driver.wait(until.elementLocated(By.css(".react-datepicker__day")), 10000); // 10 seconds timeout
      const enabledDayElement = await driver.findElement(By.css(".react-datepicker__day:not(.react-datepicker__day--disabled)"));
      await enabledDayElement.click();
  
      const expiryDatesInput = await driver.findElement(By.id("expiryDates"));
      await expiryDatesInput.click();
      const radioDailyoccurrences = await driver.findElement(By.id("radioDailyoccurrences"));
      await radioDailyoccurrences.click();
      if (radioDailyoccurrences) radioDailyoccurrences.clear();
      await radioDailyoccurrences.sendKeys("8");
      const securityDefault = await optionDefaults[2];
      await securityDefault.click();
      const hostAdmits = await driver.findElement(By.id("locked"));
      await hostAdmits.click();
    })
   it("cancelling the schedule",async function () {
    const cancelBtn = await driver.findElement(By.id("cancelBtn"));
    await cancelBtn.click();
   })
  }catch(error) {
    console.error("Error in canceling meeting:", error);
  }
       })
  
 //end of cancel meeting

  describe('scheduling Meeting in Meeting Session', async function() {
    // await driver.get("http://localhost:3000/app/home");
    try{
    it("Entering Schedule meeting section in Meeting section",async function () {
      const meeting =  await driver.wait(until.elementLocated(By.id("MEETINGSECTION")));
    await meeting.click();
    await driver.wait(until.elementLocated(By.id("schedule_Meeting")),5000).click();
    })
    it("Enter description for meeting",async function () {
      await driver.wait(until.elementLocated(By.id("descriptionMeeting")),5000).sendKeys("Shedule Discussion about new project (recurring meeting)");

    })
    it("Selecting date of meeting",async function () {
      const calender = await driver.wait(until.elementLocated(By.id("handleFirstCalenderMeet")),5000);
    await calender.click();
   
    const todayElement = await driver.wait(
      until.elementLocated(By.css(".react-datepicker__day--today")),
      10000
  );
    const tomorrowElement = await driver.executeScript("return arguments[0].nextElementSibling;", todayElement);
    await tomorrowElement.click();
    })

    it("Setting the time of meeting",async function () {
      const setTime = await driver.wait(until.elementLocated(By.id('setTime')),5000);
    await setTime.click();
    })
    // await driver.findElement(By.css("div.rc-time-picker-panel-select ul li:nth-child(11)")).click();
    // body > div:nth-child(6) > div > div > div > div.rc-time-picker-panel-combobox > div.rc-time-picker-panel-select.rc-time-picker-panel-select-active > ul > li:nth-child(2)
    it("Selecting the recurring option",async function () {
      const recurringCheckbox = await driver.findElement(By.id("recurringMeeting"));
    await driver.executeScript("arguments[0].click();", recurringCheckbox);
    })

    it("Selecting the occurance of the meeting",async function () {
      const optionDefaults = await driver.wait(until.elementsLocated(By.id("optionDefault")));
    console.log(optionDefaults.length);
    const recurringDefault = await optionDefaults[0];
    await recurringDefault.click();
    const weekly = await driver.findElement(By.id("weekly"));
    await weekly.click();
    const repeatDefault = await optionDefaults[1];
    await repeatDefault.click();
    const twoDay = await driver.findElement(By.id("2"));
    await twoDay.click();
    const datesCheckbox = await driver.findElement(By.id("dates"));
    await driver.executeScript("arguments[0].click();", datesCheckbox);
    const radioDaily = await driver.findElement(By.id("radioDaily"));
    await radioDaily.click();
    const handleSecondCalenderMeet = await driver.findElement(By.id("handleSecondCalenderMeet"));
    handleSecondCalenderMeet.click();

    await driver.wait(until.elementLocated(By.css(".react-datepicker__day")), 10000); // 10 seconds timeout
    const enabledDayElement = await driver.findElement(By.css(".react-datepicker__day:not(.react-datepicker__day--disabled)"));
    await enabledDayElement.click();

    const expiryDatesInput = await driver.findElement(By.id("expiryDates"));
    await expiryDatesInput.click();
    const radioDailyoccurrences = await driver.findElement(By.id("radioDailyoccurrences"));
    await radioDailyoccurrences.click();
    if (radioDailyoccurrences) radioDailyoccurrences.clear();
    await radioDailyoccurrences.sendKeys("8");
    const securityDefault = await optionDefaults[2];
    await securityDefault.click();
    const hostAdmits = await driver.findElement(By.id("open"));
    await hostAdmits.click();
    })
    it("Scheduling the meeting",async function () {
      const sheduleBtn = await driver.findElement(By.id("scheduleBtn"));
    await sheduleBtn.click();
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.css(".self-end")),5000).click();
    })
  }catch(error) {
    console.error("Error  in the scheduling meeting1:", error);
  }
   
  })

  // end of scheduledMeeting 
  //new joseph

  describe('upcoming-meeting  Session', async function() {
  it("upcoming-meeting in Meeting Session", async function () {
    try{

      
    await driver.sleep(5000);
    await driver.findElement(By.id("upcoming_Meeting")).click();
    await driver.wait(until.elementLocated(By.id("customButton2"))).click();
    await driver.wait(until.elementLocated(By.id("customButton3"))).click();
    await driver.findElement(By.id("customButton1")).click();
    await driver.findElement(By.css(".rbc-btn-group:nth-child(3) > button:nth-child(1)")).click();
    await driver.findElement(By.css(".rbc-btn-group:nth-child(3) > button:nth-child(2)")).click();
    await driver.findElement(By.css(".rbc-btn-group:nth-child(3) > button:nth-child(3)")).click();
    await driver.findElement(By.id("customButton1")).click();
    await driver.findElement(By.id("setlist")).click();
    // await driver.wait(until.elementLocated(By.id("setSecondCalender"))).click();

    // await driver.wait(until.elementLocated(By.css(".react-datepicker__day")), 10000); 
    // const startDate = await driver.findElement(By.css(".react-datepicker__day.react-datepicker__day--today"));
    // await startDate.click();

    const calender = await driver.wait(until.elementLocated(By.id("setSecondCalender")),5000);
    await calender.click();
   
    const todayElement = await driver.wait(
      until.elementLocated(By.css(".react-datepicker__day.react-datepicker__day--today")),
      10000
  );
    const tomorrowElement = await driver.executeScript("return arguments[0].nextElementSibling;", todayElement);
    await tomorrowElement.click();

    await driver.findElement(By.id("searchCall")).click();
    await driver.executeScript("window.scrollTo(0,0)")
        
    //copy
  
    const hoverElementCopy = await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000)
    hoverElementCopy.click() ;
    await driver.sleep(1000);
    const handleCopy = await driver.wait(until.elementLocated(By.id("handleCopyURL")),5000);
    await driver.wait(until.elementIsVisible(handleCopy),10000);
    await handleCopy.click();
    

    
    //edit
    try {
      const hoverElementEdit = await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000)
    hoverElementEdit .click() ;
    const handleEdit = await driver.wait(until.elementLocated(By.id("handleEdit")),5000);
    await driver.wait(until.elementIsVisible(handleEdit),10000);
    await handleEdit.click();
      
    } catch (error) {
       console.error('1',error)
     }
    
    // let element;
    // try {
    //     element = await driver.wait(until.elementLocated(By.id("handleSingleRecEditClick")), 5000);
    //     } 
    // catch (error) {
    //     element = await driver.wait(until.elementLocated(By.id("handleSingleRecEdit")), 5000);
    //     }
    //no recurring -handleSingleRecEditClick
      //recuring -this occurence-handleSingleRecEdit
      //recuring -All  occurence-handleAllRecEdit
    let editButton;
    try {
      editButton = await driver.findElement(By.id('handleSingleRecEditClick'));
    } catch (error) {
      console.error('handleSingleRecEditClick button not found, trying handleSingleRecEdit');
    }

    // If the first button is not found, try locating the second button (handleSingleRecEdit)
    if (!editButton) {
      try {
        editButton = await driver.findElement(By.id('handleSingleRecEdit'));
        await editButton.click();
      } catch (error) {
        console.error('Neither edit button was found.', error);
      }
    };

    try {
      await driver.findElement(By.id("setTime")).click();
    await driver.findElement(By.className("rc-time-picker-panel-select-option-selected")).click();
    await driver.findElement(By.id("scheduleBtn")).click();
    await driver.wait(until.elementLocated(By.css(".self-end")),5000).click();
    await driver.wait(until.elementLocated(By.id("setlist"))).click();
    const calender = await driver.wait(until.elementLocated(By.id("setSecondCalender")),5000);
    await calender.click();
   
    const todayElement = await driver.wait(
      until.elementLocated(By.css(".react-datepicker__day.react-datepicker__day--today")),
      10000
  );
    const tomorrowElement = await driver.executeScript("return arguments[0].nextElementSibling;", todayElement);
    await tomorrowElement.click();

    await driver.findElement(By.id("searchCall")).click();
      
     } catch (error) {
      
      console.error("2", error)
    }
     
    try {
      const hoverElementEdit1 = await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000)
    hoverElementEdit1.click() ;
    const handleEdit1 = await driver.wait(until.elementLocated(By.id("handleEdit")),5000);
    await driver.wait(until.elementIsVisible(handleEdit1),10000);
    await handleEdit1.click();
      
     } catch (error) {
       console.error("3", error)
      
     }
    


    let editButton1;
    try {
      editButton1 = await driver.findElement(By.id('handleSingleRecEditClick'));
    } catch (error) {
      console.error('handleSingleRecEditClick button not found, trying handleAllRecEdit');
    }

    // If the first button is not found, try locating the second button (handleAllRecEdit)
    if (!editButton1) {
      try {
        editButton1 = await driver.findElement(By.id('handleAllRecEdit'));
        await editButton1.click();
      } catch (error) {
        console.error('Neither edit button was found.', error);
      }
    };
    // await element.click();
  
   try {
      //await driver.findElement(By.id("setTime")).click();
    //await driver.findElement(By.className("rc-time-picker-panel-select-option-selected")).click();
   // await driver.findElement(By.id("descriptionMeeting")).click();
   const descriptionMeetingElement = await driver.wait(until.elementLocated(By.id('descriptionMeeting')), 10000);
    await descriptionMeetingElement.click();
    await driver.findElement(By.id("scheduleBtn")).click();
    await driver.wait(until.elementLocated(By.css(".self-end")),5000).click();
    await driver.wait(until.elementLocated(By.id("setlist"))).click();
      
     } catch (error) {
       console.error("4", error)
      
     }
    
      
    //cancelling the delete of meeting
  
    const hoverElementCancel = await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000)
    hoverElementCancel.click() ;

    await driver.sleep(1000);
    const handleCancelOneCase = await driver.wait(until.elementLocated(By.id('handleDeleteCase')), 5000);
    await driver.wait(until.elementIsVisible(handleCancelOneCase), 10000);
    await handleCancelOneCase.click();
    // await driver.findElement(By.id("handleSingleClickMeet")).click();
    let button;
    try {
      button = await driver.findElement(By.id('handleSingleCancelClick'));
    } catch (error) {
      console.error('handleSingleCancelClick button not found, trying handleCancelClick');
    }

    // If the first button is not found, try locating the second button (handleCancelClick)
    if (!button) {
      try {
        button = await driver.findElement(By.id('handleCancelClick'));
        await button.click();
      } catch (error) {
        console.error('Neither cancel button was found.', error);
      }
    };

    
    // CLICK AWAY to reset any UI state (clicking somewhere neutral on the page)
    await driver.wait(until.stalenessOf(button), 10000);
    await driver.executeScript('document.body.click();');
    await driver.sleep(500);  // Short wait to ensure the UI is reset
    

    //deleting the meeting  
      
    const hoverElementDelete = await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000) ;
    hoverElementDelete.click();
    const handledeleteOneCase = await driver.wait(until.elementLocated(By.id('handleDeleteCase')), 5000);
    await driver.wait(until.elementIsVisible(handledeleteOneCase), 10000);
    await handledeleteOneCase.click();
    let button1;
    try {
      button1 = await driver.findElement(By.id('handleSingleClickMeet'));
    } catch (error) {
      console.error('handleSingleClickMeet button not found, trying handleAllClick');
    }

    if (!button1) {
      try {
        button1 = await driver.findElement(By.id('handleAllClick'));
        await button1.click();
      } catch (error) {
        console.error('Neither delete button was found.', error);
      }
    }
      
    
   }catch(error) {
    console.error("Error in upcoming meeting:", error);
   }
    
  })
});

  // end of upcoming-meeting
  // // handleSingleClick
  describe('new-scheduleMeeting  Session', async function() {
   it('new-scheduleMeeting in Meeting Session', async function() {
    // await driver.get("http://localhost:3000/app/home");
    
    try{
    
    const shedule = await driver.wait(until.elementLocated(By.id("schedule_Meeting")),5000)
    await driver.executeScript("arguments[0].click();", shedule);
    await driver.wait(until.elementLocated(By.id("descriptionMeeting")),5000).sendKeys("Schedule Discussion about new project (Non recurring meeting)");
    // const recurringCheckbox = await driver.findElement(By.id("recurringMeeting"));
    // await driver.executeScript("arguments[0].click();", recurringCheckbox);
    
    const sheduleBtn = await driver.findElement(By.id("scheduleBtn"));
    await sheduleBtn.click();
   
    //const over = await driver.wait(until.elementLocated(By.id("webpack-dev-server-client-overlay")), 5000);
    
    // const overlayExists = await driver.findElements(By.id("webpack-dev-server-client-overlay"));
    // if (overlayExists.length > 0) {
    //   const overlay = overlayExists[0];
    //   await driver.executeScript("arguments[0].parentNode.removeChild(arguments[0]);", overlay);
    // }
    
    // await driver.wait(until.elementLocated(By.css('button[aria-label="Dismiss"]')),5000).click();
    await driver.sleep(10000);

    
    

    // const modal = await driver.wait(until.elementLocated(By.css(".self-end")),5000)
    // await driver.executeScript("arguments[0].click();", modal);
    


  }catch(error) {
    console.error("Error  in the scheduling meeting2:", error);
  }
   
   })
  });

  
describe("new-upcoming-meeting in Meeting Session", async function () {
  it("New upcoming",async function () {
    
  
    try{


      await driver.executeScript(`
        const overlay = document.getElementById('webpack-dev-server-client-overlay');
        if (overlay) {
            overlay.parentNode.removeChild(overlay);
        }
      `);

      // 
      //no recurring -handleSingleRecEditClick
      //recuring -this occurence-handleSingleRecEdit
      //recuring -All  occurence-handleAllRecEdit
      //
    await driver.wait(until.elementLocated(By.id("setlist"),5000)).click();
    
    await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000).click() ;
    const handledeleteOneCaseAll = await driver.wait(until.elementLocated(By.id('handleDeleteCase')), 5000);
    await driver.wait(until.elementIsVisible(handledeleteOneCaseAll), 10000);
    await handledeleteOneCaseAll.click();
    const deleteButton = await driver.wait(until.elementLocated(By.id("handleSingleClickMeet"),3000));
      await deleteButton.click();
    // let button2;
    // try {
    //   button2 = await driver.findElement(By.id('handleSingleClickMeet'));
    // } catch (error) {
    //   console.error('handleSingleClickMeet button not found, trying handleSingleClick');
    // }

    // if (!button2) {
    //   try {
    //     button2 = await driver.findElement(By.id('handleSingleClick'));
    //     await button2.click();
    //   } catch (error) {
    //     console.error('Neither delete button was found.', error);
    //   }
    // }
   }catch(error) {
     console.error("Error  in the new-upcoming:", error);
   }
  });
})


  //new 

//  describe("PERSONAL MEETING SESSION",async function() {

//   it("should wait for the dev server overlay to be removed", async function() {
//     await driver.sleep(10000);
//     await driver.executeScript(`
//       const overlay = document.getElementById('webpack-dev-server-client-overlay');
//       if (overlay) {
//           overlay.parentNode.removeChild(overlay);
//       }
//     `);
//   });

//   it("should open the personal meeting section", async function() {
//     try {
//       const meeting = await driver.wait(until.elementLocated(By.id("personal_meeting")), 5000);
//       await meeting.click();
//     } catch (error) {
//       console.error("Error while opening the personal meeting section:", error);
//     }
//   });

//   it("should copy and cancel edit data", async function() {
//     try {
//       await driver.wait(until.elementLocated(By.id("copyLinkData")), 5000).click();
//       await driver.wait(until.elementLocated(By.id("setSaveData")), 5000).click();
//       await driver.wait(until.elementLocated(By.id("setCancelData")), 5000).click();
//     } catch (error) {
//       console.error("Error while copying and cancelling the edit:", error);
//     }
//   });

//   it(" edited the personal meeting", async function() {
//     try {
//       await driver.wait(until.elementLocated(By.id("setSaveData")), 5000).click();
//       await driver.findElement(By.id("myMeetingId")).click();
//       await driver.findElement(By.id("phone_bridge")).click();
//       await driver.findElement(By.css(".w-3\\.5")).click();
//       await driver.findElement(By.id("myMeeting")).click();
//       await driver.findElement(By.id("join_modePersonal")).click();
//       await driver.findElement(By.css("option:nth-child(1)")).click();
//       await driver.findElement(By.id("setSaveData")).click();
//       await driver.wait(until.elementLocated(By.id("copyLinkData")), 5000).click();
//     } catch (error) {
//       console.error("Error while editing the personal meeting:", error);
//     }
//   });

//   it("switched to new window and joined the meeting  in personal meeting session", async function() {
//     try {
//       const originalWindow = await driver.getWindowHandle();
//       await driver.wait(until.elementLocated(By.id("setStartData")), 5000).click();
//       await driver.sleep(5000);
//       const windows = await driver.getAllWindowHandles();
//       const newWindow = windows.find(handle => handle !== originalWindow);
//       await driver.switchTo().window(newWindow);
//     } catch (error) {
//       console.error("Error while switching to the new meeting window:", error);
//     }

    
//     try {
//       // Enter the username and click join
//       await driver.wait(until.elementLocated(By.id("userName"))).sendKeys("ashwant");
//       await driver.wait(until.elementLocated(By.id("joinButton")), 5000).click();
      
//       const meetingScreen = await driver.wait(until.elementLocated(By.id("MeetingSection")), 5000);
//       const isMeetingScreenDisplayed = await meetingScreen.isDisplayed();
      
//       assert.strictEqual(isMeetingScreenDisplayed, true, "User should be redirected to the meeting screen after joining.");
      
//     } catch (error) {
//       console.error("Error while joining the meeting:", error);
//     }
    
//   });

  
//   it(" leaved the meeting  by clicking leave button ", async function () {
//     try {
//       // Leave the meeting
//       await driver.wait(until.elementLocated(By.id("leaveIcon")), 6000).click();
//       await driver.wait(until.elementLocated(By.id("leaveButton")), 5000).click();
  
//       // Close the current tab
//       await driver.sleep(3000);  // Small delay to ensure the window is ready to close
//       await driver.close();  // Close the current tab
//       console.log("New tab closed");
  
//       // Get all remaining window handles
//       const remainingWindows = await driver.getAllWindowHandles();
  

//       if (remainingWindows.length > 0) {
//         await driver.switchTo().window(remainingWindows[0]);
//       } else {
//         console.log("No windows left to switch to.");
//       }
//     } catch (error) {
//       console.error("Error while leaving the meeting or closing the tab:", error);
//     }
//   });

// });

// describe("PAST MEETING SESSION", async function() {
//   it("submitted the past meeting", async function() {
//   //open past meeting section
//   try{
//   const meeting = await driver.wait(until.elementLocated(By.id("past_meeting")),5000);
//   await meeting.click();
// }catch(error) {
//   console.error("Error while clicking past meeting section:", error);
// }

  
//   //selection for date from one date to another date
//   try{
//   await driver.findElement(By.id("pastFirstCalender")).click()
//   await driver.findElement(By.css(".react-datepicker__day--today")).click()
//   await driver.findElement(By.id("pastSecondCalender")).click()
//   await driver.findElement(By.css(".react-datepicker__day--today")).click()
//   await driver.findElement(By.id("pastSubmit")).click()
// }catch(error) {
//   console.error("Error while choosing calender:", error);
// }
// })
// });



// describe("OPEN MEETING SESSION", async function () {
//   it("scheduled a meeting ", async function () {
//       try {
//           await driver.wait(until.elementLocated(By.id("schedule_Meeting")), 5000).click();
//           await driver.wait(until.elementLocated(By.id("descriptionMeeting")), 5000).sendKeys("Open Project");

//           await driver.findElement(By.className("checkmark")).click();
//           const optionDefaults = await driver.wait(until.elementsLocated(By.id("optionDefault")));
//           console.log(optionDefaults.length);
//           const recurringDefault = await optionDefaults[0];
//           await recurringDefault.click();

//           const noFixed = await driver.findElement(By.id("No fixed time"));
//           await noFixed.click();
//           await driver.findElement(By.id("scheduleBtn")).click();
//           await driver.wait(until.elementLocated(By.css(".self-end")), 5000).click();
//       } catch (error) {
//           console.error("Error while scheduling a meeting:", error);
//       }
//   });

//   it(" opened the meeting section", async function () {
//       try {
//           const meeting = await driver.wait(until.elementLocated(By.id("open_meeting")), 5000);
//           await meeting.click();
//           await driver.findElement(By.id("searchText")).click();
//       } catch (error) {
//           console.error("Error while clicking open meeting section:", error);
//       }
//   });

//   it("copyed the meeting link and cancelled the delete operation", async function () {
//       try {
//           await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/div[2]/div[2]/div/div/div/main/div/div/div[2]/div[2]/div/div/div/div/div[2]/div/div[1]')), 5000).click();
//           await driver.findElement(By.id("copyOpenMeeting")).click();
//           await driver.findElement(By.id("deleteOpenMeeting")).click();
//           await driver.findElement(By.id("handleSingleCancelClick")).click();
//       } catch (error) {
//           console.error("Error while copying and canceling a delete operation:", error);
//       }
//   });

//   it("cancelled  edit for the first time", async function () {
//       try {
//           await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/div[2]/div[2]/div/div/div/main/div/div/div[2]/div[2]/div/div/div/div/div[2]/div/div[1]')), 5000).click();
//           await driver.findElement(By.id("editOpenMeeting")).click();
//           await driver.findElement(By.id("RecCancelClick")).click();
//       } catch (error) {
//           console.error("Error while canceling the edit for the first time:", error);
//       }
//   });

//   it("cancelled the edit after clicking the edit button", async function () {
//       try {
//           await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/div[2]/div[2]/div/div/div/main/div/div/div[2]/div[2]/div/div/div/div/div[2]/div/div[1]')), 5000).click();
//           await driver.findElement(By.id("editOpenMeeting")).click();
//           await driver.findElement(By.id("handleSingleRecEditClick")).click();
//           await driver.findElement(By.id("cancelBtn")).click();
//       } catch (error) {
//           console.error("Error while canceling edit in edit button:", error);
//       }
//   });

//   it(" edited  and scheduled the meeting", async function () {
//       try {
//         await driver.wait(until.elementLocated(By.id("open_meeting")), 5000).click();
//           await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/div[2]/div[2]/div/div/div/main/div/div/div[2]/div[2]/div/div/div/div/div[2]/div/div[1]')), 6000).click();
//           await driver.findElement(By.id("editOpenMeeting")).click();
//           await driver.findElement(By.id("handleSingleRecEditClick")).click();
//           await driver.findElement(By.id("topic")).click();
//           await driver.findElement(By.id("descriptionMeeting")).click();
//           await driver.findElement(By.id("meetingPassword")).click();
//           const recurringMeeting = await driver.wait(until.elementLocated(By.id("recurringMeeting")), 5000);
//           await driver.executeScript("arguments[0].click()", recurringMeeting);
//           await driver.findElement(By.id("handleFirstCalenderMeet")).click();
//           await driver.findElement(By.css(".react-datepicker__day--025")).click();
//           await driver.executeScript("arguments[0].click()", recurringMeeting);
//           await driver.findElement(By.id("scheduleBtn")).click();
//           await driver.sleep(5000);
//       } catch (error) {
//           console.error("Error while editing and scheduling the meeting:", error);
//       }
//   });

//   it("joined the meeting in open meeting session", async function () {
//       try {
//           const meeting = await driver.wait(until.elementLocated(By.id("open_meeting")), 5000);
//           await meeting.click();
//           const originalWindow = await driver.getWindowHandle();
//           await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/div[2]/div[2]/div/div/div/main/div/div/div[2]/div[2]/div/div/div/div/div[2]/div/div[1]')), 5000).click();
//           await driver.wait(until.elementLocated(By.id("startOpenMeeting")), 5000).click();
//           await driver.sleep(5000);
//           const windows = await driver.getAllWindowHandles();
//           const newWindow = windows.find(handle => handle !== originalWindow);
//           await driver.switchTo().window(newWindow);
//         } catch (error) {
//           console.error("Error while starting a meeting:", error);
//       }
//     });

//     it(" entered the  username and clicked the join button ", async function () {
     
//       try {
//         await driver.wait(until.elementLocated(By.id("userName"))).sendKeys("ashwant");
//         await driver.wait(until.elementLocated(By.id("joinButton")), 5000).click();
        
//         const meetingScreen = await driver.wait(until.elementLocated(By.id("MeetingSection")), 5000);
//         const isMeetingScreenDisplayed = await meetingScreen.isDisplayed();
        
//         assert.strictEqual(isMeetingScreenDisplayed, true, "User should be redirected to the meeting screen after joining.");
        
//       } catch (error) {
//         console.error("Error while joining the meeting:", error);
//       }
//     });
  

//     it("leaved the meeting by clicking the leave button ", async function () {
//             try {
              
//               await driver.wait(until.elementLocated(By.id("leaveIcon")), 6000).click();
//               await driver.wait(until.elementLocated(By.id("leaveButton")), 5000).click();
          
//               await driver.sleep(3000);  
//               await driver.close();  
//               console.log("New tab closed");
          
//               const remainingWindows = await driver.getAllWindowHandles();
          
//               if (remainingWindows.length > 0) {
//                 await driver.switchTo().window(remainingWindows[0]);
//               } else {
//                 console.log("No windows left to switch to.");
//               }
//             } catch (error) {
//               console.error("Error while leaving the meeting or closing the tab:", error);
//             }
//           });
  


//   it(" deleted the OpenMeeting in the open meeting list", async function () {
//       try {
//           const meeting = await driver.wait(until.elementLocated(By.id("open_meeting")), 5000);
//           await meeting.click();
//           await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/div[2]/div[2]/div/div/div/main/div/div/div[2]/div[2]/div/div/div/div/div[2]/div/div[1]')), 5000).click();
//           await driver.findElement(By.id("deleteOpenMeeting")).click();
//           await driver.findElement(By.id("handleSingleClickMeet")).click();
//       } catch (error) {
//           console.error("Error while deleting a meeting:", error);
//       }
//   });
// });

  //new

// describe("NCS MEETING APP SECTION", async function () {
// it("entered the meeting ID and click the join button", async function () {
//   try {
//     await driver.wait(until.elementLocated(By.id("meetingID")), 5000).click();
//     await driver.sleep(5000);
//     await driver.findElement(By.id("meetingID")).sendKeys("1704327551");
//   } catch (error) {
//     console.error("Error while entering meeting ID:", error);
//   }
// });

// it(" joined the meeting and switched to new window", async function () {
//   try {
//     const originalWindow = await driver.getWindowHandle();
//     await driver.findElement(By.id("joinMeeting")).click();
//     await driver.sleep(5000);

//     const windows = await driver.getAllWindowHandles();
//     const newWindow = windows.find(handle => handle !== originalWindow);
//     await driver.switchTo().window(newWindow);
//   } catch (error) {
//     console.error("Error while joining meeting:", error);
//   }
// });

// it(" entered the  username and clicked join button for meeting", async function () {
 
//   try {
    
//     await driver.wait(until.elementLocated(By.id("userName"))).sendKeys("ashwant");
//     await driver.wait(until.elementLocated(By.id("joinButton")), 5000).click();
    
//     const meetingScreen = await driver.wait(until.elementLocated(By.id("MeetingSection")), 5000);
//     const isMeetingScreenDisplayed = await meetingScreen.isDisplayed();
    
//     assert.strictEqual(isMeetingScreenDisplayed, true, "User should be redirected to the meeting screen after joining.");
    
//   } catch (error) {
//     console.error("Error while joining the meeting:", error);
//   }
// });

// it(" clicked the  reactions in the meeting", async function () {
//   try {
//     await driver.wait(until.elementLocated(By.id("MeetingSection")), 8000).click();
//     await driver.wait(until.elementLocated(By.id("reactionButton")), 5000).click();
//     await driver.findElement(By.css(".text-2xl")).click();
//     await driver.wait(until.elementLocated(By.id("reactionButton")), 5000).click();
//   } catch (error) {
//     console.error("Error while clicking reactions:", error);
//   }
// });

// it(" toggled the microphone", async function () {
//   try {
//     await driver.wait(until.elementLocated(By.id("microphone")), 5000).click();
//     await driver.wait(until.elementLocated(By.id("microphone")), 5000).click();
//   } catch (error) {
//     console.error("Error while toggling microphone:", error);
//   }
// });

// it("toggled the video button", async function () {
//   try {
//     await driver.wait(until.elementLocated(By.id("videoButton")), 5000).click();
//     await driver.wait(until.elementLocated(By.id("videoButton")), 5000).click();
//   } catch (error) {
//     console.error("Error while toggling video:", error);
//   }
// });

// it("opened and closed the whiteboard", async function () {
//   try {
//     await driver.wait(until.elementLocated(By.id("sharePopup")), 6000).click();
//     await driver.sleep(5000);
//     await driver.wait(until.elementLocated(By.id("whiteboardMeeting")), 6000).click();
//     await driver.wait(until.elementLocated(By.id("whiteboardModal")), 7000).click();
//     await driver.sleep(5000);
//     await driver.wait(until.elementLocated(By.id("whiteboardButton")), 7000).click();
//   } catch (error) {
//     console.error("Error while opening whiteboard:", error);
//   }
// });

// it("opened the screen share in meeting", async function () {
//   try {
//     await driver.wait(until.elementLocated(By.id("sharePopup")), 6000).click();
//     await driver.wait(until.elementLocated(By.id("screenShareMeetings")), 6000).click();
//   } catch (error) {
//     console.error("Error while opening screen share meetings:", error);
//   }
// });

// it(" entered into the chat list", async function () {
//   try {
//     await driver.wait(until.elementLocated(By.id("openMeetChatList")), 6000).click();
//     await driver.findElement(By.id("searchInputs")).click();
//     await driver.wait(until.elementLocated(By.id("handleAllChat")), 6000).click();
//     await driver.wait(until.elementLocated(By.id("message")), 6000).sendKeys("joseph jaison");
//     await driver.wait(until.elementLocated(By.id("send"))).click();
//     await driver.sleep(5000);
//     await driver.wait(until.elementLocated(By.id("closeMembersList")), 6000).click();
//   } catch (error) {
//     console.error("Error while interacting with chat list:", error);
//   }
// });

// it(" opened and interact with the member list", async function () {
//   try {
//     await driver.wait(until.elementLocated(By.id("openMembersList")), 6000).click();
//     await driver.findElement(By.css(".pl-\\[3px\\]:nth-child(2) > .cursor-pointer > path")).click();
//     await driver.findElement(By.css(".pl-5:nth-child(1)")).click();
//   } catch (error) {
//     console.error("Error while interacting with member list:", error);
//   }
// });

// it("adjusted the  slider settings", async function () {
//   try {
//     const originalWindow = await driver.getWindowHandle();  
//     const windows = await driver.getAllWindowHandles();    
//     await driver.switchTo().window(originalWindow);        // Switch to original window before interacting

//     await driver.wait(until.elementLocated(By.id("moreButton")), 6000).click();
//     await driver.wait(until.elementLocated(By.id("decreaseTileinSlider")), 6000).click();
//     await driver.wait(until.elementLocated(By.id("increaseTileinSlider")), 6000).click();
//   } catch (error) {
//     console.error("Error while adjusting slider:", error);
//   }
// });
// it("should leave the meeting", async function () {
//   try {
    
//     await driver.wait(until.elementLocated(By.id("leaveIcon")), 6000).click();
//     await driver.wait(until.elementLocated(By.id("leaveButton")), 5000).click();

    
//     await driver.sleep(3000);  
//     await driver.close();  
//     console.log("New tab closed");

//     // Get all remaining window handles
//     const remainingWindows = await driver.getAllWindowHandles();

//     // Switch to the remaining window 
//     if (remainingWindows.length > 0) {
//       await driver.switchTo().window(remainingWindows[0]);
//     } else {
//       console.log("No windows left to switch to.");
//     }
//   } catch (error) {
//     console.error("Error while leaving the meeting or closing the tab:", error);
//   }
// });

//  });
  
    
    })
 
    // old pbx , without minimizing the screen 

// describe("PBX", async function () {
//   this.timeout(110000);
//   it("Search", async function () {
//    const originalWindow = await driver.getWindowHandle(); 
//   let pbxSection = await driver.wait(until.elementLocated(By.id("PBXSECTION")), 10000);
//     await pbxSection.click();
//     await driver.executeScript("arguments[0].scrollIntoView(true);", await driver.findElement(By.id("PBXSECTION-LINK")));
//     const search = await driver.wait(until.elementLocated(By.id("searchContactsnumbersnames")), 10000);
//     await search.click();
//     await search.sendKeys("Dilshad M");
//     await search.sendKeys(Key.ENTER);
//     await driver.wait(until.elementLocated(By.id("name")), 10000).click();
//     //await driver.wait(until.elementLocated(By.id("callAccept")), 10000).click();
//     // Open a new Firefox window in private mode
//    let options = new firefox.Options();
//     options.addArguments("-private"); // Enable private browsing
//     options.setPreference('media.navigator.permission.disabled', true);  // Disable permission prompts for media devices
//     options.setPreference('media.navigator.video.enabled', true);       // Enable video
//     options.setPreference('media.navigator.audio.enabled', true);       // Enable audio
//     options.setPreference('media.autoplay.default', 0);                // Allow autoplay of media
//     options.setPreference('permissions.default.camera', 1);            // Allow camera access
//     options.setPreference('permissions.default.microphone', 1);        // Allow microphone access
//     options.setPreference('permissions.default.desktop', 1);           // Allow screen sharing access

//     // Initialize the WebDriver with the Firefox options
//     let driverB = await new Builder()
//       .forBrowser(Browser.FIREFOX)
//       .setFirefoxOptions(options)
//       .build();

//     await driverB.manage().window().maximize();
//     const newWindow = await driverB.getWindowHandle(); 


//     // Navigate to the app and perform login
//     await driverB.get("http://localhost:3000/app/home");
//     await driverB.findElement(By.id("loginPassword")).sendKeys("12345");
//     await driverB.findElement(By.id("loginUserName")).sendKeys("dilshadm@netstratum.com");
//     await driverB.findElement(By.id("loginButton")).click();

//     // Interact with the PBX section in the new window
//     const pbxSectionB = await driverB.wait(until.elementLocated(By.id("PBXSECTION")), 10000);
//     await driverB.executeScript("arguments[0].scrollIntoView(true);", pbxSectionB);
//     await pbxSectionB.click();

//     const searchB = await driverB.wait(until.elementLocated(By.id("searchContactsnumbersnames")), 10000);
//     await searchB.click();
//     await searchB.sendKeys("Aswanth R");
//     await driverB.wait(until.elementLocated(By.id("name")), 5000).click();
//     await searchB.sendKeys(Key.ENTER);
//     await driverB.sleep(3000);
    
//     await driverB.wait(until.elementLocated(By.id("phone-icon")), 10000).click();
//   await driverB.sleep(3000);
//      await driver.switchTo().window(originalWindow);
//     // await driver.sleep(2000); 
//         try{
//      await driver.wait(until.elementLocated(By.id("callAccept")), 10000).click();
//     }catch(error) {
//       console.error("call not accepted:", error);
//  }
//  await driverB.switchTo().window(newWindow);
//      await driverB.sleep(30000);
//      await driverB.wait(until.elementLocated(By.id("Hold")), 10000).click();
//      await driverB.wait(until.elementLocated(By.id("Unhold")), 10000).click();
//      await driverB.wait(until.elementLocated(By.id("Mute")), 10000).click();
//     await driverB.wait(until.elementLocated(By.id("Unmute")), 10000).click();
//     await driverB.sleep(15000);
//     try{
//      await driverB.wait(until.elementLocated(By.id("endcall")), 5000).click();
//     }catch(error) {
//       console.error("call not ended:", error);
//  }
//      await driverB.quit();
//    await driver.sleep(5000);
//   // await driver.wait(until.elementLocated(By.id("Contacts")), 5000).click();
//   // await driver.sleep(2000);
//   await driver.wait(until.elementLocated(By.id("Section-Contacts-0")), 5000).click();
//   await driver.sleep(5000);
//   await driver.wait(until.elementLocated(By.id("Section-Contacts-1")), 5000).click();
//   await driver.sleep(1000);
//   await driver.wait(until.elementLocated(By.id("Section-Contacts-2")), 5000).click();
//   await driver.sleep(1000);
//   await driver.wait(until.elementLocated(By.id("Section-Contacts-3")), 5000).click();
//   await driver.sleep(1000);
//   await driver.wait(until.elementLocated(By.id("filter-icon")), 5000).click();
//   await driver.sleep(2000);
//   await driver.wait(until.elementLocated(By.id("submit")), 5000).click();
//   await driver.wait(until.elementLocated(By.id("Call History")), 5000).click();
//   await driver.sleep(1000);
//   await driver.wait(until.elementLocated(By.id("Section-Call_History-0")), 5000).click();
//   await driver.sleep(1000);
//   await driver.wait(until.elementLocated(By.id("Section-Call_History-1")), 5000).click();
//   await driver.sleep(1000);
//   await driver.wait(until.elementLocated(By.id("Section-Call_History-2")), 5000).click();
//   await driver.sleep(1000);
//   await driver.wait(until.elementLocated(By.id("Section-Call_History-3")), 5000).click();
//   await driver.sleep(1000);
//   await driver.wait(until.elementLocated(By.id("filter-icon")), 5000).click();
//   await driver.sleep(1000);
//   await driver.wait(until.elementLocated(By.id("submit")), 5000).click();
//   //await driver.wait(until.elementLocated(By.id("filter-icon")), 5000).click();
//     });
// });
// // 

// original PBX

// describe("PBX", async function () {
//   this.timeout(110000);
//   it("Search", async function () {
//     const originalWindow = await driver.getWindowHandle(); 
//     let pbxSection = await driver.wait(until.elementLocated(By.id("PBXSECTION")), 10000);
//     await pbxSection.click();
//     await driver.executeScript("arguments[0].scrollIntoView(true);", await driver.findElement(By.id("PBXSECTION-LINK")));
//     const search = await driver.wait(until.elementLocated(By.id("searchContactsnumbersnames")), 10000);
//     await search.click();
//     await search.sendKeys("Dilshad ");
//     await search.sendKeys(Key.ENTER);
//     await driver.wait(until.elementLocated(By.id("name")), 10000).click();
    
//     // Set the original window to occupy the left side of the screen
//     await driver.manage().window().setRect({ width: 960, height: 1080, x: 0, y: 0 }); // Left side of the screen

//     // Open a new Firefox window in private mode
//     let options = new firefox.Options();
//     options.addArguments("-private"); // Enable private browsing
//     options.setPreference('media.navigator.permission.disabled', true);  // Disable permission prompts for media devices
//     options.setPreference('media.navigator.video.enabled', true);       // Enable video
//     options.setPreference('media.navigator.audio.enabled', true);       // Enable audio
//     options.setPreference('media.autoplay.default', 0);                // Allow autoplay of media
//     options.setPreference('permissions.default.camera', 1);            // Allow camera access
//     options.setPreference('permissions.default.microphone', 1);       // Allow microphone access
//     options.setPreference('permissions.default.desktop', 1);           // Allow screen sharing access
//     options.setPreference('dom.webnotifications.enabled', true);          // Enable web notifications
//     options.setPreference('permissions.default.desktop-notification', 1); // Allow all desktop notifications

//     // Initialize the WebDriver with the Firefox options
//     let driverB = await new Builder()
//       .forBrowser(Browser.FIREFOX)
//       .setFirefoxOptions(options)
//       .build();

//     // Set the second window to occupy the right side of the screen
//     await driverB.manage().window().setRect({ width: 960, height: 1080, x: 960, y: 0 }); // Right side of the screen

//     const newWindow = await driverB.getWindowHandle(); 

//     // Navigate to the app and perform login in the second window
//     await driverB.get("http://localhost:3000/app/home");
//     await driverB.findElement(By.id("loginPassword")).sendKeys("12345");
//     await driverB.findElement(By.id("loginUserName")).sendKeys("dilshadm@netstratum.com");
//     await driverB.findElement(By.id("loginButton")).click();

//     // Interact with the PBX section in the new window
//     const pbxSectionB = await driverB.wait(until.elementLocated(By.id("PBXSECTION")), 10000);
//     await driverB.executeScript("arguments[0].scrollIntoView(true);", pbxSectionB);
//     await pbxSectionB.click();

//     const searchB = await driverB.wait(until.elementLocated(By.id("searchContactsnumbersnames")), 10000);
//     await searchB.click();
//     await searchB.sendKeys("sidharth");
//     await driverB.wait(until.elementLocated(By.id("name")), 5000).click();
//     await searchB.sendKeys(Key.ENTER);
//     await driverB.sleep(3000);

//     await driverB.wait(until.elementLocated(By.id("phone-icon")), 10000).click();
//     await driverB.sleep(3000);
    
//     // Switch back to the original window
//     await driver.switchTo().window(originalWindow);
//     try {
//       await driver.wait(until.elementLocated(By.id("callAccept")), 10000).click();
//     } catch (error) {
//       console.error("Call not accepted:", error);
//     }
    
//     // Switch to the second window again
//     await driverB.switchTo().window(newWindow);
//     await driverB.sleep(30000);
//     await driverB.wait(until.elementLocated(By.id("Hold")), 10000).click();
//     await driverB.wait(until.elementLocated(By.id("Unhold")), 10000).click();
//     await driverB.wait(until.elementLocated(By.id("Mute")), 10000).click();
//     await driverB.wait(until.elementLocated(By.id("Unmute")), 10000).click();
//     await driverB.sleep(15000);
    
//     try {
//       await driverB.wait(until.elementLocated(By.id("endcall")), 5000).click();
//     } catch (error) {
//       console.error("Call not ended:", error);
//     }
    
//     // Quit the second driver
//     await driverB.quit();
//     await driver.sleep(5000);
//     await driver.manage().window().maximize();

//     // Interact with more sections in the original window
//     await driver.wait(until.elementLocated(By.id("Section-Contacts-0")), 5000).click();
//     await driver.sleep(5000);
//     await driver.wait(until.elementLocated(By.id("Section-Contacts-1")), 5000).click();
//     await driver.sleep(1000);
//     await driver.wait(until.elementLocated(By.id("Section-Contacts-2")), 5000).click();
//     await driver.sleep(1000);
//     await driver.wait(until.elementLocated(By.id("Section-Contacts-3")), 5000).click();
//     await driver.sleep(1000);
//     await driver.wait(until.elementLocated(By.id("filter-icon")), 5000).click();
//     await driver.sleep(2000);
//     await driver.wait(until.elementLocated(By.id("submit")), 5000).click();
//     await driver.wait(until.elementLocated(By.id("Call History")), 5000).click();
//     await driver.sleep(1000);
//     await driver.wait(until.elementLocated(By.id("Section-Call_History-0")), 5000).click();
//     await driver.sleep(1000);
//     await driver.wait(until.elementLocated(By.id("Section-Call_History-1")), 5000).click();
//     await driver.sleep(1000);
//     await driver.wait(until.elementLocated(By.id("Section-Call_History-2")), 5000).click();
//     await driver.sleep(1000);
//     await driver.wait(until.elementLocated(By.id("Section-Call_History-3")), 5000).click();
//     await driver.sleep(1000);
//     await driver.wait(until.elementLocated(By.id("filter-icon")), 5000).click();
//     await driver.sleep(1000);
//     await driver.wait(until.elementLocated(By.id("submit")), 5000).click();
//   });
// });

//PBXCALL

// describe("PBXCALL", async function () {
//   this.timeout(100000);
//   it("call", async function () {
//     const originalWindow = await driver.getWindowHandle(); 
//     let options = new firefox.Options();
//     options.addArguments("-private"); // Enable private browsing
//     options.setPreference('media.navigator.permission.disabled', true);  // Disable permission prompts for media devices
//     options.setPreference('media.navigator.video.enabled', true);       // Enable video
//     options.setPreference('media.navigator.audio.enabled', true);       // Enable audio
//     options.setPreference('media.autoplay.default', 0);                // Allow autoplay of media
//     options.setPreference('permissions.default.camera', 1);            // Allow camera access
//     options.setPreference('permissions.default.microphone', 1);        // Allow microphone access
//     options.setPreference('permissions.default.desktop', 1);           // Allow screen sharing access
//     options.setPreference('dom.webnotifications.enabled', true);          // Enable web notifications
//     options.setPreference('permissions.default.desktop-notification', 1); // Allow all desktop notifications

//     let driverB = await new Builder()
//       .forBrowser(Browser.FIREFOX)
//       .setFirefoxOptions(options)
//       .build();

//     // Set the original window to occupy the left side of the screen
//     await driver.manage().window().setRect({ width: 960, height: 1080, x: 0, y: 0 }); // Left screen
    
//     // Set the second window to occupy the right side of the screen
//     await driverB.manage().window().setRect({ width: 960, height: 1080, x: 960, y: 0 }); // Right screen

//     const newWindow = await driverB.getWindowHandle(); 
//     await driverB.get("http://localhost:3000/app/home");
//     await driverB.findElement(By.id("loginPassword")).sendKeys("12345");
//     await driverB.findElement(By.id("loginUserName")).sendKeys("dilshadm@netstratum.com");
//     await driverB.findElement(By.id("loginButton")).click();

//     await driverB.wait(until.elementLocated(By.id("PBXPHONE")), 5000).click();
//     const call = await driverB.wait(
//       until.elementLocated(By.id("inputnumber")),5000);
//     await call.click();
//     await driver.sleep(5000);
//     await call.sendKeys("1074");
//     await driverB.wait(until.elementLocated(By.id("contactDropdown")), 5000).click();
//     await driverB.wait(until.elementLocated(By.id("pbxcall")), 5000).click();
//     await driverB.sleep(3000);
//     await driver.switchTo().window(originalWindow);  
//     try{
//       await driver.wait(until.elementLocated(By.id("callAccept")), 5000).click();
//       await driverB.switchTo().window(newWindow);
//       await driverB.sleep(30000);
//     }catch(error) {
//       console.error("call not accepted:", error);
//     }
//     try{
//       await driverB.wait(until.elementLocated(By.id("endcall")), 5000).click();
//     }catch(error) {
//       console.error("call not ended:", error);
//     }
//     await driverB.quit();
//   });
// });

// start meeting 



// describe("Start Meeting",async function () {
//   this.timeout(100000);
//   it("Starting a meeting",async function () {
//       await driver.wait(until.elementLocated(By.id('MEETINGSECTION')),3000).click();
//     const start = await driver.wait(until.elementLocated(By.id('startaMeeting')),4000);
//     await start.click();
//       const tabs = await driver.getAllWindowHandles();
//       await driver.switchTo().window(tabs[1]);
//       const joinButton = await driver.wait(until.elementLocated(By.id('joinButton')),20000);
//       await driver.wait(until.elementIsVisible(joinButton), 10000);
//       await joinButton.click();
//   })
//   it('End the Meeting', async function() {
//     const leaveIcon = await driver.wait( until.elementLocated(By.id('leaveIcon')),10000);
//     await driver.wait(until.elementIsVisible(leaveIcon), 10000);
//     await leaveIcon.click();
    
//     const endButton = await driver.wait(until.elementLocated(By.id('endButton')), 10000);
//     await endButton.click();
//     const elementWithText = await driver.wait( until.elementLocated(By.xpath("//*[contains(text(), 'Meeting Ended')]")),10000);

//     await driver.wait(until.elementIsVisible(elementWithText), 10000);
//     await driver.wait(until.elementTextIs(elementWithText, 'Meeting Ended'),10000);
//     await driver.close();
//     const tabs = await driver.getAllWindowHandles();
//     await driver.switchTo().window(tabs[0]);
//    });
// })

//pbx search (for dropdown)

describe("PBX", async function () {
  this.timeout(100000);
  it("PBX-SEARCH", async function () {
  //  const originalWindow = await driver.getWindowHandle();
   await driver.wait(until.elementLocated(By.id("PBXSECTION")), 5000).click();
   await driver.executeScript("arguments[0].scrollIntoView(true);", await driver.findElement(By.id("PBXSECTION-LINK")));

    // const search = await driver.wait(
    //   until.elementLocated(By.id("searchContactsnumbersnames")),5000);
    // await search.click();
    // await search.sendKeys("Dilshad M");
    // await search.sendKeys(Key.ENTER);
    // await driver.wait(until.elementLocated(By.id("name")), 5000).click();

    await driver.sleep(5000);
    // await driver.wait(until.elementLocated(By.id("phone-icon")), 5000).click();
    // await driver.sleep(5000);
    // await driver.wait(until.elementLocated(By.id("endcall")), 5000).click();
    // await driver.sleep(5000);
  });
});



describe("Profile Dropdown", async function () {
    this.timeout(100000);
  it("updating status", async function () {
    await driver.manage().window().maximize();
    

// const drop =await driver.findElement(By.xpath('/html/body/div/div/div[2]/div[2]/div/div/div/main/div/div/div[1]/div[2]/div[2]/button/div/div[2]'));
// await drop.click();

await driver.findElement(By.id('ProfileBoxButtonTopBar')).click();
await driver.wait(until.elementLocated(By.id("statusDropdown")), 5000).click();
await driver.findElement(By.id('status-0')).click();
await driver.sleep(1000);
await driver.wait(until.elementLocated(By.id("statusDropdown")), 5000).click();
await driver.findElement(By.id('status-1')).click();
await driver.sleep(1000);
await driver.wait(until.elementLocated(By.id("statusDropdown")), 5000).click();
await driver.findElement(By.id('status-2')).click();
await driver.sleep(1000);
await driver.wait(until.elementLocated(By.id("statusDropdown")), 5000).click();
await driver.findElement(By.id('status-3')).click();
await driver.sleep(1000);
});
it("Saving status",async function () {
  await driver.findElement(By.id('save-status')).click();
await driver.sleep(1000);
})

it("Clearing status",async function () {
  await driver.findElement(By.id('clearStatusButton')).click();
await driver.sleep(2000);
})

//status-$index = id
// await driver.wait(until.elementLocated(By.id("emojistatus")), 5000).click();
// await driver.sleep(1000);

it("Clicking preferences and selecting profile",async function () {
  await driver.wait(until.elementLocated(By.id("preferences")), 5000).click();
await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("Profile")), 5000).click();
await driver.sleep(2000);
})


//profile



it("updating phone number",async function () {
  await driver.wait(until.elementLocated(By.id("displayName")), 5000).click();
await driver.sleep(2000);
  let phoneNumber = await driver.wait(until.elementLocated(By.id("phoneNumber")), 5000)
await phoneNumber.sendKeys('73567 91418');
await driver.sleep(2000);
})

it("uploading profile picture",async function () {
  let fileInput = await driver.findElement(By.id('profile-photo'));

// Directly provide the full path to the image you want to upload
let filePath = 'C:\\Users\\amany\\Desktop\\Amanyu\\Amanyu.jpg'; // Ensure double backslashes for Windows paths
await driver.sleep(1000);
// Use sendKeys to upload the file (bypassing the file upload popup)
await fileInput.sendKeys(filePath);

// Optionally, you can click the update button after uploading the file
await driver.wait(until.elementLocated(By.id('updateImage')), 5000).click();
})

it("Removing profile picture",async function () {
  await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("removeProfilePicture")), 5000).click();
})
it("setting the current status",async function () {
  await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("status-1")), 5000).click();
await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("status-2")), 5000).click();
await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("status-3")), 5000).click();
await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("status-4")), 5000).click();
})

it("clearing the status",async function () {
  await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("clear-status")), 5000).click();
})

it("setting timezone",async function () {
  await driver.sleep(2000);
const timezone = await driver.wait(until.elementLocated(By.id("timezone")), 5000);
// await timezone.click();
await driver.executeScript("arguments[0].scrollIntoView(true);", timezone);
await driver.sleep(3000);  // Give it some time to scroll
await driver.executeScript("arguments[0].click();", timezone);
await driver.sleep(2000);  
await driver.executeScript("arguments[0].click();", timezone);
await driver.sleep(2000); 
})

// await driver.wait(until.elementLocated(By.id("CurrentStatus")), 5000).click();
// await driver.sleep(2000);
it("saving the changes",async function () {
  await driver.wait(until.elementLocated(By.id("saveallchanges")), 5000).click();
await driver.sleep(2000);
})

//auido 
it("audio and video",async function () {
  await driver.wait(until.elementLocated(By.id("Audio & Video")), 5000).click();
  await driver.sleep(2000);
})

//notification

it("Notification",async function () {
  await driver.wait(until.elementLocated(By.id("Notification")), 5000).click();
})

it("changing notification settings",async function () {
  await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("all")), 5000).click();
await driver.sleep(2000);
 await driver.wait(until.elementLocated(By.id("direct")), 5000).click();
 await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("dnd")), 5000).click();
await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("custom")), 5000).click();
await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("all")), 5000).click();
})

it("time settings",async function () {
  await driver.sleep(2000);

await driver.findElement(By.id('clock-1')).click();
await driver.findElement(By.id('clock-1')).click();

await driver.findElement(By.id('clock-2')).click();
await driver.findElement(By.id('clock-2')).click();
})
//await driver.wait(until.elementLocated(By.id("customdropdown")), 5000).click();
//await driver.sleep(2000);

it("Notification popup",async function () {
  const option = await driver.wait(until.elementLocated(By.id("optionDefault")), 5000);
await option.click();
for (let i = 0; i < 2; i++) {
  await driver.actions().sendKeys(Key.ARROW_DOWN).perform();
}

await driver.actions().sendKeys(Key.ENTER).perform();
await option.click();
for (let i = 0; i < 1; i++) {
  await driver.actions().sendKeys(Key.ARROW_DOWN).perform();
}
// await driver.actions().sendKeys(Key.ARROW_DOWN).perform();
await driver.actions().sendKeys(Key.ENTER).perform();
})
//await driver.wait(until.elementLocated(By.id("muteSound")), 5000).click();

it("Notification sound",async function () {
  const muteSound = await driver.wait(until.elementLocated(By.id("muteSound")), 5000);
await driver.sleep(2000); 
await driver.executeScript("arguments[0].scrollIntoView(true);", muteSound);
await driver.sleep(3000);  // Give it some time to scroll
await driver.executeScript("arguments[0].click();", muteSound);
await driver.sleep(2000);  
await driver.executeScript("arguments[0].click();", muteSound);
});

it("about",async function () {
  await driver.sleep(2000);  
await driver.wait(until.elementLocated(By.id("About")), 5000).click();
})

it("closing profile modal",async function () {
  await driver.sleep(2000);
  await driver.wait(until.elementLocated(By.id("modalsetclose")), 5000).click();
})

// });


it("cancelling log out", async function () {
  await driver.findElement(By.id('ProfileBoxButtonTopBar')).click();
await driver.sleep(1000);
await driver.wait(until.elementLocated(By.id("logout")), 5000).click();
await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("Logoutcancel")), 5000).click();
});
it("log out",async function () {
  await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("logout")), 5000).click();
await driver.sleep(2000);
await driver.wait(until.elementLocated(By.id("Logoutok")), 5000).click();
})



});
  
});
 //*[@id="headlessui-menu-button-:r0:"]/div/div[2]/svg