const Cabello = require("../../dashboard/Chat/audio/incoming-outgoing-message/Cabello.mp3")
const Incoming = require("../../dashboard/Chat/audio/incoming-outgoing-message/Incoming.mp3")
const LiveChat = require("../../dashboard/Chat/audio/incoming-outgoing-message/Live Chat.mp3")
const Messagetone = require("../../dashboard/Chat/audio/incoming-outgoing-message/Message Tone.mp3")
const Notify = require("../../dashboard/Chat/audio/incoming-outgoing-message/Notify.mp3")
const Outgoing = require("../../dashboard/Chat/audio/incoming-outgoing-message/Outgoing.mp3")
const ping = require("../../dashboard/Chat/audio/incoming-outgoing-message/Ping.mp3")
const positiveNote = require("../../dashboard/Chat/audio/incoming-outgoing-message/Positive Notice.mp3")
const serviceBell = require("../../dashboard/Chat/audio/incoming-outgoing-message/Service Bell.mp3")
const Shooting = require("../../dashboard/Chat/audio/incoming-outgoing-message/Shooting.mp3")
const success = require("../../dashboard/Chat/audio/incoming-outgoing-message/Success.mp3")
const theNotification = require("../../dashboard/Chat/audio/incoming-outgoing-message/The Notification.mp3")
const deyDey = require("../../dashboard/Chat/audio/incoming-call/Dey-dey.mp3")
const digitalPhone = require("../../dashboard/Chat/audio/incoming-call/Digital Phone.mp3")
const elegant = require("../../dashboard/Chat/audio/incoming-call/Elegant.mp3")
const knowIt = require("../../dashboard/Chat/audio/incoming-call/Know it.mp3")
const ladyRing = require("../../dashboard/Chat/audio/incoming-call/Lady Ring.mp3")
const originalPhone = require("../../dashboard/Chat/audio/incoming-call/Original Phone.mp3")
const Simple = require("../../dashboard/Chat/audio/incoming-call/Simple.mp3")

//Return last minute of the day
export const tonightTime = () => {
  const currentDate = new Date()
  const midnightDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate?.getDate() + 1,
    0,
    0,
    0,
    0
  )
  const lastMinuteOfToday = new Date(midnightDate.getTime() - 1000)
  const epochTime = Math.floor(lastMinuteOfToday.getTime())
  return epochTime
}

export const convertEpochToNormalTime = (epoch: any) => {
  const t = new Date()
  const epocT = new Date(epoch)

  const currentDate = new Date().toLocaleDateString()
  const epochDate = new Date(epoch).toLocaleDateString()

  if (epochDate === currentDate) {
    const formatted =
      ("0" + epocT.getHours()).slice(-2) +
      ":" +
      ("0" + epocT.getMinutes()).slice(-2)
    return formatted === "11:59 PM" ? "Today" : formatted
  } else {
    const ctDate = new Date()
    const inputDate = new Date(epoch) //@ts-ignore
    const res = Math.abs(ctDate - inputDate) / 1000

    const difference = Math.floor(res / 86000)
    return difference === 1 ? `${difference} day` : `${difference} days`
  }
}

// Epoc time is required, Convert time to Epoc
export const calculateEpochTime = (
  hours = 0,
  minutes = 0,
  days = 0,
  weeks = 0
) => {
  const millisecondsPerSecond = 1000
  const secondsPerMinute = 60
  const minutesPerHour = 60
  const hoursPerDay = 24
  const daysPerWeek = 7
  const currentTime = new Date().getTime()

  const timeOffset =
    (hours * minutesPerHour + minutes) *
      secondsPerMinute *
      millisecondsPerSecond +
    (days * hoursPerDay + weeks * daysPerWeek) *
      hoursPerDay *
      minutesPerHour *
      secondsPerMinute *
      millisecondsPerSecond

  // Calculate the epoch time of future
  const futureEpochTime = currentTime + timeOffset

  return futureEpochTime
}

export const getTonightTime = (event?: any) => {
  const currentDate = new Date(event)
  const midnightDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
    0,
    0,
    0,
    0
  )
  const lastMinuteOfToday = new Date(midnightDate.getTime() - 1000)
  return lastMinuteOfToday
}

//Username Validation
export const handleKeyDown = (evt: any) => {
  if (evt.keyCode === 8) {
    return
  }

  if (evt.target.value.length >= 15) {
    evt.preventDefault()
    return
  }

  ;(evt.keyCode === 8 ||
  evt.keyCode === 13 ||
  evt.keyCode === 86 ||
  evt.keyCode === 67 ||
  evt.keyCode === 16
    ? null
    : evt.key.match(/[a-zA-Z!@#$%^&*()_=\-[\]{}|\\:;"'~<>,.?/]/g)) &&
    evt.preventDefault()(
      evt.keyCode === 8 ||
        evt.keyCode === 13 ||
        evt.keyCode === 86 ||
        evt.keyCode === 67
        ? null
        : evt.key.match(/[a-zA-Z!@#$%^&*()_+=\-[\]{}|\\:;"'~<>,.?/]/g)
    ) &&
    evt.preventDefault()
}

export const playSound = (args: string) => {
  const audio = new Audio("")
  audio.src = ""
  audio.pause()
  args === "cabello"
    ? (audio.src = Cabello)
    : args == "knowit"
    ? (audio.src = knowIt)
    : args == "elegant"
    ? (audio.src = elegant)
    : args == "ladyring"
    ? (audio.src = ladyRing)
    : args == "originalphone"
    ? (audio.src = originalPhone)
    : args == "digitalphone"
    ? (audio.src = digitalPhone)
    : args == "simple"
    ? (audio.src = Simple)
    : args == "deydey"
    ? (audio.src = deyDey)
    : args == "thenotification"
    ? (audio.src = theNotification)
    : args == "shooting"
    ? (audio.src = Shooting)
    : args == "success"
    ? (audio.src = success)
    : args == "servicebell"
    ? (audio.src = serviceBell)
    : args == "positivenote"
    ? (audio.src = positiveNote)
    : args == "ping"
    ? (audio.src = ping)
    : args == "incoming"
    ? (audio.src = Incoming)
    : args == "livechat"
    ? (audio.src = LiveChat)
    : args == "messagetone"
    ? (audio.src = Messagetone)
    : args == "notify"
    ? (audio.src = Notify)
    : args == "outgoing"
    ? (audio.src = Outgoing)
    : (audio.src = "")
  audio.play()
  setTimeout(() => {
    audio.pause()
  }, 2500)
}
