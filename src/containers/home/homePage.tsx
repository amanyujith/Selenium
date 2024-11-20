import { useState, useEffect } from "react"
import JoinMeeting from "../../layout/layout1/components/home/startMeeting/joinMeeting"
import CreateMeeting from "../../layout/layout1/components/home/startMeeting/createMeeting"
import LoginLeft from "../../layout/layout1/components/home/login/loginLeft"
import LoginForm from "../../layout/layout1/components/home/login/loginForm"
import SignupLeft from "../../layout/layout1/components/home/signup/signupLeft"
import SignupForm from "../../layout/layout1/components/home/signup/signupForm"
import * as constant from "../../constants/constantValues"
import GridSvg from "../../atom/GridSvg/gridSvg"
import packages from "../../../package.json"
import Verification from "../../layout/layout1/components/home/accountVerification/verification"
import { useNavigate } from "react-router-dom"
import path from "../../navigation/routes.path"
import { useSelector } from "react-redux"
import ScreenLoader from "../../atom/ScreenLoader/screenLoader"
import LocalDb from "../../dbServices/dbServices"
import ForgotPasswordForm from "../../layout/layout1/components/home/login/forgotPasswordForm"

const HomePage = () => {
  const [startMeetingModal, setStartMeetingModal] = useState(false)
  const [loginModal, setLoginModal] = useState(true)
  const [signupModal, setSignupModal] = useState(false)
  const [verification, setVerification] = useState(false)
  const [ForgotPasswordPage, enableForgotPasswordPage] = useState(false)
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const [onReady, setOnReady]: any = useState(false)
  const navigate = useNavigate()
  const user = useSelector((state: any) => state.Main.meetingSession)
  const tokenStore = LocalDb.loadLocalDB("token", "TokenList", 2)
  const loginState = useSelector((state: any) => state.Flag.loginState)

  const handleLoginModal = () => {
    if (startMeetingModal) setStartMeetingModal(false)
    if (signupModal) setSignupModal(false)
    setLoginModal(true)
  }

  const handleSignupModal = () => {
    if (startMeetingModal) setStartMeetingModal(false)
    if (loginModal) setLoginModal(false)
    if (verification) setVerification(false)
    setSignupModal(true)
  }
  const handleVerification = () => {
    if (startMeetingModal) setStartMeetingModal(false)
    if (loginModal) setLoginModal(false)
    if (signupModal) setSignupModal(false)
    setVerification(true)
  }

  useEffect(() => {
    if (!user) {
      navigate(path.AUTHSCREEN)
    }
  }, [user])
  useEffect(() => {
    if (loginState) {
      navigate(path.DASHBOARD)
    }
  }, [loginState])

  useEffect(() => {
    LocalDb.get(tokenStore, "TokenList", "dataCookie", (data: any) => {
      if (data.status == "success" && data.response == undefined) {
        setOnReady(true)
      }
    })
  }, [loginState, tokenStore])

  return (
    <div>
      {onReady ? (
        <div className="h-screen w-screen grid place-items-center bg-[#EBEDEF]">
          <div
            className={`${
              !verification ? "w-[870px] h-[540px]" : "w-[700px] h-[340px]"
            } shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-3xl grid place-items-center z-10 bg-[#FFFFFF]`}
          >
            {verification ? (
              <Verification handleSignupModal={handleSignupModal} />
            ) : (
              <div className="flex flex-row">
                <div className="rounded-l-3xl bg-[#293241]">
                  {startMeetingModal ? (
                    <CreateMeeting
                      handleLoginModal={handleLoginModal}
                      handleSignupModal={handleSignupModal}
                    />
                  ) : loginModal ? (
                    <LoginLeft handleSignupModal={handleSignupModal} />
                  ) : signupModal ? (
                    <SignupLeft handleLoginModal={handleLoginModal} />
                  ) : null}
                </div>
                <div className="w-[403px] h-[540px] rounded-l-3xl flex flex-col justify-center items-center">
                  <div className="h-12">
                    <img
                      className=" h-full"
                      src={brandingInfo?.data?.logos?.logoDark}
                    />
                  </div>
                  {startMeetingModal ? (
                    <JoinMeeting />
                  ) : ForgotPasswordPage ? (
                    <ForgotPasswordForm
                      enableForgotPasswordPage={enableForgotPasswordPage}
                    />
                  ) : loginModal ? (
                    <LoginForm
                      handleSignupModal={handleSignupModal}
                      handleMeeting={() => setStartMeetingModal(true)}
                      enableForgotPasswordPage={enableForgotPasswordPage}
                    />
                  ) : signupModal ? (
                    <SignupForm
                      handleLoginModal={handleLoginModal}
                      handleVerification={handleVerification}
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>
          {/* <Invite /> */}
          <div className=" absolute bottom-0 left-0 text-sm leading-4 text-[#000000]">{`Build Number: ${packages.buildNumber}`}</div>
          {/* <div id='message' className=" absolute bottom-0 left-0 text-sm leading-4 text-[#000000]">{`Build Number: ${packages.buildNumber}`}{`Version Number: ${packages.version}`}</div> */}
        </div>
      ) : (
        <ScreenLoader />
      )}
    </div>
    // <ChildWindow/>
    // <ScreenLoader />
    // <WaitingRoom />
    // <JoinPage/>
    // <PermissionGuid/>
    // <Dashboard/>
    // <MeetingPage/>
    // <Feedback/>
  )
}

export default HomePage
