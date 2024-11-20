/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Tldraw } from '@tldraw/tldraw'
import { useMultiplayerState } from './useMultiplayerState'
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators } from '../../../../store';
import { useEffect } from 'react';


export function Multiplayer() {
  const meetingInfo = useSelector((state: any) => state.Main.meetingInfo);
  const environmentLevel = useSelector((state: any) => state.Main.environmentLevel);
  let roomId = '';
  if (environmentLevel === 'production' || environmentLevel === "codetest") {
    roomId = meetingInfo.meetingId.toString() + 'p'
  }
  else
    roomId = meetingInfo.meetingId.toString()

  return (
    <Editor roomId={roomId} />
  )
}

function Editor({ roomId }: { roomId: string }) {

  const whiteBoardState = useSelector((state: any) => state.Main.whiteBoardState)
  const participantID = useSelector((state: any) => state.Main.selfParticipantID)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const participantList = useSelector((state: any) => state.Main.participantList)
  const membersCount = useSelector((state: any) => state.Main.membersCount)
  const { error, ...events } = useMultiplayerState(roomId)
  const dispatch = useDispatch()
  useEffect(() => {
    
    if (whiteBoardState !== participantID && whiteBoardState !== "" && whiteBoardState !== "unrestricted" && !participantList.some((participant: any) => participant.participant_id === whiteBoardState) && participantList.length === membersCount) {
      
      meetingSession.broadCastMessage({ title: "whiteboard", type: "button", status: "unrestricted" }, "broadcast", "whiteboardButton")
      dispatch(actionCreators.setWhiteBoardState("unrestricted"))
    }
  }, [participantList.length])

  if (error) return <div>Error: {error.message}</div>

  const handleWhiteBoard = (status: any) => {
    
    meetingSession.broadCastMessage({ title: "whiteboard", type: "button", status: status }, "broadcast", "whiteboardButton")
    dispatch(actionCreators.setWhiteBoardState(status))
  }

  return (
    <div className=" fixed top-[51px] left-0 w-full h-[calc(100vh-110px)]">
      {
        whiteBoardState === participantID || whiteBoardState === "unrestricted" ?
          <svg
            id='close-button'
            onClick={() => {
              (whiteBoardState === participantID || !participantList.some((participant: any) =>
                participant.participant_id === whiteBoardState) ||
                whiteBoardState === "") &&
                handleWhiteBoard(whiteBoardState !== "" ? "" : participantID)
            }}
            className=' absolute top-[11px] right-[11px] z-[3] cursor-pointer ' width="17" height="17" viewBox="0 0 12 12" fill="none">
            <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#A7A9AB" />
            close button
          </svg>
          :
          null
      }

      <Tldraw
        showPages={false}
        {...events}
        disableAssets={true}
      />
    </div>
  )
}
