import React from "react"
import {
  CLOSE_BUTTON,
  DRAGGABLE_ICON,
} from "../../../../../../utils/SVG/svgsRestHere"
import { RootState, actionCreators } from "../../../../../../store"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"

interface DialerTop {
  inCall?: boolean
  section?: string
  setSection: (section: string) => void
}

const DialerTop = ({ inCall, section, setSection }: DialerTop) => {
  const dispatch = useDispatch()
  const callButtons = useSelector(
    (state: RootState) => state.Call.callButtonState
  )
  return (
    <>
      {inCall ? (
        <div className="flex my-4 mr-12 ml-3 text-[white] cursor-pointer">
          <div
            className={`w-[50%] text-center  pb-2 ${
              section === "dialer" && "border-[#F7931F] border-b-2"
            }`}
            onClick={() => setSection("dialer")}
          >
            Dialer
          </div>
          <div
            className={`w-[50%] text-center pb-2 ${
              section === "contacts" && "border-[#F7931F] border-b-2"
            } `}
            onClick={() => setSection("contacts")}
          >
            Contacts
          </div>
        </div>
      ) : (
        <motion.div
          className="mx-auto p-6 pt-2"
          whileTap={{ cursor: "grabbing" }}
          whileHover={{ cursor: "grab" }}
        >
          {DRAGGABLE_ICON}
        </motion.div>
      )}
      <motion.div
        className="absolute right-0 top-2 p-6 pt-2 cursor-pointer"
        onClick={() =>
          inCall
            ? dispatch(
                actionCreators.callButtonState({
                  ...callButtons,
                  addCallButton: false,
                })
              )
            : dispatch(actionCreators.setCallStatus(""))
        }
      >
        {CLOSE_BUTTON}
      </motion.div>
    </>
  )
}

export default DialerTop
