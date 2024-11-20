import { MeetingSessionType } from "hdmeet";
import { memo, useEffect } from "react";
import { useSelector } from "react-redux";

const ChatCallVideoElement = (props: any)=>{

const meetingInstance:MeetingSessionType = useSelector((state: any) => state.Main.meetingSession);

useEffect(() => {

 meetingInstance.streamBind(
   "video",
   props.participant_id,
   `video${props.participant_id}`
 );

}, [(document.getElementById(`video${props.participant_id}`)as any)?.srcObject]);

    return (
      <>
        <video
          className={
            props.isPublisher ? `w-full h-full mirrorEffect` : `w-full h-full`
          }
          id={`video${props.participant_id}`}
          autoPlay
        />
      </>
    );
}
export default memo(ChatCallVideoElement)