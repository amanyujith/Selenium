import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import JoinModal from "../../../layout/layout1/components/join/joinModal"
import MemberButton from "../../../layout/layout1/components/meetingButtons/memberButton"
import MicButton from "../../../layout/layout1/components/meetingButtons/micButton"
import MoreButton from "../../../layout/layout1/components/meetingButtons/moreButton"
import ReactionButton from "../../../layout/layout1/components/meetingButtons/reactionButton"
import VideoButton from "../../../layout/layout1/components/meetingButtons/videoButton"
import ScreenShareButton from "../../../layout/layout1/components/meetingButtons/screenshareButton"
import MeetingSvg from "../../../atom/MeetingSvg/meetingSvg"
import path from "../../../navigation/routes.path"
import AudioVideoDropdown from "../../../layout/layout1/components/audioVideoDropdown/audioVideoDropdown"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../store"
import meetListeners from "../../../listeners/meetListeners"
import jwt from "jwt-decode"
import sessionListeners from "../../../listeners/sessionListeners"
import hoverTimer from "../../../utils/hoverTimer"
import LocalDb from "../../../dbServices/dbServices"
import axios from "axios"
import Modal from "../../../layout/layout1/components/modal/modal"
import ModalData from "../../../constructors/modal/modalData"
import { useIsMounted } from "../../../utils/isMount"
import ScreenLoader from "../../../atom/ScreenLoader/screenLoader"
import i18n from "../../../i18n/i18n"
import { t } from "i18next"
import { Environment } from "../../../config/environmentConfigs/config"

const JoinPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const dbStore = LocalDb.loadLocalDB("hoolva", "MeetingList", 1)
  const deviceDB = LocalDb.loadLocalDB("hoolvaUser", "UserData", 2)
  const user = useSelector((state: any) => state.Main.meetingSession)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const publisherState = useSelector((state: any) => state.Flag.publisherState)
  const roomState = useSelector((state: any) => state.Main.roomState)
  const loginState = useSelector((state: any) => state.Flag.loginState)
  const createMeeting = useSelector((state: any) => state.Flag.createMeeting)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const popUp = useSelector((state: any) => state.Flag.popUp)
  const currentDevice = useSelector((state: any) => state.Main.currentDevice)
  const keyCloakToken = useSelector((state: any) => state.Main.keyCloakToken)
  const onReady = useSelector((state: any) => state.Flag.onReady)
  const [userName, setUserName] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [audio, setAudio] = useState(false)
  const [video, setVideo] = useState(false)
  const [email, setEmail] = useState("")
  const [joiningloader, setJoiningLoader] = useState(false)
  const [disableButton, setDisableButton] = useState(true)
  const [networkLost, setNetworkLost] = useState(false)
  const [createState, setCreateState] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const isMounted = useIsMounted()
  const concurrent_meeting_interrupt = true
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const authInfo = useSelector((state: RootState) => state.Main.authInfo)

  const pageVisibility = useSelector(
    (state: any) => state.Flag.PageVisibilityState
  )
  const sessionData = Environment.getInstance()
  useEffect(() => {
    i18n.changeLanguage(
      selfData?.language === "English" ? "en" : selfData?.language
    )
  }, [selfData?.language])

  useEffect(() => {
    LocalDb.get(deviceDB, "UserData", "createState", (data: any) => {
      setCreateState(data.response)
    })
  }, [])

  useEffect(() => {
    if (!user && onReady) {
      navigate(path.AUTHSCREEN)
      // window.location.reload();
    }
  }, [user, onReady])

  useEffect(() => {
    LocalDb.get(deviceDB, "UserData", "createState", (data: any) => {
      setCreateState(data.response)
    })
  }, [])

  useEffect(() => {
    LocalDb.get(deviceDB, "UserData", "currentDevices", (data: any) => {
      setAudio(data.response.audioState)
      setVideo(data.response.videoState)
      if (currentDevice.audioInput !== data.response.currentDevice.audioInput) {
        meetingSession.switchDevices(
          data.response.currentDevice.audioInput,
          "audioInput",
          undefined
        )
      }
      if (
        currentDevice.audioOutput !== data.response.currentDevice.audioOutput
      ) {
        meetingSession.switchDevices(
          data.response.currentDevice.audioOutput,
          "audioOutput",
          "mixedAudio"
        )
      }
      if (currentDevice.videoInput !== data.response.currentDevice.videoInput) {
        meetingSession.switchDevices(
          data.response.currentDevice.videoInput,
          "videoinput",
          undefined
        )
      }
    })

    // if (loginState) {

    //   LocalDb.get(deviceDB, "UserData", 'userName', (data: any) => {
    //     if (data.response) {

    //       handleUserName(data.response)
    //     }
    //   })
    // }
  }, [])

  useEffect(() => {
    if (
      authInfo?.token_info?.access_token &&
      authInfo?.token_info?.access_token !== "" &&
      !loginState
    ) {
      const userInfo = jwt(authInfo?.token_info?.access_token)
      dispatch(actionCreators.setLoginState(true))
      dispatch(actionCreators.setLoggedInUserInfo(userInfo))
      if (meetingSession) {
        meetingSession.AddApiHeader({
          token: authInfo?.token_info?.access_token,
          optional: [
            {
              header: "X-Auth-Token",
              value: authInfo?.token_info?.access_token,
            },
          ],
        })
      }
    }
  }, [authInfo?.token_info?.access_token])

  useEffect(() => {
    if (roomState === "open" && publisherState) {
      navigate(path.MEETING)
      setJoiningLoader(false)
    } else if (roomState === "close" || roomState === "lock") {
      navigate(path.WAITINGROOM)
    }
  }, [roomState, publisherState, navigate])

  useEffect(() => {
    sessionListeners(dispatch, user)
    user.listAvailableDevices().then((device: any) => {
      dispatch(actionCreators.setDeviceList(device))
    })
  }, [dispatch, user])

  const handleUserName = (name: string) => {
    const regEx = /^\S[a-zA-Z ]*$/
    setUserName(name)
    const count = name?.length
    if (regEx.test(name) && count > 2 && count !== 0 && count <= 24)
      setDisableButton(false);
    else if (!disableButton) setDisableButton(true);
  }
  /* eslint-disable */
  useEffect(() => {
    if (loginState) {
      if (
        loggedInUserInfo?.display_name &&
        loggedInUserInfo?.display_name != "undefined"
      ) {
        handleUserName(loggedInUserInfo?.display_name)
      } else {
        handleUserName(loggedInUserInfo?.given_name)
      }
    }
  }, [loggedInUserInfo, loginState])
  const handleEmailId = (email: any) => {
    /* eslint-disable */
    const regEx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    setEmail(email)
    if (!regEx.test(email)) {
      setEmailError(true)
    } else {
      if (emailError) setEmailError(false)
    }
  }
  const handleAudio = () => {
    setAudio(!audio)
  }
  const handleVideo = () => {
    setVideo(!video)
  }

  const handleJoinButton = async () => {
    const name = userName.trim()
    console.log(loginState, authInfo, "NCSSSSSS")
    if (loginState && authInfo?.token_info?.access_token) {
      const headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": authInfo?.token_info?.access_token || "",
      }
      // const display_name =
      // https://us2-cluster.hoolva.com/v1
      // https://us3-cluster.hoolva.com/v1/updateUser/null
      try {
        await axios.post(
          sessionData.update_user(loggedInUserInfo?.sub),
          { display_name: name },
          { headers: headers }
        )
      } catch (error) {}
    }

    if (loginState && (createMeeting || createState)) {
      user
        .createInstantMeeting()
        .then(async (response: any) => {
          user
            .preAuth({ meetingId: response.id })
            .then((data: any) => {
              dispatch(actionCreators.setIsHost(data.host))
              dispatch(actionCreators.setMeetingId(response.id))
              dispatch(actionCreators.setMeetingInfo(data))
              LocalDb.set(dbStore, "MeetingList", response.id, {
                value: response.id,
                title: data.name,
              })
              startMeeting(audio, video, name, {
                email,
                concurrent_meeting_interrupt,
              })
            })
            .catch((error: any) => {
              if (error.reason === "Network Error") {
                let modal = new ModalData({
                  message: t("NetworkError"),
                  type: "Networklost",
                  closeButton: false,
                  buttons: [
                    {
                      buttonName: t("Dashboard.OK"),
                    },
                  ],
                })
                setNetworkLost(true)
                dispatch(actionCreators.addModal(modal))
              }
            })
        })
        .catch((error: any) => {
          if (error.reason === "Network Error") {
            let modal = new ModalData({
              message: t("NetworkError"),
              type: "Networklost",
              closeButton: false,
              buttons: [
                {
                  buttonName: t("Dashboard.OK"),
                },
              ],
            })
            setNetworkLost(true)
            dispatch(actionCreators.addModal(modal))
          }
        })
    } else {
      startMeeting(audio, video, name, {
        email,
        concurrent_meeting_interrupt,
      })
    }
    LocalDb.set(deviceDB, "UserData", "createState", false)
  }

  const startMeeting = (
    audio: boolean,
    video: boolean,
    name: string,
    options: {
      email: string
      concurrent_meeting_interrupt: boolean
    }
  ) => {
    LocalDb.set(deviceDB, "UserData", "currentDevices", {
      audioState: audio,
      videoState: video,
      currentDevice: currentDevice,
    })
    if (!loginState) {
      LocalDb.set(deviceDB, "UserData", "userName", name)
    }
    meetListeners(dispatch, navigate, participantList, user)
    // dispatch(actionCreators.setTimer("add"))
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.clearMeetingFlags())
    hoverTimer(true, dispatch)
    if (isMounted.current) user.startMeetingSession(audio, video, name, options)
  }

  const handlePopUp = (
    event: any,
    type:
      | "meetingInfoFlag"
      | "endButtonFlag"
      | "moreOptionFlag"
      | "reactionFlag"
      | "filterMenuFlag"
      | "closeAll"
  ) => {
    event.stopPropagation()
    dispatch(actionCreators.setPopUp(type))
  }

  return (
    <div>
      {brandingInfo?.data && onReady ? (
        <div
          onClick={(e) => handlePopUp(e, "closeAll")}
          className="h-screen w-screen grid place-items-center bg-primary"
        >
          <Modal />
          <MeetingSvg />
          {onReady && (
            <JoinModal
              handleUserName={handleUserName}
              handleJoinButton={handleJoinButton}
              audio={audio}
              video={video}
              setJoiningLoader={setJoiningLoader}
              joiningloader={joiningloader}
              userName={userName}
              disableButton={disableButton}
              emailError={emailError}
              handleEmailId={handleEmailId}
              handleNetworkLost={networkLost}
              setNetworkLost={setNetworkLost}
              createState={createState}
            />
          )}

          <div className=" w-full flex justify-between items-center absolute bottom-0 px-10 py-3">
            <ReactionButton />
            <div className="flex">
              <div className="flex z-10">
                <MicButton
                  id="audioButton"
                  onClick={handleAudio}
                  audio={audio}
                  joiningloader={joiningloader}
                />
                <VideoButton
                  id="videoButton"
                  onClick={handleVideo}
                  video={video}
                  joiningloader={joiningloader}
                />
              </div>
              <ScreenShareButton />
            </div>
            <div className="flex">
              <MemberButton length={participantList?.length} />
              <span className="z-10">
                {popUp.moreOptionFlag ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className=" w-[371px] absolute bottom-24 right-16 bg-primary-500 group-hover:bg-opacity-10 "
                  >
                    <AudioVideoDropdown />
                  </div>
                ) : null}
                <MoreButton />
              </span>
            </div>
          </div>
          <div className="w-full h-full backdrop-blur-xl lg:backdrop-blur-lg absolute"></div>
        </div>
      ) : (
        <ScreenLoader />
      )}{" "}
    </div>
  )
}

export default JoinPage
