import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { detect } from "detect-browser"
import { actionCreators } from "../../../../../store"
import Notification from "../Notification/Notification"
import copy from "copy-to-clipboard"
import FadeIn from "react-fade-in/lib/FadeIn"
import { t } from "i18next"
import SafariPopUpModal from "../TodaysMeetingComponents/SafariPopUpModal"
import RecurrenceModal from "../Modal/RecurrenceModal"
import DeleteModal from "../Modal/DeleteModal"
import noMeeting from "../../../../../constants/images/noMeeting.jpg"
import Tooltip from "../../../../../atom/ToolTip/Tooltip"
import { getURL } from "../../../../../utils/linkManipulation"
const _ = require("lodash")

const OpenMeetings = (props: any) => {
  const dispatch = useDispatch()
  const { readDatas, handleReadValues, setActiveTab } = props
  const [resultStatus, setResultStatus] = useState<any>(false)
  const [openData, setOpenData] = useState([])
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const browser = detect()
  const [AllRecurrenceData, setAllRecurrenceData] = useState()
  const [searchText, setSearchText] = useState("")
  const [clipboardState, setClipboardState] = useState(false)
  const [AllDeleteData, setAllDeleteData] = useState()
  const [modalOn, setModalOn] = useState(false)
  const [deleteModalOn, setDeleteModalOn] = useState(false)
  const [modal, setModal] = useState(false)
  const [recMeet, setRecMeet] = useState(false)
  const [loader, setloader] = useState<any>(false)
  const [error, setError] = useState("")
  const user = useSelector((state: any) => state.Main.meetingSession)
  let times = Math.floor(new Date().getTime() / 1000)
  dispatch(actionCreators.setProgress(false))
  dispatch(actionCreators.setEditSingleMeet(false))
  dispatch(actionCreators.setEditSingleRecMeet(false))
  dispatch(actionCreators.setFlagEditMeetingTime(false))
  dispatch(actionCreators.setEditScheduleMeet(false))
  dispatch(actionCreators.setAllRecurrenceScheduleMeet(false))

  const setModalclose = () => {
    setModal(false)
  }

  const handleDebounceFn = async (searchText: string) => {
    if (searchText !== "") {
      await user
        .searchMeetings({
          recurrence: true,
          recurrence_type: "open",
          personal: false,
          search: searchText,
        })
        .then((result: any) => {
          if (result.length === 0) {
            setResultStatus(true)
            setOpenData(result)
          } else if (result.length === 1 && result[0].personal === true) {
            setResultStatus(false)
            setOpenData([])
          } else {
            setResultStatus(false)
            setOpenData(result)
          }
        })
        .catch((e: any) => {})
    } else {
      onHandleClose()
    }
  }

  useEffect(() => {
    handleValues()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debounceFn(e.target.value)
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 500), [openData])

  const onHandleClose = () => {
    setSearchText("")
    handleValues()
    setResultStatus(false)
  }

  const handleEditCase = (data: any) => {
    setAllRecurrenceData(data)

    if (
      (data.recurrence_type === "open" && data.recurrence === true) ||
      data.recurrence === false
    ) {
      setModalOn(true)
      dispatch(actionCreators.setProgress(false))
    } else {
      setRecMeet(true)
      setModalOn(true)
      dispatch(actionCreators.setProgress(false))
    }

    if (
      Math.floor((new Date(data.start_date_time).getTime() - times) / 60) > 0 ||
      Math.floor((new Date(data.start_date_time).getTime() - times) / 60) ===
        0 ||
      (data.recurrence_type === "open" && data.recurrence === true)
    ) {
      dispatch(actionCreators.setProgress(false))
    } else {
      dispatch(actionCreators.setProgress(true))
    }
  }

  const handleClick = async (
    data: any,
    type: any,
    id: any,
    meetingId: number,
    password: any
  ) => {
    await meetingSession
      .preAuth({
        meetingId: meetingId,
        password: password ? password : undefined,
      })
      .then(async (data: any) => {
        dispatch(actionCreators.meetingID(meetingId as number))
        dispatch(actionCreators.setMeetingInfo(data))

        if (error) setError("")
        await meetingSession.meetingInvite(data.roomuuid).then((res: any) => {
          const newUrl = getURL(res?.meeting_url)
          const result = newUrl?.replace(
            "/launch-meetings/?iuasdf",
            "/app/?rtdf"
          )

          const newWindow = window.open(result, "_blank")
          if (
            browser?.name === "safari" &&
            (!newWindow ||
              newWindow.closed ||
              typeof newWindow.closed == "undefined")
          ) {
            setModal(true)
          }
        })
      })
      .catch((error: any) => {
        // if (error.error_code === "http_error") {
        //     if (meetingPassword)
        //         setError("Invalid Meeting Password")
        //     else
        //         setError("Invalid Meeting ID")
        //     // alert("Invalid meeting")
        // }
        // else if (error.error_code == "un_authorized") {
        //     dispatch(actionCreators.meetingID(meetingId as number))
        //     if (error)
        //         setError('')
        //     setmeetingPassword(true)
        //     // navigate(path.JOIN);
        // }
      })
  }

  const handleDeleteCase = async (data: any) => {
    setAllDeleteData(data)
    if (
      Math.floor((new Date(data.start_date_time).getTime() - times) / 60) > 0 ||
      Math.floor((new Date(data.start_date_time).getTime() - times) / 60) ===
        0 ||
      (data.recurrence_type === "open" && data.recurrence === true)
    ) {
      if (
        (data.recurrence_type === "open" && data.recurrence === true) ||
        data.recurrence === false
      ) {
        setDeleteModalOn(true)
      } else {
        setRecMeet(true)
        setDeleteModalOn(true)
      }
    } else
      dispatch(
        actionCreators.setNotification({
          content: "Meeting in progress!",
          type: "error",
        })
      )
  }

  const handleValues = async () => {
    setloader(true)
    const data = {
      recurrence: true,
      recurrence_type: "open",
      personal: false,
    }
    setloader(true)
    await meetingSession.getScheduleMeeting(data).then((res: any) => {
      setOpenData(res)

      setloader(false)
    })
  }

  const handleCopyURL = (meeting_uuid: any) => {
    meetingSession.meetingInvite(meeting_uuid).then((res: any) => {
      const result = copy(res.meeting_url)
      setClipboardState(result)
    })
    setTimeout(() => {
      setClipboardState(false)
    }, 3000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-122px)] overflow-y-auto overflow-x-hidden relative">
      <div className="grid grid-flow-col mb-4 px-8 mt-7 ">
        <div className="text-[#404041] text-[18px] pl-1 font-bold">
          Open Meetings
        </div>
        <div className="flex justify-end">
          <div className="w-[300px] border-[1px] border-[#a7a9ab53] pr-2 rounded-[10px] h-[44px]">
            <div className="flex flex-row items-center">
              <svg
                className="mt-[8px] mx-4"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_204_4310)">
                  <path
                    d="M14.625 7.3125C14.625 8.92617 14.1012 10.4168 13.2188 11.6262L17.6695 16.0805C18.109 16.5199 18.109 17.2336 17.6695 17.673C17.2301 18.1125 16.5164 18.1125 16.077 17.673L11.6262 13.2188C10.4168 14.1047 8.92617 14.625 7.3125 14.625C3.27305 14.625 0 11.352 0 7.3125C0 3.27305 3.27305 0 7.3125 0C11.352 0 14.625 3.27305 14.625 7.3125ZM7.3125 12.375C7.97732 12.375 8.63562 12.2441 9.24984 11.9896C9.86405 11.7352 10.4221 11.3623 10.8922 10.8922C11.3623 10.4221 11.7352 9.86405 11.9896 9.24984C12.2441 8.63562 12.375 7.97732 12.375 7.3125C12.375 6.64768 12.2441 5.98938 11.9896 5.37516C11.7352 4.76095 11.3623 4.20287 10.8922 3.73277C10.4221 3.26268 9.86405 2.88977 9.24984 2.63536C8.63562 2.38095 7.97732 2.25 7.3125 2.25C6.64768 2.25 5.98938 2.38095 5.37516 2.63536C4.76095 2.88977 4.20287 3.26268 3.73277 3.73277C3.26268 4.20287 2.88977 4.76095 2.63536 5.37516C2.38095 5.98938 2.25 6.64768 2.25 7.3125C2.25 7.97732 2.38095 8.63562 2.63536 9.24984C2.88977 9.86405 3.26268 10.4221 3.73277 10.8922C4.20287 11.3623 4.76095 11.7352 5.37516 11.9896C5.98938 12.2441 6.64768 12.375 7.3125 12.375Z"
                    fill="#9B9FA3"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_204_4310">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <input
                id="searchText"
                className="text-[#979898] border-0 focus:border-0 mt-2 focus:outline-none w-full"
                placeholder="Search"
                type="text"
                value={searchText}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>
      {loader ? (
        <div
          className={`h-[100%] text-[#767676] text-xl flex flex-col justify-center items-center `}
        >
          <svg
            aria-hidden="true"
            className={`inline ${
              // size === "sm" ? "w-6 h-6" : size === "md" ? "w-9 h-9" :
              "w-12 h-12"
            } mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600`}
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#ccc"
            />

            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="#222"
            />
          </svg>
        </div>
      ) : openData.length === 0 ? (
        <div className=" text-[#767676] text-xl flex flex-col justify-center items-center h-[100%]">
          <img src={noMeeting} className="" alt="" />
          <div className="text-[#747474] py-2">
            You have no open meetings
          </div>{" "}
        </div>
      ) : (
        openData.map((data: any) => {
          let [hours, minutes] = [
            (data.duration / 3600) | 0,
            ((data.duration % 3600) / 60) | 0,
          ];
          if (data?.personal === false || data?.personal === null) {
            return (
              <div className="px-6">
                <FadeIn>
                  <div className="h-fit w-full p-3 flex flex-col max-h-[115px] group hover:bg-[#FEEDE8]">
                    <div className="px-3 flex justify-between">
                      <div className="text-[18px] font-medium text-[#404041] capitalize ">
                        {data.name}
                      </div>
                      <div className="text-[12px] font-normal text-right text-[#A7A9AB] ">
                        {hours}hr {minutes}min
                      </div>
                    </div>
                    <div className="px-3 text-[16px] text-[#909091]">
                      {data.notes}
                    </div>
                    <div className="w-full h-fit pr-3  flex justify-between">
                      <div>
                        {/* {item.members != null && (
                        <div className="flex mt-1 -space-x-1 ml-3">
                          {item.members.slice(0, 2).map((item: any) => {
                            return (
                              <div
                                className={`w-[21px] h-[21px] rounded-bl-none rounded-[44%] outline outline-1  outline-offset-1 outline-[#FFFFFF] text-[15px] text-primary-200 bg-primary-100 overflow-hidden`}
                              >
                                {item.slice(0, 1)}
                              </div>
                            );
                          })}
                          {item.members.length > 2 && (
                            <div
                              className={`w-[21px] h-[21px] rounded-bl-none rounded-[44%] outline outline-1  outline-offset-1 outline-[#FFFFFF] pt-[3px] text-[10px] text-primary-200 bg-primary-100 overflow-hidden`}
                            >
                              +{item.members.length - 2}
                            </div>
                          )}
                        </div>
                      )} */}
                      </div>
                      <div className="w-[216px] grid grid-flow-col rounded-[7px] py-1 pl-2 gap-3 bg-[#FFFFFF] items-center invisible group-hover:visible -mt-5">
                        <Tooltip
                          content={"Delete"}
                          direction="top"
                          onclick={true}
                        >
                          <div  
                            id="deleteOpenMeeting"
                            onClick={() => handleDeleteCase(data)}
                            className="hover:bg-[#0000000a] flex justify-center py-1 cursor-pointer"
                          >
                            <svg
                              width="18"
                              height="19"
                              viewBox="0 0 18 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.73694 4.02344H10.2027C10.3493 4.02344 10.4853 4.09727 10.5652 4.22119L10.9731 4.86719H6.96922L7.37707 4.22119C7.45437 4.09727 7.59299 4.02344 7.7396 4.02344H7.73694ZM11.9807 4.86719L11.2903 3.77559C11.0557 3.40381 10.6452 3.17969 10.2054 3.17969H7.73694C7.2971 3.17969 6.88658 3.40381 6.652 3.77559L5.96159 4.86719H4.70871H3.85302H3.42651C3.19193 4.86719 3 5.05703 3 5.28906C3 5.52109 3.19193 5.71094 3.42651 5.71094H3.91433L4.59408 15.1135C4.6554 15.9968 5.39912 16.6797 6.2948 16.6797H11.6475C12.5432 16.6797 13.2842 15.9968 13.3482 15.1135L14.028 5.71094H14.5158C14.7504 5.71094 14.9423 5.52109 14.9423 5.28906C14.9423 5.05703 14.7504 4.86719 14.5158 4.86719H14.0893H13.2336H11.9807ZM13.175 5.71094L12.4979 15.0528C12.4659 15.4932 12.0953 15.8359 11.6475 15.8359H6.2948C5.84696 15.8359 5.47643 15.4932 5.44444 15.0528L4.77002 5.71094H13.1723H13.175Z"
                                fill="#5C6779"
                              />
                            </svg>
                          </div>
                        </Tooltip>
                        <Tooltip
                          content={clipboardState === false ? "Copy" : "Copied"}
                          direction="top"
                          onclick={true}
                        >
                          <div
                            id="copyOpenMeeting"
                            onClick={() => handleCopyURL(data.uuid)}
                            className="hover:bg-[#0000000a] flex justify-center py-1 cursor-pointer"
                          >
                            <svg
                              width="14"
                              height="17"
                              viewBox="0 0 14 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 11.9297H7C6.44688 11.9297 6 11.4828 6 10.9297V2.92969C6 2.37656 6.44688 1.92969 7 1.92969H10.3781C10.5094 1.92969 10.6375 1.98281 10.7312 2.07656L12.8531 4.19844C12.9469 4.29219 13 4.42031 13 4.55156V10.9297C13 11.4828 12.5531 11.9297 12 11.9297ZM13.5594 3.48906L11.4406 1.37031C11.1594 1.08906 10.7781 0.929688 10.3813 0.929688H7C5.89687 0.929688 5 1.82656 5 2.92969V10.9297C5 12.0328 5.89687 12.9297 7 12.9297H12C13.1031 12.9297 14 12.0328 14 10.9297V4.55156C14 4.15469 13.8406 3.77344 13.5594 3.49219V3.48906ZM2 4.92969C0.896875 4.92969 0 5.82656 0 6.92969V14.9297C0 16.0328 0.896875 16.9297 2 16.9297H7C8.10312 16.9297 9 16.0328 9 14.9297V13.9297H8V14.9297C8 15.4828 7.55312 15.9297 7 15.9297H2C1.44687 15.9297 1 15.4828 1 14.9297V6.92969C1 6.37656 1.44687 5.92969 2 5.92969H4V4.92969H2Z"
                                fill="#5C6779"
                              />
                            </svg>
                          </div>
                        </Tooltip>
                        <Tooltip
                          content={"Edit"}
                          direction="top"
                          onclick={true}
                        >
                          <div
                            id="editOpenMeeting"
                            onClick={() => handleEditCase(data)}
                            className="hover:bg-[#0000000a] flex justify-center py-1 cursor-pointer"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.3273 1.28089L12.6488 1.60235C12.9809 1.93444 12.9809 2.47374 12.6488 2.80583L11.9395 3.51517L10.4145 1.99023L11.1239 1.28089C11.4559 0.948801 11.9953 0.948801 12.3273 1.28089ZM5.27115 7.13359L9.81411 2.59064L11.339 4.11558L6.7961 8.65853C6.68452 8.77011 6.54106 8.84981 6.38697 8.88701L4.64417 9.28817L5.04534 7.54272C5.07987 7.38863 5.15957 7.24517 5.27381 7.13359H5.27115ZM10.5234 0.677818L4.67074 6.53318C4.44492 6.75899 4.28818 7.04326 4.21645 7.35409L3.6612 9.76106C3.62932 9.90452 3.67182 10.0533 3.77544 10.1569C3.87905 10.2605 4.02782 10.303 4.17128 10.2711L6.57825 9.7159C6.88908 9.64417 7.17335 9.48742 7.39917 9.2616L13.2519 3.40624C13.916 2.74207 13.916 1.66611 13.2519 1.00193L12.9304 0.677818C12.2662 0.013644 11.1903 0.013644 10.5261 0.677818H10.5234ZM2.37536 1.77769C1.2011 1.77769 0.25 2.72879 0.25 3.90305V11.5543C0.25 12.7286 1.2011 13.6797 2.37536 13.6797H10.0266C11.2009 13.6797 12.152 12.7286 12.152 11.5543V8.15376C12.152 7.91997 11.9607 7.72869 11.7269 7.72869C11.4931 7.72869 11.3019 7.91997 11.3019 8.15376V11.5543C11.3019 12.2584 10.7307 12.8295 10.0266 12.8295H2.37536C1.67133 12.8295 1.10014 12.2584 1.10014 11.5543V3.90305C1.10014 3.19902 1.67133 2.62783 2.37536 2.62783H5.77593C6.00972 2.62783 6.201 2.43655 6.201 2.20276C6.201 1.96897 6.00972 1.77769 5.77593 1.77769H2.37536Z"
                                fill="#5C6779"
                              />
                            </svg>
                          </div>
                        </Tooltip>
                        <Tooltip
                          content={"Start Meeting"}
                          direction="top"
                          onclick={true}
                        >
                          <div
                            id="startOpenMeeting"
                            onClick={() =>
                              handleClick(
                                "START",
                                data,
                                data.uuid,
                                data.meeting_id || data.id,
                                data.password
                              )
                            }
                            className="hover:bg-[#0000000a] flex justify-center py-1 cursor-pointer"
                          >
                            <svg
                              width="32"
                              height="33"
                              viewBox="0 0 32 33"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.93335"
                                width="32"
                                height="32"
                                rx="5"
                                fill="#F7941E"
                              />
                              <path
                                d="M23.875 16.9335C23.8755 17.1244 23.8265 17.3123 23.7329 17.4788C23.6392 17.6452 23.5041 17.7846 23.3406 17.8834L13.21 24.0807C13.0392 24.1853 12.8436 24.2424 12.6433 24.2461C12.4431 24.2498 12.2455 24.2 12.0709 24.1018C11.898 24.0051 11.754 23.8642 11.6537 23.6934C11.5533 23.5226 11.5003 23.3282 11.5 23.1301V10.7368C11.5003 10.5387 11.5533 10.3443 11.6537 10.1735C11.754 10.0027 11.898 9.86176 12.0709 9.7651C12.2455 9.6669 12.4431 9.61709 12.6433 9.6208C12.8436 9.62451 13.0392 9.6816 13.21 9.78619L23.3406 15.9835C23.5041 16.0823 23.6392 16.2217 23.7329 16.3882C23.8265 16.5546 23.8755 16.7425 23.875 16.9335Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <hr className="text-[#a7a9ab53] mx-6" />
                </FadeIn>
              </div>
            );
          }
        })
      )}

      {deleteModalOn && (
        <DeleteModal
          readDatas={readDatas}
          handleReadValues={handleReadValues}
          setRecMeet={setRecMeet}
          setDeleteModalOn={setDeleteModalOn}
          recMeet={recMeet}
          AllDeleteData={AllDeleteData}
          handleValues={handleValues}
        />
      )}

      {modalOn && (
        <RecurrenceModal
          setActiveTab={setActiveTab}
          setModalOn={setModalOn}
          recMeet={recMeet}
          setRecMeet={setRecMeet}
          AllRecurrenceData={AllRecurrenceData}
        />
      )}

      {modal && <SafariPopUpModal setclose={setModalclose} />}
    </div>
  );
}

export default OpenMeetings
