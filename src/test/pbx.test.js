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
options.setPreference('permissions.default.desktop-notification', 1); // Allow notifications
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
      await usernameField.sendKeys("geonobins@netstratum.com");

      await passwordField.click();
      await passwordField.sendKeys("123456");

      await driver.findElement(By.id("loginButton")).click();

      
      
    });
    it("Error message is displayed",async function () {
      let errorMessageElement = await driver.wait(
        until.elementLocated(By.css(".top-36")),
        5000
      );
      let isDisplayed = await errorMessageElement.isDisplayed();
      assert.strictEqual(isDisplayed, true, "Error message is not displayed.");
      let usernameField = await driver.findElement(By.id("loginUserName"));
      let passwordField = await driver.findElement(By.id("loginPassword"));
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
        .sendKeys("sanil");
      await driver.findElement(By.id("loginPassword")).click();
      await driver.findElement(By.id("loginPassword")).sendKeys("password");
      await driver.findElement(By.id("loginButton")).click();
    });

  });

  // chat start
  describe("Start Meeting",async function () {
    this.timeout(100000);
    before(async function() {
      await driver.sleep(15000)
    })
    it("Starting a meeting",async function () {
        const meeting = await driver.wait(until.elementLocated(By.id('MEETINGSECTION')),3000);
        await driver.sleep(5000);
        await meeting.click();
      const start = await driver.wait(until.elementLocated(By.id('startaMeeting')),4000);
      await start.click();
        const tabs = await driver.getAllWindowHandles();
        await driver.switchTo().window(tabs[1]);
        const joinButton = await driver.wait(until.elementLocated(By.id('joinButton')),20000);
        await driver.wait(until.elementIsVisible(joinButton), 10000);
        await joinButton.click();
    })
    it('End the Meeting', async function() {
      const leaveIcon = await driver.wait( until.elementLocated(By.id('leaveIcon')),10000);
      await driver.wait(until.elementIsVisible(leaveIcon), 10000);
      await leaveIcon.click();
      
      const endButton = await driver.wait(until.elementLocated(By.id('endButton')), 10000);
      await endButton.click();
      const elementWithText = await driver.wait( until.elementLocated(By.xpath("//*[contains(text(), 'Meeting Ended')]")),10000);
      await driver.wait(until.elementIsVisible(elementWithText), 10000);
      await driver.wait(until.elementTextIs(elementWithText, 'Meeting Ended'),10000);
      await driver.close();
      const tabs = await driver.getAllWindowHandles();
      await driver.switchTo().window(tabs[0]);
     });
  })
    
  describe("CHAT", async function () {
    
    this.timeout(100000);
    describe("chatSearch", async function () {
      before(async function() {
        await driver.sleep(15000)
      })
      
  
        it("Clicking the search bar and searching for user",async function () {
          try{

          await driver.executeScript("window.scrollTo(0,0)");
          const search = await driver.wait(
            until.elementLocated(By.id("searchChatGroupsFilesChat")),5000
            
        );
        
        // Now, wait until the element is visible
        await driver.wait(
            until.elementIsVisible(search),5000
            
        );
        
          await search.click();
          await search.sendKeys("dilshad");
        }catch(error){
          console.log("Error in clicking search bar",error);
          
        }
         })
     
   

      it("Clicking on the search result and opening the chat",async function () {
        const searchContainer = await driver.findElement(
          By.id("searchItemContainer")
        );

        await driver.sleep(5000);
        const searchResults = await searchContainer.findElements(
          By.id("searchResultItem")

        );
        const searchResult = await searchResults[searchResults.length - 1];
        await searchResult.click();
      })
    });

    describe("chatInterface", async function () {
      // it("Performing actions in chat",async function () {
        
     
     it("opening the chat",async function () {
      await driver.sleep(1000);
      const originalWindow = await driver.getWindowHandle();
      await driver.executeScript("window.scrollTo(0,0)");
      await driver.sleep(5000);
     })

      //sending text
      it("Clicking the input area",async function () {
        const inputArea = await driver.findElement(By.css(".notranslate"));
      await inputArea.click();
      })
      it("Entering a text in the input field",async function () {
        const inputArea = await driver.findElement(By.css(".notranslate"));
      await inputArea.sendKeys("This is a test text");
      })
      
      it("Clicking the send button",async function () {
        const sendButtton = await driver.wait(
          until.elementLocated(By.id("sendMessageButton1")),
          5000
        );
        await sendButtton.click();
      })

      it("Verifying the message sent",async function () {
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
      })

      //sending image

      // const fileUpload = await driver.findElement(By.id("handleOpenFileDialog"));
      it("Sending a image",async function () {
        await driver
        .findElement(By.css(".flex-row > input"))
        .sendKeys('C:\\Users\\amany\\Desktop\\Amanyu\\Amanyu.jpg');
      await driver.sleep(10000);
      await driver
        .wait(until.elementLocated(By.id("sendMessageButton1")), 5000)
        .click();
      })

      it("Verifying the image sent",async function () {
        const fileMessages = await driver.findElements(By.css(".group-files"));
      const lastFileMessage = await fileMessages[fileMessages.length - 1];
      assert(lastFileMessage, "File message not sent correctly.");

      })
      //sending audio

      it("Sending a audio message",async function () {
        await driver.findElement(By.id("startRecording")).click();

        const playPause = await driver.wait(until.elementLocated(By.id("playpauseAudio")),3000);
        await driver.executeScript("arguments[0].click();", playPause);
        await driver.sleep(100);
        // await driver.executeScript("arguments[0].click();", playPause);
        // await driver.wait(until.elementLocated(By.id("audioTick")),3000).click();
        await driver.wait(until.elementLocated(By.id("cancelAudioRecording")),3000).click();
      // await driver
      //   .wait(until.elementLocated(By.id("sendMessageButton1")), 5000)
      //   .click();
      await driver.executeScript("window.scrollTo(0,0)");
       
      });

      it("Verifying the audio message sent",async function () {
        const audioMessages = await driver.findElements(By.css(".audioWave"));
      const lastAudioMessage = await audioMessages[audioMessages.length - 1];
      assert(lastAudioMessage, "Audio message not sent correctly.");
      })
    })
  describe("Audio Call Tests", function () {
  let driverB,firefoxOptions;

  

  it("should start audio call from first user", async function () {
     firefoxOptions = new firefox.Options();
     firefoxOptions.addArguments("-private");
    firefoxOptions.setPreference('media.navigator.permission.disabled', true);  
    firefoxOptions.setPreference('media.navigator.video.enabled', true);       
    firefoxOptions.setPreference('media.navigator.audio.enabled', true);       
    firefoxOptions.setPreference('media.autoplay.default', 0);                
    firefoxOptions.setPreference('permissions.default.camera', 1);            
    firefoxOptions.setPreference('permissions.default.microphone', 1);        
    firefoxOptions.setPreference('permissions.default.desktop-notification', 1);
    firefoxOptions.setPreference('permissions.default.desktop', 1); 

    driverB = await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(firefoxOptions)
      .build();
    await driverB.manage().window().maximize();
    await driver.executeScript("window.scrollTo(0,0)");
            await driver.executeScript(`
          const overlay = document.getElementById('webpack-dev-server-client-overlay');
          if (overlay) {
              overlay.parentNode.removeChild(overlay);
          }
      `);

    const startAudioCallButton = await driver.wait(
      until.elementLocated(By.id("startAudioCall")),
      10000
    );

    await driver.wait(until.elementIsVisible(startAudioCallButton), 10000);
    await startAudioCallButton.click();
  });

  it("should login as second user and join existing call", async function () {
    await driverB.get("https://us3-test.ncsapp.com/app");
    await driverB.sleep(10000)
    // const newWindowHandle = await driverB.getWindowHandle();
    const newWindowHandle = await driverB.getWindowHandle();
    await driverB.switchTo().window(newWindowHandle);

    await driverB.findElement(By.id("loginUserName")).sendKeys("dilshad");
    await driverB.findElement(By.id("loginPassword")).sendKeys("password");
    await driverB.findElement(By.id("loginButton")).click();
    await driverB.sleep(10000);
   try{
    const chatSectionB = await driverB.wait(
      until.elementLocated(By.id("CHATSECTION")),
      10000
    );
    await driverB.sleep(2000);
    await chatSectionB.click();
   }catch(error){
    console.log("Error in clicking chat section",error);
   }

    await driverB
      .findElement(By.id("6cebe168-d496-432c-a7b8-6b5a9df4c8ff"))
      .click();
    await driverB.executeScript("window.scrollTo(0,0)");
    await driverB.sleep(5000);

    await driverB.findElement(By.id("JoinExistingCall")).click();
  });

  // await driver.switchTo().window(originalWindow);
  //       await driver.executeScript

  it("should add a new member to the call", async function () {
    try{
    const originalWindow = await driver.getWindowHandle();
    await driver.switchTo().window(originalWindow);

            await driver.executeScript(`
          const overlay = document.getElementById('webpack-dev-server-client-overlay');
          if (overlay) {
              overlay.parentNode.removeChild(overlay);
          }
      `);
        await driver.sleep(10000);

    
    const audioButton = await driver.findElement(By.id("miniplayercontrols"));
    await driver.executeScript("arguments[0].click();", audioButton);
    const video = await driver.findElement(By.id("videoButtonMini"));
    
    await driver.executeScript("arguments[0].click();", video);
    // await driver
    //   .findElement(By.css(".gap-4 > div > .cursor-pointer"))
    //   .click();
      
    // await driver.findElement(By.css(".mb-\\[3px\\] > svg")).click();

    // const addMemberSearch = await driver.findElement(By.id("AddMembersearch"));
    // await addMemberSearch.click();
    // await addMemberSearch.sendKeys("sanil");

    // const checkBox = await driver.wait(
    //   until.elementLocated(By.id("group_members")),
    //   5000
    // );
    // const searchResult = await checkBox.getAttribute("value");
    // assert.strictEqual(
    //   searchResult,
    //   "bca44db7-7138-4455-b483-6266f04a07ba",
    //   "Chat invite failed"
    // );

    // await driver.executeScript("arguments[0].click();", checkBox);
    // await driver.findElement(By.id("PostInvite")).click();
  }catch(error){
    console.log("Error in adding member",error);
    
  }
  });

  it("should hang up the call from both users", async function () {
    
    // Hang up from driver
    await driver.sleep(3000);
    await driver.findElement(By.id("callHangUp")).click();
    const newWindowHandle = await driverB.getWindowHandle();
            await driverB.switchTo().window(newWindowHandle);
        await driverB.executeScript(`
          const overlay = document.getElementById('webpack-dev-server-client-overlay');
          if (overlay) {
              overlay.parentNode.removeChild(overlay);
          }
      `);

    // Switch to second user window (driverB) and hang up
    
    await driverB.switchTo().window(newWindowHandle);
    await driverB.findElement(By.id("callHangUp")).click();
    await driverB.quit();

  });

 

});
});
//end chat 


describe("PBX", async function () {
 
  this.timeout(110000);
  try{
  it("Opening the PBX Section", async function () {
    const originalWindow = await driver.getWindowHandle(); 
    let pbxSection = await driver.wait(until.elementLocated(By.id("PBXSECTION")), 10000);
    await driver.sleep(5000);
    await pbxSection.click();
    await driver.executeScript("arguments[0].scrollIntoView(true);", await driver.findElement(By.id("PBXSECTION-LINK")));
});
    it("Clicking on the Search bar and Searching name",async function () {
        const search = await driver.wait(until.elementLocated(By.id("searchContactsnumbersnames")), 10000);
    await search.click();
    await search.sendKeys("Dilshad");
    await search.sendKeys(Key.ENTER);
    await driver.wait(until.elementLocated(By.id("name")), 10000).click();
    })
    
    describe("Changing Window to Make Call",async function () {
        let options ,driverB,newWindow,newWindow1;
    it("Setting window Options",async function () {
        
   
    // Set the original window to occupy the left side of the screen
    await driver.manage().window().setRect({ width: 960, height: 1080, x: 0, y: 0 }); // Left side of the screen

    // Open a new Firefox window in private mode
     options = new firefox.Options();
    options.addArguments("-private"); // Enable private browsing
    options.setPreference('media.navigator.permission.disabled', true);  // Disable permission prompts for media devices
    options.setPreference('media.navigator.video.enabled', true);       // Enable video
    options.setPreference('media.navigator.audio.enabled', true);       // Enable audio
    options.setPreference('media.autoplay.default', 0);                // Allow autoplay of media
    options.setPreference('permissions.default.camera', 1);            // Allow camera access
    options.setPreference('permissions.default.microphone', 1);       // Allow microphone access
    options.setPreference('permissions.default.desktop', 1);           // Allow screen sharing access
    options.setPreference('dom.webnotifications.enabled', true);          // Enable web notifications
    options.setPreference('permissions.default.desktop-notification', 1); // Allow all desktop notifications

    // Initialize the WebDriver with the Firefox options
     driverB = await new Builder()
      .forBrowser(Browser.FIREFOX)
      .setFirefoxOptions(options)
      .build();

    // Set the second window to occupy the right side of the screen
    await driverB.manage().window().setRect({ width: 960, height: 1080, x: 960, y: 0 }); // Right side of the screen

     newWindow = await driverB.getWindowHandle(); 
    newWindow1 = await driver.getWindowHandle();
    // Navigate to the app and perform login in the second window
    await driverB.get("https://us3-test.ncsapp.com/app");
    await driver.sleep(10000);
})
    it("Logging in in the New Window",async function () {
        await driverB.findElement(By.id("loginPassword")).sendKeys("password");
    await driverB.findElement(By.id("loginUserName")).sendKeys("dilshad");
    await driverB.findElement(By.id("loginButton")).click();
    await driver.sleep(5000);
    })

    // Interact with the PBX section in the new window
    
    it("Opening the PBX Section",async function () {
        const pbxSectionB = await driverB.wait(until.elementLocated(By.id("PBXSECTION")), 10000);
    await driverB.executeScript("arguments[0].scrollIntoView(true);", pbxSectionB);
    await driverB.sleep(5000);
    await pbxSectionB.click();
    })

    it("Clicking the Search bar and Searching",async function () {
        const searchB = await driverB.wait(until.elementLocated(By.id("searchContactsnumbersnames")), 10000);
    await searchB.click();
    await searchB.sendKeys("amanyu");
    await driverB.wait(until.elementLocated(By.id("name")), 5000).click();
    await searchB.sendKeys(Key.ENTER);
    await driverB.sleep(3000);
    })

    it("Starting the call",async function () {
        await driverB.wait(until.elementLocated(By.id("phone-icon")), 10000).click();
    await driverB.sleep(3000);
    })
    
    // Switch back to the original window
    it("Accepting the Call in The Original Windoww",async function () {
        const originalWindow = await driver.getWindowHandle(); 
        await driver.switchTo().window(originalWindow);
    try {
      await driver.wait(until.elementLocated(By.id("callAccept")), 10000).click();
    } catch (error) {
      console.error("Call not accepted:", error);
    }
    })
    
    // Switch to the second window again
   it("Clicking Hold Button and un Holding the Call",async function () {
    await driver.switchTo().window(newWindow1);
    await driver.sleep(30000);
    await driver.wait(until.elementLocated(By.id("Hold")), 10000).click();
    await driver.wait(until.elementLocated(By.id("Unhold")), 10000).click();
   })
   it("Clicking Mute Button and Un Muting the Call",async function () {
    await driverB.wait(until.elementLocated(By.id("Mute")), 10000).click();
    await driverB.wait(until.elementLocated(By.id("Unmute")), 10000).click();
    await driverB.sleep(15000);
   })
    
    it("Ending The Call",async function () {
        try {
            await driverB.wait(until.elementLocated(By.id("endcall")), 5000).click();
          } catch (error) {
            console.error("Call not ended:", error);
          }
    })
    
    // Quit the second driver
    it("Closing the Window",async function () {
        await driverB.quit();
    await driver.sleep(5000);
    await driver.manage().window().maximize();
    })

    // Interact with more sections in the original window
    it("Interacting in PBX Section",async function () {
        await driver.wait(until.elementLocated(By.id("Section-Contacts-0")), 5000).click();
    await driver.sleep(5000);
    await driver.wait(until.elementLocated(By.id("Section-Contacts-1")), 5000).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("Section-Contacts-2")), 5000).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("Section-Contacts-3")), 5000).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("filter-icon")), 5000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.id("submit")), 5000).click();
    await driver.wait(until.elementLocated(By.id("Call History")), 5000).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("Section-Call_History-0")), 5000).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("Section-Call_History-1")), 5000).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("Section-Call_History-2")), 5000).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("Section-Call_History-3")), 5000).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("filter-icon")), 5000).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("submit")), 5000).click();
 
});

});
  }catch(error){
    console.log("Error in PBX Section",error);
    
  }
  });
  describe("PBXCALL", async function () {
    this.timeout(100000);
    let options,driverB;
    it("call", async function () {
      const originalWindow = await driver.getWindowHandle(); 
       options = new firefox.Options();
      options.addArguments("-private"); // Enable private browsing
      options.setPreference('media.navigator.permission.disabled', true);  // Disable permission prompts for media devices
      options.setPreference('media.navigator.video.enabled', true);       // Enable video
      options.setPreference('media.navigator.audio.enabled', true);       // Enable audio
      options.setPreference('media.autoplay.default', 0);                // Allow autoplay of media
      options.setPreference('permissions.default.camera', 1);            // Allow camera access
      options.setPreference('permissions.default.microphone', 1);        // Allow microphone access
      options.setPreference('permissions.default.desktop', 1);           // Allow screen sharing access
      options.setPreference('dom.webnotifications.enabled', true);          // Enable web notifications
      options.setPreference('permissions.default.desktop-notification', 1); // Allow all desktop notifications
  
       driverB = await new Builder()
        .forBrowser(Browser.FIREFOX)
        .setFirefoxOptions(options)
        .build();
  
      // Set the original window to occupy the left side of the screen
      await driver.manage().window().setRect({ width: 960, height: 1080, x: 0, y: 0 }); // Left screen
      
      // Set the second window to occupy the right side of the screen
      await driverB.manage().window().setRect({ width: 960, height: 1080, x: 960, y: 0 }); // Right screen
  
      const newWindow = await driverB.getWindowHandle(); 
      await driverB.get("http://localhost:3000/app/home");
      await driverB.findElement(By.id("loginPassword")).sendKeys("password");
      await driverB.findElement(By.id("loginUserName")).sendKeys("dilshad");
      await driverB.findElement(By.id("loginButton")).click();
    });
    it("Opening Phone Section",async function () {
      const pbxPhone = await driverB.wait(until.elementLocated(By.id("PBXPHONE")), 5000);
      await driverB.sleep(5000);
      await pbxPhone.click();
    })
    it("Entering the Number to Call",async function () {
      const call = await driverB.wait(
        until.elementLocated(By.id("inputnumber")),5000);
      await call.click();
      await driver.sleep(5000);
      await call.sendKeys("1001");
    })
      // const contactDropdown = await driverB.wait(until.elementLocated(By.id("contactDropdown")), 5000);
      // await contactDropdown.click();
      it("Starting the Call",async function () {
        const originalWindow = await driver.getWindowHandle(); 
      const pbxCall = await driverB.wait(until.elementLocated(By.id("pbxcall")), 5000);
      await pbxCall.click();
      await driverB.sleep(3000);
      await driver.switchTo().window(originalWindow);  
    })
    it("Accepting the Call",async function () {
      try{
        await driver.wait(until.elementLocated(By.id("callAccept")), 5000).click();
        await driverB.switchTo().window(newWindow);
        await driverB.sleep(30000);
      }catch(error) {
        console.error("call not accepted:", error);
      }
    })
    it("Ending the Call",async function () {
      try{
        await driverB.wait(until.elementLocated(By.id("endcall")), 5000).click();
        await driver.wait(until.elementLocated(By.id("endcall")), 5000).click();
      }catch(error) {
        console.error("call not ended:", error);
      }
      await driverB.quit();
      await driver.manage().window().maximize();
    })
  });
})
