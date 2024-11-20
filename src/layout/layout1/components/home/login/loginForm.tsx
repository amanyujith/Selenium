import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import InputFields from "../../../../../atom/InputField/inputField"
import axios from "axios"
// import NotificationData from "../../../../../constructors/notification/notificationData";
import path from "../../../../../navigation/routes.path"
import { actionCreators } from "../../../../../store"
import { useTranslation } from "react-i18next"
import LocalDb from "../../../../../dbServices/dbServices"
import jwt from "jwt-decode"
import { Environment } from "../../../../../config/environmentConfigs/config"

const LoginForm = (props: any) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: any) => state.Main.meetingSession)
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { t } = useTranslation()
  const tokenStore = LocalDb.loadLocalDB("token", "TokenList", 2)
  const sessionData = Environment.getInstance()
  const [validityError, setValidityError] = useState("")
  const [loading, setLoading] = useState(false)
  const [maskedPassword, setMaskedPassword] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate(path.AUTHSCREEN)
    }
  }, [user])

  const handleUserName = (event: any) => {
    setUserName(event.target.value)
    setError("")
  }
  const handlePassword = (event: any) => {
    setPassword(event.target.value)
    setError("")
  }

  const handleLogin = () => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    }
    setLoading(true)
    // const display_name = name
    try {
      axios
        .get(sessionData.keycloak_get_tenant(userName.trim()))
        .then(async (res: any) => {
          console.log(res, "responsetenant")
          await axios
            .post(
              sessionData.keycloak_api_login(res?.data?.sname),
              new URLSearchParams({
                username: userName.trim(),
                password: password,
                grant_type: "password",
                client_id: `${res?.data?.sname}`,
              }),
              { headers: headers }
            )
            .then((response: any) => {
              if (response.data.access_token) {
                setValidityError("")
                dispatch(
                  actionCreators.setKeycloakToken(response.data.access_token)
                )
                const token_data = {
                  token_info: response.data,
                  logged_time: Date.now(),
                  username: userName,
                  tenant: res?.data?.brand_sname,
                }

                dispatch(actionCreators.setAuthentication(token_data))
                LocalDb.set(tokenStore, "TokenList", "dataCookie", {
                  value: token_data,
                  title: "TokenData",
                })
                const userInfo = jwt(response.data.access_token)
                dispatch(actionCreators.setLoginState(true))
                dispatch(actionCreators.setLoggedInUserInfo(userInfo))
                console.log(userInfo, "UserInfoooo")
                navigate(path.DASHBOARD)
              }
            })
            .catch((err: any) => {
              console.log(err, "errrorMessage")
              if (err.response.data.error_description) {
                setValidityError(err.response.data.error_description)
              } else {
                setValidityError("Invalid user credentials")
              }
              setLoading(false)
            })
        })
        .catch((err) => {
          console.log(err, "errorMessage")
          if (err.code === "ERR_NETWORK") {
            setValidityError("Please check your network connection.")
          } else {
            setValidityError("Invalid user credentials")
          }
          setLoading(false)
        })
    } catch (error) {
      setLoading(false)
      setError(t("Meeting.LoginError"))
    }
  }

  const secondInputRef = useRef<HTMLInputElement>(null)

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault()
      if (userName && password) {
        handleLogin()
      } else if (
        document.activeElement === document.getElementById("loginUserName")
      )
        document.getElementById("loginPassword")?.focus()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [userName, password])

  return (
    <div className=" flex flex-col pl-12 pr-12 pt-2 relative">
      <div className=" h-[32px] py-2 text-left text-[#ff0000] ">{error}</div>
      <InputFields
        id={"loginUserName"}
        label={t("Meeting.Username")}
        name={"username"}
        type={"text"}
        autoFocus={true}
        onChange={handleUserName}
        restClass={"w-[279px] rounded-md"}
      />
      <div className="relative w-fit">
        <InputFields
          id={"loginPassword"}
          label={t("Password")}
          type={maskedPassword ? "password" : "text"}
          name={"password"}
          value={password}
          restClass={"mt-4 w-[279px] rounded-md"}
          onChange={handlePassword}
          ref={secondInputRef}
        />
        <div
          onClick={() => setMaskedPassword(!maskedPassword)}
          className=" absolute top-1/2 right-3 cursor-pointer bg-[white]"
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
      </div>
      {validityError && (
        <div className="absolute top-36 text-[15px] text-[red]">
          {validityError}
        </div>
      )}
      {/* <Link to={path.JOIN}> */}
      <div className="flex justify-between items-center mt-7  w-[279px] cursor-pointer">
        <div
          id="ForgotPassword"
          onClick={() => {
            props.enableForgotPasswordPage(true)
          }}
          className="text-base text-[#293241] text-left mt-1"
        >
          {t("Meeting.ForgotPassword")}
        </div>
        <HomeButton
          id="loginButton"
          color={"#F7931F"}
          textColor={"#293241"}
          handleClick={() => handleLogin()}
          restClass={" w-[113px] text-[15px] h-[40px] rounded-lg"}
          rest={{ type: "text", test: "demo" }}
        >
          {loading ? (
            <svg
              className="animate-spin mx-auto"
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M21.896 11C21.896 17.0177 17.0177 21.896 11 21.896C4.9823 21.896 0.104004 17.0177 0.104004 11C0.104004 4.9823 4.9823 0.104004 11 0.104004C17.0177 0.104004 21.896 4.9823 21.896 11ZM2.29842 11C2.29842 15.8057 6.19424 19.7016 11 19.7016C15.8057 19.7016 19.7016 15.8057 19.7016 11C19.7016 6.19424 15.8057 2.29842 11 2.29842C6.19424 2.29842 2.29842 6.19424 2.29842 11Z"
                fill="url(#paint0_linear_2993_206634)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2993_206634"
                  x1="8.03545"
                  y1="1.24821"
                  x2="26.5768"
                  y2="13.5484"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#454343" />
                  <stop offset="1" stopColor="#545252" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            "Login"
          )}
        </HomeButton>
        {/* </Link> */}
      </div>
      <hr className="text-[#00000022] mt-7 w-[279px]" />
      <div className="flex justify-center	rounded-[10px] mt-4 bg-[#ffffff] bg-opacity-10 py-4 w-[279px]">
        <p
          id="JoinaMeeting"
          className="text-[16px] leading-5	text-[#1C64D8] cursor-pointer"
          onClick={props.handleMeeting}
        >
          {t("Join a Meeting")}
        </p>
        {/* <span
          className="text-base cursor-pointer text-[#1C64D8]"
          onClick={props.handleSignupModal}
        >
          {t("SignUp")}
        </span> */}
      </div>
      {/* <div className="flex justify-between	rounded-[10px] mt-4 bg-[#ffffff] bg-opacity-10 py-4 w-[279px]">
        <p className="text-[16px] leading-5	text-[#293241]">
          {t("Meeting.DontHaveAnAccount")}
        </p>
        <span
          className="text-base cursor-pointer text-[#1C64D8]"
          onClick={props.handleSignupModal}
        >
          {t("SignUp")}
        </span>
      </div> */}
      {/* <p className=" text-[#58585B] mt-8" >{t("Meeting.LoginWith")}</p>
            <div className="flex justify-between w-14 mx-auto mt-2.5 ">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M17.5781 9.46758C17.5781 14.4422 14.1715 17.9824 9.14062 17.9824C4.31719 17.9824 0.421875 14.0871 0.421875 9.26367C0.421875 4.44023 4.31719 0.544922 9.14062 0.544922C11.4891 0.544922 13.4648 1.40625 14.9871 2.82656L12.6141 5.1082C9.50976 2.11289 3.73711 4.36289 3.73711 9.26367C3.73711 12.3047 6.16641 14.7691 9.14062 14.7691C12.593 14.7691 13.8867 12.2941 14.0906 11.0109H9.14062V8.01211H17.441C17.5219 8.45859 17.5781 8.8875 17.5781 9.46758Z" fill="#A7A9AB" />
                </svg>
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M13.1885 10.3887L13.6884 7.13109H10.5627V5.01715C10.5627 4.12594 10.9993 3.25723 12.3992 3.25723H13.8202V0.48375C13.8202 0.48375 12.5307 0.263672 11.2978 0.263672C8.72363 0.263672 7.04105 1.82391 7.04105 4.64836V7.13109H4.17969V10.3887H7.04105V18.2637H10.5627V10.3887H13.1885Z" fill="#A7A9AB" />
                </svg>
            </div> */}
    </div>
  )
}

export default LoginForm
