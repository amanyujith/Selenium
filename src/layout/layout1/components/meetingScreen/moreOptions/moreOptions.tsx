import { useDispatch, useSelector } from "react-redux"
import AudioVideoDropdown from "../../audioVideoDropdown/audioVideoDropdown"
import packages from "../../../../../../package.json"
import { memo } from "react"
import { actionCreators } from "../../../../../store"
import ModalData from "../../../../../constructors/modal/modalData"
import hoverTimer from "../../../../../utils/hoverTimer"
import { t } from "i18next"
import { motion } from "framer-motion"
const MoreOptions = (props: any) => {
  const maxTileinSlider = useSelector(
    (state: any) => state.Main.maxTileinSlider
  )
  const dispatch = useDispatch()
  const { recording } = useSelector((state: any) => state.Flag)
  const { pauseRecording } = useSelector((state: any) => state.Flag)

  const user = useSelector((state: any) => state.Main.meetingSession)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const themePalette = useSelector((state: any) => state.Main.themePalette)

  const startRecording = () => {
    const participant_id = participantList.map((list: any) => {
      return list.participant_id
    })

    user.streamRecord(true, participant_id)
  }

  const pauseRecord = () => {
    dispatch(actionCreators.setPauseRecording(true))
  }
  const resumeRecord = () => {
    dispatch(actionCreators.setPauseRecording(false))
  }

  const stopRecording = () => {
    const participant_id = participantList.map((list: any) => {
      return list.participant_id
    })

    user.streamRecord(false, participant_id)
    dispatch(actionCreators.setPauseRecording(false))
  }

  const startRecordModal = new ModalData({
    header: t("Meeting.Record"),
    message: t("Meeting.StoreRecord"),
    type: "recordMeeting",
    closeButton: true,
    buttons: [
      {
        buttonName: t("Meeting.HoolvaCloud"),
        callback: startRecording,
        icon: (
          <svg
            width="19"
            height="14"
            viewBox="0 0 19 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.62 6.17234C15.7353 5.87141 15.8 5.54234 15.8 5.19922C15.8 3.70859 14.5906 2.49922 13.1 2.49922C12.5459 2.49922 12.0284 2.66797 11.6009 2.95484C10.8219 1.60484 9.36781 0.699219 7.7 0.699219C5.21375 0.699219 3.2 2.71297 3.2 5.19922C3.2 5.27516 3.20281 5.35109 3.20562 5.42703C1.63062 5.98109 0.5 7.48297 0.5 9.24922C0.5 11.4852 2.31406 13.2992 4.55 13.2992H14.9C16.8884 13.2992 18.5 11.6877 18.5 9.69922C18.5 7.95828 17.2625 6.50422 15.62 6.17234Z"
              fill="#A7A9AB"
            />
          </svg>
        ),
      },
    ],
  })
  const pauseStopModal = new ModalData({
    message: t("Meeting.StopRecording"),
    type: "recordMeeting",
    closeButton: true,
    buttons: [
      {
        buttonName: pauseRecording ? "Resume" : "Pause",
        callback: pauseRecording ? resumeRecord : pauseRecord,
        icon: (
          <svg
            width="19"
            height="14"
            viewBox="0 0 19 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.62 6.17234C15.7353 5.87141 15.8 5.54234 15.8 5.19922C15.8 3.70859 14.5906 2.49922 13.1 2.49922C12.5459 2.49922 12.0284 2.66797 11.6009 2.95484C10.8219 1.60484 9.36781 0.699219 7.7 0.699219C5.21375 0.699219 3.2 2.71297 3.2 5.19922C3.2 5.27516 3.20281 5.35109 3.20562 5.42703C1.63062 5.98109 0.5 7.48297 0.5 9.24922C0.5 11.4852 2.31406 13.2992 4.55 13.2992H14.9C16.8884 13.2992 18.5 11.6877 18.5 9.69922C18.5 7.95828 17.2625 6.50422 15.62 6.17234Z"
              fill="#A7A9AB"
            />
          </svg>
        ),
      },
      {
        buttonName: t("Meeting.Stop"),
        callback: stopRecording,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.1875 0.125H1.8125C0.880859 0.125 0.125 0.880859 0.125 1.8125V14.1875C0.125 15.1191 0.880859 15.875 1.8125 15.875H14.1875C15.1191 15.875 15.875 15.1191 15.875 14.1875V1.8125C15.875 0.880859 15.1191 0.125 14.1875 0.125Z"
              fill="#F75E1D"
            />
          </svg>
        ),
      },
    ],
  })

  return (
    <motion.div
      key="ShareOptions"
      initial={props.isCall ? {} : { scale: 0 }}
      animate={
        props.isCall
          ? {}
          : {
              scale: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }
      }
      exit={
        props.isCall
          ? {}
          : {
              scale: 0,
              transition: { duration: 0.3, ease: "easeOut" },
            }
      }
      className={`origin-bottom-right w-[371px] rounded-[3px] p-0.5 py-2.5 text-left shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] bg-[${themePalette.primary500}] bg-opacity-90`}
      style={{ backgroundColor: themePalette?.primary500 }}
    >
      {/* <div className='flex items-center px-2.5 py-1 rounded-[3px] mx-0.5 mt-0.5 hover:bg-[#ffffff] hover:bg-opacity-10'>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 4.75C7.35721 4.75 6.72886 4.94061 6.1944 5.29772C5.65994 5.65484 5.24338 6.16242 4.99739 6.75628C4.75141 7.35014 4.68705 8.00361 4.81245 8.63404C4.93785 9.26448 5.24738 9.84358 5.7019 10.2981C6.15642 10.7526 6.73552 11.0622 7.36596 11.1876C7.99639 11.313 8.64986 11.2486 9.24372 11.0026C9.83758 10.7566 10.3452 10.3401 10.7023 9.8056C11.0594 9.27114 11.25 8.64279 11.25 8C11.25 7.13805 10.9076 6.3114 10.2981 5.7019C9.6886 5.09241 8.86195 4.75 8 4.75ZM8 8.75C7.85166 8.75 7.70666 8.70601 7.58332 8.6236C7.45999 8.54119 7.36386 8.42406 7.30709 8.28701C7.25032 8.14997 7.23547 7.99917 7.26441 7.85368C7.29335 7.7082 7.36478 7.57456 7.46967 7.46967C7.57456 7.36478 7.7082 7.29335 7.85368 7.26441C7.99917 7.23547 8.14997 7.25032 8.28701 7.30709C8.42406 7.36386 8.54119 7.45999 8.6236 7.58332C8.70601 7.70666 8.75 7.85166 8.75 8C8.75 8.19891 8.67098 8.38968 8.53033 8.53033C8.38968 8.67098 8.19891 8.75 8 8.75ZM8 0.25C3.71875 0.25 0.25 3.71875 0.25 8C0.25 12.2812 3.71875 15.75 8 15.75C12.2812 15.75 15.75 12.2812 15.75 8C15.75 3.71875 12.2812 0.25 8 0.25ZM8 12C7.20887 12 6.43552 11.7654 5.77772 11.3259C5.11992 10.8864 4.60723 10.2616 4.30448 9.53073C4.00173 8.79983 3.92252 7.99556 4.07686 7.21964C4.2312 6.44371 4.61216 5.73098 5.17157 5.17157C5.73098 4.61216 6.44371 4.2312 7.21964 4.07686C7.99556 3.92252 8.79983 4.00173 9.53073 4.30448C10.2616 4.60723 10.8864 5.11992 11.3259 5.77772C11.7654 6.43552 12 7.20887 12 8C12 9.06087 11.5786 10.0783 10.8284 10.8284C10.0783 11.5786 9.06087 12 8 12Z" fill="#A7A9AB" />
        </svg>
        <span className='mx-5 text-sm leading-4 text-[#FFFFFF]'>Record</span>
      </div> */}

      {/* Section 1 */}
      {/* {isHost  ? (
        recording ? (
          <div
            className="flex items-center px-2.5 py-1 rounded-[3px] mx-0.5 mt-0.5 hover:bg-[#ffffff] hover:bg-opacity-10"
            onClick={() => dispatch(actionCreators.addModal(pauseStopModal))}
          > */}
      {/* <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.1875 0.125H1.8125C0.880859 0.125 0.125 0.880859 0.125 1.8125V14.1875C0.125 15.1191 0.880859 15.875 1.8125 15.875H14.1875C15.1191 15.875 15.875 15.1191 15.875 14.1875V1.8125C15.875 0.880859 15.1191 0.125 14.1875 0.125Z"
                fill="#F75E1D"
              />
            </svg> */}
      {/* end section 1 */}

      {/* {pauseRecording ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5 1.5V6C14.5 6.55281 14.0528 7 13.5 7H9C8.44719 7 8 6.55281 8 6C8 5.44719 8.44719 5 9 5H10.9809C10.0444 3.75938 8.56687 3.00688 6.99344 3.00688C4.24062 3.00688 2 5.24687 2 8C2 10.7531 4.24031 12.9937 6.99375 12.9937C8.08375 12.9937 9.11969 12.6491 9.99 11.9956C10.4344 11.6666 11.0594 11.7534 11.3903 12.1948C11.7212 12.6373 11.6325 13.2642 11.1911 13.5952C9.97141 14.5102 8.52359 14.997 6.99734 14.997C3.14062 14.9969 0 11.8562 0 8C0 4.14375 3.14062 1.00312 6.99687 1.00312C9.15781 1.00312 11.1844 2.01781 12.5 3.69438V1.5C12.5 0.947187 12.9472 0.5 13.5 0.5C14.0528 0.5 14.5 0.947187 14.5 1.5Z"
                    fill="#A7A9AB"
                  />
                </svg>
                <span className="mx-5 text-sm leading-4 text-[#FFFFFF]">
                  Resume Record
                </span>
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.1875 0.125H1.8125C0.880859 0.125 0.125 0.880859 0.125 1.8125V14.1875C0.125 15.1191 0.880859 15.875 1.8125 15.875H14.1875C15.1191 15.875 15.875 15.1191 15.875 14.1875V1.8125C15.875 0.880859 15.1191 0.125 14.1875 0.125Z"
                    fill="#F75E1D"
                  />
                </svg>
                <span className="mx-5 text-sm leading-4 text-[#FFFFFF]">
                  Stop Record
                </span>
              </>
            )} */}

      {/* section 2 */}
      {/* </div>
        ) : (
          <div
            className="flex items-center px-2.5 py-1 rounded-[3px] mx-0.5 mt-0.5 hover:bg-[#ffffff] hover:bg-opacity-10"
            onClick={() => dispatch(actionCreators.addModal(startRecordModal))}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 4.75C7.35721 4.75 6.72886 4.94061 6.1944 5.29772C5.65994 5.65484 5.24338 6.16242 4.99739 6.75628C4.75141 7.35014 4.68705 8.00361 4.81245 8.63404C4.93785 9.26448 5.24738 9.84358 5.7019 10.2981C6.15642 10.7526 6.73552 11.0622 7.36596 11.1876C7.99639 11.313 8.64986 11.2486 9.24372 11.0026C9.83758 10.7566 10.3452 10.3401 10.7023 9.8056C11.0594 9.27114 11.25 8.64279 11.25 8C11.25 7.13805 10.9076 6.3114 10.2981 5.7019C9.6886 5.09241 8.86195 4.75 8 4.75ZM8 8.75C7.85166 8.75 7.70666 8.70601 7.58332 8.6236C7.45999 8.54119 7.36386 8.42406 7.30709 8.28701C7.25032 8.14997 7.23547 7.99917 7.26441 7.85368C7.29335 7.7082 7.36478 7.57456 7.46967 7.46967C7.57456 7.36478 7.7082 7.29335 7.85368 7.26441C7.99917 7.23547 8.14997 7.25032 8.28701 7.30709C8.42406 7.36386 8.54119 7.45999 8.6236 7.58332C8.70601 7.70666 8.75 7.85166 8.75 8C8.75 8.19891 8.67098 8.38968 8.53033 8.53033C8.38968 8.67098 8.19891 8.75 8 8.75ZM8 0.25C3.71875 0.25 0.25 3.71875 0.25 8C0.25 12.2812 3.71875 15.75 8 15.75C12.2812 15.75 15.75 12.2812 15.75 8C15.75 3.71875 12.2812 0.25 8 0.25ZM8 12C7.20887 12 6.43552 11.7654 5.77772 11.3259C5.11992 10.8864 4.60723 10.2616 4.30448 9.53073C4.00173 8.79983 3.92252 7.99556 4.07686 7.21964C4.2312 6.44371 4.61216 5.73098 5.17157 5.17157C5.73098 4.61216 6.44371 4.2312 7.21964 4.07686C7.99556 3.92252 8.79983 4.00173 9.53073 4.30448C10.2616 4.60723 10.8864 5.11992 11.3259 5.77772C11.7654 6.43552 12 7.20887 12 8C12 9.06087 11.5786 10.0783 10.8284 10.8284C10.0783 11.5786 9.06087 12 8 12Z"
                fill="#A7A9AB"
              />
            </svg>
            <span className="mx-5 text-sm leading-4 text-[#FFFFFF]">
              {t("Meeting.Record")}
            </span>
          </div>
        )
      ) : null} */}

      {/* end of section 2 */}
      {!props.isCall && (
        <div className="flex items-center px-2.5 py-1 rounded-[3px] mx-0.5 mt-0.5 hover:bg-[#ffffff] hover:bg-opacity-10">
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path
              d="M3 6.5H1C0.447812 6.5 0 6.94781 0 7.5V9.5C0 10.0522 0.447812 10.5 1 10.5H3C3.55219 10.5 4 10.0522 4 9.5V7.5C4 6.94781 3.55219 6.5 3 6.5ZM8 6.5H6C5.44781 6.5 5 6.94781 5 7.5V9.5C5 10.0522 5.44781 10.5 6 10.5H8C8.55219 10.5 9 10.0522 9 9.5V7.5C9 6.94781 8.55219 6.5 8 6.5ZM13 6.5H11C10.4478 6.5 10 6.94781 10 7.5V9.5C10 10.0522 10.4478 10.5 11 10.5H13C13.5522 10.5 14 10.0522 14 9.5V7.5C14 6.94781 13.5522 6.5 13 6.5ZM3 0.5H1C0.447812 0.5 0 0.947812 0 1.5V3.5C0 4.05219 0.447812 4.5 1 4.5H3C3.55219 4.5 4 4.05219 4 3.5V1.5C4 0.947812 3.55219 0.5 3 0.5ZM8 0.5H6C5.44781 0.5 5 0.947812 5 1.5V3.5C5 4.05219 5.44781 4.5 6 4.5H8C8.55219 4.5 9 4.05219 9 3.5V1.5C9 0.947812 8.55219 0.5 8 0.5ZM13 0.5H11C10.4478 0.5 10 0.947812 10 1.5V3.5C10 4.05219 10.4478 4.5 11 4.5H13C13.5522 4.5 14 4.05219 14 3.5V1.5C14 0.947812 13.5522 0.5 13 0.5Z"
              fill="#A7A9AB"
            />
          </svg>
          <div className="flex items-center mx-5">
            <div
              id="decreaseTileinSlider"
              onClick={props.decreaseTile}
              className=" h-4 w-4 flex justify-center items-center"
            >
              <svg width="8" height="3" viewBox="0 0 8 3" fill="none">
                <path
                  d="M7 0.75H1C0.723906 0.75 0.5 0.973906 0.5 1.25V1.75C0.5 2.02609 0.723906 2.25 1 2.25H7C7.27609 2.25 7.5 2.02609 7.5 1.75V1.25C7.5 0.973906 7.27609 0.75 7 0.75Z"
                  fill="#A7A9AB"
                />
                Decrease
              </svg>
            </div>
            <span className=" w-9 text-sm text-center leading-4 px-2.5 bg-[#ffffff] bg-opacity-10 mx-2 text-[#FFFFFF]">
              {maxTileinSlider}
            </span>
            <div
              id="increaseTileinSlider"
              onClick={props.increaseTile}
              className="h-4 w-4 flex justify-center items-center"
            >
              <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                <path
                  d="M1 2.75H3.25V0.5C3.25 0.223906 3.47391 0 3.75 0H4.25C4.52609 0 4.75 0.223906 4.75 0.5V2.75H7C7.27609 2.75 7.5 2.97391 7.5 3.25V3.75C7.5 4.02609 7.27609 4.25 7 4.25H4.75V6.5C4.75 6.77609 4.52609 7 4.25 7H3.75C3.47391 7 3.25 6.77609 3.25 6.5V4.25H1C0.723906 4.25 0.5 4.02609 0.5 3.75V3.25C0.5 2.97391 0.723906 2.75 1 2.75Z"
                  fill="#A7A9AB"
                />
                Increase
              </svg>
            </div>
          </div>
        </div>
      )}

      <AudioVideoDropdown />
      {!props.isCall && (
        <div
          id="dialModal"
          className="flex items-center px-2.5 py-1 rounded-[3px] mx-0.5 mt-0.5 hover:bg-[#ffffff] hover:bg-opacity-10"
          onClick={() => dispatch(actionCreators.setDialModal(true))}
        >
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.475 15.875C1.1 15.875 0.78125 15.7438 0.51875 15.4813C0.25625 15.2188 0.125 14.9 0.125 14.525V1.475C0.125 1.1 0.25625 0.78125 0.51875 0.51875C0.78125 0.25625 1.1 0.125 1.475 0.125H8.525C8.9 0.125 9.21875 0.25625 9.48125 0.51875C9.74375 0.78125 9.875 1.1 9.875 1.475V14.525C9.875 14.9 9.74375 15.2188 9.48125 15.4813C9.21875 15.7438 8.9 15.875 8.525 15.875H1.475ZM5 14.2062C5.1875 14.2062 5.34375 14.1405 5.46875 14.009C5.59375 13.878 5.65625 13.7188 5.65625 13.5312C5.65625 13.3562 5.59375 13.203 5.46875 13.0715C5.34375 12.9405 5.1875 12.875 5 12.875C4.8125 12.875 4.65625 12.9405 4.53125 13.0715C4.40625 13.203 4.34375 13.3562 4.34375 13.5312C4.34375 13.7188 4.40625 13.878 4.53125 14.009C4.65625 14.1405 4.8125 14.2062 5 14.2062ZM1.25 11.2062H8.75V3.3125H1.25V11.2062Z"
              fill="#A7A9AB"
            />
          </svg>
          <span className="mx-5 text-sm leading-4 text-[#FFFFFF]">
            {t("Meeting.ConnectByPhone")}
          </span>
        </div>
      )}

      {/* <div className='flex items-center px-2.5 py-1 rounded-[3px] mx-0.5 mt-0.5 hover:bg-[#ffffff] hover:bg-opacity-10'>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M15.2313 9.86644L13.9 9.09769C14.0344 8.37269 14.0344 7.62894 13.9 6.90394L15.2313 6.13519C15.3844 6.04769 15.4531 5.86644 15.4031 5.69769C15.0563 4.58519 14.4656 3.57894 13.6938 2.74144C13.575 2.61331 13.3813 2.58206 13.2313 2.66956L11.9 3.43831C11.3406 2.95706 10.6969 2.58519 10 2.34144V0.80706C10 0.63206 9.87813 0.478936 9.70625 0.441436C8.55938 0.185186 7.38438 0.197686 6.29376 0.441436C6.12188 0.478936 6.00001 0.63206 6.00001 0.80706V2.34456C5.30626 2.59144 4.66251 2.96331 4.1 3.44144L2.77188 2.67269C2.61875 2.58519 2.42813 2.61331 2.30938 2.74456C1.53751 3.57894 0.94688 4.58519 0.600005 5.70081C0.54688 5.86956 0.618755 6.05081 0.77188 6.13831L2.10313 6.90706C1.96876 7.63206 1.96876 8.37581 2.10313 9.10081L0.77188 9.86956C0.618755 9.95706 0.550005 10.1383 0.600005 10.3071C0.94688 11.4196 1.53751 12.4258 2.30938 13.2633C2.42813 13.3914 2.62188 13.4227 2.77188 13.3352L4.10313 12.5664C4.66251 13.0477 5.30626 13.4196 6.00313 13.6633V15.2008C6.00313 15.3758 6.12501 15.5289 6.29688 15.5664C7.44376 15.8227 8.61876 15.8102 9.70938 15.5664C9.88126 15.5289 10.0031 15.3758 10.0031 15.2008V13.6633C10.6969 13.4164 11.3406 13.0446 11.9031 12.5664L13.2344 13.3352C13.3875 13.4227 13.5781 13.3946 13.6969 13.2633C14.4688 12.4289 15.0594 11.4227 15.4063 10.3071C15.4531 10.1352 15.3844 9.95394 15.2313 9.86644ZM8.00001 10.5008C6.62188 10.5008 5.50001 9.37894 5.50001 8.00081C5.50001 6.62269 6.62188 5.50081 8.00001 5.50081C9.37813 5.50081 10.5 6.62269 10.5 8.00081C10.5 9.37894 9.37813 10.5008 8.00001 10.5008Z" fill="#A7A9AB" />
        </svg>
        <span className='mx-5 text-sm leading-4 text-[#FFFFFF]'>Settings</span>
      </div> */}
      <div className=" mx-[2px] px-2.5 pt-2 text-sm leading-4 text-[#FFFFFF]">{`Build Number: ${packages.buildNumber}`}</div>
    </motion.div>
  )
}

export default memo(MoreOptions)
