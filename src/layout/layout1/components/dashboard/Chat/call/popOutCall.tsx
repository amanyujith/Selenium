import React, { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import IncomingCallModal from "./IncomingCallModal"
import { t } from "i18next"
import { useSelector } from "react-redux"
const deyDey = require("../audio/incoming-call/Dey-dey.mp3")
const digitalPhone = require("../audio/incoming-call/Digital Phone.mp3")
const elegant = require("../audio/incoming-call/Elegant.mp3")
const knowIt = require("../audio/incoming-call/Know it.mp3")
const ladyRing = require("../audio/incoming-call/Lady Ring.mp3")
const originalPhone = require("../audio/incoming-call/Original Phone.mp3")
const Simple = require("../audio/incoming-call/Simple.mp3")

interface RenderInWindowProps {
  title: string
  onClose: (hangup: boolean) => void
  onAccept: (video: boolean) => void
  incomingCallData: any
  existingCallInfo: any
  answerLater: () => void
}

const RenderInWindow: React.FC<RenderInWindowProps> = ({
  title,
  onClose,
  onAccept,
  incomingCallData,
  existingCallInfo,
  answerLater,
}) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const newWindow = useRef<Window | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const callAcceptedRef = useRef<null | boolean>(null)

  useEffect(() => {
    // Create container element on client-side
    const newContainer = document.createElement("div")
    newContainer.id = "incomingcall-popout-container"
    setContainer(newContainer)
  }, [])
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const audioRef = useRef<HTMLAudioElement>(null)
  var audio = new Audio(knowIt)

  useEffect(() => {
    audio.src = ""
    const file = settings[0]?.incoming_call_notftn_sound
    file === "ladyring"
      ? (audio.src = ladyRing)
      : file == "deydey"
      ? (audio.src = deyDey)
      : file == "simple"
      ? (audio.src = Simple)
      : file == "originalphone"
      ? (audio.src = originalPhone)
      : file == "elegant"
      ? (audio.src = elegant)
      : file == "digitalphone"
      ? (audio.src = digitalPhone)
      : file == "turnedoff"
      ? (audio.src = "")
      : (audio.src = knowIt)
  }, [settings[0]?.incoming_call_notftn_sound])

  useEffect(() => {
    if (!settings[0]?.mute) {
      audio.loop = true
      audio.play()
    }

    return () => {
      audio.pause()
    }
  }, [])

  const onCallAccept = (video: boolean) => {
    callAcceptedRef.current = true
    onAccept(video)
  }

  //   useEffect(() => {
  //     if (audioRef.current) {
  //       audioRef.current.loop = true;
  //       audioRef.current
  //         .play()
  //         .then(() => {
  //           // Playback started successfully, handle any further actions if needed
  //         })
  //         .catch((error: any) => {
  //           // Playback failed, handle the error if needed
  //
  //         });
  //     }
  //     return () => {
  //       if (audioRef.current) audioRef.current.pause();
  //     };
  //   }, []);

  function copyStyles(src: any, dest: any) {
    Array.from(src.styleSheets).forEach((styleSheet: any) => {
      const styleElement = styleSheet.ownerNode.cloneNode(true)
      styleElement.href = styleSheet.href
      dest.head.appendChild(styleElement)
    })

    Array.from(src.fonts).forEach((font: any) => {
      const isFromCSS = font.style !== ""
      if (!isFromCSS) {
        dest.fonts.add(font)
      }
    })
  }

  function debounce(callback: () => void, delay: number): () => void {
    let timeoutId: NodeJS.Timeout | undefined
    return function () {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(callback, delay)
    }
  }

  //   const handleResize: () => void = debounce(() => {
  //     if (
  //       newWindow.current &&
  //       (newWindow.current.outerWidth < 880 ||
  //         newWindow.current.outerHeight < 500)
  //     ) {
  //       newWindow?.current?.resizeTo(
  //         Math.max(newWindow?.current.outerWidth, 880),
  //         Math.max(newWindow?.current.outerHeight, 500)
  //       );
  //     }
  //   }, 200);
  useEffect(() => {
    if (newWindow.current)
      newWindow.current.document.title =
        t("Call.IncomingCallFrom") + " " + incomingCallData?.name
  }, [incomingCallData])

  useEffect(() => {
    // When container is ready
    if (container) {
      // Create window

      newWindow.current = window.open(
        "",
        "popout",
        "popup,width=400,height=300,left=400,top=200,resizable=0"
      )
      const handleKeyPress = (event: any) => {
        if (
          event.keyCode === 72 &&
          (event.ctrlKey || event.metaKey) &&
          event.shiftKey
        ) {
          onAccept(false)
        }
      }
      // Append container
      if (newWindow.current) {
        newWindow.current.addEventListener("keydown", (event) => {
          handleKeyPress(event)
        })
        copyStyles(window.document, newWindow.current.document)
        newWindow.current.document.body.appendChild(container)
        newWindow.current.document.title =
          t("Call.IncomingCallFrom") + " " + incomingCallData?.name
        // newWindow.current.addEventListener("resize", handleResize);
      }

      // Save reference to window for cleanup
      const curWindow = newWindow.current

      window.onbeforeunload = () => {
        curWindow?.close()
        onClose(false)
      }

      // Return cleanup function
      return () => {
        audio.pause()
        if (curWindow) {
          curWindow.close()
          if (!callAcceptedRef?.current) onClose(false)
        } else {
          if (!callAcceptedRef?.current) onClose(false)
        }
      }
    }
  }, [container])

  if (newWindow.current) {
    newWindow.current.onbeforeunload = () => {
      if (!callAcceptedRef?.current) onClose(false)
    }
  }

  return (
    container &&
    ReactDOM.createPortal(
      <div ref={elementRef} className="incomingCallmodal">
        <audio ref={audioRef}>
          <source src={knowIt} type="audio/mpeg" />
          {t("Chat.BrowerNotSupport")}
        </audio>
        <IncomingCallModal
          title="Incoming Call"
          onAccept={onCallAccept}
          onclose={onClose}
          existingCallInfo={existingCallInfo}
          incomingCallData={incomingCallData}
          answerLater={answerLater}
        />
      </div>,
      container
    )
  )
}

export default RenderInWindow
