import React, { LegacyRef, MutableRefObject } from "react"
import { motion } from "framer-motion"
import ContactDropDown from "./contactDropDown"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../../store"
import {
  BACK_SPACE,
  PHONE_ICON,
} from "../../../../../../utils/SVG/svgsRestHere"
import KeyPad from "./keyPad"
import { MeetingSessionType } from "hdmeet"

interface Dialer {
  number: string
  setNumber: (number: string | ((prev: string) => string)) => void
  inputRef: LegacyRef<HTMLInputElement> | null
  focused: MutableRefObject<boolean | HTMLDivElement>
  click: string
  setClick: (char: string) => void
  focusInputAtIndex: (position: string) => void
  validation: (evt: React.ChangeEvent) => void
  initiateCall: () => void
  selectionStart: MutableRefObject<number | null>
  inCall?: boolean
}

const Dialer = ({
  number,
  setNumber,
  inputRef,
  focused,
  focusInputAtIndex,
  validation,
  click,
  setClick,
  initiateCall,
  selectionStart,
  inCall,
}: Dialer) => {
  const contactList = useSelector((state: RootState) => state.Call.contactList)
  const silDetails = useSelector((state: RootState) => state.Call.silDetails)
  const pbxCallData = useSelector((state: RootState) => state.Call.pbxCallData)
  const callButtons = useSelector(
    (state: RootState) => state.Call.callButtonState
  )
  const meetingSession: MeetingSessionType = useSelector(
    (state: any) => state.Main.meetingSession
  )
  const dispatch = useDispatch()
  const handleAddCall = (phone: string) => {
    const user = contactList.find((user: any) => user?.id === number)
    meetingSession?.AddVoipCall(phone ?? "")
    dispatch(
      actionCreators.setPbxCallData({
        type: pbxCallData?.type,
        data: {
          callee: phone,
          caller: silDetails?.id,
          user_sil_id: silDetails?.id,
          uuid: phone,
          name: user?.display_name,
        },
        callonHold: pbxCallData?.callonHold?.length
          ? [...pbxCallData.callonHold, pbxCallData.data]
          : [pbxCallData.data],
      })
    )
    dispatch(
      actionCreators.callButtonState({
        ...callButtons,
        addCallButton: false,
      })
    )
  }

  return (
    <div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          transition: {
            duration: `${inCall ? 0.4 : 0.5}`,
          },
        }}
        className={`origin-left w-[232px] h-[50px] flex flex-row items-center gap-1 border border-[#AFB4BD] rounded-xl mx-auto mb-2 focus-within:ring-2 ring-[#F7931F] focus-within:border-0 ${
          number.length && "ring-2 ring-[#F7931F] border-0 relative"
        }`}
      >
        <input  id="inputnumber"
          autoFocus
          ref={inputRef}
          className="text-[#fff] text-lg p-3 border-0 focus:border-0  rounded-xl focus:outline-none w-full h-full dialer bg-[#3B485E]"
          value={number}
          placeholder="Enter Number"
          onBlur={({ target }) => {
            focused.current && target.focus()
          }}
          onKeyDown={(e) => {
            setClick("")
            setTimeout(() => {
              setClick(e.key)
            }, 0)
            if (e.key === "Enter" && number) {
              initiateCall()
            }
          }}
          onSelect={(e) => {
            focused.current = true
            if (e.currentTarget.selectionStart)
              selectionStart.current = e.currentTarget.selectionStart
            // setSelectionStart(e.currentTarget.selectionStart)
          }}
          onChange={(evt) => validation(evt)}
        />

        <motion.div
          whileHover={{ scale: 1.3, transition: { duration: 0.2 } }}
          className="mr-1 mt-1 p-2 cursor-pointer"
          onClick={() => {
            focusInputAtIndex("backward")
            if (selectionStart.current) {
              setNumber(
                number.substring(0, selectionStart.current - 1) +
                  number.substring(selectionStart.current, number.length)
              )
            }
          }}
        >
          {BACK_SPACE}
        </motion.div>
        {contactList.find((user: any) => user.id === number) && (
          <div className="absolute top-14 w-full">
            <ContactDropDown
              user={contactList.find((user: any) => user.id === number)}
            />
          </div>
        )}
      </motion.div>{" "}
      <div className="text-[#AFB4BD] flex justify-center mt-1 h-5 font-medium text-[18px]">
        {!silDetails.id && "Unregistered"}
      </div>
      <div className="flex flex-col justify-center items-center mt-[2%]">
        <KeyPad
          focusInputAtIndex={focusInputAtIndex}
          setNumber={setNumber}
          selectionStart={selectionStart}
          click={click}
          inCall={inCall}
        />
        <motion.div id="pbxcall"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
          animate={{
            backgroundColor:
              number !== "" && silDetails.id ? "#E57600" : "#b6b6b6",
            scale: 1,
            transition: { duration: 0.3, ease: "easeIn" },
          }}
          className={` mt-1 w-[221px] h-[44px] flex 
             rounded-md items-center justify-center gap-2 text-[#ffffff] ${
               number.length && silDetails.id
                 ? "cursor-pointer"
                 : "cursor-not-allowed"
             }`}
          onClick={() => {
            if (number && silDetails.id) {
              if (!inCall) {
                initiateCall()
              } else {
                handleAddCall(number)
              }
            }
          }}
        >
          {PHONE_ICON}
          <span>{inCall ? "Add" : "Call"}</span>
        </motion.div>
      </div>{" "}
    </div>
  )
}

export default Dialer
