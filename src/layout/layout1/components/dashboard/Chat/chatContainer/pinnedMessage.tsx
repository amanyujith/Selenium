import { useState, useCallback, memo } from "react"
import { useSelector } from "react-redux"
import ChatIcons from "../ChatIcons"
import moment from "moment"
import linkifyHtml from "linkify-html"
import EditPencilIcon from "../Icons/EditPencilIcon"
import { DownloadAttachment } from "../attachmentCard"
import Markdown from "markdown-to-jsx"
import DraftParser from "../hooks/draftToHTMLParser"
import { t } from "i18next"

interface IPinnedMessage {
  profile_picture?: any
  item: any
  own: boolean
  index: number
  lastChild: boolean
  isGroup: boolean
  members: any
  status: string
  inactive_members: any
  uuid: string
  name?: string
  chatUsername: string
  sameSource: boolean
  handleClick: (id: string) => void
}

const PinnedMessage = ({
  profile_picture,
  index,
  own,
  item,
  lastChild,
  status,
  isGroup,
  members,
  inactive_members,
  uuid,
  name,
  chatUsername,
  sameSource,
  handleClick,
  ...rest
}: IPinnedMessage) => {
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )

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
      if (members && members?.length > 0) {
        const user = members.find((item: any) => item?.user_id === from)
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
            (item: any) => item?.user_id === from
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

  // Used to get name from group members list uisng uuid
  const getName = (from: string) => {
    const { display_name: username } =
      (members?.length > 0 &&
        members.find((item: any) => item?.user_id === from)) ||
      {}

    const getInativeUsername = () => {
      let inactive_user = inactive_members.find(
        (item: any) => item?.user_id === from
      )
      if (inactive_user) {
        return inactive_user.display_name
      } else {
        return ""
      }
    }

    return username ?? getInativeUsername()
  }

  const renderMessage = (chatMessage: any, type: any) => {
    switch (chatMessage?.type) {
      case "text":
        return (
          <div id="chatMsg">
            {chatMessage?.body?.type && chatMessage?.body?.type === "v1" ? (
              <Markdown>
                {linkifyHtml(
                  chatMessage?.body?.plainText ?? "",
                  linkifyOptions
                )}
              </Markdown>
            ) : (
              <DraftParser rawObject={chatMessage.body} isPinned={true} />
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
                    attachments={chatMessage?.attachments}
                    shouldPreview={true}
                    isPinned={true}
                  />
                </div>
                <div className="pt-1">
                  {chatMessage?.body?.type &&
                  chatMessage?.body?.type === "v1" ? (
                    <Markdown>
                      {linkifyHtml(
                        chatMessage?.body?.plainText ?? "",
                        linkifyOptions
                      )}
                    </Markdown>
                  ) : (
                    <DraftParser
                      rawObject={chatMessage?.body}
                      isPinned={true}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-[-10px]">
                <div className=" mb-1 max-h-5 truncate">
                  {chatMessage?.body?.type === "v1" ? (
                    <Markdown>
                      {linkifyHtml(
                        chatMessage?.body?.plainText ?? "",
                        linkifyOptions
                      )}
                    </Markdown>
                  ) : (
                    <DraftParser
                      rawObject={chatMessage?.body}
                      isPinned={true}
                    />
                  )}
                </div>
                <div className="flex flex-row gap-2 flex-wrap max-h-[62px]">
                  <DownloadAttachment
                    attachments={chatMessage?.attachments.slice(0, 1)}
                    isPinned={true}
                    replay={true}
                  />

                  {chatMessage?.attachments?.length - 1 > 0 && (
                    <div className="flex w-fit items-center py-2">
                      <div className="text-lg font-sans text-[#c4c4c4] w-full">
                        +{chatMessage?.attachments?.length - 1}
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
    <div className={`group `}>
      <div
        // onClick={onClick}
        className={`mr-[60px] h-fit w-full px-2 py-0
        }`}
      >
        <div className={`h-fit flex flex-row pr-10`}>
          <div
            className={`w-[32px] capitalize h-[32px] text-center shrink-0 rounded-bl-none rounded-[50%] text-[20px] border-[2px] border-[#E9EBF8] text-[#FFFFFF] bg-[#91785B] overflow-hidden`}
          >
            {isGroup ? (
              getProfilePicture(item?.from)
            ) : profile_picture ? (
              <img
                className="w-full h-full  object-cover"
                src={profile_picture}
                alt=""
              />
            ) : (
              <div className=" capitalize">{name?.slice(0, 1)}</div>
            )}
          </div>
          <div className={`flex flex-col ml-[9px]`}>
            <div className={`flex flex-row items-end mb-2`}>
              <div
                className={`w-fit h-[10px] font-bold text-[14px] text-[#293241]`}
              >
                {own ? "You" : isGroup ? getName(item?.from) : name}
              </div>
              <div
                className={`ml-[8px] w-fit h-[10px] pt-[3px] font-normal text-[10px] text-[#A1A1A1]`}
              >
                {new Date(item?.a_ctime).getMonth() + 1}/
                {new Date(item?.a_ctime).getDate()}/
                {new Date(item?.a_ctime).getFullYear()}
              </div>
              <div
                className={`ml-[8px] w-fit h-[10px] pt-[3px] font-normal text-[10px] text-[#A1A1A1]`}
              >
                {moment(new Date(item?.a_ctime)).format("hh:mm A")}
              </div>
            </div>
            {/* {item.pinned && (
              <span className=" flex flex-row text-xs text-center">
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
                {t("Chat.PinnedBy")}{" "}
                {loggedInUserInfo?.sub === item.pinned_by
                  ? t("Chat.You")
                  : isGroup
                  ? getName(item.pinned_by)
                  : chatUsername}
              </span>
            )} */}

            <div className="flex flex-row  py-[4px]">
              <div
                className={`px-[10px] h-fit break-words text-[14px] w-fit max-w-[calc(100vw-1190px)] ml-[-9px] text-[#293241] inline-block`}
              >
                {item?.category === "delete_message" ? (
                  <div className="italic text-[#828282]	">
                    {t("Chat.ThisMessageHasBeenDeleted")}
                  </div>
                ) : (
                  renderMessage(item, "msg")
                )}
              </div>
            </div>
          </div>
          {/* <div className={`ml-3 mt-[8px] flex flex-row gap-1`}>
              {item.category === "edited_message" && <EditPencilIcon />}
            </div> */}
        </div>
      </div>
    </div>
  )
}

export default memo(PinnedMessage)
