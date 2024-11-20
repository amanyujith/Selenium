import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { branding_logo_half } from "../../constants/constantValues"
import { actionCreators } from "../../../src/store"
import audioFile from "../../constants/audio/knocking.mp3"
import useNotificationSound from "../../constants/audio/audioPlayer"
import { t } from "i18next"


const PushNotifications = () => {
  const dispatch = useDispatch()
  const [checkIsPublisherPrivate, setCheckIsPublisherPrivate] = useState(true)
  const [checkIsPublisherGroup, setCheckIsPublisherGroup] = useState(true)
  const [raiseHand, setraiseHand] = useState<any>()
  const meetingnotification = useSelector(
    (state: any) => state.Main.meetingNotifications
  )
  const pageVisibility = useSelector(
    (state: any) => state.Flag.PageVisibilityState
  )
  const groupChat = useSelector((state: any) => state.Main.groupChat)
  const privateChat = useSelector((state: any) => state.Main.privateChat)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const groupChatState = useSelector((state: any) => state.Flag.groupChatState)
  const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
  const waitingList = useSelector((state: any) => state.Main.waitingList)
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const handRaised = useSelector((state: any) => state.Main.handRaise)
  // const audio = document.getElementById("audioSrc")
  const [permission, setPermission] = useState<boolean>()
  
  const latestNotification =
    meetingnotification?.[meetingnotification.length - 1]
  const latestPrivateChat = privateChat?.[privateChat?.length - 1]
  const latestGroupChat = groupChat?.[groupChat?.length - 1]
  const latestWaitingList = waitingList?.[waitingList?.length - 1]
  const screenShareOn = participantList[selfTileIndex]?.screenshare
  const [playNotificationSound] = useNotificationSound(audioFile)
  const time = useSelector((state: any) => state.Main.timeInSec)
  let raisehandCheck: any = []
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)

    const playSound = (src: string) => {
      if (!settings[0]?.mute) {
        const audio = new Audio(src)
        audio.currentTime = 0
        //audio.loop = true
        audio.play()
      }
    }
  useEffect(() => {
    if (Notification.permission === "granted") {
      setPermission(true)
    } else {
      setPermission(false)
    }
  }, [Notification])

  useEffect(() => {
    if (
      (participantList.length === 2 &&
        !pageVisibility &&
        latestNotification?.check?.includes("joined")) ||
      (participantList.length === 1 &&
        !pageVisibility &&
        waitingList.length > 0)
    ) {
      //@ts-ignore
      // audio?.play()
      playNotificationSound(0.5, false)
    }
  }, [participantList.length, waitingList.length])

  useEffect(() => {
    raisehandCheck = participantList.filter(
      (node: any) => node?.participant_id === handRaised?.participant_id
    )
    if (raisehandCheck.length > 0) {
          setraiseHand(raisehandCheck)
    }
    
  }, [handRaised])

  useEffect(() => {
    
    if (
      participantList?.[selfTileIndex]?.participant_id ===
      latestPrivateChat?.sender
    ) {
      setCheckIsPublisherPrivate(true)
    } else if (latestPrivateChat?.sender === undefined) {
      setCheckIsPublisherPrivate(true)
    } else {
      setCheckIsPublisherPrivate(false)
    }
  }, [privateChat.length])

  useEffect(() => {
    if (
      participantList?.[selfTileIndex]?.participant_id ===
      latestGroupChat?.sender
    ) {
      setCheckIsPublisherGroup(true)
    } else if (latestGroupChat?.sender === undefined) {
      setCheckIsPublisherGroup(true)
    } else {
      setCheckIsPublisherGroup(false)
    }
  }, [groupChat.length])

  useEffect(() => {
    if (handRaised?.state && !raiseHand?.[0]?.isPublisher && !pageVisibility && time > 5) {
      notifyMe("handRaise")
    }
  }, [raiseHand])

  useEffect(() => {
    

    // const audio = document.getElementById("audioSrc")
    if (
      !pageVisibility &&
      !latestGroupChat?.seen &&
      groupChat.length > 0 &&
      !checkIsPublisherGroup &&
      permission
    ) {
      {
        return (latestGroupChat?.type === "file" &&
          latestGroupChat?.title.includes(".png")) ||
          latestGroupChat?.title.includes(".jpg") ||
          latestGroupChat?.title.includes(".jpeg")
          ? notifyMe("imageGroupChat")
          : latestGroupChat?.type === "file"
          ? notifyMe("fileGroupChat")
          : notifyMe("groupChat")
      }
    }
    
  }, [groupChat.length, checkIsPublisherGroup])

  useEffect(() => {
    if (!pageVisibility && waitingList.length > 0 && isHost) {
      // const audio = document.getElementById("audioSrc")
      notifyMe("waitingRoom")
    }
  }, [waitingList.length])

  useEffect(() => {
    if (!pageVisibility && meetingnotification.length > 0) {
      // const audio = document.getElementById("audioSrc")
      if (
        latestNotification?.message !== undefined &&
        latestNotification?.check?.includes("left") ||
        latestNotification?.check?.includes("joined")
      ) {
        notifyMe("newParticipant")
      } else if (latestNotification?.check?.includes("networkEvents")) {
         notifyMe("networkEvents")
      }
     
    }
    
    
  }, [meetingnotification.length])

  useEffect(() => {

    if (
      !pageVisibility &&
      privateChat.length > 0 &&
      !checkIsPublisherPrivate &&
      permission
    ) {
      
      {
        return (latestPrivateChat?.type === "file" &&
          latestPrivateChat?.title.includes(".png")) ||
          latestPrivateChat?.title.includes(".jpg") ||
          latestPrivateChat?.title.includes(".jpeg")
          ? notifyMe("imagePrivateChat")
          : latestPrivateChat?.type === "file"
          ? notifyMe("filePrivateChat")
          : notifyMe("privateChat")
      }
    }
  }, [privateChat.length, checkIsPublisherPrivate])

  const privateChatFn = () => {
    dispatch(
      actionCreators.setPrivateChatParticipant(
        latestPrivateChat?.participant_id,
        latestPrivateChat?.participant_name
      )
    )
    dispatch(actionCreators.setPrivateChatState(true))
    dispatch(actionCreators.setTab("chat"))
    dispatch(actionCreators.setMembersList(true))
    dispatch(actionCreators.setGroupChat(false))
  }
  const groupChatFn = () => {
    dispatch(actionCreators.setGroupChat(true))
    dispatch(actionCreators.setActiveChat("group"))
    dispatch(actionCreators.setTab("chat"))
    dispatch(actionCreators.setMembersList(true))
    dispatch(actionCreators.setPrivateChatState(false))
  }

  const notificationCases = (event: any) => {
    switch (event) {
      case "newParticipant":
        const notification1 = new Notification(latestNotification?.message, {
          icon: brandingInfo?.data?.logos?.favicon,
        })
        notification1.onclick = (event) => {
          window.focus()
        }
        break
      case "waitingRoom":
        const notification2 = new Notification(
          `${latestWaitingList?.name} ${t("Notifications.JoinTheMeeting")}`,
          {
            icon: brandingInfo?.data?.logos?.favicon,
          }
        )
        notification2.onclick = (event) => {
          window.focus()
        }
        break
      case "privateChat":
        const notification3 = new Notification(
          screenShareOn
            ? t("Notifications.NewMsg")
            : latestPrivateChat.participant_name,
          !screenShareOn
            ? {
                icon: brandingInfo?.data?.logos?.favicon,
                body: `${latestPrivateChat.message}`,
              }
            : { icon: brandingInfo?.data?.logos?.favicon }
        )

        notification3.onclick = (event) => {
          window.focus()
          privateChatFn()
        }
        break
      case "groupChat":
        const notification4 = new Notification(
          screenShareOn
            ? t("Notifications.NewMsg")
            : `${latestGroupChat.participant_name} ${t(
                "Notifications.ToEveryone"
              )}`,
          !screenShareOn
            ? {
                icon: brandingInfo?.data?.logos?.favicon,
                body: `${latestGroupChat.message}`,
              }
            : { icon: brandingInfo?.data?.logos?.favicon }
        )
        notification4.onclick = (event) => {
          window.focus()
          groupChatFn()
        }
        break
      case "imageGroupChat":
        const notification5 = new Notification(
          screenShareOn
            ? t("Notifications.NewMsg")
            : `${latestGroupChat.participant_name} ${t(
                "Notifications.ToEveryone"
              )}`,
          !screenShareOn
            ? {
                icon: brandingInfo?.data?.logos?.favicon,
                body: `${t("Notifications.SharedAnImage")}`,
              }
            : { icon: brandingInfo?.data?.logos?.favicon }
        )
        notification5.onclick = (event) => {
          window.focus()
          groupChatFn()
        }
        break
      case "imagePrivateChat":
        const notification7 = new Notification(
          screenShareOn
            ? t("Notifications.NewMsg")
            : latestPrivateChat.participant_name,
          !screenShareOn
            ? {
                icon: brandingInfo?.data?.logos?.favicon,
                body: `${t("Notifications.SharedAnImage")}`,
              }
            : { icon: brandingInfo?.data?.logos?.favicon }
        )
        notification7.onclick = (event) => {
          window.focus()
          privateChatFn()
        }
        break
      case "fileGroupChat":
        const notification6 = new Notification(
          screenShareOn
            ? t("Notifications.NewMsg")
            : `${latestGroupChat.participant_name} ${t(
                "Notifications.ToEveryone"
              )}`,
          !screenShareOn
            ? {
                icon: brandingInfo?.data?.logos?.favicon,
                body: `${t("Notifications.SharedAFile")} ${
                  latestGroupChat?.title
                }`,
              }
            : { icon: brandingInfo?.data?.logos?.favicon }
        )
        notification6.onclick = (event) => {
          window.focus()
          groupChatFn()
        }
        break
      case "filePrivateChat":
        const notification8 = new Notification(
          screenShareOn
            ? t("Notifications.NewMsg")
            : latestPrivateChat.participant_name,
          !screenShareOn
            ? {
                icon: brandingInfo?.data?.logos?.favicon,
                body: `${t("Notifications.SharedAFile")} ${
                  latestPrivateChat?.title
                }`,
              }
            : { icon: brandingInfo?.data?.logos?.favicon }
        )
        notification8.onclick = (event) => {
          window.focus()
          privateChatFn()
        }
        break
      case "handRaise":
        if (raiseHand?.length > 0 && raiseHand != undefined) {
          const notification = new Notification(
            `${raiseHand?.[0]?.name} ${t("Notifications.RaisedHand")}`,
            {
              icon: brandingInfo?.data?.logos?.favicon,
            }
          )
          notification.onclick = () => {
            window.focus()
          }
        }
        break
      case "networkEvents":
         const notification = new Notification(latestNotification?.message, {
           icon: brandingInfo?.data?.logos?.favicon,
         })
          notification.onclick = () => {
            window.focus()
          }
        break
    }
  }

  const notifyMe = (event: any) => {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert(t("Notifications.NotSupporting"))
    } else if (Notification.permission === "granted") {
      notificationCases(event)
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      try {
        if (Notification?.requestPermission) {
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              notificationCases(event)
            }
          })
        }
      }
      catch(err){
        
      }
      
        
    }
  }

  return (
    <div>
      <audio
        src={
          audioFile
        }
        id="audioSrc"
      />
    </div>
  )
}

export default PushNotifications
