import React, { useEffect, useRef, useState } from "react"
import DropDown from "../../../../atom/DropDown/dropDown"
// import { t } from 'i18next'
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import ladyRing from "../dashboard/Chat/audio/incoming-call/Lady Ring.mp3"
import CustomDropdown from "../../../../atom/DropDown/customDropdown"
import { actionCreators } from "../../../../store"
import { detect } from "detect-browser"

const AudioVideoSettings = (props : any) => {
  const currentDevice = useSelector((state: any) => state.Main.currentDevice)
  const deviceList = useSelector((state: any) => state.Main.deviceList)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [videoStatus, setVideoStatus] = useState(false)
  const previewElement = document.getElementById(
    "videoPreview"
  ) as HTMLVideoElement
  const videoStreamRef = useRef<MediaStream | null>(null)
  const [mediaRecorderStream, setMediaRecorderStream] = useState<any>(null)
  const [audioStatus, setAudioStatus] = useState("record")
  const [audioRecordState, setAudioRecordState] = useState("record")
  const [speaker, setSpeaker] = useState("testspeaker")
  const { t } = useTranslation()
  var audio: any = document.getElementById("myAudio")
  const audioStreamRef = useRef<MediaStream | null>(null)
  const [permissions, setPermissions] = useState({
    camera: "",
    microphone: "",
    speaker: "",
  })
  const user = useSelector((state: any) => state.Main.meetingSession)
  const dispatch = useDispatch()
  const browser = detect()
  const isMounted = useRef(false);
  const getPermissions = async () => {
    try {
      const cameraPermission = await navigator.permissions
        .query({
          name: "camera" as PermissionName,
        })
        .then((res: any) =>
          setPermissions((prevPermissions) => ({
            ...prevPermissions,
            camera: res.state,
          }))
        )
      const microphonePermission = await navigator.permissions
        .query({
          name: "microphone" as PermissionName,
        })
        .then((res: any) =>
          setPermissions((prevPermissions) => ({
            ...prevPermissions,
            microphone: res.state,
          }))
        )
      const speakerPermission = await navigator.permissions
        .query({
          name: "speaker" as PermissionName,
        })
        .then((res: any) =>
          setPermissions((prevPermissions) => ({
            ...prevPermissions,
            speaker: res.state,
          }))
        )
    } catch (error) {
      return `not supported`
    }
  }

  useEffect(() => {
    isMounted.current = true;
    getPermissions()
    // navigator?.mediaDevices
    //   ?.getUserMedia({ audio: true, video: true })
    //   .then((res) => {
    //   meetingSession.closeStream(res);
    //     if (res.active)
    //       user.listAvailableDevices().then((device: any) => {
    //         dispatch(actionCreators.setDeviceList(device))
    //         getPermissions()
    //         // const devices = device.filter((dev: any) => dev.type === "videoinput")
    //         //    if(devices.length === 1)
    //         //     dispatch(actionCreators.setCurrentDevices({
    //         //         audioInput: "unchanged",
    //         //         audioOutput: "unchanged",
    //         //         videoInput : devices?.[0]?.id
    //         //      }))
    //       })
    //   })
    return () => {
      isMounted.current = false
      
    }
  }, [])

  const handleChangeDevice = (value: string, type: string) => {
    meetingSession.switchDevices(
      value,
      type,
      type === "audioOutput" ? "mixedAudio" : undefined
    )
  }

  const [value, setValue] = useState({
    camera: [],
    microphone: [],
    speaker: [],
  })

  useEffect(() => {
    const video = deviceList
      ?.filter((device: any) => device.type === "videoinput")
      .map((Device: any) => {
        return {
          name: Device.device,
          value: Device.id,
          select: currentDevice.videoInput === Device.id ? true : false,
        }
      })
    const microPhone = deviceList
      ?.filter((device: any) => device.type === "audioinput")
      .map((Device: any) => {
        return {
          name: Device.device,
          value: Device.id,
          select: currentDevice.audioInput === Device.id ? true : false,
        }
      })
    const speaker = deviceList
      ?.filter((device: any) => device.type === "audiooutput")
      .map((Device: any) => {
        return {
          name: Device.device,
          value: Device.id,
          select: currentDevice.audioOutput === Device.id ? true : false,
        }
      })
    setValue({
      camera: video,
      microphone: microPhone,
      speaker: speaker,
    })
  }, [deviceList, currentDevice])

  useEffect(() => {
    if (currentDevice.videoInput && !videoStatus && previewElement !== null) {
      videoPreview(false)
    } else if (videoStatus && currentDevice.videoInput) {
      videoPreview(true)
    }
  }, [videoStatus, currentDevice.videoInput])

  useEffect(() => {
    videoStreamRef.current = videoStream
    setVideoStatus(true)

    return () => {
      const currentVideoStream = videoStreamRef.current

      if (currentVideoStream) {
        meetingSession.closeStream(currentVideoStream)
      }
    }
  }, [videoStream])

  useEffect(() => {
    return () => {
      if (audioStream) meetingSession?.closeStream(audioStream)
      if (audioStreamRef.current) {
        meetingSession?.closeStream(audioStreamRef.current)
      }
    }
  }, [audioStream])

  useEffect(() => {
    if (currentDevice.audioInput && !audioStatus && audioStream) {
      audioPreview(false)
      handleAudioRecord("stop")
    } else if (audioStatus && currentDevice.audioInput) {
      audioPreview(true)
    }
  }, [currentDevice.audioInput, audioStatus])

  // useEffect(() => {
  //   return () => {
  //     meetingSession.closeStream(videoStream)
  //     setVideoStream(null)
  //   };
  // }, [])

  const videoPreview = async (state: boolean) => {
    if (state) {
      await meetingSession
        .generateStream("video", {
          deviceId: currentDevice?.videoInput,
          aspectRatio: 1.7777777,
        })
        .then(async (stream: any) => {
          console.log(!isMounted.current, isMounted, "Streamcheck.1111");
          if(!isMounted.current){
            console.log(stream, 'Streamcheck')
            meetingSession.closeStream(stream);
            return
          }
          const previewElement = document.getElementById(
            "videoPreview"
          ) as HTMLVideoElement
          previewElement.srcObject = stream
          setVideoStream(stream)
        })
        .catch((error: any) => {})
    } else {
      meetingSession.closeStream(videoStream)
    }
  }
  const audioPreview = async (state: boolean) => {
    console.log(state, 'audioPrevieww')
    if (state) {
      await meetingSession
        .generateStream("audio", { deviceId: currentDevice?.audioInput })
        .then(async (stream: any) => {
          if (!isMounted.current) {
                 console.log(stream, "Streamcheck");
                 meetingSession.closeStream(stream);
                 return;
          }
          setAudioStream(stream)
        })
        .catch((error: any) => {})
    } else {
      await meetingSession.closeStream(audioStream)
      setAudioStream(null)
      //
    }
  }
  const handleAudioRecord = async (state: any) => {
    if (state === "stop") {
      setAudioStatus("playing")
      mediaRecorderStream.stop()
    } else if (state === "record") {
      setAudioStatus("stop")
      await meetingSession
        .generateStream("audio", { deviceId: currentDevice?.audioInput })
        .then(async (stream: any) => {
          handleMediaRecorder(stream)
        })
        .catch((error: any) => {})
    }
  }
  const audioPlayer: any = document.getElementById("AudioPlayer")

  const handleMediaRecorder = (stream: any) => {
    const recordedStream: any = []
    const options = { mimeType: "audio/webm" }
    let mediaRecorder: any = new MediaRecorder(stream, options)

    mediaRecorder.addEventListener("dataavailable", (event: any) => {
      if (event.data.size > 0) recordedStream.push(event.data)
    })

    mediaRecorder.addEventListener("stop", () => {
      const audioLink = URL.createObjectURL(new Blob(recordedStream))
      audioPlayer.src = audioLink
      audioPlayer.play()
      audioPlayer.addEventListener(
        "ended",
        () => {
          setAudioRecordState("record")
          setAudioStatus("record")
          setMediaRecorderStream(null)
          meetingSession.closeStream(stream)
        },
        false
      )
      setAudioRecordState("playing")
    })
    mediaRecorder.start()
    setMediaRecorderStream(mediaRecorder)
    setTimeout(() => {
      if (mediaRecorder.state !== "inactive") {
        setAudioStatus("playing")
        mediaRecorder.stop()
      }
    }, 5000)
    setAudioRecordState("stop")
  }

  return (
    <div className="text-left p-[24px] mt-[24px] w-[580px] min-h-[400px] h-[calc(100vh-316px)] overflow-y-auto overflow-x-hidden">
      <audio id="myAudio" src={ladyRing}></audio>
      <span className=" text-base  leading-[23px] font-bold text-primary-200">
        {t("Meeting.AudioVideo")}
      </span>
      <div className="flex flex-col">
        <div className="flex justify-between flex-col mt-2">
          <span className="my-2.5 text-base leading-[19px] text-primary-200 flex justify-between">
            {browser?.name === "safari" ? t("Audio") : t("Meeting.Microphone")}
            {permissions.microphone === "granted" && (
              <>
                {audioStatus === "record" ? (
                  <div
                    className="text-[16px] text-[#1C64D8]   cursor-pointer"
                    onClick={() =>
                      audioStatus === "record" && handleAudioRecord("record")
                    }
                  >
                    {t("Meeting.Record")}
                  </div>
                ) : audioStatus === "stop" ? (
                  <div
                    className="text-[16px] text-[#1C64D8]  cursor-pointer"
                    onClick={() => handleAudioRecord("stop")}
                  >
                    {t("Meeting.Stop")}
                  </div>
                ) : (
                  <div
                    className="text-[16px] text-[#1C64D8] cursor-pointer"
                    onClick={() => handleAudioRecord("stop")}
                  >
                    {t("Meeting.Playing")}
                  </div>
                )}
              </>
            )}
          </span>

          {/* <DropDown
              restClass={" w-[27.8rem] h-[2rem] mt-2.5"}
              options={value.microphone}
              onChange={(event: any) =>
                handleChangeDevice(event.target.value, "audioInput")
              }
            >
              {""}
            </DropDown> */}
          <CustomDropdown
            options={value.microphone}
            value={
              permissions.microphone != "granted"
                ? { name: "No Permissions" }
                : value.microphone.filter(
                    (device: any) => device.select === true
                  )?.[0]
            }
            rest={"h-[44px] min-w-[450px] border-[#B1B1B1] text-[#B1B1B1]"}
            onChange={(event: any) => handleChangeDevice(event, "audioInput")}
          />
        </div>
      </div>
      <div className="flex flex-col">
        {browser?.name !== "safari" && (
          <div className="flex justify-between flex-col">
            <span className="mt-4 mb-2 text-[16px] leading-[19px] text-primary-200 flex justify-between">
              {t("Dial.Speaker")}
              {permissions.microphone === "granted" && (
                <>
                  {" "}
                  {speaker === "playing" ? (
                    <div className="text-[16px] text-[#1C64D8]   cursor-pointer">
                      {t("Meeting.Playing")}
                    </div>
                  ) : speaker === "stop" ? (
                    <div
                      className="text-[16px] text-[#1C64D8]  cursor-pointer"
                      onClick={() => {
                        if (audio) {
                          audio.pause()
                        }

                        setSpeaker("testspeaker")
                      }}
                    >
                      {t("Meeting.Stop")}
                    </div>
                  ) : (
                    <div
                      className="text-[16px] text-[#1C64D8] flex justify-end  cursor-pointer"
                      onClick={() => {
                        audio.play()
                        setTimeout(() => {
                          if (audio.src !== "") {
                            audio.pause()
                            setSpeaker("testspeaker")
                          }
                        }, 5000)
                        setSpeaker("stop")
                      }}
                    >
                      {t("Meeting.TestSpeaker")}
                    </div>
                  )}
                </>
              )}
            </span>
            {/* <DropDown
              restClass={" h-[2rem] mt-2.5"}
              options={value.speaker}
              onChange={(event: any) =>
                handleChangeDevice(event.target.value, "audioOutput")
              }
            >
              {""}
            </DropDown> */}
            <CustomDropdown
              options={value.speaker}
              value={
                permissions.microphone != "granted"
                  ? { name: "No Permissions" }
                  : value.speaker.filter(
                      (device: any) => device.select === true
                    )?.[0]
              }
              rest={"h-[44px] min-w-[450px] border-[#B1B1B1] text-[#B1B1B1]"}
              onChange={(event: any) =>
                handleChangeDevice(event, "audioOutput")
              }
            />
          </div>
        )}
        <div className="flex justify-between flex-col  ">
          <span className="mt-4 text-[16px] leading-[19px] text-primary-200">
            {t("Meeting.Camera")}
          </span>
          <div className="flex flex-col">
            {/* <DropDown
                restClass={" w-[27.8rem] h-[2rem] mt-2.5"}
                options={value.camera}
                onChange={(event: any) =>
                  handleChangeDevice(event.target.value, "videoInput")
                }
              >
                {""}
              </DropDown> */}
            <CustomDropdown
              options={value.camera}
              value={
                permissions.camera != "granted"
                  ? { name: "No Permissions" }
                  : value.camera.filter(
                      (device: any) => device.select === true
                    )?.[0]
              }
              rest={"h-[44px] min-w-[450px] border-[#B1B1B1] text-[#B1B1B1]"}
              onChange={(event: any) => handleChangeDevice(event, "videoInput")}
            />
            <audio style={{ display: "none" }} id="AudioPlayer"></audio>
            <div className=" w-[530px] h-[248px] overflow-hidden rounded-[3px] mt-[10px] text-[#ffffff] flex justify-center items-center">
              {videoStatus ? (
                <video
                  className=" w-full h-full object-cover"
                  id="videoPreview"
                  autoPlay
                />
              ) : (
                <div className=" w-full h-full rounded-[3px] text-[#ffffff] flex justify-center items-center bg-primary-500">
                  {t("Meeting.YourVideoIsOff")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioVideoSettings
