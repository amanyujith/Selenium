import Modal from "../../../../../atom/customModal"
import {
  SENT_ICON,
  DELIVERED_ICON,
  READ_ICON,
  PIN_ICON,
  EDITED_ICON,
} from "../../../../../utils/SVG/svgsRestHere"
import PendingMsgIcon from "./Icons/PendingMsgIcon"
import SingletickIcon from "./Icons/SingletickIcon"
import DeliveredIcon from "./Icons/DeliveredIcon"
import SeenIcon from "./Icons/SeenIcon"
import { useDispatch, useSelector } from "react-redux"
import { DownloadAttachment } from "./attachmentCard"
import DraftParser from "./hooks/draftToHTMLParser"
import Markdown from "markdown-to-jsx"
import linkifyHtml from "linkify-html"
import moment from "moment"
import { actionCreators } from "../../../../../store"

const MsgInfo = (props: any) => {
  const { setInfoModal, infoData, quadrant, loader, activeChat } = props
  const dispatch = useDispatch()
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const linkifyOptions = {
    className: "text-[#004B91]",
    target: "_blank",
  }
  const generateDivider = (timestamp: number) => {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 86400000)
    const messageDate = new Date(timestamp)
    const messageDateString = messageDate.toLocaleDateString("en-US")

    let dividerLabel: string

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      dividerLabel = "Today, " + moment(timestamp).format("hh:mm A")
    } else if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      dividerLabel = "Yesterday, " + moment(timestamp).format("hh:mm A")
    } else {
      dividerLabel =
        messageDateString + ", " + moment(timestamp).format("hh:mm A")
    }

    return <div className="text-[#A1A1A1] text-[12px]"> {dividerLabel} </div>
  }

  const renderMessage = (chatMessage: any, type: any) => {
    switch (chatMessage.type) {
      case "text":
        return (
          <div id="chatMsg" className="pt-1 max-w-[330px]">
            {chatMessage.body.type && chatMessage.body.type === "v1" ? (
              <Markdown>
                {linkifyHtml(chatMessage.body.plainText ?? "", linkifyOptions)}
              </Markdown>
            ) : (
              <DraftParser rawObject={chatMessage.body} />
            )}
          </div>
        )
      case "file":
        return (
          <div>
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
                  info={true}
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
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Modal
      title={"Message Info"}
      closeEvent={() => {
        setInfoModal(false)
        dispatch(actionCreators.setOptionBox(false))
      }}
    >
      <div>
        {loader ? (
          <div
            className={`min-h-[400px] text-[#767676] text-xl flex flex-col justify-center items-center `}
          >
            <svg
              aria-hidden="true"
              className={`inline ${"w-12 h-12"} mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600`}
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#ccc"
              />

              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#222"
              />
            </svg>
          </div>
        ) : (
          <>
            <div className="flex flex-row-reverse gap-2">
              <div className="flex flex-col justify-between">
                <div
                  className={`w-[32px] h-[32px] mt-1 shrink-0 bg-[#91785B] rounded-bl-none text-center rounded-[50%] text-[20px] border-[2px] border-[#E9EBF8] text-[white] overflow-hidden`}
                >
                  {selfData?.profile_picture &&
                  selfData?.profile_picture !== "undefined" ? (
                    <img
                      className="w-full h-full  object-cover"
                      src={selfData?.profile_picture}
                      onError={() => selfData?.profile_picture}
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
                <div>
                  {infoData?.status === "sent" && <PendingMsgIcon />}
                  {infoData?.status === "delivered_server" && (
                    <SingletickIcon />
                  )}
                  {infoData?.status === "delivered_remote_participant" &&
                    infoData?.is_seen === false && <DeliveredIcon />}
                  {infoData?.status === "delivered_remote_participant" &&
                    infoData?.is_seen === true && <SeenIcon />}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="text-right flex flex-row-reverse items-end gap-2">
                  <div className="text-[16px] font-bold -mb-[1px]">You</div>
                  <div className="text-[#A1A1A1] text-[12px]">
                    {moment(new Date(infoData?.a_ctime)).format("hh:mm A")}
                  </div>
                </div>
                <div className="flex max-w-[360px] h-fit w-fit max-h-[91px] text-ellipsis overflow-hidden px-[12px] py-2 flex-col items-end gap-[10px] rounded-b-[15px] rounded-tl-[15px] border-[1px] border-[#FEEFEB] bg-[#FEF4E9] text-[#404041] text-[16px]">
                  {renderMessage(infoData, "msg")}
                </div>
              </div>
            </div>
            <hr className="text-[#0000001F] mb-3 mt-7" />
            <div className="flex flex-col gap-2">
              {infoData?.edited_time && infoData?.edited_time?.length !== 0 && (
                <div className="flex flex-row justify-between items-start">
                  <div className="flex flex-row gap-1 items-center">
                    <div>{EDITED_ICON}</div>
                    <div className="text-[16px] text-[#293241]">Edited</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {infoData?.edited_time?.length !== 0 &&
                      infoData?.edited_time?.map((time: any) => {
                        return <div>{generateDivider(time)}</div>
                      })}
                  </div>
                </div>
              )}
              {infoData?.pinned_time && infoData?.pinned && (
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-1 items-center">
                    <div>{PIN_ICON}</div>
                    <div className="text-[16px] text-[#293241]">Pinned</div>
                  </div>
                  <div>{generateDivider(infoData?.pinned_time)}</div>
                </div>
              )}
              {(infoData?.pinned_time ||
                (infoData?.edited_time &&
                  infoData?.edited_time?.length !== 0)) && (
                <hr className="text-[#0000001F]" />
              )}
              {infoData?.seen &&
                infoData?.seen?.length !== 0 &&
                (infoData.group
                  ? infoData?.seen?.length === activeChat?.members?.length - 1
                  : !infoData.group) && (
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-1 items-center">
                      <div>{READ_ICON}</div>
                      <div className="text-[16px] text-[#293241]">Read</div>
                    </div>
                    <div>
                      {generateDivider(
                        infoData?.seen ? infoData?.seen[0]?.time_stamp : null
                      )}
                    </div>
                  </div>
                )}
              {infoData?.delivered_to &&
                infoData?.delivered_to?.length !== 0 && (
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-1 items-center">
                      <div>{DELIVERED_ICON}</div>
                      <div className="text-[16px] text-[#293241]">
                        Delivered
                      </div>
                    </div>
                    <div>
                      {generateDivider(infoData?.delivered_to[0]?.time)}
                    </div>
                  </div>
                )}
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-1 items-center">
                  <div>{SENT_ICON}</div>
                  <div className="text-[16px] text-[#293241]">Sent</div>
                </div>
                <div>{generateDivider(infoData?.a_ctime)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default MsgInfo
