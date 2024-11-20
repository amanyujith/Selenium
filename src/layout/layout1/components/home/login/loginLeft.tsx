import React from "react"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import { useTranslation } from "react-i18next"

const LoginLeft = (props: any) => {
  const { t } = useTranslation()
  return (
    <div className="w-[480px] pt-10 pl-12 pr-11 text-left flex flex-col justify-center h-full">
      <h2 className="text-3xl font-bold text-[rgb(255,255,255)]">
        {t("Meeting.WelcomeBack")}
      </h2>
      <p className="mt-[28px]	 text-[18px] 	overflow-auto	leading-6	text-[#ffffff]">
        {t("Meeting.WelcomeMsg")}
      </p>
      <p className=" text-[18px] mt-5	overflow-auto	leading-6	text-[#ffffff]">
        {t("Meeting.CollaborateMsg")}
      </p>
    </div>
  )
}

export default LoginLeft
