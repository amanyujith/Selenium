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
    
