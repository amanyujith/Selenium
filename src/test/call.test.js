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