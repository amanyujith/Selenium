import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import useNotificationSound from "./useNotificationSound"
const Cabello = require("../audio/incoming-outgoing-message/Cabello.mp3")
const Incoming = require("../audio/incoming-outgoing-message/Incoming.mp3")
const LiveChat = require("../audio/incoming-outgoing-message/Live Chat.mp3")
const Messagetone = require("../audio/incoming-outgoing-message/Message Tone.mp3")
const Notify = require("../audio/incoming-outgoing-message/Notify.mp3")
const Outgoing = require("../audio/incoming-outgoing-message/Outgoing.mp3")
const ping = require("../audio/incoming-outgoing-message/Ping.mp3")
const positiveNote = require("../audio/incoming-outgoing-message/Positive Notice.mp3")
const serviceBell = require("../audio/incoming-outgoing-message/Service Bell.mp3")
const Shooting = require("../audio/incoming-outgoing-message/Shooting.mp3")
const success = require("../audio/incoming-outgoing-message/Success.mp3")
const theNotification = require("../audio/incoming-outgoing-message/The Notification.mp3")

interface NotificationOptions {
  title: string
  message: string
  icon?: string
  onClick?: () => void
  onClose?: () => void
  duration?: number
  isGroup?: boolean
  uuid?: string
}

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  )
  const pageVisibility = useSelector(
    (state: any) => state.Flag.PageVisibilityState
  )
  const [audioFile, setAudioFile] = useState(Incoming)
  const [groupAudio, setGroupAudio] = useState(Incoming)
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const [playNotificationSound] = useNotificationSound(Incoming)
  const [notifyMe, setNotifyMe] = useState("")
  const [allowTime, setAllowTime] = useState(true)
  const visiblityRef = useRef(pageVisibility)
  const settingsRef = useRef(settings)
  const [targets, setTargets] = useState(
    settings[0]?.target.map((item: any) => {
      return item.uuid
    })
  )

  useEffect(() => {
    const file = settings[0]?.incoming_chat_notftn_sound
    file === "cabello"
      ? setAudioFile(Cabello)
      : file === "livechat"
      ? setAudioFile(LiveChat)
      : file === "messagetone"
      ? setAudioFile(Messagetone)
      : file === "notify"
      ? setAudioFile(Notify)
      : file === "ping"
      ? setAudioFile(ping)
      : file === "positivenote"
      ? setAudioFile(positiveNote)
      : file === "servicebell"
      ? setAudioFile(serviceBell)
      : file === "shooting"
      ? setAudioFile(Shooting)
      : file === "thenotification"
      ? setAudioFile(theNotification)
      : file === "success"
      ? setAudioFile(success)
      : file === "outgoing"
      ? setAudioFile(Outgoing)
      : file === "turnedoff"
      ? setAudioFile("")
      : setAudioFile(Incoming)

    const groupfile = settings[0]?.group_chat_notftn_sound
    groupfile === "cabello"
      ? setGroupAudio(Cabello)
      : groupfile === "livechat"
      ? setGroupAudio(LiveChat)
      : groupfile === "messagetone"
      ? setGroupAudio(Messagetone)
      : groupfile === "notify"
      ? setGroupAudio(Notify)
      : groupfile === "ping"
      ? setGroupAudio(ping)
      : groupfile === "positivenote"
      ? setGroupAudio(positiveNote)
      : groupfile === "servicebell"
      ? setGroupAudio(serviceBell)
      : groupfile === "shooting"
      ? setGroupAudio(Shooting)
      : groupfile === "thenotification"
      ? setGroupAudio(theNotification)
      : groupfile === "success"
      ? setGroupAudio(success)
      : groupfile === "outgoing"
      ? setGroupAudio(Outgoing)
      : groupfile === "turnedoff"
      ? setGroupAudio("")
      : setGroupAudio(Incoming)
  }, [
    settings[0]?.incoming_chat_notftn_sound,
    settings[0]?.group_chat_notftn_sound,
  ])

  useEffect(() => {
    setNotifyMe(settings[0]?.type)
    setTargets(settings[0]?.target.map((item: any) => item.uuid))
  }, [settings[0]?.type, settings[0]?.target])

  const playSound = (src: string) => {
    if (!settings[0]?.mute) {
      const audio = new Audio(src)
      audio.currentTime = 0
      //audio.loop = true
      audio.play()
    }
  }

  useEffect(() => {
    if (permission === "default") {
      try {
        if (Notification && Notification.requestPermission)
          Notification.requestPermission().then((result) => {
            setPermission(result)
          })
      } catch (e) {}
    }
  }, [permission])

  useEffect(() => {
    visiblityRef.current = pageVisibility
  }, [pageVisibility])

  function isTimeBetween(
    selectedTime1: any,
    selectedTime2: any,
    timeToCheck: any
  ) {
    function convertToMinutes(time: any) {
      const [hours, minutes] = time?.split(".").map(Number)
      return hours * 60 + minutes
    }

    const startTime1 = convertToMinutes(selectedTime1)
    const startTime2 = convertToMinutes(selectedTime2)
    const checkTime = convertToMinutes(timeToCheck)

    if (startTime1 > startTime2) {
      checkTime >= startTime1 || checkTime <= startTime2
        ? setAllowTime(true)
        : setAllowTime(false)
    } else {
      checkTime >= startTime1 && checkTime <= startTime2
        ? setAllowTime(true)
        : setAllowTime(false)
    }
  }

  useEffect(() => {
    const date = new Date()
    const hour = date.getHours()
    const min = date.getMinutes()
    const currentTime = hour + min / 100
    if (settings[0]?.from_time?.hour || settings[0]?.from_time?.minutes) {
      const time1 = `${settings[0]?.from_time?.hour}.${settings[0]?.from_time?.minutes}`
      const time2 = `${settings[0]?.to_time?.hour}.${settings[0]?.to_time?.minutes}`
      isTimeBetween(time1, time2, currentTime.toString())
    }
  }, [settings[0]?.from_time, settings[0]?.to_time])

  const sendNotification = (options: NotificationOptions) => {
    if (
      permission === "granted" &&
      !visiblityRef.current &&
      allowTime &&
      (["alert&sound", "alert", null, ""].includes(
        settings[0]?.notification_mode
      ) ||
        settings[0]?.notification_mode == null)
    ) {
      if (notifyMe === "all") {
        if (options.isGroup) {
          const notification = new Notification(options.title, {
            body: settings[0]?.preview_msg ? options.message : "",
            icon: options.icon,
          })
          if (options.onClick) {
            notification.onclick = options.onClick
          }
        } else {
          const notification = new Notification(options.title, {
            body: settings[0]?.preview_msg ? options.message : "",
            icon: options.icon,
          })
          if (options.onClick) {
            notification.onclick = options.onClick
          }
        }
      } else if (notifyMe === "direct") {
        if (!options.isGroup) {
          const notification = new Notification(options.title, {
            body: settings[0]?.preview_msg ? options.message : "",
            icon: options.icon,
          })
          if (options.onClick) {
            notification.onclick = options.onClick
          }
        }
        // else if (settings[0]?.target.includes(options.uuid)) {
        //   const notification = new Notification(options.title, {
        //     body: settings[0]?.preview_msg ? options.message : "",
        //     icon: options.icon,
        //   })
        //   if (options.onClick) {
        //     notification.onclick = options.onClick
        //   }
        // }
      } else if (notifyMe === "custom") {
        if (
          (settings[0]?.exclude_flag && !targets.includes(options.uuid)) ||
          (!settings[0]?.exclude_flag && targets.includes(options.uuid))
        ) {
          const notification = new Notification(options.title, {
            body: settings[0]?.preview_msg ? options.message : "",
            icon: options.icon,
          })
          if (options.onClick) {
            notification.onclick = options.onClick
          }
        }
      }

      // if (options.duration) {
      //   setTimeout(() => {
      //     notification.close();
      //     if (options.onClose) {
      //       options.onClose();
      //     }
      //   }, options.duration);
      // }
    }
    if (
      allowTime &&
      !settings[0]?.mute &&
      (["alert&sound", "sound", null, ""].includes(
        settings[0]?.notification_mode
      ) ||
        settings[0]?.notification_mode == null)
    ) {
      if (notifyMe === "custom") {
        if (
          (settings[0]?.exclude_flag && !targets.includes(options.uuid)) ||
          (!settings[0]?.exclude_flag && targets.includes(options.uuid))
        ) {
          if (options.isGroup) {
            playSound(groupAudio)
          } else {
            playSound(audioFile)
          }
        }
      } else if (notifyMe !== "dnd") {
        if (options.isGroup) {
          playSound(groupAudio)
        } else {
          playSound(audioFile)
        }
      }
      // else if (notifyMe === "direct") {
      //   if (!options.isGroup) {
      //     playSound(audioFile)
      //   }
      //   // else if (settings[0]?.target.includes(options.uuid)) {
      //   //   playSound(groupAudio)
      //   // }
      // } else if (notifyMe === "custom") {
      //   if (
      //     (settings[0]?.exclude_flag && !targets.includes(options.uuid)) ||
      //     (!settings[0]?.exclude_flag && targets.includes(options.uuid))
      //   ) {
      //     options.isGroup ? playSound(groupAudio) : playSound(audioFile)
      //   }
      // }
    }
  }

  return sendNotification
}
