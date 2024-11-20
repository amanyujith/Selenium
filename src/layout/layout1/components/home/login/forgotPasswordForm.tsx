import React, { useState } from "react"
import InputFields from "../../../../../atom/InputField/inputField"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import axios from "axios"
import { Environment } from "../../../../../config/environmentConfigs/config"

const ForgotPasswordForm = (props: any) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const sessionData = Environment.getInstance()
  const [passwordMailUpdated, setPasswordMailUpdated] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const handleForgotPassword = () => {
    const regEx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (regEx.test(email)) {
      setInvalid(false)
      setLoading(true)
      axios
        .post(sessionData.forgot_password, {
          email: email,
        })
        .then((res: any) => {
          setLoading(false)
          setPasswordMailUpdated(true)
        })
    } else {
      setInvalid(true)
    }
  }

  return (
    <div>
      {passwordMailUpdated ? (
        <div className=" flex flex-col pl-12 pr-12 pt-6 gap-3">
          <div className="font-semibold text-[18px]">Password Reset</div>
          <div className="text-[16px]">{`An email has been send to ${email} with instructions to reset your password`}</div>
          <HomeButton
            id="ForgotPasswordMailButton"
            color={""}
            textColor={"#F7931F"}
            handleClick={() => props.enableForgotPasswordPage(false)}
            restClass={
              " w-[113px] text-[15px] h-[40px] rounded-lg border border-[#F7931F]"
            }
          >
            OK
          </HomeButton>
        </div>
      ) : (
        <div className=" flex flex-col pl-12 pr-12 pt-5 gap-3">
          {" "}
          <InputFields
            id={"forgotPasswordemailId"}
            label={"Email"}
            type="email"
            name={"password"}
            onChange={(e: any) => setEmail(e.target.value)}
            restClass={"mt-4 w-[279px] rounded-md"}
          />
          {invalid && (
            <div className="text-[red] text-[14px]">Invalid Mail ID</div>
          )}
          <div className="flex gap-5 pt-3 justify-center">
            {" "}
            <HomeButton
              id="ForgotPasswordCancelButton"
              color={""}
              textColor={"#F7931F"}
              handleClick={() => props.enableForgotPasswordPage(false)}
              restClass={
                " w-[113px] text-[15px] h-[40px] rounded-lg border border-[#F7931F]"
              }
            >
              Cancel
            </HomeButton>
            <HomeButton
              id="PasswordResetButton"
              color={"#F7931F"}
              textColor={"#293241"}
              handleClick={handleForgotPassword}
              restClass={" w-[113px] text-[15px] h-[40px] rounded-lg"}
              rest={{ type: "text", test: "demo" }}
            >
              {" "}
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
                "Reset"
              )}
            </HomeButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgotPasswordForm
