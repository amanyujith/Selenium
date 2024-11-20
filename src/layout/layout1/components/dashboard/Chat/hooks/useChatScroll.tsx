import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  Dispatch,
  SetStateAction,
} from "react"

function useChatScroll(
  messages: Array<IMessage>,
  uuid: string | null,
  isLoading: boolean,
  chatID: string | undefined,
  dispatchSeen: () => void,
  lastScrollPos: number,
  setScrollDownButton: Dispatch<SetStateAction<boolean>>
): IHook {
  const ref = useRef<HTMLDivElement>(null)
  const [newMessage, toggleNewMessage] = useState<boolean>(false)

  const [currentChatID, setCurrentChatID] = useState(chatID)
  const [showNewMessage, setShowNewMessage] = useState<boolean>(true)

  // const scrollToMessage = (
  //   msgRef: React.MutableRefObject<HTMLDivElement | null>
  // ) => {};

  const resetNewMessage = () => {
    toggleNewMessage(false)
    setScrollDownButton(false)
    if (ref.current) {
      ref.current.scrollTo({
        behavior: "smooth",
        top: ref.current.scrollHeight,
      })
    }
  }

  const clearNewMessage = () => {
    toggleNewMessage(false)
  }

  useEffect(() => {
    setShowNewMessage(true)
  }, [chatID])

  useLayoutEffect(() => {
    if (ref.current) {
      const lastItem = messages.at(-1)
      const { offsetHeight, scrollHeight, scrollTop } =
        ref.current as HTMLDivElement

      if (currentChatID !== chatID) {
        setCurrentChatID(chatID)
      } else {
        if (uuid === lastItem?.from) {
          ref.current?.scrollTo({ behavior: "smooth", top: scrollHeight })
        } else {
          setShowNewMessage(false)
          if (scrollHeight <= scrollTop + offsetHeight + 500) {
            ref.current?.scrollTo({ behavior: "smooth", top: scrollHeight })
            dispatchSeen()
          } else {
            toggleNewMessage(true)
          }
          // ref.current.scrollTop = ref.current.scrollHeight;
        }
      }
    }
  }, [messages.at(-1), uuid, chatID])
  return { ref, newMessage, resetNewMessage, clearNewMessage, showNewMessage }
}

export default useChatScroll

interface IMessage {
  uuid: string
  type: string
  to: string
  tenant: string
  status: string
  seen: Array<any>
  reply_to: string | undefined
  other_info_map: Array<string>
  from: string
  forward_from: string | undefined
  category: string
  body: any
  a_mtime: number
  a_ctime: number
  reactions: Array<any>
}

interface IHook {
  ref: React.MutableRefObject<HTMLDivElement | null>
  newMessage: boolean
  resetNewMessage: () => void
  clearNewMessage: () => void
  showNewMessage: boolean
}
