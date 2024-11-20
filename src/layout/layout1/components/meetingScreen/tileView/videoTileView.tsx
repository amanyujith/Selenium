import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import VideoOverlay from "./videoOverlay";
import { detect } from "detect-browser";
import ScreenLoader from "../../../../../atom/ScreenLoader/screenLoader";

const VideoTileView = (props: any) => {
  // 
  const browser = detect();
  const { participant, index, screenShareView, isCall } = props;
  const user = useSelector((state: any) => state.Main.meetingSession);
 // const [isCall, setIscall] = useState(false);
  const [videoSrc, setVideoSrc] = useState<MediaStream | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //     
  // }, [idleState])

  // const participantList = useSelector((state: any) => state.Main.participantList)
  // const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
  // let selfTile = useMemo(() =>
  //     participantList[selfTileIndex].participant_id === participant.participant_id
  //     , [])

  // useEffect(() => {
  //     
  // }, [hideOverlay])

  useEffect(() => {
    const videoStream = document.getElementById(
      `video${participant.participant_id}`
    ) as HTMLVideoElement;

    if (participant.video && videoStream?.srcObject === null) {
      user.streamBind(
        "video",
        participant.participant_id,
        `video${participant.participant_id}`
      );
      
    } 
  }, []);

  const getVideoStream =  () => {
    const data =   user.getStream([participant.participant_id], "video")

    
    if(data && data.length > 1) {
      setVideoSrc(data[0].stream);   

    }

  };


  useLayoutEffect(() => {
    
    
    if (videoSrc && videoRef.current) {
      videoRef.current.srcObject = videoSrc;
      videoRef.current.addEventListener("loadedmetadata", () => {
        if (videoRef.current) {
          
          

          videoRef.current.play();
        }
      });
    }
  }, [videoSrc, videoRef.current]);

  useEffect(() => {

participant.videoStream && setVideoSrc(participant.videoStream);



  },[participant.videoStream])

  


  return (
    <>
      <VideoOverlay index={index} hideName={screenShareView ? true : false} />

      {isCall ? (
        videoSrc?.active ? (
          <video
            ref={videoRef}
            muted
            className={
              participant.isPublisher && browser?.name !== "safari"
                ? `w-full h-full mirrorEffect`
                : `w-full h-full`
            }
            id={`video${participant.participant_id}`}
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <svg
              className="animate-spin"
              width="50"
              height="50"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M21.896 11C21.896 17.0177 17.0177 21.896 11 21.896C4.9823 21.896 0.104004 17.0177 0.104004 11C0.104004 4.9823 4.9823 0.104004 11 0.104004C17.0177 0.104004 21.896 4.9823 21.896 11ZM2.29842 11C2.29842 15.8057 6.19424 19.7016 11 19.7016C15.8057 19.7016 19.7016 15.8057 19.7016 11C19.7016 6.19424 15.8057 2.29842 11 2.29842C6.19424 2.29842 2.29842 6.19424 2.29842 11Z"
                fill="url(#paint0_linear_2993_206634)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2993_206634"
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
          </div>
        )
      ) : (
        <video
          className={
            participant.isPublisher && browser?.name !== "safari"
              ? `w-full h-full mirrorEffect`
              : `w-full h-full`
          }
          id={`video${participant.participant_id}`}
          autoPlay
        />
      )}
    </>
  )
};

export default VideoTileView;
