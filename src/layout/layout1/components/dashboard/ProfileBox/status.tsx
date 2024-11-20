import React, { useEffect, useRef, useState } from "react"
import DropDown from "../../../../../atom/DropDown/dropDown"
import CalenderIcon from "../Chat/Icons/calenderIcon"
import BusIcon from "../Chat/Icons/busIcon"
import SickIcon from "../Chat/Icons/sickIcon"
import HomeIcon from "../Chat/Icons/homeIcon"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import DatePicker from "react-datepicker"
import { t } from "i18next"
import TimePicker from "rc-time-picker"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import { getYear } from "date-fns"
import SearchableDropdown from "../../../../../atom/DropDown/searchableDropdown"
import { CustomTime } from "../../settings/General/generalSettings"
import { Menu } from "@headlessui/react"
import { CLOCK_ICON } from "../../../../../utils/SVG/svgsRestHere"
const convertEpochToNormalTime = (epoch: any) => {
  const t = new Date()
  const epocT = new Date(epoch)

  const currentDate = new Date().toLocaleDateString()
  const epochDate = new Date(epoch).toLocaleDateString()

  if (epochDate === currentDate) {
    const formatted =
      ("0" + epocT.getHours()).slice(-2) +
      ":" +
      ("0" + epocT.getMinutes()).slice(-2)
    return formatted === "23:59" ? "Today" : formatted
  } else {
    const ctDate = new Date()
    const inputDate = new Date(epoch) //@ts-ignore
    const res = Math.abs(ctDate - inputDate) / 1000

    const difference = Math.floor(res / 86000)
    return difference === 1 ? `${difference} day` : `${difference} days`
  }
}

const calculateEpochTime = (hours = 0, minutes = 0, days = 0, weeks = 0) => {
  const millisecondsPerSecond = 1000
  const secondsPerMinute = 60
  const minutesPerHour = 60
  const hoursPerDay = 24
  const daysPerWeek = 7

  // Get the current time in milliseconds since the epoch
  const currentTime = new Date().getTime()

  // Calculate the time offset in milliseconds
  const timeOffset =
    (hours * minutesPerHour + minutes) *
      secondsPerMinute *
      millisecondsPerSecond +
    (days * hoursPerDay + weeks * daysPerWeek) *
      hoursPerDay *
      minutesPerHour *
      secondsPerMinute *
      millisecondsPerSecond

  // Calculate the epoch time for the future moment
  const futureEpochTime = currentTime + timeOffset

  return futureEpochTime
}

const tonightTime = () => {
  const currentDate = new Date()
  const midnightDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
    0,
    0,
    0,
    0
  )
  const lastMinuteOfToday = new Date(midnightDate.getTime() - 1000)
  const epochTime = Math.floor(lastMinuteOfToday.getTime())
  return epochTime
}

const Status = () => {
  const [status, setStatus]: any = useState({
    name: "",
    time: tonightTime(),
    emoji: "🗓️",
    duration: "Today",
  })
  const [drop, setDrop] = useState(false)
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const [chosenEmoji, setChosenEmoji] = useState<any>("🗓️")
  const [timeDropdown, setTimeDropdown] = useState<boolean>(false)
  const [customModal, setCutomModal] = useState<boolean>(false)
  const [animate, setAnimate] = useState(false)
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const [calender1, setCalender1] = useState(false)
  const buttonRef = useRef<any>(null)
  const [date, setDate] = useState<any>({
    start: new Date(tonightDate(new Date().getTime())).getTime(),
    end: new Date().getTime(),
  })
  const dispatch = useDispatch()
  const timeValues = [
    {
      name: "00:30 hour",
      value: 30,
    },
    { name: "01:00 hour", value: 60 },
    { name: "02:00 hours", value: 120 },
    { name: "04:00 hours", value: 240 },
    { name: "Today", value: "today" },
    // { name: "Custom", value: "Custom" },
  ]

  const defaultStatus = [
    {
      name: "In a meeting",
      value: "01:00 hour",
      time: 60,
      emoji: "🗓️",
      duration: "01:00 hour",
      default: true,
      delete_flag: false,
    },
    {
      name: "Outside for lunch",
      value: "00:30 hour",
      time: 30,
      duration: "00:30 hour",
      emoji: "🍜",
      default: true,
      delete_flag: false,
    },
    {
      name: "On Sick Leave",
      value: "Today",
      time: 1440,
      duration: "Today",
      emoji: "🤒",
      default: true,
      delete_flag: false,
    },
    {
      name: "Working from Home",
      value: "Today",
      time: 1440,
      duration: "Today",
      emoji: "🏡",
      default: true,
      delete_flag: false,
    },
  ]

  const [statusValues, setStatusValues] = useState([...defaultStatus])

  // const convertEpochToNormalTime = (epoch: number) => {
  //   const currentDate = new Date()
  //   const inputDate = new Date(epoch * 1000) // Multiply by 1000 to convert seconds to milliseconds

  //   // Check if the date is the current date
  //   const isCurrentDate =
  //     currentDate.toDateString() === inputDate.toDateString()

  //   if (isCurrentDate) {
  //     // If it's the current date, format the time
  //     const formatted =
  //       ("0" + inputDate.getHours()).slice(-2) +
  //       ":" +
  //       ("0" + inputDate.getMinutes()).slice(-2)
  //     return formatted
  //   } else {
  //     // If it's not the current date, calculate the difference in days
  //     const timeDifference = Math.floor(
  //       (inputDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  //     )

  //     return `${timeDifference} days from now`
  //   }
  // }

  const timeManage = (item: any) => {
    setTimeDropdown(false)
    if (item == "Custom") setCutomModal(true)
    else if (item === "today") {
      const currentDate = new Date()
      const midnightDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
        0,
        0,
        0,
        0
      )
      const lastMinuteOfToday = new Date(midnightDate.getTime() - 1000)
      const epochTime = Math.floor(lastMinuteOfToday.getTime())
      setStatus((prev: any) => {
        return {
          ...prev,
          time: epochTime,
          duration: "Today",
        }
      })
    } else
      setStatus((prevstate: any) => {
        return {
          ...prevstate,
          time: calculateEpochTime(0, item),
          duration:
            item === 30
              ? "00:30 hour"
              : item === 60
              ? "01:00 hour"
              : item === 120
              ? "02:00 hours"
              : "04:00 hours",
        }
      })
  }

  const handleSet = (event: any) => {
    if (setStatus)
      setStatus((prev: any) => {
        return {
          ...prev,
          time: new Date(tonightDate(event)).getTime(),
          duration: "Custom",
        }
      })
    //toggleOption("custom", "Date", date);
  }

  const handleStatus = async (item: any,clear:boolean = false) => {
   !clear && setAnimate(true)
    try {
      await chatInstance?.changePersonalStatus({
        name: item.name,
        time: item.time,
        delete_flag: item?.delete_flag,
        emoji: item.emoji,
        duration: `${item.duration}`,
        clear_flag: clear ? true : item?.clear_flag,
      });
      setTimeout(() => {
        setAnimate(false)
        chatInstance?.GetUser(loggedInUserInfo?.sub).then((res: any) => {
          const selfData = res.filter((user: any) => {
            return user.uuid == loggedInUserInfo?.sub
          })
          dispatch(actionCreators.selfData(selfData))
        })
      }, 1000)
    } catch (error) {
      // Handle errors if needed
      console.error("Error in handleStatus:", error)
    }
  }

  useEffect(() => {
    const activeStatus = selfData?.personal_status
    setStatus((prev: any) => {
      return (
        activeStatus?.[0] ?? {
          name: "",
          time: new Date(tonightDate(new Date().getTime())).getTime(),
          emoji: "🗓️",
          duration: "Today",
        }
      )
    })
    // if (selfData?.status_history)
    //   setStatusValues((prev: any) => {
    //     return [...defaultStatus, ...selfData?.status_history]
    //   })
  }, [selfData?.status_history, selfData?.personal_status])

  return (
    <div className="flex flex-col">
      <div className="text-[#293241] text-sm font-semibold mt-2">
        Set a status
      </div>
      <div className="flex flex-row ">
        <div
          onClick={() => setDrop(!drop)}
          className="cursor-pointer w-full flex flex-row  items-center mt-1 mr-[-7px] rounded-[7px] bg-[#FEFDFB] text-[#767676] h-[44px]"
        >
          <div
            onClick={() => setIsEmojiOpen(!isEmojiOpen)}
            className="ml-2 flex flex-row items-center gap-2"
          >
            {status.emoji !== null ? (
              status.emoji
            ) : (
              <svg
                className="cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M6.10714 1.5C6.64051 1.5 7.07143 1.93092 7.07143 2.46429V3.42857H10.9286V2.46429C10.9286 1.93092 11.3595 1.5 11.8929 1.5C12.4262 1.5 12.8571 1.93092 12.8571 2.46429V3.42857H14.3036C15.1021 3.42857 15.75 4.07645 15.75 4.875V6.32143H2.25V4.875C2.25 4.07645 2.89788 3.42857 3.69643 3.42857H5.14286V2.46429C5.14286 1.93092 5.57377 1.5 6.10714 1.5ZM2.25 7.28571H15.75V15.4821C15.75 16.2807 15.1021 16.9286 14.3036 16.9286H3.69643C2.89788 16.9286 2.25 16.2807 2.25 15.4821V7.28571ZM4.17857 9.69643V10.6607C4.17857 10.9259 4.39554 11.1429 4.66071 11.1429H5.625C5.89018 11.1429 6.10714 10.9259 6.10714 10.6607V9.69643C6.10714 9.43125 5.89018 9.21429 5.625 9.21429H4.66071C4.39554 9.21429 4.17857 9.43125 4.17857 9.69643ZM8.03571 9.69643V10.6607C8.03571 10.9259 8.25268 11.1429 8.51786 11.1429H9.48214C9.74732 11.1429 9.96429 10.9259 9.96429 10.6607V9.69643C9.96429 9.43125 9.74732 9.21429 9.48214 9.21429H8.51786C8.25268 9.21429 8.03571 9.43125 8.03571 9.69643ZM12.375 9.21429C12.1098 9.21429 11.8929 9.43125 11.8929 9.69643V10.6607C11.8929 10.9259 12.1098 11.1429 12.375 11.1429H13.3393C13.6045 11.1429 13.8214 10.9259 13.8214 10.6607V9.69643C13.8214 9.43125 13.6045 9.21429 13.3393 9.21429H12.375ZM4.17857 13.5536V14.5179C4.17857 14.783 4.39554 15 4.66071 15H5.625C5.89018 15 6.10714 14.783 6.10714 14.5179V13.5536C6.10714 13.2884 5.89018 13.0714 5.625 13.0714H4.66071C4.39554 13.0714 4.17857 13.2884 4.17857 13.5536ZM8.51786 13.0714C8.25268 13.0714 8.03571 13.2884 8.03571 13.5536V14.5179C8.03571 14.783 8.25268 15 8.51786 15H9.48214C9.74732 15 9.96429 14.783 9.96429 14.5179V13.5536C9.96429 13.2884 9.74732 13.0714 9.48214 13.0714H8.51786ZM11.8929 13.5536V14.5179C11.8929 14.783 12.1098 15 12.375 15H13.3393C13.6045 15 13.8214 14.783 13.8214 14.5179V13.5536C13.8214 13.2884 13.6045 13.0714 13.3393 13.0714H12.375C12.1098 13.0714 11.8929 13.2884 11.8929 13.5536Z"
                  fill="#5C6779"
                />
              </svg>
            )}
            <svg
              width="1"
              height="24"
              viewBox="0 0 1 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0.5"
                y1="2.18557e-08"
                x2="0.499999"
                y2="24"
                stroke="black"
                stroke-opacity="0.12"
              />
            </svg>
          </div>
          {isEmojiOpen && (
            <div
              className={`z-40 h-fit-content w-fit-content absolute overflow-visible top-60`}
            >
              <Picker
                data={data}
                //   ref={pickerRef}
                onEmojiSelect={(e: any) => {
                  setChosenEmoji(e.native);
                  setStatus((prev: any) => {
                    return {
                      ...prev,
                      emoji: e.native,
                    };
                  });
                  setIsEmojiOpen(false);
                }}
                onClickOutside={() => {
                  setIsEmojiOpen(false);
                }}
                autoFocus={true}
                theme="light"
                previewPosition="none"
                exceptEmojis="SmilingFace"
                categories={[
                  "frequent",
                  "people",
                  "objects",
                  "foods",
                  "nature",
                  "activity",
                ]}
                perLine="6"
                skinTonePosition="none"
                searchPosition="sticky"
              />
            </div>
          )}
          <div className="flex flex-row items-center">
            <SearchableDropdown
              restClass={"w-[142px]"}
              rest={"w-[210px] ml-[-35px]"}
              options={
                selfData?.status_history
                  ? [...defaultStatus, ...selfData?.status_history]
                  : [...defaultStatus]
              }
              value={status}
              onChange={(e: any) => {
                setStatus((prev: any) => {
                  return {
                    ...prev,
                    name: e.name ?? e,
                    emoji: e.emoji ?? prev.emoji,
                  };
                });
              }}
            />
            {/* <input
            type="text"
            value={status?.name}
            onChange={(e: any) =>
              setStatus((prev: any) => {
                return {
                  ...prev,
                  name: e.target.value,
                }
              })
            }
            placeholder={"Update your status"}
            className="cursor-pointer bg-[#FEFDFB] text-[#767676]  pl-3 outline-none w-[152px] flex"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M15.0234 7.14797L9.39841 12.773C9.34617 12.8253 9.28413 12.8668 9.21585 12.8951C9.14756 12.9234 9.07437 12.9379 9.00044 12.9379C8.92652 12.9379 8.85333 12.9234 8.78504 12.8951C8.71675 12.8668 8.65472 12.8253 8.60247 12.773L2.97747 7.14797C2.89872 7.0693 2.84507 6.96903 2.82333 6.85986C2.80159 6.75069 2.81273 6.63752 2.85534 6.53468C2.89795 6.43184 2.97012 6.34396 3.0627 6.28216C3.15529 6.22036 3.26413 6.18741 3.37544 6.1875H14.6254C14.7368 6.18741 14.8456 6.22036 14.9382 6.28216C15.0308 6.34396 15.1029 6.43184 15.1455 6.53468C15.1882 6.63752 15.1993 6.75069 15.1776 6.85986C15.1558 6.96903 15.1022 7.0693 15.0234 7.14797Z"
              fill="#5C6779"
            />
          </svg> */}
            <svg
              className="ml-1"
              width="1"
              height="24"
              viewBox="0 0 1 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0.5"
                y1="2.18557e-08"
                x2="0.499999"
                y2="24"
                stroke="black"
                stroke-opacity="0.12"
              />
            </svg>
          </div>
          <Menu>
            <Menu.Button
              className={
                "absolute right-[38px] flex flex-row w-[15%] items-center h-10"
              }
            >
              {CLOCK_ICON}
              <div className="italic text-[8px] text-[#767676] ml-1 mt-[2px]">
                {status.time && status.duration !== "Today"
                  ? convertEpochToNormalTime(status.time)
                  : "Today"}
              </div>
            </Menu.Button>
            <Menu.Items>
              {
                <div className="absolute w-[210px] h-[202px] top-[235px] shadow-[0_1px_10px_rgb(0,0,0,0.1)] right-0 z-[100] bg-[#FEFDFB] rounded-md text-[14px] text-[#5C6779]">
                  {timeValues.map((item: any) => {
                    return (
                      <Menu.Item>
                        <div
                          className="py-[6.5px] px-[12px] max-h-[32px] flex-col hover:bg-[#dedcdc]"
                          onClick={() => timeManage(item.value)}
                        >
                          {item.name}
                        </div>
                      </Menu.Item>
                    );
                  })}
                  <div className="flex justify-between items-center group-date-picker hover:bg-[#dedcdc] h-[48px] mt-[-5px]">
                    <span className="ml-3">Until</span>
                    <div className="border border-solid box-border rounded-[7px] py-2 px-3 outline-none border-[#C4C4C4] w-[147px] h-[32px]  flex  justify-between items-center mr-2">
                      <DatePicker
                        className="w-20 outline-none group-date-picker-hover:bg-[#dedcdc]"
                        open={calender1}
                        onClickOutside={(e) => {
                          if (!buttonRef?.current?.contains(e.target as Node))
                            setCalender1(false);
                        }}
                        onSelect={(e: any) => {
                          setCalender1(false);
                        }}
                        readOnly
                        minDate={new Date()}
                        selected={
                          !status?.time || status?.duration === "Today"
                            ? new Date()
                            : status?.time
                        }
                        onChange={(e: any) => {
                          handleSet(e);
                        }}
                        calendarClassName="mr-3"
                      />
                      <svg
                        className="cursor-pointer"
                        onClick={(e) => {
                          setCalender1(!calender1);
                        }}
                        ref={buttonRef}
                        width="12"
                        height="14"
                        viewBox="0 0 12 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.95312 0.25C3.18516 0.25 3.375 0.439844 3.375 0.671875V1.9375H8.4375V0.671875C8.4375 0.439844 8.62734 0.25 8.85938 0.25C9.09141 0.25 9.28125 0.439844 9.28125 0.671875V1.9375H10.125C11.0558 1.9375 11.8125 2.69424 11.8125 3.625V4.46875V5.3125V12.0625C11.8125 12.9933 11.0558 13.75 10.125 13.75H1.6875C0.756738 13.75 0 12.9933 0 12.0625V5.3125V4.46875V3.625C0 2.69424 0.756738 1.9375 1.6875 1.9375H2.53125V0.671875C2.53125 0.439844 2.72109 0.25 2.95312 0.25ZM10.9688 5.3125H8.22656V7.21094H10.9688V5.3125ZM10.9688 8.05469H8.22656V10.1641H10.9688V8.05469ZM10.9688 11.0078H8.22656V12.9062H10.125C10.5917 12.9062 10.9688 12.5292 10.9688 12.0625V11.0078ZM7.38281 10.1641V8.05469H4.42969V10.1641H7.38281ZM4.42969 11.0078V12.9062H7.38281V11.0078H4.42969ZM3.58594 10.1641V8.05469H0.84375V10.1641H3.58594ZM0.84375 11.0078V12.0625C0.84375 12.5292 1.2208 12.9062 1.6875 12.9062H3.58594V11.0078H0.84375ZM0.84375 7.21094H3.58594V5.3125H0.84375V7.21094ZM4.42969 7.21094H7.38281V5.3125H4.42969V7.21094ZM10.125 2.78125H1.6875C1.2208 2.78125 0.84375 3.1583 0.84375 3.625V4.46875H10.9688V3.625C10.9688 3.1583 10.5917 2.78125 10.125 2.78125Z"
                          fill="#5C6779"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              }
            </Menu.Items>
          </Menu>
        </div>
        {drop && (
          <div className="w-full absolute z-50 top-56 bg-[#FEFDFB] text-[#767676] -ml-3 rounded-[10x] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ">
            {/* {statusValues.map((item: any) => {
              <div className="flex flex-row cursor-pointer my-3 mx-6 gap-4">
                <div>{item.icon}</div>
                <div>{item.name}</div>
              </div>
            );
          })} */}
          </div>
        )}
        {customModal && (
          <DateCustom setCustom={setCutomModal} setStatus={setStatus} />
        )}
        <div
          onClick={() => {
            if (status.name.trim() && status.emoji && status.time)
              handleStatus(status);
          }}
          className={`${
            status.name.trim() && status.emoji && status.time
              ? "cursor-pointer"
              : "cursor-not-allowed"
          }  ml-[12px] mt-5 mr-[-7px] w-[22px] h-[25px]`}
        >
          {animate ? (
            <svg
              className="animate-spin"
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M21.896 11C21.896 17.0177 17.0177 21.896 11 21.896C4.9823 21.896 0.104004 17.0177 0.104004 11C0.104004 4.9823 4.9823 0.104004 11 0.104004C17.0177 0.104004 21.896 4.9823 21.896 11ZM2.29842 11C2.29842 15.8057 6.19424 19.7016 11 19.7016C15.8057 19.7016 19.7016 15.8057 19.7016 11C19.7016 6.19424 15.8057 2.29842 11 2.29842C6.19424 2.29842 2.29842 6.19424 2.29842 11Z"
                fill="url(#paint0_linear_2993_206634)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2993_206634"
                  x1="8.03545"
                  y1="1.24821"
                  x2="26.5768"
                  y2="13.5484"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#B3B3B3" />
                  <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <svg id="save-status"
              width="22"
              height="25"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.67857 1.98214C1.67857 1.53767 2.03767 1.17857 2.48214 1.17857V3.58929C2.48214 4.03376 2.84124 4.39286 3.28571 4.39286H8.10714C8.55162 4.39286 8.91071 4.03376 8.91071 3.58929V1.22377C9.02372 1.26395 9.12918 1.32924 9.21456 1.41462L11.0854 3.28543C11.236 3.4361 11.3214 3.63951 11.3214 3.85296V10.0179C11.3214 10.4623 10.9623 10.8214 10.5179 10.8214H2.48214C2.03767 10.8214 1.67857 10.4623 1.67857 10.0179V1.98214ZM3.28571 1.17857H8.10714V3.58929H3.28571V1.17857ZM0.875 1.98214V10.0179C0.875 10.9043 1.5957 11.625 2.48214 11.625H10.5179C11.4043 11.625 12.125 10.9043 12.125 10.0179V3.85296C12.125 3.42606 11.9568 3.01674 11.6554 2.7154L9.78209 0.844587C9.48075 0.543248 9.07143 0.375 8.64453 0.375H2.48214C1.5957 0.375 0.875 1.0957 0.875 1.98214ZM7.70536 7.60714C7.70536 7.76543 7.67418 7.92217 7.6136 8.06841C7.55303 8.21465 7.46424 8.34753 7.35232 8.45946C7.24039 8.57139 7.10751 8.66017 6.96127 8.72075C6.81503 8.78132 6.65829 8.8125 6.5 8.8125C6.34171 8.8125 6.18497 8.78132 6.03873 8.72075C5.89249 8.66017 5.75961 8.57139 5.64768 8.45946C5.53576 8.34753 5.44697 8.21465 5.38639 8.06841C5.32582 7.92217 5.29464 7.76543 5.29464 7.60714C5.29464 7.44885 5.32582 7.29211 5.38639 7.14587C5.44697 6.99963 5.53576 6.86675 5.64768 6.75483C5.75961 6.6429 5.89249 6.55411 6.03873 6.49354C6.18497 6.43296 6.34171 6.40179 6.5 6.40179C6.65829 6.40179 6.81503 6.43296 6.96127 6.49354C7.10751 6.55411 7.24039 6.6429 7.35232 6.75483C7.46424 6.86675 7.55303 6.99963 7.6136 7.14587C7.67418 7.29211 7.70536 7.44885 7.70536 7.60714ZM6.5 5.59821C5.9672 5.59821 5.45622 5.80987 5.07947 6.18662C4.70273 6.56336 4.49107 7.07434 4.49107 7.60714C4.49107 8.13994 4.70273 8.65092 5.07947 9.02767C5.45622 9.40442 5.9672 9.61607 6.5 9.61607C7.0328 9.61607 7.54378 9.40442 7.92053 9.02767C8.29727 8.65092 8.50893 8.13994 8.50893 7.60714C8.50893 7.07434 8.29727 6.56336 7.92053 6.18662C7.54378 5.80987 7.0328 5.59821 6.5 5.59821Z"
                fill="#293241"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="text-[#1C64D8] text-xs pt-2 flex justify-end ">
        <div id="clearStatusButton"
          onClick={() => handleStatus(status, true)}
          className="cursor-pointer w-fit"
        >
          Clear
        </div>
      </div>
    </div>
  );
}

export default Status

const tonightDate = (event?: any) => {
  const currentDate = new Date(event)
  const midnightDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
    0,
    0,
    0,
    0
  )
  const lastMinuteOfToday = new Date(midnightDate.getTime() - 1000)
  return lastMinuteOfToday
}

export const DateCustom = (props: any) => {
  const { setCustom, setGeneralInfo, generalInfo, setStatus } = props
  const [calender1, setCalender1] = useState(false)
  const [calender2, setCalender2] = useState(false)
  const [date, setDate] = useState<any>({
    start: new Date(tonightDate(new Date().getTime())).getTime(),
    end: new Date().getTime(),
  })

  const handleSet = () => {
    setCustom(false)
    if (setGeneralInfo)
      setGeneralInfo(() => {
        return {
          ...generalInfo,
          status: {
            ...generalInfo.status,
            time: new Date(date.start).getTime(),
            duration: "Custom",
          },
        }
      })
    if (setStatus)
      setStatus((prev: any) => {
        return {
          ...prev,
          time: new Date(date.start).getTime(),
          duration: "Custom",
        }
      })
    //toggleOption("custom", "Date", date);
  }

  const handleReadValuesCalender = (event: any, type: any) => {
    if (type === "start") {
      setDate((prevDate: any) => ({
        ...prevDate,
        start: tonightDate(event),
      }))
    } else {
      setDate((prevDate: any) => ({
        ...prevDate,
        end: new Date(event).getTime(),
      }))
    }
  }

  return (
    <div>
      <div className="bg-[#00000033] backdrop-blur fixed inset-0 z-[300]">
        <div className="flex  justify-center items-center place-content-center w-full h-full overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col h-fit text-primary-200 w-[470px] bg-[white] p-[20px] rounded-[15px]">
            <div className="flex flex-row relative mb-5">
              <span className="text-primary-200 text-lg font-bold">
                Custom Status
              </span>
              <span className="absolute mt-[6px] top-0 right-0">
                <svg
                  onClick={() => setCustom(false)}
                  className="cursor-pointer"
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8307 1.84102L10.6557 0.666016L5.9974 5.32435L1.33906 0.666016L0.164062 1.84102L4.8224 6.49935L0.164062 11.1577L1.33906 12.3327L5.9974 7.67435L10.6557 12.3327L11.8307 11.1577L7.1724 6.49935L11.8307 1.84102Z"
                    fill="#A7A9AB"
                  />
                </svg>
              </span>
            </div>
            <div className="flex flex-row w-full justify-center">
              <div
                onClick={() => !calender1 && setCalender1(!calender1)}
                className="border border-solid box-border rounded-[7px] py-2 px-3 outline-none border-[#C4C4C4] w-48  flex"
              >
                <DatePicker
                  className="w-24 outline-none ml-10"
                  open={calender1}
                  onClickOutside={() => setCalender1(false)}
                  readOnly
                  minDate={new Date()}
                  selected={date.start}
                  onChange={(e: any) => handleReadValuesCalender(e, "start")}
                />
              </div>
              {/* <div className="outline-none border-[#C4C4C4] w-40 mr-14 flex">
                <TimePicker
                  className="rc-time-picker-input"
                  value={moment(date.end)}
                  onChange={(e: any) =>
                    handleReadValuesCalender(e, "timeCalender")
                  }
                  showSecond={false}
                  use12Hours
                />
              </div> */}
            </div>

            <div className="flex flex-row-reverse mt-6 h-full pt-1">
              <button
                onClick={handleSet}
                className="h-[32px] w-[78px] mr-1 font-bold bg-[#E57600] hover:bg-[#CC6900] text-[#FFFFFF] rounded-[7px] ml-1 mb-1 disabled:opacity-50 "
              >
                {t("Set")}
              </button>
              <button
                onClick={() => setCustom(false)}
                className="h-[32px] w-[78px] text-[#293241] rounded-[3px] mb-1"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
