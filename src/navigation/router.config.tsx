import React from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { useApp } from "../appContext"
import Layout1 from "../layout/layout1/layout1"
import Layout2 from "../layout/layout2/layout2"
import ScreenLoader from "../atom/ScreenLoader/screenLoader"
import AuthKeyCloak from "../auth/authKeyCloak"
import KeycloackReferesh from "../auth/KeycloackRefresh"
import LogoutSession from "../utils/logoutSession"
// import ScheduleMeeting from "../layout/layout1/components/dashboard/scheduleMeeting";

const HomePage = React.lazy(() => import("../containers/home/homePage"))
const SchedulePage = React.lazy(() => import("../containers/schedule/schedule"))
const MeetingPage = React.lazy(
  () => import("../containers/home/meetingScreen/meetingPage")
)
const Feedback = React.lazy(
  () => import("../containers/home/feedback/feedback")
)
const JoinPage = React.lazy(
  () => import("../containers/home/joinPage/joinPage")
)
const AuthScreen = React.lazy(
  () => import("../containers/authScreen/authScreen")
)
const WaitingRoom = React.lazy(
  () => import("../containers/home/waitingRoom/waitingRoom")
)
const Dashboard = React.lazy(
  () => import("../containers/home/dashboard/dashboard")
)
const Warning = React.lazy(() => import("../atom/NotSupported/notSupported"))
// const Schedule = React.lazy(() => import("../layout/layout1/components/dashboard/scheduleMeeting"))
const RouterConfig = (props: any) => {
  const appContext = useApp()
  const navigate = useNavigate()
  const { layout } = appContext
  const Layout = layout === "layout1" ? <Layout1 /> : <Layout2 />
  return (
    <div>
      <AuthKeyCloak
        token={props.token}
        userIsloggedOut={props.userIsloggedOut}
        ready={props.ready}
        navigate={navigate}
      />
      <LogoutSession />
      <KeycloackReferesh />
      <Routes>
        <Route element={Layout}>
          {/* <Route path="/app2/home" element={<React.Suspense fallback={<ScreenLoader />}>
                        <HomePage />
                    </React.Suspense>} /> */}

          <Route
            path="/app/home"
            element={
              <React.Suspense fallback={<ScreenLoader color={"[#ffffff]"} />}>
                <HomePage />
              </React.Suspense>
            }
          />
          <Route
            path="/app/join"
            element={
              <React.Suspense fallback={<ScreenLoader color={"[#000000]"} />}>
                <JoinPage />
              </React.Suspense>
            }
          />
          <Route
            path="/app/meeting"
            element={
              <React.Suspense fallback={<ScreenLoader color={"[#000000]"} />}>
                <MeetingPage />
              </React.Suspense>
            }
          />
          <Route
            path="/app/feedback"
            element={
              <React.Suspense fallback={<ScreenLoader color={"[#ffffff]"} />}>
                <Feedback />
              </React.Suspense>
            }
          />
          <Route
            path="/app/"
            element={
              <React.Suspense fallback={<ScreenLoader color={"[#ffffff]"} />}>
                <AuthScreen />
              </React.Suspense>
            }
          />
          <Route
            path="/app/waitingroom"
            element={
              <React.Suspense fallback={<ScreenLoader color={"[#ffffff]"} />}>
                <WaitingRoom />
              </React.Suspense>
            }
          />

          <Route
            path="/app/dashboard/*"
            element={
              <React.Suspense fallback={<ScreenLoader color={"[#ffffff]"} />}>
                <Dashboard />
              </React.Suspense>
            }
          />
          <Route
            path="/app/not-supported"
            element={
              <React.Suspense fallback={<ScreenLoader color={"[#ffffff]"} />}>
                <Warning />
              </React.Suspense>
            }
          />

          {/* <Route path="/app2/dashboard/*" element={<React.Suspense fallback={<ScreenLoader color={'[#ffffff]'} />}>
                        <Dashboard />
                    </React.Suspense>} /> */}

          {/* <Route path="/app2/dashboard/*" element={<React.Suspense fallback={<ScreenLoader color={'[#ffffff]'} />}>
                        <Dashboard />
                        <Routes>
                            <Route path=":general" element={< GeneralSettings />}></Route>
                            <Route path=":audioVideo" element={<AudioVideoSettings />} />

                        </Routes>
                    </React.Suspense>} /> */}

          {/* <Route path="/app2/home/schedule" element={<React.Suspense fallback={<ScreenLoader color={'[#ffffff]'} />}>
                        <ScheduleMeeting />
                    </React.Suspense>} /> */}

          {/* <Route path="/schedule" element={
                        <React.Suspense fallback={<>...</>}>
                            <RequireAuth>
                                <SchedulePage />
                            </RequireAuth>
                         </React.Suspense>
                    } /> */}
        </Route>
      </Routes>
    </div>
  )
}
export default RouterConfig
