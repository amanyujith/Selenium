import React, {
  Dispatch,
  LegacyRef,
  MutableRefObject,
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
  keypad_close,
  loader,
  mute_icon,
  phone_call,
  play_button,
  record_icon,
  TRANSFER_ICON,
  unmute_icon,
} from "../../vault/svg"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../../../store"
import KeyPad from "../../Dialer/keyPad"
import { motion, AnimatePresence } from "framer-motion"
import { MeetingSessionType } from "hdmeet"
import hoverTimer from "../../../../../../../utils/hoverTimer"
import DialView from "../../Dialer/dialView"
import CallOnHold from "../callOnHold"

interface CallView {
  number: string
  setNumber: (number: string | ((prev: string) => string)) => void
  setSelectionStart?: (value: number) => void
  selectionStart: MutableRefObject<number | null>
  click: string
  setClick: (char: string) => void
  inputRef: LegacyRef<HTMLInputElement> | null
  focusInputAtIndex: (position: string) => void
  validation: (evt: React.ChangeEvent, isCall?: boolean) => void
}

interface dialerOptions {
  icon: JSX.Element
  label: string
  active: boolean
}

const CallView = ({
  number,
  setNumber,
  setSelectionStart,
  selectionStart,
  click,
  setClick,
  inputRef,
  focusInputAtIndex,
  validation,
}: CallView) => {
  const callState = useSelector((state: RootState) => state.Call.callState)
  const pbxCallData = useSelector((state: RootState) => state.Call.pbxCallData)
  const time = useSelector((state: RootState) => state.Call.time)
  const brandingInfo = useSelector(
    (state: RootState) => state.Main.brandingInfo
  )
  const meetingSession: MeetingSessionType = useSelector(
    (state: any) => state.Main.meetingSession
  )
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const callStatus = useSelector((state: RootState) => state.Call.callStatus)
  const dispatch = useDispatch()
  const contactList = useSelector((state: RootState) => state.Call.contactList)
  const callButtons = useSelector(
    (state: RootState) => state.Call.callButtonState
  )
  const [holdButton, setHoldButton] = useState("Hold")
  const dialerOptions: dialerOptions[] = [
    {
      icon: callButtons?.muteButton === "Mute" ? mute_icon : unmute_icon,
      label: callButtons?.muteButton,
      active: true,
    },
    {
      icon:
        pbxCallData?.data?.holdButton === "Hold" ||
        pbxCallData?.data?.holdButton === undefined
          ? hold_icon
          : pbxCallData?.data?.holdButton === "Unhold"
          ? play_button
          : loader,
      label: pbxCallData?.data?.holdButton === "Unhold" ? "Unhold" : "Hold",
      active: true,
    },
    // {
    //   icon: record_icon,
    //   label: "Record",
    //   active: false,
    // },
    {
      icon: add_call_icon,
      label: "Add Call",
      active: pbxCallData?.callonHold?.length ? false : true,
    },
    // {
    //   icon: TRANSFER_ICON("#5C6779"),
    //   label: "Transfer",
    //   active: false,
    // },
    {
      icon: dialPad_icon,
      label: "Keypad",
      active: true,
    },
  ]

  useEffect(() => {
    return () => {
      setNumber("")
    }
  }, [])

  const endCall = () => {
    pbxCallData?.callonHold?.length
      ? meetingSession.endVoipCall(true, { closeAllCall: true })
      : meetingSession.endVoipCall(true)
    dispatch(actionCreators.setActiveCall(false))
    dispatch(actionCreators.setCallState("inactive"))
    hoverTimer(false, dispatch, "pbxcall")
    dispatch(
      actionCreators.setCallStatus(callStatus === "active" ? "active" : "")
    )
    dispatch(
      actionCreators.setPbxCallData({
        type: null,
        data: {},
      })
    )
    dispatch(
      actionCreators.callButtonState({
        addCallButton: false,
        muteButton: "Mute",
        holdButton: "Hold",
      })
    )
  }

  const handleAddCall = () => {
    console.log("::ADDCALL")
    dispatch(
      actionCreators.callButtonState({
        ...callButtons,
        addCallButton: true,
      })
    )
  }

  const handleKeyPad = () => {
    dispatch(actionCreators.setCallState("inCallKeypad"))
  }

  const handleOptions = (option: string) => {
    if (option === "Keypad") {
      handleKeyPad()
    } else if (option === "Mute" || option === "Unmute") {
      meetingSession
        ?.muteVoipStream(option.toLowerCase().trim() as "mute" | "unmute")
        .then(() => {
          dispatch(
            actionCreators.callButtonState({
              ...callButtons,
              muteButton: option === "Mute" ? "Unmute" : "Mute",
            })
          )
        })
    } else if (
      (option === "Hold" || option === "Unhold") &&
      callButtons.holdButton !== ""
    ) {
      meetingSession?.holdVoipCall(option.toLowerCase() as "hold" | "unhold")
      dispatch(
        actionCreators.setPbxCallData({
          ...pbxCallData,
          data: {
            ...pbxCallData.data,
            holdButton: "",
          },
        })
      )
      // dispatch(
      //   actionCreators.callButtonState({
      //     ...callButtons,
      //     holdButton: "",
      //   })
      // )
    } else if (option === "Add Call") {
      handleAddCall()
    }
  }

  return (
    <motion.div
      className="z-[500]  w-[300px] rounded-xl shadow-[0_4px_10px_0px_rgba(0,0,0,0.1)] "
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
    >
      <div className="h-[218px] w-full bg-[#293241] flex flex-col rounded-t-xl">
        <div className="flex justify-start gap-2 m-3 items-center h-[36px]">
          <span className="p-1.5  rounded-md bg-[#ffffff]">{phone_call}</span>
          <span
            className={
              callState === "inCall" || callState === "inCallKeypad"
                ? `text-[#76B947]`
                : "text-[#ffffff]"
            }
          >
            {callState === "inCall" || callState === "inCallKeypad"
              ? "Ongoing Call..."
              : pbxCallData?.type === "outgoing"
              ? "Outgoing Call"
              : pbxCallData?.type === "incoming"
              ? "Incoming Call"
              : null}
          </span>
          {/* <span className="ml-auto mr-2">{expand_icon}</span> */}
        </div>
        {callButtons.addCallButton && (
          <div className="absolute top-14  ">
            <DialView
              inCall={true}
              number={number}
              setNumber={setNumber}
              selectionStart={selectionStart}
              click={click}
              setClick={setClick}
              inputRef={inputRef}
              focusInputAtIndex={focusInputAtIndex}
              validation={validation}
            />
          </div>
        )}
        {pbxCallData?.conference ? (
          <div className="text-[14px] text-[#FFFFFF] flex justify-center items-center h-full">
            Active Conference Call
          </div>
        ) : (
          <div className="flex items-center flex-col text-[#FFFFFF]">
            <div className="w-[32px] h-[32px]">
              <img
                draggable={false}
                src={brandingInfo?.data?.logos?.favicon}
                alt=""
                className="w-full h-full"
              />
            </div>
            <div className="m-1 p-1 text-[16px] font-medium">
              {pbxCallData?.type === "incoming"
                ? pbxCallData?.data?.name
                : contactList?.filter(
                    (contact: any) => contact?.id === pbxCallData?.data?.callee
                  )?.[0]?.display_name ?? ""}
            </div>
            <div>
              {pbxCallData.type === "incoming"
                ? pbxCallData?.data?.caller
                : pbxCallData?.data?.callee}
            </div>
            <div className="text-[#B1B1B1] text-xs">
              {callState === "waitingtojoin" ? (
                "Waiting to Join"
              ) : callState === "calling" || callState === "dialing" ? (
                "Calling.."
              ) : callState === "ringing" ? (
                "Ringing"
              ) : callState === "inCall" || callState === "inCallKeypad" ? (
                <span className="font-medium text-sm">{time}</span>
              ) : (
                <span className="text-[#F74B14] font-medium text-sm">
                  {callState}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {pbxCallData?.callonHold?.length && <CallOnHold />}
      <div className=" bg-[#FFF7F5] rounded-b-xl">
        {callState === "inCall" && (
          <div className="h-[144px] flex flex-wrap w-[200px] mx-auto justify-center">
            {dialerOptions.map((option: dialerOptions) => {
              return (
                <motion.div
                id={`${option.label}`}
                  whileHover={
                    option.active && !callButtons.addCallButton
                      ? { scale: 1.2, transition: { duration: 0.1 } }
                      : {}
                  }
                  onClick={() => {
                    option.active && handleOptions(option.label)
                  }}
                  className={`flex flex-col h-[60px] w-[60px]  items-center m-1 justify-center gap-2  ${
                    option.active ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  <div> {option.icon}</div>
                  <span className="text-[10px]">{option.label}</span>
                </motion.div>
              )
            })}
          </div>
        )}
        {callState === "inCallKeypad" && (
          <div className="flex flex-col items-center">
            <input
              autoFocus
              ref={inputRef}
              className="text-primary-200 text-xl p-3 border-0 focus:border-0 bg-[#FFF7F5] rounded-xl  focus:outline-none w-[250px] h-full dialer"
              value={number}
              onKeyDown={(e) => {
                setClick("")
                setTimeout(() => {
                  setClick(e.key)
                }, 0)
              }}
              onSelect={(e) => {
                if (e.currentTarget.selectionStart)
                  selectionStart.current = e.currentTarget.selectionStart
              }}
              onChange={(evt) => validation(evt, true)}
            />
            <KeyPad
              focusInputAtIndex={focusInputAtIndex}
              setNumber={setNumber}
              selectionStart={selectionStart}
              click={click}
              inCall={true}
            />
          </div>
        )}
        <div className="flex items-center justify-center h-[56px]  ">
          {callState === "inCallKeypad" && (
            <div
              className="scale-125 cursor-pointer absolute left-14"
              onClick={() => dispatch(actionCreators.setCallState("inCall"))}
            >
              {" "}
              {keypad_close}
            </div>
          )}
          <motion.div
          id="endcall"
            // whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            className="w-[32px] h-[32px] rounded-[50%]  bg-[#F74B14] flex justify-center items-center cursor-pointer"
            onClick={() => {
              endCall()
            }}
          >
            {end_call("white")}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default CallView
