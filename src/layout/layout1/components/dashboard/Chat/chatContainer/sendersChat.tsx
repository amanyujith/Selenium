import { useState, useCallback, memo, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import ChatIcons from "../ChatIcons"
import moment from "moment"
import linkifyHtml from "linkify-html"
import EditPencilIcon from "../Icons/EditPencilIcon"
import { DownloadAttachment } from "../attachmentCard"
import Markdown from "markdown-to-jsx"
import DraftParser from "../hooks/draftToHTMLParser"
import { t } from "i18next"
import { actionCreators } from "../../../../../../store"
import MiniProfileModal from "./miniProfileModal"
import { debounce } from "lodash"
import useOutsideClick from "../hooks/useOutsideClick "
import CheckBox from "../../../../../../atom/CheckBox/checkBox"

interface ISendersChat {
  profile_picture?: any
  item: any
  index: number
  lastChild: boolean
  isGroup: boolean
  members: any
  status: string
  inactive_members: any
  uuid: string
  setRef: (id: string) => (ref: any) => void
  name?: string
  sameSource: boolean
  handleClick: (id: string) => void
  isMember: boolean | undefined
  quadrant: string
  color: any
}

const SendersChat = ({
  profile_picture,
  index,
  item,
  lastChild,
  status,
  isGroup,
  members,
  inactive_members,
  uuid,
  setRef,
  name,
  sameSource,
  isMember,
  handleClick,
  quadrant,
  color,
  ...rest
}: ISendersChat) => {
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const multipleMsgs = useSelector(
    (state: any) => state.Chat.setMultipleMsgList
  )
  const miniProfileModalref = useRef<null | HTMLDivElement>(null)
  const [editedList, setEditedLIst] = useState(false)
  const miniProfile = useSelector((state: any) => state.Chat.setMiniProfile)
  const miniUuid = useSelector((state: any) => state.Chat.setMiniUuid)
  const align = useSelector((state: any) => state.Chat.alignOneSide)
  const [pinned, setPinned] = useState(false)
  const [emojiIndex, setEmojiIndex] = useState(-1)
  const [hoverState, setHover] = useState("temp")
  const dispatch = useDispatch()
  const [miniHover, setMiniHover] = useState(false)
  const [profile, setProfile] = useState("")
  const setMultipleSelect = useSelector(
    (state: any) => state.Chat.setMultipleMsgSelect
  )

  const onReactionClick = (data: any, item: any) => {
    if (status !== "inactive" && status !== "archive") {
      item.reactions.forEach((node: any) => {
        if (
          node.emoji === data.emoji &&
          node.member.includes(personalInfo.uuid)
        ) {
          chatInstance?.reactionMessage(
            data.emoji,
            "delete",
            item.uuid,
            uuid,
            isGroup
          )
        } else if (node.emoji === data.emoji) {
          chatInstance?.reactionMessage(
            data.emoji,
            "add",
            item.uuid,
            uuid,
            isGroup
          )
        }
      })
    }
  }

  const linkifyOptions = {
    className: "text-[#004B91]",
    target: "_blank",
    // render: {
    //   url: ({ attributes , content   } : {attributes :any , content : any}) => {
    //     return <a  style= {{color : "#004B91"}} {...attributes}>{content}</a>;
    //   }}
  }
  //

  const getProfilePicture = useCallback(
    (from: string) => {
      if (members && members.length > 0) {
        const user = members.find((item: any) => item.user_id === from)
        if (user) {
          if (user.profile_picture) {
            return (
              <img
                className="w-full h-full  object-cover"
                src={user.profile_picture}
                alt=""
              />
            )
          } else return user.display_name?.slice(0, 1)
        } else {
          const inactive_user = inactive_members.find(
            (item: any) => item.user_id === from
          )
          if (inactive_user) {
            if (inactive_user.profile_picture) {
              return (
                <img
                  className="w-full h-full  object-cover"
                  src={inactive_user.profile_picture}
                  alt=""
                />
              )
            } else return inactive_user.display_name?.slice(0, 1)
          }
        }
      } else return ""
    },
    [members, inactive_members]
  )

  const handleMouseOver = (item: any) => {
    dispatch(actionCreators.setMiniUuid(item.uuid))
    dispatch(actionCreators.setMiniProfile(true))
  }

  const closeMiniProfileModal = () => {
    dispatch(actionCreators.setMiniUuid(""))
    dispatch(actionCreators.setMiniProfile(false))
  }

  useOutsideClick(miniProfileModalref, closeMiniProfileModal)

  const getData = (chat: any) => {
    if (members && members?.length > 0) {
      const user = members.find((item: any) => item.user_id === chat.from)
      if (user && user !== undefined) {
        return user
      } else {
        const inactive_user = inactive_members.find(
          (item: any) => item.user_id === chat.from
        )
        if (inactive_user) {
          return inactive_user
        }
      }
    } else return item
  }

  const getName = (from: string) => {
    const { display_name: username } =
      (members.length > 0 &&
        members.find((item: any) => item.user_id === from)) ||
      {}

    const getInativeUsername = () => {
      let inactive_user = inactive_members.find(
        (item: any) => item.user_id === from
      )
      if (inactive_user) {
        return inactive_user.display_name
      } else {
        return ""
      }
    }

    return username ?? getInativeUsername()
  }

  const getReactedUsers = (data: any) => {
    let reactedUserArray: string[] = []
    if (isGroup) {
      members.forEach((node: any) => {
        if (data.member.includes(node.user_id)) {
          reactedUserArray.push(node.display_name)
        }
      })
      inactive_members.forEach((node: any) => {
        if (data.member.includes(node.user_id)) {
          reactedUserArray.push(node.display_name)
        }
      })
    } else {
      data.member.forEach((node: any) => {
        if (node === loggedInUserInfo?.sub) {
          reactedUserArray.push(loggedInUserInfo?.name)
        } else {
          reactedUserArray.push(name || "")
        }
      })
    }

    return reactedUserArray.join(", ")
  }

  useEffect(() => {
    const newUrl = profile_picture?.replace(
      /\.(jpg|jpeg|png|gif)$/,
      "-low.webp"
    )
    setProfile(newUrl)
  }, [profile_picture])

  const renderMessage = (chatMessage: any, type: any) => {
    switch (chatMessage.type) {
      case "text":
        return (
          <div id="chatMsg">
            {chatMessage.body.type && chatMessage.body.type === "v1" ? (
              <Markdown>
                {linkifyHtml(chatMessage.body.plainText ?? "", linkifyOptions)}
              </Markdown>
            ) : (
              <DraftParser
                type={type}
                rawObject={chatMessage.body}
                quadrant={quadrant}
              />
            )}
          </div>
        )
      case "file":
        return (
          <div>
            {type !== "reply" ? (
              <div className="">
                <div className="flex flex-row gap-2 flex-wrap">
                  <DownloadAttachment
                    chatMessage={chatMessage}
                    attachments={chatMessage.attachments}
                    shouldPreview={true}
                  />
                </div>
                <div className="pt-1">
                  {chatMessage.body.type && chatMessage.body.type === "v1" ? (
                    <Markdown>
                      {linkifyHtml(
                        chatMessage.body.plainText ?? "",
                        linkifyOptions
                      )}
                    </Markdown>
                  ) : (
                    <DraftParser
                      rawObject={chatMessage.body}
                      quadrant={quadrant}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-[-10px]">
                <div className="mb-2 max-h-6 truncate">
                  {chatMessage.body.type === "v1" ? (
                    <Markdown>
                      {linkifyHtml(
                        chatMessage.body.plainText ?? "",
                        linkifyOptions
                      )}
                    </Markdown>
                  ) : (
                    <DraftParser
                      rawObject={chatMessage.body}
                      quadrant={quadrant}
                    />
                  )}
                </div>
                <div className="flex flex-row gap-2 flex-wrap max-h-[62px] -mt-3">
                  <DownloadAttachment
                    attachments={chatMessage.attachments.slice(0, 1)}
                    replay={true}
                  />

                  {chatMessage.attachments.length - 1 > 0 && (
                    <div className="flex w-fit items-center py-2">
                      <div className="text-lg font-sans text-[#c4c4c4] w-full">
                        +{chatMessage.attachments.length - 1}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`group`}
      ref={setRef(item.uuid)}
      onMouseEnter={() => {
        dispatch(actionCreators.hoveredMessage(item.uuid))
        setHover(item.uuid)
      }}
      onMouseLeave={() => dispatch(actionCreators.hoveredMessage(""))}
    >
      <div
        // onClick={onClick}
        className={`mr-[60px] h-fit w-full hover:bg-[#00000014] px-2 py-0
        }`}
      >
        <div className={`h-fit flex flex-row pr-10 pt-1`}>
          {setMultipleSelect && item.category !== "delete_message" && (
            <CheckBox
              value={item.uuid}
              checked={multipleMsgs.find((msg: any) => msg.uuid === item.uuid)}
              onChange={(e: any) =>
                dispatch(
                  actionCreators.setMultipleMsgList({
                    value: e.target.value,
                    checked: e.target.checked,
                  })
                )
              }
              color={""}
              id={"MultipleSelect"}
              label=""
              restClass={"self-start mt-[8px]"}
            />
          )}
          {sameSource ? (
            <div
              className={`invisible group-hover:visible mr-[7px] content-center w-[26px] text-[10px] items-center text-[#8D8D8D] my-auto`}
            >
              {moment(new Date(item.a_ctime)).format("hh:mm")}
            </div>
          ) : null}

          {sameSource ? null : (
            <div>
              <div
                onClick={() => handleMouseOver(item)}
                style={{ backgroundColor: color }}
                className={`cursor-pointer w-[33px] h-[33px] text-center shrink-0 capitalize rounded-bl-none rounded-[50%] text-[20px] border-[2px] border-[#E9EBF8] text-[white] overflow-hidden`}
              >
                {isGroup ? (
                  getProfilePicture(item.from)
                ) : profile_picture ? (
                  <img
                    className="w-full h-full  object-cover"
                    src={profile}
                    onError={() => setProfile(profile_picture)}
                    alt=""
                  />
                ) : (
                  <div className="capitalize">{name?.slice(0, 1)}</div>
                )}
              </div>
              {miniProfile &&
                item.uuid === miniUuid &&
                isGroup &&
                getName(item.from) !== "Deleted User" && (
                  <div
                    ref={miniProfileModalref}
                    className="absolute left-[260px] bg-primary"
                  >
                    <MiniProfileModal
                      mention={getData(item)}
                      isGroup={false}
                      mentionFlag={false}
                      grpHover={true}
                    />
                  </div>
                )}
            </div>
          )}

          <div
            className={`flex flex-col ml-[9px] w-fit sm:max-w-[calc(100vw-650px)] max-w-[calc(100vw-340px)]`}
          >
            {sameSource ? null : (
              <div className={`flex flex-row items-end mb-3`}>
                <div
                  className={`w-fit h-[10px] font-bold text-[14px] text-[#293241]`}
                >
                  {isGroup ? getName(item.from) : name}
                </div>
                <div
                  className={`ml-[8px] w-fit h-[10px] pt-[3px] font-normal text-[10px] text-[#A1A1A1]`}
                >
                  {moment(new Date(item.a_ctime)).format("hh:mm A")}
                </div>
              </div>
            )}
            <div className="flex flex-col py-[4px]">
              <div className="flex flex-row ">
                {item.reply_to && item.reply_to !== "undefined" ? (
                  <div className={`px-[10px] max-w-2xl h-fit w-fit pl-0`}>
                    {item.category === "delete_message" ? (
                      <div className="italic text-[14px] text-[#AFB4BD]	">
                        {t("Chat.ThisMessageHasBeenDeleted")}
                      </div>
                    ) : (
                      <>
                        <div
                          onClick={() => handleClick(item.reply_to.uuid)}
                          className={`w-fit min-h-[36px] max-h-[108px] text-[#293241] min-w-[60px] max-w-[645px] break-words px-3 pb-2 pt-3 overflow-hidden shadow-[0_0px_10px_0px_rgba(0,0,0,0.1) rounded-[10px] border-l-[#F7931F] border-l-[0.5px] bg-[#2929290f]`}
                        >
                          {renderMessage(item.reply_to, "reply")}
                        </div>
                        <div className="h-fit break-words text-[#293241] w-fit sm:max-w-[calc(100vw-410px)] max-w-[calc(100vw-100px)]">
                          {renderMessage(item, "msg")}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    className={`px-[10px] text-[#293241] h-fit break-words w-fit sm:max-w-[calc(100vw-650px)] max-w-[calc(100vw-340px)] ml-[-9px]`}
                  >
                    {item.category === "delete_message" ? (
                      <div className="italic text-[14px] text-[#AFB4BD]">
                        {t("Chat.ThisMessageHasBeenDeleted")}
                      </div>
                    ) : (
                      renderMessage(item, "msg")
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-2">
                {item.category === "edited_message" && (
                  <div
                    onMouseOver={() => setEditedLIst(true)}
                    onMouseLeave={() => setEditedLIst(false)}
                    className="relative"
                  >
                    <div className="italic text-[12px] text-[#AFB4BD]">
                      (Edited)
                    </div>
                    {editedList && (
                      <div className="invisible z-10 absolute group-hover:visible flex flex-row  items-center left-12 top-[-9px] ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="16"
                          viewBox="0 0 8 16"
                          fill="none"
                        >
                          <path
                            d="M8 0L8 16L-9.53674e-07 8L8 0Z"
                            fill="#d2d3d5"
                          />
                        </svg>

                        <div className="px-2 py-2 bg-[#d2d3d5] min-w-[150px] shadow-lg rounded-[5px] text-[#a2a1a1] text-[12px] flex flex-row items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M8.94509 2.67505L8.0628 3.55734L10.4326 5.92713L11.3149 5.04484C11.7706 4.58911 11.7706 3.85083 11.3149 3.3951L10.5967 2.67505C10.1409 2.21932 9.40264 2.21932 8.94691 2.67505H8.94509ZM7.65082 3.96932L3.4016 8.22036C3.21202 8.40994 3.07347 8.6451 2.99691 8.90213L2.3516 11.0951C2.30603 11.25 2.34795 11.4159 2.46097 11.529C2.57399 11.642 2.73988 11.6839 2.89301 11.6402L5.08597 10.9948C5.34301 10.9183 5.57816 10.7797 5.76774 10.5902L10.0206 6.33911L7.65082 3.96932Z"
                              fill="#5C6779"
                            />
                          </svg>
                          {new Date(item.a_mtime).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  {item.pinned && item.category !== "delete_message" && (
                    <div
                      onMouseOver={() => setPinned(true)}
                      onMouseLeave={() => setPinned(false)}
                      className="relative"
                    >
                      <div className="italic text-[12px] text-[#AFB4BD]">
                        (Pinned)
                      </div>
                      {pinned && (
                        <div className="invisible absolute group-hover:visible flex flex-row  items-center left-12 top-[-4px] w-fit">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="8"
                            height="16"
                            viewBox="0 0 8 16"
                            fill="none"
                          >
                            <path
                              d="M8 0L8 16L-9.53674e-07 8L8 0Z"
                              fill="#d2d3d5"
                            />
                          </svg>

                          <div className="px-2 py-1 bg-[#d2d3d5] w-fit shadow-lg rounded-[5px] text-[#a2a1a1] text-[12px] flex items-center gap-2 whitespace-nowrap">
                            <span className="w-full flex flex-row text-[12px">
                              <div className="mt-[2.5px]">
                                <svg
                                  width="17"
                                  height="17"
                                  viewBox="0 0 17 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10.6592 8.64542L11.8887 9.87498V10.9062H8.76857V14.6874L8.25296 15.2031L7.73735 14.6874V10.9062H4.61719V9.87498L5.84673 8.64542V3.68748H5.15923V2.65625H11.3467V3.68748H10.6592V8.64542Z"
                                    fill="#A7A9AB"
                                  />
                                </svg>
                              </div>
                              <div className="w-fit ">
                                {t("Chat.PinnedBy")} &#8202;
                                {loggedInUserInfo?.sub === item.pinned_by
                                  ? t("Chat.You")
                                  : isGroup
                                  ? getName(item.pinned_by)
                                  : name}
                              </div>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {item.reactions?.length > 0 && (
              <div className={`flex relative flex-wrap`}>
                {item.reactions &&
                  item.category !== "delete_message" &&
                  item.reactions.map((el: any, i: number) => (
                    <div key={i} className={`mt-2 mb-1`}>
                      <div
                        onMouseOver={() => setEmojiIndex(i)}
                        onMouseLeave={() => setEmojiIndex(-1)}
                        className={`flex flex-row items-center w-fit mt-[-10px] text-s border-[1px] rounded-[50px] bg-[#293241] border-[#A7A9AB] h-6 px-1`}
                      >
                        <div
                          key={i}
                          className="cursor-pointer"
                          onClick={() => onReactionClick(el, item)}
                        >
                          {el.emoji}
                        </div>
                        {el.count > 1 && (
                          <div className="text-[12px] ml-1 text-[#FEFDFB]">
                            {el.count}
                          </div>
                        )}
                      </div>
                      {emojiIndex === i ? (
                        <div
                          className={`${
                            lastChild ? "bottom-[32px]" : ""
                          } h-fit w-fit max-w-[237px] absolute p-1 bg-[#000000] text-primary-100 text-[10px] ml-[-15px] mt-1 rounded-[10px] z-10 `}
                        >
                          {getReactedUsers(el)}
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div>
            <div className={`flex`}>
              <div
                className={`absolute -mr-32 -mt-1 `}
                onClick={(e) => e.stopPropagation()}
              >
                {item.category === "delete_message" ||
                status === "inactive" ||
                status === "archive" ||
                status === "deleted" ||
                status === "disabled" ||
                (isGroup && !isMember) ? null : (
                  <ChatIcons
                    isOwnChat={false}
                    chat={item}
                    lastChild={lastChild}
                    quadrant={quadrant}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(SendersChat)
