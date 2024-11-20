import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../store"
import timezones from "timezones-list"
const moment = require("moment-timezone")
interface chatSettingsProps {
  type?: "all" | "direct" | "dnd"
  target?: Array<string>
  from_time?: {
    hour: number
    minutes: number
  }
  to_time?: {
    hour: number
    minutes: number
  }
  preview_msg?: boolean
  mute?: boolean
  incoming_chat_notftn_sound?: string
  outgoing_chat_notftn_sound?: string
  group_chat_notftn_sound?: string
  incoming_call_notftn_sound?: string
  outgoing_call_notftn_sound?: string
  reaction?: string
  meeting_incoming_chat_notftn_sound?: string
  meeting_outgoing_chat_notftn_sound?: string
  meeting_raise_hand_notftn_sound?: string
  meeting_reaction_notftn_sound?: string
  notification_popup_sound?: string
}

const ChatSettings = (props: any) => {
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const dispatch = useDispatch()
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const settings = useSelector((state: any) => state.Main.soundAndNotification)

  const updateSettings = (args: any) => {
    chatInstance
      ?.updateChatSettings(settings[0]?.uuid, args)
      .then((res: any) => {
        chatInstance
          ?.getChatSettings(loggedInUserInfo?.sub)
          .then((data: chatSettingsProps[]) => {
            dispatch(actionCreators.soundAndNotification(data))
          })
      })
  }

  const updateSelfInfo = () => {
    if (chatInstance && loggedInUserInfo?.sub) {
      chatInstance?.GetUser(loggedInUserInfo?.sub).then((res: any) => {
        const selfData = res.filter((user: any) => {
          return user.uuid == loggedInUserInfo?.sub
        })
        dispatch(actionCreators.selfData(selfData))
      })
    }
  }

  useEffect(() => {
    updateSelfInfo()
  }, [props.ready, chatInstance, loggedInUserInfo?.sub])

  useEffect(() => {
    if (settings[0]?.set_auto_timezone) {
      const current_timezone_code = moment.tz.guess()
      const timeZoneCode = moment.tz(current_timezone_code)
      const utcOffsetFormatted = timeZoneCode.format("Z")
      const timeZoneName = moment.tz.zone(current_timezone_code).name

      // const currentTime = timezones.filter((item: any) => {
      //     return timeZoneCode == item.utc
      // })

      updateSettings({
        time_Zone: {
          time: utcOffsetFormatted,
          country: timeZoneName,
        },
      })
    }
  }, [settings[0]?.set_auto_timezone])

  useEffect(() => {
    if (chatInstance && loggedInUserInfo?.sub) {
      chatInstance
        .getChatSettings(loggedInUserInfo?.sub)
        .then((res: chatSettingsProps[]) => {
          dispatch(actionCreators.soundAndNotification(res))
        })
    }
  }, [chatInstance, props.ready, loggedInUserInfo?.sub])

  useEffect(() => {
    if (settings?.[0]?.from_time === null || settings?.[0]?.to_time === null) {
      updateSettings({
        from_time: {
          hour: 0,
          minutes: 0,
          value: new Date().setHours(0, 0, 0, 0),
        },
        to_time: {
          hour: 23,
          minutes: 59,
          value: new Date().setHours(23, 59, 0, 0),
        },
      })
    }
  }, [settings?.[0]?.from_time])

  return props.children
}

export default ChatSettings
