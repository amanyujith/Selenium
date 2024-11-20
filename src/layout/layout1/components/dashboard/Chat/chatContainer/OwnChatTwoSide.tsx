import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import EditPencilIcon from "../Icons/EditPencilIcon"
import PendingMsgIcon from "../Icons/PendingMsgIcon"
import SeenIcon from "../Icons/SeenIcon"
import DeliveredIcon from "../Icons/DeliveredIcon"
import SingletickIcon from "../Icons/SingletickIcon"
import ChatIcons from "../ChatIcons"
import moment from "moment"
import DOMPurify from "dompurify"
import linkifyHtml from "linkify-html"

import "./rich-editor.css"
import { t } from "i18next"

interface OwnChatTwoSideType {
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
  handleClick: (id: string) => void
}

const OwnChatTwoSide = ({
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
  ...rest
}: OwnChatTwoSideType) => {
  //const refToLast = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch()
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
  //const activeChat = useSelector((state: any) => state.Chat.activeChat);
  const align = useSelector((state: any) => state.Chat.alignOneSide)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const [emojiIndex, setEmojiIndex] = useState(-1)

  //

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
          } else return user.name?.slice(0, 1)
        }
      } else return ""
    },
    [members]
  )

  const getReactedUsers = (data: any) => {
    let reactedUserArray: string[] = []
    members.forEach((node: any) => {
      if (data.member.includes(node.user_id)) {
        reactedUserArray.push(node.name)
      }
    })
    inactive_members.forEach((node: any) => {
      if (data.member.includes(node.user_id)) {
        reactedUserArray.push(node.name)
      }
    })
    return reactedUserArray.join(", ")
  }

  const linkifyOptions = {
    className: "text-[#004B91]",
    target: "_blank",
    // render: {
    //   url: ({ attributes , content   } : {attributes :any , content : any}) => {
    //     return <a  style= {{color : "#004B91"}} {...attributes}>{content}</a>;
    //   }}
  }

  return (
    <div key={chat.uuid} className={`group`} ref={setRef(chat.uuid)}>
      <div
        className={`item w-full hover:bg-[#0000000a] px-2 mr-[60px] h-fit flex flex-row-reverse ${
          sameSource ? "pb-[2px] pt-[6px]" : "py-2"
        }`}
      >
        {sameSource ? (
          <div
            className={`invisible group-hover:visible mr-1 mt-4 content-center w-fit font-normal text-[10px] text-[#8D8D8D]`}
          >
            {moment(new Date(chat.a_ctime)).format("hh:mm")}
          </div>
        ) : null}
        <div className={`flex flex-row-reverse`}>
          <div
            className={`absolute -mt-5 left-0 ml-2`}
            onClick={(e) => e.stopPropagation()}
          >
            {chat.category === "delete_message" ||
            status === "inactive" ||
            status === "archive" ? null : (
              <ChatIcons isOwnChat={true} chat={chat} lastChild={lastChild} />
            )}
          </div>
        </div>
        <div className={`h-fit flex flex-row-reverse w-1/2`}>
          {!sameSource ? (
            <div
              className={`w-[30px] h-[30px] shrink-0 rounded-br-none -mt-[5px] ml-[-3px] rounded-[50%] text-[20px] ring-1 ring-offset-1 ring-[#A7A9AB] text-[white] bg-[#91785B] overflow-hidden`}
            >
              {loggedInUserInfo?.picture &&
              loggedInUserInfo?.picture != "undefined" ? (
                <img
                  className="w-full h-full  object-cover"
                  src={loggedInUserInfo?.picture}
                  alt=""
                />
              ) : (
                loggedInUserInfo?.name?.slice(0, 1)
              )}
            </div>
          ) : null}
          <div className={`flex flex-row`}>
            {sameSource ? (
              <div
                className={`invisible group-hover:visible mr-1 content-center w-[31px] font-normal text-[10px] -ml-[5px] flex flex-row text-[#8D8D8D] mt-4`}
              >
                <div> {moment(new Date(chat.a_ctime)).format("hh:mm")} </div>
                <div className="ml-[2px] mt-[3px]">
                  {chat.status === "sent" && <PendingMsgIcon />}
                  {chat.status === "delivered_server" && <SingletickIcon />}

                  {isGroup
                    ? chat.status === "delivered_remote_participant" &&
                      chat.is_seen === false && <DeliveredIcon />
                    : chat.status === "delivered_remote_participant" &&
                      chat.seen.length === 0 && <DeliveredIcon />}
                  {isGroup
                    ? chat.status === "delivered_remote_participant" &&
                      chat.is_seen === true && <SeenIcon />
                    : chat.seen.length > 0 &&
                      chat.status === "delivered_remote_participant" && (
                        <SeenIcon />
                      )}
                </div>
              </div>
            ) : null}

            <div className={`flex flex-col ml-[9px] -mt-[5px]`}>
              {sameSource ? null : (
                <div className={`flex items-end mb-[6px] flex-row-reverse`}>
                  <div
                    className={`w-fit h-[10px] font-bold text-[14px] text-[black]`}
                  >
                    {t("Chat.You")}
                  </div>
                  <div
                    className={`mr-[2px] w-fit h-[10px] pt-[4px] font-normal text-[10px] text-[#8D8D8D]`}
                  >
                    {moment(new Date(chat.a_ctime)).format("hh:mm A")}
                  </div>
                </div>
              )}
              <div className={`flex flex-row-reverse`}>
                {chat.reply_to && chat.reply_to !== "undefined" ? (
                  <div
                    className={`pt-3 px-[10px] h-fit w-fit bg-[#2929290f] max-w-2xl pb-[12px] rounded-[10px]`}
                  >
                    {chat.category === "delete_message" ? (
                      <div className="italic text-[#828282]	">
                        {t("Chat.ThisMessageHasBeenDeleted")}
                      </div>
                    ) : (
                      <>
                        <div
                          className={`w-fit h-[36px] min-w-[60px] break-words px-3 py-2 overflow-hidden shadow-[0_0px_10px_0px_rgba(0,0,0,0.1) rounded-[10px] bg-[#FFFFFF] max-w-[645px]`}
                        >
                          <div
                            onClick={() => handleClick(chat.reply_to.uuid)}
                            id="chatMsg"
                            className={`text-primary-200 text-left text-base break-words `}
                            dangerouslySetInnerHTML={{
                              __html: chat.reply_to.body,
                            }}
                          ></div>
                        </div>
                        <div
                          id="chatMsg"
                          className={`text-primary-200 text-left text-base break-words px-1 pt-2 `}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(chat.body),
                          }}
                        ></div>
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    className={`px-[10px] w-fit h-fit break-words pt-3 max-w-2xl pb-[12px] bg-[#2929290f] rounded-[10px]`}
                  >
                    {chat.category === "delete_message" ? (
                      <div className="italic text-[#828282] flex flex-row	">
                        {t("Chat.ThisMessageHasBeenDeleted")}
                        {/* <div className="text-link ml-6 cursor-pointer text-sm mt-[2px]">Restore</div> */}
                      </div>
                    ) : (
                      <div
                        id="chatMsg"
                        className="text-primary-200 text-left text-base break-words"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            linkifyHtml(chat.body, linkifyOptions),
                            { ADD_ATTR: ["target"] }
                          ),
                        }}
                      ></div>
                    )}
                  </div>
                )}
              </div>

              {chat.reactions?.length > 0 && (
                <div className={`flex flex-row-reverse ml-2`}>
                  {chat.reactions &&
                    chat.category !== "delete_message" &&
                    chat.reactions.map((el: any, i: number) => (
                      <div key={i}>
                        {/* <div  className='flex  flex-row  mt-[-10px] text-s border-[1px] rounded-[50px] border-[#A7A9AB] h-6 w-fit ml-1 px-1 group-hover:block'> */}
                        <div
                          onMouseOver={() => setEmojiIndex(i)}
                          onMouseLeave={() => setEmojiIndex(-1)}
                          className={`flex flex-row rounded h-fit w-fit mt-[-10px] text-s group-hover/${index}:block border-[1px] bg-[#FFFFFF] rounded-[50px] border-[#A7A9AB] h-6 w-fit px-1`}
                        >
                          <div
                            key={i}
                            className="cursor-pointer"
                            onClick={() => onReactionClick(el, chat)}
                          >
                            {el.emoji}
                          </div>
                          {el.count > 1 && (
                            <div className=" text-[12px] mt-[2px] ml-1">
                              {el.count}
                            </div>
                          )}
                        </div>
                        {isGroup ? (
                          emojiIndex === i ? (
                            <div
                              className={`${
                                lastChild ? "mt-[-60px]" : ""
                              } h-fit w-fit max-w-[237px] ml-[-15px] mt-1 bg-[#000000] absolute p-1 text-primary-100 text-[10px] rounded-[10px] z-10`}
                            >
                              {getReactedUsers(el)}
                            </div>
                          ) : null
                        ) : null}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className={`flex flex-col-reverse  mt-2`}>
              <div>
                {chat.status === "sent" && <PendingMsgIcon />}
                {chat.status === "delivered_server" && <SingletickIcon />}

                {isGroup
                  ? chat.status === "delivered_remote_participant" &&
                    chat.is_seen === false && <DeliveredIcon />
                  : chat.status === "delivered_remote_participant" &&
                    chat.seen.length === 0 && <DeliveredIcon />}
                {isGroup
                  ? chat.status === "delivered_remote_participant" &&
                    chat.is_seen === true && <SeenIcon />
                  : chat.seen.length > 0 &&
                    chat.status === "delivered_remote_participant" && (
                      <SeenIcon />
                    )}
              </div>
            </div>
          </div>
          <div>
            <div className={`mt-6`}>
              {chat.category === "edited_message" && <EditPencilIcon />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnChatTwoSide
