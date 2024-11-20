import { useState, useCallback } from "react"
import { useSelector } from "react-redux"
import ChatIcons from "../ChatIcons"
import moment from "moment"
import DOMPurify from "dompurify"
import linkifyHtml from "linkify-html"
import { t } from "i18next"

interface IsendersChatTwoSide {
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
}

const SendersChatTwoSide = ({
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
  handleClick,
  ...rest
}: IsendersChatTwoSide) => {
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
  const align = useSelector((state: any) => state.Chat.alignOneSide)

  const [emojiIndex, setEmojiIndex] = useState(-1)

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
            } else return inactive_user.name?.slice(0, 1)
          }
        }
      } else return ""
    },
    [members, inactive_members]
  )

  const getName = (from: string) => {
    const { name: username } =
      (members.length > 0 &&
        members.find((item: any) => item.user_id === from)) ||
      {}

    const getInativeUsername = () => {
      let inactive_user = inactive_members.find(
        (item: any) => item.user_id === from
      )
      if (inactive_user) {
        return inactive_user.name
      } else {
        return ""
      }
    }

    return username ?? getInativeUsername()
  }

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

  return (
    <div className={`group mb-1`} ref={setRef(item.uuid)}>
      <div
        // onClick={onClick}
        className={`mr-[60px] h-fit w-full hover:bg-[#f7921f17] px-2 ${
          sameSource ? "py-2" : "py-2 "
        }`}
      >
        <div className="flex flex-row-reverse">
          <div className="absolute -mt-5" onClick={(e) => e.stopPropagation()}>
            {item.category === "delete_message" ||
            status === "inactive" ? null : (
              <ChatIcons isOwnChat={false} chat={item} lastChild={lastChild} />
            )}
          </div>
        </div>
        <div className={`h-fit w-1/2`}>
          <div className={`flex flex-row`}>
            {sameSource ? (
              <div
                className={`invisible group-hover:visible mr-1 content-center w-fit font-normal text-[10px] text-[#8D8D8D] mt-4`}
              >
                {moment(new Date(item.a_ctime)).format("hh:mm")}
              </div>
            ) : null}
            {sameSource ? null : (
              <div
                className={`w-[30px] h-[30px] shrink-0 rounded-bl-none rounded-[50%] text-[20px] border-[2px] border-[#E9EBF8] text-[white] bg-[#91785B] overflow-hidden`}
              >
                {isGroup ? (
                  getProfilePicture(item.from)
                ) : profile_picture ? (
                  <img
                    className="w-full h-full  object-cover"
                    src={profile_picture}
                    alt=""
                  />
                ) : (
                  name?.slice(0, 1)
                )}
              </div>
            )}

            <div className={`flex flex-col ml-[9px] -mt-[5px]`}>
              {sameSource ? null : (
                <div className={`flex flex-row items-end mb-[12px]`}>
                  <div
                    className={`w-fit h-[10px] font-bold text-[14px] text-[black]`}
                  >
                    {isGroup ? getName(item.from) : name}
                  </div>
                  <div
                    className={`ml-[8px] w-fit h-[10px] pt-[3px] font-normal text-[10px] text-[#8D8D8D]`}
                  >
                    {moment(new Date(item.a_ctime)).format("hh:mm A")}
                  </div>
                </div>
              )}

              {item.reply_to && item.reply_to !== "undefined" ? (
                <div
                  className={`pt-3 px-[10px] max-w-2xl h-fit w-fit bg-[#f7931f1f] pb-[12px]  border-l-[#F7931F] border-l-[0.5px] rounded-[10px]`}
                >
                  {item.category === "delete_message" ? (
                    <div className="italic text-[#828282]	">
                      {t("Chat.ThisMessageHasBeenDeleted")}
                    </div>
                  ) : (
                    <>
                      <div
                        className={`w-fit h-[36px] min-w-[60px] max-w-[645px] break-words px-3 py-2 overflow-hidden shadow-[0_0px_10px_0px_rgba(0,0,0,0.1) rounded-[10px] bg-[#FFFFFF]`}
                      >
                        <div
                          onClick={() => handleClick(item.reply_to.uuid)}
                          id="chatMsg"
                          className="text-primary-200 text-left text-base break-words"
                          dangerouslySetInnerHTML={{
                            __html: item.reply_to.body,
                          }}
                        ></div>
                      </div>
                      <div
                        id="chatMsg"
                        className="text-primary-200 text-left text-base break-words px-1 pt-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item.body),
                        }}
                      ></div>
                    </>
                  )}
                </div>
              ) : (
                <div
                  className={`px-[10px] h-fit break-words w-fit pt-3 pb-[12px] bg-[#f7931f1f] max-w-2xl rounded-[10px]`}
                >
                  {item.category === "delete_message" ? (
                    <div className="italic text-[#828282]	">
                      {t("Chat.ThisMessageHasBeenDeleted")}
                    </div>
                  ) : (
                    <div
                      id="chatMsg"
                      className="text-primary-200 text-left text-base break-words"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          linkifyHtml(item.body, linkifyOptions),
                          { ADD_ATTR: ["target"] }
                        ),
                      }}
                    ></div>
                  )}
                </div>
              )}

              {item.reactions?.length > 0 && (
                <div className={`flex ml-2`}>
                  {item.reactions &&
                    item.category !== "delete_message" &&
                    item.reactions.map((el: any, i: number) => (
                      <div key={i}>
                        <div
                          onMouseOver={() => setEmojiIndex(i)}
                          onMouseLeave={() => setEmojiIndex(-1)}
                          className={`flex  flex-row w-fit mt-[-10px] text-s border-[1px] rounded-[50px] bg-[#FFFFFF] border-[#A7A9AB] h-6 px-1`}
                        >
                          <div
                            key={i}
                            className="cursor-pointer"
                            onClick={() => onReactionClick(el, item)}
                          >
                            {el.emoji}
                          </div>
                          {el.count > 1 && (
                            <div className="text-[12px] mt-[2px] ml-1">
                              {el.count}
                            </div>
                          )}
                        </div>
                        {isGroup ? (
                          emojiIndex === i ? (
                            <div
                              className={`${
                                lastChild ? "mt-[-60px]" : ""
                              } h-fit w-fit max-w-[237px] absolute p-1 bg-[#000000] text-primary-100 text-[10px] ml-3 mt-1 rounded-[10px] `}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendersChatTwoSide
