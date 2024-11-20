import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment-timezone"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useEffect, useState } from "react"
import { actionCreators } from "../../../../../store"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useDispatch, useSelector } from "react-redux"
import { detect } from "detect-browser"
import { useNavigate } from "react-router-dom"
import LocalDb from "../../../../../dbServices/dbServices"
import Notification from "../Notification/Notification"
import { t } from "i18next"
import copy from "copy-to-clipboard"
import path from "../../../../../navigation/routes.path"
import ScheduleTimer from "../TodaysMeetingComponents/scheduleTimer"
import DeleteModal from "../Modal/DeleteModal"
import RecurrenceModal from "../Modal/RecurrenceModal"
import InviteModal from "../TodaysMeetingComponents/InviteModal"
import SafariPopUpModal from "../TodaysMeetingComponents/SafariPopUpModal"
import MeetingModal from "./meetingModal"
import FadeIn from "react-fade-in/lib/FadeIn"
import Tooltip from "../../../../../atom/ToolTip/Tooltip"
import noMeeting from "../../../../../constants/images/noMeeting.jpg"
import { getURL } from "../../../../../utils/linkManipulation"
import UseEscape from "../Chat/hooks/useEscape"

const UpcomingMeetings = (props: any) => {
  const dispatch = useDispatch()
  const {
    apiResponce,
    setApiResponce,
    displayFilter,
    searchData,
    readDatas,
    handleReadValues,
    setActiveTab,
    loader,
    setloader,
  } = props
  const localizer = momentLocalizer(moment)
  const [meetData, setMeetData] = useState()
  const [list, setList] = useState("calender")
  const [firstCalender, setFirstCalender] = useState(false)
  const [secondCalender, setSecondCalender] = useState(false)
  const [calenderData, setCalenderData] = useState([])
  const browser = detect()
  const [calenderDate, setCalenderDate] = useState("")
  const meetingSessions = useSelector((state: any) => state.Main.meetingSession)
  const user = useSelector((state: any) => state.Main.meetingSession)
  dispatch(actionCreators.setEditSingleMeet(false))
  dispatch(actionCreators.setEditSingleRecMeet(false))
  dispatch(actionCreators.setFlagEditMeetingTime(false))
  dispatch(actionCreators.setChatscreen(false))
  //dispatch(actionCreators.setEditScheduleMeet(false));
  const meetingModal = useSelector((state: any) => state.Chat.setMeetingModal)
  const [clipboardState, setClipboardState] = useState(false)
  const [AllRecurrenceData, setAllRecurrenceData] = useState()
  const [AllDeleteData, setAllDeleteData] = useState()
  const [modalOn, setModalOn] = useState(false)
  const [deleteModalOn, setDeleteModalOn] = useState(false)
  const [modal, setModal] = useState(false)
  const [sortedDate, setSortedDate] = useState([])
  const [recMeet, setRecMeet] = useState(false)
  const [invite, setinvite] = useState(false)
  const [meetingInfos, setMeetingInfos] = useState([])
  const [error, setError] = useState("")
  const [search, setSearch] = useState<any>({
    start: new Date(),
    end: new Date(),
  })
  UseEscape(() => setinvite(false));
  UseEscape(() => setModalOn(false));
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  let c = moment(new Date()).format("h:mma")
  let dates = moment(new Date()).format("MM.DD.YYYY")
  let times = Math.floor(new Date().getTime() / 1000)

  const navigate = useNavigate()

  const setModalclose = () => {
    setModal(false)
  }

  UseEscape(() => setModalclose());

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const mappedArray = apiResponce.map(
      (item: any) =>
        item.status !== "disabled" && {
          id: item.meeting_uuid,
          end: moment
            .unix(item.end_date_time)
            .tz(userTimeZone)
            .format("MMM DD, YYYY, hh:mm:ss A"),
          start: moment
            .unix(item.start_date_time)
            .tz(userTimeZone)
            .format("MMM DD, YYYY, hh:mm:ss A"),
          title: item.name,
          resource: item,
        }
    )
    setCalenderData(mappedArray)
  }, [apiResponce])

  const handleSearch = (e: any, type: any) => {
    setSearch((prevSearch: any) => ({ ...prevSearch, [type]: e }))
  }
UseEscape(() => setDeleteModalOn(false));
  const convertToEpochTime = (selectedDate: any) => {
    const currentDate = new Date()
    const selectedDateTimeStart = new Date(selectedDate.start)
    const selectedDateTimeEnd = new Date(selectedDate.end)

    // Set start time to current time if it's today, otherwise set it to 12:00 AM
    const startTime =
      selectedDateTimeStart.toDateString() === currentDate.toDateString()
        ? currentDate.getTime()
        : selectedDateTimeStart.setHours(0, 0, 0, 0)

    // Set end time to 11:59:59 PM of the selected day
    const endTime = selectedDateTimeEnd.setHours(23, 59, 59, 999)

    return {
      startTime: new Date(startTime).getTime() / 1000,
      endTime: new Date(endTime).getTime() / 1000,
    }
  }

  const searchCall = async () => {
    setloader(true)
    if (search.end.setSeconds(0, 0) >= search.start.setSeconds(0, 0)) {
      const { startTime, endTime } = convertToEpochTime(search)
      await user
        .meetingList(startTime, endTime)
        .then((res: any) => {
          setApiResponce(res)
          setloader(false)
        })
        .catch((e: any) => {
          setloader(false)
        })
    }
    setloader(false)
  }

  useEffect(() => {
    const buttonGroup = document.querySelector(".rbc-btn-group")

    if (buttonGroup) {
      const buttons = buttonGroup.querySelectorAll("button")

      buttons.forEach((button, index) => {
        button.id = `customButton${index + 1}`
      })
    }

    const button1 = document.querySelector("#customButton2")
    if (button1) {
      button1.innerHTML = `<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.53299 8.84009C2.15632 9.2063 2.15632 9.80103 2.53299 10.1672L7.35442 14.8547C7.7311 15.2209 8.34282 15.2209 8.71949 14.8547C9.09616 14.4885 9.09616 13.8938 8.71949 13.5276L5.54036 10.4397H14.7855C15.3188 10.4397 15.7497 10.0208 15.7497 9.5022C15.7497 8.98364 15.3188 8.5647 14.7855 8.5647H5.54337L8.71648 5.47681C9.09315 5.1106 9.09315 4.51587 8.71648 4.14966C8.3398 3.78345 7.72808 3.78345 7.35141 4.14966L2.52998 8.83716L2.53299 8.84009Z" fill="#5C6779"/>
</svg>
`
    }
    const button2 = document.querySelector("#customButton3")
    if (button2) {
      button2.innerHTML = `<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.4675 10.1774C15.8442 9.80089 15.8442 9.1894 15.4675 8.81288L10.6458 3.99333C10.2691 3.61681 9.65733 3.61681 9.28064 3.99333C8.90394 4.36986 8.90394 4.98134 9.28064 5.35787L12.4599 8.53274H3.21434C2.68094 8.53274 2.25 8.96349 2.25 9.49665C2.25 10.0298 2.68094 10.4606 3.21434 10.4606H12.4569L9.28365 13.6354C8.90696 14.012 8.90696 14.6234 9.28365 15C9.66035 15.3765 10.2721 15.3765 10.6488 15L15.4705 10.1804L15.4675 10.1774Z" fill="#5C6779"/>
</svg>
`
    }
  }, [list, loader])

  const onDateClick = (e: any) => {
    dispatch(actionCreators.setEditScheduleMeet(false))
    dispatch(actionCreators.setSingleRecurrenceScheduleMeet(false))
    dispatch(actionCreators.setAllRecurrenceScheduleMeet(false))

    dispatch(actionCreators.setSelectedDate(e.start))
    setActiveTab(1)
  }

  useEffect(() => {
    let m = moment(new Date(readDatas), "MM-DD-YYYY HH:mm:ss A").format(
      "MMMM DD YYYY"
    )
    setCalenderDate(m)
    apiResponce?.map((item: any) => {
      return console.log(new Date(item.start_date_time), "item.start_date_time")
    })
  }, [readDatas])

  useEffect(() => {
    let updateData: any = [...sortedDate]
    let value: any = []
    let y = new Date().setDate(new Date().getDate() + 1)
    apiResponce
      ?.filter((item: any, index: any) => {
        return true
      })
      .map((data: any) => {
        if (data.status != "disabled") {
          let date = moment(new Date(data.start_date_time * 1000)).format(
            "MM.DD.YYYY"
          )
          let filter = value.filter((n: any) => {
            return n.title === date
          })
          if (filter[0]) {
            filter[0].list.push(data)
          } else {
            value.push({ title: date, list: [data] })
          }
        }
      })

    setSortedDate(value)
  }, [apiResponce, searchData])

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

  useEffect(() => {
    if (list === "calender") {
      handleReadValues(new Date())
    } else {
      searchCall()
    }
  }, [list])

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
          const result = newUrl.replace(
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
    dispatch(actionCreators.setMeetingModal(false))
  }

  const handleCopyURL = (meeting_uuid: any) => {
    meetingSessions.meetingInvite(meeting_uuid).then((res: any) => {
      const result = copy(res.meeting_url)
      setClipboardState(result)
    })
    setTimeout(() => {
      setClipboardState(false)
    }, 3000)
  }

  const handleinvite = (data: any) => {
    setinvite(true)
    setMeetingInfos(data)
  }

  const handleMeetdata = (data: any) => {
    dispatch(actionCreators.setMeetingModal(true))
    setMeetData(data)
  }

  return (
    <div>
      {loader ? (
        <div
          className={`w-full h-[calc(100vh-122px)] flex justify-center items-center p-2 `}
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
      ) : (
        <>
          {list === "calender" ? (
            <div className="relative ">
              <div className="flex flex-row absolute mr-[15px] mt-6 right-0">
                <div
                  id="setcalender"
                  onClick={() => setList("calender")}
                  className={`${
                    list === "calender" ? "bg-[#5c67791e]" : ""
                  } mr-3 p-1 hover:bg-[#5c67791e] cursor-pointer`}
                >
                  <svg
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.95312 2.75C6.18516 2.75 6.375 2.93984 6.375 3.17188V4.4375H11.4375V3.17188C11.4375 2.93984 11.6273 2.75 11.8594 2.75C12.0914 2.75 12.2812 2.93984 12.2812 3.17188V4.4375H13.125C14.0558 4.4375 14.8125 5.19424 14.8125 6.125V6.96875V7.8125V14.5625C14.8125 15.4933 14.0558 16.25 13.125 16.25H4.6875C3.75674 16.25 3 15.4933 3 14.5625V7.8125V6.96875V6.125C3 5.19424 3.75674 4.4375 4.6875 4.4375H5.53125V3.17188C5.53125 2.93984 5.72109 2.75 5.95312 2.75ZM13.9688 7.8125H11.2266V9.71094H13.9688V7.8125ZM13.9688 10.5547H11.2266V12.6641H13.9688V10.5547ZM13.9688 13.5078H11.2266V15.4062H13.125C13.5917 15.4062 13.9688 15.0292 13.9688 14.5625V13.5078ZM10.3828 12.6641V10.5547H7.42969V12.6641H10.3828ZM7.42969 13.5078V15.4062H10.3828V13.5078H7.42969ZM6.58594 12.6641V10.5547H3.84375V12.6641H6.58594ZM3.84375 13.5078V14.5625C3.84375 15.0292 4.2208 15.4062 4.6875 15.4062H6.58594V13.5078H3.84375ZM3.84375 9.71094H6.58594V7.8125H3.84375V9.71094ZM7.42969 9.71094H10.3828V7.8125H7.42969V9.71094ZM13.125 5.28125H4.6875C4.2208 5.28125 3.84375 5.6583 3.84375 6.125V6.96875H13.9688V6.125C13.9688 5.6583 13.5917 5.28125 13.125 5.28125Z"
                      fill="#5C6779"
                    />
                  </svg>
                </div>
                <div
                  id="setlist"
                  onClick={() => setList("list")}
                  className={`p-1 hover:bg-[#5c67791e] cursor-pointer`}
                >
                  <svg
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.12097 5.24194V4.37097H3.99194V5.24194H3.12097ZM2.25 4.15323V5.45968C2.25 5.82167 2.54123 6.1129 2.90323 6.1129H4.20968C4.57167 6.1129 4.8629 5.82167 4.8629 5.45968V4.15323C4.8629 3.79123 4.57167 3.5 4.20968 3.5H2.90323C2.54123 3.5 2.25 3.79123 2.25 4.15323ZM6.60484 4.37097C6.36532 4.37097 6.16935 4.56694 6.16935 4.80645C6.16935 5.04597 6.36532 5.24194 6.60484 5.24194H15.3145C15.554 5.24194 15.75 5.04597 15.75 4.80645C15.75 4.56694 15.554 4.37097 15.3145 4.37097H6.60484ZM6.60484 8.72581C6.36532 8.72581 6.16935 8.92177 6.16935 9.16129C6.16935 9.40081 6.36532 9.59677 6.60484 9.59677H15.3145C15.554 9.59677 15.75 9.40081 15.75 9.16129C15.75 8.92177 15.554 8.72581 15.3145 8.72581H6.60484ZM6.60484 13.0806C6.36532 13.0806 6.16935 13.2766 6.16935 13.5161C6.16935 13.7556 6.36532 13.9516 6.60484 13.9516H15.3145C15.554 13.9516 15.75 13.7556 15.75 13.5161C15.75 13.2766 15.554 13.0806 15.3145 13.0806H6.60484ZM3.12097 8.72581H3.99194V9.59677H3.12097V8.72581ZM2.90323 7.85484C2.54123 7.85484 2.25 8.14607 2.25 8.50806V9.81452C2.25 10.1765 2.54123 10.4677 2.90323 10.4677H4.20968C4.57167 10.4677 4.8629 10.1765 4.8629 9.81452V8.50806C4.8629 8.14607 4.57167 7.85484 4.20968 7.85484H2.90323ZM3.12097 13.9516V13.0806H3.99194V13.9516H3.12097ZM2.25 12.8629V14.1694C2.25 14.5314 2.54123 14.8226 2.90323 14.8226H4.20968C4.57167 14.8226 4.8629 14.5314 4.8629 14.1694V12.8629C4.8629 12.5009 4.57167 12.2097 4.20968 12.2097H2.90323C2.54123 12.2097 2.25 12.5009 2.25 12.8629Z"
                      fill="#5C6779"
                    />
                  </svg>
                </div>
              </div>
              <Calendar
                views={["day", "week", "month"]}
                selectable
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                events={calenderData}
                onSelecting={(slot: any) => false}
                style={{ height: "100vh" }}
                startAccessor={(event: any) => {
                  return new Date(event.start);
                }}
                endAccessor={(event: any) => {
                  return new Date(event.end);
                }}
                onSelectEvent={(event) => handleMeetdata(event)}
                onSelectSlot={(e: any) => onDateClick(e)}
              />
            </div>
          ) : (
            <div>
              <div className="flex flex-col h-[calc(100vh-122px)] overflow-y-auto overflow-x-hidden relative">
                <div className="grid grid-flow-col mb-4 px-4 mt-6 ">
                  <div className="text-[#404041] text-[18px] pl-1 font-bold">
                    All Meetings
                  </div>
                  <div className="flex flex-row gap-3">
                    <div className="rounded-[8px] border-[1px] border-[#B1B1B1] box-border py-2 px-3 outline-none w-[150px] flex">
                      <svg
                        id="setFirstCalender"
                        width="20"
                        height="20"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2.5 mt-[1px] cursor-pointer "
                        onClick={() => setFirstCalender(!firstCalender)}
                      >
                        <path
                          d="M5.95312 2.25C6.18516 2.25 6.375 2.43984 6.375 2.67188V3.9375H11.4375V2.67188C11.4375 2.43984 11.6273 2.25 11.8594 2.25C12.0914 2.25 12.2812 2.43984 12.2812 2.67188V3.9375H13.125C14.0558 3.9375 14.8125 4.69424 14.8125 5.625V6.46875V7.3125V14.0625C14.8125 14.9933 14.0558 15.75 13.125 15.75H4.6875C3.75674 15.75 3 14.9933 3 14.0625V7.3125V6.46875V5.625C3 4.69424 3.75674 3.9375 4.6875 3.9375H5.53125V2.67188C5.53125 2.43984 5.72109 2.25 5.95312 2.25ZM13.9688 7.3125H11.2266V9.21094H13.9688V7.3125ZM13.9688 10.0547H11.2266V12.1641H13.9688V10.0547ZM13.9688 13.0078H11.2266V14.9062H13.125C13.5917 14.9062 13.9688 14.5292 13.9688 14.0625V13.0078ZM10.3828 12.1641V10.0547H7.42969V12.1641H10.3828ZM7.42969 13.0078V14.9062H10.3828V13.0078H7.42969ZM6.58594 12.1641V10.0547H3.84375V12.1641H6.58594ZM3.84375 13.0078V14.0625C3.84375 14.5292 4.2208 14.9062 4.6875 14.9062H6.58594V13.0078H3.84375ZM3.84375 9.21094H6.58594V7.3125H3.84375V9.21094ZM7.42969 9.21094H10.3828V7.3125H7.42969V9.21094ZM13.125 4.78125H4.6875C4.2208 4.78125 3.84375 5.1583 3.84375 5.625V6.46875H13.9688V5.625C13.9688 5.1583 13.5917 4.78125 13.125 4.78125Z"
                          fill="#5C6779"
                        />
                      </svg>

                      <DatePicker
                        id="setFirstCalenderDate"
                        className="w-24 outline-none"
                        open={firstCalender}
                        onClickOutside={() => setFirstCalender(false)}
                        readOnly
                        minDate={new Date()}
                        selected={search?.start}
                        onChange={(e: any) => {
                          handleSearch(e, "start");
                        }}
                        placeholderText=""
                      />
                    </div>
                    <div className="rounded-[8px] border-[1px] border-[#B1B1B1] box-border py-2 px-3 outline-none w-[150px] flex">
                      <svg
                        id="setSecondCalender"
                        width="20"
                        height="20"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2.5 mt-[1px] cursor-pointer "
                        onClick={() => setSecondCalender(!firstCalender)}
                      >
                        <path
                          d="M5.95312 2.25C6.18516 2.25 6.375 2.43984 6.375 2.67188V3.9375H11.4375V2.67188C11.4375 2.43984 11.6273 2.25 11.8594 2.25C12.0914 2.25 12.2812 2.43984 12.2812 2.67188V3.9375H13.125C14.0558 3.9375 14.8125 4.69424 14.8125 5.625V6.46875V7.3125V14.0625C14.8125 14.9933 14.0558 15.75 13.125 15.75H4.6875C3.75674 15.75 3 14.9933 3 14.0625V7.3125V6.46875V5.625C3 4.69424 3.75674 3.9375 4.6875 3.9375H5.53125V2.67188C5.53125 2.43984 5.72109 2.25 5.95312 2.25ZM13.9688 7.3125H11.2266V9.21094H13.9688V7.3125ZM13.9688 10.0547H11.2266V12.1641H13.9688V10.0547ZM13.9688 13.0078H11.2266V14.9062H13.125C13.5917 14.9062 13.9688 14.5292 13.9688 14.0625V13.0078ZM10.3828 12.1641V10.0547H7.42969V12.1641H10.3828ZM7.42969 13.0078V14.9062H10.3828V13.0078H7.42969ZM6.58594 12.1641V10.0547H3.84375V12.1641H6.58594ZM3.84375 13.0078V14.0625C3.84375 14.5292 4.2208 14.9062 4.6875 14.9062H6.58594V13.0078H3.84375ZM3.84375 9.21094H6.58594V7.3125H3.84375V9.21094ZM7.42969 9.21094H10.3828V7.3125H7.42969V9.21094ZM13.125 4.78125H4.6875C4.2208 4.78125 3.84375 5.1583 3.84375 5.625V6.46875H13.9688V5.625C13.9688 5.1583 13.5917 4.78125 13.125 4.78125Z"
                          fill="#5C6779"
                        />
                      </svg>
                      <DatePicker
                        id="setSecondCalenderDate"
                        className="w-24 outline-none"
                        open={secondCalender}
                        onClickOutside={() => setSecondCalender(false)}
                        readOnly
                        minDate={new Date()}
                        selected={search?.end}
                        onChange={(e: any) => {
                          handleSearch(e, "end");
                        }}
                        placeholderText=""
                      />
                    </div>
                    <div
                      id="searchCall"
                      onClick={searchCall}
                      className={` ${
                        search.end >= search.start
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      } h-[44px] w-[100px] px-1 rounded-[8px] border-[1px] border-[#B1B1B1] bg-[#ECECEC] flex flex-row justify-center items-center`}
                    >
                      <div
                        className={` ${
                          search.end >= search.start
                            ? "text-[#504e4e]"
                            : "text-[#B1B1B1]"
                        } mt-[2px]`}
                      >
                        Submit
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end ">
                    <div
                      id="setListcalender"
                      onClick={() => setList("calender")}
                      className={`mr-3 p-1 hover:bg-[#5c67791e] mb-3 cursor-pointer`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.95312 2.25C6.18516 2.25 6.375 2.43984 6.375 2.67188V3.9375H11.4375V2.67188C11.4375 2.43984 11.6273 2.25 11.8594 2.25C12.0914 2.25 12.2812 2.43984 12.2812 2.67188V3.9375H13.125C14.0558 3.9375 14.8125 4.69424 14.8125 5.625V6.46875V7.3125V14.0625C14.8125 14.9933 14.0558 15.75 13.125 15.75H4.6875C3.75674 15.75 3 14.9933 3 14.0625V7.3125V6.46875V5.625C3 4.69424 3.75674 3.9375 4.6875 3.9375H5.53125V2.67188C5.53125 2.43984 5.72109 2.25 5.95312 2.25ZM13.9688 7.3125H11.2266V9.21094H13.9688V7.3125ZM13.9688 10.0547H11.2266V12.1641H13.9688V10.0547ZM13.9688 13.0078H11.2266V14.9062H13.125C13.5917 14.9062 13.9688 14.5292 13.9688 14.0625V13.0078ZM10.3828 12.1641V10.0547H7.42969V12.1641H10.3828ZM7.42969 13.0078V14.9062H10.3828V13.0078H7.42969ZM6.58594 12.1641V10.0547H3.84375V12.1641H6.58594ZM3.84375 13.0078V14.0625C3.84375 14.5292 4.2208 14.9062 4.6875 14.9062H6.58594V13.0078H3.84375ZM3.84375 9.21094H6.58594V7.3125H3.84375V9.21094ZM7.42969 9.21094H10.3828V7.3125H7.42969V9.21094ZM13.125 4.78125H4.6875C4.2208 4.78125 3.84375 5.1583 3.84375 5.625V6.46875H13.9688V5.625C13.9688 5.1583 13.5917 4.78125 13.125 4.78125Z"
                          fill="#5C6779"
                        />
                      </svg>
                    </div>
                    <div
                      id="setListlist"
                      onClick={() => setList("list")}
                      className={`p-1 bg-[#5c67791e] hover:bg-[#5c67791e] mb-4 mt-1 cursor-pointer`}
                    >
                      <svg
                        width="14"
                        height="12"
                        viewBox="0 0 14 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.12097 1.74194V0.870968H1.99194V1.74194H1.12097ZM0.25 0.653226V1.95968C0.25 2.32167 0.54123 2.6129 0.903226 2.6129H2.20968C2.57167 2.6129 2.8629 2.32167 2.8629 1.95968V0.653226C2.8629 0.29123 2.57167 0 2.20968 0H0.903226C0.54123 0 0.25 0.29123 0.25 0.653226ZM4.60484 0.870968C4.36532 0.870968 4.16935 1.06694 4.16935 1.30645C4.16935 1.54597 4.36532 1.74194 4.60484 1.74194H13.3145C13.554 1.74194 13.75 1.54597 13.75 1.30645C13.75 1.06694 13.554 0.870968 13.3145 0.870968H4.60484ZM4.60484 5.22581C4.36532 5.22581 4.16935 5.42177 4.16935 5.66129C4.16935 5.90081 4.36532 6.09677 4.60484 6.09677H13.3145C13.554 6.09677 13.75 5.90081 13.75 5.66129C13.75 5.42177 13.554 5.22581 13.3145 5.22581H4.60484ZM4.60484 9.58065C4.36532 9.58065 4.16935 9.77661 4.16935 10.0161C4.16935 10.2556 4.36532 10.4516 4.60484 10.4516H13.3145C13.554 10.4516 13.75 10.2556 13.75 10.0161C13.75 9.77661 13.554 9.58065 13.3145 9.58065H4.60484ZM1.12097 5.22581H1.99194V6.09677H1.12097V5.22581ZM0.903226 4.35484C0.54123 4.35484 0.25 4.64607 0.25 5.00806V6.31452C0.25 6.67651 0.54123 6.96774 0.903226 6.96774H2.20968C2.57167 6.96774 2.8629 6.67651 2.8629 6.31452V5.00806C2.8629 4.64607 2.57167 4.35484 2.20968 4.35484H0.903226ZM1.12097 10.4516V9.58065H1.99194V10.4516H1.12097ZM0.25 9.3629V10.6694C0.25 11.0314 0.54123 11.3226 0.903226 11.3226H2.20968C2.57167 11.3226 2.8629 11.0314 2.8629 10.6694V9.3629C2.8629 9.00091 2.57167 8.70968 2.20968 8.70968H0.903226C0.54123 8.70968 0.25 9.00091 0.25 9.3629Z"
                          fill="#5C6779"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {sortedDate?.length === 0 ? (
                  <div className=" text-[#767676] text-xl flex flex-col justify-center items-center h-[100%]">
                    <img src={noMeeting} className="" alt="" />
                    <div className="text-[#747474] py-2">
                      You have no upcoming meetings
                    </div>
                  </div>
                ) : (
                  sortedDate
                    .filter((items: any) => {
                      let formatted = moment(
                        items.title,
                        "MM-DD-YYYY HH:mm:ss A"
                      ).format("MMMM DD YYYY");

                      return list === "list"
                        ? true
                        : displayFilter
                        ? formatted.includes(calenderDate)
                        : true;
                    })

                    .map((item: any, index: number) => {
                      let y = new Date().setDate(new Date().getDate() + 1);
                      return (
                        <FadeIn>
                          <div id="sortedDate" className="mx-4 h-full">
                            {item.list.length > 0 ? (
                              item.title ===
                              moment(new Date()).format("MM.DD.YYYY") ? (
                                <div className="h-[24px] rounded-[50px] bg-[#F1F1F1] text-[#404041] text-[14px] font-semibold px-4 flex items-center ">
                                  {t("Dashboard.Today")}
                                </div>
                              ) : item.title ===
                                moment(y).format("MM.DD.YYYY") ? (
                                <div className="h-[24px] rounded-[50px] bg-[#F1F1F1] text-[#404041] text-[14px] font-semibold px-4 flex items-center ">
                                  {t("Dashboard.Tomorrow")}
                                </div>
                              ) : (
                                <div className="h-[24px] rounded-[50px] bg-[#F1F1F1] text-[#404041] text-[14px] font-semibold px-4 flex items-center ">
                                  {moment(
                                    item.title,
                                    "MM-DD-YYYY HH:mm:ss A"
                                  ).format("MMMM DD YYYY")}
                                </div>
                              )
                            ) : null}

                            {item.list.map((data: any) => {
                              let [hours, minutes] = [
                                (data.duration / 3600) | 0,
                                ((data.duration % 3600) / 60) | 0,
                              ];
                              return (
                                <div className="h-fit w-full p-3 flex flex-col max-h-[115px] group hover:bg-[#FEEDE8]">
                                  {dates ===
                                    moment(
                                      new Date(data.start_date_time * 1000)
                                    ).format("MM.DD.YYYY") &&
                                  Math.floor(
                                    (new Date(data.start_date_time).getTime() -
                                      times) /
                                      60
                                  ) < 60 ? (
                                    <div className="italic h-[18px] w-fit px-3 text-[14px] font-semibold text-[#F65E1D] bg-[#FEEDE8] rounded-br-[50px]">
                                      {Math.floor(
                                        (new Date(
                                          data.start_date_time
                                        ).getTime() -
                                          times) /
                                          60
                                      ) > 0 ||
                                      Math.floor(
                                        (new Date(
                                          data.start_date_time
                                        ).getTime() -
                                          times) /
                                          60
                                      ) === 0 ? (
                                        <>
                                          <ScheduleTimer
                                            start_date_time={
                                              data.start_date_time
                                            }
                                          />
                                        </>
                                      ) : (
                                        <div>
                                          {t("Dashboard.MeetinginProgress")}
                                        </div>
                                      )}
                                    </div>
                                  ) : null}
                                  <div className="px-3 flex justify-between">
                                    <div className="text-[18px] font-medium text-[#404041] capitalize ">
                                      {data.name}
                                    </div>
                                    <div className="text-[12px] font-normal text-right text-[#A7A9AB] ">
                                      {hours}hr {minutes}min
                                    </div>
                                  </div>
                                  <div className="px-3 break-all text-[16px] text-[#909091]">
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
                                    <div className=" absolute right-10 w-[216px] grid grid-flow-col rounded-[7px] py-1 pl-2 gap-3 bg-[#FFFFFF] items-center invisible group-hover:visible -mt-[38px] ">
                                      <Tooltip
                                        content={"Delete"}
                                        direction="top"
                                        onclick={true}
                                      >
                                        <div
                                          id="handleDeleteCase"
                                          onClick={() => handleDeleteCase(data)}
                                          className="hover:bg-[#0000000a] pl-1 py-1 cursor-pointer"
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
                                        content={
                                          clipboardState === false
                                            ? "Copy"
                                            : "Copied"
                                        }
                                        direction="top"
                                        onclick={true}
                                      >
                                        <div
                                          id="handleCopyURL"
                                          onClick={() =>
                                            handleCopyURL(data.meeting_uuid)
                                          }
                                          className="hover:bg-[#0000000a] pl-1 py-1 cursor-pointer"
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
                                          id="handleEdit"
                                          onClick={() => handleEditCase(data)}
                                          className="hover:bg-[#0000000a] pl-1 py-1 cursor-pointer"
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
                                        content={"Invite"}
                                        direction="top"
                                        onclick={true}
                                      >
                                        <div
                                          id="handleinvite"
                                          onClick={() => handleinvite(data)}
                                          className="hover:bg-[#0000000a] pl-1 py-1 cursor-pointer"
                                        >
                                          <svg
                                            width="18"
                                            height="19"
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M6.75 4.67969C7.04547 4.67969 7.33806 4.73789 7.61104 4.85096C7.88402 4.96403 8.13206 5.12977 8.34099 5.3387C8.54992 5.54763 8.71566 5.79567 8.82873 6.06865C8.9418 6.34163 9 6.63421 9 6.92969C9 7.22516 8.9418 7.51774 8.82873 7.79073C8.71566 8.06371 8.54992 8.31175 8.34099 8.52068C8.13206 8.72961 7.88402 8.89534 7.61104 9.00842C7.33806 9.12149 7.04547 9.17969 6.75 9.17969C6.45453 9.17969 6.16194 9.12149 5.88896 9.00842C5.61598 8.89534 5.36794 8.72961 5.15901 8.52068C4.95008 8.31175 4.78434 8.06371 4.67127 7.79073C4.5582 7.51774 4.5 7.22516 4.5 6.92969C4.5 6.63421 4.5582 6.34163 4.67127 6.06865C4.78434 5.79567 4.95008 5.54763 5.15901 5.3387C5.36794 5.12977 5.61598 4.96403 5.88896 4.85096C6.16194 4.73789 6.45453 4.67969 6.75 4.67969ZM6.75 9.92969C7.54565 9.92969 8.30871 9.61362 8.87132 9.05101C9.43393 8.4884 9.75 7.72534 9.75 6.92969C9.75 6.13404 9.43393 5.37098 8.87132 4.80837C8.30871 4.24576 7.54565 3.92969 6.75 3.92969C5.95435 3.92969 5.19129 4.24576 4.62868 4.80837C4.06607 5.37098 3.75 6.13404 3.75 6.92969C3.75 7.72534 4.06607 8.4884 4.62868 9.05101C5.19129 9.61362 5.95435 9.92969 6.75 9.92969ZM5.67891 11.8047H7.82109C9.69609 11.8047 11.2195 13.3117 11.25 15.1797H2.25C2.27812 13.3117 3.80156 11.8047 5.67891 11.8047ZM5.67891 11.0547C3.37031 11.0547 1.5 12.925 1.5 15.2336C1.5 15.618 1.81172 15.9297 2.19609 15.9297H11.3039C11.6883 15.9297 12 15.618 12 15.2336C12 12.925 10.1297 11.0547 7.82109 11.0547H5.67891ZM13.5 11.0547C13.5 11.2609 13.6687 11.4297 13.875 11.4297C14.0813 11.4297 14.25 11.2609 14.25 11.0547V9.17969H16.125C16.3313 9.17969 16.5 9.01094 16.5 8.80469C16.5 8.59844 16.3313 8.42969 16.125 8.42969H14.25V6.55469C14.25 6.34844 14.0813 6.17969 13.875 6.17969C13.6687 6.17969 13.5 6.34844 13.5 6.55469V8.42969H11.625C11.4187 8.42969 11.25 8.59844 11.25 8.80469C11.25 9.01094 11.4187 9.17969 11.625 9.17969H13.5V11.0547Z"
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
                                          id="start"
                                          onClick={() =>
                                            handleClick(
                                              "START",
                                              data,
                                              data.uuid,
                                              data.meeting_id || data.id,
                                              data.password
                                            )
                                          }
                                          className="hover:bg-[#0000000a] pl-1 py-1 cursor-pointer"
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
                              );
                            })}
                          </div>
                        </FadeIn>
                      );
                    })
                )}
              </div>
            </div>
          )}
        </>
      )}
      {deleteModalOn && (
        <DeleteModal
          readDatas={readDatas}
          handleReadValues={handleReadValues}
          setRecMeet={setRecMeet}
          setDeleteModalOn={setDeleteModalOn}
          recMeet={recMeet}
          AllDeleteData={AllDeleteData}
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

      {invite && (
        <InviteModal
          setMeetingModal={setinvite}
          data={meetingInfos}
          setModal={setModal}
        />
      )}

      {modal && <SafariPopUpModal setclose={setModalclose} />}

      {meetingModal && (
        <MeetingModal
          data={meetData}
          handleDeleteCase={handleDeleteCase}
          handleEditCase={handleEditCase}
          setModal={setModal}
        />
      )}
    </div>
  );
}

export default UpcomingMeetings
