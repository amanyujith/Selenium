import React, {
  Dispatch,
  LegacyRef,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import {
  add_call_icon,
  dialPad_icon,
  end_call,
  expand_icon,
  hold_icon,
  incoming_ring,
  mute_icon,
  phone_call,
  record_icon,
  TRANSFER_ICON,
} from "../../vault/svg"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../../../store"
import KeyPad from "../../Dialer/keyPad"
import MultipleIncomingView from "./multipleIncomingView"
import { motion } from "framer-motion"
import { MeetingSessionType } from "hdmeet"
import axios from "axios"
import useRingSound from "../../../hooks/useRingSound"
const deyDey = require("../../../Chat/audio/incoming-call/Dey-dey.mp3")
const digitalPhone = require("../../../Chat/audio/incoming-call/Digital Phone.mp3")
const elegant = require("../../../Chat/audio/incoming-call/Elegant.mp3")
const knowIt = require("../../../Chat/audio/incoming-call/Know it.mp3")
const ladyRing = require("../../../Chat/audio/incoming-call/Lady Ring.mp3")
const originalPhone = require("../../../Chat/audio/incoming-call/Original Phone.mp3")
const Simple = require("../../../Chat/audio/incoming-call/Simple.mp3")

interface IncominCallView {
  active?: string
}

const IncominCallView = ({ active }: IncominCallView) => {
  const callState = useSelector((state: RootState) => state.Call.callState)
  const brandingInfo = useSelector(
    (state: RootState) => state.Main.brandingInfo
  )
  const incomingCallData = useSelector(
    (state: RootState) => state.Chat.incomingCall
  )?.body?.data
  const incomingPbxCall = useSelector(
    (state: RootState) => state.Call.incomingPbxCall
  )
  const meetingSession: MeetingSessionType = useSelector(
    (state: RootState) => state.Main.meetingSession
  )
  const loggedInUserInfo = useSelector(
    (state: RootState) => state.Main.loggedInUserInfo
  )
  const silDetails = useSelector((state: RootState) => state.Call.silDetails)
  const pbxCallData = useSelector((state: RootState) => state.Call.pbxCallData)
  const callStatus = useSelector((state: RootState) => state.Call.callStatus)
  const settings = useSelector((state: any) => state.Main.soundAndNotification)

  const dispatch = useDispatch()

  useRingSound(
    settings[0]?.pbx_call_notification === "ladyring"
      ? ladyRing
      : settings[0]?.pbx_call_notification === "deydey"
      ? deyDey
      : settings[0]?.pbx_call_notification === "simple"
      ? Simple
      : settings[0]?.pbx_call_notification === "originalphone"
      ? originalPhone
      : settings[0]?.pbx_call_notification === "elegant"
      ? elegant
      : settings[0]?.pbx_call_notification === "digitalphone"
      ? digitalPhone
      : settings[0]?.pbx_call_notification === "turnedoff"
      ? ""
      : knowIt
  )

  const callAccept = () => {
    meetingSession.startDialerSession(
      silDetails.id,
      loggedInUserInfo?.sub,
      silDetails.realm
    )
    dispatch(actionCreators.setActiveCall(true))
    dispatch(actionCreators.setCallState("waitingtojoin"))
    dispatch(
      actionCreators.setCallStatus(
        callStatus === "active" ? "active" : "incall"
      )
    )
    dispatch(actionCreators.setIncomingPbxCall(null))
  }

  const callReject = () => {
    dispatch(actionCreators.setCallState("inactive"))
    if (pbxCallData.data.caller) {
      meetingSession.declineVoipCall(silDetails.id, silDetails.realm)
    }
    dispatch(actionCreators.setIncomingPbxCall(""))
  }

  const handleOptions = (option: string) => {
    if (option === "Keypad") {
      dispatch(actionCreators.setCallState("inCallKeypad"))
    }
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        transition: {
          duration: 0.7,
          type: "tween",
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      key="dialPad"
      exit={{
        scale: 0,
        transition: {
          duration: 0.7,
          type: "tween",
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className={` z-[2000] top-28  w-[300px] rounded-xl shadow-[0_4px_10px_0px_rgba(0,0,0,0.1)] `}
    >
      <div className="h-[218px] w-full bg-[#293241] flex flex-col rounded-t-xl">
        <div className="flex justify-start gap-2 m-3 items-center h-[36px]">
          <span className="p-1.5  rounded-md bg-[#ffffff]">{phone_call}</span>
          <span className="text-[#ffffff]">Incoming Call</span>
        </div>
        {callState === "" ||
          (incomingPbxCall?.length && (
            <div className="flex items-center flex-col text-[#FFFFFF]">
              <div className="w-[32px] h-[32px]">
                <img src={brandingInfo?.data?.logos?.favicon} alt="" />
              </div>
              <div className="text-[#FFFFFF] text-[16px] mt-3 font-medium">
                {incomingPbxCall[0]?.body?.display_name}
              </div>
              <div>{incomingPbxCall[0]?.body?.caller}</div>
            </div>
          ))}
        {/* {<MultipleIncomingView />} */}
      </div>
      <div className="flex justify-center bg-[#FFF7F5] rounded-b-xl">
        {incomingPbxCall?.length ? (
          <div className="flex items-center justify-center h-[56px] relative gap-3">
            <motion.div
            id="callAccept"
              // whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="w-[32px] h-[32px] rounded-[50%]  bg-[#76B947] flex justify-center items-center cursor-pointer"
              onClick={() => {
                callAccept()
              }}
            >
              {incoming_ring}
            </motion.div>
            <motion.div
            id="callReject"
              // whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="w-[32px] h-[32px] rounded-[50%]  bg-[#F74B14] flex justify-center items-center cursor-pointer"
              onClick={() => callReject()}
            >
              {end_call("white")}
            </motion.div>
          </div>
        ) : (
          <div></div>
          // <motion.div
          //   whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          //   className="w-[110px] h-[36px] rounded-lg mr-3 my-3 bg-[#F74B14] flex justify-center items-center text-[#ffffff] cursor-pointer"
          //   onClick={() => {}}
          // >
          //   Decline All
          // </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default IncominCallView
