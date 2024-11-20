import React, { memo, useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import EmojiPicker from "./emojiPicker/emojiPicker"
import MessageList from "./messageList"
import FileTransfer from "./fileTransfer"
import { t } from "i18next"

const Chat = (props: any) => {
  const { groupChatState } = props
  const dispatch = useDispatch()
  const [emojiPicker, setEmojiPicker] = useState(false)
  const groupChat = useSelector((state: any) => state.Main.groupChat)
  const privateChat = useSelector((state: any) => state.Main.privateChat)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const privateChatParticipant = useSelector(
    (state: any) => state.Main.privateChatParticipant
  )
  const privateChatParticipantName = useSelector(
    (state: any) => state.Main.privateChatParticipantName
  )
  const [message, setMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [fileUploading, setFileUploading] = useState(false)

  const callbackRef = useCallback(
    (chatElement) => {
      if (chatElement) {
        chatElement.focus()
      }
    },
    [message, groupChatState, selectedFile]
  )

  useEffect(() => {
    if (groupChatState) {
      dispatch(actionCreators.setUnReadGroupChat())

      dispatch(actionCreators.setActiveChat("group"))
    } else {
      dispatch(actionCreators.setUnReadPrivateChat(privateChatParticipant))
      dispatch(actionCreators.setActiveChat(privateChatParticipant))
    }
  }, [])

  const closeMembersList = () => {
    props.closeChat()
    dispatch(actionCreators.setMembersList(false))
  }
  const handleSendButton = async () => {
    if (message[0] == "/") {
      const commands = message.split(":")
      //
      try {
        if (commands[0] === "/pause") {
          meetingSession.pauseSubscriberVideo(
            [commands[1]],
            commands[2] === "true"
          )
        } else if (commands[0] === "/participant") {
          if (commands[1] == "all") {
            console.table(participantList)
          } else {
          }
        } else if (commands[0] === "/bot") {
          if (commands[1] === "create") {
            let bot_length = 0
            participantList.forEach((element: any) => {
              if ((element.name as string).includes("Bot")) {
                bot_length += 1
              }
            })
            for (let i = 0; i < +commands[2]; i++) {
              const participant = {
                meetingConfig: null,
                name: "Bot" + (i + 1 + bot_length),
                participant_id: "Bot" + (i + 1 + bot_length),
                audio_room: false,
                audio: false,
                video: false,
                audioStream: null,
                videoStream: null,
                screenshareStream: null,
                audioSdp: null,
                videoSdp: null,
                screenshareSdp: null,
                audioPeer: null,
                videoPeer: null,
                screensharePeer: null,
                mixedAudio: null,
                isPublisher: false,
                timestamp: Date.now(),
                raiseHand: false,
                pause: false,
                speaking: false,
                screenshare: false,
                host: false,
                audioSender: null,
                videoSender: null,
                screenshareSender: null,
              }
              dispatch(actionCreators.setParticipant(participant))
              const data = {
                state: false,
                participant_id: participant.participant_id,
                type: "video",
              }
              dispatch(actionCreators.UpdateParticipantList(data))
            }
          } else if (commands[1] === "update") {
            if (commands[2] === "video") {
              if (commands[3] === "all") {
                participantList.forEach(
                  async (participant: any, index: number) => {
                    if (participant.participant_id.includes("Bot")) {
                      if (
                        commands[4] === "on" &&
                        !participant?.videoStream?.active
                      ) {
                        await navigator.mediaDevices
                          .getUserMedia({
                            audio: false,
                            video: { aspectRatio: 1.78 },
                          })
                          .then((track: MediaStream) => {
                            const data1 = {
                              state: true,
                              participant_id: "Bot" + index,
                              type: "video",
                            }
                            dispatch(
                              actionCreators.UpdateParticipantList(data1)
                            )
                            setTimeout(() => {
                              const data = {
                                state: track,
                                participant_id: "Bot" + index,
                                type: "videoStream",
                              }
                              dispatch(
                                actionCreators.UpdateParticipantList(data)
                              )
                              ;(
                                document.getElementById(
                                  "video" + "Bot" + index
                                ) as any
                              ).srcObject = track
                            }, 200)
                          })
                      } else if (
                        commands[4] === "off" &&
                        participant.videoStream
                      ) {
                        participant?.videoStream
                          ?.getTracks()
                          .forEach(function (track: any) {
                            track.stop()
                          })
                        const data = {
                          state: false,
                          participant_id: participant.participant_id,
                          type: "video",
                        }
                        dispatch(actionCreators.UpdateParticipantList(data))
                      }
                    }
                  }
                )
              } else {
                if (commands[4] === "on") {
                  await navigator.mediaDevices
                    .getUserMedia({
                      audio: false,
                      video: { aspectRatio: 1.78 },
                    })
                    .then((track: MediaStream) => {
                      const data1 = {
                        state: true,
                        participant_id: commands[3],
                        type: "video",
                      }
                      dispatch(actionCreators.UpdateParticipantList(data1))
                      setTimeout(() => {
                        const data = {
                          state: track,
                          participant_id: commands[3],
                          type: "videoStream",
                        }
                        dispatch(actionCreators.UpdateParticipantList(data))
                        ;(
                          document.getElementById("video" + commands[3]) as any
                        ).srcObject = track
                      }, 200)
                    })
                } else if (commands[4] === "off") {
                  const participant = participantList.find(
                    (node: any) => node.participant_id === commands[3]
                  )
                  participant?.videoStream
                    ?.getTracks()
                    .forEach(function (track: any) {
                      track.stop()
                    })
                  const data = {
                    state: false,
                    participant_id: participant.participant_id,
                    type: "video",
                  }
                  dispatch(actionCreators.UpdateParticipantList(data))
                }
              }
            }
          }
        }
      } catch {}
    } else {
      let messageContent: string | { file: Blob; message: string }
      let type: string, title: string
      if (selectedFile) {
        messageContent = selectedFile
        type = "file"
        title = selectedFile.name
      } else {
        messageContent = message.trim()
        type = "text"
        title = "text"
      }

      if (typeof messageContent == "string" && messageContent.length > 1950) {
        alert(t("Meeting.LongMsgAlert"))
      } else if (messageContent !== undefined) {
        if (groupChatState) {
          if (selectedFile) {
            setFileUploading(true)
          }
          meetingSession
            .sendMessage(messageContent, type, title)
            .then((response: any) => {
              if (selectedFile) {
                setSelectedFile(null)
                setFileUploading(false)
              }
              // const data = {
              //   status: 'pending',
              //   seen: false,
              //   type: type,
              //   title: title,
              //   sender: participantList[selfTileIndex].participant_id,
              //   receiver: "all_participant",
              //   participant_id: "all_participant",
              //   message: response.message,
              //   timestamp: response.timestamp,
              //   participant_name: "You"
              // }
              // dispatch(actionCreators.addGroupChat(data))
            })
            .catch(() => {})
        } else {
          if (selectedFile) {
            setFileUploading(true)
          }
          meetingSession
            .sendMessage(messageContent, type, title, privateChatParticipant)
            .then((response: any) => {
              // const data = {
              //   status: 'pending',
              //   seen: true,
              //   type: type,
              //   title: title,
              //   sender: participantList[selfTileIndex].participant_id,
              //   receiver: privateChatParticipant,
              //   participant_id: privateChatParticipant,
              //   message: response.message,
              //   timestamp: response.timestamp,
              //   participant_name: "You"
              // }
              // dispatch(actionCreators.addPrivateChat(data))
              if (selectedFile) {
                setSelectedFile(null)
                setFileUploading(false)
              }
            })
            .catch(() => {})
        }
        setMessage("")
      }
    }
  }

  const onEmojiSelect = (event: any) => {
    setMessage(message + event)
  }

  const handleKeyPress = (event: any) => {
    //
    if (
      event.charCode === 13 &&
      ((message && message.trim() != "") || selectedFile) &&
      !event.shiftKey &&
      !fileUploading
    ) {
      event.preventDefault()
      handleSendButton()
    } else if (event.charCode === 13 && !event.shiftKey) {
      event.preventDefault()
    }
  }

  return (
    <div className=" w-[350px] h-[calc(100vh-5px)] rounded-2xl pl-2.5 pr-2.5 m-1 py-2.5 bg-[#ffffff]">
      <div className=" h-[54px] pl-[3px] py-2 pr-5 flex justify-between items-center">
        <div className="flex items-center">
          <svg
            className=" cursor-pointer"
            id="closeChat"
            onClick={props.closeChat}
            width="8"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
          >
            <path
              d="M0.614601 5.40215L5.39585 0.620898C5.72632 0.29043 6.2607 0.29043 6.58765 0.620898L7.38218 1.41543C7.71265 1.7459 7.71265 2.28027 7.38218 2.60723L3.99663 5.9998L7.3857 9.38887C7.71617 9.71934 7.71617 10.2537 7.3857 10.5807L6.59117 11.3787C6.2607 11.7092 5.72632 11.7092 5.39937 11.3787L0.618117 6.59746C0.284133 6.26699 0.284133 5.73262 0.614601 5.40215Z"
              fill="#A7A9AB"
            />
            backArrow
          </svg>
          {groupChatState ? (
            <span className=" ml-6 text-lg leading-5 text-link">
              {t("Meeting.AllChat")}
            </span>
          ) : (
            <span className=" ml-6 text-lg leading-5 w-60 overflow-hidden text-ellipsis ">
              {privateChatParticipantName}
            </span>
          )}
        </div>
        <svg
          className=" cursor-pointer"
          id="closeMembersList"
          onClick={closeMembersList}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M15.8334 5.34102L14.6584 4.16602L10 8.82435L5.34169 4.16602L4.16669 5.34102L8.82502 9.99935L4.16669 14.6577L5.34169 15.8327L10 11.1743L14.6584 15.8327L15.8334 14.6577L11.175 9.99935L15.8334 5.34102Z"
            fill="#A7A9AB"
          />
          close
        </svg>
      </div>
      <div
        className={
          emojiPicker
            ? "h-[calc(100%-203px)] flex flex-col-reverse overflow-auto px-1"
            : "h-[calc(100%-108px)] flex flex-col-reverse overflow-auto px-1"
        }
      >
        {groupChatState ? (
          <MessageList groupChatState={groupChatState} messages={groupChat} />
        ) : (
          <MessageList
            groupChatState={groupChatState}
            privateChatParticipant={privateChatParticipant}
            messages={privateChat}
          />
        )}
      </div>
      <div className=" mx-1 mt-0.5 px-2.5 py-2.5 flex justify-between items-center border bordeer-[#A7A9AB] box-border rounded-[10px] ">
        <div className=" flex items-center">
          <FileTransfer
            fileUploading={fileUploading}
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
          />
          <svg
            className=" cursor-pointer"
            id="emoji"
            onClick={() => setEmojiPicker(!emojiPicker)}
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
          >
            <path
              d="M9.26941 0C4.59118 0 0.800781 3.80444 0.800781 8.5C0.800781 13.1956 4.59118 17 9.26941 17C13.9477 17 17.738 13.1956 17.738 8.5C17.738 3.80444 13.9477 0 9.26941 0ZM12.0012 5.75806C12.6056 5.75806 13.094 6.24819 13.094 6.85484C13.094 7.46149 12.6056 7.95161 12.0012 7.95161C11.3968 7.95161 10.9085 7.46149 10.9085 6.85484C10.9085 6.24819 11.3968 5.75806 12.0012 5.75806ZM6.5376 5.75806C7.14201 5.75806 7.63032 6.24819 7.63032 6.85484C7.63032 7.46149 7.14201 7.95161 6.5376 7.95161C5.93318 7.95161 5.44487 7.46149 5.44487 6.85484C5.44487 6.24819 5.93318 5.75806 6.5376 5.75806ZM13.1896 11.5915C12.2164 12.7637 10.789 13.4355 9.26941 13.4355C7.74984 13.4355 6.32247 12.7637 5.34926 11.5915C4.88485 11.0329 5.72488 10.3337 6.18929 10.8889C6.9542 11.8109 8.07424 12.3353 9.26941 12.3353C10.4646 12.3353 11.5846 11.8075 12.3495 10.8889C12.8071 10.3337 13.6506 11.0329 13.1896 11.5915Z"
              fill="#A7A9AB"
            />
            emoji
          </svg>
        </div>
        {/* <input
          className='w-full m-1 outline-none'
          type="text"
          value={selectedFile ? selectedFile.name : message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyPress={(event: any) => handleKeyPress(event)}
          ref={callbackRef}
        /> */}
        {selectedFile ? (
          <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis px-1">
            {selectedFile.name}
          </div>
        ) : (
          <textarea
            id="message"
            className="w-full m-1 outline-none resize-none"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={1}
            onKeyPress={(event: any) => handleKeyPress(event)}
            ref={callbackRef}
            data-private="redact"
          />
        )}

        {fileUploading ? (
          <svg
            className="animate-spin"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M21.896 11C21.896 17.0177 17.0177 21.896 11 21.896C4.9823 21.896 0.104004 17.0177 0.104004 11C0.104004 4.9823 4.9823 0.104004 11 0.104004C17.0177 0.104004 21.896 4.9823 21.896 11ZM2.29842 11C2.29842 15.8057 6.19424 19.7016 11 19.7016C15.8057 19.7016 19.7016 15.8057 19.7016 11C19.7016 6.19424 15.8057 2.29842 11 2.29842C6.19424 2.29842 2.29842 6.19424 2.29842 11Z"
              fill="url(#paint0_linear_2993_20663)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2993_20663"
                x1="8.03545"
                y1="1.24821"
                x2="26.5768"
                y2="13.5484"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#B3B3B3" />
                <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <svg
            id="send"
            className={
              (message && message.trim() != "") || selectedFile
                ? " cursor-pointer"
                : "cursor-not-allowed"
            }
            onClick={() =>
              (message && message.trim() != "") || selectedFile
                ? handleSendButton()
                : null
            }
            width="22"
            height="19"
            viewBox="0 0 22 19"
            fill="none"
          >
            <path
              d="M21.866 1.66995L18.5774 17.2364C18.3293 18.335 17.6823 18.6084 16.7628 18.0908L11.7521 14.3848L9.33427 16.7188C9.06671 16.9873 8.84293 17.2119 8.32726 17.2119L8.68726 12.0899L17.9741 3.66702C18.3779 3.30569 17.8866 3.1055 17.3466 3.46683L5.86568 10.7227L0.923044 9.16995C-0.152075 8.83304 -0.171534 8.09085 1.14682 7.57327L20.4795 0.0976854C21.3746 -0.239229 22.1579 0.297881 21.866 1.66995Z"
              fill="#A7A9AB"
            />
            send
          </svg>
        )}
      </div>
      {emojiPicker ? <EmojiPicker onEmojiSelect={onEmojiSelect} /> : null}
    </div>
  )
}

export default memo(Chat)
