import moment from "moment"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ScreenLoader from "../../../../../atom/ScreenLoader/screenLoader"
import { actionCreators } from "../../../../../store"
import { t } from "i18next"
import "../../../../../App.css"
import DatePicker from "react-datepicker"
import DropDown from "../../../../../atom/DropDown/dropDown"
import FadeIn from "react-fade-in/lib/FadeIn"
import noMeeting from "../../../../../constants/images/noMeeting.jpg"
import Notification from "../Notification/Notification"

function PastMeetingPage(props: any) {
  const dispatch = useDispatch()
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const [sortedDate, setSortedDate] = useState([])
  const [sortedList, setSortedList] = useState([])
  const [search, setSearch] = useState<any>({
    start: new Date(),
    end: new Date(),
  })
  const [loader, setloader] = useState<any>(false)
  const [listAll, setListAll] = useState(false)
  const [monthOn, setMonthOn] = useState(false)
  const [dateOn, setDateOn] = useState(false)
  const [firstCalender, setFirstCalender] = useState(false)
  const [secondCalender, setSecondCalender] = useState(false)
  dispatch(actionCreators.setProgress(false))
  dispatch(actionCreators.setEditSingleMeet(false))
  dispatch(actionCreators.setEditSingleRecMeet(false))
  dispatch(actionCreators.setFlagEditMeetingTime(false))
  dispatch(actionCreators.setEditScheduleMeet(false))
  dispatch(actionCreators.setAllRecurrenceScheduleMeet(false))

  const monthNames = [
    { name: "January", value: "January" },
    { name: "February", value: "February" },
    { name: "March", value: "March" },
    { name: "April", value: "April" },
    { name: "May", value: "May" },
    { name: "June", value: "June" },
    { name: "July", value: "July" },
    { name: "August", value: "August" },
    { name: "September", value: "September" },
    { name: "October", value: "October" },
    { name: "November", value: "November" },
    { name: "December", value: "December" },
  ]

  useEffect(() => {
    meetings(0)
  }, [])

  const getList = async () => {
    setloader(true)
    let end = Math.floor(moment().valueOf() / 1000)
    let start = Math.floor(
      moment().startOf("month").subtract(12, "months").valueOf() / 1000
    )
    await meetingSession
      .completedMettings({ start_date_time: start, end_date_time: end })
      .then((res: any) => {
        setSortedDate(res)
        setloader(false)
      })
  }

  const handleSearch = (e: any, type: any) => {
    setSearch((prevSearch: any) => ({ ...prevSearch, [type]: e }))
  }

  const convertToEpochTime = (selectedDate: any) => {
    const currentDate = new Date()
    const selectedDateTimeStart = new Date(selectedDate.start)
    const selectedDateTimeEnd = new Date(selectedDate.end)

    const startTime = selectedDateTimeStart.setHours(0, 0, 0, 0)
    const endTime =
      selectedDateTimeEnd.toDateString() === currentDate.toDateString()
        ? currentDate.getTime()
        : selectedDateTimeEnd.setHours(23, 59, 59, 999)
    return {
      startTime: new Date(startTime).getTime() / 1000,
      endTime: new Date(endTime).getTime() / 1000,
    }
  }

  const [titles, setTitles] = useState(() => {
    const current_month = new Date().getMonth()
    const temp_months = [...monthNames]
    const list = temp_months.concat(temp_months.splice(0, current_month))
    list.pop()
    list.shift()
    list.reverse()
    list.unshift(
      { name: "Recent", value: "Recent" },
      { name: "Earlier this month", value: "Earlier this month" },
      { name: "Last Month", value: "Last Month" }
    )
    return list
  })
  const [month, setMonth] = useState(titles[0])

  const months: any = []

  const [open, setOpen] = useState(-1)

  const meetings = async (index: any) => {
    setSortedDate([])
    setOpen(open === index ? -1 : index)
    setloader(true)
    let start: any
    let end: any
    // switch (index) {
    //   case 0:
    //     end = Math.floor(moment().valueOf() / 1000);
    //     start = Math.floor(moment().startOf("day").valueOf() / 1000);
    //     break;
    //   case 1:
    //     end = Math.floor(moment().startOf("day").valueOf() / 1000);
    //     start = Math.floor(moment().startOf("month").valueOf() / 1000);
    //     break;
    //   default:
    //     end = Math.floor(
    //       moment()
    //         .startOf("month")
    //         .subtract(index - 2, "months")
    //         .valueOf() / 1000
    //     );
    //     start = Math.floor(
    //       moment()
    //         .startOf("month")
    //         .subtract(index - 1, "months")
    //         .valueOf() / 1000
    //     );
    //     break;
    // }
    if (index === 0) {
      end = Math.floor(moment().valueOf() / 1000)
      start = Math.floor(moment().startOf("day").valueOf() / 1000)
    } else {
      const { startTime, endTime } = convertToEpochTime(search)
      end = endTime
      start = startTime
    }
    if (end < start) {
      dispatch(
        actionCreators.setNotification({
          content: "Filter start time should be less than end time.",
          type: "error",
        })
      )
      setloader(false)
    } else {
      await meetingSession
        .completedMeetings({ start_date_time: start, end_date_time: end })
        .then((res: any) => {
          setSortedDate(res)
          setloader(false)
        })
        .catch((e: any) => {
          setloader(false)
        })
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-122px)] px-7 py-2">
      <div className="flex justify-center items-center  mb-1 px-4 mt-6 ">
        <div className="flex flex-row gap-3 justify-end">
          <div className="rounded-[8px] border-[1px] border-[#B1B1B1] box-border py-2 px-3 outline-none w-[150px] flex">
            <svg
              id="pastFirstCalender"
              width="20"
              height="20"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2.5 cursor-pointer "
              onClick={() => setFirstCalender(!firstCalender)}
            >
              <path
                d="M5.95312 2.25C6.18516 2.25 6.375 2.43984 6.375 2.67188V3.9375H11.4375V2.67188C11.4375 2.43984 11.6273 2.25 11.8594 2.25C12.0914 2.25 12.2812 2.43984 12.2812 2.67188V3.9375H13.125C14.0558 3.9375 14.8125 4.69424 14.8125 5.625V6.46875V7.3125V14.0625C14.8125 14.9933 14.0558 15.75 13.125 15.75H4.6875C3.75674 15.75 3 14.9933 3 14.0625V7.3125V6.46875V5.625C3 4.69424 3.75674 3.9375 4.6875 3.9375H5.53125V2.67188C5.53125 2.43984 5.72109 2.25 5.95312 2.25ZM13.9688 7.3125H11.2266V9.21094H13.9688V7.3125ZM13.9688 10.0547H11.2266V12.1641H13.9688V10.0547ZM13.9688 13.0078H11.2266V14.9062H13.125C13.5917 14.9062 13.9688 14.5292 13.9688 14.0625V13.0078ZM10.3828 12.1641V10.0547H7.42969V12.1641H10.3828ZM7.42969 13.0078V14.9062H10.3828V13.0078H7.42969ZM6.58594 12.1641V10.0547H3.84375V12.1641H6.58594ZM3.84375 13.0078V14.0625C3.84375 14.5292 4.2208 14.9062 4.6875 14.9062H6.58594V13.0078H3.84375ZM3.84375 9.21094H6.58594V7.3125H3.84375V9.21094ZM7.42969 9.21094H10.3828V7.3125H7.42969V9.21094ZM13.125 4.78125H4.6875C4.2208 4.78125 3.84375 5.1583 3.84375 5.625V6.46875H13.9688V5.625C13.9688 5.1583 13.5917 4.78125 13.125 4.78125Z"
                fill="#5C6779"
              />
            </svg>
            <DatePicker
              id="pastSetFirstCalender"
              className="w-24 outline-none"
              open={firstCalender}
              onClickOutside={() => setFirstCalender(false)}
              readOnly
              maxDate={new Date()}
              selected={search?.start}
              onChange={(e: any) => {
                handleSearch(e, "start");
              }}
              placeholderText=""
            />
          </div>
          <div className="rounded-[8px] border-[1px] border-[#B1B1B1] box-border py-2 px-3 outline-none w-[150px] flex">
            <svg
              id="pastSecondCalender"
              width="20"
              height="20"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2.5 cursor-pointer "
              onClick={() => setSecondCalender(!firstCalender)}
            >
              <path
                d="M5.95312 2.25C6.18516 2.25 6.375 2.43984 6.375 2.67188V3.9375H11.4375V2.67188C11.4375 2.43984 11.6273 2.25 11.8594 2.25C12.0914 2.25 12.2812 2.43984 12.2812 2.67188V3.9375H13.125C14.0558 3.9375 14.8125 4.69424 14.8125 5.625V6.46875V7.3125V14.0625C14.8125 14.9933 14.0558 15.75 13.125 15.75H4.6875C3.75674 15.75 3 14.9933 3 14.0625V7.3125V6.46875V5.625C3 4.69424 3.75674 3.9375 4.6875 3.9375H5.53125V2.67188C5.53125 2.43984 5.72109 2.25 5.95312 2.25ZM13.9688 7.3125H11.2266V9.21094H13.9688V7.3125ZM13.9688 10.0547H11.2266V12.1641H13.9688V10.0547ZM13.9688 13.0078H11.2266V14.9062H13.125C13.5917 14.9062 13.9688 14.5292 13.9688 14.0625V13.0078ZM10.3828 12.1641V10.0547H7.42969V12.1641H10.3828ZM7.42969 13.0078V14.9062H10.3828V13.0078H7.42969ZM6.58594 12.1641V10.0547H3.84375V12.1641H6.58594ZM3.84375 13.0078V14.0625C3.84375 14.5292 4.2208 14.9062 4.6875 14.9062H6.58594V13.0078H3.84375ZM3.84375 9.21094H6.58594V7.3125H3.84375V9.21094ZM7.42969 9.21094H10.3828V7.3125H7.42969V9.21094ZM13.125 4.78125H4.6875C4.2208 4.78125 3.84375 5.1583 3.84375 5.625V6.46875H13.9688V5.625C13.9688 5.1583 13.5917 4.78125 13.125 4.78125Z"
                fill="#5C6779"
              />
            </svg>

            <DatePicker
              id="pastSetSecondCalender"
              className="w-24 outline-none"
              open={secondCalender}
              onClickOutside={() => setSecondCalender(false)}
              readOnly
              maxDate={new Date()}
              selected={search?.end}
              onChange={(e: any) => {
                handleSearch(e, "end");
              }}
              placeholderText=""
            />
          </div>
          <div
            id="pastSubmit"
            onClick={() => meetings(1)}
            className="cursor-pointer h-[44px] w-[100px] px-1 rounded-[8px] border-[1px] border-[#B1B1B1] bg-[#ECECEC] flex flex-row justify-center items-center"
          >
            <div className="mt-[2px] text-[#293241]">Submit</div>
          </div>
        </div>
        {/* <div className="flex justify-end mr-4">
          <DropDown
            value={month}
            options={titles}
            onChange={(e: any) => {
              setMonth(e.target.value);
              const index = titles.findIndex(
                (month) => month.value === e.target.value
              );
              
              meetings(index);
            }}
            restClass={
              "rounded-[8px] border-[1px] cursor-pointer text-[#767676] border-[#B1B1B1] h-[44px] box-border py-2 px-3 outline-none w-[160px] flex"
            }
          />
        </div> */}
      </div>
      <div className="overflow-x-hidden overflow-y-auto h-[calc(100vh-300px)]">
        <FadeIn>
          {loader ? (
            <div
              className={`h-[calc(100vh-320px)] w-full text-[#767676] text-xl flex flex-col justify-center items-center `}
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
          ) : sortedDate.length === 0 ? (
            <div className="h-[calc(100vh-320px)] w-full text-[#767676] text-xl flex flex-col justify-center items-center">
              <img src={noMeeting} className="" alt="" />
              <div className="text-[#747474] py-2">
                You have no past meetings
              </div>
            </div>
          ) : (
            <table className="w-full mt-3">
              <thead className="tableheadfix h-[44px] rounded-[10px]">
                <tr className="bg-[#EBEDEF] w-full text-left rounded-[10px]">
                  <th className="px-6 font-bold text-[#293241]">Meeting ID</th>
                  <th className="px-6 font-bold text-[#293241]">Topic</th>
                  <th className="px-6 font-bold text-[#293241]">Start Time</th>
                  <th className="px-6 font-bold text-[#293241]">End Time</th>
                </tr>
              </thead>
              <tbody className="h-[calc(100vh-820px)] overflow-y-scroll overflow-x-hidden ">
                {sortedDate.map((node: any, index: any) => {
                  const rowColorClass = index % 2 !== 0 ? "bg-[#F7F7F8]" : "";
                  const StartDate = new Date(
                    node.start_date_time * 1000
                  ).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  });
                  const EndDate = new Date(
                    node.end_date_time * 1000
                  ).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  });

                  return (
                    <tr
                      className={` ${rowColorClass} h-[44px] w-full text-left`}
                    >
                      <td className="px-6 text-[#293241]">{node.meeting_id}</td>
                      <td className="px-6 text-[#293241]"> {node.name} </td>
                      <td className="px-6 text-[#293241]">{StartDate}</td>
                      <td className="px-6 text-[#293241]"> {EndDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </FadeIn>
      </div>
    </div>
  );
}

export default PastMeetingPage
