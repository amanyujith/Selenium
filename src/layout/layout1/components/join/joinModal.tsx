import { Link, useNavigate } from "react-router-dom";
import HomeButton from "../../../../atom/HomeButton/homeButton";
import InputFields from '../../../../atom/InputField/inputField';
import path from "../../../../navigation/routes.path";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from "react";
import AudioAnalyser from './audioPreview/audioAnalyser';
import { actionCreators } from "../../../../store";
import LocalDb from "../../../../dbServices/dbServices";
import { t } from "i18next";

const JoinModal = (props: any) => {

    const { handleUserName, handleJoinButton, audio, video, setJoiningLoader, joiningloader, userName, disableButton, handleEmailId, emailError, createState } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    const loginState = useSelector((state: any) => state.Flag.loginState)
    const createMeeting = useSelector((state: any) => state.Flag.createMeeting)
    const currentDevice = useSelector((state: any) => state.Main.currentDevice)
    const meetingSession = useSelector((state: any) => state.Main.meetingSession);
    const isHost = useSelector((state: any) => state.Flag.isHost)
    const logRocketState = useSelector((state: any) => state.Flag.logRocketState);

    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [audioRecordState, setAudioRecordState] = useState("record")
    const [mediaRecorderStream, setMediaRecorderStream] = useState<any>(null)
    const previewElement = document.getElementById("videoPreview") as HTMLVideoElement


    

    // //Component Unmount in functional component : it will trigger when a component unmount.
    // useEffect(() => {
    //     return () => {
    //         videoPreview(false);
    //     }
    // })
    // //End



    // useEffect(() => {
    //     if (currentDevice && previewElement !== null)
    //         videoPreview(false);
    //     if (currentDevice && audioStream)
    //         audioPreview(false)
    //     if (video)
    //         videoPreview(true);
    //     else if (previewElement !== null)
    //         videoPreview(false);
    //     if (audio)
    //         audioPreview(true)
    //     else if (audioStream) {
    //         audioPreview(false)
    //         handleAudioRecord("stop")
    //     }
    // }, [video, currentDevice, audio])

    useEffect(() => {
        if (props?.handleNetworkLost) {
            setJoiningLoader(false)
        }
    }, [props.handleNetworkLost])

    useEffect(() => {
        if ( !video && previewElement !== null) {
            videoPreview(false);
        } else if (video ) {
            videoPreview(true);
        }
    }, [video, currentDevice.videoInput])

    useEffect(() => {
        if ( !audio && audioStream) {
            audioPreview(false)
            handleAudioRecord("stop")
        } else if (audio) {
            audioPreview(true)
        }
    }, [currentDevice.audioInput, audio])

    const handleJoin = () => {
        setJoiningLoader(true)
        props.setNetworkLost(false)
        // LocalDb.set(dbStore, "UserPreferences", "displayName", { name: userName })
        // LocalDb.set(dbStore, "UserPreferences", "audioState", { audio: audio })
        // LocalDb.set(dbStore, "UserPreferences", "videoState", { video: video })

        if (previewElement)
            videoPreview(false);
        handleJoinButton()
    }

    const videoPreview = async (state: boolean) => {
        if (state) {
            await meetingSession.generateStream("video", { deviceId: currentDevice?.videoInput, aspectRatio: 1.7777777, })
                .then(async (stream: any) => {
                    const previewElement = document.getElementById("videoPreview") as HTMLVideoElement
                    previewElement.srcObject = stream
                    setVideoStream(stream)
                })
                .catch((error: any) => {
                    
                })
            // await navigator.mediaDevices.getUserMedia({ audio: false, video: video })
            //     .then(async (stream) => {
            //         const constraints = {
            //             width: { ideal: 1280 },
            //             height: { ideal: 720 },
            //             advanced: [
            //                 { width: 1920, height: 1280 },
            //                 { aspectRatio: 1.7777777 }
            //             ]
            //         };
            //         await stream.getVideoTracks()[0].applyConstraints(constraints);
            //         const previewElement = document.getElementById("videoPreview") as HTMLVideoElement
            //         previewElement.srcObject = stream
            //         setVideoStream(stream)
            //     })
            //     .catch((error) => {
            //         
            //     })
        }
        else {
            meetingSession.closeStream(videoStream)
            // videoStream?.getTracks().forEach(track => {
            //     track.stop();
            // })
        }
    }

    const audioPreview = async (state: boolean) => {
        if (state) {
            await meetingSession.generateStream("audio", { deviceId: currentDevice?.audioInput })
                .then(async (stream: any) => {
                    setAudioStream(stream)
                })
                .catch((error: any) => {
                    
                })
        }
        else {
            meetingSession.closeStream(audioStream)
            setAudioStream(null)
            // 
        }
    }

    const handleKeyPress = (event: any) => {
        if (event.charCode === 13 && !disableButton && !joiningloader) {
            handleJoin()
        }
    }

    const handleEndButton = () => {
        if (previewElement)
            videoPreview(false);
        if (createMeeting) {
            dispatch(actionCreators.createMeetingState(false))
        }
        meetingSession.leaveMeetingSession()
        dispatch(actionCreators.setPublisherState(false))
        dispatch(actionCreators.setRoomState(''))
        dispatch(actionCreators.clearMeetingStore())
        dispatch(actionCreators.clearMeetingFlags())
        dispatch(actionCreators.clearParticipantList())
        if (isHost) {
            dispatch(actionCreators.setIsHost(false))
        }
        if (loginState)
            navigate(path.DASHBOARD)
        else
            navigate(path.HOME)
    }

    const handleMediaRecorder = (stream: any) => {
        const audioPlayer: any = document.getElementById("AudioPlayer");
        const recordedStream: any = [];
        const options = { mimeType: "audio/webm" };
        let mediaRecorder: any = new MediaRecorder(stream, options);

        mediaRecorder.addEventListener("dataavailable", (event: any) => {
            if (event.data.size > 0)
                recordedStream.push(event.data)
        })

        mediaRecorder.addEventListener("stop", () => {
            const audioLink = URL.createObjectURL(new Blob(recordedStream));
            audioPlayer.src = audioLink;
            audioPlayer.play();
            setAudioRecordState("playing")
        })

        audioPlayer.addEventListener("ended", () => {
            setAudioRecordState("record")
            setMediaRecorderStream(null)
            meetingSession.closeStream(stream)
        }, false)
        mediaRecorder.start();
        setMediaRecorderStream(mediaRecorder)
        setAudioRecordState("stop")
    }

    const handleAudioRecord = async (state: any) => {
        if (state === 'stop') {
            mediaRecorderStream.stop()
        }
        else if (state === 'record') {
            await meetingSession.generateStream("audio", { deviceId: currentDevice?.audioInput })
                .then(async (stream: any) => {
                    handleMediaRecorder(stream)
                })
                .catch((error: any) => {
                    
                })
        }
    }
    // 

    //logrocket temporary code
    const handleStartLogRocket = () => {
        dispatch(actionCreators.setLogrocketState(true))
    }

    return (
      <>
        <div
          onClick={() => handleEndButton()}
          className=" cursor-pointer absolute top-3 right-5 border-2 rounded-full p-1 z-10 border-[#F75E1D]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.4727 9.59766L11.5664 15.5039C11.0391 16.0312 10.125 15.6621 10.125 14.9062V11.5312H5.34375C4.87617 11.5312 4.5 11.1551 4.5 10.6875V7.3125C4.5 6.84492 4.87617 6.46875 5.34375 6.46875H10.125V3.09375C10.125 2.34141 11.0355 1.96875 11.5664 2.49609L17.4727 8.40234C17.7996 8.73281 17.7996 9.26719 17.4727 9.59766ZM6.75 15.3281V13.9219C6.75 13.6898 6.56016 13.5 6.32812 13.5H3.375C2.75273 13.5 2.25 12.9973 2.25 12.375V5.625C2.25 5.00273 2.75273 4.5 3.375 4.5H6.32812C6.56016 4.5 6.75 4.31016 6.75 4.07812V2.67188C6.75 2.43984 6.56016 2.25 6.32812 2.25H3.375C1.51172 2.25 0 3.76172 0 5.625V12.375C0 14.2383 1.51172 15.75 3.375 15.75H6.32812C6.56016 15.75 6.75 15.5602 6.75 15.3281Z"
              fill="#F75E1D"
            />
          </svg>
        </div>

        <div className=" w-[330px] h-fit pb-3 absolute left-2/4 top-1/2 -translate-x-2/4 -translate-y-1/2  rounded shadow-[0_1px_4px_0px_rgba(0,0,0,0.25)] flex flex-col items-center z-10  bg-[#ffffff] ">
          <div className=" w-[310px] h-[171px] overflow-hidden rounded-[3px] mt-[10px] text-[#ffffff] flex justify-center items-center">
            {video ? (
              <video
                className=" w-full h-full object-cover"
                id="videoPreview"
                autoPlay
              />
            ) : (
              <div className=" w-[310px] h-[171px] rounded-[3px] text-[#ffffff] flex justify-center items-center bg-primary-500">
                {t("Meeting.YourVideoIsOff")}
              </div>
            )}
          </div>
          <div className=" w-full h-4 px-2.5 mt-1 text-left text-xs leading-[14px] text-[#F75E1D]">
            {audioRecordState === "stop" ? t("Meeting.Recording") : ""}
          </div>

          <div className=" w-full h-[30px] flex items-center justify-between px-2.5">
            <span className=" w-[220px]">
              {audioStream ? <AudioAnalyser audio={audioStream} /> : null}
            </span>
            {audioRecordState === "record" ? (
              <span
                onClick={() => (audio ? handleAudioRecord("record") : null)}
                className={
                  audio
                    ? " text-base leading-[19px] cursor-pointer text-link"
                    : " text-base leading-[19px] cursor-not-allowed text-link"
                }
              >
                {t("Meeting.TestMic")}
              </span>
            ) : audioRecordState === "stop" ? (
              <span
                onClick={() => (audio ? handleAudioRecord("stop") : null)}
                className=" text-base leading-[19px] mr-2.5 cursor-pointer text-link"
              >
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path
                    d="M14.1875 0.625H1.8125C0.880859 0.625 0.125 1.38086 0.125 2.3125V14.6875C0.125 15.6191 0.880859 16.375 1.8125 16.375H14.1875C15.1191 16.375 15.875 15.6191 15.875 14.6875V2.3125C15.875 1.38086 15.1191 0.625 14.1875 0.625Z"
                    fill="#00ADEF"
                  />
                </svg>
              </span>
            ) : (
              <span
                // onClick={() => audio ? handleAudioRecord("stop") : null}
                className=" text-base leading-[19px] mr-2.5 text-link"
              >
                {t("Meeting.Playing")}
              </span>
            )}
            <audio style={{ display: "none" }} id="AudioPlayer"></audio>
          </div>

          <div className=" mt-2 px-[10px] w-full ">
            {/* <div className="flex mt-2 justify-center items-center h-6 text-left mb-1 text-[#ff0000]">
                        {error ? <span className="w-[17px] h-[18px] px-1.5 py-1 flex items-center justify-center mr-2 rounded-sm bg-[rgba(247,94,29,0.12)]">
                            <svg width="2" height="11" viewBox="0 0 2 11" fill="none">
                                <path d="M0.25 6.75V0H1.75V6.75H0.25ZM0.25 10.5V9H1.75V10.5H0.25Z" fill="#F75E1D" />
                            </svg>
                        </span>
                            :
                            null
                        }
                        {error}
                    </div> */}
            <InputFields
              label={t("Meeting.YourDisplayName")}
              name={"username"}
              type={"text"}
              onChange={(event: any) => handleUserName(event.target.value)}
              onKeyPress={(event: any) => handleKeyPress(event)}
              autoFocus={true}
              maxLength={24}
              restClass={" w-full"}
              id="userName"
              value={userName}
            />
            {!loginState ? (
              <InputFields
                label={t("Meeting.EnterEmail")}
                name={"email"}
                restClass={
                  emailError ? "mt-2 w-full outline-[#F65E1D]" : "mt-2 w-full"
                }
                type={"email"}
                id="userEmailID"
                onChange={(event: any) => handleEmailId(event.target.value)}
              />
            ) : null}
            {/* <HomeButton id="LogRocket"
                        disabled={logRocketState ? true : false}
                        handleClick={handleStartLogRocket}
                        color={'primary-200'}
                        restClass={logRocketState ? 'mt-2 w-full bg-opacity-30 cursor-not-allowed flex justify-center items-center' : joiningloader ? `mt-2 w-full border-[1px] border-[#05AF05] cursor-progress flex justify-center items-center` : `mt-2 w-full border-[1px] border-[#05AF05]`}

                    >
                        {logRocketState ? "Logrocket Initalized" : "Start Logrocket"}
                    </HomeButton> */}
            <HomeButton
              id="joinButton"
              disabled={disableButton || joiningloader ? true : false}
              handleClick={handleJoin}
              color={"primary-200"}
              restClass={
                disableButton
                  ? "mt-2 w-full bg-primary-alpha-20 cursor-not-allowed flex justify-center items-center"
                  : joiningloader
                  ? `mt-2 w-full border-[1px] border-[#05AF05] cursor-progress flex justify-center items-center`
                  : `mt-2 w-full border-[1px] border-[#05AF05]`
              }
            >
              {joiningloader ? (
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
              ) : loginState && (createMeeting || createState) ? (
                t("Start")
              ) : (
                t("Join")
              )}
            </HomeButton>
          </div>
        </div>
      </>
    );
}

export default JoinModal