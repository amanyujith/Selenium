import React, { useEffect } from "react"
import { batch, useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import LocalDb from "../dbServices/dbServices"
import { RootState, actionCreators } from "../store"
import { Environment } from "../config/environmentConfigs/config"
import axios from "axios"
import hoverTimer from "./hoverTimer"
import path from "../navigation/routes.path"

const LogoutSession = () => {
  const authInfo = useSelector((state: RootState) => state.Main.authInfo)
  const tokenStore = LocalDb.loadLocalDB("token", "TokenList", 2)
  const sessionData = Environment.getInstance()
  const deviceDB = LocalDb.loadLocalDB("hoolvaUser", "UserData", 2)
  const dispatch = useDispatch()
  const meetingSession = useSelector(
    (state: RootState) => state.Main.meetingSession
  )
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const clearLoginSession = useSelector(
    (state: RootState) => state.Main.clearLoginSession
  )
  const navigate = useNavigate()
  const clearSession = () => {
    // batch(() => {
    dispatch(actionCreators.setLoginState(false))
    dispatch(actionCreators.setLoggedInUserInfo(null))
    dispatch(actionCreators.setKeycloakToken(null))
    dispatch(actionCreators.clearChatData())
    dispatch(actionCreators.clearPbxStore())
    dispatch(actionCreators.setAuthentication({}))
    // })
    navigate(path.HOME)
    LocalDb.clear(tokenStore, "TokenList")
  }

  useEffect(() => {
    if (clearLoginSession) {
      const headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": authInfo.token_info.access_token || "",
      }
      axios
        .get(sessionData.keycloak_logout, { headers: headers })
        .then((data: any) => {
          clearSession()
        })
        .catch((err: any) => {
          clearSession()
        })
      if (chatInstance) {
        chatInstance.closeConnection()
        chatInstance.userLogout()
      }
      if (meetingSession) {
        meetingSession.userLogout()
        meetingSession.leaveMeetingSession()
        hoverTimer(false, dispatch)
        batch(() => {
          dispatch(actionCreators.clearMeetingStore())
          dispatch(actionCreators.clearMeetingFlags())
          dispatch(actionCreators.clearParticipantList())
          dispatch(actionCreators.clearChatData())
          dispatch(actionCreators.clearPbxStore())
        })
        LocalDb.set(deviceDB, "UserData", "meetingInfo", "")
      }
      dispatch(actionCreators.clearLoginSession(false))
    }
  }, [clearLoginSession])
  return <div></div>
}

export default LogoutSession
