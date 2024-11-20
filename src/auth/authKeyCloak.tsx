import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../store"
import { ChatSession, MeetingSession } from "hdmeet"
import ChatListeners from "../layout/layout1/components/dashboard/Chat/listeners/chatListener"
import { useNotification } from "../layout/layout1/components/dashboard/Chat/hooks/useNotification"
import pbxListeners from "../layout/layout1/components/dashboard/pbx-call/listeners/pbxListeners"
import axios from "axios"
import { Environment } from "../config/environmentConfigs/config"
const AuthKeyCloak = (props: any) => {
  const keyCloakToken = useSelector((state: any) => state.Main.keyCloakToken)
  const authInfo = useSelector((state: any) => state.Main.authInfo)

  const dispatch = useDispatch()
  const sendNotification = useNotification()
  const sessionData = Environment.getInstance()
  const apiKey = sessionData.apikey
  const logLevel = sessionData.loglevel
  const environmentLevel = sessionData.EnvironmentLevel
  const onReady = useSelector((state: any) => state.Flag.onReady)
  const permissionSettings = useSelector(
    (state: RootState) => state.Main.permissionSettings
  )
  const loginState = useSelector((state: any) => state.Flag.loginState)
  const meetingSession = useMemo(() => {
    const session = new MeetingSession(apiKey, logLevel, environmentLevel, {
      isGrafanalogger: true,
    })
    dispatch(actionCreators.setMeetingSession(session))
    dispatch(actionCreators.setMeetingEnviornemnt(environmentLevel))
    pbxListeners(dispatch, session)
    return session
  }, [])

  const chatInstance = useMemo(() => {
    const session = new ChatSession(apiKey, logLevel, environmentLevel, {
      isGrafanalogger: true,
    })
    dispatch(actionCreators.setChatInstance(session))
    ChatListeners(
      dispatch,
      session,
      props.navigate,
      sendNotification,
      meetingSession
    )
    return session
  }, [])

  useEffect(() => {
    if (loginState) {
      dispatch(actionCreators.setOnReady(true))
      chatInstance?.initialiseSession({
        msg_count: 25,
        chat_count: 10,
        grp_msg_count: 25,
        grp_chat_count: 100,
      })
      chatInstance?.grafanaLogger(["Client : Mqtt Initialising"])
    }
  }, [loginState, chatInstance])

  useEffect(() => {
    if (
      chatInstance &&
      authInfo?.token_info?.access_token &&
      !Object.keys(permissionSettings)?.length
    )
      chatInstance
        ?.getPermission()
        .then((res: any) => dispatch(actionCreators.permissionSettings(res)))
  }, [chatInstance, authInfo, loginState])

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      "X-Auth-Token": authInfo?.token_info?.access_token || "",
    }

    if (authInfo?.token_info?.access_token && loginState)
      axios
        .get(sessionData.siloute_api, { headers: headers })
        .then((res: any) => {
          console.log(res?.data?.[0], "silDetAuth")
          if (res?.data?.[0])
            dispatch(actionCreators.setSilDetails(res?.data?.[0]))
        })
  }, [loginState])

  useEffect(() => {
    if (props.userIsloggedOut) {
      dispatch(actionCreators.setKeycloackLoggedInState(false))
    }
  }, [props.userIsloggedOut])
  useEffect(() => {
    dispatch(actionCreators.setKeycloakToken(props.token))
  }, [props.token])
  return null
}
export default AuthKeyCloak
