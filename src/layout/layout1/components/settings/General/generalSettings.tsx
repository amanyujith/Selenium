import React, { useCallback, useEffect, useRef, useState } from "react"
import DropDown from "../../../../../atom/DropDown/dropDown"
import { actionCreators } from "../../../../../store"
import { useDispatch, useSelector } from "react-redux"
import LocalDb from "../../../../../dbServices/dbServices"
import i18n from "../../../../../i18n/i18n"
import InputFields from "../../../../../atom/InputField/inputField"
import { useDropzone } from "react-dropzone"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import CheckBox from "../../../../../atom/CheckBox/checkBox"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import { DateCustom } from "../../dashboard/ProfileBox/status"
import TimeZone from "../../../../../atom/DropDown/timeZone"
import ProfilePicture from "../profilePicture"
import moment from "moment-timezone"
import CustomDropdown from "../../../../../atom/DropDown/customDropdown"
import { Menu } from "@headlessui/react"
import DatePicker, { ReactDatePicker } from "react-datepicker"
import { Environment } from "../../../../../config/environmentConfigs/config"
import {
  tonightTime,
  calculateEpochTime,
  getTonightTime,
  handleKeyDown,
} from "../utils/functions"
import { defaultStatus, options, timeValues } from "../utils/json"
import { profile_emoji } from "../utils/svg"

const GeneralSettings = () => {
  const sessionData = Environment.getInstance()

  console.log("getInstanvce",sessionData)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const dispatch = useDispatch()
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false)
  const [change, setChange] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const [customModal, setCutomModal] = useState<boolean>(false)
  const [generalInfo, setGeneralInfo] = useState<any>({
    name: "",
    profilePicture: null,
    phone: null,
    status: {
      name: "",
      time: "current",
      emoji: null,
      duration: "00:30 hour",
      clear_flag: false,
    },
  })
  const [deletedStatus, setDeletedStatus] = useState<any>([])
  const [profile, setProfile] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [croppedImage, setCroppedImage] = useState<any>(null)
  const [autoTimeZone, setAutoTimezone] = useState(
    settings?.[0]?.set_auto_timezone
  )
  const [statusValues, setStatusValues] = useState([...defaultStatus])
  const [disableButton, setDisableButton] = useState(false)
  const [validStatus, setValidStatus] = useState(true)
  const inputRef = useRef<any>(false)
  const [timezone, setTimezone] = useState(settings[0]?.time_Zone)
  const onDrop = useCallback((acceptedFiles) => {
    var tmppath: string = URL.createObjectURL(acceptedFiles[0])
    if (isValidMimeType(acceptedFiles[0].type)) setProfilePicture(tmppath)
    else setProfilePicture("invalid")
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, //@ts-ignore
    accept: "image/*",
  })

  const isValidMimeType = (fileType: string) => {
    const regex = /^image\/(jpeg|png|gif|webp)$/
    return regex.test(fileType)
  }

  const topBottomBar = [
    {
      name: "sticky",
      value: "sticky",
    },
  ]

  const timeManage = (item: any) => {
    if (item == "Custom") setCutomModal(true)
    else if (item === "today") {
      setGeneralInfo((prev: any) => {
        return {
          ...prev,
          status: {
            ...prev?.status,
            time: tonightTime(),
            duration: "Today",
          },
        }
      })
    } else
      setGeneralInfo((prevstate: any) => {
        return {
          ...prevstate,
          status: {
            ...prevstate?.status,
            time: calculateEpochTime(0, item),
            duration:
              item === 30
                ? "00:30 hour"
                : item === 60
                ? "01:00 hour"
                : item === 120
                ? "02:00 hours"
                : "04:00 hours",
          },
        }
      })
  }

  const handleClickOutSide = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsEmojiOpen(false)
    }
  }

  const languageChange = (e: any) => {
    i18n.changeLanguage(e)
    setCurrentLanguage(e)
  }
  const handleChange = (e: any, key: string) => {
    // if (e !== "name") {
    if (key == "name") {
      const regEx = /^\S[a-zA-Z ]*$/
      const count = e.target.value.length
      if (
        regEx.test(e.target.value) &&
        count > 2 &&
        count !== 0 &&
        count < 31
      ) {
        setDisableButton(false)
      } else if (!disableButton) {
        setDisableButton(true)
      }
    }

    setGeneralInfo((prev: any) => {
      return {
        ...prev,
        [key]: e.target.value,
      }
    })
    // }
  }

  const updateSettings = (args: any) => {
    if (loggedInUserInfo?.sub)
      chatInstance
        .updateChatSettings(settings[0]?.uuid, args)
        .then((res: any) => {
          chatInstance
            .getChatSettings(loggedInUserInfo?.sub)
            .then((data: any) => {
              dispatch(actionCreators.soundAndNotification(data))
            })
        })
  }

  //To Check if a status should be updated or isValid
  const statusValid = () => {
    if (generalInfo?.status?.name && generalInfo?.status?.emoji) {
      setValidStatus(true)
      return true
    } else if (!generalInfo?.status?.name && !generalInfo?.status?.emoji) {
      setValidStatus(true)
      return true
    } else {
      setValidStatus(false)
      return false
    }
  }

  const handleUpdate = async () => {
    statusValid()
    if (change && statusValid()) {
      setChange(false)
      try {
        if (
          selfData?.display_name !== generalInfo?.name ||
          selfData?.phone !== generalInfo?.phone ||
          croppedImage
        )
          await chatInstance
            ?.UpdateUser({
              url:
                croppedImage === "remove"
                  ? null
                  : !croppedImage
                  ? undefined
                  : croppedImage,
              display_name: generalInfo?.name,
              phone: generalInfo?.phone ?? null,
            })
            .then(() => {
              //   chatInstance?.GetUser(loggedInUserInfo?.sub).then((res: any) => {
              //     const selfData = res.filter((user: any) => {
              //       return user.uuid == loggedInUserInfo?.sub
              //     })
              //     dispatch(actionCreators.selfData(selfData))
              //     setChange({ change: false, disable: false })
              //   })
            })

        if (deletedStatus.length) {
          await chatInstance?.configuredApiRequest(
            sessionData.personal_status,
            {
              uuids: deletedStatus.map((status: any) => status.uuid),
              delete_flag: true,
            }
          )
        }
        if (
          (generalInfo?.status?.name !== selfData?.personal_status?.[0]?.name ||
            generalInfo?.status?.emoji !==
              selfData?.personal_status?.[0]?.emoji ||
            (generalInfo?.status?.time !==
              selfData?.personal_status?.[0]?.time &&
              selfData?.personal_status.length)) &&
          generalInfo?.status?.name.trim() &&
          generalInfo?.status?.emoji
        ) {
          await chatInstance?.changePersonalStatus({
            name: generalInfo?.status?.name,
            time:
              generalInfo?.status?.time === "current"
                ? calculateEpochTime(0, 30)
                : generalInfo?.status?.time,
            delete_flag: generalInfo?.status?.delete_flag,
            emoji: generalInfo?.status?.emoji,
            duration: generalInfo?.status?.duration,
            clear_flag: generalInfo?.status?.clear_flag,
          })
          // .then(async () => {

          // })

          // setTimeout(async () => {
          const res = await chatInstance?.GetUser(loggedInUserInfo?.sub)
          const data = res.filter(
            (user: any) => user.uuid === loggedInUserInfo?.sub
          )
          dispatch(actionCreators.selfData(data))
          setDeletedStatus([])
        } else if (
          (!generalInfo?.status?.name &&
            !generalInfo?.status?.emoji &&
            selfData?.personal_status?.length) ||
          (generalInfo?.status?.clear_flag && selfData?.personal_status?.length)
        ) {
          await chatInstance
            .changePersonalStatus({
              name: selfData?.personal_status?.[0]?.name,
              time:
                selfData?.personal_status?.[0]?.time === "current"
                  ? calculateEpochTime(0, 30)
                  : selfData?.personal_status?.[0]?.time,
              emoji: selfData?.personal_status?.[0]?.emoji,
              duration: selfData?.personal_status?.[0]?.duration,
              clear_flag: true,
            })
            .then(() => {
              chatInstance?.GetUser(loggedInUserInfo?.sub).then((res: any) => {
                const selfData = res.filter((user: any) => {
                  return user.uuid == loggedInUserInfo?.sub
                })
                dispatch(actionCreators.selfData(selfData))
                setChange(false)
                setDeletedStatus([])
              })
            })
        }

        if (
          autoTimeZone != settings[0]?.set_auto_timezone ||
          timezone != settings[0]?.time_Zone
        )
          updateSettings({
            set_auto_timezone: autoTimeZone,
            time_Zone: timezone,
          })
        if (selfData?.language !== currentLanguage) {
          await chatInstance?.configuredApiRequest(
            sessionData.update_user(loggedInUserInfo?.sub),
            {
              language: currentLanguage,
            }
          )
          languageChange(currentLanguage)
        }
        const res = await chatInstance?.GetUser(loggedInUserInfo?.sub)
        const data = res.filter(
          (user: any) => user.uuid === loggedInUserInfo?.sub
        )
        dispatch(actionCreators.selfData(data))
        setDeletedStatus([])
      } catch (error) {
        // Handle errors if needed
        console.error("Error in handleStatus:", error)
      }
    }
  }

  //To Check if a status should be updated or isValid
  useEffect(() => {
    if (!validStatus) statusValid()
  }, [generalInfo?.status?.name, generalInfo?.status.emoji, inputRef.current])

  useEffect(() => {
    i18n.changeLanguage(
      selfData?.language === "English" ? "en" : selfData?.language
    )
    setCurrentLanguage(
      selfData?.language === "English" ? "en" : selfData?.language
    )
  }, [selfData?.language])

  useEffect(() => {
    setAutoTimezone(settings?.[0]?.set_auto_timezone)
    setTimezone(settings[0]?.time_Zone)
  }, [settings?.[0]?.set_auto_timezone, settings[0]?.time_Zone])

  useEffect(() => {
    //if autotimezone enabled , will pick the timezone
    const current_timezone_code = moment.tz.guess()
    const timeZoneCode = moment.tz(current_timezone_code)
    const utcOffsetFormatted = timeZoneCode.format("Z")
    const timeZoneName = moment?.tz.zone(current_timezone_code)?.name
    if (autoTimeZone)
      setTimezone({
        time: utcOffsetFormatted,
        country: timeZoneName,
      })
  }, [autoTimeZone])

  useEffect(() => {
    setGeneralInfo((prev: any) => {
      return {
        ...prev,
        name: selfData?.display_name,
        profilePicture: selfData?.profile_picture,
        phone: selfData?.phone,
      }
    })
  }, [selfData?.display_name, selfData?.phone, selfData?.profile_picture])

  useEffect(() => {
    if (
      (generalInfo?.status?.clear_flag ||
        settings?.[0]?.set_auto_timezone != autoTimeZone ||
        settings?.[0]?.time_Zone?.time != timezone?.time ||
        settings?.[0]?.time_Zone?.country != timezone?.country ||
        deletedStatus?.length) &&
      !disableButton
    ) {
      setChange(true)
    } else {
      setChange(false)
    }
  }, [
    generalInfo,
    deletedStatus,
    settings,
    autoTimeZone,
    timezone,
    disableButton,
  ])

  useEffect(() => {
    if (
      selfData?.display_name != generalInfo?.name ||
      selfData?.phone != generalInfo?.phone ||
      selfData?.profile_picture != generalInfo?.profilePicture ||
      (selfData?.language === "English" && currentLanguage !== "en") ||
      (selfData?.language !== "English" &&
        selfData?.language !== currentLanguage) ||
      ((generalInfo?.status?.name.trim() !==
        selfData?.personal_status?.[0]?.name.trim() ||
        generalInfo?.status?.emoji !== selfData?.personal_status?.[0]?.emoji ||
        generalInfo?.status?.time !== selfData?.personal_status?.[0]?.time) &&
        selfData?.personal_status?.length) ||
      (!selfData?.personal_status?.length &&
        generalInfo?.status?.name.trim() &&
        generalInfo?.status?.emoji)
    ) {
      setChange(true)
    } else {
      setChange(false)
    }
  }, [selfData, generalInfo, currentLanguage])

  useEffect(() => {
    const activeStatus = selfData?.personal_status

    setGeneralInfo((prev: any) => {
      return {
        ...prev,
        status: activeStatus?.[0] ?? {
          name: "",
          time: "current",
          emoji: null,
          duration: "00:30 hour",
        },
      }
    })
    if (selfData?.status_history) {
      const history = selfData?.status_history?.map((item: any) => {
        const list = {
          ...item,
          duration:
            item?.duration === "Today"
              ? "Today"
              : item?.duration === "1 Hour" || item?.duration === "01:00 hour"
              ? "01:00 hour"
              : item?.duration === "4 Hours" || item?.duration === "04:00 hours"
              ? "04:00 hours"
              : item?.duration === "02:00 hours"
              ? "02:00 hours"
              : "00:30 hour",
          time:
            item?.duration === "Today"
              ? 1440
              : item?.duration === "1 Hour" || item?.duration === "01:00 hour"
              ? 60
              : item?.duration === "02:00 hours"
              ? 120
              : item?.duration === "4 Hours" || item?.duration === "04:00 hours"
              ? 240
              : 30,
        }
        return list
      })
      setStatusValues((prev: any) => {
        return [...defaultStatus, ...history]
      })
    }
  }, [selfData?.status_history, selfData?.personal_status])

  useEffect(() => {
    const newUrl = generalInfo?.profilePicture?.replace(
      /\.(jpg|jpeg|png|gif)$/,
      "-low.webp"
    )
    setProfile(newUrl)
  }, [generalInfo?.profilePicture])

  return (
    <div
      className="pb-5  mt-[24px] w-[580px] "
      onClick={() => handleClickOutSide}
    >
      <div className="text-[#293241] text-lg px-[12px] font-bold">Profile</div>
      <div className="  flex flex-col px-[12px] min-h-[300px]  h-[calc(100vh-450px)] w-full overflow-y-auto overflow-x-hidden">
        <div className="flex flex-row w-[580px]">
          <div className="flex flex-col gap-2 w-full">
            <div className="text-[#293241] text-[16px] font-semibold mt-3">
              General
            </div>
            <div className="flex w-full">
              <div className=" flex flex-col justify-center items-center text-[] ml-2">
                {(croppedImage && croppedImage != "remove") ||
                generalInfo.profilePicture ? (
                  <div
                    {...getRootProps()}
                    className="w-[144px] h-[144px]  cursor-pointer relative overflow-hidden rounded-md border border-[#C4C4C4]  flex flex-col justify-center items-center"
                  >
                    <input
                      type="file"
                      {...getInputProps()}
                      style={{ display: "none" }}
                    />
                    {croppedImage ? (
                      <img
                        className="  absolute top-0 left-0 w-[144px] h-[144px]"
                        src={croppedImage}
                      />
                    ) : (
                      <img
                        className="  absolute top-0 left-0 w-[144px] h-[144px]"
                        src={profile}
                        onError={() => setProfile(generalInfo?.profilePicture)}
                      />
                    )}
                    <div className="absolute opacity-0 hover:opacity-95 transition-opacity bg-[white] top-0 left-0 w-[144px] h-[144px] overflow-hidden flex flex-col justify-center items-center">
                      {profile_emoji}
                      <span className="text-[12px] text-center text-[#C4C4C4] w-28 p-2 cursor-pointer">
                        {isDragActive
                          ? "Drop Here"
                          : " Drag & drop or click to upload "}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div id="profile-pic"
                    className="w-[144px] h-[144px] rounded-md border border-[#C4C4C4]  flex flex-col justify-center items-center"
                    {...getRootProps()}
                  >
                    <input id="profile-photo"
                      type="file"
                      {...getInputProps()}
                      style={{ display: "none" }}
                    />
                    {profile_emoji}
                    <span id="profile" className="text-[12px] text-center text-[#C4C4C4] w-28 p-2 cursor-pointer">
                      {isDragActive
                        ? "Drop Here"
                        : " Drag & drop or click to upload "}
                    </span>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    {...getInputProps()}
                    style={{ display: "none" }}
                  />
                  <span id="ChangeProfilePicture"
                    className="px-2 text-[12px] text-[#1C64D8] cursor-pointer"
                    {...getRootProps({
                      onClick: (event) => console.log("Testing firefox issue"),
                    })} 
                  >
                     Change
                  </span>
                  <span id="removeProfilePicture"
                    className="px-2 text-[12px] text-[#1C64D8] cursor-pointer"
                    onClick={() => {
                      if (generalInfo.profilePicture) {
                        setProfile("");
                        setGeneralInfo((prev: any) => {
                          return {
                            ...prev,
                            profilePicture: "",
                          };
                        });
                      }
                      setCroppedImage("remove");
                    }}
                  >
                    Remove
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-[32px] w-full ">
                <InputFields id="displayName"
                  value={generalInfo?.name}
                  label={"Display Name"}
                  name={"display name"}
                  onChange={(e: any) => {
                    handleChange(e, "name");
                  }}
                  maxLength={24}
                  autoFocus={true}
                  restClass={`flex w-full h-[44px] rounded-[7px] border-[1px]  ${
                    disableButton ? "border-[red]" : "border-[#B1B1B1]"
                  }`}
                />
                <div className="text-[#A7A9AB] text-[12px]">Email address</div>
                <div className="text-[#1C64D8] text-[14px]">
                  {selfData?.email}
                </div>
                <div className="text-[#A7A9AB] text-[12px]">Phone Number</div>
                <InputFields id="phoneNumber"
                  value={generalInfo?.phone}
                  label={"Phone Number"}
                  name={"phone number"}
                  onKeyDown={(event: any) => handleKeyDown(event)}
                  type="number"
                  maxLength={15}
                  onChange={(e: any) => handleChange(e, "phone")}
                  restClass={`flex w-full h-[44px] rounded-[7px] border-[1px] border-[#B1B1B1]`}
                />
              </div>
            </div>
            {/* <div className="text-[#293241] text-[14px]">
            {selfData?.phone ?? "-"}
          </div> */}
          </div>
          <div className=" ml-12 mt-20"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-[#293241] font-semibold mt-3">
              Set a status
            </span>
            {console.log(generalInfo, "generalInfo")}
            {(selfData?.personal_status?.[0]?.length &&
              generalInfo?.status?.name &&
              !generalInfo?.status?.clear_flag) ||
            ((generalInfo?.status?.name || generalInfo?.status?.emoji) &&
              !generalInfo?.status?.clear_flag) ? (
              <div id="clear-status"
                onClick={() => {
                  setChange(true);
                  if (selfData?.personal_status?.[0]?.length) {
                    setGeneralInfo((prev: any) => {
                      return {
                        ...prev,
                        status: {
                          ...prev.status,
                          clear_flag: true,
                        },
                      };
                    });
                  } else {
                    setGeneralInfo((prev: any) => {
                      return {
                        ...prev,
                        status: {
                          name: "",
                          time: "current",
                          emoji: null,
                          duration: "00:30 hour",
                          clear_flag: false,
                        },
                      };
                    });
                  }
                }}
                className="h-[44px] w-fit   text-[#1C64D8] rounded-[7px] pt-5  ml-1 mb-1 disabled:opacity-50 cursor-pointer "
              >
                Clear Status
              </div>
            ) : null}
          </div>
          <div className="flex flex-row gap-2">
            <div className="relative">
              <div
                className="w-[44px] h-[44px] mb-1 border border-[#A7A9AB] rounded-[5px] flex justify-center items-center cursor-pointer relative"
                onClick={() => {
                  setIsEmojiOpen(!isEmojiOpen);
                }}
                ref={popupRef}
              >
                {generalInfo?.status?.emoji &&
                !generalInfo?.status?.clear_flag ? (
                  generalInfo?.status?.emoji
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M1.5 8.99941C1.5 6.85488 2.64375 4.87441 4.5 3.80332C6.35625 2.73223 8.64375 2.73223 10.5 3.80332C11.9133 4.61895 12.9141 5.96191 13.3102 7.5041C13.2492 7.50176 13.1859 7.49941 13.125 7.49941C12.9281 7.49941 12.7336 7.51348 12.5438 7.53926C12.1711 6.25488 11.3156 5.13926 10.125 4.45254C8.50078 3.51504 6.49922 3.51504 4.875 4.45254C3.25078 5.39004 2.25 7.12441 2.25 8.99941C2.25 10.8744 3.25078 12.6088 4.875 13.5463C6.33516 14.39 8.1 14.4744 9.62109 13.8018C9.75703 14.0197 9.91406 14.2236 10.0852 14.4135C8.31094 15.2619 6.22031 15.1893 4.49766 14.1955C2.64375 13.1244 1.5 11.1439 1.5 8.99941ZM4.13906 7.97051C4.21406 7.67285 4.36875 7.33535 4.60547 7.06582C4.8375 6.79395 5.18438 6.56191 5.625 6.56191C6.06563 6.56191 6.4125 6.79395 6.64922 7.06582C6.88359 7.33535 7.04063 7.67285 7.11563 7.97051C7.16484 8.17207 7.04297 8.37598 6.84375 8.4252C6.64453 8.47441 6.43828 8.35254 6.38906 8.15332C6.33984 7.95176 6.23203 7.72676 6.08672 7.55801C5.94141 7.3916 5.78672 7.31191 5.62969 7.31191C5.47266 7.31191 5.31562 7.3916 5.17266 7.55801H5.16797C5.02266 7.72676 4.91484 7.95176 4.86563 8.15332C4.81641 8.35488 4.6125 8.47676 4.41094 8.4252C4.20937 8.37363 4.0875 8.17207 4.13906 7.97051ZM4.77891 11.1205C4.64297 10.9635 4.65937 10.7268 4.81641 10.5908C4.97344 10.4549 5.21016 10.4713 5.34609 10.6283C5.76562 11.1135 6.48281 11.6244 7.5 11.6244C8.11875 11.6244 8.62734 11.4346 9.02344 11.1791C9.00703 11.3268 9 11.4744 9 11.6244C9 11.7627 9.00703 11.901 9.02109 12.0369C8.59219 12.2408 8.08594 12.3744 7.5 12.3744C6.20859 12.3744 5.30156 11.7205 4.77891 11.1205ZM7.88906 7.97051C7.96406 7.67285 8.11875 7.33535 8.35547 7.06582C8.5875 6.79395 8.93437 6.56191 9.375 6.56191C9.81563 6.56191 10.1625 6.79395 10.3992 7.06582C10.6336 7.33535 10.7906 7.67285 10.8656 7.97051C10.882 8.04082 10.8797 8.11348 10.8586 8.17676C10.7367 8.25645 10.6195 8.34316 10.507 8.43457C10.3383 8.43691 10.1813 8.32207 10.1391 8.15098C10.0898 7.94941 9.98203 7.72441 9.83672 7.55566C9.69141 7.38926 9.53672 7.30957 9.37969 7.30957C9.22266 7.30957 9.06563 7.38926 8.92266 7.55566C8.77734 7.72441 8.66953 7.94941 8.62031 8.15098H8.61563C8.56641 8.35254 8.3625 8.47441 8.16094 8.42285C7.95938 8.37129 7.8375 8.16973 7.88906 7.96816V7.97051ZM9.75 11.6244C9.75 9.76113 11.2617 8.24941 13.125 8.24941C14.9883 8.24941 16.5 9.76113 16.5 11.6244C16.5 13.4877 14.9883 14.9994 13.125 14.9994C11.2617 14.9994 9.75 13.4877 9.75 11.6244ZM10.5 11.6244C10.5 13.0752 11.6742 14.2494 13.125 14.2494C14.5758 14.2494 15.75 13.0752 15.75 11.6244C15.75 10.1736 14.5758 8.99941 13.125 8.99941C11.6742 8.99941 10.5 10.1736 10.5 11.6244ZM11.25 11.6244C11.25 11.4182 11.4187 11.2494 11.625 11.2494H12.75V10.1244C12.75 9.91816 12.9187 9.74941 13.125 9.74941C13.3313 9.74941 13.5 9.91816 13.5 10.1244V11.2494H14.625C14.8313 11.2494 15 11.4182 15 11.6244C15 11.8307 14.8313 11.9994 14.625 11.9994H13.5V13.1244C13.5 13.3307 13.3313 13.4994 13.125 13.4994C12.9187 13.4994 12.75 13.3307 12.75 13.1244V11.9994H11.625C11.4187 11.9994 11.25 11.8307 11.25 11.6244Z"
                      fill="#5C6779"
                    />
                  </svg>
                )}
              </div>
              <div
                className={`z-40 h-fit-content w-fit-content absolute overflow-visible `}
              >
                {isEmojiOpen && (
                  <Picker
                    data={data}
                    //   ref={pickerRef}
                    onEmojiSelect={(e: any) => {
                      inputRef.current = true;
                      if (generalInfo.status.clear_flag) {
                        setGeneralInfo((prev: any) => {
                          return {
                            ...prev,
                            status: {
                              ...prev.status,
                              emoji: e.native,
                              name: "",
                              clear_flag: false,
                              time: "current",
                              duration: "00:30 hour",
                              icon: "",
                            },
                          };
                        });
                      } else {
                        setGeneralInfo((prev: any) => {
                          return {
                            ...prev,
                            status: {
                              ...prev.status,
                              emoji: e.native,
                            },
                          };
                        });
                      }

                      setIsEmojiOpen(false);
                    }}
                    onClickOutside={() => {
                      setIsEmojiOpen(false);
                    }}
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
                      "places",
                      "travel",
                    ]}
                    autoFocus={true}
                    perLine="8"
                    skinTonePosition="none"
                    searchPosition="sticky"
                  />
                )}
              </div>
            </div>
            <InputFields id="CurrentStatus"
              label={"Type your current status"}
              name={"myMeeting"}
              value={
                generalInfo?.status?.clear_flag ? "" : generalInfo?.status?.name
              }
              maxLength={100}
              onChange={(e: any) => {
                if (generalInfo.status.clear_flag) {
                  setGeneralInfo((prev: any) => {
                    return {
                      ...prev,
                      status: {
                        ...prev.status,
                        emoji: "",
                        name: e.target.value,
                        clear_flag: false,
                        time: "current",
                        duration: "00:30 hour",
                      },
                    };
                  });
                } else {
                  setGeneralInfo((prev: any) => {
                    return {
                      ...prev,
                      status: {
                        ...prev.status,
                        name: e.target.value,
                      },
                    };
                  });
                }

                setGeneralInfo((prev: any) => {
                  return {
                    ...prev,
                    status: {
                      ...prev?.status,
                      name: e.target.value,
                    },
                  };
                });
              }}
              restClass={`flex w-full cursor-pointer h-[44px] rounded-[7px] border-[1px] border-[#B1B1B1]`}
            />
            <Menu>
              <div className="relative">
                <Menu.Button>
                  <div
                    // onClick={() => !calender1 && setCalender1(!calender1)}
                    className=""
                  >
                    {generalInfo?.status?.duration === "Custom"
                      ? new Date(generalInfo?.status?.time).toLocaleDateString(
                          "en-US"
                        )
                      : generalInfo?.status?.duration ?? "00:30 hour"}
                    <svg
                      width="9"
                      height="6"
                      viewBox="0 0 9 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className=""
                    >
                      <path
                        d="M4.10898 5.13867C4.2543 5.28398 4.49336 5.28398 4.63867 5.13867L8.38867 1.38867C8.53398 1.24336 8.53398 1.0043 8.38867 0.858984C8.24336 0.713672 8.0043 0.713672 7.85898 0.858984L4.37383 4.34414L0.888672 0.858984C0.743359 0.713672 0.504297 0.713672 0.358984 0.858984C0.213672 1.0043 0.213672 1.24336 0.358984 1.38867L4.10898 5.13867Z"
                        fill="#5C6779"
                      />
                    </svg>
                  </div>
                </Menu.Button>
                <div className="mt-2 ">
                  <Menu.Items>
                    {
                      <CustomTime
                        timeManage={timeManage}
                        setGeneralInfo={setGeneralInfo}
                        generalInfo={generalInfo}
                      />
                    }
                  </Menu.Items>
                </div>
              </div>
            </Menu>
          </div>
          {!validStatus && (
            <span className="text-[red] text-xs">
              Please select both emoji and name to your status.
            </span>
          )}
          <div className="text-[#A7A9AB] text-[12px]">
            {generalInfo?.status?.name &&
              generalInfo?.status?.time &&
              generalInfo?.status.emoji &&
              `This status will be displayed until ${
                generalInfo?.status?.time === "current"
                  ? `${new Date(calculateEpochTime(0, 30))
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .toUpperCase()}, ${new Date()?.toLocaleDateString(
                      "en-US"
                    )}`
                  : generalInfo?.status?.duration === "Today"
                  ? `11:59 PM, ${new Date()?.toLocaleDateString("en-US")}`
                  : ` ${new Date(generalInfo?.status?.time)
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .toUpperCase()}, ${new Date(
                      generalInfo?.status?.time
                    )?.toLocaleDateString("en-US")}`
              }`}
          </div>
          <div className="overflow-y-auto overflow-x-hidden h-[130px] mr-4">
            
            {statusValues
              .filter((status: any) => status.delete_flag != true)
              .map((item: any, index: number) => {
                const id = item.id || `status-${index+1}`
                return (
                  <div id={id}
                    className="flex flex-row px-5 h-8 gap-3 group hover:bg-[#dedcdc] relative items-center cursor-pointer"
                    onClick={() =>
                      setGeneralInfo((prev: any) => {
                        return {
                          ...prev,
                          status: {
                            ...item,
                            time:
                              item.duration === "Today"
                                ? tonightTime()
                                : calculateEpochTime(0, item.time),
                            duration: item.duration,
                          },
                        };
                      })
                    }
                  >
                    <div>{item.emoji}</div>
                    <div className="text-[#293241] max-w-[330px] truncate">
                      {item.name}
                    </div>
                    <div className="text-[#B1B1B1]">{item.duration}</div>

                    {!item.default && (
                      <svg
                        className="invisible absolute right-0 group-hover:visible mr-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusValues((prev) => {
                            const updatedArray = [...prev];
                            updatedArray.splice(index, 1);
                            return updatedArray;
                          });
                          setDeletedStatus([
                            ...deletedStatus,
                            {
                              ...item,
                              delete_flag: true,
                            },
                          ]);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                      >
                        <path
                          d="M5.88604 2.8918L5.71461 3.20833H3.4289C3.00747 3.20833 2.66699 3.52487 2.66699 3.91667C2.66699 4.30846 3.00747 4.625 3.4289 4.625H12.5718C12.9932 4.625 13.3337 4.30846 13.3337 3.91667C13.3337 3.52487 12.9932 3.20833 12.5718 3.20833H10.286L10.1146 2.8918C9.98604 2.65052 9.72175 2.5 9.43366 2.5H6.56699C6.2789 2.5 6.01461 2.65052 5.88604 2.8918ZM12.5718 5.33333H3.4289L3.93366 12.8372C3.97175 13.3973 4.47175 13.8333 5.07413 13.8333H10.9265C11.5289 13.8333 12.0289 13.3973 12.067 12.8372L12.5718 5.33333Z"
                          fill="#5C6779"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
          </div>
          <div className="text-[16px] font-semibold ">Time Zone</div>
          <CheckBox
            checked={autoTimeZone}
            onChange={(e: any) => {
              setAutoTimezone(!autoTimeZone);
            }}
            color={""}
            label={"Set time zone automatically"}
            id={"timezone"}
            restClass={"-ml-2 rounded-[5px] text-[#293241] text-[12px]"}
            labelClass={"text-[#293241] text-[12px]"}
          />
          {autoTimeZone ? (
            <DropDown
              value={timezone?.country}
              id={"timezone"}
              options={[
                {
                  value: timezone?.time,
                  name: timezone?.country,
                },
              ]}
              disabled={true}
              // onChange={(e: any) => {
              //   updateSettings({ time_zone: e.target.value })
              // }}
              restClass={
                "rounded-[8px] border-[1px] cursor-pointer text-[#767676] border-[#B1B1B1] h-[44px] box-border py-2 px-3 outline-none w-full flex "
              }
            />
          ) : (
            <TimeZone
              value={{
                country: timezone?.country,
                time: timezone?.time,
              }}
              id={timezone?.country}
              onChange={(e: any) => {
                setTimezone({
                  country: e.country,
                  time: e.utc,
                });
              }}
              rest={"text-[#767676] h-[44px] "}
              restClass={
                "rounded-[5px] text-[#767676] cursor-pointer text-[16px]  w-[300px]  "
              }
            />
          )}
          {customModal && (
            <DateCustom
              setCustom={setCutomModal}
              setGeneralInfo={setGeneralInfo}
              generalInfo={generalInfo}
            />
          )}
          <div className="text-[#A7A9AB] text-[12px]">
            NCS uses your time zone to send summary and notification emails, for
            times in your activity feeds and for reminder
          </div>
          <div className="text-[#293241] font-semibold mt-3  text-[16px] font-sans">
            Language
          </div>
          <CustomDropdown
            options={options}
            value={options.find((lan: any) => lan.value === currentLanguage)}
            rest={
              "h-[44px] w-[100px] mt-[-4px] mb-3 border-[#B1B1B1] text-[#767676]"
            }
            restClass={"-translate-y-full top-[-5px]"}
            onChange={(e: any) => setCurrentLanguage(e)}
          />
        </div>
        {profilePicture && (
          <ProfilePicture
            profilePicture={profilePicture}
            setCropImage={setCroppedImage}
            setProfilePicture={setProfilePicture}
            setChange={setChange}
          />
        )}
      </div>
      <div className="flex items-center justify-end my-6 px-[24px]">
        <HomeButton id="saveallchanges"
          handleClick={() => {
            handleUpdate();
          }}
          color={change ? "#E57600" : "#FEF3E6"}
          textColor={"#ffffff"}
          restClass={`text-[14px] leading py-[7.5px]  w-fit h-[38px] font-bold ${
            !change ? "cursor-not-allowed" : "hover:bg-[#CC6900]"
          }`}
        >
          {"Save all changes"}
        </HomeButton>
      </div>
    </div>
  );
}

export default GeneralSettings

export const CustomTime = ({
  timeManage,
  generalInfo,
  setGeneralInfo,
  setStatus,
}: any) => {
  const [calender1, setCalender1] = useState(false)
  const buttonRef = useRef<any>(null)
  const [date, setDate] = useState<any>({
    start: new Date(getTonightTime(new Date().getTime())).getTime(),
    end: new Date().getTime(),
  })
  const handleSet = (event: any) => {
    if (setGeneralInfo)
      setGeneralInfo(() => {
        return {
          ...generalInfo,
          status: {
            ...generalInfo.status,
            time: new Date(getTonightTime(event)).getTime(),
            duration: "Custom",
          },
        }
      })
    if (setStatus)
      setStatus((prev: any) => {
        return {
          ...prev,
          time: new Date(getTonightTime(event)).getTime(),
          duration: "Custom",
        }
      })
    //toggleOption("custom", "Date", date);
  }

  return (
    <div className="absolute w-[210px] h-[202px]  shadow-[0_1px_10px_rgb(0,0,0,0.1)] right-0 z-[100] bg-[#FEFDFB] rounded-md text-[14px] text-[#5C6779]">
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
        <div
          // onClick={() => !calender1 && setCalender1(!calender1)}
          className="border border-solid box-border rounded-[7px] py-2 px-3 outline-none border-[#C4C4C4] w-[147px] h-[32px]  flex  justify-between items-center mr-2"
        >
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
            dateFormat={"MM/dd/yyyy"}
            readOnly
            minDate={new Date()}
            selected={
              generalInfo?.status?.time === "current" ||
              !generalInfo?.status?.time ||
              generalInfo?.status?.duration === "Today"
                ? new Date()
                : generalInfo?.status?.time
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
  );
}
