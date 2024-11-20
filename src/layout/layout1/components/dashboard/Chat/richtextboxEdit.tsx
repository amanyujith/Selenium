import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useMemo,
} from "react"
import "./chatContainer/rich-editor.css"
import Draft, {
  EditorState,
  RichUtils,
  DraftHandleValue,
  SelectionState,
  Modifier,
  ContentState,
  convertFromRaw,
  convertFromHTML,
  convertToRaw,
} from "draft-js"
import "draft-js/dist/Draft.css"
import Editor from "@draft-js-plugins/editor"

import createMentionPlugin, {
  defaultSuggestionsFilter, //@ts-ignore
} from "draft-js-mention-plugin" //@ts-ignore
import mentionsStyles from "./chatContainer/mentionsStyles.module.css"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { stateToHTML } from "draft-js-export-html"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import useUploadFiles from "./hooks/useUploadFiles"
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js"
import Markdown from "markdown-to-jsx"
import useNotificationSound from "./hooks/useNotificationSound"
import { useDropzone } from "react-dropzone"
import useThrottle from "./hooks/useThrottle"
import { t } from "i18next"
import moment from "moment"
import { CAUTON_ICON } from "../../../../../utils/SVG/svgsRestHere"
import UseEscape from "./hooks/useEscape"

const Cabello = require("./audio/incoming-outgoing-message/Cabello.mp3")
const Incoming = require("./audio/incoming-outgoing-message/Incoming.mp3")
const LiveChat = require("./audio/incoming-outgoing-message/Live Chat.mp3")
const Messagetone = require("./audio/incoming-outgoing-message/Message Tone.mp3")
const Notify = require("./audio/incoming-outgoing-message/Notify.mp3")
const Outgoing = require("./audio/incoming-outgoing-message/Outgoing.mp3")
const ping = require("./audio/incoming-outgoing-message/Ping.mp3")
const positiveNote = require("./audio/incoming-outgoing-message/Positive Notice.mp3")
const serviceBell = require("./audio/incoming-outgoing-message/Service Bell.mp3")
const Shooting = require("./audio/incoming-outgoing-message/Shooting.mp3")
const success = require("./audio/incoming-outgoing-message/Success.mp3")
const theNotification = require("./audio/incoming-outgoing-message/The Notification.mp3")

const MAX_CHARACTERS = 5000

type submitFunction = (
  message: any,
  uuid?: string,
  to?: string,
  isGroup?: boolean,
  option?: any
) => void

interface RichTextBoxEditType {
  setSendicon: any
  activeSendicon: any
  setDeleteicon: any
  editmsg?: any
  id?: string
  name?: string
  to?: string
  sendMessage: submitFunction
  chatID: string | undefined
  editUserID?: string
  members?: any
  inactive_members?: any
  item?: any
}

const RichTextBoxEdit = ({
  setSendicon,
  activeSendicon,
  setDeleteicon,
  editmsg,
  name,
  sendMessage,
  to,
  id,
  item,
  chatID,
  editUserID,
  members,
  inactive_members,
}: RichTextBoxEditType) => {
  const dispatch = useDispatch()
  const editorRef = useRef<any>(null)
  const { data: activeChat, isGroup } = useSelector(
    (state: any) => state.Chat.activeChat
  )

  const placeholdertext = editUserID ? "" : "Ping @" + name
  const replyMsg = useSelector((state: any) => state.Chat.replyMsg)
  const editSec = useSelector((state: any) => state.Chat.edit)
  const replyFlag = useSelector((state: any) => state.Chat.replyFlag)
  const emojiPalette = useSelector((state: any) => state.Chat.emojiBox)
  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [initialEditMsg, setInitialEditMsg] = useState("")

  const [hasValidFiles, setHasValidFiles] = useState(false)

  const [isPasteLimit, setPasteLimit] = useState<number>(0)
  const [pastedFolder, setPastedFolder] = useState(false)
  const [isShaking, setIsShaking] = useState<boolean>(false)

  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const [audioFile, setAudioFile] = useState(Outgoing)
  const [playNotificationSound] = useNotificationSound(Outgoing)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const selfData = useSelector((state: any) => state.Chat.selfData)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    files,
    handleFileChange,
    handleFileRemove,
    clearFiles,
    handlePasteFile,
    isMaxSize,
  } = useUploadFiles(chatInstance, chatID, isGroup, activeChat.files ?? [])
  const usersList = useSelector((state: any) => state.Chat.userData)

  const [throttleUserTyping, clearThrottle] = useThrottle(() => {
    typing()
  }, 10000)

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
    focusEditor()
  }

  // mention
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const customSuggestionsFilter = (searchValue: any, suggestions: any) => {
    const size = (list: any) =>
      list.constructor.name === "List" ? list.size : list.length

    const get = (obj: any, attr: any) => (obj.get ? obj.get(attr) : obj[attr])

    const value = searchValue.toLowerCase()
    const filteredSuggestions = suggestions.filter(
      (suggestion: any) =>
        !value || get(suggestion, "name").toLowerCase().indexOf(value) > -1
    )
    const length =
      size(filteredSuggestions) < 50 ? size(filteredSuggestions) : 50
    return filteredSuggestions.slice(0, length)
  }

  const mentionPlugin = useMemo(() => {
    const mention = createMentionPlugin({
      usersList,
      entityMutability: "IMMUTABLE",
      mentionComponent: (mentionProps: any) => (
        <span
          className={mentionProps.className}
          //  onClick={() => alert("Clicked on the Mention!")}
        >
          {mentionProps.children}
        </span>
      ),
      // theme: mentionsStyles,
      // positionSuggestions,
      mentionPrefix: "@",
      supportWhitespace: false,
      positionSuggestions: (settings: any) => {
        return {
          position: "fixed",
          left: settings.decoratorRect.left + "px",
          top: settings.decoratorRect.top - 20 + "px",
          display: "block",
          transform: "scale(1) translateY(-100%)",
          transformOrigin: "1em 0% 0px",
          transition: "all 0.25s cubic-bezier(0.3, 1.2, 0.2, 1)",
        }
      },
    })
    return mention
  }, [])
  const { MentionSuggestions } = mentionPlugin
  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open)
  }, [])

  const onSearchChange = useCallback(({ value }: { value: string }) => {
    chatInstance?.getTenantUsers(value).then((res: any) => {
      setSuggestions(customSuggestionsFilter(value, res))
    })
  }, [])

  const onDrop = (acceptedFiles: any) => {
    // Do something with the files

    handlePasteFile(acceptedFiles)
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  })

  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false)

  const onChange = (state: EditorState) => {
    setEditorState(state)
  }
  const [schedule, setSchedule] = useState(false)
  const onClose = () => {
    setSchedule(false)
  }

  const onEmojiClick = (event: any) => {
    const currentContent = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    const textWithInsert = Modifier.insertText(
      currentContent,
      selection,
      event.native
    )
    const editorWithInsert = EditorState.push(
      editorState,
      textWithInsert,
      "insert-characters"
    )
    setEditorState(EditorState.moveFocusToEnd(editorWithInsert))
    // setEditorState(editorWithInsert);
    dispatch(actionCreators.setEmojiBox(!emojiPalette))
    setIsEmojiOpen((prev: boolean) => !prev)
  }

  const emojiPaletteOpen = (e: any) => {
    e.stopPropagation()
    dispatch(actionCreators.setEmojiBox(!emojiPalette))
    setIsEmojiOpen((prev: boolean) => !prev)
  }

  useEffect(() => {
    const filesRemoved = files.every((file: any) => file.cancelled)
    setHasValidFiles(!filesRemoved)
  }, [files])

  useEffect(() => {
    const file = settings[0]?.outgoing_chat_notftn_sound
    file === "cabello"
      ? setAudioFile(Cabello)
      : file === "livechat"
      ? setAudioFile(LiveChat)
      : file === "messagetone"
      ? setAudioFile(Messagetone)
      : file === "notify"
      ? setAudioFile(Notify)
      : file === "ping"
      ? setAudioFile(ping)
      : file === "positivenote"
      ? setAudioFile(positiveNote)
      : file === "servicebell"
      ? setAudioFile(serviceBell)
      : file === "shooting"
      ? setAudioFile(Shooting)
      : file === "thenotification"
      ? setAudioFile(theNotification)
      : file === "success"
      ? setAudioFile(success)
      : file === "incoming"
      ? setAudioFile(Incoming)
      : file === "turnedoff"
      ? setAudioFile("")
      : setAudioFile(Outgoing)
  }, [settings[0]?.outgoing_chat_notftn_sound])

  const playSound = (src: string) => {
    if (!settings[0]?.mute) {
      const audio = new Audio(src)
      audio.currentTime = 0
      //audio.loop = true
      audio.play()
    }
  }

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

  const submit = () => {
    const data = editorState.getCurrentContent()
    const rawObject = convertToRaw(data)
    //var markdownString = draftToMarkdown(rawObject);
    const plainText = data.getPlainText()
    clearThrottle()
    // if (editmsg.type === "v1") {
    //   sendMessage({ ...rawObject, plainText: plainText }, id, to, isGroup)
    // }
    const currentPlainText =
      editmsg.type !== "v1"
        ? editorState.getCurrentContent().getPlainText()
        : "v1"
    const messageToEdit =
      editmsg.type !== "v1"
        ? editmsg.blocks.map((msg: any) => {
            return msg
          })
        : "v1"
    const editedMessage = rawObject.blocks.map((msg: any) => {
      return msg
    })

    if (currentPlainText.trim() !== "") {
      if (editUserID === chatID) {
        if (
          plainText.trim() !== initialEditMsg ||
          messageToEdit[0].type !== editedMessage[0]?.type ||
          JSON.stringify(messageToEdit[0].inlineStyleRanges) !==
            JSON.stringify(editedMessage[0]?.inlineStyleRanges)
        ) {
          sendMessage(
            { ...rawObject, plainText: plainText },
            id,
            to,
            isGroup,
            item
          )
        }
      } else {
        replyFlag
          ? chatInstance?.publishMessage("text", activeChat.uuid, isGroup, {
              message: { ...rawObject, plainText: plainText },
              reply_to: {
                uuid: replyMsg?.uuid,
                from: replyMsg?.from,
                body: replyMsg?.body,
                attachments: replyMsg?.attachments,
                a_ctime: replyMsg?.a_ctime,
                type: replyMsg.attachments ? "file" : "text",
              },
            })
          : chatInstance?.publishMessage("text", activeChat.uuid, isGroup, {
              message: { ...rawObject, plainText: plainText },
            })
      }
      playSound(audioFile)
      // playNotificationSound(0.8, false);

      // sendMessage(markdownString, id, to, isGroup);
      dispatch(actionCreators.setEdit(""))
      dispatch(actionCreators.setShowEmoji(false))
      dispatch(actionCreators.setReplyFlag(false))
      //setEditorState(EditorState.createEmpty());
      const newState = EditorState.createEmpty()
      setEditorState(EditorState.moveFocusToEnd(newState))
    }
  }
  const focusEditor = () => {
    setTimeout(() => {
      editorRef?.current?.focus()
    }, 0)
    // setIsEditorFocus(true)
  }

  useEffect(() => {
    if (replyFlag) focusEditor()
  }, [replyFlag])

  useEffect(() => {
    if (editUserID !== chatID) {
      dispatch(actionCreators.setEdit(""))
    }
    dispatch(actionCreators.setShowEmoji(false))
    dispatch(actionCreators.setReplyFlag(false))
    // focusEditor();
    // if (editmsg === "") {

    //   clearContent();
    // }
  }, [chatID])

  const dispatchDraft = (data: any, text: string, draftFiles: any) => {
    dispatch(actionCreators.setDraftMessage(data.uuid, text, isGroup))
  }

  // useEffect(() => {
  //   if (activeChat.draft) {
  //     const blocksFromHTML = convertFromHTML(activeChat.draft);
  //     const newState = EditorState.createWithContent(
  //       ContentState.createFromBlockArray(
  //         blocksFromHTML.contentBlocks,
  //         blocksFromHTML.entityMap
  //       )
  //     );
  //     setEditorState(EditorState.moveFocusToEnd(newState));
  //   } else if (editSec === "") {
  //     clearContent();
  //   }

  //   return () => {

  //     if (editorRef.current) {
  //       const text = stateToHTML(
  //         editorRef?.current?.props?.editorState?.getCurrentContent()
  //       );
  //       dispatchDraft(activeChat, text, files);
  //     }
  //   };
  // }, [activeChat.uuid]);

  useEffect(() => {
    if (editmsg || editmsg === "") {
      if (editmsg.type && editmsg.type === "v1") {
        const rawData = markdownToDraft(editmsg.plainText)
        const contentState = convertFromRaw(rawData)
        setInitialEditMsg(editmsg.plainText)
        const newState = EditorState.createWithContent(contentState)
        setTimeout(() => {
          setEditorState(newState)
          focusEditor()
        }, 0)
      } else {
        const contentState = convertFromRaw(editmsg)
        //const blocksFromHTML = convertFromHTML(editmsg);

        setInitialEditMsg(editmsg.plainText)
        const newState = EditorState.createWithContent(contentState)
        setTimeout(() => {
          setEditorState(newState)
          focusEditor()
        }, 0)
      }
    }
  }, [])

  const keyBindingFn = (e: any) => {
    if (e.code === "Enter" && !e.shiftKey) {
      return "send_msg"
    }
    return undefined
  }

  const handleKeyCommand = (
    command: string,
    editorState: EditorState,
    eventTimeStamp: number
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      onChange(newState)
      return "handled"
    }
    if (command === "send_msg") {
      submit()
      return "handled"
    }
    return "not-handled"
  }

  UseEscape(() => clearEditContent())

  const clearEditContent = () => {
    if (replyFlag === true) {
      dispatch(actionCreators.setReplyFlag(false))
    }
    const newState = EditorState.createEmpty()
    setEditorState(EditorState.moveFocusToEnd(newState))
    dispatch(actionCreators.setEdit(""))

    dispatch(actionCreators.setShowEmoji(false))
  }

  const selection = editorState.getSelection()

  const onBoldClick = () => {
    const newState = RichUtils.toggleInlineStyle(editorState, "BOLD")
    setEditorState(newState)
  }

  const onItalicClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, "ITALIC"))
  }

  const onOrd_listClick = () => {
    onChange(RichUtils.toggleBlockType(editorState, "ordered-list-item"))

    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType()
  }

  const onUnord_listClick = () => {
    onChange(RichUtils.toggleBlockType(editorState, "unordered-list-item"))
  }

  const onBlockquoteClick = () => {
    onChange(RichUtils.toggleBlockType(editorState, "blockquote"))
  }

  const onCodeblkClick = () => {
    onChange(RichUtils.toggleBlockType(editorState, "code-block"))
  }

  const contentState = editorState.getCurrentContent()
  let showPlaceholder = false
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() === "unstyled") {
      showPlaceholder = true
    }
  }

  const closebox = (e: any) => {
    // e.stopPropagation()
    dispatch(actionCreators.setEmojiBox(false))
    setIsEmojiOpen(false)
    dispatch(actionCreators.setOptionBox(""))
  }

  const handleDroppedFiles = (
    selection: SelectionState,
    files: Array<Blob>
  ): DraftHandleValue => {
    if (files) {
      return "handled"
    } else return "not-handled"
  }

  const handlePastedFiles = (files: File[]): DraftHandleValue => {
    if (files) {
      if (files[0].type === "") {
        setPastedFolder(true)
        setTimeout(() => {
          setPastedFolder(false)
        }, 5000)
        return "not-handled"
      }
      handlePasteFile(files)
      return "handled"
    } else return "not-handled"
  }

  const getLengthOfSelectedText = () => {
    const currentSelection = editorState.getSelection()
    const isCollapsed = currentSelection.isCollapsed()

    let length = 0

    if (!isCollapsed) {
      const currentContent = editorState.getCurrentContent()
      const startKey = currentSelection.getStartKey()
      const endKey = currentSelection.getEndKey()
      const startBlock = currentContent.getBlockForKey(startKey)
      const isStartAndEndBlockAreTheSame = startKey === endKey
      const startBlockTextLength = startBlock.getLength()
      const startSelectedTextLength =
        startBlockTextLength - currentSelection.getStartOffset()
      const endSelectedTextLength = currentSelection.getEndOffset()
      const keyAfterEnd = currentContent.getKeyAfter(endKey)

      if (isStartAndEndBlockAreTheSame) {
        length +=
          currentSelection.getEndOffset() - currentSelection.getStartOffset()
      } else {
        let currentKey = startKey

        while (currentKey && currentKey !== keyAfterEnd) {
          if (currentKey === startKey) {
            length += startSelectedTextLength + 1
          } else if (currentKey === endKey) {
            length += endSelectedTextLength
          } else {
            length += currentContent.getBlockForKey(currentKey).getLength() + 1
          }

          currentKey = currentContent.getKeyAfter(currentKey)
        }
      }
    }

    return length
  }

  const handleBeforeInput = (
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number
  ): DraftHandleValue => {
    if (isPasteLimit > 0) {
      setPasteLimit(0)
    }

    const currentContent = editorState.getCurrentContent()
    const currentContentLength = currentContent.getPlainText("").length
    const selectedTextLength = getLengthOfSelectedText()

    if (currentContentLength - selectedTextLength > MAX_CHARACTERS - 1) {
      return "handled"
    } else return "not-handled"
  }

  const handlePastedText = (pastedText: any) => {
    setPasteLimit(0)
    const currentContent = editorState.getCurrentContent()
    const currentContentLength = currentContent.getPlainText("").length
    const selectedTextLength = getLengthOfSelectedText()
    if (!pastedText) return "handled"

    if (
      currentContentLength + pastedText.length - selectedTextLength >
      MAX_CHARACTERS
    ) {
      setPasteLimit(
        currentContentLength +
          pastedText.length -
          selectedTextLength -
          MAX_CHARACTERS
      )
      setIsShaking(true)

      return "handled"
    } else return "not-handled"
  }

  const handleAnimationEnd = () => {
    setIsShaking(false)
  }

  useEffect(() => {
    if (isPasteLimit > 0 || isMaxSize) {
      setIsShaking(true)
    }
  }, [isPasteLimit, isMaxSize])

  const typing = () => {
    chatInstance?.publishMessage("typing", activeChat.uuid, isGroup, {
      message: {
        uuid: personalInfo?.uuid,
        profile_picture: selfData?.profile_picture ?? loggedInUserInfo?.picture,
        display_name: selfData?.display_name ?? loggedInUserInfo?.display_name,
      },
    })
  }

  const handleEditorChange = (editorState1: any) => {
    setEditorState(editorState1)

    const hasText = editorState1.getCurrentContent().hasText()
    if (hasText) throttleUserTyping()

    //throttledCallback()
  }

  return (
    <div id="richTextBoxEditor" className="relative">
      <div
        className="min-h-[135px] h-fit w-7/12 flex justify-center "
        // onClick={(e) => closebox(e)}
      >
        <div className="h-full w-full pt-3 px-[20px] shadow-[0_0px_10px_0px_rgba(0,0,0,0.12)] bg-[#FFFFFF] rounded-[10px] border-[0.5px] flex flex-col  border-[#0000001f]">
          <div className={`flex flex-row items-center h-[15px] mb-[10px]`}>
            <div className={`w-fit font-bold text-[16px] text-[#404041]`}>
              {t("Chat.You")}
            </div>
            &nbsp;&nbsp;
            <div
              className={`mr-[5px] w-fit h-full font-normal text-[12px] text-[#8D8D8D]`}
            >
              {moment(new Date(item.a_ctime)).format("hh:mm A")}
            </div>
          </div>
          <div className={`flex flex-row justify-start h-8 w-full ml-1`}>
            <div className="flex flex-row w-1/2 ml-[-1px] gap-[22px]">
              <button
                className={`${
                  editorState.getCurrentInlineStyle().has("BOLD")
                    ? "bg-[#0000001F] p-1 rounded-[5px]"
                    : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onBoldClick()
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.75 6.42857C6.75 6.19286 6.94286 6 7.17857 6H8.03571H8.89286H12.9643C14.7402 6 16.1786 7.43839 16.1786 9.21429C16.1786 10.2536 15.6857 11.1777 14.9223 11.7643C16.1545 12.2143 17.0357 13.3955 17.0357 14.7857C17.0357 16.5616 15.5973 18 13.8214 18H8.89286H8.03571H7.17857C6.94286 18 6.75 17.8071 6.75 17.5714C6.75 17.3357 6.94286 17.1429 7.17857 17.1429H7.60714V12V6.85714H7.17857C6.94286 6.85714 6.75 6.66429 6.75 6.42857ZM8.46429 17.1429H8.89286H13.8214C15.1232 17.1429 16.1786 16.0875 16.1786 14.7857C16.1786 13.4839 15.1232 12.4286 13.8214 12.4286H12.9643H8.46429V17.1429ZM8.46429 11.5714H12.9643C14.2661 11.5714 15.3214 10.5161 15.3214 9.21429C15.3214 7.9125 14.2661 6.85714 12.9643 6.85714H8.89286H8.46429V11.5714Z"
                    fill={
                      editorState.getCurrentInlineStyle().has("BOLD")
                        ? "#292929"
                        : "#5C6779"
                    }
                  />
                </svg>
              </button>
              <button
                className={`${
                  editorState.getCurrentInlineStyle().has("ITALIC")
                    ? "bg-[#0000001F] p-1 rounded-[5px]"
                    : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onItalicClick()
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.85714 5.73214C9.85714 5.46696 10.0741 5.25 10.3393 5.25H17.0893C17.3545 5.25 17.5714 5.46696 17.5714 5.73214C17.5714 5.99732 17.3545 6.21429 17.0893 6.21429H14.5279L10.0771 17.7857H13.2321C13.4973 17.7857 13.7143 18.0027 13.7143 18.2679C13.7143 18.533 13.4973 18.75 13.2321 18.75H6.48214C6.21696 18.75 6 18.533 6 18.2679C6 18.0027 6.21696 17.7857 6.48214 17.7857H9.04353L13.4943 6.21429H10.3393C10.0741 6.21429 9.85714 5.99732 9.85714 5.73214Z"
                    fill={
                      editorState.getCurrentInlineStyle().has("ITALIC")
                        ? "#292929"
                        : "#5C6779"
                    }
                  />
                </svg>
              </button>
              <button
                className={`${
                  editorState
                    .getCurrentContent()
                    .getBlockForKey(selection.getStartKey())
                    .getType() === "ordered-list-item"
                    ? "bg-[#0000001F] p-1 rounded-[5px]"
                    : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onOrd_listClick()
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5534_80679)">
                    <path
                      d="M3.85684 4.57144C3.85684 4.88573 4.11399 5.14288 4.42828 5.14288H4.99972V9.71439H3.85684C3.54255 9.71439 3.2854 9.97153 3.2854 10.2858C3.2854 10.6001 3.54255 10.8573 3.85684 10.8573H7.28547C7.59976 10.8573 7.85691 10.6001 7.85691 10.2858C7.85691 9.97153 7.59976 9.71439 7.28547 9.71439H6.14259V4.57144C6.14259 4.25715 5.88545 4 5.57115 4H4.42828C4.11399 4 3.85684 4.25715 3.85684 4.57144ZM9.57123 6.28575C9.57123 6.60005 9.82837 6.85719 10.1427 6.85719H20.4286C20.7429 6.85719 21 6.60005 21 6.28575C21 5.97146 20.7429 5.71432 20.4286 5.71432H10.1427C9.82837 5.71432 9.57123 5.97146 9.57123 6.28575ZM9.57123 12.0001C9.57123 12.3144 9.82837 12.5716 10.1427 12.5716H20.4286C20.7429 12.5716 21 12.3144 21 12.0001C21 11.6859 20.7429 11.4287 20.4286 11.4287H10.1427C9.82837 11.4287 9.57123 11.6859 9.57123 12.0001ZM9.57123 17.7145C9.57123 18.0288 9.82837 18.286 10.1427 18.286H20.4286C20.7429 18.286 21 18.0288 21 17.7145C21 17.4002 20.7429 17.1431 20.4286 17.1431H10.1427C9.82837 17.1431 9.57123 17.4002 9.57123 17.7145ZM4.81043 14.4252C5.20686 14.0287 5.8533 14.0502 6.22474 14.4716C6.55331 14.8466 6.5426 15.4073 6.20331 15.7681L3.15325 19.0396C2.99968 19.2074 2.95682 19.4503 3.04611 19.6574C3.1354 19.8646 3.34254 20.0003 3.57112 20.0003H7.28547C7.59976 20.0003 7.85691 19.7431 7.85691 19.4288C7.85691 19.1146 7.59976 18.8574 7.28547 18.8574H4.88543L7.03904 16.5502C7.77834 15.7574 7.79619 14.5359 7.08547 13.718C6.28188 12.8002 4.86757 12.7502 4.00327 13.6145L3.45326 14.168C3.23183 14.3895 3.23183 14.7538 3.45326 14.9752C3.67469 15.1966 4.03898 15.1966 4.26042 14.9752L4.81043 14.4252Z"
                      fill={
                        editorState
                          .getCurrentContent()
                          .getBlockForKey(selection.getStartKey())
                          .getType() === "ordered-list-item"
                          ? "#292929"
                          : "#5C6779"
                      }
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5534_80679">
                      <rect
                        width="18"
                        height="18"
                        fill="white"
                        transform="translate(3 3)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <button
                className={`${
                  editorState
                    .getCurrentContent()
                    .getBlockForKey(selection.getStartKey())
                    .getType() === "unordered-list-item"
                    ? "bg-[#0000001F] p-1 rounded-[5px]"
                    : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onUnord_listClick()
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.12097 7.74194V6.87097H6.99194V7.74194H6.12097ZM5.25 6.65323V7.95968C5.25 8.32167 5.54123 8.6129 5.90323 8.6129H7.20968C7.57167 8.6129 7.8629 8.32167 7.8629 7.95968V6.65323C7.8629 6.29123 7.57167 6 7.20968 6H5.90323C5.54123 6 5.25 6.29123 5.25 6.65323ZM9.60484 6.87097C9.36532 6.87097 9.16935 7.06694 9.16935 7.30645C9.16935 7.54597 9.36532 7.74194 9.60484 7.74194H18.3145C18.554 7.74194 18.75 7.54597 18.75 7.30645C18.75 7.06694 18.554 6.87097 18.3145 6.87097H9.60484ZM9.60484 11.2258C9.36532 11.2258 9.16935 11.4218 9.16935 11.6613C9.16935 11.9008 9.36532 12.0968 9.60484 12.0968H18.3145C18.554 12.0968 18.75 11.9008 18.75 11.6613C18.75 11.4218 18.554 11.2258 18.3145 11.2258H9.60484ZM9.60484 15.5806C9.36532 15.5806 9.16935 15.7766 9.16935 16.0161C9.16935 16.2556 9.36532 16.4516 9.60484 16.4516H18.3145C18.554 16.4516 18.75 16.2556 18.75 16.0161C18.75 15.7766 18.554 15.5806 18.3145 15.5806H9.60484ZM6.12097 11.2258H6.99194V12.0968H6.12097V11.2258ZM5.90323 10.3548C5.54123 10.3548 5.25 10.6461 5.25 11.0081V12.3145C5.25 12.6765 5.54123 12.9677 5.90323 12.9677H7.20968C7.57167 12.9677 7.8629 12.6765 7.8629 12.3145V11.0081C7.8629 10.6461 7.57167 10.3548 7.20968 10.3548H5.90323ZM6.12097 16.4516V15.5806H6.99194V16.4516H6.12097ZM5.25 15.3629V16.6694C5.25 17.0314 5.54123 17.3226 5.90323 17.3226H7.20968C7.57167 17.3226 7.8629 17.0314 7.8629 16.6694V15.3629C7.8629 15.0009 7.57167 14.7097 7.20968 14.7097H5.90323C5.54123 14.7097 5.25 15.0009 5.25 15.3629Z"
                    fill={
                      editorState
                        .getCurrentContent()
                        .getBlockForKey(selection.getStartKey())
                        .getType() === "unordered-list-item"
                        ? "#292929"
                        : "#5C6779"
                    }
                  />
                </svg>
              </button>
              {/* <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  onBlockquoteClick();
                }}
              >
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.4375 13.5625V12.4375H13.5625V13.5625H0.4375ZM0.4375 10.5625V9.4375H9.0625V10.5625H0.4375ZM0.4375 7.5625V6.4375H13.5625V7.5625H0.4375ZM0.4375 4.5625V3.4375H9.0625V4.5625H0.4375ZM0.4375 1.5625V0.4375H13.5625V1.5625H0.4375Z"
                    fill={
                      editorState
                        .getCurrentContent()
                        .getBlockForKey(selection.getStartKey())
                        .getType() === "blockquote"
                        ? "#292929"
                        : "#A7A9AB"
                    }
                  />
                </svg>
              </button> */}
              <button
                className={`${
                  editorState
                    .getCurrentContent()
                    .getBlockForKey(selection.getStartKey())
                    .getType() === "code-block"
                    ? "bg-[#0000001F] p-1 rounded-[5px]"
                    : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onCodeblkClick()
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.7937 6.76753C13.6166 6.70848 13.4268 6.80338 13.3677 6.98054L9.99324 17.104C9.93419 17.2811 10.0291 17.4709 10.2063 17.53C10.3834 17.589 10.5732 17.4941 10.6323 17.317L14.0068 7.19356C14.0658 7.0164 13.9709 6.82658 13.7937 6.76753ZM8.87756 9.22668C8.75312 9.08748 8.54011 9.07483 8.40091 9.19926L5.36389 11.8988C5.29218 11.9621 5.25 12.0528 5.25 12.1498C5.25 12.2468 5.29218 12.3375 5.36389 12.4029L8.40091 15.1025C8.54011 15.2269 8.75312 15.2143 8.87756 15.0751C9.00199 14.9359 8.98934 14.7229 8.85014 14.5984L6.09573 12.1498L8.84803 9.70332C8.98723 9.57889 8.99988 9.36588 8.87545 9.22668H8.87756ZM15.1224 9.22668C14.998 9.36588 15.0107 9.57889 15.1499 9.70332L17.9022 12.1498L15.1499 14.5963C15.0107 14.7207 14.998 14.9338 15.1224 15.073C15.2469 15.2121 15.4599 15.2248 15.5991 15.1004L18.6361 12.4008C18.7078 12.3375 18.75 12.2447 18.75 12.1477C18.75 12.0507 18.7078 11.96 18.6361 11.8946L15.5991 9.19504C15.4599 9.07061 15.2469 9.08326 15.1224 9.22246V9.22668Z"
                    fill={
                      editorState
                        .getCurrentContent()
                        .getBlockForKey(selection.getStartKey())
                        .getType() === "code-block"
                        ? "#292929"
                        : "#5C6779"
                    }
                  />
                </svg>
              </button>
            </div>

            {/* <input // attachment code
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              onClick={(
                event: React.MouseEvent<HTMLInputElement, MouseEvent>
              ) => {
                const element = event.target as HTMLInputElement;
                element.value = "";
              }}
              style={{ display: "none" }}
            /> */}
          </div>
          {/* {replyFlag === true && (
            <div className="mt-3">
              <div className={`flex flex-col ml-[9px] w-[750px]`}>
                <div className={`flex flex-row items-end mb-[6px]`}>
                  <div
                    className={`w-fit h-[14px] font-bold text-[12px] text-primary-200`}
                  >
                    {replyMsg.from === personalInfo.uuid ? "you" : (isGroup ? getName(replyMsg.from)   : name)}
                  </div>
                  <div
                    className={`ml-[5px] w-fit h-[12px] font-normal text-[10px] text-[#8D8D8D]`}
                  >
                    {moment(new Date(replyMsg.a_ctime)).format("hh:mm A")}
                  </div>
                </div>
                <div
                  className={`pt-3 px-[10px] pb-[18px] truncate max-w-[calc(100vw-410px)] w-fit h-fit max-h-[100px] content-center rounded-[10px] bg-[#f7931f1f]`}
                >
                  {replyMsg.type === "text" ? (
                    <Markdown>{replyMsg.body}</Markdown>
                  ) : (
                    <div>
                      <div className="flex flex-row space-x-2">
                        {replyMsg.attachments.map(
                          (item: any, index: number) => (
                            <DownloadAttachment
                              key={index}
                              index={index}
                              name={item.name}
                              type={item.type}
                              size={item.size}
                              path={item.url}
                            />
                          )
                        )}
                      </div>
                      <Markdown>{replyMsg.body}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )} */}
          {/* <div className="mt-2 w-full overflow-x-auto overflow-y-hidden chatbox">
            <AttachmentList files={files} handleFileRemove={handleFileRemove} />
          </div>
          <div

          // onDragEnd={handleDragEnd}
          //onDragEnter={handleDragEnter}
          // onDrop={handleDrop}
          // onDragLeave={handleDragEnd}
          >
             <style>
        {`
          .shake {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }

          @keyframes shake {
            10%, 90% {
              transform: translate3d(-1px, 0, 0);
            }

            20%, 80% {
              transform: translate3d(2px, 0, 0);
            }

            30%, 50%, 70% {
              transform: translate3d(-4px, 0, 0);
            }

            40%, 60% {
              transform: translate3d(4px, 0, 0);
            }
          }
        `}
      </style>
    
            <div
              onAnimationEnd={handleAnimationEnd}
              {...getRootProps()}
              className={` ${!showPlaceholder ? "hide-placeholder" : ""} ${
                isDragActive
                  ? "bg-[#f7931f0a] border-dashed border-2 border-[#C4C4C4] h-[380px] overflow-y-hidden "
                  : "mt-2 text-primary-200 ml-1 min-h-[30px] pb-[8px] max-h-[470px] flex flex-col-reverse break-all list-inside overflow-y-auto overflow-x-hidden text-base static list"
              } ${ isShaking || editorState.getCurrentContent().getPlainText("").length >
              MAX_CHARACTERS - 1 ? 'shake' : ''}
              
             `}
            >
              {isDragActive ? (
                <div className=" flex flex-col justify-center place-content-center h-full text-center text-[#C4C4C4]">
                  <svg
                  className=" w-full mb-3"
                    width="32"
                    height="23"
                    viewBox="0 0 32 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.875 22.25C2.15 22.25 1.5315 21.994 1.0195 21.482C0.5065 20.969 0.25 20.35 0.25 19.625V3.05C0.25 2.325 0.519 1.6875 1.057 1.1375C1.594 0.5875 2.225 0.3125 2.95 0.3125H12.0625L14.5 2.75H26.05C26.725 2.75 27.3 2.969 27.775 3.407C28.25 3.844 28.5375 4.375 28.6375 5H2.5V19.55C2.5 19.65 2.525 19.7315 2.575 19.7945C2.625 19.8565 2.7 19.9125 2.8 19.9625L6.3625 8H31.375L27.625 20.375C27.475 20.95 27.1625 21.4065 26.6875 21.7445C26.2125 22.0815 25.6875 22.25 25.1125 22.25H2.875Z"
                      fill="#A7A9AB"
                    />
                  </svg>
                  <div>Drag & Release</div>
                </div>
              ) : null} */}
          <div
            onAnimationEnd={handleAnimationEnd}
            {...getRootProps()}
            className={` ${
              !showPlaceholder ? "hide-placeholder" : ""
            } mt-2 text-primary-200 ml-1 min-h-[30px] pb-[3px] max-h-[470px] flex flex-col-reverse break-all list-inside overflow-y-auto overflow-x-hidden text-base static list
              ${
                isShaking ||
                editorState.getCurrentContent().getPlainText("").length >
                  MAX_CHARACTERS - 1
                  ? "shake"
                  : ""
              } `}
          >
            <div>
              <div className="bg-[#F9FAFA] px-1">
                <Editor
                  ariaLabel="edit-input"
                  placeholder={placeholdertext}
                  ref={editorRef}
                  editorState={editorState}
                  onChange={(tm) => handleEditorChange(tm)}
                  spellCheck={true}
                  handleBeforeInput={handleBeforeInput}
                  handlePastedText={handlePastedText}
                  handleDroppedFiles={handleDroppedFiles}
                  handlePastedFiles={handlePastedFiles}
                  handleKeyCommand={handleKeyCommand}
                  keyBindingFn={keyBindingFn}
                  plugins={[mentionPlugin]}
                />
              </div>
              <div className={``}>
                <MentionSuggestions
                  open={open}
                  onOpenChange={onOpenChange}
                  suggestions={suggestions}
                  onSearchChange={onSearchChange}
                  entryComponent={(props: any) => {
                    const {
                      mention,
                      theme,
                      isFocused,
                      searchValue, // eslint-disable-line no-unused-vars
                      ...parentProps
                    } = props
                    return (
                      <div {...parentProps}>
                        <div className="flex flex-row">
                          <div
                            className={`pl-3 py-[.400rem] pr-2.5 flex flex-row text-center w-full text-sm rounded-[3px] relative `}
                          >
                            <div
                              className={`w-[22px] h-[22px] rounded-bl-none text-center  rounded-[50%] border-[2px] border-[#E9EBF8] text-[white] bg-[#91785B] overflow-hidden shrink-0`}
                            >
                              {mention.profile_picture ? (
                                <img
                                  className="w-full h-full  object-cover "
                                  src={mention.profile_picture}
                                  alt=""
                                />
                              ) : (
                                <div className="capitalize">
                                  {mention.name?.slice(0, 1)}
                                </div>
                              )}
                            </div>
                            {(() => {
                              if (mention.presence === "online") {
                                return (
                                  <div className="ml-[17px] mt-[18px] absolute z-10">
                                    <svg
                                      width="9"
                                      height="9"
                                      viewBox="0 0 7 7"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx="3.5"
                                        cy="3.5"
                                        r="3"
                                        fill="#B6B860"
                                        stroke="white"
                                      />
                                    </svg>
                                  </div>
                                )
                              }
                            })()}
                            <div
                              className={`ml-[7px] flex flex-row w-full text-[15px] relative`}
                            >
                              <div
                                className={`w-[150px] flex justify-start truncate  text-primary-100`}
                              >
                                {mention.name}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={theme.mentionSuggestionsEntryTitle}>
                          {mention.displayName}
                        </div>
                      </div>
                    )
                  }}
                />
              </div>
            </div>
          </div>
          {/* </div> */}
          <hr className="px-0 opacity-50 text-[#AFB4BD] ml-1 -mt-[5.5px]" />
          <div
            className={`flex flex-row justify-start h-25 w-full ml-1 my-2 relative`}
          >
            <div className="flex flex-row w-full gap-[15px] ">
              {/* {editUserID !== chatID ? (
                <> */}
              <button className="absolute" onClick={emojiPaletteOpen}>
                <svg
                  className="mt-1"
                  width="18"
                  height="18"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.9062 7C12.9062 5.43357 12.284 3.93129 11.1763 2.82365C10.0687 1.71601 8.56643 1.09375 7 1.09375C5.43357 1.09375 3.93129 1.71601 2.82365 2.82365C1.71601 3.93129 1.09375 5.43357 1.09375 7C1.09375 8.56643 1.71601 10.0687 2.82365 11.1763C3.93129 12.284 5.43357 12.9062 7 12.9062C8.56643 12.9062 10.0687 12.284 11.1763 11.1763C12.284 10.0687 12.9062 8.56643 12.9062 7ZM0.25 7C0.25 5.20979 0.961159 3.4929 2.22703 2.22703C3.4929 0.961159 5.20979 0.25 7 0.25C8.79021 0.25 10.5071 0.961159 11.773 2.22703C13.0388 3.4929 13.75 5.20979 13.75 7C13.75 8.79021 13.0388 10.5071 11.773 11.773C10.5071 13.0388 8.79021 13.75 7 13.75C5.20979 13.75 3.4929 13.0388 2.22703 11.773C0.961159 10.5071 0.25 8.79021 0.25 7ZM4.57686 8.83252C5.04883 9.37832 5.85566 9.95312 7 9.95312C8.14434 9.95312 8.95117 9.37832 9.42314 8.83252C9.57607 8.65586 9.84238 8.6374 10.019 8.79033C10.1957 8.94326 10.2142 9.20957 10.0612 9.38623C9.47324 10.0612 8.45283 10.7969 7 10.7969C5.54717 10.7969 4.52676 10.0612 3.93877 9.38623C3.78584 9.20957 3.8043 8.94326 3.98096 8.79033C4.15762 8.6374 4.42393 8.65586 4.57686 8.83252ZM4.26836 5.73438C4.26836 5.56654 4.33503 5.40558 4.45371 5.28691C4.57238 5.16823 4.73334 5.10156 4.90117 5.10156C5.069 5.10156 5.22996 5.16823 5.34864 5.28691C5.46731 5.40558 5.53398 5.56654 5.53398 5.73438C5.53398 5.90221 5.46731 6.06317 5.34864 6.18184C5.22996 6.30052 5.069 6.36719 4.90117 6.36719C4.73334 6.36719 4.57238 6.30052 4.45371 6.18184C4.33503 6.06317 4.26836 5.90221 4.26836 5.73438ZM9.11992 5.10156C9.28775 5.10156 9.44871 5.16823 9.56739 5.28691C9.68606 5.40558 9.75273 5.56654 9.75273 5.73438C9.75273 5.90221 9.68606 6.06317 9.56739 6.18184C9.44871 6.30052 9.28775 6.36719 9.11992 6.36719C8.95209 6.36719 8.79113 6.30052 8.67246 6.18184C8.55378 6.06317 8.48711 5.90221 8.48711 5.73438C8.48711 5.56654 8.55378 5.40558 8.67246 5.28691C8.79113 5.16823 8.95209 5.10156 9.11992 5.10156Z"
                    fill="#5C6779"
                  />
                </svg>
              </button>

              {isEmojiOpen && (
                <div
                  className={`z-40 h-full w-full absolute overflow-visible bottom-[480px]`}
                >
                  <Picker
                    data={data}
                    onEmojiSelect={onEmojiClick}
                    onClickOutside={() => {
                      setIsEmojiOpen(false)
                    }}
                    theme="light"
                    previewPosition="none"
                    exceptEmojis="SmilingFace"
                    categories={[
                      "frequent",
                      "people",
                      "objects",
                      "foods",
                      "nature",
                      "activity",
                    ]}
                    autoFocus={true}
                    perLine="8"
                    skinTonePosition="none"
                    searchPosition="sticky"
                  />
                </div>
              )}
              {/* <button onClick={handleOpenFileDialog}>
                    <svg
                      width="22"
                      height="23"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.4375 11.5625H8.5625V8.5625H11.5625V7.4375H8.5625V4.4375H7.4375V7.4375H4.4375V8.5625H7.4375V11.5625ZM8 15.125C7.0125 15.125 6.0845 14.9375 5.216 14.5625C4.347 14.1875 3.59375 13.6813 2.95625 13.0438C2.31875 12.4062 1.8125 11.653 1.4375 10.784C1.0625 9.9155 0.875 8.9875 0.875 8C0.875 7.0125 1.0625 6.08425 1.4375 5.21525C1.8125 4.34675 2.31875 3.59375 2.95625 2.95625C3.59375 2.31875 4.347 1.8125 5.216 1.4375C6.0845 1.0625 7.0125 0.875 8 0.875C8.9875 0.875 9.91575 1.0625 10.7847 1.4375C11.6532 1.8125 12.4062 2.31875 13.0438 2.95625C13.6813 3.59375 14.1875 4.34675 14.5625 5.21525C14.9375 6.08425 15.125 7.0125 15.125 8C15.125 8.9875 14.9375 9.9155 14.5625 10.784C14.1875 11.653 13.6813 12.4062 13.0438 13.0438C12.4062 13.6813 11.6532 14.1875 10.7847 14.5625C9.91575 14.9375 8.9875 15.125 8 15.125Z"
                        fill="#A7A9AB"
                      />
                    </svg>
                  </button> */}
              {/* </>
              ) : null} */}
              <div className="italic text-sm w-full flex flex-row text-[#F74B14] gap-2 mt-1 justify-end mr-8">
                {editorState.getCurrentContent().getPlainText("").length >
                  MAX_CHARACTERS - 1 ||
                isPasteLimit > 0 ||
                isMaxSize ||
                pastedFolder
                  ? CAUTON_ICON
                  : null}
                {editorState.getCurrentContent().getPlainText("").length >
                MAX_CHARACTERS - 1 ? (
                  <div>
                    {t("Chat.LimitedToMaximum")} {MAX_CHARACTERS}{" "}
                    {t("Chat.Characters")}
                  </div>
                ) : null}
                {isPasteLimit > 0 ? (
                  <div>
                    {isPasteLimit} characters more than the expected limit
                  </div>
                ) : null}
                {isMaxSize ? <div>{t("Chat.FileMaxSizeError")}</div> : null}
                {pastedFolder ? (
                  <div>{t("Chat.CannotPasteAFolder")}</div>
                ) : null}
              </div>
            </div>
            <div className="flex flex-row-reverse w-1/4 mr-2">
              {editorState.getCurrentContent().hasText() ? (
                <button onClick={(e) => submit()}>{activeSendicon}</button>
              ) : (
                <button className={""} onClick={(e) => submit()}>
                  {setSendicon}
                </button>
              )}
              <button onClick={clearEditContent} className="mr-10">
                {setDeleteicon}
              </button>
              {/* <div onClick={()=>setSchedule(true)} className="cursor-pointer">
                <svg
                className="ml-[6px] mt-[11px]"
                  width="8"
                  height="5"
                  viewBox="0 0 8 5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.99896 4.77839L0.703125 1.46797L1.31563 0.855469L3.99896 3.5388L6.68229 0.855469L7.29479 1.46797L3.99896 4.77839Z"
                    fill="#A7A9AB"
                  />
                </svg>
                </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* {schedule === true ? (
        <ScheduleModal title={"Schedule Message"} onclick={onClose} />
      ) : null} */}
    </div>
  )
}

export default RichTextBoxEdit
