import React, { Dispatch, SetStateAction } from "react"
import { ARROW_DOWN } from "../../../../../../utils/SVG/svgsRestHere"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../../store"

interface scrollDownButton {
  unread_msg_count: number
  resetNewMessage: () => void
  setScrollDownButton: Dispatch<SetStateAction<boolean>>
  isLoadingFuture: boolean
}

const ScrollDownButton = ({
  unread_msg_count,
  resetNewMessage,
  setScrollDownButton,
  isLoadingFuture,
}: scrollDownButton) => {
  const { data: activeChat, isGroup } = useSelector(
    (state: RootState) => state.Chat.activeChat
  )
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const dispatch = useDispatch()

  const handleClick = async () => {
    if (!isLoadingFuture) {
      if (unread_msg_count) {
        chatInstance?.updateMessageSeenStatus(isGroup, activeChat?.uuid)
        dispatch(actionCreators.unsetUnread(activeChat?.uuid, isGroup))
      }
      if (activeChat?.cachedMessages) {
        await dispatch(
          actionCreators.updateCachedMessages({
            to: activeChat?.cachedMessages[0]?.to,
            from: activeChat?.cachedMessages[0]?.from,
            isGroup: activeChat?.cachedMessages?.[0]?.group,
          })
        )
        resetNewMessage()
      }
      resetNewMessage()
    }
  }

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-1 rounded-[50%] bg-[#F7941E] absolute right-8 ${
        !activeChat?.isTyping ? "bottom-8" : "bottom-[3px]"
      } cursor-pointer`}
    >
      {unread_msg_count > 0 && (
        <div
          className={`rounded-full w-fit text-[11px] px-1 h-[12px] flex items-center content-center text-[#FFFFFF] absolute bottom-4 right-4 bg-[#AD6716]  `}
        >
          {unread_msg_count}
        </div>
      )}
      {ARROW_DOWN}
    </motion.div>
  )
}

export default ScrollDownButton
