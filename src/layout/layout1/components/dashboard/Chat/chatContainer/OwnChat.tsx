import { useState, memo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import EditPencilIcon from "../Icons/EditPencilIcon"
import PendingMsgIcon from "../Icons/PendingMsgIcon"
import SeenIcon from "../Icons/SeenIcon"
import DeliveredIcon from "../Icons/DeliveredIcon"
import SingletickIcon from "../Icons/SingletickIcon"
import ChatIcons from "../ChatIcons"
import moment from "moment"
import linkifyHtml from "linkify-html"
import Markdown from "markdown-to-jsx"
import "./rich-editor.css"
import { DownloadAttachment } from "../attachmentCard"
import DraftParser from "../hooks/draftToHTMLParser"
import { t } from "i18next"
import { actionCreators } from "../../../../../../store"
import CheckBox from "../../../../../../atom/CheckBox/checkBox"

interface OwnChatType {
  chat: any
  index: number
  lastChild: boolean
  isGroup: boolean
  members: any
  status: string
  inactive_members: any
  uuid: string
  setRef: (id: string) => (ref: any) => void
  sameSource: boolean
  handleClick: (id: string, a_ctime?: string) => void
  name: string
  isMember: boolean | undefined
  quadrant: any
  color: any
}

const OwnChat = ({
  index,
  chat,
  lastChild,
  isGroup,
  members,
  inactive_members,
  uuid,
  status,
  sameSource,
  handleClick,
  setRef,
  name,
  isMember,
  quadrant,
  color,
  ...rest
}: OwnChatType) => {
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
  const multipleMsgs = useSelector(
    (state: any) => state.Chat.setMultipleMsgList
  )
  const setMultipleSelect = useSelector(
    (state: any) => state.Chat.setMultipleMsgSelect
  )
  const [editedList, setEditedLIst] = useState(false)
  const [pinned, setPinned] = useState(false)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const [profile, setProfile] = useState("")
  const [emojiIndex, setEmojiIndex] = useState(-1)
  const [hoverState, setHover] = useState("temp")
  const dispatch = useDispatch()

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
          reactedUserArray.push(name)
        }
      })
    }

    return reactedUserArray.join(", ")
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

  const linkifyOptions = {
    className: "text-[#004B91]",
    target: "_blank",
    // render: {
    //   url: ({ attributes , content   } : {attributes :any , content : any}) => {
    //     return <a  style= {{color : "#004B91"}} {...attributes}>{content}</a>;
    //   }}
  }

  useEffect(() => {
    const newUrl = selfData?.profile_picture?.replace(
      /\.(jpg|jpeg|png|gif)$/,
      "-low.webp"
    )
    setProfile(newUrl)
  }, [selfData?.profile_picture])

  const renderMessage = (chatMessage: any, type: any, status?: string) => {
    switch (chatMessage.type) {
      case "text":
        return (
          <div id="chatMsg">
            {/* {isJSON(chatMessage.body) ? chatMessage.body :  JSON.stringify(chatMessage.body)} */}
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
              <div id="chatMsg" className="">
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
                <div className=" mb-2 max-h-10 truncate">
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

                  {/* {chatMessage.attachments.slice(0, 2).map((item: any, index: number) => (
                    <DownloadAttachment
                      key={index}
                      index={index}
                      name={item.name}
                      type={item.type}
                      size={item.size}
                      path={item.url}
                    />
                  ))} */}
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
      key={chat.uuid}
      className={`group`}
      ref={setRef(chat.uuid)}
      onMouseEnter={() => {
        dispatch(actionCreators.hoveredMessage(chat.uuid))
        setHover(chat.uuid)
      }}
      onMouseLeave={() => dispatch(actionCreators.hoveredMessage(""))}
    >
      <div
        className={`item w-full hover:bg-[#00000014] px-2 mr-[60px] h-fit pb-[0px] ${
          sameSource ? "py-0" : "py-2"
        }`}
      >
        <div className={`h-fit flex flex-row pr-10 `}>
          {setMultipleSelect && chat.category !== "delete_message" && (
            <CheckBox
              value={chat.uuid}
              checked={multipleMsgs.find(
                (item: any) => item.uuid === chat.uuid
              )}
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
          {!sameSource ? (
            <div
              style={{ backgroundColor: color }}
              className={`w-[33px] h-[33px] shrink-0 rounded-bl-none text-center rounded-[50%] text-[20px] border-[2px] border-[#E9EBF8] text-[white] overflow-hidden`}
            >
              {selfData?.profile_picture &&
              selfData?.profile_picture !== "undefined" ? (
                // <img
                //   className="w-full h-full  object-cover"
                //   src={loggedInUserInfo?.picture}
                //   alt=""
                // />
                <img
                  className="w-full h-full  object-cover"
                  src={profile}
                  onError={() => setProfile(selfData?.profile_picture)}
                  alt=""
                />
              ) : selfData?.display_name &&
                selfData?.display_name !== undefined ? (
                <div className="capitalize">
                  {selfData?.display_name?.slice(0, 1)}
                </div>
              ) : (
                <div className=" capitalize">
                  {loggedInUserInfo?.name?.slice(0, 1)}
                </div>
              )}
            </div>
          ) : null}
          <div className={`flex flex-row`}>
            {sameSource ? (
              <div
                className={`invisible group-hover:visible mr-[7px] content-center w-[31px] font-normal text-[10px] -ml-[5px] flex flex-row items-center text-[#8D8D8D]`}
              >
                <div> {moment(new Date(chat.a_ctime)).format("hh:mm ")} </div>
                {chat.category !== "delete_message" ? (
                  <div className="ml-[2px] ">
                    {chat.status === "sent" && <PendingMsgIcon />}
                    {chat.status === "delivered_server" && <SingletickIcon />}

                    {chat.status === "delivered_remote_participant" &&
                      chat.is_seen === false && <DeliveredIcon />}
                    {chat.status === "delivered_remote_participant" &&
                      chat.is_seen === true && <SeenIcon />}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div
              className={`flex flex-col ml-[9px] mt-[0px] sm:max-w-[calc(100vw-650px)] max-w-[calc(100vw-340px)]`}
            >
              {sameSource ? null : (
                <div className={`flex items-end mb-2 flex-row gap-2`}>
                  <div
                    className={`w-fit h-[10px] font-bold text-[14px] text-[#293241]`}
                  >
                    {t("Chat.You")}
                  </div>
                  <div
                    className={`mr-[2px] w-fit h-[10px] pt-[4px] font-normal text-[10px] text-[#A1A1A1]`}
                  >
                    {moment(new Date(chat.a_ctime)).format("hh:mm A")}
                  </div>
                  {chat.category !== "delete_message" ? (
                    <div className="invisible group-hover:visible italic w-fit h-[12px] pt-[5px] -mb-1 font-normal text-[10px] text-[#8D8D8D]">
                      {chat.status === "sent" && (
                        <div className="-mt-[3px]">
                          {" "}
                          <PendingMsgIcon />{" "}
                        </div>
                      )}
                      {chat.status === "delivered_server" && <SingletickIcon />}
                      {chat.status === "delivered_remote_participant" &&
                        chat.is_seen === false && <DeliveredIcon />}
                      {chat.status === "delivered_remote_participant" &&
                        chat.is_seen === true && <SeenIcon />}
                    </div>
                  ) : null}
                </div>
              )}
              <div className="flex flex-col py-[4px] ">
                <div
                  className={`flex flex-row  ${
                    chat.status === "sent" ? "text-[#939393]" : "text-[#293241]"
                  }`}
                >
                  {chat.reply_to && chat.reply_to !== "undefined" ? (
                    <div
                      className={` px-[10px] h-fit w-fit pl-0 sm:max-w-[calc(100vw-410px)] max-w-[calc(100vw-100px)]`}
                    >
                      {chat.category === "delete_message" ? (
                        <div className="italic text-[14px] text-[#AFB4BD]">
                          {t("Chat.ThisMessageHasBeenDeleted")}
                        </div>
                      ) : (
                        <>
                          <div
                            onClick={() =>
                              handleClick(
                                chat.reply_to.uuid,
                                chat.reply_to.a_ctime
                              )
                            }
                            className={` ${
                              chat.status === "sent"
                                ? "text-[#939393]"
                                : "text-[#293241]"
                            } w-fit min-h-[36px] max-h-[108px] min-w-[60px] break-words px-3 pb-2 pt-3 overflow-hidden shadow-[0_0px_10px_0px_rgba(0,0,0,0.1) rounded-[10px] border-l-[#F7931F] max-w-[845px] border-l-[0.5px] bg-[#2929290f]`}
                          >
                            {renderMessage(chat.reply_to, "reply")}
                            {/* <Markdown>
                            {linkifyHtml(chat.reply_to.body, linkifyOptions)}
                          </Markdown> */}

                            {/* <div
                            onClick={() => handleClick(chat.reply_to.uuid)}
                            id="chatMsg"
                            className={`text-primary-200 text-left text-base break-words `}
                            dangerouslySetInnerHTML={{
                              __html: chat.reply_to.body,
                            }}
                          ></div> */}
                          </div>
                          <div
                            className={` ${
                              chat.status === "sent"
                                ? "text-[#939393]"
                                : "text-[#293241]"
                            } h-fit break-words w-fit sm:max-w-[calc(100vw-650px)] max-w-[calc(100vw-340px)]`}
                          >
                            {renderMessage(chat, "msg")}
                          </div>
                          {/* <Markdown>
                          {linkifyHtml(chat.body, linkifyOptions)}
                        </Markdown> */}
                          {/* <div
                          id="chatMsg"
                          className={`text-primary-200 text-left text-base break-words px-1 pt-2 `}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(chat.body),
                          }}
                        ></div> */}
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`${
                        chat.status === "sent"
                          ? "text-[#939393]"
                          : "text-[#293241]"
                      } px-[10px] w-fit h-fit break-words sm:max-w-[calc(100vw-650px)] max-w-[calc(100vw-340px)] ml-[-7px]`}
                    >
                      {chat.category === "delete_message" ? (
                        <div className="italic text-[14px] text-[#AFB4BD] -ml-1">
                          {t("Chat.ThisMessageHasBeenDeleted")}
                          {/* <div className="text-link ml-6 cursor-pointer text-sm mt-[2px]">Restore</div> */}
                        </div>
                      ) : (
                        renderMessage(chat, "msg")
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-row gap-2">
                  {chat.category === "edited_message" && (
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

                          <div className="px-2 py-2 bg-[#d2d3d5] min-w-[150px] max-h-[60px] shadow-lg rounded-[5px] text-[#a2a1a1] text-[12px] flex flex-col items-center gap-2 overflow-x-hidden overflow-y-auto">
                            {chat?.edited_time &&
                            chat?.edited_time?.length !== 0 ? (
                              <>
                                {chat?.edited_time?.map((time: any) => {
                                  return (
                                    <div className="flex flex-row items-center gap-2">
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
                                      {new Date(time).toLocaleString("en-US", {
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                        month: "numeric",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </div>
                                  )
                                })}
                              </>
                            ) : (
                              <div className="flex flex-row items-center gap-2">
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
                                {new Date(chat.a_mtime).toLocaleString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                    month: "numeric",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    {chat.pinned && chat.category !== "delete_message" && (
                      <div
                        onMouseOver={() => setPinned(true)}
                        onMouseLeave={() => setPinned(false)}
                        className="relative"
                      >
                        <div className="italic text-[12px] text-[#AFB4BD]">
                          (Pinned)
                        </div>
                        {pinned && (
                          <div className="invisible absolute group-hover:visible flex flex-row  items-center left-12 top-[-4px] ">
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
                                {t("Chat.PinnedBy")} &#8202;
                                {loggedInUserInfo?.sub === chat.pinned_by
                                  ? t("Chat.You")
                                  : isGroup
                                  ? getName(chat.pinned_by)
                                  : name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {chat.reactions?.length > 0 && (
                <div className={`flex flex-row flex-wrap relative`}>
                  {chat.reactions &&
                    chat.category !== "delete_message" &&
                    chat.reactions.map((el: any, i: number) => (
                      <div key={i}>
                        {/* <div  className='flex  flex-row  mt-[-10px] text-s border-[1px] rounded-[50px] border-[#A7A9AB] h-6 w-fit ml-1 px-1 group-hover:block'> */}
                        <div
                          onMouseOver={() => setEmojiIndex(i)}
                          onMouseLeave={() => setEmojiIndex(-1)}
                          className={`flex flex-row items-center rounded h-fit w-fit text-s group-hover/${index}:block border-[1px] bg-[#293241] rounded-[50px] border-[#A7A9AB] h-6 w-fit px-1`}
                        >
                          <div
                            key={i}
                            className="cursor-pointer"
                            onClick={() => onReactionClick(el, chat)}
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
                            } h-fit w-fit max-w-[237px] ml-[-15px] mt-1 bg-[#000000] absolute p-1 text-primary-100 text-[10px] rounded-[10px] z-10`}
                          >
                            {getReactedUsers(el)}
                          </div>
                        ) : null}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="">
            <div className={`flex`}>
              <div
                className={`absolute -mr-40 -mt-[2px]`}
                onClick={(e) => e.stopPropagation()}
              >
                {chat.category === "delete_message" ||
                status === "inactive" ||
                status === "archive" ||
                status === "deleted" ||
                status === "disabled" ||
                (isGroup && !isMember) ? null : (
                  <ChatIcons
                    isOwnChat={true}
                    chat={chat}
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

export default memo(OwnChat)

const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str)
    return true
  } catch (error) {
    return false
  }
}
