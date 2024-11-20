import React, {
  Dispatch,
  LegacyRef,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import DialView from "./Dialer/dialView"
import CallView from "./CallPopUp/OngoingCall/callView"
import IncominCallView from "./CallPopUp/IncomingCall/incomingCallView"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../store"

interface callHub {
  dashboardRef: LegacyRef<HTMLInputElement>
}

const CallHub = ({ dashboardRef }: callHub) => {
  const callState = useSelector((state: RootState) => state.Call.callState)
  const [number, setNumber] = useState<string>("")
  // const [selectionStart, setSelectionStart] = useState<number | null>(0)
  const selectionStart = useRef<number | null>(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [click, setClick] = useState<string>("")
  const incomingPbxCall = useSelector(
    (state: RootState) => state.Call.incomingPbxCall
  )
  const dispatch = useDispatch()
  const chatInstance = useSelector(
    (state: RootState) => state.Chat.chatInstance
  )
  const callStatus = useSelector((state: RootState) => state.Call.callStatus)
  const silDetails = useSelector((state: RootState) => state.Call.silDetails)
  const Regx = /^[0-9\*\#]+$/
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)

  const focusInputAtIndex = async (args: string) => {
    if (
      inputRef.current &&
      (selectionStart || selectionStart == 0) &&
      args === "forward"
    ) {
      inputRef.current.focus()
      setTimeout(() => {
        if (inputRef.current && selectionStart.current)
          inputRef.current.setSelectionRange(
            selectionStart.current + 1,
            selectionStart.current + 1
          )
      }, 0)
    } else if (
      args === "backward" &&
      inputRef.current &&
      (selectionStart || selectionStart == 0)
    ) {
      inputRef.current.focus()
      setTimeout(() => {
        if (inputRef.current && selectionStart.current)
          inputRef.current.setSelectionRange(
            selectionStart.current - 1,
            selectionStart.current - 1
          )
      }, 0)
    }
  }

  const validation = (evt: any, isCall?: boolean) => {
    if (Regx.test(evt.target.value) || evt.target.value === "") {
      setNumber(evt.target.value)
      if (isCall) {
        meetingSession.sendDTMF({
          tones: evt.target.value,
        })
      }
    }
  }
  useEffect(() => {
    chatInstance?.getContactList().then((res: any) => {
      dispatch(
        actionCreators.setContactlist(
          res.filter((response: any) => response.id !== silDetails?.id)
        )
      )
    })
  }, [])

  return (
    <div>
      <motion.div
        drag={true}
        dragElastic={false}
        dragMomentum={false}
        dragConstraints={dashboardRef as RefObject<Element>}
        className="absolute  top-16 left-16"
      >
        <AnimatePresence mode="wait">
          {(callStatus === "active" || callStatus === "incall") &&
            (callState === "inactive" ? (
              <DialView
                dashboardRef={dashboardRef}
                number={number}
                setNumber={setNumber}
                selectionStart={selectionStart}
                click={click}
                setClick={setClick}
                inputRef={inputRef}
                focusInputAtIndex={focusInputAtIndex}
                validation={validation}
              />
            ) : (
              <CallView
                number={number}
                setNumber={setNumber}
                selectionStart={selectionStart}
                click={click}
                setClick={setClick}
                inputRef={inputRef}
                focusInputAtIndex={focusInputAtIndex}
                validation={validation}
              />
            ))}{" "}
        </AnimatePresence>
      </motion.div>
      <motion.div
        key="calls"
        drag={true}
        dragElastic={false}
        dragMomentum={false}
        dragConstraints={dashboardRef as RefObject<Element>}
        className="absolute left-32 "
      >
        {" "}
        {incomingPbxCall?.length > 0 ? <IncominCallView /> : null}
      </motion.div>
    </div>
  )
}

export default CallHub
