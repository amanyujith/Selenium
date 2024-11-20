import { t, use } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import path from "../../../../navigation/routes.path";
import { actionCreators } from '../../../../store';
import modalData from '../../../../constructors/modal/modalData';
import { memo } from 'react';
import hoverTimer from '../../../../utils/hoverTimer';

const EndButton = () => {
  // const { stopTimer } = useTimer()
  const meetingSession = useSelector((state: any) => state.Main.meetingSession);
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLeaveMeeting = () => {
    meetingSession.leaveMeetingSession()
    hoverTimer(false, dispatch)
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())
    // dispatch(actionCreators.setTimer("clear"))
    if (isHost) {
      dispatch(actionCreators.setIsHost(false))
    }
    // participantList.map((participant: any) => {
    //   dispatch(actionCreators.removeParticipant(participant.participant_id))
    // })
    // let modal = new modalData({
    // message: "Do you want to leave meeting",
    // type: "meetingInfo",
    // button: [{
    //   icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    //     <path d="M14.1875 0.125H1.8125C0.880859 0.125 0.125 0.880859 0.125 1.8125V14.1875C0.125 15.1191 0.880859 15.875 1.8125 15.875H14.1875C15.1191 15.875 15.875 15.1191 15.875 14.1875V1.8125C15.875 0.880859 15.1191 0.125 14.1875 0.125Z" fill="#F75E1D" />
    //   </svg>, buttonName: "TestButton"
    // }],
    // });
    // dispatch(actionCreators.addModal(modal));
    navigate(path.FEEDBACK);
    // stopTimer();
    // window.location.reload();
  }
  const handleEndForAll = () => {
    meetingSession.hostEndMeeting();
    hoverTimer(false, dispatch)
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())
    // dispatch(actionCreators.setTimer("clear"))
    if (isHost) {
      dispatch(actionCreators.setIsHost(false))
    }
    navigate(path.FEEDBACK);
    // stopTimer();
    // window.location.reload();
  }
  return (
    <div className={`flex flex-col p-[10px] rounded-[3px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#ffffff]`}>
      <button id='leaveButton' onClick={() => handleLeaveMeeting()} className=' border border-solid border-main px-[15px] py-[10px] rounded-[3px]'>
        {t("Meeting.EndForMe")}
      </button>
      {isHost ?
        < button id='endButton' onClick={() => handleEndForAll()} className=' px-[15px] py-[10px] rounded-[3px] text-[#ffffff] bg-[#ED4923] mt-[2px]'>
          {t("Meeting.EndForAll")}
        </button>
        : null
      }
    </div >
  )

}

export default memo(EndButton)