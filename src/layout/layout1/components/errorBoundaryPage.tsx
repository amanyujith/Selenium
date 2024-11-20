import React, { useMemo } from "react"
import ErrorLottie from "../../../atom/Lottie/somethingwentwrong.json"
import Lottiefy from "../../../atom/Lottie/lottie"
import LandingPage from "./dashboard/landingPage"
import LeftBar from "./dashboard/leftBar"
import TopBar from "./dashboard/topBar"
import { useSelector } from "react-redux"
import { ChatSession } from "hdmeet"
import { Environment } from "../../../config/environmentConfigs/config"

const ErrorBoundaryPage = ({ ID }: { ID: string }) => {
  return (
    <div className=" w-screen h-screen grid place-content-center text-center">
      <Lottiefy json={ErrorLottie} height={300} width={300} loop />
      <div className=" font-bold text-[18px]">Something went wrong.</div>
      <div className="text-[14px]">
        Please try again{" "}
        <span
          className="underline text-[blue] cursor-pointer"
          onClick={() => window.location.reload()}
        >
          Retry
        </span>
      </div>
      Issue ID : {ID}, Time : {new Date().toLocaleString()} ,{" "}
      {new Date().getTime()}
    </div>
  )
}

export default ErrorBoundaryPage
