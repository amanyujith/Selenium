import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../store"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router"
import path from "../../navigation/routes.path"
import ScreenLoader from "../../atom/ScreenLoader/screenLoader"
import * as QueryString from "query-string"
import LocalDb from "../../dbServices/dbServices"
import { detect } from "detect-browser"

const AuthScreen = () => {
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const onReady = useSelector((state: any) => state.Flag.onReady)
  const browser = detect()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const dbStore = LocalDb.loadLocalDB("hoolva", "MeetingList", 1)
  const deviceDB = LocalDb.loadLocalDB("hoolvaUser", "UserData", 2)
  const location = useLocation()
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const [loading, setLoading] = useState(true)
  const authInfo = useSelector((state: any) => state.Main.authInfo)

  useEffect(() => {
    const params: any = QueryString.parse(location.search)
    if (!params.rtdf) {
      LocalDb.get(deviceDB, "UserData", "meetingInfo", (data: any) => {
        if (data.response) {
          meetingSession
            .preAuth({ sname: data.response })
            .then((data: any) => {
              setLoading(true)
              dispatch(actionCreators.meetingID(data.meetingId))
              dispatch(actionCreators.setMeetingInfo(data))
              LocalDb.set(dbStore, "MeetingList", data.meetingId, {
                value: data.meetingId,
                title: data.name,
              })
              LocalDb.set(deviceDB, "UserData", "meetingInfo", "")
              navigate(path.JOIN)
            })
            .catch((error: any) => {
              throw error
            })
        }
      })
    }
    try {
      if (params?.rtdf) {
        const decrypted = atob(params.rtdf)
        const meetingInfo = JSON.parse(decrypted)
        const meetingData: any = {
          sname: meetingInfo.sname,
        }
        meetingSession
          .preAuth(meetingData)
          .then((data: any) => {
            setLoading(true)
            dispatch(actionCreators.meetingID(data.meetingId))
            dispatch(actionCreators.setMeetingInfo(data))
            LocalDb.set(dbStore, "MeetingList", data.meetingId, {
              value: data.meetingId,
              title: data.name,
            })
            LocalDb.get(deviceDB, "UserData", "createState", (data: any) => {
              if (data.response) {
                LocalDb.set(deviceDB, "UserData", "createState", false)
              }
            })
            navigate(path.JOIN)
          })
          .catch((error: any) => {
            throw error
          })
      } else {
        setLoading(false)
      }
    } catch (e) {}
  }, [])

  const isVersionLessThan = (versionString: string) => {
    const versionParts = versionString.split(".").map(Number)
    const requiredVersionParts = [15, 4]
    for (
      let i = 0;
      i < Math.max(versionParts.length, requiredVersionParts.length);
      i++
    ) {
      const versionPart = versionParts[i] || 0
      const requiredPart = requiredVersionParts[i] || 0

      if (versionPart < requiredPart) {
        return true
      } else if (versionPart > requiredPart) {
        return false
      }
    }

    return false
  }

  useEffect(() => {
    if (!loading && brandingInfo.data && onReady) {
      if (browser?.name === "safari" && isVersionLessThan(browser?.version)) {
        navigate(path.WARNING)
      } else if (authInfo?.token_info?.access_token) {
        navigate(path.DASHBOARD)
      } else {
        navigate(path.HOME)
      }
    }
  }, [loading, authInfo?.token_info?.access_token, brandingInfo])

  return <ScreenLoader />
}

export default AuthScreen
