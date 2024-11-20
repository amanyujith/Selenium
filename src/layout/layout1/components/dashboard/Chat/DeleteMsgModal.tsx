import linkifyHtml from "linkify-html"
import Markdown from "markdown-to-jsx"
import moment from "moment"
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import { DownloadAttachment } from "./attachmentCard"
import DraftParser from "./hooks/draftToHTMLParser"
import { t } from "i18next"
import { motion } from "framer-motion"
import UseEscape from "./hooks/useEscape"

interface DeleteMsgModalType {
  chat: any
  isGroup: boolean
}

const DeleteMsgModal = ({ chat, isGroup }: DeleteMsgModalType) => {
  const dispatch = useDispatch()
  const showModal = useSelector((state: any) => state.Chat.deleteModal)
  const onClose = () => {
    dispatch(actionCreators.setDeleteModal(""))
    //dispatch(actionCreators.setOptionBox(-1));
  }
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const linkifyOptions = {
    className: "text-[#004B91]",
    target: "_blank",
    // render: {
    //   url: ({ attributes , content   } : {attributes :any , content : any}) => {
    //     return <a  style= {{color : "#004B91"}} {...attributes}>{content}</a>;
    //   }}
  }

  UseEscape(() => dispatch(actionCreators.setDeleteModal("")))

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
              <DraftParser rawObject={chatMessage.body} />
            )}
          </div>
        )
      case "file":
        return (
          <div>
            {type !== "reply" ? (
              <div className="">
                <div className="flex flex-row gap-2 flex-wrap">
                  <DownloadAttachment attachments={chatMessage.attachments} />
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
                    <DraftParser rawObject={chatMessage.body} />
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-[-10px]">
                <div className=" mb-1 max-h-5 truncate">
                  {chatMessage.body.type && chatMessage.body.type === "v1" ? (
                    <Markdown>
                      {linkifyHtml(
                        chatMessage.body.plainText ?? "",
                        linkifyOptions
                      )}
                    </Markdown>
                  ) : (
                    <DraftParser rawObject={chatMessage.body} />
                  )}
                </div>
                <div className="flex flex-row gap-2 flex-wrap max-h-[62px]">
                  <DownloadAttachment attachments={chatMessage.attachments} />
                </div>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const handleDelete = () => {
    chatInstance?.deleteMessage([chat.uuid], chat.to, isGroup)
    onClose()
  }
  return (
    <>
      {showModal !== "" ? (
        <>
          <motion.div
            key="deletemodal"
            initial={{ opacity: 0, translateY: "60px" }}
            animate={{
              opacity: 1,
              translateY: "0px",
              transition: { duration: 0.4 },
            }}
            className="bg-[#00000033] bg-opacity-100  backdrop-blur fixed inset-0 z-[400]"
          >
            <div className="flex items-center place-content-center w-full h-full justify-center">
              <div className="flex-col justify-center h-[250px] w-[463px] bg-[white] p-[24px] rounded-[15px] ">
                <div className="flex flex-row relative">
                  <span className="font-bold text-[#404041]">
                    {t("Chat.DeleteMessage")}
                  </span>
                  <span className="absolute mt-[6px] top-0 right-0 cursor-pointer">
                    <svg
                      onClick={onClose}
                      width="12"
                      height="13"
                      viewBox="0 0 12 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8307 1.84102L10.6557 0.666016L5.9974 5.32435L1.33906 0.666016L0.164062 1.84102L4.8224 6.49935L0.164062 11.1577L1.33906 12.3327L5.9974 7.67435L10.6557 12.3327L11.8307 11.1577L7.1724 6.49935L11.8307 1.84102Z"
                        fill="#A7A9AB"
                      />
                    </svg>
                  </span>
                </div>
                <div className="mt-3 text-[#404041] mb-2 font-normal text-sm ">
                  <span>{t("Chat.DeleteConfirmation")}</span>
                </div>

                <div
                  className={` px-[10px] min-h-[60px] pb-[18px] w-[415px] h-[80px] rounded-[10px] break-all overflow-y-auto overflow-x-hidden  border-[1.5px] flex flex-col border-[#FFFFFF] border-l-[#F7931F] bg-[#FEF4E9]`}
                >
                  <div className={`flex flex-row items-end mb-[6px]`}>
                    <div
                      className={`w-fit h-[14px] font-bold text-[12px] text-[#404041]`}
                    >
                      {t("Chat.You")}
                    </div>
                    &nbsp;&nbsp;
                    <div
                      className={`mr-[5px] w-fit h-[12px] font-normal text-[10px] text-[#8D8D8D]`}
                    >
                      {moment(new Date(chat.a_ctime)).format("hh:mm A")}
                    </div>
                  </div>
                  <div
                    id="chatMsg"
                    className="text-[#404041] ml-3 mt-1 text-left text-sm flex content-center ;"
                  >
                    {renderMessage(chat, "msg")}
                  </div>
                </div>
                <div className="flex flex-row-reverse mt-3">
                  <button
                    className="h-[32px] w-[78px] bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] rounded-[7px] ml-3"
                    onClick={handleDelete}
                  >
                    {t("Delete")}
                  </button>
                  <button
                    onClick={onClose}
                    className="h-[32px] w-[78px] text-[#404041] rounded-[3px]"
                  >
                    {t("Cancel")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </>
  )
}

export default DeleteMsgModal
