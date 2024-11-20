import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FadeIn from "react-fade-in/lib/FadeIn"
import { actionCreators } from "../../../../../store"
import InputFields from "../../../../../atom/InputField/inputField"
import { t } from "i18next"
import Notification from "../Notification/Notification"
import { detect } from "detect-browser"
import copy from "copy-to-clipboard"
import { getURL } from "../../../../../utils/linkManipulation"

const PersonalMeeting = (props: any) => {
  const dispatch = useDispatch()
  const [maskedPassword, setMaskedPassword] = useState(true)
  const [password, setPassword] = useState<any>("")
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const user = useSelector((state: any) => state.Main.meetingSession)
  const [data, setData] = useState<any>({})
  const browser = detect()
  const [loader, setloader] = useState<any>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [toggle, setToggle] = useState<boolean>(false)
  dispatch(actionCreators.setProgress(false))
  dispatch(actionCreators.setEditSingleMeet(false))
  dispatch(actionCreators.setEditSingleRecMeet(false))
  dispatch(actionCreators.setFlagEditMeetingTime(false))
  dispatch(actionCreators.setEditScheduleMeet(false))
  dispatch(actionCreators.setAllRecurrenceScheduleMeet(false))
  const [disableButton, setDisableButton] = useState(false)
  const [idError, setIdError] = useState("")
  const [passError, setPassError] = useState("")
  const [cursor, setCursor] = useState(-1)
  const [ctrlDown, setCtrlDown] = useState(false)
  const [preventChar, setPreventChar] = useState(false)
  const [clipboardState, setClipboardState] = useState(false)
  const meetingSessions = useSelector((state: any) => state.Main.meetingSession)
  const meetingList = useSelector((state: any) => state.Main.meetingList)

  const securityList = [
    { label: "Allow people to join before host", value: "open" },
    { label: "Allow people to join after host", value: "closed" },
    { label: "Allow people to join when host admits", value: "locked" },
  ]

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    setloader(true)
    await meetingSession
      .getScheduleMeeting({ personal: true })
      .then((res: any) => {
        res[0] ? setData(res[0]) : setData(res)

        setToggle(res[0] ? res[0].audio_bridge : res.audio_bridge)
        setPassword(res[0] ? res[0].password : "")
        setloader(false)
      })
  }
  const handleClick = async () => {
    await meetingSession
      .preAuth({
        meetingId: data.id,
        password: data.password ? data.password : undefined,
      })
      .then(async (data: any) => {
        dispatch(actionCreators.meetingID(data.id as number))
        dispatch(actionCreators.setMeetingInfo(data))
        await meetingSession.meetingInvite(data.roomuuid).then((res: any) => {
          const newUrl = getURL(res?.meeting_url)
          const result = newUrl.replace(
            "/launch-meetings/?iuasdf",
            "/app/?rtdf"
          )
          const newWindow = window.open(result, "_blank")
        })
      })
      .catch((error: any) => {})
  }

  const handleReadValues = (value: any, type: any) => {
    if (type === "id") {
      if (value === 0) {
        setData((prev: any) => ({ ...prev, [type]: null }))
        setPreventChar(false)
      } else {
        setData((prev: any) => ({ ...prev, [type]: value }))
        setPreventChar(true)
        if (value.toString().length === 10) {
          setDisableButton(false)
          setIdError("")
        } else {
          setIdError("Meeting ID should be of 10 digits")
          setDisableButton(true)
        }
      }
    } else if (type === "password") {
      if (value === 0) {
        setData((prev: any) => ({ ...prev, [type]: null }))
        setPreventChar(false)
      } else {
        setData((prev: any) => ({ ...prev, [type]: value }))
        setPreventChar(true)
        if (
          (value.toString().length > 5 && value.toString().length <= 12) ||
          value.toString().length === 0
        ) {
          setDisableButton(false)
          setPassError("")
        } else if (value.toString().length > 12) {
          setPassError("Password must be less than 13 characters")
          setDisableButton(true)
        } else {
          setPassError("Password should be of atleast 6 characters")
          setDisableButton(true)
        }
      }
    } else {
      setData((prev: any) => ({ ...prev, [type]: value }))
    }
  }

  const handleKeyDown = (evt: any) => {
    preventChar &&
      (evt.keyCode === 8 ||
      evt.keyCode === 13 ||
      (ctrlDown && (evt.keyCode === 86 || evt.keyCode === 67))
        ? null
        : evt.key.match(/[a-zA-Z!@#$%^&*()_+=\-[\]{}|\\:;"'~<>,.?/]/g)) &&
      evt.preventDefault()
    !preventChar &&
      (evt.keyCode === 8 ||
      evt.keyCode === 13 ||
      (ctrlDown && (evt.keyCode === 86 || evt.keyCode === 67))
        ? null
        : evt.key.match(/[a-zA-Z!@#$%^&*()_+=\-[\]{}|\\:;"'~<>,.?/]/g) ||
          evt.key === "0") &&
      evt.preventDefault()

    const totalMeetingCount = meetingList.filter((node: any, index: any) => {
      const nodeVal = node?.value?.toString()
      if (node && data.id) {
        return nodeVal.match(data.id)
      }
      return true
    }).length
    if (evt.keyCode === 38 && cursor > -1) {
      evt.preventDefault()
      setCursor((prevState) => prevState - 1)
    } else if (evt.keyCode === 40 && cursor < totalMeetingCount - 1) {
      evt.preventDefault()
      setCursor((prevState) => prevState + 1)
    }
  }

  const getDataUrl = (data: any) => {
    meetingSessions.meetingInvite(data.uuid).then((res: any) => {
      copy(res.meeting_url)
      setClipboardState(res.meeting_url)
      setTimeout(() => {
        setClipboardState(false)
      }, 3000)
    })
  }

  const handleEditCase = () => {
    if (data?.id && disableButton === false && edit) {
      data.id = parseInt(data.id, 10)
      if (data.password?.length === 0) data.password = null
      if (edit) {
        user
          .UpdateMeeting(data, data.uuid)
          .then((res: any) => {
            dispatch(
              actionCreators.setNotification({
                content: "Your meeting edited successfully!",
                type: "success",
              })
            )
            getData()
          })
          .catch((e: any) => {
            console.log(e, "edit error")
            if (e.data.reason === "Meeting Id already exists") {
              dispatch(
                actionCreators.setNotification({
                  content: "Meeting ID already exists!",
                  type: "error",
                })
              )
            } else if (e.data.reason === "Meeting in progress") {
              dispatch(
                actionCreators.setNotification({
                  content: "Meeting in progress!",
                  type: "error",
                })
              )
            } else {
              dispatch(
                actionCreators.setNotification({
                  content: "Oops,your meeting not edited!",
                  type: "error",
                })
              )
            }
          })
        getData()
      }
      setEdit(!edit)
    }
  }

  return (
    <div className="h-[calc(100vh-122px)] overflow-y-auto overflow-x-hidden py-[60px] px-[100px]">
      {loader ? (
        <div className={`w-full h-full flex justify-center items-center p-2 `}>
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
        <FadeIn>
          <div className="grid grid-rows-3 grid-flow-col gap-7">
            <div className="flex flex-col">
              <div className="text-[16px] font-semibold text-[#293241]">
                Topic
              </div>
              <div className="text-[16px] font-normal text-[#5C6779] mt-3 capitalize ">
                {data.name}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-[16px] font-semibold text-[#293241]">
                Password
              </div>
              <div className="text-[16px] font-normal text-[#5C6779] mt-3">
                {edit ? (
                  <div>
                    <div className="flex flex-row gap-5">
                      <InputFields
                        id={"myMeeting"}
                        label={"Password"}
                        name={"myMeeting"}
                        type={maskedPassword ? "password" : "text"}
                        value={data.password}
                        autocomplete={"new-password"}
                        onChange={(e: any) =>
                          handleReadValues(e.target.value, "password")
                        }
                        restClass={`w-full border-[#B1B1B1] text-[#293241] rounded-[7px] border-[1px] focus:border-[#B1B1B1] focus:border-[0px]`}
                      />
                      {data?.password?.length > 0 && (
                        <div
                          id="eye"
                          onClick={() => setMaskedPassword(!maskedPassword)}
                          className="cursor-pointer"
                        >
                          {!maskedPassword ? (
                            <svg
                              className="mt-3"
                              xmlns="http://www.w3.org/2000/svg"
                              height="19"
                              width="19"
                              viewBox="0 0 640 512"
                            >
                              <path d="M25.9 3.4C19-2 8.9-.8 3.4 6.1S-.8 23.1 6.1 28.6l608 480c6.9 5.5 17 4.3 22.5-2.6s4.3-17-2.6-22.5L25.9 3.4zM605.5 268.3c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-51.2 0-96 14.8-133.9 36.8l27.3 21.5C244.6 74.2 280.2 64 320 64c70.4 0 127.7 32 170.8 72c43.1 40 71.9 88 85.2 120c-9.2 22.1-25.9 52-49.5 81.5l25.1 19.8c25.6-32 43.7-64.4 53.9-89zM88.4 154.7c-25.6 32-43.7 64.4-53.9 89c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c51.2 0 96-14.8 133.9-36.8l-27.3-21.5C395.4 437.8 359.8 448 320 448c-70.4 0-127.7-32-170.8-72C106.1 336 77.3 288 64 256c9.2-22.1 25.9-52 49.5-81.5L88.4 154.7zM320 384c16.7 0 32.7-3.2 47.4-9.1l-30.9-24.4c-5.4 .9-10.9 1.4-16.5 1.4c-51 0-92.8-39.8-95.8-90.1l-30.9-24.4c-.9 6-1.3 12.2-1.3 18.5c0 70.7 57.3 128 128 128zM448 256c0-70.7-57.3-128-128-128c-16.7 0-32.7 3.2-47.4 9.1l30.9 24.4c5.4-.9 10.9-1.4 16.5-1.4c51 0 92.8 39.8 95.8 90.1l30.9 24.4c.9-6 1.3-12.2 1.3-18.5z" />
                            </svg>
                          ) : (
                            <svg
                              className="mt-3"
                              width="20"
                              height="20"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.99912 3.0625C5.57893 3.0625 4.44173 3.70932 3.61387 4.47917C2.79128 5.242 2.24114 6.15598 1.981 6.78347C1.923 6.92232 1.923 7.077 1.981 7.21585C2.24114 7.84334 2.79128 8.75732 3.61387 9.52014C4.44173 10.29 5.57893 10.9368 6.99912 10.9368C8.41931 10.9368 9.55652 10.29 10.3844 9.52014C11.207 8.75556 11.7571 7.84334 12.019 7.21585C12.077 7.077 12.077 6.92232 12.019 6.78347C11.7571 6.15598 11.207 5.242 10.3844 4.47917C9.55652 3.70932 8.41931 3.0625 6.99912 3.0625ZM4.46809 6.99966C4.46809 6.32839 4.73475 5.68461 5.20941 5.20995C5.68407 4.73529 6.32785 4.46863 6.99912 4.46863C7.67039 4.46863 8.31417 4.73529 8.78883 5.20995C9.26349 5.68461 9.53015 6.32839 9.53015 6.99966C9.53015 7.67093 9.26349 8.31471 8.78883 8.78937C8.31417 9.26403 7.67039 9.53069 6.99912 9.53069C6.32785 9.53069 5.68407 9.26403 5.20941 8.78937C4.73475 8.31471 4.46809 7.67093 4.46809 6.99966ZM6.99912 5.87476C6.99912 6.49521 6.49467 6.99966 5.87422 6.99966C5.74943 6.99966 5.6299 6.97857 5.51741 6.94166C5.42074 6.91002 5.30825 6.96978 5.31177 7.07172C5.31704 7.193 5.33462 7.31428 5.36801 7.43556C5.60881 8.33548 6.5351 8.86981 7.43502 8.62901C8.33494 8.38821 8.86927 7.46192 8.62847 6.562C8.43337 5.83257 7.78831 5.34219 7.07119 5.3123C6.96924 5.30879 6.90948 5.41952 6.94112 5.51795C6.97803 5.63044 6.99912 5.74996 6.99912 5.87476Z"
                                fill="#5C6779"
                              />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-[red] text-sm h-2 mt-[1px]">
                      {passError}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row gap-6">
                    {data.password === null ? (
                      "Not set"
                    ) : (
                      <div
                        className={`${
                          maskedPassword ? "tracking-[4.5px]" : ""
                        } tracking-widest`}
                      >
                        {maskedPassword
                          ? "*".repeat(data?.password?.length)
                          : data.password}
                      </div>
                    )}
                    {data?.password?.length > 0 && (
                      <div
                        id="showPassword"
                        onClick={() => setMaskedPassword(!maskedPassword)}
                        className="cursor-pointer"
                      >
                        {!maskedPassword ? (
                          <svg
                            className="mt-1"
                            xmlns="http://www.w3.org/2000/svg"
                            height="15"
                            width="15"
                            viewBox="0 0 640 512"
                          >
                            <path d="M25.9 3.4C19-2 8.9-.8 3.4 6.1S-.8 23.1 6.1 28.6l608 480c6.9 5.5 17 4.3 22.5-2.6s4.3-17-2.6-22.5L25.9 3.4zM605.5 268.3c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-51.2 0-96 14.8-133.9 36.8l27.3 21.5C244.6 74.2 280.2 64 320 64c70.4 0 127.7 32 170.8 72c43.1 40 71.9 88 85.2 120c-9.2 22.1-25.9 52-49.5 81.5l25.1 19.8c25.6-32 43.7-64.4 53.9-89zM88.4 154.7c-25.6 32-43.7 64.4-53.9 89c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c51.2 0 96-14.8 133.9-36.8l-27.3-21.5C395.4 437.8 359.8 448 320 448c-70.4 0-127.7-32-170.8-72C106.1 336 77.3 288 64 256c9.2-22.1 25.9-52 49.5-81.5L88.4 154.7zM320 384c16.7 0 32.7-3.2 47.4-9.1l-30.9-24.4c-5.4 .9-10.9 1.4-16.5 1.4c-51 0-92.8-39.8-95.8-90.1l-30.9-24.4c-.9 6-1.3 12.2-1.3 18.5c0 70.7 57.3 128 128 128zM448 256c0-70.7-57.3-128-128-128c-16.7 0-32.7 3.2-47.4 9.1l30.9 24.4c5.4-.9 10.9-1.4 16.5-1.4c51 0 92.8 39.8 95.8 90.1l30.9 24.4c.9-6 1.3-12.2 1.3-18.5z" />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.99912 3.0625C5.57893 3.0625 4.44173 3.70932 3.61387 4.47917C2.79128 5.242 2.24114 6.15598 1.981 6.78347C1.923 6.92232 1.923 7.077 1.981 7.21585C2.24114 7.84334 2.79128 8.75732 3.61387 9.52014C4.44173 10.29 5.57893 10.9368 6.99912 10.9368C8.41931 10.9368 9.55652 10.29 10.3844 9.52014C11.207 8.75556 11.7571 7.84334 12.019 7.21585C12.077 7.077 12.077 6.92232 12.019 6.78347C11.7571 6.15598 11.207 5.242 10.3844 4.47917C9.55652 3.70932 8.41931 3.0625 6.99912 3.0625ZM4.46809 6.99966C4.46809 6.32839 4.73475 5.68461 5.20941 5.20995C5.68407 4.73529 6.32785 4.46863 6.99912 4.46863C7.67039 4.46863 8.31417 4.73529 8.78883 5.20995C9.26349 5.68461 9.53015 6.32839 9.53015 6.99966C9.53015 7.67093 9.26349 8.31471 8.78883 8.78937C8.31417 9.26403 7.67039 9.53069 6.99912 9.53069C6.32785 9.53069 5.68407 9.26403 5.20941 8.78937C4.73475 8.31471 4.46809 7.67093 4.46809 6.99966ZM6.99912 5.87476C6.99912 6.49521 6.49467 6.99966 5.87422 6.99966C5.74943 6.99966 5.6299 6.97857 5.51741 6.94166C5.42074 6.91002 5.30825 6.96978 5.31177 7.07172C5.31704 7.193 5.33462 7.31428 5.36801 7.43556C5.60881 8.33548 6.5351 8.86981 7.43502 8.62901C8.33494 8.38821 8.86927 7.46192 8.62847 6.562C8.43337 5.83257 7.78831 5.34219 7.07119 5.3123C6.96924 5.30879 6.90948 5.41952 6.94112 5.51795C6.97803 5.63044 6.99912 5.74996 6.99912 5.87476Z"
                              fill="#5C6779"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* <div className="flex flex-col">
            <div className="text-[16px] font-semibold text-[#293241]">
              Record Mode
            </div>
            <div className="text-[16px] font-normal text-[#5C6779] mt-3 capitalize">
              {data.record_mode}
            </div>
          </div> */}
            <div className="flex flex-col">
              <div className="text-[16px] font-semibold text-[#293241]">
                Meeting ID
              </div>
              <div className="text-[16px] font-normal text-[#5C6779] mt-3">
                {edit ? (
                  <>
                    <InputFields
                      id={"myMeetingId"}
                      label={"Meeting ID"}
                      name={"myMeeting"}
                      value={data.id}
                      onKeyDown={(event: any) => handleKeyDown(event)}
                      onChange={(e: any) =>
                        handleReadValues(e.target.value, "id")
                      }
                      type={"number"}
                      restClass={`w-full border-[#B1B1B1] text-[#293241] rounded-[7px] border-[1px] focus:border-[#B1B1B1] focus:border-[0px]`}
                    />
                    <div className="text-[red] text-sm h-2 mt-[1px]">
                      {idError}
                    </div>
                  </>
                ) : (
                  data.id
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-[16px] font-semibold text-[#293241]">
                Phone Bridge
              </div>
              <div className="text-[16px] font-normal text-[#5C6779] mt-3 capitalize">
                <div className="flex items-center ">
                  {edit ? (
                    <div className="flex flex-row gap-3 items-center">
                      <div
                        id="phone_bridge"
                        onClick={(e: any) => {
                          setToggle(!toggle);
                          handleReadValues(!toggle, "audio_bridge");
                        }}
                        className={`w-9 h-[18px] p-0.5 bg-white rounded-[19px] border border-[#A7A9AB] ${
                          toggle
                            ? "justify-end"
                            : " justify-start cursor-pointer"
                        } items-center gap-2.5 inline-flex`}
                      >
                        <div
                          className={`w-3.5 h-3.5 ${
                            toggle ? "bg-[#5C6779]" : "bg-[#B1B1B1]"
                          }  rounded-[19px]`}
                        />
                      </div>
                      <div>{toggle === true ? "Enabled" : "Disabled"}</div>
                    </div>
                  ) : (
                    <>{data.audio_bridge === true ? "Enabled" : "Disabled"}</>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-[16px] font-semibold text-[#293241]">
                Security
              </div>
              <div className="text-[16px] font-normal text-[#5C6779] mt-3 ">
                {edit ? (
                  <select
                    id="join_modePersonal"
                    className="border-[#B1B1B1] rounded-[7px] border-[1px] px-3 py-2 bg-[white] h-[42px] w-[400px]"
                    value={data.join_mode}
                    onChange={(e: any) =>
                      handleReadValues(e.target.value, "join_mode")
                    }
                  >
                    {securityList.map((datas: any) => {
                      return <option value={datas.value}>{datas.label}</option>;
                    })}
                  </select>
                ) : (
                  <>
                    {data.join_mode === "open"
                      ? "Allow people to join before host"
                      : data.join_mode === "closed"
                      ? "Allow people to join after host"
                      : "Allow people to join when host admits"}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end ">
            <div
              id="copyLinkData"
              onClick={() => {
                getDataUrl(data);
              }}
              className={` mr-4 cursor-pointer h-[36px] min-w-[100px]  p-4 flex items-center justify-center`}
            >
              {clipboardState === false ? "Copy link" : "Copied"}
            </div>
            {edit && (
              <div
                id="setCancelData"
                onClick={() => {
                  setEdit(false);
                  getData();
                  setDisableButton(false);
                }}
                className={`bg-[#FEF4E9] mr-4 cursor-pointer h-[36px] min-w-[100px] rounded-[8px] border-[1px] border-[#B1B1B1] p-4 flex items-center justify-center`}
              >
                Cancel
              </div>
            )}
            <div
              id="setSaveData"
              onClick={() => {
                edit ? handleEditCase() : setEdit(!edit);
              }}
              className={`${
                ((data?.password?.length < 5 &&
                  data?.password.length !== 0 &&
                  !data?.id) ||
                  disableButton) &&
                edit
                  ? "cursor-not-allowed bg-[#D1CCC7] text-[#FFFFFF]"
                  : `cursor-pointer ${edit ? "bg-[#F7931F]" : "bg-[#FEF4E9]"}`
              } h-[36px] min-w-[100px] mr-4 rounded-[8px] border-[1px] border-[#B1B1B1] p-4 flex items-center justify-center`}
            >
              {edit ? "Save Changes" : "Edit"}
            </div>

            {!edit && (
              <div
                id="setStartData"
                onClick={() => handleClick()}
                className={`bg-[#F7931F] cursor-pointer h-[36px] min-w-[100px] rounded-[8px] border-[1px] border-[#B1B1B1] p-4 flex items-center justify-center`}
              >
                Start
              </div>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  );
}

export default PersonalMeeting
