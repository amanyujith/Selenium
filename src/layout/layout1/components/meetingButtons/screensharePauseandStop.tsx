import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Tooltip from "../../../../atom/ToolTip/Tooltip"
import { actionCreators } from "../../../../store"
import { t } from "i18next"

const ScreensharePauseandStop = (props: any) => {
  const { sharing } = props
  const user = useSelector((state: any) => state.Main.meetingSession)
  const screensharePause = useSelector(
    (state: any) => state.Flag.ScreensharePause
  )
  const screensharePausePublisher = useSelector(
    (state: any) => state.Main.screensharePausePublisher
  )
  const participantID = useSelector(
    (state: any) => state.Main.selfParticipantID
  )


  const handlePauseStop = () => {
    user.pauseStream("screenshare", false)
  }

  const handlePause = () => {
    user.pauseStream("screenshare", true)
  }

  return (
    <div className="text-[#ffffff] text-center text-[14px]">
      {sharing ? (
        <Tooltip
          content={
            screensharePausePublisher.content?.pause
              ? t("Meeting.ScreenshareResumeStop")
              : t("Meeting.ScreensharePauseStop")
          }
          direction="top"
          onclick={true}
        >
          <div className="flex flex-row justify-center items-center box-border border border-[orange] w-[80px] h-[37px]  bg-gradient-to-b from-[#1D1D1D] to-[#404041] rounded-[50px] miniswitch gap-[5px] mt-1 ml-3">
            {screensharePausePublisher.content?.pause ? (
              <div
                id="SSpauseStop"
                className="w-[28px] py-[11px] px-[8px] order-0 "
                onClick={handlePauseStop}
              >
                <svg
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 15.1266C6.1125 15.1266 5.2845 14.9578 4.516 14.6203C3.747 14.2828 3.075 13.8266 2.5 13.2516C1.925 12.6766 1.46875 12.0046 1.13125 11.2356C0.79375 10.4671 0.625 9.63906 0.625 8.75156H1.75C1.75 10.2141 2.2595 11.4546 3.2785 12.4731C4.297 13.4921 5.5375 14.0016 7 14.0016C8.4625 14.0016 9.703 13.4921 10.7215 12.4731C11.7405 11.4546 12.25 10.2141 12.25 8.75156C12.25 7.28906 11.7405 6.04831 10.7215 5.02931C9.703 4.01081 8.4625 3.50156 7 3.50156H6.79375L7.99375 4.70156L7.20625 5.50781L4.6375 2.93906L7.225 0.351562L8.0125 1.17656L6.79375 2.37656H7C7.8875 2.37656 8.7155 2.54531 9.484 2.88281C10.253 3.22031 10.925 3.67656 11.5 4.25156C12.075 4.82656 12.5313 5.49856 12.8688 6.26756C13.2063 7.03606 13.375 7.86406 13.375 8.75156C13.375 9.63906 13.2063 10.4671 12.8688 11.2356C12.5313 12.0046 12.075 12.6766 11.5 13.2516C10.925 13.8266 10.253 14.2828 9.484 14.6203C8.7155 14.9578 7.8875 15.1266 7 15.1266Z"
                    fill="#A7A9AB"
                  />
                </svg>
              </div>
            ) : (
              <div
                id="SSpause"
                className="w-[28px] py-[11px] px-[8px] order-0"
                onClick={handlePause}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.9375 9.875V0.125H9.875V9.875H5.9375ZM0.125 9.875V0.125H4.0625V9.875H0.125Z"
                    fill="#F7931F"
                  />
                </svg>
              </div>
            )}
            <div className="h-[28px] order-1 bg-[#ffffff1f]">
              <svg
                width="1"
                height="28"
                viewBox="0 0 1 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0.25"
                  y1="1.09278e-08"
                  x2="0.249999"
                  y2="28"
                  stroke="white"
                  strokeOpacity="0.12"
                  stroke-width="0.5"
                />
              </svg>
            </div>
            <div
              id="handleScreenshare"
              className="w-[28px]  py-[11px] px-[8px] order-2"
              onClick={props.handleScreenshare}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.875 9.125V0.875H9.125V9.125H0.875Z"
                  fill="#F7931F"
                />
              </svg>
            </div>
          </div>
        </Tooltip>
      ) : null}
    </div>
  );
}

export default ScreensharePauseandStop
