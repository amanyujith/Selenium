import React from "react"
import CustomDropdown from "../../../../../atom/DropDown/customDropdown"
import { playSound } from "../utils/functions"
import { useSelector } from "react-redux"
import {
  groupChatFn,
  inComingChatFn,
  incomingCallFn,
  outGoingChatFn,
  pbxIncomingCallFn,
} from "../utils/json"

const NotificationSounds = ({
  chatSettings,
  setChatSettings,
  updateSettings,
}: any) => {
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const inComingChat = inComingChatFn(chatSettings)
  const outGoingChat = outGoingChatFn(chatSettings)
  const groupChat = groupChatFn(chatSettings)
  const incomingCall = incomingCallFn(chatSettings)
  const pbxIncomingCall = pbxIncomingCallFn(chatSettings)

  return (
    <div>
      {" "}
      {!settings?.[0]?.mute && (
        <div className="grid grid-cols-2 gap-2">
          <div className="mt-1">
            <span className=" text-[12px] leading-[19px] text-[#404041]">
              {inComingChat.type}
            </span>
            <CustomDropdown
              options={inComingChat.options}
              restClass={"-translate-y-full top-[-5px]"}
              rest={"h-[44px]"}
              value={
                settings[0]?.incoming_chat_notftn_sound === "default"
                  ? inComingChat.options[0]
                  : inComingChat.options.filter((option: any) => {
                      return (
                        option.value === settings[0]?.incoming_chat_notftn_sound
                      )
                    })?.[0]
              }
              onChange={(event: any) => {
                setChatSettings((prevState: any) => {
                  const updatedData = [...prevState]
                  updatedData[0].incoming_chat_notftn_sound = event
                  return updatedData
                })
                playSound(event == "default" ? "defaultreceivechat" : event)
                updateSettings({ incoming_chat_notftn_sound: event })
              }}
            />
          </div>
          <div className="mt-1">
            <span className=" text-[12px] leading-[19px] text-[#404041]">
              {outGoingChat.type}
            </span>
            <CustomDropdown
              options={outGoingChat.options}
              restClass={"-translate-y-full top-[-5px]"}
              rest={"h-[44px]"}
              value={
                settings[0]?.outgoing_chat_notftn_sound === "default"
                  ? outGoingChat.options[1]
                  : outGoingChat.options.filter((option: any) => {
                      return (
                        option.value === settings[0]?.outgoing_chat_notftn_sound
                      )
                    })?.[0]
              }
              onChange={(event: any) => {
                setChatSettings((prevState: any) => {
                  const updatedData = [...prevState]
                  updatedData[0].outgoing_chat_notftn_sound = event
                  return updatedData
                })
                playSound(event == "default" ? "defaultsendchat" : event)
                updateSettings({ outgoing_chat_notftn_sound: event })
              }}
            />
          </div>
          <div className="mt-1">
            <span className=" text-[12px] leading-[19px] text-[#404041]">
              {groupChat.type}
            </span>
            <CustomDropdown
              options={groupChat.options}
              restClass={"-translate-y-full top-[-5px]"}
              rest={"h-[44px]"}
              value={
                settings[0]?.group_chat_notftn_sound === "default"
                  ? groupChat.options[0]
                  : groupChat.options.filter((option: any) => {
                      return (
                        option.value === settings[0]?.group_chat_notftn_sound
                      )
                    })?.[0]
              }
              onChange={(event: any) => {
                setChatSettings((prevState: any) => {
                  const updatedData = [...prevState]
                  updatedData[0].group_chat_notftn_sound = event
                  return updatedData
                })
                playSound(event == "default" ? "defaultreceivechat" : event)
                updateSettings({ group_chat_notftn_sound: event })
              }}
            />
          </div>
          <div className="mt-1">
            <span className=" text-[12px] leading-[19px] text-[#404041]">
              {incomingCall.type}
            </span>
            <CustomDropdown
              options={incomingCall.options}
              restClass={"-translate-y-full top-[-5px]"}
              rest={"h-[44px]"}
              value={
                settings[0]?.incoming_call_notftn_sound === "default"
                  ? incomingCall.options?.[0]
                  : incomingCall.options.filter((option: any) => {
                      return (
                        option.value === settings[0]?.incoming_call_notftn_sound
                      )
                    })?.[0]
              }
              onChange={(event: any) => {
                setChatSettings((prevState: any) => {
                  const updatedData = [...prevState]
                  updatedData[0].incoming_call_notftn_sound = event
                  return updatedData
                })
                playSound(event == "default" ? "defaultreceivecall" : event)
                updateSettings({ incoming_call_notftn_sound: event })
              }}
            />
          </div>
          <div className="mt-1">
            <span className=" text-[12px] leading-[19px] text-[#404041]">
              {pbxIncomingCall.type}
            </span>
            <CustomDropdown
              options={pbxIncomingCall.options}
              restClass={"-translate-y-full top-[-5px]"}
              rest={"h-[44px]"}
              value={
                settings[0]?.pbx_call_notification === null
                  ? incomingCall.options?.[0]
                  : incomingCall.options.filter((option: any) => {
                      return option.value === settings[0]?.pbx_call_notification
                    })?.[0]
              }
              onChange={(event: any) => {
                setChatSettings((prevState: any) => {
                  const updatedData = [...prevState]
                  updatedData[0].pbx_call_notification = event
                  return updatedData
                })
                playSound(event == null ? "defaultreceivecall" : event)
                updateSettings({ pbx_call_notification: event })
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationSounds
