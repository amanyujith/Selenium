import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import path from "../../../../../navigation/routes.path"
import Notification from "../Notification/Notification"
import { t } from "i18next"
import { actionCreators } from "../../../../../store"
import { motion } from "framer-motion"

const DeleteModal = (props: any) => {
  const {
    setDeleteModalOn,
    AllDeleteData,
    setRecMeet,
    handleReadValues,
    readDatas,
    setCloseDropdown,
    recMeet,
    openData,
    handleValues,
  } = props

  const user = useSelector((state: any) => state.Main.meetingSession)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //
  //     "readDatasreadDatasreadDatasreadDatasreadDatasreadDatasreadDatasreadDatasreadDatas",
  //     readDatas
  //   );

  const handleSingleClick = async () => {
    if (
      AllDeleteData.recurrence_type === "open" &&
      AllDeleteData.recurrence === true
    ) {
      await user
        .deleteMeeting(AllDeleteData.uuid)
        .then((res: any) => {
          dispatch(
            actionCreators.setNotification({
              content: t("Dashboard.MeetingDeleteMsg"),
              type: "success",
            })
          )
          dispatch(actionCreators.setMeetingModal(false))
        })
        .catch((e: any) => {
          dispatch(
            actionCreators.setNotification({
              content: t("Dashboard.MeetingNotDeleteMsg"),
              type: "error",
            })
          )
        })
    } else {
      await user
        .deleteScheduleMeeting(AllDeleteData.uuid)
        .then((res: any) => {
          dispatch(
            actionCreators.setNotification({
              content: t("Dashboard.MeetingDeleteMsg"),
              type: "success",
            })
          )
          dispatch(actionCreators.setMeetingModal(false))
        })
        .catch((e: any) => {
          dispatch(
            actionCreators.setNotification({
              content: t("Dashboard.MeetingNotDeleteMsg"),
              type: "error",
            })
          )
        })
    }
    // navigate(path.DASHBOARD)
    setRecMeet(false)
    setDeleteModalOn(false)
    handleReadValues(readDatas)
    handleValues()
    setCloseDropdown(false)
    // handleReadValues(readDatas)
  }
  const handleAllClick = async (event: any) => {
    await user
      .deleteMeeting(AllDeleteData.meeting_uuid)
      .then((res: any) => {
        dispatch(
          actionCreators.setNotification({
            content: t("Dashboard.MeetingDeleteMsg"),
            type: "success",
          })
        )
        dispatch(actionCreators.setMeetingModal(false))
      })
      .catch((e: any) => {
        dispatch(
          actionCreators.setNotification({
            content: t("Dashboard.MeetingNotDeleteMsg"),
            type: "error",
          })
        )
      })
    setRecMeet(false)
    setDeleteModalOn(false)
    handleReadValues(readDatas)
    setCloseDropdown(false)
    // handleReadValues(readDatas, event)
  }

  const handleCancelClick = () => {
    setRecMeet(false)
    setDeleteModalOn(false)
  }

  return (
    <div>
      <div className="bg-[#00000033] bg-opacity-100  backdrop-blur fixed inset-0 z-[300]">
        <motion.div
          key="meetingdeletemodal"
          initial={{ opacity: 0, translateY: "60px" }}
          animate={{
            opacity: 1,
            translateY: "0px",
            transition: { duration: 0.4 },
          }}
          className="flex items-center place-content-center w-full h-full justify-center"
        >
          <div className="flex flex-col min-w-[500px] min-h-[250px] bg-[white] p-[24px] rounded-[15px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.10)]">
            <div className="  flex justify-between">
              <span className="flex">
                <div className="pt-[2px] text-[16px] font-bold text-[#404041]">
                  Delete Meeting
                </div>
              </span>
              <span
                id="CancelClick"
                onClick={() => handleCancelClick()}
                className="cursor-pointer p-1"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5187 5.59653C14.8271 5.28819 14.8271 4.7896 14.5187 4.48454C14.2104 4.17948 13.7118 4.17619 13.4067 4.48454L9.50328 8.388L5.59653 4.48126C5.28819 4.17291 4.7896 4.17291 4.48454 4.48126C4.17948 4.7896 4.17619 5.28819 4.48454 5.59325L8.388 9.49672L4.48126 13.4035C4.17291 13.7118 4.17291 14.2104 4.48126 14.5155C4.7896 14.8205 5.28819 14.8238 5.59325 14.5155L9.49672 10.612L13.4035 14.5187C13.7118 14.8271 14.2104 14.8271 14.5155 14.5187C14.8205 14.2104 14.8238 13.7118 14.5155 13.4067L10.612 9.50328L14.5187 5.59653Z"
                    fill="#5C6779"
                  />
                </svg>
              </span>
            </div>
            {/* <div className="my-[30px]">{t("Dashboard.DeleteMsg")}</div> */}
            <div className="my-[20px] text-[14px] font-normal text-[#404041]">
              Are you sure you want to delete this scheduled Meeting?
            </div>
            <div className="h-fit p-3 rounded-[10px] border-l-[1px] border-l-[#F7931F] bg-[#FEF4E9] flex flex-col">
              <div className="text-[18px] font-medium">
                {AllDeleteData.name}
              </div>
            </div>
            <div className="flex flex-row gap-[8px] justify-evenly mt-3">
              {recMeet ? (
                <>
                  <button
                    id="handleCancelClick"
                    onClick={() => handleCancelClick()}
                    className="rounded-[7px] text-[#293241] w-fit  h-fit min-h-[36px] px-4 py-1 "
                  >
                    Cancel
                  </button>
                  <button
                    id="handleSingleClick"
                    onClick={() => handleSingleClick()}
                    className="rounded-[7px] bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] w-fit min-h-[36px] px-4 h-fit py-1"
                  >
                    This Occurrence
                  </button>
                  <button
                    id="handleAllClick"
                    onClick={(e) => handleAllClick(e)}
                    className="rounded-[7px] bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] w-fit min-h-[36px] px-4 h-fit py-1 "
                  >
                    All Occurrence
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-[80px]">
                    <button
                      id="handleSingleCancelClick"
                      onClick={() => handleCancelClick()}
                      className="rounded-[7px] text-[#293241] w-fit min-h-[36px] px-4 h-fit py-1 "
                    >
                      Cancel
                    </button>
                    <button
                      id="handleSingleClickMeet"
                      onClick={(e) => handleSingleClick()}
                      className="rounded-[7px] bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] w-fit min-h-[36px] px-4 h-fit py-1"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DeleteModal
