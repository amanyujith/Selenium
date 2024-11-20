import React, { useState } from "react"
import { PLUS_ICON } from "../../../../../../../utils/SVG/svgsRestHere"
import { motion } from "framer-motion"
import { TRANSFER_ICON, end_call } from "../../vault/svg"
import { MeetingSessionType } from "hdmeet"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../../../store"
import { callDetails } from "../../../../../../../store/actions"
import Tooltip from "../../../../../../../atom/ToolTip/Tooltip"

interface addCallListOptions {
  holdScreen?: boolean
  uuid?: string
  name?: string
  profile_picture?: string
  index?: number
  phone?: string
}

const AddCallListOptions = ({
  holdScreen,
  uuid,
  name,
  profile_picture,
  index,
  phone,
}: addCallListOptions) => {
  const meetingSession: MeetingSessionType = useSelector(
    (state: any) => state.Main.meetingSession
  )
  const silDetails = useSelector((state: RootState) => state.Call.silDetails)
  const pbxCallData = useSelector((state: RootState) => state.Call.pbxCallData)
  const callButtons = useSelector(
    (state: RootState) => state.Call.callButtonState
  )

  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false)
  const handleAddCall = () => {
    meetingSession?.AddVoipCall(phone as string)
    dispatch(
      actionCreators.setPbxCallData({
        type: pbxCallData?.type,
        data: {
          callee: phone,
          caller: silDetails?.id,
          user_sil_id: silDetails?.id,
          uuid: uuid,
          name: name,
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

  const handleTransferCall = () => {
    meetingSession.transferCall(phone ?? "", holdScreen ? "active" : "inactive")
  }

  const handleSwapCall = () => {
    if (!loader) {
      setLoader(true)
      meetingSession?.swapVoipCall()
      dispatch(
        actionCreators.setPbxCallData({
          type: pbxCallData?.type,
          data: pbxCallData?.callonHold?.[0] ?? {},
          callonHold: [pbxCallData.data],
        })
      )
      setTimeout(() => {
        setLoader(false)
      }, 1000)
    }
  }

  return (
    <div className="flex ml-auto mb-1 gap-2">
      {!holdScreen && (
        <Tooltip content={"Add Call"} direction="left" onclick={true}>
          <motion.div
            className="w-6 h-4  ml-auto flex justify-center items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              handleAddCall()
            }}
            // whileHover={{ scale: 1.2 }}
          >
            {PLUS_ICON}
          </motion.div>
        </Tooltip>
      )}

      {/* <Tooltip content={"Call Transfer"} direction="left" onclick={true}>
        <motion.div
          className={`w-6 h-4  ml-auto flex justify-center items-center cursor-pointer ${
            holdScreen && "mt-0.5"
          } `}
          onClick={(e) => {
            e.stopPropagation()
            handleTransferCall()
          }}
          // whileHover={{ scale: 1.2 }}
        >
          {TRANSFER_ICON(holdScreen ? "#5C6779" : "#ffffff")}
        </motion.div>
      </Tooltip> */}
      {holdScreen && (
        <div className="text-[#76B947] text-[12px] flex gap-2 justify-center items-center">
          <motion.div
            className="ml-auto flex justify-center items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              handleSwapCall()
            }}
          >
            Swap
          </motion.div>
          {/* <motion.div
            className=" ml-auto flex justify-center items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            Merge
          </motion.div> */}
          <div
            className="w-[24px] h-[24px] ml-0.5 p-1 rounded-[50%]  border-[#F74B14] border flex justify-center items-center cursor-pointer"
            onClick={() => {
              meetingSession.endVoipCall(false, { closeInactiveCall: true })
              dispatch(
                actionCreators.setPbxCallData({
                  ...pbxCallData,
                  callonHold: null,
                })
              )
            }}
          >
            <div>{end_call("#F74B14", " w-2")}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCallListOptions
