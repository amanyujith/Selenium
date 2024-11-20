import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import InputFields from "../../../../atom/InputField/inputField"
import { actionCreators } from "../../../../store"
import path from "../../../../navigation/routes.path"
import HomeButton from "../../../../atom/HomeButton/homeButton"
import hoverTimer from "../../../../utils/hoverTimer"
import LocalDb from "../../../../dbServices/dbServices"
import Notification from "./Notification/Notification"
import { detect } from "detect-browser"
import SafariPopUpModal from "./TodaysMeetingComponents/SafariPopUpModal"
import { t } from "i18next"
import { getURL } from "../../../../utils/linkManipulation"

const JoinMeetingField = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const browser = detect()
  const [modal, setModal] = useState(false)
  const environmentLevel = useSelector(
    (state: any) => state.Main.environmentLevel
  )
  const credentials = useSelector((state: any) => state.Chat.meetCredentials);
  const [maskedPassword, setMaskedPassword] = useState(true)
  const [meetingPassword, setmeetingPassword] = useState(
    credentials.id === "" ? false : true
  );
  const [meetingId, setMeetingId] = useState<number | null | "">(
    credentials.id === "" ? null : credentials.id
  );
  const [password, setPassword] = useState("")
  const [meetingHistory, setMeetingHistory] = useState(false)
  const [disableButton, setDisableButton] = useState(true)
  const [error, setError] = useState("")
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const [preventChar, setPreventChar] = useState(false)
  const ref = useRef<any>(null)
  const [cursor, setCursor] = useState(-1)
  const [ctrlDown, setCtrlDown] = useState(false)
  const meetingList = useSelector((state: any) => state.Main.meetingList)
  const [loader, setLoader] = useState(false);
  // const listRef = useRef<HTMLDivElement>(null);
  // const inputRef = useRef<HTMLInputElement>(null);

  const handleMeetingID = (value: number) => {
    if (value == 0) {
      setMeetingId(null)
      setPreventChar(false)
      setMeetingHistory(false)
      dispatch(actionCreators.meetCredentials("", ""));
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

  const dbStore = LocalDb.loadLocalDB("hoolva", "MeetingList", 1)

  useEffect(() => {
    hoverTimer(false, dispatch)
    LocalDb.getAllKeys(dbStore, "MeetingList", (data: any) => {
      const meetingListData = data.response
      let filteredArr: any = []
      meetingListData.map((key: any) => {
        LocalDb.get(dbStore, "", key, (data: any) => {
          filteredArr.push(data.response)
        })
      })

      dispatch(actionCreators.setMeetingList(filteredArr, false))
      // }
    })
  }, [])

  const setModalclose = () => {
    setModal(false)
  }

  //  const handleKeyPressList = (event: any, value: any) => {
  //    if (event.charCode === 13) handleMeetingHistory(value);
  //  };

  //  const handleMeetingHistory = (id: any) => {
  //    if (id === "Clear History") {
  //      if (meetingList.length !== 0) {
  //        LocalDb.clear(dbStore, "MeetingList");
  //        setMeetingHistory(false);
  //        dispatch(actionCreators.setMeetingList([], false));
  //      }
  //    } else {
  //      setMeetingId(id);
  //      setDisableButton(false);
  //      setMeetingHistory(false);
  //    }
  //  };

  const handlePassword = (value: string) => {
    setPassword(value)
    if (error) setError("")
  }

  const handleKeyPress = (event: any) => {
    if (event.charCode === 13) handleJoin()
  }

  const handleJoin = async () => {
    setLoader(true);
    await meetingSession
      .preAuth({
        meetingId: meetingId,
        password: password ? password : undefined,
      })
      .then(async (data: any) => {
        // dispatch(actionCreators.setIsHost(data.host))
        dispatch(actionCreators.meetingID(meetingId as number))
        dispatch(actionCreators.setMeetingInfo(data))

        if (error) setError("")
        LocalDb.set(dbStore, "MeetingList", meetingId, {
          value: meetingId,
          title: data.name,
        })
        await meetingSession
          .meetingInvite(data.roomuuid)
          .then((res: any) => {
            console.log(res, "responseee")
            const newUrl = getURL(res?.meeting_url) //remove Sub Domain
            const result = newUrl?.replace(
              "/launch-meetings/?iuasdf",
              "/app/?rtdf"
            )

            //LocalDb.set(deviceDB, "UserData", "loggedinState", name)
            const newWindow = window.open(result, "_blank")
            if (
              browser?.name === "safari" &&
              (!newWindow ||
                newWindow.closed ||
                typeof newWindow.closed == "undefined")
            ) {
              setModal(true)
            }
            setPassword("")
            setError("")
            setmeetingPassword(false)
            setMeetingId("")
            dispatch(actionCreators.meetCredentials("", ""));
            setLoader(false);
          })
          .catch((error: any) => {
            setLoader(false);
          })
        // navigate(path.JOIN);
      })
      .catch((error: any) => {
        console.log("meeting error", error)
        if (error.status === 404) {
          setError("Invalid Meeting ID")
        } else if (error.status === 401) {
          if (meetingPassword) {
            setError("Invalid Password")
          } else {
            dispatch(actionCreators.meetingID(meetingId as number))
            dispatch(actionCreators.meetCredentials(meetingId, password));
            if (error) setError("")
            setmeetingPassword(true)
          }
        }
        setLoader(false);
      })
  }
  const setBack = () => {
    setPassword("")
    setError("")
    setmeetingPassword(false)
    dispatch(actionCreators.meetCredentials("", ""));
  }

  // useEffect(() => {
  //   // Find the active list item and focus on it
  //   if (cursor !== -1) {
  //     const activeItem: HTMLDivElement | undefined | null =
  //       listRef.current?.querySelector(".active");
  //     if (activeItem) {
  //       activeItem.focus();
  //     }
  //   } else {
  //     if (inputRef?.current) {
  //       const activeInputFiled: HTMLInputElement | null =
  //         inputRef?.current?.querySelector("#meetingID");
  //       if (activeInputFiled) activeInputFiled.focus();
  //     }
  //   }
  // }, [cursor]);

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
        return nodeVal.match(meetingId)
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

  return (
    <div className="flex">
      {!meetingPassword ? (
        <div
          className={`border-[1px] border-solid rounded-[7px] text-left box-border h-[36px] w-[215px] mr-2
          ${error === "" ? "border-[#B1B1B1]" : "border-[#F65E1D]"}`}
        >
          <div className=" text-[#F65E1D] text-[9px] italic ml-3 w-fit h-fit">
            {error}
          </div>
          <div
            // ref={inputRef}
            className={`flex flex-row ${error === "" ? "mt-2" : ""}`}
          >
            <InputFields
              ref={ref}
              id="meetingID"
              label={t("Dashboard.EnterMeetingID")}
              type={"number"}
              name={"meetingId"}
              onChange={(event: any) => handleMeetingID(+event.target.value)}
              onKeyPress={(event: any) => handleKeyPress(event)}
              onKeyDown={(event: any) => handleKeyDown(event)}
              autoFocus={true}
              value={meetingId}
              restClass={
                "text-xs outline-none text-[#B3B3B3] border-[0px] w-[195px] h-[20px] ml-1 bg-[#293241]"
              }
            />
            {meetingId && meetingId.toString().length > 0 && (
              <div className={`${error === "" ? "mt-[5px]" : ""}`}>
                <svg
                  className="cursor-pointer"
                  onClick={() => {
                    setMeetingId("");
                    dispatch(actionCreators.meetCredentials("", ""));
                  }}
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.729688 7.87943L0.117188 7.26693L3.38385 4.00026L0.117188 0.733594L0.729688 0.121094L3.99635 3.38776L7.26302 0.121094L7.87552 0.733594L4.60885 4.00026L7.87552 7.26693L7.26302 7.87943L3.99635 4.61276L0.729688 7.87943Z"
                    fill="#A7A9AB"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`border-[1px] border-solid rounded-[7px] text-left box-border h-[36px] w-[215px] mr-2
          ${error === "" ? "border-[#B1B1B1]" : "border-[#F65E1D]"}`}
          >
            <div className=" text-[#F65E1D] text-[9px] italic ml-3 w-fit h-fit">
              {error}
            </div>
            <div className={`flex flex-row ${error === "" ? "mt-2" : ""}`}>
              <InputFields
                id="meetingPassword"
                label={t("Dashboard.EnterPassword")}
                type={maskedPassword ? "password" : "text"}
                name={"password"}
                onChange={(event: any) => handlePassword(event.target.value)}
                onKeyPress={(event: any) => handleKeyPress(event)}
                autoFocus={true}
                autocomplete={"new-password"}
                value={password}
                restClass={
                  "text-xs text-[#B3B3B3] outline-none border-[0px]  bg-[#293241] w-[155px] ml-2 px-[1px] h-[20px] ml-1"
                }
              />
              <div
                className={` flex flex-row${error === "" ? "mt-[5px]" : ""}`}
              >
                <div
                  onClick={() => setMaskedPassword(!maskedPassword)}
                  className="cursor-pointer ml-1"
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
                <svg
                  className="cursor-pointer ml-[7px] mt-1 "
                  onClick={setBack}
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.729688 7.87943L0.117188 7.26693L3.38385 4.00026L0.117188 0.733594L0.729688 0.121094L3.99635 3.38776L7.26302 0.121094L7.87552 0.733594L4.60885 4.00026L7.87552 7.26693L7.26302 7.87943L3.99635 4.61276L0.729688 7.87943Z"
                    fill="#A7A9AB"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      <HomeButton
        id="joinMeeting"
        handleClick={() => handleJoin()}
        restClass={
          meetingPassword
            ? password === ""
              ? "relative -left-0.5 min-w-[60px] font-bold rounded-[7px] text-[14px] px-1 text-[#ffffff] bg-[#D1CCC7] h-[35px] cursor-not-allowed"
              : "relative -left-0.5 min-w-[60px] font-bold rounded-[7px] text-[14px] px-1 text-[#ffffff] bg-[#E57600] hover:bg-[#CC6900]  h-[35px] w-[60px] cursor-pointer"
            : !meetingId || disableButton
            ? "relative -left-0.5 min-w-[60px] font-bold rounded-[7px] text-[14px] text-[#ffffff]  bg-[#D1CCC7] h-[35px] w-[60px] cursor-not-allowed px-1"
            : "relative -left-0.5 min-w-[60px] font-bold rounded-[7px] text-[14px] text-[#ffffff] bg-[#E57600] hover:bg-[#CC6900] h-[35px] w-[60px] cursor-pointer px-1"
        }
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
        {loader ? (
          <div
            className={`text-[#767676] flex flex-col justify-center items-center w-full h-full `}
          >
            <svg
              aria-hidden="true"
              className={`inline ${"w-6 h-6 ml-1"} mr-2 text-[#ffffff] animate-spin dark:text-gray-600 fill-blue-600`}
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#ffffff"
              />

              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#222"
              />
            </svg>
          </div>
        ) : (
          <div className="-mt-[2px]">{t("Dashboard.Join")}</div>
        )}
      </HomeButton>

      {modal && <SafariPopUpModal setclose={setModalclose} />}
    </div>
  );
}

export default JoinMeetingField
