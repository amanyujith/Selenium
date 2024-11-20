import { t } from "i18next"

export const defaultStatus = [
  {
    name: "In a meeting",
    value: "01:00 hour",
    time: 60,
    emoji: "🗓️",
    duration: "01:00 hour",
    default: true,
    delete_flag: false,
  },
  {
    name: "Outside for lunch",
    value: "00:30 hour",
    time: 30,
    duration: "00:30 hour",
    emoji: "🍜",
    default: true,
    delete_flag: false,
  },
  {
    name: "On Sick Leave",
    value: "Today",
    time: 1440,
    duration: "Today",
    emoji: "🤒",
    default: true,
    delete_flag: false,
  },
  {
    name: "Working from Home",
    value: "Today",
    time: 1440,
    duration: "Today",
    emoji: "🏡",
    default: true,
    delete_flag: false,
  },
]

export const options = [
  {
    name: "English",
    value: "en",
  },
  {
    name: "French",
    value: "fr",
  },
]

export const timeValues = [
  {
    name: "00:30 hour",
    value: 30,
  },
  { name: "01:00 hour", value: 60 },
  { name: "02:00 hours", value: 120 },
  { name: "04:00 hours", value: 240 },
  { name: "Today", value: "today" },
]

export const pbxIncomingCallFn = (chatSettings: any) => {
  return {
    type: "Pbx Incoming Call Notification",
    options: [
      {
        value: "knowit",
        name: "Know It",
        select:
          chatSettings[0]?.pbx_call_notification === "knowit" ||
          chatSettings[0]?.pbx_call_notification === null
            ? true
            : false,
      },
      {
        value: "deydey",
        name: "Dey-Dey",
        select:
          chatSettings[0]?.pbx_call_notification === "deydey" ? true : false,
      },
      {
        value: "elegant",
        name: "Elegant",
        select:
          chatSettings[0]?.pbx_call_notification === "elegant" ? true : false,
      },
      {
        value: "digitalphone",
        name: "Digital Phone",
        select:
          chatSettings[0]?.pbx_call_notification === "digitalphone"
            ? true
            : false,
      },
      {
        value: "originalphone",
        name: "Original Phone",
        select:
          chatSettings[0]?.pbx_call_notification === "originalphone"
            ? true
            : false,
      },
      {
        value: "simple",
        name: "Simple",
        select:
          chatSettings[0]?.pbx_call_notification === "simple" ? true : false,
      },
      {
        value: "ladyring",
        name: "Lady Ring",
        select:
          chatSettings[0]?.pbx_call_notification === "ladyring" ? true : false,
      },
      {
        value: "turnedoff",
        name: "No Sound",
        select:
          chatSettings[0]?.pbx_call_notification === "turnedoff" ? true : false,
      },
    ],
  }
}

export const reactionsFn = (chatSettings: any) => {
  return {
    type: "Reaction",
    options: [
      {
        value: "default",
        name: "Reaction Default",
        select: chatSettings[0]?.reaction === "default" ? true : false,
      },
      {
        value: "chat1",
        name: "Reaction 1",
        select: chatSettings[0]?.reaction === "chat1" ? true : false,
      },
      {
        value: "chat2",
        name: "Reaction 2",
        select: chatSettings[0]?.reaction === "chat2" ? true : false,
      },
      {
        value: "chat3",
        name: "Reaction 3",
        select: chatSettings[0]?.reaction === "chat3" ? true : false,
      },
      {
        value: "chat4",
        name: "Reaction 4",
        select: chatSettings[0]?.reaction === "chat4" ? true : false,
      },
      {
        value: "chat5",
        name: "Reaction 5",
        select: chatSettings[0]?.reaction === "chat5" ? true : false,
      },
      {
        value: "chat6",
        name: "Reaction 6",
        select: chatSettings[0]?.reaction === "chat6" ? true : false,
      },
      {
        value: "turnedoff",
        name: "No sound",
        select: chatSettings[0]?.reaction === "turnedoff" ? true : false,
      },
    ],
  }
}

export const outgoingCallFn = (chatSettings: any) => {
  return {
    type: "Call Notification Sound (Outgoing)",
    options: [
      {
        value: "call_one",
        name: "call_one",
        select:
          chatSettings[0]?.outgoing_call_notftn_sound === "value"
            ? true
            : false,
      },
      {
        value: "call_two",
        name: "call_two",
        select:
          chatSettings[0]?.outgoing_call_notftn_sound === "value"
            ? true
            : false,
      },
      {
        value: "call_three",
        name: "call_three",
        select:
          chatSettings[0]?.outgoing_call_notftn_sound === "value"
            ? true
            : false,
      },
    ],
  }
}

export const notificationPopup = [
  {
    value: "alert&sound",
    name: "Alert & Sound",
    select: false,
  },
  {
    value: "alert",
    name: "Alert Only",
    select: false,
  },
  {
    value: "sound",
    name: "Sound Only",
    select: false,
  },
  {
    value: "badge",
    name: "Badge Icon",
    select: false,
  },
]

export const reactionMeeting = {
  type: "Reaction",
  options: [
    {
      value: "sound_one",
      name: "sound_one",
      select: false,
    },
    {
      value: "sound_two",
      select: false,
      name: "sound_two",
    },
    {
      value: "sound_three",
      name: "sound_three",
      select: false,
    },
  ],
}

export const raiseHand = {
  type: "Raise Hand",
  options: [
    {
      value: "sound_one",
      name: "sound_one",
      select: false,
    },
    {
      value: "sound_two",
      select: false,
      name: "sound_two",
    },
    {
      value: "sound_three",
      name: "sound_three",
      select: false,
    },
  ],
}

export const outGoingChatMeeting = {
  type: "Chat Notification Sound (Outgoung)",
  options: [
    {
      value: "sound_one",
      name: "sound_one",
      select: false,
    },
    {
      value: "sound_two",
      name: "sound_two",
      select: false,
    },
    {
      value: "sound_three",
      name: "sound_three",
      select: true,
    },
  ],
}

export const inComingChatMeeting = {
  type: "Chat Notification Sound ",
  options: [
    {
      value: "sound_one",
      name: "sound_one",
      select: false,
    },
    {
      value: "sound_two",
      name: "sound_two",
      select: true,
    },
    {
      value: "sound_three",
      name: "sound_three",
      select: false,
    },
  ],
}

export const incomingCallFn = (chatSettings: any) => {
  return {
    type: t("Notifications.IncomingCall"),
    options: [
      {
        value: "knowit",
        name: "Know It",
        select:
          chatSettings[0]?.incoming_call_notftn_sound === "knowit" ||
          chatSettings[0]?.incoming_call_notftn_sound === "default"
            ? true
            : false,
      },
      {
        value: "deydey",
        name: "Dey-Dey",
        select:
          chatSettings[0]?.incoming_call_notftn_sound === "deydey"
            ? true
            : false,
      },
      {
        value: "elegant",
        name: "Elegant",
        select:
          chatSettings[0]?.incoming_call_notftn_sound === "elegant"
            ? true
            : false,
      },
      {
        value: "digitalphone",
        name: "Digital Phone",
        select:
          chatSettings[0]?.incoming_call_notftn_sound === "digitalphone"
            ? true
            : false,
      },
      {
        value: "originalphone",
        name: "Original Phone",
        select:
          chatSettings[0]?.incoming_call_notftn_sound === "originalphone"
            ? true
            : false,
      },
      {
        value: "simple",
        name: "Simple",
        select:
          chatSettings[0]?.incoming_call_notftn_sound === "simple"
            ? true
            : false,
      },
      {
        value: "ladyring",
        name: "Lady Ring",
        select:
          chatSettings[0]?.incoming_call_notftn_sound === "ladyring"
            ? true
            : false,
      },
      {
        value: "turnedoff",
        name: "No Sound",
        select:
          chatSettings[0]?.incoming_call_notftn_sound === "turnedoff"
            ? true
            : false,
      },
    ],
  }
}

export const outGoingChatFn = (chatSettings: any) => {
  return {
    type: t("Notifications.OutgoingChat"),
    options: [
      {
        value: "incoming",
        name: "Incoming Ding",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "incoming"
            ? true
            : false,
      },
      {
        value: "outgoing",
        name: "Outgoing Dong",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "outgoing" ||
          chatSettings[0]?.outgoing_chat_notftn_sound === "default"
            ? true
            : false,
      },
      {
        value: "cabello",
        name: "Cabello",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "cabello"
            ? true
            : false,
      },
      {
        value: "livechat",
        name: "Live Chat",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "livechat"
            ? true
            : false,
      },
      {
        value: "messagetone",
        name: "Message Tone",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "messagetone"
            ? true
            : false,
      },
      {
        value: "notify",
        name: "Notify",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "notify"
            ? true
            : false,
      },
      {
        value: "ping",
        name: "Ping",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "ping" ? true : false,
      },
      {
        value: "positivenote",
        name: "Positive Note",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "positivenote"
            ? true
            : false,
      },
      {
        value: "servicebell",
        name: "Service Bell",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "servicebell"
            ? true
            : false,
      },
      {
        value: "shooting",
        name: "Shooting",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "shooting"
            ? true
            : false,
      },
      {
        value: "success",
        name: "Success",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "success"
            ? true
            : false,
      },
      {
        value: "thenotification",
        name: "The Notification",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "thenotification"
            ? true
            : false,
      },
      {
        value: "turnedoff",
        name: "No Sound",
        select:
          chatSettings[0]?.outgoing_chat_notftn_sound === "turnedoff"
            ? true
            : false,
      },
    ],
  }
}

export const groupChatFn = (chatSettings: any) => {
  return {
    type: t("Notifications.IncomingGroup"),
    options: [
      {
        value: "incoming",
        name: "Incoming Ding",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "incoming" ||
          chatSettings[0]?.group_chat_notftn_sound === "default"
            ? true
            : false,
      },
      {
        value: "outgoing",
        name: "Outgoing Dong",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "outgoing"
            ? true
            : false,
      },
      {
        value: "cabello",
        name: "Cabello",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "cabello" ? true : false,
      },
      {
        value: "livechat",
        name: "Live Chat",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "livechat"
            ? true
            : false,
      },
      {
        value: "messagetone",
        name: "Message Tone",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "messagetone"
            ? true
            : false,
      },
      {
        value: "notify",
        name: "Notify",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "notify" ? true : false,
      },
      {
        value: "ping",
        name: "Ping",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "ping" ? true : false,
      },
      {
        value: "positivenote",
        name: "Positive Note",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "positivenote"
            ? true
            : false,
      },
      {
        value: "servicebell",
        name: "Service Bell",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "servicebell"
            ? true
            : false,
      },
      {
        value: "shooting",
        name: "Shooting",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "shooting"
            ? true
            : false,
      },
      {
        value: "success",
        name: "Success",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "success" ? true : false,
      },
      {
        value: "thenotification",
        name: "The Notification",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "thenotification"
            ? true
            : false,
      },
      {
        value: "turnedoff",
        name: "No Sound",
        select:
          chatSettings[0]?.group_chat_notftn_sound === "turnedoff"
            ? true
            : false,
      },
    ],
  }
}

export const inComingChatFn = (chatSettings: any) => {
  return {
    type: t("Notifications.IncomingChat"),
    options: [
      {
        value: "incoming",
        name: "Incoming Ding",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "incoming" ||
          chatSettings[0]?.incoming_chat_notftn_sound === "default"
            ? true
            : false,
      },
      {
        value: "outgoing",
        name: "Outgoing Dong",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "outgoing"
            ? true
            : false,
      },
      {
        value: "cabello",
        name: "Cabello",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "cabello"
            ? true
            : false,
      },
      {
        value: "livechat",
        name: "Live Chat",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "livechat"
            ? true
            : false,
      },
      {
        value: "messagetone",
        name: "Message Tone",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "messagetone"
            ? true
            : false,
      },
      {
        value: "notify",
        name: "Notify",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "notify"
            ? true
            : false,
      },
      {
        value: "ping",
        name: "Ping",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "ping" ? true : false,
      },
      {
        value: "positivenote",
        name: "Positive Note",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "positivenote"
            ? true
            : false,
      },
      {
        value: "servicebell",
        name: "Service Bell",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "servicebell"
            ? true
            : false,
      },
      {
        value: "shooting",
        name: "Shooting",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "shooting"
            ? true
            : false,
      },
      {
        value: "success",
        name: "Success",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "success"
            ? true
            : false,
      },
      {
        value: "thenotification",
        name: "The Notification",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "thenotification"
            ? true
            : false,
      },
      {
        value: "turnedoff",
        name: "No Sound",
        select:
          chatSettings[0]?.incoming_chat_notftn_sound === "turnedoff"
            ? true
            : false,
      },
    ],
  }
}

export const notificationMode = (settings: any) => {
  return [
    {
      id: "all",
      label: t("Notifications.allMsg"),
      checked: settings[0]?.type === "all" ? true : false,
    },
    {
      id: "direct",
      label: t("Notifications.DirectMsg"),
      checked: settings[0]?.type === "direct" ? true : false,
    },
    {
      id: "dnd",
      label: t("Notifications.Dnd"),
      checked: settings[0]?.type === "dnd" ? true : false,
    },
    {
      id: "custom",
      label: t("Custom"),
      checked: settings[0]?.type === "custom" ? true : false,
    },
  ]
}
