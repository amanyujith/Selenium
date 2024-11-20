import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import HomeButton from "../../../atom/HomeButton/homeButton"
import * as constant from "../../../constants/constantValues"
import ModalData from "../../../constructors/modal/modalData"
import Modal from "../../../layout/layout1/components/modal/modal"
import path from "../../../navigation/routes.path"
import { actionCreators } from "../../../store"
import waiting from "./Ellipse.png"
import hoverTimer from "../../../utils/hoverTimer"
import LocalDb from "../../../dbServices/dbServices"
import { t } from "i18next"
import { Environment } from "../../../config/environmentConfigs/config"

const WaitingRoom = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const roomState = useSelector((state: any) => state.Main.roomState)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const publisherState = useSelector((state: any) => state.Flag.publisherState)
  const hostEndForAll = useSelector((state: any) => state.Flag.hostEndForAll)
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const loginState = useSelector((state: any) => state.Flag.loginState)
  const meetingInfo = useSelector((state: any) => state.Main.meetingInfo)
  const theme = useSelector((state: any) => state.Main.setTheme)
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const deviceDB = LocalDb.loadLocalDB("hoolvaUser", "UserData", 2)
  const sessionData = Environment.getInstance()
  useEffect(() => {
    if (!meetingSession) {
      navigate(path.AUTHSCREEN)
    }
  }, [meetingSession])

  const handleLeaveButton = () => {
    meetingSession.leaveMeetingSession()
    hoverTimer(false, dispatch)
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.setRoomState(""))
    dispatch(actionCreators.removeNotification())
    if (loginState) navigate(path.DASHBOARD)
    else navigate(path.HOME)
  }

  const closeWaitingRoom = () => {
    if (loginState) navigate(path.DASHBOARD)
    else navigate(path.HOME)
  }

  //Host end modal
  useEffect(() => {
    if (hostEndForAll) {
      let modal = new ModalData({
        message: t("Meeting.TheHostHasEndedTheMeeting"),
        type: "HostMessage",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
            callback: endMeeting,
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    }
  }, [hostEndForAll])

  const endMeeting = () => {
    // stopTimer();
    hoverTimer(false, dispatch)
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())
    if (isHost) {
      dispatch(actionCreators.setIsHost(false))
    }
    navigate(path.FEEDBACK)
    // window.location.reload();
  }

  useEffect(() => {
    if (roomState === "open" && publisherState) navigate(path.MEETING)
    else if (roomState === "deny") {
      let modal = new ModalData({
        message: t("Meeting.NotAllowed"),
        type: "HostMessage",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
            callback: closeWaitingRoom,
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    }
  }, [roomState, publisherState])

  const Login = () => {
    LocalDb.set(deviceDB, "UserData", "meetingInfo", meetingInfo.sname)
    meetingSession.leaveMeetingSession()
    hoverTimer(false, dispatch)
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.setRoomState(""))
    dispatch(actionCreators.removeNotification())
    // window.open(sessionData.keycloak_rootUrl, "_self")
    navigate(path.HOME)
  }

  return (
    <div className=" h-screen w-screen grid place-items-center text-center bg-[#ffffff]">
      <div>
        <img
          className=" h-10 mt-16 mx-auto"
          src={brandingInfo?.data?.logos?.logoDark}
        />
        <div className=" flex flex-col text-center mt-12 text-[#000000]">
          <span className=" text-3xl leading-9">{t("Meeting.PleaseWait")}</span>
          {roomState === "close" ? (
            <span className=" text-lg leading-5">
              {t("Meeting.HostWillLetYouSoonIn")}
            </span>
          ) : roomState === "lock" ? (
            <span className=" text-lg leading-5">
              {t("Meeting.HostSoonStart")}
            </span>
          ) : (
            <span className=" text-lg leading-5">
              {t("Meeting.Joining")}...
            </span>
          )}
        </div>
        <div className="mt-6">
          <img
            className="animate-spin w-72 h-72 mx-auto my-auto"
            src={waiting}
            alt="waiting"
          />
        </div>
        <HomeButton
          handleClick={handleLeaveButton}
          color={"primary-200"}
          restClass={"w-[123px] mt-12 text-[14px] "}
        >
          {t("Meeting.LeaveMeeting")}
        </HomeButton>
        <div className=" mt-7">
          {t("Meeting.IfUAre")}
          <span onClick={() => Login()} className=" cursor-pointer text-link">
            {` ${t("SignIn")} `}
          </span>
          {t("Meeting.ToStart")}
        </div>
      </div>
      <Modal />
    </div>
  )
}

export default WaitingRoom
