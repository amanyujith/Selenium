import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import InputFields from "../../../../../atom/InputField/inputField"
import path from "../../../../../navigation/routes.path"
import { actionCreators } from "../../../../../store"
// import { openDB } from 'idb';
import LocalDb from "../../../../../dbServices/dbServices"
import { ActionType } from "../../../../../store/action-types"
import hoverTimer from "../../../../../utils/hoverTimer"
import ModalData from "../../../../../constructors/modal/modalData"
import Modal from "../../modal/modal"
import { t } from "i18next"
import i18n from "../../../../../i18n/i18n"
// import LocalDb from '../../../../../services/dbServices';
// import NotificationData from '../../../../../constructors/notification/notificationData';

const JoinMeeting = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.Main.meetingSession)
  const environmentLevel = useSelector(
    (state: any) => state.Main.environmentLevel
  )
  const meetingList = useSelector((state: any) => state.Main.meetingList)
  const [meetingId, setMeetingId] = useState<number | null>(null)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [disableButton, setDisableButton] = useState(true)
  const [maskedPassword, setMaskedPassword] = useState(true)
  const [meetingPassword, setmeetingPassword] = useState(false)
  const [meetingHistory, setMeetingHistory] = useState(false)
  const [preventChar, setPreventChar] = useState(false)
  const [cursor, setCursor] = useState(-1)
  const [ctrlDown, setCtrlDown] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate(path.AUTHSCREEN)
    }
  }, [user])

  const dbStore = LocalDb.loadLocalDB("hoolva", "MeetingList", 1)

  useEffect(() => {
    hoverTimer(false, dispatch)
    LocalDb.getAllKeys(dbStore, "MeetingList", (data: any) => {
      const meetingListData = data.response
      let filteredArr: any = []
      meetingListData.map((key: any) => {
        LocalDb.get(dbStore, "MeetingList", key, (data: any) => {
          filteredArr.push(data.response)
        })
      })

      dispatch(actionCreators.setMeetingList(filteredArr, false))
      // }
    })
  }, [])

  const handleMeetingID = (value: number) => {
    if (value === 0) {
      setMeetingId(null)
      setPreventChar(false)
      setMeetingHistory(false)
      setCursor(-1)
    } else {
      setMeetingId(value)
      setPreventChar(true)
      setMeetingHistory(true)
      if (error) setError("")
      if (value.toString().length === 10) {
        setDisableButton(false)
      } else {
        setDisableButton(true)
      }
    }
  }

  const handlePassword = (value: string) => {
    setPassword(value)
    if (error) setError("")
  }

  const handleJoin = async () => {
    await user
      .preAuth({
        meetingId: meetingId,
        password: password ? password : undefined,
      })
      .then(async (data: any) => {
        // dispatch(actionCreators.setIsHost(data.host))
        dispatch(actionCreators.meetingID(meetingId as number))
        dispatch(actionCreators.setMeetingInfo(data))
        // const dbStore = LocalDb.loadLocalDb();
        // const meetingInfo = {
        //   meetingId: data.id,
        //   meetingTitle: data.name
        // }
        // LocalDb.setMeetingInfo(dbStore, meetingInfo, () => { });
        if (error) setError("")
        // if(meetingPassword) {
        //   setmeetingPassword(false)
        // }
        LocalDb.set(dbStore, "MeetingList", meetingId, {
          value: meetingId,
          title: data.name,
        })
        navigate(path.JOIN)
      })
      .catch((error: any) => {
        console.log("meeting error", error);
          if (error.status === 404) {
            setError("Invalid Meeting ID");
          } else if (error.status === 401) {
            if (meetingPassword) {
              setError("Invalid Password"); 
            } else {
              dispatch(actionCreators.meetingID(meetingId as number));
              if (error) setError("");
              setmeetingPassword(true);
            }
        } else if (error.reason === "Network Error") {
          let modal = new ModalData({
            message: t("Meeting.NetworkError"),
            type: "NetworkLost",
            closeButton: false,
            buttons: [
              {
                buttonName: t("Dashboard.OK"),
              },
            ],
          })
          dispatch(actionCreators.addModal(modal))
        }
      })
  }
  const handleKeyPress = (event: any) => {
    if (event.charCode === 13) handleJoin()
    // if (environmentLevel !== 'production') {
    //   if (event.code === "Backquote") {
    //     setMeetingId(1234567890)
    //     setPassword('password')
    //     handleJoin()
    //   }
    // }
  }
  const handleKeyPressList = (event: any, value: any) => {
    if (event.charCode === 13) handleMeetingHistory(value)
  }

  const handleMeetingHistory = (id: any) => {
    if (id === "Clear History") {
      if (meetingList.length !== 0) {
        LocalDb.clear(dbStore, "MeetingList")
        setMeetingHistory(false)
        dispatch(actionCreators.setMeetingList([], false))
      }
    } else {
      setMeetingId(id)
      setDisableButton(false)
      setMeetingHistory(false)
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
      if (node && meetingId) {
        return nodeVal?.match(meetingId)
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

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 17 || e.keyCode === 91) {
        setCtrlDown(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.keyCode === 17 || e.keyCode === 91) {
        setCtrlDown(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    // Find the active list item and focus on it
    if (cursor !== -1) {
      const activeItem: HTMLDivElement | undefined | null =
        listRef.current?.querySelector(".active")
      if (activeItem) {
        activeItem.focus()
      }
    } else {
      if (inputRef?.current) {
        const activeInputFiled: HTMLInputElement | null =
          inputRef?.current?.querySelector("#meetingID")
        if (activeInputFiled) activeInputFiled.focus()
      }
    }
  }, [cursor])

  return (
    <div className="flex mt-[90px] mx-6 justify-center flex-col">
      <Modal />
      <div className=" w-[275px] flex justify-center items-center h-6 text-left mb-1 text-[#ff0000]">
        {error ? (
          <span className="w-[17px] h-[18px] px-1.5 py-1 flex items-center justify-center mr-2 rounded-sm bg-[rgba(247,94,29,0.12)]">
            <svg width="2" height="11" viewBox="0 0 2 11" fill="none">
              <path
                d="M0.25 6.75V0H1.75V6.75H0.25ZM0.25 10.5V9H1.75V10.5H0.25Z"
                fill="#F75E1D"
              />
            </svg>
          </span>
        ) : null}
        {error}
      </div>
      <div className="flex">
        {!meetingPassword ? (
          <div className=" relative group" ref={inputRef}>
            <InputFields
              id="meetingID"
              label={t("Meeting.EnterMeetingID")}
              type={"number"}
              name={"meetingId"}
              onChange={(event: any) => handleMeetingID(+event.target.value)}
              onKeyPress={(event: any) => handleKeyPress(event)}
              onKeyDown={(event: any) => handleKeyDown(event)}
              autoFocus={true}
              value={meetingId}
              restClass={"mr-[2px] w-[274px] pb-[9px]"}
            />
            {meetingHistory && meetingList.length > 0 ? (
              <div
                ref={listRef}
                className={`w-full absolute overflow-auto mt-0.5 rounded max-h-[149px] bg-[#404041] text-[#ffffff] `}
              >
                {meetingList
                  .filter((node: any, index: any) => {
                    const nodeVal = node?.value?.toString();
                    if (node && meetingId) {
                      return nodeVal?.match(meetingId);
                    }
                    return true;
                  })
                  .map((meeting: any, index: any) => {
                    return (
                      <div
                        className={`my-0.5 text-left px-3.5 py-1 flex flex-col outline-0 hover:bg-[#ffffff] hover:bg-opacity-10 ${
                          cursor === index &&
                          "bg-[#ffffff] bg-opacity-10 active"
                        }`}
                        onClick={() => handleMeetingHistory(meeting.value)}
                        tabIndex={cursor === index ? 0 : -1}
                        onKeyDown={(event: any) => handleKeyDown(event)}
                        onKeyPress={(event: any) =>
                          handleKeyPressList(event, meeting.value)
                        }
                      >
                        <span className=" text-base ">{meeting.value}</span>
                        <span className=" w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#C4C4C4]">
                          {meeting.title}
                        </span>
                      </div>
                    );
                  })}
                <div
                  className=" mb-0.5 text-left pl-3.5 hover:bg-[#ffffff] hover:bg-opacity-10"
                  onClick={() => handleMeetingHistory("Clear History")}
                >
                  <span className=" text-base italic text-link">
                    {t("Meeting.ClearHistory")}
                  </span>
                </div>
              </div>
            ) : (
              ""
            )}
            <svg
              onClick={() => setMeetingHistory(!meetingHistory)}
              className=" absolute invisible group-hover:visible right-2.5 top-[15px] cursor-pointer"
              width="20"
              height="10"
              viewBox="0 0 10 7"
              fill="none"
            >
              <path
                d="M4.53506 6.13223L0.816309 2.41348C0.559277 2.15645 0.559277 1.74082 0.816309 1.48652L1.43428 0.868555C1.69131 0.611523 2.10693 0.611523 2.36123 0.868555L4.99717 3.50449L7.63311 0.868555C7.89014 0.611523 8.30576 0.611523 8.56006 0.868555L9.17803 1.48652C9.43506 1.74355 9.43506 2.15918 9.17803 2.41348L5.45928 6.13223C5.20772 6.38926 4.79209 6.38926 4.53506 6.13223Z"
                fill="#A7A9AB"
              />
            </svg>
          </div>
        ) : (
          <div className=" relative">
            <InputFields
              id="meetingPassword"
              label={t("Meeting.EnterPassword")}
              type={maskedPassword ? "password" : "text"}
              name={"password"}
              onChange={(event: any) => handlePassword(event.target.value)}
              onKeyPress={(event: any) => handleKeyPress(event)}
              autoFocus={true}
              value={password}
              restClass={"mr-[2px] w-[274px] pr-7"}
            />
            <div
              onClick={() => setMaskedPassword(!maskedPassword)}
              className=" absolute right-2.5 top-3 cursor-pointer"
            >
              {!maskedPassword ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M17.8912 8.54375C16.1965 5.23719 12.8415 3 8.99998 3C5.15842 3 1.80248 5.23875 0.108733 8.54406C0.037246 8.68547 0 8.8417 0 9.00016C0 9.15861 0.037246 9.31484 0.108733 9.45625C1.80342 12.7628 5.15842 15 8.99998 15C12.8415 15 16.1975 12.7612 17.8912 9.45594C17.9627 9.31453 18 9.1583 18 8.99984C18 8.84139 17.9627 8.68516 17.8912 8.54375V8.54375ZM8.99998 13.5C8.10997 13.5 7.23994 13.2361 6.49992 12.7416C5.7599 12.2471 5.18312 11.5443 4.84253 10.7221C4.50193 9.89981 4.41282 8.99501 4.58645 8.12209C4.76008 7.24918 5.18867 6.44736 5.818 5.81802C6.44734 5.18868 7.24916 4.7601 8.12208 4.58647C8.99499 4.41283 9.89979 4.50195 10.7221 4.84254C11.5443 5.18314 12.2471 5.75991 12.7416 6.49993C13.2361 7.23995 13.5 8.10998 13.5 9C13.5003 9.59103 13.3841 10.1763 13.158 10.7224C12.932 11.2685 12.6005 11.7647 12.1826 12.1826C11.7647 12.6005 11.2685 12.932 10.7224 13.158C10.1763 13.3841 9.59101 13.5003 8.99998 13.5V13.5ZM8.99998 6C8.73221 6.00374 8.46617 6.04358 8.20905 6.11844C8.42099 6.40646 8.5227 6.7609 8.49572 7.11748C8.46875 7.47406 8.31487 7.80917 8.06201 8.06203C7.80915 8.31489 7.47405 8.46876 7.11747 8.49574C6.76088 8.52271 6.40644 8.42101 6.11842 8.20906C5.95441 8.81331 5.98402 9.45377 6.20307 10.0403C6.42213 10.6269 6.8196 11.1299 7.33955 11.4787C7.8595 11.8275 8.47574 12.0045 9.10153 11.9847C9.72733 11.965 10.3312 11.7495 10.8281 11.3685C11.325 10.9876 11.6899 10.4604 11.8715 9.86125C12.0531 9.26205 12.0422 8.62099 11.8404 8.0283C11.6386 7.43561 11.256 6.92114 10.7464 6.55728C10.2369 6.19343 9.62609 5.99853 8.99998 6V6Z"
                    fill="#A7A9AB"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <g clip-path="url(#clip0_2979_20895)">
                    <path
                      d="M8.99994 13.05C6.86666 13.05 5.13978 11.3988 4.98088 9.30628L2.03056 7.02619C1.64272 7.51275 1.28581 8.02716 0.997814 8.58966C0.933476 8.71693 0.899955 8.85754 0.899955 9.00014C0.899955 9.14275 0.933476 9.28336 0.997814 9.41063C2.52303 12.3865 5.54253 14.4 8.99994 14.4C9.75678 14.4 10.4869 14.2875 11.1906 14.1058L9.73119 12.9766C9.49016 13.0232 9.24541 13.0477 8.99994 13.05ZM17.8261 14.6841L14.7169 12.2811C15.6614 11.4851 16.4382 10.5093 17.0021 9.41034C17.0664 9.28308 17.0999 9.14247 17.0999 8.99986C17.0999 8.85725 17.0664 8.71664 17.0021 8.58938C15.4768 5.61347 12.4573 3.6 8.99994 3.6C7.55192 3.60176 6.12743 3.96629 4.85656 4.66031L1.2785 1.89478C1.23184 1.85847 1.17849 1.83172 1.12148 1.81604C1.06448 1.80036 1.00495 1.79607 0.946282 1.80341C0.887619 1.81075 0.830977 1.82957 0.779593 1.85881C0.728209 1.88805 0.68309 1.92713 0.646814 1.97381L0.0947204 2.68453C0.0214825 2.77875 -0.0113349 2.89819 0.00348584 3.0166C0.0183066 3.13501 0.0795519 3.24268 0.173752 3.31594L16.7214 16.1052C16.768 16.1415 16.8214 16.1683 16.8784 16.184C16.9354 16.1996 16.9949 16.2039 17.0536 16.1966C17.1123 16.1893 17.1689 16.1704 17.2203 16.1412C17.2717 16.1119 17.3168 16.0729 17.3531 16.0262L17.9054 15.3155C17.9786 15.2212 18.0114 15.1018 17.9965 14.9833C17.9817 14.8649 17.9204 14.7573 17.8261 14.6841ZM12.659 10.6903L11.5537 9.83588C11.6468 9.56685 11.6961 9.28465 11.6999 9C11.7054 8.58326 11.6131 8.17104 11.4304 7.79646C11.2477 7.42187 10.9796 7.09536 10.6478 6.84316C10.316 6.59095 9.9297 6.42007 9.51988 6.34425C9.11006 6.26843 8.68817 6.28979 8.2881 6.40659C8.45769 6.6364 8.54943 6.91439 8.54994 7.2C8.54574 7.29504 8.53122 7.38935 8.50663 7.48125L6.43635 5.88122C7.1555 5.28025 8.06274 4.95069 8.99994 4.95C9.53188 4.9497 10.0587 5.05426 10.5502 5.25769C11.0417 5.46111 11.4882 5.75942 11.8644 6.13556C12.2405 6.51169 12.5388 6.95828 12.7423 7.44978C12.9457 7.94129 13.0502 8.46806 13.0499 9C13.0499 9.60834 12.9012 10.1753 12.659 10.6906V10.6903Z"
                      fill="#A7A9AB"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2979_20895">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
            </div>
          </div>
        )}
        <HomeButton
          id="joinMeeting"
          handleClick={() => handleJoin()}
          color={
            meetingPassword
              ? password === ""
                ? "#c3c3c6"
                : "#404041"
              : !meetingId || disableButton
              ? "#c3c3c6"
              : "#404041"
          }
          // restClass={(meetingPassword && password === '') || (!meetingId && disableButton) ? 'w-[112px] cursor-not-allowed bg-opacity-30' : 'w-[112px] cursor-pointer'}
          restClass={
            meetingPassword
              ? password === ""
                ? "w-[112px] cursor-not-allowed bg-opacity-30"
                : "w-[112px] cursor-pointer"
              : !meetingId || disableButton
              ? "w-[112px] cursor-not-allowed bg-opacity-30"
              : "w-[112px] cursor-pointer"
          }
          // rest={{ disabled: (meetingPassword && password === '') || (!meetingId && disableButton) ? true : false }}
          rest={{
            disabled: meetingPassword
              ? password === ""
                ? true
                : false
              : !meetingId || disableButton
              ? true
              : false,
          }}
        >
          {t("Join")}
        </HomeButton>
      </div>
    </div>
  );
}

export default JoinMeeting
