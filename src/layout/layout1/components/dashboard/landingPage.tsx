import React from "react"
import Lottiefy from "../../../../atom/Lottie/lottie"
import * as landingLottie from "../../../../atom/Lottie/landinglottie.json"
import bg from "../../../../assets/Screenshot from 2024-04-29 18-47-25.png"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../store"
import path from "../../../../navigation/routes.path"
import { useNavigate } from "react-router-dom"
import LocalDb from "../../../../dbServices/dbServices"
import { motion } from "framer-motion"
const LandingPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const permissionSettings = useSelector(
    (state: RootState) => state.Main.permissionSettings
  )
  const deviceDB = LocalDb.loadLocalDB("hoolvaUser", "UserData", 2)

  const routeChangeToList = () => {
    dispatch(actionCreators.setChatscreen(true))
    navigate(`${path.LIST}`)
  }
  const handleClick = (type: any) => {
    if (type === "START") {
      dispatch(actionCreators.createMeetingState(true))
      // await meetingSession.meetingInvite(data.roomuuid).then((res: any) => {
      //   const result = res.meeting_url.replace('/launch-meetings/?iuasdf','/app2/?rtdf');
      //
      LocalDb.set(deviceDB, "UserData", "createState", true)
      // LocalDb.set(dbStore, "MeetingList", "language", {
      //   lang: currentLanguage,
      // });
      //   window.open(result, "_blank", "noreferrer");
      // });

      window.open(path.JOIN, "_blank")
      //navigate(path.JOIN);
    } else {
      // navigate(path.SCHEDULE)
      dispatch(actionCreators.setMeetingType(type))
      // setOpenTodayMeeting(true)
      // setProfileSettingsClick(false)
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center landingPage bg-[#e5e5e5]">
      <motion.div
        initial={{ translateY: "80px" }}
        animate={{
          translateY: "0px",
          transition: {
            duration: 0.3,
            type: "tween",
            ease: "easeOut",
          },
        }}
        exit={{
          translateY: "80px",
          transition: {
            duration: 0.1,
            type: "tween",
            ease: "easeOut",
          },
        }}
        className="w-[716px] h-[636px] rounded-lg  bg-[#ffffff] flex flex-col justify-between"
      >
        <Lottiefy loop={true} json={landingLottie} height={595} width={524} />
        {/* <div className="h-[76px] flex justify-center gap-5">
          {permissionSettings?.chat?.length ? (
            <button
              onClick={routeChangeToList}
              className="p-2 border border-1 border-[#B1B1B1] border-solid flex justify-center items-center rounded-md bg-[#FEF4E9] h-[32px] w-[150px]"
            >
              New Chat
            </button>
          ) : null}
          {permissionSettings?.meeting?.length ? (
            <button 
              onClick={()=> handleClick("START")}
              className="p-2 border border-1 border-[#B1B1B1] border-solid flex justify-center items-center rounded-md bg-[#FEF4E9] h-[32px] w-[150px]">
              Start a Meeting
            </button>
          ) : null}
        </div> */}
      </motion.div>
    </div>
  )
}

export default LandingPage
