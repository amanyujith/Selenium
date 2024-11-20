import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const UpdateNotification = (props: any) => {
  const { sendNotification } = props
  const notification = useSelector((state: any) => state.Main.notificationData)
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const [notificationIcon, setNotificationIcon] = useState(null)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  useEffect(() => {
    if (brandingInfo?.data?.logos?.favicon) {
      setNotificationIcon(brandingInfo.data.logos.favicon)
    }
  }, [brandingInfo])

  useEffect(() => {
    if (notification) {
      chatInstance?.grafanaLogger([
        "Client : UPDATING NOTIFICATION",
        {
          title: notification?.title,
          uuid: notification?.uuid,
        },
      ])

      sendNotification({ ...notification, icon: notificationIcon })
    }
  }, [notification])

  return <div></div>
}

export default UpdateNotification
