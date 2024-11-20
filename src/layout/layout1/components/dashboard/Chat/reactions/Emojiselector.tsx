import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../../store"
import { Hover, HoverStyle, withActive } from "./helpers"
import EmojiPicker from "@emoji-mart/react"

export interface EmojiSelectorProps {
  shortCode: string
  active?: boolean
  id: string
  isGroup: boolean
  to: string
  reactions: any[]
  closemodal: any
}

export const EmojiSelector = withActive<EmojiSelectorProps>(
  ({ shortCode, active = false, id, isGroup, to, reactions, closemodal }) => {
    const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
    const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
    const settings = useSelector(
      (state: any) => state.Main.soundAndNotification
    )

    const dispatch = useDispatch()
    const showEmoji = () => {
      dispatch(actionCreators.setOptionBox(false))
    }
    // useEffect(() => {
    //

    //   const file = settings[0]?.reaction

    // }, [settings[0]?.reaction])

    const playSound = (src: string) => {
      if (!settings[0]?.mute) {
        const audio = new Audio(src)
        audio.currentTime = 0
        //audio.loop = true
        audio.play()
      }
    }

    const handleClick = () => {
      let flag = true
      reactions &&
        reactions.map((node: any) => {
          if (
            node.emoji === shortCode &&
            node.member.includes(personalInfo.uuid)
          ) {
            flag = false
          }
        })

      flag && chatInstance?.reactionMessage(shortCode, "add", id, to, isGroup)
      showEmoji()
      closemodal()
      // playSound(audioFile)
    }

    return (
      <Hover
        style={{ ...wrapStyle, ...(active ? wrapStyleActive : {}) }}
        onClick={() => handleClick()}
      >
        <HoverStyle hoverStyle={emojiStyleHover} style={emojiStyle}>
          {shortCode}
        </HoverStyle>
      </Hover>
    )
  }
)

const wrapStyle = {
  padding: "8px 0",
}
const emojiStyle: React.CSSProperties = {
  width: "34px",
  textAlign: "center",
  lineHeight: "29px",
  fontSize: "16px",
  fontFamily:
    '"Apple Color Emoji", "Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol"',
  cursor: "pointer",

  transform: "scale(1)",
  transition: "transform 0.15s cubic-bezier(0.2, 0, 0.13, 2)",
}
const emojiStyleHover = {
  transform: "scale(1.2)",
}
const wrapStyleActive = {
  backgroundColor: "#f2f8fa",
}

export default EmojiSelector
