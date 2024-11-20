import React, { useEffect, useState } from "react"
import { call_history, contact_icon } from "../vault/svg"
import Contacts from "./Contacts/contacts"
import CallHistory from "./CallHistory/callHistory"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../../store"
import { MeetingSessionType } from "hdmeet"

const CallOverView = () => {
  const [active, setActive] = useState("Contacts")
  const chatInstance = useSelector(
    (state: RootState) => state.Chat.chatInstance
  )
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const meetingSession: MeetingSessionType = useSelector(
    (state: any) => state.Main.meetingSession
  )

  const callStatus = useSelector((state: RootState) => state.Call.callStatus)
  const silDetails = useSelector((state: RootState) => state.Call.silDetails)
  const contactList = useSelector((state: RootState) => state.Call.contactList)

  const dispatch = useDispatch()
  const sections = [
    {
      icon: contact_icon,
      label: "Contacts",
    },
    {
      icon: call_history,
      label: "Call History",
    },
  ]

  const initiateCall = (phone: string) => {
    meetingSession.startDialerSession(
      silDetails.id,
      loggedInUserInfo?.sub,
      silDetails.realm
    )
    const user = contactList.find((user: any) => user?.id === phone)
    dispatch(actionCreators.setCallState("dialing"))
    dispatch(
      actionCreators.setPbxCallData({
        type: "outgoing",
        data: {
          callee: phone,
          caller: silDetails?.id,
          user_sil_id: silDetails?.id,
          uuid: phone,
          name: user?.display_name,
          profile_picture: user?.profile_picture,
        },
      })
    )
    dispatch(actionCreators.setActiveCall(true))
    dispatch(
      actionCreators.setCallStatus(
        callStatus === "active" ? "active" : "incall"
      )
    )
  }

  // useEffect(() => {
  //   chatInstance?.CallHistory().then((res: any) => {
  //     dispatch(actionCreators.setCallHistory(res?.length ? res : ["noData"]))
  //   })
  // }, [])

  return (
    <div className="flex flex-col pl-[12px]  pt-[6px] bg-[#EAECF0]  h-[calc(100vh-56px)] ">
      <div className="flex">
        {sections.map((section: any) => {
          return (
            <div 
            id={`${section.label}`}
              className={`flex gap-2 justify-center items-center w-[148px] h-[44px] mb-3 text-[16px] font-sans ${
                active === section.label
                  ? "font-medium border-b-[3px] border-[#F7931F]"
                  : ""
              } cursor-pointer`}
              onClick={() => setActive(section.label)}
            >
              <div className="scale-105"> {section.icon}</div>
              <div>{section.label}</div>
            </div>
          )
        })}
      </div>
      {active === "Contacts" ? (
        <Contacts initiateCall={initiateCall} />
      ) : (
        <CallHistory initiateCall={initiateCall} />
      )}
    </div>
  )
}

export default CallOverView
