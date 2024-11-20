import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { actionCreators } from "../../../../../store"
import path from "../../../../../navigation/routes.path"
import Notification from "../Notification/Notification"
import { t } from "i18next"
import { motion } from "framer-motion"

const RecurrenceModal = (props: any) => {
  const {
    setModalOn,
    AllRecurrenceData,
    setCloseDropdown,
    recMeet,
    setRecMeet,
    setActiveTab,
  } = props
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const progress = useSelector((state: any) => state.Flag.setProgress)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSingleClick = () => {
    if (progress === false) {
      dispatch(actionCreators.setScheduledMeetingInfo(AllRecurrenceData))

      dispatch(actionCreators.setEditScheduleMeet(true))
      dispatch(actionCreators.setSingleRecurrenceScheduleMeet(true))
      dispatch(actionCreators.setAllRecurrenceScheduleMeet(false))
      dispatch(actionCreators.setEditSingleMeet(true))
      dispatch(actionCreators.setEditSingleRecMeet(false))
      if (recMeet === false) {
        dispatch(actionCreators.setEditSingleMeet(false))
      } else {
        dispatch(actionCreators.setEditSingleRecMeet(true))
      }
      dispatch(actionCreators.setFlagEditMeetingTime(true))

      setRecMeet(false)
      //setCloseDropdown(false)
      setModalOn(false)
      setActiveTab(5)
    } else {
      dispatch(
        actionCreators.setNotification({
          content: "Meeting in progress!",
          type: "error",
        })
      )
    }
  }
  const handleAllClick = async () => {
    let times = Math.floor(new Date().getTime() / 1000)
    await meetingSession
      .getScheduleMeeting({ id: AllRecurrenceData.pin })
      .then((res: any) => {
        dispatch(actionCreators.setScheduledMeetingInfo(res[0]))

        if (res[0].live_meeting === false) {
          dispatch(actionCreators.setProgress(false))
        } else {
          dispatch(actionCreators.setProgress(true))
        }
      })
    // dispatch(actionCreators.setScheduledMeetingInfo(AllRecurrenceData))
    dispatch(actionCreators.setEditScheduleMeet(true))
    dispatch(actionCreators.setEditSingleMeet(false))
    dispatch(actionCreators.setEditSingleRecMeet(false))
    dispatch(actionCreators.setAllRecurrenceScheduleMeet(true))
    dispatch(actionCreators.setSingleRecurrenceScheduleMeet(false))
    dispatch(actionCreators.setFlagEditMeetingTime(true))
    //setCloseDropdown(false)
    setRecMeet(false)
    setModalOn(false)
    setActiveTab(5)
  }

  const handleCancelClick = () => {
    setRecMeet(false)
    setModalOn(false)
  }

  return (
    <div>
      <div className="bg-[#00000033] bg-opacity-100  backdrop-blur fixed inset-0 z-[300]">
        <motion.div
          key="meetingeditmodal"
          initial={{ opacity: 0, translateY: "60px" }}
          animate={{
            opacity: 1,
            translateY: "0px",
            transition: { duration: 0.4 },
          }}
          className="flex items-center place-content-center w-full h-full justify-center"
        >
          <div className="flex flex-col min-w-[500px] min-h-[200px] bg-[white] p-[24px] rounded-[15px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.10)]">
            <div className=" flex justify-between">
              <span className="flex">
                <div className="pt-[2px] text-[16px] font-bold text-[#404041]">
                  Edit Meeting
                </div>
              </span>
              <span
                id="handleRecCancelClick"
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
            <div className="my-[20px] text-[14px] font-normal text-[#404041]">
              Are you sure you want to edit this scheduled Meeting?
            </div>
            <div className="flex flex-row gap-[8px] justify-center">
              {recMeet ? (
                <>
                  <button
                    id="handleRecCancel"
                    onClick={() => handleCancelClick()}
                    className="rounded-[7px] text-[#293241] w-fit min-h-[36px] px-4 h-fit py-1 "
                  >
                    Cancel
                  </button>
                  <button
                    id="handleSingleRecEdit"
                    onClick={() => handleSingleClick()}
                    className="rounded-[7px] w-fit min-h-[36px] px-4 h-fit py-1 bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF]"
                  >
                    {t("Dashboard.EditSingleOccurrence")}
                  </button>
                  <button
                    id="handleAllRecEdit"
                    onClick={(e) => handleAllClick()}
                    className="rounded-[7px] w-fit min-h-[36px] px-4 h-fit py-1 bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF]"
                  >
                    {t("Dashboard.EditAllOccurrence")}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-[80px]">
                    <button
                      id="RecCancelClick"
                      onClick={() => handleCancelClick()}
                      className="rounded-[7px] text-[#293241] w-fit min-h-[36px] px-4 h-fit py-1 "
                    >
                      Cancel
                    </button>
                    <button
                      id="handleSingleRecEditClick"
                      onClick={(e) => handleSingleClick()}
                      className="rounded-[7px] bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] w-fit min-h-[36px] px-4 h-fit py-1"
                    >
                      Edit
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

export default RecurrenceModal
