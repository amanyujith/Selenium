import axios from "axios"
import { useEffect, useRef } from "react"
import { batch, useDispatch, useSelector } from "react-redux"
import * as Actions from "../store/action-creators"

import { Environment } from "../config/environmentConfigs/config"
import {
  accessTokenRefreshPayload,
  access_token_header,
  generalApiHeader,
  fetchTokenFromDb,
  setTokenToDb,
  clearDB,
} from "./keycloackconfig.util"
import { actionCreators } from "../store"
import { useLocation, useNavigate } from "react-router-dom"
import path from "../navigation/routes.path"
import jwt from "jwt-decode"
import LocalDb from "../dbServices/dbServices"
import { networkHook } from "hdmeet"
import * as QueryString from "query-string"

const KeycloackReferesh = () => {
  const dispatch = useDispatch()

  const timeoutref = useRef<null | NodeJS.Timeout>(null)
  const { EnvironmentLevel, keycloak_api_login, keycloak_get_tenant } =
    Environment.getInstance()
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const chatsession = useSelector((state: any) => state.Chat.chatInstance)
  const navigate = useNavigate()
  const authInfo = useSelector((state: any) => state.Main.authInfo)
  const location = useLocation()
  const pageVisibility = useSelector(
    (state: any) => state.Flag.PageVisibilityState
  )

  useEffect(() => {
    //backgroundhandler. call RequestRefreshTimer when coming back to foreground
    if (pageVisibility) {
      RequestRefreshTimer()
    }
  }, [pageVisibility])

  useEffect(() => {
    /* add token to header*/
    if (authInfo?.token_info?.access_token) {
      ;[meetingSession, chatsession].forEach((instance) => {
        instance?.AddApiHeader(
          generalApiHeader(authInfo.token_info.access_token)
        )
      })
      const cb = async () => {
        return getTenantData(authInfo.username).then((tenantInfo: any) => {
          const { sname, realm } = tenantInfo
          return axios
            .post(
              keycloak_api_login(realm),
              new URLSearchParams({
                refresh_token: authInfo.token_info.refresh_token,
                grant_type: "refresh_token",
                client_id: sname,
              }),
              access_token_header
            )
            .then((response: any) => {
              ;[meetingSession, chatsession]?.forEach((instance) => {
                instance?.AddApiHeader(
                  generalApiHeader(response.data.access_token)
                )
              })
              return response
            })
        })
      }
      chatsession.reAuthenticateCallback(cb)
      dispatch(actionCreators.setLoginState(true))
    }
  }, [authInfo, chatsession, meetingSession])

  useEffect(() => {
    networkHook(0).then(() => {
      const params: any = QueryString.parse(location.search)
      if (Object.keys(authInfo).length > 0) {
        // check the validity of refresh token
        if (authInfo.token_info?.refresh_token) {
          RequestRefreshTimer()
        } else {
          // improper data. logging out
          dispatch(actionCreators.setOnReady(true))
          if (!params.rtdf) {
            dispatch(actionCreators.setLoggedInUserInfo(null))
            dispatch(actionCreators.setKeycloakToken(null))
            dispatch(actionCreators.setLoginState(false))
            dispatch(actionCreators.clearChatData())
            dispatch(actionCreators.clearPbxStore())
            clearDB()
          }
        }
      } else {
        /* check if data present on DB */
        fetchTokenFromDb()
          .then((tokenInfo: any) => {
            if (tokenInfo.token_info.refresh_token) {
              console.log(tokenInfo, "tokenINffoooo")
              requestAccessTokenWrapper(tokenInfo)
            } else {
              /* not logged in */
              //handle navigate
              dispatch(actionCreators.setOnReady(true))
              if (!params?.rtdf) {
                console.log(tokenInfo, "tokenINfooo")
                dispatch(actionCreators.setLoggedInUserInfo(null))
                dispatch(actionCreators.setKeycloakToken(null))
                dispatch(actionCreators.setAuthentication({}))
                dispatch(actionCreators.setLoginState(false))
                dispatch(actionCreators.clearChatData())
                dispatch(actionCreators.clearPbxStore())
                clearDB()
              }
            }
          })
          .catch((e: any) => {
            console.log("tokenInfo")
            //handle navigate
            dispatch(actionCreators.setOnReady(true))
            if (!params?.rtdf) {
              dispatch(actionCreators.setLoginState(false))
              dispatch(actionCreators.clearChatData())
              dispatch(actionCreators.clearPbxStore())
              clearDB()
            }
            /* roll back/ log out to avoid future issue */
            //clear DB / logout
          })
      }
    })
  }, [authInfo])

  const requestAccessToken = async (token?: any) => {
    const { refresh_token } = token
      ? token?.token_info
      : authInfo?.token_info ?? {}
    const { username } = token ?? authInfo
    getTenantData(username)
      .then((tenantInfo: any) => {
        const { sname, realm } = tenantInfo
        axios
          .post(
            keycloak_api_login(realm),
            new URLSearchParams({
              refresh_token: refresh_token,
              grant_type: "refresh_token",
              client_id: sname,
            }),
            access_token_header
          )
          .then((response: any) => {
            handleTokenResponse(response, token)
          })
          .catch((e) => {
            const params: any = QueryString.parse(location.search)
            dispatch(actionCreators.setOnReady(true))
            if (!params.rtdf) {
              dispatch(actionCreators.setLoggedInUserInfo(null))
              dispatch(actionCreators.setKeycloakToken(null))
              dispatch(actionCreators.setAuthentication({}))
              dispatch(actionCreators.setLoginState(false))
              dispatch(actionCreators.clearChatData())
              dispatch(actionCreators.clearPbxStore())
              clearDB()
            }
            // handle requestAccessToken error
          })
      })
      .catch((e) => {
        const params: any = QueryString.parse(location.search)
        dispatch(actionCreators.setOnReady(true))
        if (!params.rtdf) {
          clearDB()
          batch(() => {
            dispatch(actionCreators.setLoggedInUserInfo(null))
            dispatch(actionCreators.setKeycloakToken(null))
            dispatch(actionCreators.setAuthentication({}))
            dispatch(actionCreators.setLoginState(false))
            dispatch(actionCreators.clearChatData())
            dispatch(actionCreators.clearPbxStore())
          })
        }
      })
  }

  const requestAccessTokenWrapper = (token?: any) => {
    if (navigator.onLine) {
      networkHook(0).then(() => {
        requestAccessToken(token)
      })
    } else {
      setTimeout(() => {
        requestAccessTokenWrapper(token)
      }, 2000)
    }
  }

  const getTenantData = async (username: string) => {
    if (username.length) {
      return axios
        .get(keycloak_get_tenant(username))
        .then((res) => {
          return res.data
        })
        .catch((e) => {
          throw e
          //TODO: handle getTenantData error
        })
    }
  }

  const RequestRefreshTimer = () => {
    if (timeoutref?.current) {
      clearTimeout(timeoutref?.current)
    }
    /* Setting time for refresh */
    //TODO:- check timezone / fetch new token if it is different
    const refresh_time =
      authInfo?.token_info?.expires_in / 2 -
      Math.floor((Date.now() - authInfo?.logged_time) / 1000)
    timeoutref.current = setTimeout(() => {
      requestAccessTokenWrapper()
    }, refresh_time * 1000)
  }

  useEffect(() => {
    if (timeoutref.current && !authInfo.token_info) {
      clearTimeout(timeoutref.current)
    }
  }, [authInfo])

  const handleTokenResponse = async (response: any, token: any) => {
    const { username, tenant } = token ?? authInfo
    console.log(response, "responseDataaa")
    if (response.data.access_token) {
      const token_data = {
        token_info: response.data,
        logged_time: Date.now(),
        username: username,
        tenant: tenant,
      }
      batch(() => {
        dispatch(actionCreators.setAuthentication(token_data))
        dispatch(actionCreators.setLoginState(true))
        dispatch(
          actionCreators.setLoggedInUserInfo(jwt(response.data.access_token))
        )
        dispatch(actionCreators.setOnReady(true))
        dispatch(actionCreators.setKeycloakToken(response.data.access_token))
      })
      /* Sync data to db */
      clearDB()
      setTokenToDb(token_data)
    }
  }

  return null
}
export default KeycloackReferesh
