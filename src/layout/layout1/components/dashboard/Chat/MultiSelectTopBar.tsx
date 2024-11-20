import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import {
  MULTIPLE_DELETE,
  MULTIPLE_SELECT_CLOSE,
  MULTIPLE_SELECT_COPY,
  MULTIPLE_SELECT_FORWARD,
} from "../../../../../utils/SVG/svgsRestHere"
import copy from "copy-to-clipboard"
import ToolTip from "../../../../../atom/ToolTip/Tooltip"
import { useEffect, useState } from "react"
import Modal from "../../../../../atom/customModal"

const MultiSelectTopBar = (props: any) => {
  const dispatch = useDispatch()
  const selectedList = useSelector(
    (state: any) => state.Chat.setMultipleMsgList
  )
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const { data: activeChat, groupCheck } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const [clipboardState, setClipboardState] = useState(false)
  const [isDeletable, setIsDeletable] = useState(true)
  const [isCopyable, setIscopyable] = useState(true)
  const [deleteModal, setDeleteModal] = useState(false)

  const copySelectedMessages = () => {
    const messageText = selectedList
      .map((msg: any) => msg.body.plainText ?? "")
      .join("\n")
    copy(messageText)
    setClipboardState(messageText)
    setTimeout(() => {
      setClipboardState(false)
    }, 2000)
  }

  useEffect(() => {
    const isSelected = selectedList.some(
      (item: any) => item?.from !== loggedInUserInfo?.sub
    )
    isSelected ? setIsDeletable(false) : setIsDeletable(true)
    const isCopy = selectedList.some(
      (item: any) => item?.attachments && item?.attachments?.length !== 0
    )
    isCopy ? setIscopyable(false) : setIscopyable(true)
    console.log(isCopyable, selectedList, "isCopyableisCopyable")
  }, [selectedList])

  const onClose = () => {
    dispatch(actionCreators.setMultipleMsgList({}))
    dispatch(actionCreators.setMultipleMsgSelect(false))
  }

  const handleDelete = () => {
    if (selectedList?.length > 0 && isDeletable) {
      let list: any = []
      selectedList.map((msg: any) => list.push(msg.uuid))
      chatInstance?.deleteMessage(list, selectedList[0].to, false)
      onClose()
    }
  }

  return (
    <div className="flex h-[60px] p-0 items-center justify-between bg-[#FDE7CE] px-[30px]">
      <div>
        {selectedList?.length > 0 && (
          <div className="text-[16px] font-bold text-[#293241]">
            {selectedList?.length}{" "}
            {selectedList?.length === 1
              ? "message selected"
              : "messages selected"}
          </div>
        )}
      </div>
      <div className="flex flex-row items-center gap-3">
        {isDeletable && (
          <ToolTip content={"Delete"} direction="top" onclick={true}>
            <div
              onClick={() => setDeleteModal(true)}
              className={` ${
                selectedList?.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              {MULTIPLE_DELETE}
            </div>
          </ToolTip>
        )}
        {isCopyable && (
          <ToolTip
            content={clipboardState === false ? "Copy" : "Copied"}
            direction="top"
            onclick={true}
          >
            <div
              onClick={copySelectedMessages}
              className={` ${
                selectedList?.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              {MULTIPLE_SELECT_COPY}
            </div>
          </ToolTip>
        )}
        {/* <ToolTip content={"Forward"} direction="top" onclick={true}>
            <div className={`cursor-pointer`}>{MULTIPLE_SELECT_FORWARD}</div>
          </ToolTip> */}
        <ToolTip content={"Close"} direction="top" onclick={true}>
          <div onClick={() => onClose()} className="cursor-pointer">
            {MULTIPLE_SELECT_CLOSE}
          </div>
        </ToolTip>
      </div>
      {deleteModal && (
        <Modal
          title={"Delete Message"}
          closeEvent={() => setDeleteModal(false)}
        >
          <div className="text-[#404041]">
            Are you sure you want to delete selected messages?
          </div>
          <div className="flex flex-row-reverse mt-6 h-full pt-1">
            <button
              onClick={() => handleDelete()}
              className="h-[32px] w-[78px] mr-1 bg-[#E57600] hover:bg-[#CC6900] text-[#FFFFFF] rounded-[7px] ml-1 mb-1 disabled:opacity-50 p-1"
            >
              Remove
            </button>
            <button
              onClick={() => setDeleteModal(false)}
              className="h-[32px] w-[78px] text-[#293241] rounded-[7px] mb-1"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MultiSelectTopBar
