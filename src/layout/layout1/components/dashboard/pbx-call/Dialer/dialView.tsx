import React, {
  LegacyRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import KeyPad from "./keyPad"
import useOutsideClick from "../../Chat/hooks/useOutsideClick "
import { MeetingSessionType } from "hdmeet"
import { RootState, actionCreators } from "../../../../../../store"
import {
  BACK_SPACE,
  CLOSE_BUTTON,
  DRAGGABLE_ICON,
  PHONE_ICON,
} from "../../../../../../utils/SVG/svgsRestHere"
import UseEscape from "../../Chat/hooks/useEscape"
import ContactDropDown from "./contactDropDown"
import Contacts from "../PbxDashboard/Contacts/contacts"
import AddContactList from "./addContactList"
import Dialer from "./dialer"
import DialerTop from "./dialerTop"

interface dialView {
  number: string
  setNumber: (number: string | ((prev: string) => string)) => void
  setSelectionStart?: (value: number) => void
  selectionStart: MutableRefObject<number | null>
  click: string
  setClick: (char: string) => void
  inputRef: LegacyRef<HTMLInputElement> | null
  focusInputAtIndex: (position: string) => void
  validation: (evt: React.ChangeEvent) => void
  dashboardRef?: LegacyRef<HTMLInputElement>
  inCall?: boolean
}

function DialView({
  number,
  setNumber,
  setSelectionStart,
  selectionStart,
  click,
  setClick,
  inputRef,
  focusInputAtIndex,
  validation,
  dashboardRef,
  inCall,
}: dialView) {
  const [section, setSection] = useState<string>("dialer")
  const inputValRef = useRef<HTMLDivElement | null>(null)
  const focused = useRef<HTMLDivElement | boolean>(false)
  const meetingSession: MeetingSessionType = useSelector(
    (state: any) => state.Main.meetingSession
  )
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  UseEscape(() => dispatch(actionCreators.setCallStatus("")))
  useOutsideClick(inputValRef, () => {
    focused.current = false
    selectionStart.current = number.length
  })
  const silDetails = useSelector((state: RootState) => state.Call.silDetails)
  const contactList = useSelector((state: RootState) => state.Call.contactList)

  useEffect(() => {
    return () => {
      setNumber("")
    }
  }, [])

  const initiateCall = () => {
    meetingSession.startDialerSession(
      silDetails.id,
      loggedInUserInfo?.sub,
      silDetails.realm
    )
    setNumber("")

    const user = contactList.find((user: any) => user?.id === number)
    dispatch(actionCreators.setCallState("dialing"))
    dispatch(
      actionCreators.setPbxCallData({
        type: "outgoing",
        data: {
          callee: number,
          caller: silDetails?.id,
          user_sil_id: silDetails?.id,
          uuid: number,
          name: user?.display_name,
          profile_picture: user?.profile_picture,
        },
      })
    )
  }
  const dispatch = useDispatch()

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        transition: {
          duration: 0.5,
          type: "tween",
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      key="dialPad"
      exit={{
        scale: 0,
        transition: {
          duration: 0.5,
          type: "tween",
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      ref={inputValRef}
      whileTap={{ cursor: "grabbing" }}
      className={`origin-top-left   bg-[#3B485E] z-[1000]  rounded-xl h-[530px] ${
        inCall ? "w-[300px]" : "w-[280px]"
      } shadow-[0_4px_10px_0px_rgba(0,0,0,0.1)]`}
    >
      <div className=" h-full flex flex-col">
        <DialerTop section={section} setSection={setSection} inCall={inCall} />
        {section === "dialer" ? (
          <Dialer
            number={number}
            setNumber={setNumber}
            inputRef={inputRef}
            focused={focused}
            click={click}
            setClick={setClick}
            focusInputAtIndex={focusInputAtIndex}
            validation={validation}
            initiateCall={initiateCall}
            inCall={inCall}
            selectionStart={selectionStart}
          />
        ) : (
          <AddContactList />
        )}
      </div>
    </motion.div>
  )
}

export default DialView
