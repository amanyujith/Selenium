describe('upcoming-meeting  Session', async function() {
    it("upcoming-meeting in Meeting Session", async function () {
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
    })
      // await driver.wait(until.elementLocated(By.id("setSecondCalender"))).click();
    
      // await driver.wait(until.elementLocated(By.css(".react-datepicker__day")), 10000); 
      // const startDate = await driver.findElement(By.css(".react-datepicker__day.react-datepicker__day--today"));
      // await startDate.click();
    
      it("Searching for meetings",async function () {
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
      })
          
      //copy
    
      it("Copying meeting url",async function () {
        const hoverElementCopy = await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000)
      hoverElementCopy.click() ;
      await driver.sleep(1000);
      const handleCopy = await driver.wait(until.elementLocated(By.id("handleCopyURL")),5000);
      await driver.wait(until.elementIsVisible(handleCopy),10000);
      await handleCopy.click();
      })
      
    
      
      //edit
    
       it("clicking the edit button",async function () {
        const hoverElementEdit = await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000)
        hoverElementEdit .click() ;
        const handleEdit = await driver.wait(until.elementLocated(By.id("handleEdit")),5000);
        await driver.wait(until.elementIsVisible(handleEdit),10000);
        await handleEdit.click();
    
       })
        
    
      
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
    
      it("Editing this occurance of the meeting",async function () {
        let editButton;
        editButton = await driver.findElement(By.id('handleSingleRecEdit'));
          await editButton.click();
    
      // try {
      //   editButton = await driver.findElement(By.id('handleSingleRecEditClick'));
      // } catch (error) {
      //   console.error('handleSingleRecEditClick button not found, trying handleSingleRecEdit');
      // }
    
      // // If the first button is not found, try locating the second button (handleSingleRecEdit)
      // if (!editButton) {
      //   try {
      //     editButton = await driver.findElement(By.id('handleSingleRecEdit'));
      //     await editButton.click();
      //   } catch (error) {
      //     console.error('Neither edit button was found.', error);
      //   }
      // };
    
    
      //   await driver.findElement(By.id("setTime")).click();
      // await driver.findElement(By.className("rc-time-picker-panel-select-option-selected")).click();
      });
      it("Updating this occurance of the meeting",async function () {
        const schedule = await driver.findElement(By.id("scheduleBtn"));
      await schedule.click();
      await driver.wait(until.elementLocated(By.css(".self-end")),5000).click();
      })
      
      it("Seaching for meeting",async function () {
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
      })
        
       
       
      it("Editing all occurance of the meeting",async function () {
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
        editButton1 = await driver.findElement(By.id('handleAllRecEdit'));
            await editButton1.click();
    
        // try {
        //   editButton1 = await driver.findElement(By.id('handleSingleRecEditClick'));
        // } catch (error) {
        //   console.error('handleSingleRecEditClick button not found, trying handleAllRecEdit');
        // }
      
        // // If the first button is not found, try locating the second button (handleAllRecEdit)
        // if (!editButton1) {
        //   try {
        //     editButton1 = await driver.findElement(By.id('handleAllRecEdit'));
        //     await editButton1.click();
        //   } catch (error) {
        //     console.error('Neither edit button was found.', error);
        //   }
        // };
    
      })
      // await element.click();
    
     it("Updating the meeting",async function () {
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
     })
      
     it("Searching for meetings to delete",async function () {
      await driver.sleep(5000);
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
    })
      //cancelling the delete of meeting
    
    it("Cancelling the deletion of meeting",async function () {
      await driver.sleep(5000);
      
      await driver.sleep(5000);
      const hoverElementCancel = await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000)
      hoverElementCancel.click() ;
    
      await driver.sleep(5000);
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
      
    })
    
      //deleting the meeting  
        
     it("deleting the recurring meeting",async function () {
      await driver.sleep(5000);
      const hoverElementDelete = await driver.wait(until.elementLocated(By.xpath('//*[@id="sortedDate"]/div[2]')), 5000) ;
      hoverElementDelete.click();
      await driver.sleep(5000);
      const handledeleteOneCase = await driver.wait(until.elementLocated(By.id('handleDeleteCase')), 5000);
      await driver.wait(until.elementIsVisible(handledeleteOneCase), 10000);
      await handledeleteOneCase.click();
      let button1;
      button1 = await driver.findElement(By.id('handleAllClick'));
          await button1.click();
      // try {
      //   button1 = await driver.findElement(By.id('handleSingleClickMeet'));
      // } catch (error) {
      //   console.error('handleSingleClickMeet button not found, trying handleAllClick');
      // }
    
      // if (!button1) {
      //   try {
      //     button1 = await driver.findElement(By.id('handleAllClick'));
      //     await button1.click();
      //   } catch (error) {
      //     console.error('Neither delete button was found.', error);
      //   }
      // }
    
    //  })
        
      
    
    
    });
    })
    