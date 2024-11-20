import React, { useCallback, useRef, useEffect, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import WaveSurferPlayer from "../../../../../atom/AudioElements/waveSurfer"
import ModalData from "../../../../../constructors/modal/modalData"
import { t } from "i18next"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../store"
import Modal from "../../modal/modal"

// let wavesurfer, record
// let scrollingWaveform = false
const AudioRecording = (props: any) => {
  const { handlePastedFiles, focusEditor, clearFiles } = props
  const [isRecording, setIsRecording] = useState(false)
  const [microphoneState, setMicrophoneState] = useState("prompt")
  const dispatch = useDispatch()
  const { data: activeChat, isGroups } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const callInfo = useSelector((state: RootState) => state.Chat.chatCallInfo)
  async function getPermission(permission: any) {
    try {
      return await navigator.permissions
        .query({ name: permission })
        .then((result) => {
          result.onchange = () => {
            setMicrophoneState(result.state)
            if (result.state === "denied") {
              setIsRecording(false)
            }
            return result.state
          }
          return result.state
        })
    } catch (error) {
      return `not supported`
    }
  }
  const checkPermission = async (key: string) => {
    const result = await getPermission(key)
    setMicrophoneState(result)
    return result
  }
  const startRecording = async () => {
    const result = await checkPermission("microphone")
    setMicrophoneState(result)
    if (result === "granted") {
      setIsRecording(true)
    } else if (result === "denied") {
      let modal = new ModalData({
        message:
          "To record audio, grant microphone permission in your browser settings.",
        closeButton: false,
        category: "modal",
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    } else {
      setIsRecording(true)
    }
  }

  useEffect(() => {
    checkPermission("microphone")
  }, [])

  useEffect(() => {
    if (isRecording) {
      setIsRecording(false)
    }
  }, [activeChat?.uuid])

  return (
    <div>
      {isRecording ? (
        <div className="w-screen h-screen fixed top-0 right-0 left-0 bottom-0 z-[50]">
          <div className="h-[32px] absolute bottom-5 left-[450px] mt-[0px] ml-[-6px] p-[3px] rounded-[7px] flex border border-[#dcc7af]">
            <div className="inline-block relative h-[24px] w-[24px] rounded-[5px] bg-[#dcc7af]">
              <svg
                id="cancelAudioRecording"
                onClick={() => {
                  setIsRecording(false)
                }}
                className=" cursor-pointer"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.7324 16.369C15.907 16.5437 16.1944 16.5437 16.369 16.369C16.5437 16.1944 16.5437 15.907 16.369 15.7324L12.6366 12L16.369 8.26761C16.5437 8.09296 16.5437 7.80563 16.369 7.63099C16.1944 7.45634 15.907 7.45634 15.7324 7.63099L12 11.3634L8.26761 7.63099C8.09296 7.45634 7.80563 7.45634 7.63099 7.63099C7.45634 7.80563 7.45634 8.09296 7.63099 8.26761L11.3634 12L7.63099 15.7324C7.45634 15.907 7.45634 16.1944 7.63099 16.369C7.80563 16.5437 8.09296 16.5437 8.26761 16.369L12 12.6366L15.7324 16.369Z"
                  fill="#5C6779"
                />
              </svg>
            </div>
            <WaveSurferPlayer
              focusEditor={focusEditor}
              setIsRecording={setIsRecording}
              handlePastedFiles={handlePastedFiles}
            />
          </div>
        </div>
      ) : (
        <div
          id="startRecording"
          className={`mt-[3px] scale-150 absolute ${
            callInfo ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => !callInfo && startRecording()}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.4062 9.46875V8.625H12.1406C11.9086 8.625 11.7188 8.43516 11.7188 8.20312C11.7188 7.97109 11.9086 7.78125 12.1406 7.78125H13.4062C13.4062 6.85049 12.6495 6.09375 11.7188 6.09375C10.788 6.09375 10.0312 6.85049 10.0312 7.78125V12C10.0312 12.9308 10.788 13.6875 11.7188 13.6875C12.6495 13.6875 13.4062 12.9308 13.4062 12H12.1406C11.9086 12 11.7188 11.8102 11.7188 11.5781C11.7188 11.3461 11.9086 11.1562 12.1406 11.1562H13.4062V10.3125H12.1406C11.9086 10.3125 11.7188 10.1227 11.7188 9.89062C11.7188 9.65859 11.9086 9.46875 12.1406 9.46875H13.4062ZM14.25 9.89062V11.5781V12C14.25 13.3975 13.1162 14.5312 11.7188 14.5312C10.3213 14.5312 9.1875 13.3975 9.1875 12V7.78125C9.1875 6.38379 10.3213 5.25 11.7188 5.25C13.1162 5.25 14.25 6.38379 14.25 7.78125V8.20312V9.89062ZM7.92188 10.3125C8.15391 10.3125 8.34375 10.5023 8.34375 10.7344V12C8.34375 13.8642 9.85459 15.375 11.7188 15.375C13.5829 15.375 15.0938 13.8642 15.0938 12V10.7344C15.0938 10.5023 15.2836 10.3125 15.5156 10.3125C15.7477 10.3125 15.9375 10.5023 15.9375 10.7344V12C15.9375 14.1885 14.2737 15.9867 12.1406 16.1977V17.9062H13.8281C14.0602 17.9062 14.25 18.0961 14.25 18.3281C14.25 18.5602 14.0602 18.75 13.8281 18.75H11.7188H9.60938C9.37734 18.75 9.1875 18.5602 9.1875 18.3281C9.1875 18.0961 9.37734 17.9062 9.60938 17.9062H11.2969V16.1977C9.16377 15.9867 7.5 14.1885 7.5 12V10.7344C7.5 10.5023 7.68984 10.3125 7.92188 10.3125Z"
              fill={`${microphoneState === "denied" ? "red" : "#5C6779"}`}
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export default AudioRecording
