import React, { memo, useState } from "react"
import { useSelector } from "react-redux"
import MeetingInfoItem from "../../../../atom/InfoItem/meetingInfoItem"
import copy from "copy-to-clipboard"
import { t } from "i18next"
import { motion } from "framer-motion"

const MeetingInfo = (props: any) => {
  const { isCall } = props
  const meetingInfo = useSelector((state: any) => state.Main.meetingInfo)
  const hostName = useSelector((state: any) => state.Main.hostName)
  const meetingInvite = useSelector((state: any) => state.Main.meetingInvite)
  const [clipboardState, setClipboardState] = useState(false)
  const themePalette = useSelector((state: any) => state.Main.themePalette)
  const handleCopyURL = () => {
    const result = copy(meetingInvite.meeting_url)
    setClipboardState(result)
    setTimeout(() => {
      setClipboardState(false)
    }, 3000)
  }

  return (
    <motion.div
      key="meetingInfo"
      initial={isCall ? {} : { scale: 0 }}
      animate={isCall ? {} : { scale: 1, transition: { duration: 0.4, ease: "easeOut" } }}
      exit={isCall ? {} : { scale: 0, transition: { duration: 0.4, ease: "easeOut" } }}
      className={`origin-top-left w-[403px] rounded-[3px] border border-solid border-[#ffffff]/[0.12] box-border p-5  text-left bg-primary-500 ${
        isCall && `bg-[${themePalette?.primary500}]`
      }`}
      style={{ backgroundColor: isCall ? themePalette?.primary500 : "" }}
    >
      <h3 className="text-[16px] leading-5 text-[#ffffff] pt-2 pb-3">
        {meetingInfo.name}
      </h3>
      <MeetingInfoItem
        label={t("Meeting.MeetingID")}
        value={meetingInfo.meetingId}
      />
      {hostName ? (
        <MeetingInfoItem label={t("Meeting.Host")} value={hostName} />
      ) : null}
      {meetingInfo.password ? (
        <MeetingInfoItem
          label={t("Meeting.Password")}
          value={meetingInfo.password}
          mask={true}
        />
      ) : null}
      {meetingInfo.pin ? (
        <MeetingInfoItem
          label={t("Meeting.Pin")}
          value={meetingInfo.pin}
          mask={true}
        />
      ) : null}
      <div
        id="meetingInfocopyURL"
        onClick={handleCopyURL}
        className={`flex text-[16px] leading-5 ml-32 cursor-pointer py-2 text-link ${
          isCall && `text-[${themePalette?.linkText}]`
        }`}
      >
        <svg
          className="mr-2"
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
        >
          <path
            d="M12.375 16.25V17.6562C12.375 18.1222 11.9972 18.5 11.5312 18.5H1.96875C1.50275 18.5 1.125 18.1222 1.125 17.6562V4.71875C1.125 4.25275 1.50275 3.875 1.96875 3.875H4.5V14.2812C4.5 15.3668 5.38316 16.25 6.46875 16.25H12.375ZM12.375 4.15625V0.5H6.46875C6.00275 0.5 5.625 0.877754 5.625 1.34375V14.2812C5.625 14.7472 6.00275 15.125 6.46875 15.125H16.0312C16.4972 15.125 16.875 14.7472 16.875 14.2812V5H13.2188C12.7547 5 12.375 4.62031 12.375 4.15625ZM16.6279 3.06539L14.3096 0.747113C14.1514 0.58889 13.9368 0.500001 13.713 0.5L13.5 0.5V3.875H16.875V3.66199C16.875 3.43822 16.7861 3.22362 16.6279 3.06539Z"
            fill="#A7A9AB"
          />
        </svg>
        {clipboardState ? t("Meeting.Copied") : t("Meeting.CopyMeetingURL")}
      </div>
    </motion.div>
  )
}

export default memo(MeetingInfo)
