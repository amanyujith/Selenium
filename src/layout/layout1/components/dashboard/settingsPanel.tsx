import { Link, useParams } from "react-router-dom"
import SettingsItem from "../../../../atom/SettingsItem/settingsItem"
import { useCallback, useState } from "react"
import InputFields from "../../../../atom/InputField/inputField"
import CheckBox from "../../../../atom/CheckBox/checkBox"
import TimeZone from "../../../../atom/DropDown/timeZone"
import DropDown from "../../../../atom/DropDown/dropDown"
import CalenderIcon from "./Chat/Icons/calenderIcon"
import BusIcon from "./Chat/Icons/busIcon"
import SickIcon from "./Chat/Icons/sickIcon"
import HomeIcon from "./Chat/Icons/homeIcon"
import LocalDb from "../../../../dbServices/dbServices"
import i18n from "../../../../i18n/i18n"
import { useDropzone } from "react-dropzone"
import Cropper from "react-easy-crop"
import HomeButton from "../../../../atom/HomeButton/homeButton"
import AudioVideoSettings from "../settings/audioVideoSettings"
import { useTranslation } from "react-i18next"
import NotificationSettings from "../settings/Notifications/notificationSettings"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../store"
import GeneralSettings from "../settings/General/generalSettings"
import About from "../settings/about"
import { AnimatePresence, motion } from "framer-motion"
const SettingsPanel = (props: any) => {
  const {
    setclose,
    setProfileSettingsClick,
    setProfileSettingsClickValues,
    setAudioClick,
    settingsPanel,
  } = props
  const [active, setActive] = useState("profile")
  const dbStore = LocalDb.loadLocalDB("hoolva", "MeetingList", 1)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [profilePicture, setProfilePicture] = useState(null)
  // const [crop, setCrop] = useState({ x: 50, y: 50 });
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const dispatch = useDispatch()

  const [generalInfo, setGeneralInfo] = useState<any>({
    name: "",
    profilePicture: "",
  })

  const { t } = useTranslation()

  const languageChange = (e: any) => {
    i18n.changeLanguage(e.target.value)
    LocalDb.set(dbStore, "MeetingList", "language", { lang: e.target.value })
    setCurrentLanguage(e.target.value)
  }
  const getTimezoneAbbreviation = () => {
    const date = new Date()
    const options = { timeZoneName: "short" }
    const timezoneAbbreviation = date //@ts-ignore
      .toLocaleTimeString("en", options)
      .split(" ")[2]
    return timezoneAbbreviation
  }

  const handleClick = () => {
    setProfileSettingsClick(true)
    setProfileSettingsClickValues(true)
    setAudioClick(false)
  }

  const handleClickData = () => {
    setActive("profile")
    if (
      setProfileSettingsClick &&
      setProfileSettingsClickValues &&
      setAudioClick
    ) {
      setProfileSettingsClick(true)
      setProfileSettingsClickValues(false)
      setAudioClick(false)
    }
  }

  const handleClickAudio = () => {
    setActive("audio")
    if (setAudioClick) setAudioClick(true)
  }

  return (
    <div>
      <div className="bg-[#00000033] bg-opacity-100  backdrop-blur fixed inset-0 z-50 flex justify-center items-center">
        <div className="flex items-center place-content-center w-full h-[calc(100vh-10px)] my-auto justify-center ">
          <motion.div
            key="settingsTab"
            initial={{ translateY: "80px" }}
            animate={{
              translateY: "0px",
              transition: {
                duration: 0.2,
                type: "tween",
                ease: "easeOut",
              },
            }}
            exit={{
              translateY: "80px",
              transition: {
                duration: 0.1,
                type: "tween",
                ease: "easeOut",
              },
            }}
            className="flex flex-col max-w-[calc(100vw-10px)] min-h-[300px] max-h-[calc(100vh-10px)] bg-[white]  rounded-[15px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.10)] overflow-y-auto overflow-x-hidden"
          >
            <div className=" flex justify-between bg-[#EBEDEF] w-full rounded-t-[15px] py-[10px] px-5">
              <span className="flex">
                <div className=" text-[16px] font-bold ">
                  {t("Dashboard.Settings")}
                </div>
              </span>
              <span  id="modalsetclose"
                onClick={() => setclose(false)}
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
            <div className="flex flex-row max-h-[calc(100vh-200px)]">
              <div className=" mt-1 w-[220px] max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
                <SettingsItem
                  restClass={`  ${
                    active === "profile" && "bg-[#FEF3E6]"
                  } ml-2 max-w-[196px]`}
                  label="Profile"
                  handleClick={handleClickData}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M8.90625 9.5C9.80136 9.5 10.6598 9.14442 11.2927 8.51149C11.9257 7.87855 12.2812 7.02011 12.2812 6.125C12.2812 5.22989 11.9257 4.37145 11.2927 3.73851C10.6598 3.10558 9.80136 2.75 8.90625 2.75C8.01114 2.75 7.1527 3.10558 6.51976 3.73851C5.88683 4.37145 5.53125 5.22989 5.53125 6.125C5.53125 7.02011 5.88683 7.87855 6.51976 8.51149C7.1527 9.14442 8.01114 9.5 8.90625 9.5ZM7.70127 10.7656C5.1041 10.7656 3 12.8697 3 15.4669C3 15.8993 3.35068 16.25 3.78311 16.25H14.0294C14.4618 16.25 14.8125 15.8993 14.8125 15.4669C14.8125 12.8697 12.7084 10.7656 10.1112 10.7656H7.70127Z"
                      fill="#5C6779"
                    />
                  </svg>
                </SettingsItem>

                <SettingsItem
                  restClass={`  ${
                    active === "audio" && "bg-[#FEF3E6]"
                  } ml-2 max-w-[196px]`}
                  label={t("Dashboard.AudioVideo")}
                  handleClick={handleClickAudio}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M6.18135 4.36484L5.90713 5.1875H3.9375C3.00674 5.1875 2.25 5.94424 2.25 6.875V13.625C2.25 14.5558 3.00674 15.3125 3.9375 15.3125H14.0625C14.9933 15.3125 15.75 14.5558 15.75 13.625V6.875C15.75 5.94424 14.9933 5.1875 14.0625 5.1875H12.0929L11.8187 4.36484C11.6473 3.84805 11.1647 3.5 10.6189 3.5H7.38105C6.83525 3.5 6.35273 3.84805 6.18135 4.36484ZM9 7.71875C9.67133 7.71875 10.3152 7.98543 10.7899 8.46014C11.2646 8.93484 11.5312 9.57867 11.5312 10.25C11.5312 10.9213 11.2646 11.5652 10.7899 12.0399C10.3152 12.5146 9.67133 12.7812 9 12.7812C8.32867 12.7812 7.68484 12.5146 7.21014 12.0399C6.73543 11.5652 6.46875 10.9213 6.46875 10.25C6.46875 9.57867 6.73543 8.93484 7.21014 8.46014C7.68484 7.98543 8.32867 7.71875 9 7.71875Z"
                      fill="#5C6779"
                    />
                  </svg>
                </SettingsItem>

                <SettingsItem
                  restClass={`  ${
                    active === "notification" && "bg-[#FEF3E6]"
                  } ml-2 max-w-[196px]`}
                  label={t("Dashboard.Notification")}
                  handleClick={() => {
                    setActive("notification")
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M8.99933 2C8.46597 2 8.03506 2.43091 8.03506 2.96427V3.54284C5.83531 3.98881 4.17797 5.93544 4.17797 8.26778V8.83429C4.17797 10.2506 3.65666 11.6186 2.71649 12.6793L2.4935 12.9294C2.24038 13.2127 2.18012 13.6195 2.3338 13.966C2.48748 14.3126 2.83401 14.5356 3.2137 14.5356H14.785C15.1647 14.5356 15.5082 14.3126 15.6649 13.966C15.8216 13.6195 15.7583 13.2127 15.5052 12.9294L15.2822 12.6793C14.342 11.6186 13.8207 10.2536 13.8207 8.83429V8.26778C13.8207 5.93544 12.1634 3.98881 9.96361 3.54284V2.96427C9.96361 2.43091 9.5327 2 8.99933 2ZM10.3644 16.8649C10.726 16.5033 10.9279 16.0121 10.9279 15.4998H8.99933H7.07079C7.07079 16.0121 7.27268 16.5033 7.63429 16.8649C7.99589 17.2265 8.48706 17.4284 8.99933 17.4284C9.5116 17.4284 10.0028 17.2265 10.3644 16.8649Z"
                      fill="#5C6779"
                    />
                  </svg>
                </SettingsItem>

                {/* <SettingsItem
                    restClass={`  ${active === "display" && "bg-[#FEF3E6]"}`}
                    label="Display"
                    handleClick={() => {
                      setActive("display")
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                    >
                      <path
                        d="M2.25 3.59375C2.25 3.12705 2.62705 2.75 3.09375 2.75H6.46875C6.93545 2.75 7.3125 3.12705 7.3125 3.59375V13.7188C7.3125 15.1162 6.17871 16.25 4.78125 16.25C3.38379 16.25 2.25 15.1162 2.25 13.7188V3.59375ZM8.1457 13.9798C8.15361 13.8928 8.15625 13.8058 8.15625 13.7188V6.81055L10.1443 4.82246C10.4739 4.49287 11.0092 4.49287 11.3388 4.82246L13.725 7.20869C14.0546 7.53828 14.0546 8.07353 13.725 8.40312L8.1457 13.9798ZM7.06992 16.25L12.1324 11.1875H14.9062C15.3729 11.1875 15.75 11.5646 15.75 12.0312V15.4062C15.75 15.8729 15.3729 16.25 14.9062 16.25H7.06992ZM5.625 4.4375H3.9375V6.125H5.625V4.4375ZM3.9375 7.8125V9.5H5.625V7.8125H3.9375ZM4.78125 14.3516C4.94908 14.3516 5.11004 14.2849 5.22872 14.1662C5.34739 14.0475 5.41406 13.8866 5.41406 13.7188C5.41406 13.5509 5.34739 13.39 5.22872 13.2713C5.11004 13.1526 4.94908 13.0859 4.78125 13.0859C4.61342 13.0859 4.45246 13.1526 4.33378 13.2713C4.21511 13.39 4.14844 13.5509 4.14844 13.7188C4.14844 13.8866 4.21511 14.0475 4.33378 14.1662C4.45246 14.2849 4.61342 14.3516 4.78125 14.3516Z"
                        fill="#5C6779"
                      />
                    </svg>
                  </SettingsItem> */}

                <SettingsItem
                  restClass={`  ${
                    active === "about" && "bg-[#FEF3E6]"
                  } ml-2 max-w-[196px]`}
                  label="About"
                  handleClick={() => {
                    setActive("about")
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M9 16.25C10.7902 16.25 12.5071 15.5388 13.773 14.273C15.0388 13.0071 15.75 11.2902 15.75 9.5C15.75 7.70979 15.0388 5.9929 13.773 4.72703C12.5071 3.46116 10.7902 2.75 9 2.75C7.20979 2.75 5.4929 3.46116 4.22703 4.72703C2.96116 5.9929 2.25 7.70979 2.25 9.5C2.25 11.2902 2.96116 13.0071 4.22703 14.273C5.4929 15.5388 7.20979 16.25 9 16.25ZM7.94531 11.6094H8.57812V9.92188H7.94531C7.59463 9.92188 7.3125 9.63975 7.3125 9.28906C7.3125 8.93838 7.59463 8.65625 7.94531 8.65625H9.21094C9.56162 8.65625 9.84375 8.93838 9.84375 9.28906V11.6094H10.0547C10.4054 11.6094 10.6875 11.8915 10.6875 12.2422C10.6875 12.5929 10.4054 12.875 10.0547 12.875H7.94531C7.59463 12.875 7.3125 12.5929 7.3125 12.2422C7.3125 11.8915 7.59463 11.6094 7.94531 11.6094ZM9 6.125C9.22378 6.125 9.43839 6.2139 9.59662 6.37213C9.75486 6.53036 9.84375 6.74497 9.84375 6.96875C9.84375 7.19253 9.75486 7.40714 9.59662 7.56537C9.43839 7.72361 9.22378 7.8125 9 7.8125C8.77622 7.8125 8.56161 7.72361 8.40338 7.56537C8.24514 7.40714 8.15625 7.19253 8.15625 6.96875C8.15625 6.74497 8.24514 6.53036 8.40338 6.37213C8.56161 6.2139 8.77622 6.125 9 6.125Z"
                      fill="#5C6779"
                    />
                  </svg>
                </SettingsItem>
              </div>
              {active === "profile" && <GeneralSettings />}
              {active === "audio" && (
                <AudioVideoSettings
                  settingsPanel={settingsPanel}
                  active={active}
                />
              )}
              {active === "notification" && <NotificationSettings />}
              {active === "about" && <About />}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
