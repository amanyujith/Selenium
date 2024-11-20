import {
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react"
import { useDispatch, useSelector } from "react-redux"
import InactiveEditMsgSendIcon from "../Icons/InactiveEditMsgSendIcon"
import Editmsgsendicon from "../Icons/Editmsgsendicon"
import { actionCreators } from "../../../../../../store"
import { useParams } from "react-router-dom"
import OwnChat from "./OwnChat"
import moment from "moment"
import DeleteMsgModal from "../DeleteMsgModal"
import useChatScroll from "../hooks/useChatScroll"
import SkeletonComponent from "../SkeletonComponent"
import SendersChat from "./sendersChat"
import OwnChatTwoSide from "./OwnChatTwoSide"
import SendersChatTwoSide from "./sendersChatTwoSide"
import RichTextBoxEdit from "../richtextboxEdit"
import { t } from "i18next"
import EditmsgsCancelIcon from "../Icons/EditmsgsCancelIcon"
import useQuadrant from "../hooks/useQuadrant"
import ScrollDownButton from "../scrollComponents/scrollDownButton"
import UserIntro from "./UserIntro"
import { Calldiv, Dividers } from "./ChatDividers"
import { START_A_CONVERSATION } from "../../../../../../utils/SVG/svgsRestHere"
const _ = require("lodash")

interface ChatBubbleType {
  profile_picture?: any
  chat: any
  name: string
  isGroup: boolean
  members: any
  inactive_members: any
  status: string
  uuid: string
  scrollPos: number | undefined
  unread_msg_count: number
  cachedMessages: undefined | any
  isTyping: string | null
  isMember: boolean | undefined
  setViewMore: any
}

interface Irefs {
  [key: string]: HTMLDivElement
}

interface ChatBubbleRef {
  scrollIntoMessage: (id: string) => void
}

const ChatBubble = forwardRef<ChatBubbleRef, ChatBubbleType>(
  (
    {
      profile_picture,
      chat,
      name,
      isGroup,
      members,
      inactive_members,
      status,
      uuid,
      scrollPos,
      unread_msg_count,
      cachedMessages,
      isTyping,
      isMember,
      setViewMore,
      ...rest
    },
    fwdRef
  ) => {
    const dispatch = useDispatch()
    const editSec = useSelector((state: any) => state.Chat.edit)
    const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
    const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
    const showModal = useSelector((state: any) => state.Chat.deleteModal)
    const align = useSelector((state: any) => state.Chat.alignOneSide)
    const pageVisibility = useSelector(
      (state: any) => state.Flag.PageVisibilityState
    )
    const miniUuid = useSelector((state: any) => state.Chat.setMentionUuid)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingfuture, setIsLoadingFuture] = useState<boolean>(false)
    const [disableScroll, setDisableScroll] = useState(false)
    const [noMoreHistory, setNoMoreHistory] = useState(false)
    const [noMoreFuture, setNoMoreFuture] = useState(false)
    const [lastScrollPos, setLastScrollPos] = useState<number>(0)
    const searchResultMessage = useSelector(
      (state: any) => state.Chat.searchResultMessage
    )
    const pinnedChat = useSelector((state: any) => state.Chat.pinnedChat)
    const gotoFile = useSelector((state: any) => state.Chat.gotoFile)
    const [scrollFlag, setScrollFlag] = useState<boolean>(false)
    const PrevSrollPos = useRef(0)
    const searchFlag = useSelector((state: any) => state.Chat.searchFlag)
    const messageRefs = useRef<Irefs>({})
    const [quadrant, setQuadrant] = useState("Top-Left")
    const hoveredMessage = useSelector(
      (state: any) => state.Chat.hoveredMessage
    )
    const { data: activeChat, groupCheck } = useSelector(
      (state: any) => state.Chat.activeChat
    )
    const editContainerRef = useRef<HTMLDivElement>(null)
    const { id } = useParams()

    const chatSection = useRef<HTMLDivElement>(null)
    const [scrollDownButton, setScrollDownButton] = useState(false)
    const profileColors = ["#557BBB", "#B78931", "#91785B"]

    const dispatchSeen = () => {
      if (
        unread_msg_count > 0 &&
        pageVisibility &&
        !cachedMessages?.length &&
        !scrollDownButton
      ) {
        chatInstance?.updateMessageSeenStatus(isGroup, uuid)
        dispatch(actionCreators.unsetUnread(uuid, isGroup))
      }
    }

    const {
      ref,
      newMessage,
      resetNewMessage,
      clearNewMessage,
      showNewMessage,
    } = useChatScroll(
      chat || [],
      personalInfo?.uuid,
      isLoading,
      id,
      dispatchSeen,
      lastScrollPos,
      setScrollDownButton
    )

    useEffect(() => {
      if (activeChat.messageRecieved) {
        chat?.length === 0 ? setNoMoreHistory(true) : setNoMoreHistory(false)
      }
    }, [chat])

    const scrollToPinned = (pinId: any) => {
      if (pinId !== "") {
        console.log(
          messageRefs.current[pinId],
          messageRefs,
          "searchResultMessage"
        )

        let { offsetHeight, scrollHeight, scrollTop, clientHeight } =
          ref.current as HTMLDivElement
        if (ref.current) ref.current.scrollTop = clientHeight * 0.5
        if (messageRefs.current[pinId]) {
          setDisableScroll(true)
          messageRefs.current[pinId]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          })
          if (
            messageRefs.current[pinId] !== null &&
            messageRefs.current[pinId].style !== null
          ) {
            messageRefs.current[pinId].style.backgroundColor = "antiquewhite"
            dispatch(actionCreators.searchFlag(false))
            setTimeout(() => {
              messageRefs.current[pinId].style.backgroundColor = "#F9FAFA"
              dispatch(actionCreators.unsetSearchResultChat())
              // setDisableScroll(false);
            }, 3000)
          }
        }
      }
      dispatch(actionCreators.gotoFile(""))
    }

    useEffect(() => {
      scrollToPinned(gotoFile)
      console.log(gotoFile, "searchResultMessage")
    }, [gotoFile])

    useEffect(() => {
      scrollToPinned(searchResultMessage)
    }, [searchResultMessage])

    useEffect(() => {
      dispatchSeen()
    }, [pageVisibility])

    useImperativeHandle(fwdRef, () => ({
      // start() has type inferrence here
      scrollIntoMessage(id: string) {
        handleClick(id)
      },
    }))

    useEffect(() => {
      scrollToPinned(pinnedChat)
    }, [pinnedChat])

    useLayoutEffect(() => {
      dispatchSeen()
    }, [unread_msg_count])

    useQuadrant(miniUuid === "" ? chatSection : "", setQuadrant)

    useEffect(() => {
      if (cachedMessages) setNoMoreFuture(false)
    }, [cachedMessages])

    const sortCacheMessage = (
      args: {
        api_response: any
        cacheMessage: any[]
        uuid: string
      },
      isGroup: boolean
    ) => {
      const messages_category = [...args.api_response.messages]
      const reducerArray: any[] = []

      args.cacheMessage.forEach((messageNode: any) => {
        const message_index = messages_category?.findIndex(
          (message: any) => message.uuid == messageNode?.message?.uuid
        )

        if (
          messageNode.message.type === "text" ||
          messageNode.message.type === "file" ||
          messageNode.message.type === "system"
        ) {
          if (messageNode.message.a_ctime < messages_category.slice(-1)[0]) {
            const messagePosition = messages_category.findIndex(
              (message: any) => {
                return message.a_ctime >= messageNode.message.a_ctime
              }
            )
            if (message_index === -1) {
              if (
                messages_category[messagePosition].a_ctime !=
                messageNode.message.a_ctime
              )
                messages_category.splice(
                  messagePosition,
                  0,
                  messageNode.message
                )
            } else {
              switch (messages_category[message_index]?.status) {
                case "delivered_remote_participant": {
                  if (
                    !messages_category[message_index]?.is_seen &&
                    messageNode?.message?.is_seen
                  ) {
                    messages_category[message_index] = messageNode?.message
                  }
                  break
                }
                case "delivered_server": {
                  if (
                    messageNode?.message?.status ===
                    "delivered_remote_participant"
                  ) {
                    messages_category[message_index] = messageNode?.message
                  }
                  break
                }
                case "sent": {
                  if (
                    messageNode?.message?.status ===
                      "delivered_remote_participant" ||
                    messageNode?.message?.status === "delivered_server"
                  ) {
                    messages_category[message_index] = messageNode?.message
                  }
                  break
                }
                default:
              }
            }
          } else if (message_index === -1) {
            messages_category.push(messageNode.message)
          } else {
            switch (messages_category[message_index]?.status) {
              case "delivered_remote_participant": {
                if (
                  !messages_category[message_index]?.is_seen &&
                  messageNode?.message?.is_seen
                ) {
                  messages_category[message_index] = messageNode?.message
                }
                break
              }
              case "delivered_server": {
                if (
                  messageNode?.message?.status ===
                  "delivered_remote_participant"
                ) {
                  messages_category[message_index] = messageNode?.message
                }
                break
              }
              case "sent": {
                if (
                  messageNode?.message?.status ===
                    "delivered_remote_participant" ||
                  messageNode?.message?.status === "delivered_server"
                ) {
                  messages_category[message_index] = messageNode?.message
                }
                break
              }
              default:
            }
          }
        } else {
          switch (messageNode.message.category) {
            case "seen_message": {
              reducerArray.push(
                actionCreators.handleSeen(_.cloneDeep(messageNode))
              )
              break
            }
            case "delete_message": {
              reducerArray.push(
                actionCreators.handleDelete(_.cloneDeep(messageNode))
              )
              break
            }
            case "retain_message": {
              reducerArray.push(
                actionCreators.handleDelete(_.cloneDeep(messageNode))
              )
              break
            }
            case "pin_message": {
              reducerArray.push(
                actionCreators.pinMessage(
                  messageNode.isGroup
                    ? messageNode.message.to
                    : messageNode.message.from,
                  messageNode.isGroup,
                  messageNode.message.uuid,
                  messageNode.message.pinned_by,
                  messageNode.message.pin,
                  messageNode.message?.message
                )
              )
              break
            }
            case "edited_message": {
              reducerArray.push(actionCreators.handleEdit({ ...messageNode }))
              break
            }
            case "reaction_message": {
              reducerArray.push(
                actionCreators.handleReaction({ ...messageNode })
              )
              break
            }
            default:
          }
        }
      })

      dispatch(
        actionCreators.setChatMessage(
          {
            messages: messages_category,
            pinned_messages: args.api_response.pinned_messages,
            ...(isGroup && { members: args.api_response.members }),
          },
          isGroup,
          args.api_response.uuid
        )
      )
      reducerArray.forEach((reducers) => {
        dispatch(reducers)
      })
    }

    useEffect(() => {
      if (activeChat?.messageRecieved != true && name) {
        if (isGroup) {
          chatInstance
            ?.fetchGroupChats(id, 25, name ? true : undefined)
            .then((res: any) => {
              if (res.cacheMessage.length) {
                sortCacheMessage(res, true)
              } else {
                dispatch(
                  actionCreators.setChatMessage(
                    res.api_response,
                    true,
                    res.api_response.uuid
                  )
                )
              }
            })
        } else {
          chatInstance
            ?.fetchUserChats(id, 25, name ? true : undefined)
            .then((res: any) => {
              if (!name)
                dispatch(
                  actionCreators.addNewChat({ data: res, isGroup: false }, true)
                )
              if (res.cacheMessage.length) {
                sortCacheMessage(res, false)
              } else {
                dispatch(
                  actionCreators.setChatMessage(
                    res.api_response,
                    isGroup,
                    res.api_response.uuid
                  )
                )
              }
            })
        }
      }
    }, [id, activeChat?.messageRecieved])

    useEffect(() => {
      let { offsetHeight, scrollHeight, scrollTop, clientHeight } =
        ref.current as HTMLDivElement
      if (
        clientHeight === scrollHeight &&
        !noMoreHistory &&
        chat?.length &&
        scrollTop === 0 &&
        activeChat?.messageRecieved
      ) {
        setIsLoading(true)
        chatInstance
          ?.getMessageHistory({
            uuid: uuid,
            count: 10,
            a_ctime: chat[0]?.a_ctime,
            group: isGroup,
          })
          .then((res: any) => {
            if (res.message.length === 0) {
              setNoMoreHistory(true)
              setIsLoading(false)
            } else if (!scrollFlag) {
              dispatch(actionCreators.setPastMessages(res, isGroup))
              if (ref.current) {
                setIsLoading(false)

                const currentScrollPostion = ref?.current?.scrollHeight

                ref.current.scrollTop = clientHeight
              }
            } else {
              setIsLoading(false)
            }
          })
          .catch((e: any) => {
            setIsLoading(false)
          })
      }
    }, [noMoreHistory, chat, uuid])

    useEffect(() => {
      if (ref.current && !scrollFlag) {
        const currentScrollPostion = ref?.current?.scrollHeight
        let { offsetHeight, scrollHeight, scrollTop, clientHeight } =
          ref.current as HTMLDivElement

        if (!isLoading && ref.current.scrollTop < 50 && !noMoreHistory) {
          setDisableScroll(false)
          ref.current.scrollTop =
            currentScrollPostion + 500 - PrevSrollPos.current
        } else if (
          !isLoading &&
          scrollTop + clientHeight + 200 >= scrollHeight &&
          disableScroll
        ) {
          setDisableScroll(false)
        }
      }
    }, [
      isLoading,
      ref.current?.scrollTop,
      ref?.current?.scrollHeight,
      scrollFlag,
    ])

    const handleClick = (id: string, a_ctime?: string) => {
      setScrollFlag(true)
      if (messageRefs.current[id]) {
        messageRefs.current[id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        })
        if (
          messageRefs.current[id] !== null &&
          messageRefs.current[id].style !== null
        ) {
          messageRefs.current[id].style.backgroundColor = "antiquewhite"
          setTimeout(() => {
            setScrollFlag(false)
          }, 1000)
          setTimeout(() => {
            messageRefs.current[id].style.backgroundColor = "#F9FAFA"
          }, 3000)
        }
      } else {
        const chatID = uuid
        setDisableScroll(true)
        chatInstance
          ?.getReplyHistory(id, 20)
          .then(async (res: any) => {
            const resData = {
              uuid: chatID,
              messages: res.messages,
            }
            setTimeout(() => {
              setScrollFlag(false)
            }, 1000)
            let { offsetHeight, scrollHeight, scrollTop, clientHeight } =
              ref.current as HTMLDivElement
            if (ref.current && !noMoreHistory)
              ref.current.scrollTop = clientHeight * 0.5
            dispatch(actionCreators.handleMessageInLimbo(resData, isGroup))
            if (messageRefs.current[id]) {
              messageRefs.current[id]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              })
              if (
                messageRefs.current[id] !== null &&
                messageRefs.current[id].style !== null
              ) {
                messageRefs.current[id].style.backgroundColor = "antiquewhite"
                // setDisableScroll(false);
                setTimeout(() => {
                  messageRefs.current[id].style.backgroundColor = "#F9FAFA"
                }, 3000)
              }
            }

            //handleClick(id)
          })
          .catch((e: any) => {
            setIsLoading(false)
            setScrollFlag(false)
          })
      }
    }

    useEffect(() => {
      scrollToPinned(gotoFile)
    }, [gotoFile])

    const setRef = useCallback(
      (id: string) => (ref: any) => {
        messageRefs.current[id] = ref
      },
      [chat?.length]
    )

    useEffect(() => {
      if (cachedMessages && !searchFlag) {
        dispatch(actionCreators.searchFlag(false))
        dispatch(
          actionCreators.updateCachedMessages({
            to: cachedMessages[0]?.to,
            from: cachedMessages[0]?.from,
            isGroup: cachedMessages?.[0]?.group,
          })
        )
      }
      setScrollFlag(false)
      dispatch(actionCreators.searchActiveChat(""))
      return () => {
        dispatch(actionCreators.searchActiveChat(""))
      }
    }, [uuid])

    useEffect(() => {
      const handleKeyPress = (event: any) => {
        if (
          event.keyCode === 220 &&
          event.shiftKey &&
          (event.ctrlKey || event.metaKey)
        ) {
          dispatch(actionCreators.setOptionBox(hoveredMessage))
          dispatch(actionCreators.updateOptions(true))
        } else if (event.keyCode === 70 && (event.ctrlKey || event.metaKey)) {
          dispatch(actionCreators.searchActiveChat(activeChat))
        } else if (event.shiftKey && event.keyCode === 13) {
          let { offsetHeight, scrollHeight, scrollTop, clientHeight } =
            ref.current as HTMLDivElement
          if (scrollTop + clientHeight + 50 >= scrollHeight && ref.current) {
            ref.current.scrollTop = scrollHeight
          }
        }
      }

      window.addEventListener("keydown", handleKeyPress)

      return () => {
        window.removeEventListener("keydown", handleKeyPress)
      }
    }, [hoveredMessage, activeChat])

    useLayoutEffect(() => {
      const elem = ref.current

      let { offsetHeight, scrollHeight, scrollTop, clientHeight } =
        ref.current as HTMLDivElement

      if (scrollPos !== null && scrollPos !== undefined && scrollHeight) {
        if (unread_msg_count > 0) {
          clearNewMessage()
          chatInstance?.updateMessageSeenStatus(isGroup, uuid)
          dispatch(actionCreators.unsetUnread(uuid, isGroup))

          if (ref.current) {
            ref.current.scrollTop = scrollHeight
          }
        } else {
          if (ref.current) {
            ref.current.scrollTop = scrollHeight
          }
          // ref.current?.scrollTo({
          //   top: scrollHeight,
          //   behavior: "auto",
          // });
        }
      } else {
        clearNewMessage()
        if (ref.current) {
          ref.current.scrollTop = scrollHeight
        }
        if (unread_msg_count > 0) {
          chatInstance?.updateMessageSeenStatus(isGroup, uuid)
          dispatch(actionCreators.unsetUnread(uuid, isGroup))
        }
      }

      setNoMoreHistory(false)

      return () => {
        // const scoll = ref.current;
        const scrollTop1 = scrollTop

        if (scrollTop) {
          dispatch(actionCreators.chatIsScrolled(uuid, scrollTop1, isGroup))
        }
      }
    }, [id])

    const getLatestMessage = (args: number) => {
      const len = chat.length - 1

      setIsLoadingFuture(true)
      chatInstance
        ?.getMessageHistory({
          uuid: uuid,
          count: 10,
          a_ctime: chat[len].a_ctime,
          group: isGroup,
          new_message: true,
        })
        .then(async (res: any) => {
          setIsLoadingFuture(false)

          if (res.message.length === 0) {
            dispatch(
              actionCreators.updateCachedMessages(
                {
                  to: cachedMessages[0]?.to,
                  from: cachedMessages[0]?.from,
                  isGroup: cachedMessages?.[0]?.group,
                },
                true
              )
            )
            setNoMoreFuture(true)
            setIsLoadingFuture(false)
          } else {
            await dispatch(actionCreators.setPastMessages(res, isGroup, true))

            if (ref.current) {
              setIsLoadingFuture(false)

              const currentScrollPostion = ref?.current?.scrollHeight

              ref.current.scrollTop = args - 500
            }
          }
        })
        .catch((e: any) => {
          setIsLoadingFuture(false)
        })
    }

    const sendMessage = (
      message: string,
      uuid?: string,
      to?: string,
      isGroup?: boolean,
      item?: any
    ) => {
      chatInstance?.editMessage(uuid, to, isGroup, {
        message: message,
        attachments: item.attachments,
      })
    }

    const handleNewMessageClick = () => {
      chatInstance?.updateMessageSeenStatus(isGroup, uuid)
      dispatch(actionCreators.unsetUnread(uuid, isGroup))

      resetNewMessage()
    }

    const length = chat?.length

    let myLastDate = ""

    const generateDivider = (
      timestamp: number,
      dateNum: string,
      index: number
    ) => {
      myLastDate = dateNum

      const today = new Date()
      const yesterday = new Date(today.getTime() - 86400000)
      const messageDate = new Date(timestamp)
      const messageDateString = messageDate.toLocaleDateString()

      let dividerLabel: string

      if (
        messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear()
      ) {
        dividerLabel = "Today"
      } else if (
        messageDate.getDate() === yesterday.getDate() &&
        messageDate.getMonth() === yesterday.getMonth() &&
        messageDate.getFullYear() === yesterday.getFullYear()
      ) {
        dividerLabel = "Yesterday"
      } else {
        dividerLabel = `${
          messageDate.getMonth() + 1
        }/${messageDate.getDate()}/${messageDate.getFullYear()}`
      }

      return (
        <div id="Divider" className="flex flex-row py-4">
          <hr className="w-full mr-5 text-[#00000049]" />
          <div className=" h-6 rounded-[50px] flex justify-center  text-[#5C6779] mt-[-12px] text-xs min-w-[90px] w-fit py-1">
            {dividerLabel}
          </div>
          <hr className=" w-full ml-5 text-[#00000049]" />
        </div>
      )
    }

    const handleScroll = (event: any) => {
      if (!event.target) {
        return
      }

      const { offsetHeight, scrollHeight, scrollTop, clientHeight } =
        event.target as HTMLDivElement

      if (!isLoading && !disableScroll) {
        if (
          scrollHeight <= scrollTop + offsetHeight + 120 &&
          newMessage &&
          unread_msg_count > 0
        ) {
          clearNewMessage()
          chatInstance?.updateMessageSeenStatus(
            uuid,
            isGroup,
            personalInfo?.uuid
          )
          dispatch(actionCreators.unsetUnread(uuid, isGroup))
        }

        PrevSrollPos.current =
          event.target.scrollHeight - event.target.scrollTop

        if (
          !isLoading &&
          scrollTop <= 500 &&
          scrollHeight > clientHeight &&
          !noMoreHistory
        ) {
          const scrollTop = event.target.scrollTop
          setLastScrollPos(scrollTop)
          setIsLoading(true)
          chatInstance
            ?.getMessageHistory({
              uuid: uuid,
              count: 10,
              a_ctime: chat[0].a_ctime,
              group: isGroup,
            })
            .then((res: any) => {
              if (res.message.length === 0) {
                setNoMoreHistory(true)
                setIsLoading(false)
              } else if (!scrollFlag) {
                dispatch(actionCreators.setPastMessages(res, isGroup))

                if (ref.current) {
                  setIsLoading(false)

                  const currentScrollPostion = ref?.current?.scrollHeight

                  ref.current.scrollTop =
                    currentScrollPostion - PrevSrollPos.current
                }
              } else {
                setIsLoading(false)
              }
            })
            .catch((e: any) => {
              setIsLoading(false)
            })
        } else if (
          !isLoadingfuture &&
          !noMoreFuture &&
          scrollTop + clientHeight + 50 >= scrollHeight &&
          cachedMessages &&
          !scrollFlag
        ) {
          PrevSrollPos.current = event.target.scrollHeight
          getLatestMessage(event.target.scrollHeight)
        }
      }
      if (scrollTop + clientHeight + 50 >= scrollHeight || scrollTop < 50) {
        setDisableScroll(false)
      }
    }

    useEffect(() => {
      if (
        ref.current &&
        ref?.current?.scrollHeight -
          ref?.current?.scrollTop -
          ref?.current?.clientHeight >
          700
      ) {
        setScrollDownButton(true)
      } else {
        setScrollDownButton(false)
      }
    }, [
      ref?.current?.scrollHeight,
      ref?.current?.scrollTop,
      ref?.current?.clientHeight,
      ref.current,
    ])

    const debounceFn = cachedMessages?.length
      ? _.debounce(handleScroll, 20)
      : _.debounce(handleScroll, 60)

    useEffect(() => {
      if (editSec)
        editContainerRef.current?.scrollIntoView({
          block: "center",
          inline: "nearest",
        })
    }, [editSec])

    if (chat === undefined || activeChat.messageRecieved != true) {
      return (
        <div ref={ref}>
          <SkeletonComponent />
        </div>
      )
    }
    if (chat?.length === 0) {
      return (
        <div ref={ref}>
          <div className="flex flex-col justify-center w-full h-[calc(100vh-260px)] items-center">
            <div className="whitespace-nowrap text-sm font-sans text-primary-200 w-[359px] truncate ">
              {START_A_CONVERSATION}
              {t("Chat.StartAConversation")}
              {name}
            </div>
          </div>
        </div>
      )
    }

    function isTimeDifferenceGreaterThan10Minutes(
      timestamp1: number,
      timestamp2: number
    ): boolean {
      // Calculate the absolute difference in milliseconds between the two timestamps
      const timeDifferenceMilliseconds = Math.abs(timestamp1 - timestamp2)

      // Define the equivalent of 10 minutes in milliseconds
      const tenMinutesInMilliseconds = 10 * 60 * 1000

      // Check if the time difference is greater than 10 minutes
      return timeDifferenceMilliseconds > tenMinutesInMilliseconds
    }

    return (
      <div
        className="h-full  overflow-x-hidden mt-[0px] flex flex-col-reverse bg-[#F9FAFA]"
        ref={chatSection}
      >
        <div
          ref={ref}
          onScroll={debounceFn}
          className={` overflow-y-scroll overflow-x-hidden mx-[19px] relative pb-[12px]`}
        >
          {noMoreHistory ? (
            <UserIntro setViewMore={setViewMore} isGroup={isGroup} />
          ) : (
            <div className="-ml-14">
              {" "}
              <SkeletonComponent />
            </div>
          )}
          {isLoading ? Dividers.historyLoader : null}
          {newMessage && unread_msg_count > 0 ? (
            <div className="flex justify-center top-0 inset-x-0 sticky pt-2">
              <div
                id="handleNewMessageClick"
                className="bg-primary-200 cursor-pointer pl-4 h-6 rounded-[50px] flex flex-row text-[#FFFFFF] text-xs min-w-[160px] w-fit pr-2 py-1"
                onClick={handleNewMessageClick}
              >
                {t("Chat.UnreadMessages")}
                <div className="rounded-[50px] bg-[#FFFFFF] w-fit px-[5px] h-4 text-[#000000] ml-2">
                  {unread_msg_count}
                </div>
                <svg
                  className="m-1 ml-2"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.99961 7.04922L0.349609 1.37422L1.39961 0.324219L5.99961 4.92422L10.5996 0.324219L11.6496 1.37422L5.99961 7.04922Z"
                    fill="#A7A9AB"
                  />
                </svg>
              </div>
            </div>
          ) : null}

          {chat?.map((item: any, index: any) => {
            const dateNum = moment(item?.a_ctime).format("MM/DD/YYYY")
            let sameSource = false
            if (
              index > 0 &&
              chat[index - 1].from === chat[index].from &&
              myLastDate === dateNum &&
              chat[index - 1]?.type !== "system" &&
              item.type !== "system" &&
              !isTimeDifferenceGreaterThan10Minutes(
                chat[index - 1]?.a_ctime,
                item?.a_ctime
              )
            ) {
              sameSource = true
            }
            let colorIndex =
              (item.from.match(/\d/g).join("") + new Date().getDate()) %
              profileColors.length

            return (
              <div key={index} className={` ${index === 0 ? "pt-6 " : ""}`}>
                {myLastDate === dateNum
                  ? null
                  : generateDivider(item?.a_ctime, dateNum, index)}
                {item.type === "system" ? (
                  <Calldiv item={item} name={name} />
                ) : item.from === personalInfo.uuid ? (
                  editSec === item.uuid ? (
                    <div
                      ref={editContainerRef}
                      className={
                        index > length - 4 ? "bottom[-300px] ml-12 " : " ml-12"
                      }
                    >
                      <RichTextBoxEdit
                        setDeleteicon={<EditmsgsCancelIcon />}
                        setSendicon={<InactiveEditMsgSendIcon />}
                        activeSendicon={<Editmsgsendicon />}
                        item={item}
                        editmsg={item.body}
                        id={item.uuid}
                        to={item.to}
                        name={name}
                        chatID={id}
                        editUserID={id}
                        sendMessage={sendMessage}
                      />
                    </div>
                  ) : (
                    <div>
                      {align ? (
                        <OwnChat
                          chat={item}
                          index={index}
                          key={item.uuid}
                          members={members}
                          status={status}
                          inactive_members={inactive_members}
                          uuid={uuid}
                          isGroup={isGroup}
                          lastChild={index > length - 5}
                          setRef={setRef}
                          name={name}
                          sameSource={sameSource}
                          handleClick={handleClick}
                          isMember={isMember}
                          quadrant={quadrant}
                          color={profileColors[colorIndex]}
                        />
                      ) : (
                        <OwnChatTwoSide
                          chat={item}
                          index={index}
                          key={item.uuid}
                          members={members}
                          status={status}
                          inactive_members={inactive_members}
                          uuid={uuid}
                          isGroup={isGroup}
                          lastChild={index > length - 5}
                          setRef={setRef}
                          sameSource={sameSource}
                          handleClick={handleClick}
                        />
                      )}
                    </div>
                  )
                ) : (
                  <div key={index}>
                    {index === chat.length - unread_msg_count
                      ? showNewMessage
                        ? Dividers.newMessages
                        : null
                      : null}
                    {align ? (
                      <SendersChat
                        item={item}
                        profile_picture={profile_picture}
                        index={index}
                        key={item.uuid}
                        members={members}
                        inactive_members={inactive_members}
                        uuid={uuid}
                        status={status}
                        isGroup={isGroup}
                        lastChild={index > length - 5}
                        setRef={setRef}
                        name={name}
                        sameSource={sameSource}
                        handleClick={handleClick}
                        isMember={isMember}
                        quadrant={quadrant}
                        color={profileColors[colorIndex]}
                      />
                    ) : (
                      <SendersChatTwoSide
                        item={item}
                        profile_picture={profile_picture}
                        index={index}
                        key={item.uuid}
                        members={members}
                        inactive_members={inactive_members}
                        uuid={uuid}
                        status={status}
                        isGroup={isGroup}
                        lastChild={index > length - 4}
                        setRef={setRef}
                        name={name}
                        sameSource={sameSource}
                        handleClick={handleClick}
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {showModal !== "" && (
            <DeleteMsgModal chat={showModal} isGroup={isGroup} />
          )}
          {isLoadingfuture ? Dividers.futureLoader : null}

          <div className="h-[18px]"></div>
        </div>
        {scrollDownButton || activeChat?.cachedMessages?.length ? (
          <ScrollDownButton
            unread_msg_count={unread_msg_count}
            resetNewMessage={resetNewMessage}
            setScrollDownButton={setScrollDownButton}
            isLoadingFuture={isLoadingfuture}
          />
        ) : null}
      </div>
    )
  }
)
export default ChatBubble
