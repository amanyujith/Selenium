import React from "react"
import { chat_icon, incoming_ring, phone_call } from "../svg"

const ChatButton = () => {
  return (
    <div className="p-2 scale-75 flex items-center justify-center rounded-md">{chat_icon}</div>
  )
}

export default ChatButton
