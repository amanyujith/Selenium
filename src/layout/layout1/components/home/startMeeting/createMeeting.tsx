import React, { useEffect, useState } from "react"
import axios, { AxiosRequestConfig, AxiosInstance } from "axios"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import StartMeetingMenu from "../startMeetingMenu/startMeetingMenu"
import * as constant from "../../../../../constants/constantValues"
import jwt from "jwt-decode"
import path from "../../../../../navigation/routes.path"
import { useNavigate } from "react-router-dom"
import { t } from "i18next"
import LocalDb from "../../../../../dbServices/dbServices"
import { Environment } from "../../../../../config/environmentConfigs/config"
import hoverTimer from "../../../../../utils/hoverTimer"

const CreateMeeting = (props: any) => {
  const [meetingMenu, setMeetingMenu] = useState(false)
  const [host, setHost] = useState(window.location.hostname)
  // const [newMeetingState, setNewMeetingState] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const newMeetingState = useSelector(
    (state: any) => state.Flag.newMeetingState
  )
  const keyCloakToken = useSelector((state: any) => state.Main.keyCloakToken)
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const authInfo = useSelector((state: any) => state.Main.authInfo)
  const tokenStore = LocalDb.loadLocalDB("token", "TokenList", 2)
  const sessionData = Environment.getInstance()
  const deviceDB = LocalDb.loadLocalDB("hoolvaUser", "UserData", 2)
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const handleMeetingMenu = (props: any) => {
    if (authInfo?.token_info?.access_token) {
      setMeetingMenu(!meetingMenu)
    } else {
      // dispatch(actionCreators.setNewMeetingFlag(true))
      Login()
      // keycloak.login({ redirectUri: window.location.origin + '/app2/join/?iuasdf=eyJzbmFtZSI6ImNuZXFqNmllZmIzeSJ9' });

      // setNewMeetingState(!newMeetingState)
    }
  }
  //let host = window.location.hostname;
  let sub = host.split(".")
  useEffect(() => {
    if (host.includes("localhost") || host.includes("us1")) {
      setHost("hoolva.com")
    }
  }, [host])
  const Login = () => {
    // keycloak.login({ redirectUri: window.location.origin + '/app/dashboard' });
    window.open(`https://${host}/sso/?q=&d=web`, "_self", "noreferrer")
  }
  const LogOut = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": authInfo.token_info.access_token || "",
      }
      console.log("data123456", headers)
      await axios
        .get(sessionData.keycloak_logout, { headers: headers })
        .then((data: any) => {
          console.log("data123456", headers)
          dispatch(actionCreators.setLoggedInUserInfo(null))
          dispatch(actionCreators.setKeycloakToken(null))
          dispatch(actionCreators.setAuthentication({}))
          LocalDb.clear(tokenStore, "TokenList")
        })
        .catch((err: any) => {
          console.log("data123456", headers)
          dispatch(actionCreators.setAuthentication({}))
          dispatch(actionCreators.setLoggedInUserInfo(null))
          dispatch(actionCreators.setKeycloakToken(null))
          LocalDb.clear(tokenStore, "TokenList")
        })
      navigate(path.HOME)
    } catch (error) {
      console.log("data123456 error", error)
    }
    if (meetingSession) {
      meetingSession.userLogout()
      meetingSession.leaveMeetingSession()
      hoverTimer(false, dispatch)
      dispatch(actionCreators.setPublisherState(false))
      dispatch(actionCreators.clearMeetingStore())
      dispatch(actionCreators.clearMeetingFlags())
      dispatch(actionCreators.clearParticipantList())
      // dispatch(actionCreators.setTimer("clear"))
      LocalDb.set(deviceDB, "UserData", "meetingInfo", "")
      if (isHost) {
        dispatch(actionCreators.setIsHost(false))
      }
    }
    // window.location.reload();
    dispatch(actionCreators.setLoginState(false))
  }
  const Registration = () => {
    // keycloak.register({ redirectUri: window.location.origin + '/app/dashboard' })
    window.open(`https://${host}/sso/?q=signup&d=web `, "_self", "noreferrer")
  }
  useEffect(() => {
    if (
      authInfo?.token_info?.access_token &&
      authInfo?.token_info?.access_token !== "" &&
      brandingInfo.data
    ) {
      const userInfo = jwt(authInfo?.token_info?.access_token)
      dispatch(actionCreators.setLoginState(true))
      dispatch(actionCreators.setLoggedInUserInfo(userInfo))
      navigate(path.DASHBOARD)
    }
  }, [authInfo?.token_info?.access_token])

  return (
    <div className="flex flex-col justify-center items-center pt-16 pl-12 pr-11 text-left relative h-full">
      <h2 className="text-3xl font-bold text-[#ffffff] w-full">
        {t("Meeting.StartAMeeting")}
      </h2>
      <p className="mt-[28px] text-[18px]	leading-6	text-[#ffffff]">
        {brandingInfo?.data?.brandname} {t("Meeting.BrandMsg")}{" "}
      </p>
      <HomeButton
        id="newMeeting"
        color={"[#ffffff]"}
        restClass={"w-full mt-10 bg-opacity-10 "}
        handleClick={props.handleLoginModal}
      >
        {t("Meeting.NewMeeting")}
      </HomeButton>
      {meetingMenu ? (
        <StartMeetingMenu
          dashboard={false}
          color={"[#292929]"}
          restClass={" top-[242px] right-[43px]"}
        />
      ) : null}
      {/* top-[173px] */}
      {!authInfo?.token_info?.access_token && (
        <div className="flex justify-center mt-10 gap-10">
          <span
            className="text-lg cursor-pointer text-[#1C64D8]"
            // onClick={props.handleModal}
            onClick={() => props.handleLoginModal()}
          >
            {t("Meeting.AlreadyAMember")}
          </span>

          {/* {sub.length <= 2 ? (
            <span
              className="text-lg cursor-pointer text-link"
              onClick={() => Registration()}
            >
              {t("SignUp")}
            </span>
          ) : null} */}
        </div>
      )}
      {/* {authInfo?.token_info?.access_token && (
        <div className="flex justify-center mt-20">
          <span
            className="text-lg cursor-pointer text-link"
            onClick={() => LogOut()}
          >
            {t("LogOut")}
          </span>
        </div>
      )} */}
    </div>
  )
}

export default CreateMeeting
