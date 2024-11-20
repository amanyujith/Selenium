import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
} from "@draft-js-plugins/mention" //@ts-ignore
import "@draft-js-plugins/mention/lib/plugin.css"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { stateToHTML } from "draft-js-export-html"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import moment from "moment"
import ScheduleModal from "./reusable/ScheduleModal"
import { AttachmentList, DownloadAttachment } from "./attachmentCard"
import useUploadFiles from "./hooks/useUploadFiles"
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js"
import Markdown from "markdown-to-jsx"
import useNotificationSound from "./hooks/useNotificationSound"
import { useDropzone } from "react-dropzone"
import DraftParser from "./hooks/draftToHTMLParser"
import TypingIndicator from "./hooks/typingIndicator"
import useThrottle from "./hooks/useThrottle"
import mentionsStyles from "./chatContainer/mentionsStyles.module.css"
import { t } from "i18next"
import AudioRecording from "./audioRecording"
import { CAUTON_ICON } from "../../../../../utils/SVG/svgsRestHere"
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
const Success = require("./audio/incoming-outgoing-message/Success.mp3")
const theNotification = require("./audio/incoming-outgoing-message/The Notification.mp3")

const _ = require("lodash")

const MAX_CHARACTERS = 5000

type submitFunction = (
  message: string,
  uuid?: string,
  to?: string,
  isGroup?: boolean,
  option?: any
) => void

interface RichTextBoxType {
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
}

const RichTextBox = ({
  setSendicon,
  activeSendicon,
  setDeleteicon,
  editmsg,
  name,
  sendMessage,
  to,
  id,
  chatID,
  editUserID,
  members,
  inactive_members,
}: RichTextBoxType) => {
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
  const [isEditorInFocus, setIsEditorFocus] = useState<boolean>(false)
  const [remountKey, setRemountKey] = useState(1)
  const [hasValidFiles, setHasValidFiles] = useState(false)
  const [isPasteLimit, setPasteLimit] = useState<number>(0)
  const [pastedFolder, setPastedFolder] = useState(false)
  const [isShaking, setIsShaking] = useState<boolean>(false)
  const [isRendered, setIsRendered] = useState<boolean>(false)
  const [audioFile, setAudioFile] = useState(Outgoing)
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const groupadd = useSelector((state: any) => state.Chat.createGrpModal)
  const [dftSuggestions, setDftSuggestions] = useState([])
  const modalCustom = useSelector((state: any) => state.Chat.rejectReasonModal)
  const usersList = useSelector((state: any) => state.Chat.userData)
  const [playNotificationSound] = useNotificationSound(Outgoing)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [throttleUserTyping, clearThrottle] = useThrottle(() => {
    typing()
  }, 10000)
  const messageDelivered = useSelector(
    (state: any) => state.Chat.messageDelivered
  )
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const [throttlemessageDelivered, clearmessageDelivered] = useThrottle(() => {
    playSound(audioFile)
  }, 500)

  const {
    files,
    handleFileChange,
    handleFileRemove,
    clearFiles,
    handlePasteFile,
    isMaxSize,
    handleRetry,
  } = useUploadFiles(chatInstance, chatID, isGroup, activeChat.files ?? [])

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
    focusEditor()
  }

  const playSound = (src: string) => {
    if (!settings[0]?.mute) {
      const audio = new Audio(src)
      audio.currentTime = 0
      //audio.loop = true
      audio.play()
    }
    dispatch(actionCreators.messageDelivered(0))
  }

  //Mention

  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const customSuggestionsFilter = (searchValue: any, suggestions: any) => {
    const size = (list: any) =>
      list.constructor.name === "List" ? list.size : list.length

    const get = (obj: any, attr: any) => (obj.get ? obj.get(attr) : obj[attr])

    //        const value = searchValue.toLowerCase()
    //        const filteredSuggestions = suggestions.filter((suggestion: any) => {
    //         const name = get(suggestion, "name").toLowerCase();
    //         return name.indexOf(value) > -1;
    //     });
    //        filteredSuggestions.sort((a: any, b: any) => {
    //         const nameA = get(a, "name").toLowerCase();
    //         const nameB = get(b, "name").toLowerCase();
    //         const indexA = nameA.indexOf(value);
    //         const indexB = nameB.indexOf(value);
    //         if (indexA === indexB) {
    //             return nameA.localeCompare(nameB);
    //         }
    //         return indexA - indexB;
    //        });
    //     return filteredSuggestions.slice(0, Math.min(size(filteredSuggestions), 10));
    // };

    const value = searchValue.toLowerCase()
    const filteredSuggestions = suggestions.filter(
      (suggestion: any) =>
        !value || get(suggestion, "name").toLowerCase().indexOf(value) > -1
    )
    const length =
      size(filteredSuggestions) < 50 ? size(filteredSuggestions) : 50
    return filteredSuggestions.slice(0, length)
  }

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
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
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin]
    return { plugins, MentionSuggestions }
  }, [])

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open)
  }, [])

  const onSearchChange = useCallback(({ value }: { value: string }) => {
    if (!value) setSuggestions(customSuggestionsFilter(value, []))
    chatInstance?.getTenantUsers(value).then((res: any) => {
      if (!value) {
        setDftSuggestions(customSuggestionsFilter(value, res))
      } else if (!res.length) {
        setDftSuggestions(customSuggestionsFilter(value, []))
      }
      if (res.length) setSuggestions(customSuggestionsFilter(value, res))
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

  const getCurrentBlock = (editorState: any) => {
    const currentSelection = editorState.getSelection()
    const blockKey = currentSelection.getStartKey()
    return editorState.getCurrentContent().getBlockForKey(blockKey)
  }

  const getCurrentText = (editorState: any) => {
    const currentBlock = getCurrentBlock(editorState)
    const blockText = currentBlock.getText()
    return blockText
  }

  const onEmojiClick = (event: any) => {
    // Get block for current selection
    const currentContent = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    const start = selection.getStartOffset()
    const end = selection.getEndOffset()

    if (start === end) {
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
    } else {
      const textWithInsert = Modifier.replaceText(
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
    }

    // setEditorState(editorWithInsert);
    dispatch(actionCreators.setEmojiBox(!emojiPalette))
    setIsEmojiOpen(false)
  }

  const emojiPaletteOpen = (e: any) => {
    e.stopPropagation()
    dispatch(actionCreators.setEmojiBox(!emojiPalette))
    setIsEmojiOpen((prev: boolean) => !prev)

    focusEditor()
  }
  useEffect(() => {
    if (messageDelivered) throttlemessageDelivered()
  }, [messageDelivered])

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 85 && (event.ctrlKey || event.metaKey)) {
        handleOpenFileDialog()
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

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
      ? setAudioFile(Success)
      : file === "incoming"
      ? setAudioFile(Incoming)
      : file === "turnedoff"
      ? setAudioFile("")
      : setAudioFile(Outgoing)
  }, [settings[0]?.outgoing_chat_notftn_sound])

  useEffect(() => {
    const filesRemoved = files.every((file: any) => file.cancelled) //true   false    true   false
    const filesFailed = files.every((file: any) => file.failed) //false    true    true   false
    let filteredFiles = files.filter(
      (file: any) => !file.failed && !file.cancelled
    )
    const filesUrl = filteredFiles.every((file: any) => file.url) //false    true    true   false
    setHasValidFiles(!filesRemoved && !filesFailed && filesUrl) //false    false   false   true
  }, [files])

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
        return inactive_user.name
      } else {
        return ""
      }
    }
    return username ?? getInativeUsername()
  }

  const submit = () => {
    if (activeChat?.messageRecieved) {
      chatInstance?.grafanaLogger([
        "Client : Message Submit",
        {
          hasValidFiles: hasValidFiles,
          uploadingStatus: activeChat.uploading,
        },
      ])
      const data = editorState.getCurrentContent()
      const rawObject = convertToRaw(data)
      const markdownString = draftToMarkdown(rawObject)
      const plainText = data.getPlainText()
      clearThrottle()

      if (files && files.length > 0 && hasValidFiles && !activeChat.uploading) {
        const filteredFiles = files
          .filter((file) => !file.cancelled)
          .map(({ name, type, size, url }) => ({ name, type, size, url }))

        replyFlag
          ? chatInstance?.publishMessage("file", activeChat?.uuid, isGroup, {
              message: { ...rawObject, plainText: plainText },
              reply_to: {
                uuid: replyMsg?.uuid,
                from: replyMsg?.from,
                body: replyMsg?.body,
                attachments: replyMsg?.attachments,
                a_ctime: replyMsg?.a_ctime,
                type:
                  replyMsg.attachments && replyMsg.attachments.length > 0
                    ? "file"
                    : "text",
              },
              attachments: filteredFiles,
            })
          : chatInstance?.publishMessage("file", activeChat?.uuid, isGroup, {
              message: { ...rawObject, plainText: plainText },
              attachments: filteredFiles,
            })
        // playSound(audioFile)
        // playNotificationSound(0.5, false);

        //chatInstance?.editMessage(uuid, message, to, isGroup);

        clearFiles()
        dispatch(actionCreators.setEdit(""))
        dispatch(actionCreators.setShowEmoji(false))
        dispatch(actionCreators.setReplyFlag(false))
        //setEditorState(EditorState.createEmpty());
        const newState = EditorState.createEmpty()
        setEditorState(EditorState.moveFocusToEnd(newState))
        focusEditor()
      } else {
        const currentPlainText = editorState.getCurrentContent().getPlainText()

        if (currentPlainText?.trim() !== "") {
          // const text = stateToHTML(editorState.getCurrentContent());

          // const markdownString = draftToMarkdown(rawObject);
          //navigator.clipboard.writeText(markdownString)

          if (editUserID === chatID) {
            if (markdownString.trim() !== initialEditMsg) {
              sendMessage(markdownString, id, to, isGroup)
            }
          } else {
            replyFlag
              ? chatInstance?.publishMessage(
                  "text",
                  activeChat?.uuid,
                  isGroup,
                  {
                    message: { ...rawObject, plainText: plainText },
                    reply_to: {
                      uuid: replyMsg?.uuid,
                      from: replyMsg?.from,
                      body: replyMsg?.body,
                      attachments: replyMsg?.attachments,
                      a_ctime: replyMsg?.a_ctime,
                      type:
                        replyMsg.attachments && replyMsg.attachments.length > 0
                          ? "file"
                          : "text",
                    },
                  }
                )
              : chatInstance?.publishMessage(
                  "text",
                  activeChat?.uuid,
                  isGroup,
                  {
                    message: { ...rawObject, plainText: plainText },
                  }
                )
          }
          // playSound(audioFile)
          // playNotificationSound(0.5, false);
          dispatch(actionCreators.setEdit(""))
          dispatch(actionCreators.setShowEmoji(false))
          dispatch(actionCreators.setReplyFlag(false))
          const newState = EditorState.createEmpty()
          setEditorState(EditorState.moveFocusToEnd(newState))
          focusEditor()
        }
      }
    }
  }

  const focusEditor = () => {
    if (!groupadd && !modalCustom) {
      setTimeout(() => {
        editorRef?.current?.focus()
        setIsEditorFocus(true)
      }, 0)
    }
  }

  const focusWithoutDelay = () => {
    if (!groupadd && !modalCustom) {
      editorRef?.current?.focus()
      setIsEditorFocus(true)
    }
  }

  useEffect(() => {
    if (replyFlag) focusEditor()
  }, [replyFlag])

  useEffect(() => {
    setPasteLimit(0)
    if (editUserID !== chatID) {
      dispatch(actionCreators.setEdit(""))
    }
    dispatch(actionCreators.setShowEmoji(false))
    dispatch(actionCreators.setReplyFlag(false))
    clearThrottle()
  }, [chatID])

  const dispatchDraft = (data: any, text: any, draftFiles: any) => {
    dispatch(actionCreators.setDraftMessage(data?.uuid, text, isGroup))
  }

  useEffect(() => {
    if (activeChat.draft) {
      const newState = EditorState.createWithContent(
        convertFromRaw(activeChat.draft)
      )

      setEditorState(EditorState.moveFocusToEnd(newState))
    } else if (editSec === "") {
      clearContent()
      //setEditorState(EditorState.createEmpty());
    }
    focusEditor()
    return () => {
      if (editorRef.current) {
        const text = stateToHTML(
          editorRef?.current?.props?.editorState?.getCurrentContent()
        )
        const rawObject = convertToRaw(
          editorRef?.current?.props?.editorState?.getCurrentContent()
        )

        dispatchDraft(activeChat, rawObject, files)
      }
    }
  }, [activeChat?.uuid])

  useEffect(() => {
    if (editmsg || editmsg === "") {
      const rawData = markdownToDraft(editmsg)
      const contentState = convertFromRaw(rawData)
      //const blocksFromHTML = convertFromHTML(editmsg);
      setInitialEditMsg(editmsg)
      const newState = EditorState.createWithContent(contentState)
      setTimeout(() => {
        //setEditorState(newState);
        setEditorState(EditorState.moveFocusToEnd(newState))
      }, 0)
      //focusEditor()
    }
  }, [])

  const keyBindingFn = (e: any) => {
    if (e.code === "Enter" && !e.shiftKey) {
      return "send_msg"
    }
    if (e.code === "ArrowUp" && !open) {
      if (
        handleKeyCommand("arrow_up", editorState, e.timeStamp) === "handled"
      ) {
        e.preventDefault()
      }
      return null
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
    if (command === "arrow_up") {
      if (
        editorState.getCurrentContent().getPlainText() === "" &&
        activeChat.messages[activeChat.messages.length - 1]?.category !==
          "delete_message"
      ) {
        dispatch(actionCreators.setArrowUpEdit())
        return "handled"
      }
    }
    return "not-handled"
  }

  const clearContent = () => {
    if (replyFlag === true) {
      dispatch(actionCreators.setReplyFlag(false))
    }
    const newState = EditorState.createEmpty()
    if (isRendered) {
      setEditorState(EditorState.moveFocusToEnd(newState))
    } else {
      setTimeout(() => {
        setEditorState(EditorState.moveFocusToEnd(newState))
      }, 0)
    }

    //dispatch(actionCreators.setEdit(""));

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
    // setIsEmojiOpen(false);
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

  function containsTableTag(htmlString: string) {
    // Create a temporary DOM element
    let tempDiv = document.createElement("div")

    // Set the innerHTML of the temporary element to the HTML string
    tempDiv.innerHTML = htmlString

    // Check if there are any <td> elements
    return (
      tempDiv.querySelector("td") !== null ||
      tempDiv.querySelector("th") !== null ||
      tempDiv.querySelector("tr") !== null ||
      tempDiv.querySelector("table") !== null
    )
  }

  const handlePastedText = (
    pastedText: string,
    html: string,
    state: any
  ): DraftHandleValue => {
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

      setTimeout(() => {
        setPasteLimit(0)
      }, 4000)
      return "handled"
    } else if (containsTableTag(html)) {
      let content = state.getCurrentContent()
      let selection = state.getSelection()

      let newContent = Modifier.replaceText(content, selection, pastedText)
      let newEditorState = EditorState.push(
        editorState,
        newContent,
        "insert-characters"
      )
      onChange(newEditorState)
      return "handled"
    } else {
      return "not-handled"
    }
  }

  const handleAnimationEnd = () => {
    setIsShaking(false)
  }

  useEffect(() => {
    if (editorState && !editorState.getDecorator()) {
      setRemountKey((prevKey) => prevKey + 1)
    }
  }, [editorState])

  useEffect(() => {
    if (isPasteLimit > 0 || isMaxSize) {
      setIsShaking(true)
    }
  }, [isPasteLimit, isMaxSize])

  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        // Clicked outside the picker, handle the event here
      }
    }

    // Bind the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.ariaLabel !== "edit-input" &&
        event.target.tagName !== "INPUT" &&
        ((!event.ctrlKey && !event.metaKey) ||
          ((event.ctrlKey || event.metaKey) && event.code == "KeyV"))
        // &&
        // // event.target.attributes[2].nodeValue !== "edit-input"
      ) {
        focusWithoutDelay()
      }
    }
    if (!isEditorInFocus) {
      document.addEventListener("keydown", keydownHandler)
    }
    return () => {
      document.removeEventListener("keydown", keydownHandler)
    }
  }, [isEditorInFocus, groupadd, modalCustom])

  const handleEditorBlur = () => {
    setIsEditorFocus(false)
  }

  const handleEditorFocus = () => {
    if (!groupadd && !modalCustom) setIsEditorFocus(true)
  }

  const typing = () => {
    chatInstance?.publishMessage("typing", activeChat?.uuid, isGroup, {
      message: {
        uuid: personalInfo?.uuid,
        profile_picture: selfData?.profile_picture ?? loggedInUserInfo?.picture,
        display_name: selfData?.display_name ?? loggedInUserInfo?.display_name,
      },
    })
  }

  const handleEditorChange = (editorState: any) => {
    setEditorState(editorState)

    const hasText = editorState.getCurrentContent().hasText()
    const text = editorState.getCurrentContent().getPlainText()

    if (hasText && text.length) throttleUserTyping()

    //throttledCallback()
  }

  return (
    <div className="relative">
      <div className="min-h-[120px] h-fit w-full flex justify-center static ">
        <div className="h-full w-full pt-3 px-[20px] rounded-b-[10px] flex flex-col border-t-[2px] border-t-[#F1F1F1] static">
          <div className={`flex flex-row justify-start h-8 w-full ml-1`}>
            <div className="flex flex-row w-1/2 ml-[-1px] gap-[22px] min-h-[23px]">
              <button
              id="bold"
                className={`${
                  editorState.getCurrentInlineStyle().has("BOLD")
                    ? "bg-[#0000001F] p-1 rounded-[5px]"
                    : ""
                }` }
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
              id="italic"
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
              id="oList"
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
              id="uList"
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
              id="codeBlock"
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
            <input // attachment code
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              onClick={(
                event: React.MouseEvent<HTMLInputElement, MouseEvent>
              ) => {
                const element = event.target as HTMLInputElement
                element.value = ""
              }}
              style={{ display: "none" }}
            />

            {editorState.getCurrentContent().hasText() || replyFlag ? (
              <div className="flex flex-row-reverse w-1/2 mr-4">
                <button onClick={clearContent}>{setDeleteicon}</button>
              </div>
            ) : null}
          </div>
          {replyFlag === true && (
            <div className="mt-3">
              <div
                className={`flex flex-col ml-[9px] max-w-[calc(100vw-410px)] p-3 w-fit h-fit max-h-[108px] bg-[#FEF4E9] rounded-[10px]`}
              >
                <div className={`flex flex-row items-end`}>
                  <div
                    className={`w-fit h-[14px] font-bold text-[12px] text-primary-200`}
                  >
                    {replyMsg.from === personalInfo?.uuid
                      ? "You"
                      : isGroup
                      ? getName(replyMsg.from)
                      : name}
                  </div>
                  <div
                    className={`ml-[5px] w-fit h-[12px] font-normal text-[10px] text-[#8D8D8D]`}
                  >
                    {moment(new Date(replyMsg.a_ctime)).format("hh:mm A")}
                  </div>
                </div>
                <div
                  className={`listFix pt-1 pb-[10px] truncate overflow-hidden max-w-[calc(100vw-510px)] w-fit h-fit max-h-[90px]  break-words content-center`}
                >
                  {replyMsg.type === "text" ? (
                    replyMsg.body.type && replyMsg.body.type === "v1" ? (
                      <Markdown>{replyMsg.body.plainText ?? ""}</Markdown>
                    ) : (
                      <DraftParser rawObject={replyMsg.body} />
                    )
                  ) : (
                    <div>
                      <div className="flex flex-row space-x-2">
                        <DownloadAttachment
                          attachments={replyMsg.attachments}
                          replay={true}
                        />
                      </div>
                      {replyMsg.body.type && replyMsg.body.type === "v1" ? (
                        replyMsg.type === "text" && (
                          <Markdown>{replyMsg.body}</Markdown>
                        )
                      ) : (
                        <DraftParser rawObject={replyMsg.body} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
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
                  : "mt-2 text-primary-200 ml-1 min-h-[30px] pb-[8px] max-h-[306px] flex flex-col-reverse break-all list-inside overflow-y-auto overflow-x-hidden text-base static list"
              } ${
                isShaking ||
                editorState.getCurrentContent().getPlainText("").length >
                  MAX_CHARACTERS - 1
                  ? "shake"
                  : ""
              }
              
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
                  <div>{t("Chat.DragRelease")}</div>
                </div>
              ) : null}
              <div className="bg-[#F9FAFA] px-1 ">
                <Editor
                  key={remountKey}
                  ariaLabel="text-input"
                  placeholder={placeholdertext}
                  ref={editorRef}
                  editorState={editorState}
                  onChange={(editorState) => handleEditorChange(editorState)}
                  spellCheck={true}
                  handleBeforeInput={handleBeforeInput}
                  handlePastedText={handlePastedText}
                  handleDroppedFiles={handleDroppedFiles}
                  handlePastedFiles={handlePastedFiles}
                  handleKeyCommand={handleKeyCommand}
                  keyBindingFn={keyBindingFn}
                  onBlur={handleEditorBlur}
                  onFocus={handleEditorFocus}
                  plugins={plugins}
                />
              </div>

              <div className={``}>
                <MentionSuggestions
                  open={open}
                  onOpenChange={onOpenChange}
                  suggestions={
                    suggestions.length ? suggestions : dftSuggestions
                  }
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
          <hr className="px-0 opacity-50 text-[#AFB4BD] ml-1" />
          {files?.length !== 0 && (
            <div className="mt-2 w-full  overflow-y-hidden ">
              <AttachmentList
                files={files}
                handleFileRemove={handleFileRemove}
                handleRetry={handleRetry}
              />
            </div>
          )}
          <div
            className={`flex flex-row justify-start h-25 w-full ml-1 my-2 relative`}
          >
            <div className="flex flex-row w-full gap-[15px]">
              {editUserID !== chatID ? (
                <>
                  {isEmojiOpen && (
                    <div
                      className={`z-40 h-fit-content w-fit-content absolute overflow-visible bottom-[80px]`}
                    >
                      <Picker
                        data={data}
                        ref={pickerRef}
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
                        autoFocusSearch={true}
                        perLine="8"
                        autoFocus={true}
                        skinTonePosition="none"
                        searchPosition="sticky"
                      />
                    </div>
                  )}
                  <button className="scale-150" onClick={emojiPaletteOpen} id="emojiPicker">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.9062 12C17.9062 10.4336 17.284 8.93129 16.1763 7.82365C15.0687 6.71601 13.5664 6.09375 12 6.09375C10.4336 6.09375 8.93129 6.71601 7.82365 7.82365C6.71601 8.93129 6.09375 10.4336 6.09375 12C6.09375 13.5664 6.71601 15.0687 7.82365 16.1763C8.93129 17.284 10.4336 17.9062 12 17.9062C13.5664 17.9062 15.0687 17.284 16.1763 16.1763C17.284 15.0687 17.9062 13.5664 17.9062 12ZM5.25 12C5.25 10.2098 5.96116 8.4929 7.22703 7.22703C8.4929 5.96116 10.2098 5.25 12 5.25C13.7902 5.25 15.5071 5.96116 16.773 7.22703C18.0388 8.4929 18.75 10.2098 18.75 12C18.75 13.7902 18.0388 15.5071 16.773 16.773C15.5071 18.0388 13.7902 18.75 12 18.75C10.2098 18.75 8.4929 18.0388 7.22703 16.773C5.96116 15.5071 5.25 13.7902 5.25 12ZM9.57686 13.8325C10.0488 14.3783 10.8557 14.9531 12 14.9531C13.1443 14.9531 13.9512 14.3783 14.4231 13.8325C14.5761 13.6559 14.8424 13.6374 15.019 13.7903C15.1957 13.9433 15.2142 14.2096 15.0612 14.3862C14.4732 15.0612 13.4528 15.7969 12 15.7969C10.5472 15.7969 9.52676 15.0612 8.93877 14.3862C8.78584 14.2096 8.8043 13.9433 8.98096 13.7903C9.15762 13.6374 9.42393 13.6559 9.57686 13.8325ZM9.26836 10.7344C9.26836 10.5665 9.33503 10.4056 9.45371 10.2869C9.57238 10.1682 9.73334 10.1016 9.90117 10.1016C10.069 10.1016 10.23 10.1682 10.3486 10.2869C10.4673 10.4056 10.534 10.5665 10.534 10.7344C10.534 10.9022 10.4673 11.0632 10.3486 11.1818C10.23 11.3005 10.069 11.3672 9.90117 11.3672C9.73334 11.3672 9.57238 11.3005 9.45371 11.1818C9.33503 11.0632 9.26836 10.9022 9.26836 10.7344ZM14.1199 10.1016C14.2878 10.1016 14.4487 10.1682 14.5674 10.2869C14.6861 10.4056 14.7527 10.5665 14.7527 10.7344C14.7527 10.9022 14.6861 11.0632 14.5674 11.1818C14.4487 11.3005 14.2878 11.3672 14.1199 11.3672C13.9521 11.3672 13.7911 11.3005 13.6725 11.1818C13.5538 11.0632 13.4871 10.9022 13.4871 10.7344C13.4871 10.5665 13.5538 10.4056 13.6725 10.2869C13.7911 10.1682 13.9521 10.1016 14.1199 10.1016Z"
                        fill="#5C6779"
                      />
                    </svg>
                  </button>
                  <button
                    className="scale-150"
                    id="handleOpenFileDialog"
                    onClick={handleOpenFileDialog}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 6.09375C13.5664 6.09375 15.0687 6.71601 16.1763 7.82365C17.284 8.93129 17.9062 10.4336 17.9062 12C17.9062 13.5664 17.284 15.0687 16.1763 16.1763C15.0687 17.284 13.5664 17.9062 12 17.9062C10.4336 17.9062 8.93129 17.284 7.82365 16.1763C6.71601 15.0687 6.09375 13.5664 6.09375 12C6.09375 10.4336 6.71601 8.93129 7.82365 7.82365C8.93129 6.71601 10.4336 6.09375 12 6.09375ZM12 18.75C13.7902 18.75 15.5071 18.0388 16.773 16.773C18.0388 15.5071 18.75 13.7902 18.75 12C18.75 10.2098 18.0388 8.4929 16.773 7.22703C15.5071 5.96116 13.7902 5.25 12 5.25C10.2098 5.25 8.4929 5.96116 7.22703 7.22703C5.96116 8.4929 5.25 10.2098 5.25 12C5.25 13.7902 5.96116 15.5071 7.22703 16.773C8.4929 18.0388 10.2098 18.75 12 18.75ZM11.5781 14.5312C11.5781 14.7633 11.768 14.9531 12 14.9531C12.232 14.9531 12.4219 14.7633 12.4219 14.5312V12.4219H14.5312C14.7633 12.4219 14.9531 12.232 14.9531 12C14.9531 11.768 14.7633 11.5781 14.5312 11.5781H12.4219V9.46875C12.4219 9.23672 12.232 9.04688 12 9.04688C11.768 9.04688 11.5781 9.23672 11.5781 9.46875V11.5781H9.46875C9.23672 11.5781 9.04688 11.768 9.04688 12C9.04688 12.232 9.23672 12.4219 9.46875 12.4219H11.5781V14.5312Z"
                        fill="#5C6779"
                      />
                    </svg>
                  </button>
                  <AudioRecording
                    focusEditor={focusEditor}
                    handlePastedFiles={handlePastedFiles}
                    clearFiles={clearFiles}
                  />
                </>
              ) : null}
              <div className="italic align-middle text-sm	flex shrink-0 mt-1 text-[#F74B14] flex-row justify-end w-full gap-2">
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
            <div className="flex flex-row-reverse w-1/6 mr-2">
              <div className="bg-[#F4F4F4] w-[34px] h-[32px] mr-2 rounded-[50px] pl-3 py-[3px] right-0 flex flex-row">
                {(activeChat?.messageRecieved &&
                  editorState.getCurrentContent().hasText() &&
                  editorState.getCurrentContent().getPlainText().trim()) ||
                (hasValidFiles && !activeChat.uploading) ? (
                  <button onClick={(e) => submit()} id="sendMessageButton1">
                    {activeSendicon}
                  </button>
                ) : (
                  <button onClick={(e) => submit()} id="sendMessageButton2">
                    {setSendicon}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {schedule === true ? (
        <ScheduleModal title={"Schedule Message"} onclick={onClose} />
      ) : null}
    </div>
  )
}

export default RichTextBox
