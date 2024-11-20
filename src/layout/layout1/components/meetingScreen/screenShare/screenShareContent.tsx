import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators } from '../../../../../store';
import { fullScreenState } from '../../../../../utils';
import arrayManipulationUtil from '../../../../../utils/arrayManipulation';
import { t } from 'i18next';

const ScreenShareContent = (props: any) => {

  const [pauseScreen, setPauseScreen] = useState(false);
  // const [publisherPauseHandle, setPublisherPauseHandle] = useState(false)
  const { setMaximizeView, maximizeView, isCall } = props;
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.Main.meetingSession)
  const fullScreen = useSelector((state: any) => state.Flag.fullScreen)
  const membersList = useSelector((state: any) => state.Flag.membersList)
  const popUp = useSelector((state: any) => state.Flag.popUp)
  const screenShare = useSelector((state: any) => state.Main.screenShare);
  // const screensharePause = useSelector((state: any) => state.Flag.ScreensharePause)
  const screensharePauseListener = useSelector((state: any) => state.Main.screensharePauseListener)
  // const screensharePausePublisher = useSelector((state: any) => state.Main.screensharePausePublisher)
  // const participantID = useSelector((state: any) => state.Main.selfParticipantID)
  const shareList = useSelector((state: any) => state.Main.shareList)
  const participantID = useSelector((state: any) => state.Main.selfParticipantID)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )

  const themePalette = useSelector((state: any) => state.Main.themePalette)


  

  const [screenSource, setScreenSource] = useState<MediaStream | undefined>( undefined)
  const videoRef = useRef<HTMLVideoElement>(null);
  const speakingList = useSelector((state: any) => state.Main.speakingList)
  const [speaker, setSpeaker] = useState<any>()

  // const [presenter, setPresenter] = useState(screenShare[0].participant_id);
  // const [view, setView] = useState(false)

  // useEffect(() => {
  //   const latestPresenter = screenShare[0].participant_id;
  //   if (latestPresenter !== screenShare[0].participant_id) {
  //     selectPresenter(latestPresenter)
  //   }
  // }, [screenShare.length])
  // useEffect(() => {
  //   

  // if (
  //   screensharePauseListener?.content?.participant_id != participantID
  // ) {
  //   setPauseScreen(screensharePauseListener.content?.pause)
  // }
  // }, [screensharePauseListener, screenShare])

  // useEffect(() => {
  // const index = state.screenShare?.findIndex(
  //   (participant: any) =>
  //     participant?.participant_id === participantId
  // )

  // const index = screenShare.findIndex((participant : any) => {
  //  participant?.participant_id ===  screensharePauseListener?.content?.participant_id
  // })

  // }, [])

      useEffect(() => {
        const currentspeaker = speakingList
          .filter((speaker: any) => speaker.state === true)
          .map((speaker: any) =>
            participantList.find(
              (speaking: any) =>
                speaker.participant_id === speaking.participant_id
            )
          )

        // if(speakingList.length > 0){
        setSpeaker(currentspeaker?.[currentspeaker.length - 1])
        // }
      }, [speakingList, participantList])


  useEffect(() => {
    const screenShareStream = document.getElementById(`screenshare${screenShare[0].participant_id}`) as HTMLVideoElement


    if (screenShareStream?.srcObject === null && !isCall) {
      user.streamBind('screenshare', screenShare[0].participant_id, `screenshare${screenShare[0].participant_id}`)
    } else if(isCall) {
      // const ssSource = user.getStream(screenShare[0].participant_id, "screenshare")
      // 
      // setScreenSource(ssSource[0].stream)
      
    }
  }, [])


  useEffect(() => {
    

    if (screenSource && videoRef.current) {
      videoRef.current.srcObject = screenSource;
      
      videoRef.current.addEventListener("loadedmetadata", () => {
        if (videoRef.current) {
          
       

          videoRef.current.play();
        }
      });
    }
  },[videoRef.current, screenSource])


  useEffect(() => {
    if(isCall && screenShare[0]) {

      
      setScreenSource(screenShare[0].screenshareStream)
    } 
  }, [participantList])

  useEffect(() => {
    if(isCall && screenShare[0]) {

      
      setScreenSource(screenShare[0].screenshareStream)
    } 
    const tileStreamId = "screenshare" + screenShare[0].participant_id;
    user.streamBind('screenshare', screenShare[0].participant_id, tileStreamId)
  }, [screenShare])

  useEffect(() =>{
    if(isCall && screenShare[0]) {
      
      setScreenSource(screenShare[0].screenshareStream)
    } 
  },[participantList])


  const selectPresenter = (index: number) => {
    // setPresenter(currentPresenter)
    // arrayManipulationUtil.sort(screenShare, index, 0)
    dispatch(actionCreators.selectScreenshare(index))
    // const tileStreamId = "screenshare" + screenShare[index];
    // user.streamBind('screenshare', screenShare[index], tileStreamId)
  }

  // const selectScreenshareMode = (mode: string) => {
  //   if (mode === 'FullScreen') {
  //     dispatch(actionCreators.setFullScreen(true))
  //     fullScreenState(true)
  //     if (membersList)
  //       dispatch(actionCreators.setMembersList(false));
  //   } else {
  //     dispatch(actionCreators.setFullScreen(false))
  //     fullScreenState(false)
  //   }

  // }


  const handleFullScreen = (value: boolean) => {
    if (value) {
      dispatch(actionCreators.setFullScreen(true))
      fullScreenState(value)
    } else {
      dispatch(actionCreators.setFullScreen(false))
      fullScreenState(value)
    }
    if (membersList)
      dispatch(actionCreators.setMembersList(false));
    dispatch(actionCreators.setPopUp('closeAll'));

  }

  const closeMembersTab = () => {
    if (membersList)
      dispatch(actionCreators.setMembersList(false));
  }

  const handlePopUp = (event: any, type: 'meetingInfoFlag' | 'endButtonFlag' | 'moreOptionFlag' | 'reactionFlag' | 'filterMenuFlag' | 'viewFlag' | 'newChat' | 'closeAll') => {
    event.stopPropagation();
    dispatch(actionCreators.setPopUp(type));
  }

  const handleMaximizeView = () => {
    setMaximizeView(!maximizeView);
    dispatch(actionCreators.setPopUp('closeAll'));
  }

  const switchToWhiteboard = () =>{
    dispatch(actionCreators.switchShareList("whiteboard"))
    meetingSession.syncBroadcastMessage()
  }



  return (
    <div
      className={
        fullScreen
          ? `w-screen h-screen absolute top-0 left-0 justify-center flex items-center z-[1] bg-primary  ${
              isCall && `bg-[${themePalette?.primary}]`
            }`
          : ""
      }
      style={{ backgroundColor: isCall ? themePalette?.primary : "" }}
    >
      <div className=" flex absolute items-center z-10 top-3.5 left-2/4 -translate-x-1/2 text-[#ffffff]">
        {fullScreen ? (
          <div className="flex flex-row  px-7 absolute right-[100%] ">
            {speaker ? (
              <>
                <div
                  className=" w-7 h-7 rounded-r-[33.333px] rounded-tl-[33.333px] text-[#ffffff]  bg-gradient from-[#1D1D1D] to-[#404041] animate-pulse border-2  miniswitch"
                  style={{
                    border: `2px solid ${themePalette?.bgSecondary}`,
                    color: themePalette?.bgSecondary,
                  }}
                >
                  {speaker?.profile_picture &&
                  speaker?.profile_picture != "undefined" ? (
                    <img
                      src={speaker?.profile_picture}
                      className={
                        "h-6 w-6 rounded-r-[33.333px] rounded-tl-[33.333px] animate-pulse "
                      }
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-r-[33.333px] rounded-tl-[33.333px]  bg-gradient-to-b from-[#1D1D1D] to-[#404041] animate-pulse">
                      <p className={`${isCall ? "ml-[6px]" : ""}`}>
                        {speaker?.name.charAt(0).toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
                <p className=" animate-pulse mt-1 text-secondary mr-6 ml-1 font-roboto truncate text-sm">
                  {speaker?.name} is talking
                </p>
              </>
            ) : (
              ""
            )}
          </div>
        ) : null}
        <div className="max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
          <span>{t("ScreenSharedBy")}</span>
          {screenShare.length > 1 ? (
            <select
              className={` bg-primary outline-none  ${
                isCall && `bg-[${themePalette?.primary}]`
              }`}
              onChange={(e) => selectPresenter(+e.target.value)}
              value={screenShare[0].participant_id}
              style={{ backgroundColor: isCall ? themePalette?.primary : "" }}
            >
              {screenShare?.map((option: any, index: number) => {
                return (
                  <option
                    key={option.participant_id}
                    value={index}
                  >{`${option.name}`}</option>
                )
              })}
            </select>
          ) : (
            <span>{screenShare[0].name}</span>
          )}
        </div>
        <div className="relative">
          <span
            onClick={(e) => handlePopUp(e, "viewFlag")}
            className=" ml-8 w-fit h-fit cursor-pointer block "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              {/* <mask
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="25"
                height="24"
              >
                <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_7227_88534)"> */}
                <path
                  d="M12.5 20C11.95 20 11.4793 19.8043 11.088 19.413C10.696 19.021 10.5 18.55 10.5 18C10.5 17.45 10.696 16.979 11.088 16.587C11.4793 16.1957 11.95 16 12.5 16C13.05 16 13.521 16.1957 13.913 16.587C14.3043 16.979 14.5 17.45 14.5 18C14.5 18.55 14.3043 19.021 13.913 19.413C13.521 19.8043 13.05 20 12.5 20ZM12.5 14C11.95 14 11.4793 13.804 11.088 13.412C10.696 13.0207 10.5 12.55 10.5 12C10.5 11.45 10.696 10.979 11.088 10.587C11.4793 10.1957 11.95 10 12.5 10C13.05 10 13.521 10.1957 13.913 10.587C14.3043 10.979 14.5 11.45 14.5 12C14.5 12.55 14.3043 13.0207 13.913 13.412C13.521 13.804 13.05 14 12.5 14ZM12.5 8C11.95 8 11.4793 7.804 11.088 7.412C10.696 7.02067 10.5 6.55 10.5 6C10.5 5.45 10.696 4.97933 11.088 4.588C11.4793 4.196 11.95 4 12.5 4C13.05 4 13.521 4.196 13.913 4.588C14.3043 4.97933 14.5 5.45 14.5 6C14.5 6.55 14.3043 7.02067 13.913 7.412C13.521 7.804 13.05 8 12.5 8Z"
                  fill="#A7A9AB"
                />
              {/* </g> */}
            </svg>
          </span>
          {popUp.viewFlag ? (
            <div
              className={` absolute w-36 right-0 mt-2 flex flex-col cursor-pointer text-left bg-primary-500  ${
                isCall && `bg-[${themePalette?.primary500}]`
              }`}
              style={{ backgroundColor: isCall ? themePalette?.primary500 : ''}}
            >
              {!fullScreen ? (
                <span
                  onClick={() => handleMaximizeView()}
                  className="py-1 pl-5 hover:bg-[#ffffff] hover:bg-opacity-10"
                >
                  {maximizeView
                    ? t("Meeting.ShowVideoTile")
                    : t("Meeting.HideVideoTile")}
                </span>
              ) : null}
              <span
                onClick={() => handleFullScreen(!fullScreen ? true : false)}
                className="py-1 pl-5 hover:bg-[#ffffff] hover:bg-opacity-10"
              >
                {!fullScreen
                  ? t("Meeting.FullScreen")
                  : t("Meeting.ExitFullScreen")}
              </span>
            </div>
          ) : null}
        </div>
        {shareList.includes("whiteboard") && (
          <div className=" ml-2.5 cursor-pointer">
            <svg
              onClick={() => switchToWhiteboard()}
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
            >
              <mask
                maskUnits="userSpaceOnUse"
                x="0"
                y="3"
                width="25"
                height="24"
              >
                <rect x="0.5" y="3" width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_8201_89605)">
                <path
                  d="M14.5 24C14.2167 24 13.9793 23.904 13.788 23.712C13.596 23.5207 13.5 23.2833 13.5 23C13.5 22.7167 13.596 22.4793 13.788 22.288C13.9793 22.096 14.2167 22 14.5 22C15.2833 22 15.979 21.846 16.587 21.538C17.1957 21.2293 17.5 20.8833 17.5 20.5C17.5 20.2667 17.3917 20.05 17.175 19.85C16.9583 19.65 16.6583 19.4667 16.275 19.3L17.75 17.825C18.2833 18.1417 18.7083 18.5167 19.025 18.95C19.3417 19.3833 19.5 19.9 19.5 20.5C19.5 21.6 18.975 22.4583 17.925 23.075C16.875 23.6917 15.7333 24 14.5 24ZM5.075 16.35C4.59167 16.0667 4.20833 15.7373 3.925 15.362C3.64167 14.9873 3.5 14.5333 3.5 14C3.5 13.3 3.75833 12.7123 4.275 12.237C4.79167 11.7623 5.71667 11.2333 7.05 10.65C8.1 10.1667 8.77067 9.829 9.062 9.637C9.354 9.44567 9.5 9.23333 9.5 9C9.5 8.73333 9.33733 8.5 9.012 8.3C8.68733 8.1 8.18333 8 7.5 8C7.08333 8 6.73333 8.05 6.45 8.15C6.16667 8.25 5.90833 8.41667 5.675 8.65C5.49167 8.83333 5.26667 8.94167 5 8.975C4.73333 9.00833 4.49167 8.93333 4.275 8.75C4.05833 8.58333 3.93333 8.36667 3.9 8.1C3.86667 7.83333 3.94167 7.59167 4.125 7.375C4.44167 6.99167 4.896 6.66667 5.488 6.4C6.07933 6.13333 6.75 6 7.5 6C8.7 6 9.66667 6.27067 10.4 6.812C11.1333 7.354 11.5 8.08333 11.5 9C11.5 9.65 11.2583 10.2333 10.775 10.75C10.2917 11.2667 9.31667 11.8417 7.85 12.475C6.88333 12.8917 6.25 13.2 5.95 13.4C5.65 13.6 5.5 13.8 5.5 14C5.5 14.15 5.59567 14.296 5.787 14.438C5.979 14.5793 6.24167 14.7167 6.575 14.85L5.075 16.35ZM19.35 13.4L15.1 9.15L16.15 8.1C16.55 7.7 17.029 7.5 17.587 7.5C18.1457 7.5 18.6167 7.7 19 8.1L20.4 9.5C20.8 9.88333 21 10.354 21 10.912C21 11.4707 20.8 11.95 20.4 12.35L19.35 13.4ZM4.5 24V19.75L13.7 10.55L17.95 14.8L8.75 24H4.5Z"
                  fill="#A7A9AB"
                />
              </g>
              <circle cx="23" cy="4" r="4" fill="#F75E1D" />
              <circle
                cx="23"
                cy="4"
                r="3.5"
                stroke="#1C1616"
                strokeOpacity="0.9"
              />
              <rect
                x="0.6"
                y="3.1"
                width="23.8"
                height="23.8"
                rx="1.9"
                stroke="white"
                stroke-width="0.2"
              />
            </svg>
          </div>
        )}
      </div>

      <div
        className={
          fullScreen
            ? "w-screen h-[calc(100vw*0.5625)] flex justify-center items-center max-h-screen relative"
            : `relative w-screen h-[calc((100vw)*0.5625)] flex justify-center items-center ${
                maximizeView
                  ? membersList
                    ? "max-h-[calc(100vh-115px)] "
                    : "max-h-[calc(100vh-54px)] "
                  : "max-h-[calc(100vh-164px)] "
              } `
        }
        // max-w-[calc((100vh-115px)*1.777777778)]
      >
        {/* <div
          className=' w-32 h-8 absolute z-10 flex justify-between right-1 top-1 items-center px-2 py-1 text-[#ffffff] bg-[rgba(28,22,22,0.9)]'
          onClick={() => handleFullScreen(!fullScreen ? true : false)}
        >
          {!fullScreen ?
            (<>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M0 5.28571V0.857143C0 0.382143 0.382143 0 0.857143 0H5.28571C5.52143 0 5.71429 0.192857 5.71429 0.428571V1.85714C5.71429 2.09286 5.52143 2.28571 5.28571 2.28571H2.28571V5.28571C2.28571 5.52143 2.09286 5.71429 1.85714 5.71429H0.428571C0.192857 5.71429 0 5.52143 0 5.28571ZM10.2857 0.428571V1.85714C10.2857 2.09286 10.4786 2.28571 10.7143 2.28571H13.7143V5.28571C13.7143 5.52143 13.9071 5.71429 14.1429 5.71429H15.5714C15.8071 5.71429 16 5.52143 16 5.28571V0.857143C16 0.382143 15.6179 0 15.1429 0H10.7143C10.4786 0 10.2857 0.192857 10.2857 0.428571ZM15.5714 10.2857H14.1429C13.9071 10.2857 13.7143 10.4786 13.7143 10.7143V13.7143H10.7143C10.4786 13.7143 10.2857 13.9071 10.2857 14.1429V15.5714C10.2857 15.8071 10.4786 16 10.7143 16H15.1429C15.6179 16 16 15.6179 16 15.1429V10.7143C16 10.4786 15.8071 10.2857 15.5714 10.2857ZM5.71429 15.5714V14.1429C5.71429 13.9071 5.52143 13.7143 5.28571 13.7143H2.28571V10.7143C2.28571 10.4786 2.09286 10.2857 1.85714 10.2857H0.428571C0.192857 10.2857 0 10.4786 0 10.7143V15.1429C0 15.6179 0.382143 16 0.857143 16H5.28571C5.52143 16 5.71429 15.8071 5.71429 15.5714Z" fill="#ffffff" />
              </svg>
              <span>Full Screen</span>
            </>)
            :
            (<>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M0 14.1429H3.85714V18H6.42857V11.5714H0V14.1429ZM3.85714 3.85714H0V6.42857H6.42857V0H3.85714V3.85714ZM11.5714 18H14.1429V14.1429H18V11.5714H11.5714V18ZM14.1429 3.85714V0H11.5714V6.42857H18V3.85714H14.1429Z" fill="#A7A9AB" />
              </svg>
              <span>Exit Screen</span>

            </>)
          }
        </div> */}
        {screensharePauseListener.includes(screenShare[0].participant_id) ? (
          <div
            className={`absolute z-[1] flex flex-col w-screen h-screen max-h-[calc(100%-4px)] max-w-full object-contain bg-[#404040] ${
              !fullScreen
                ? !maximizeView
                  ? "cursor-zoom-in"
                  : "cursor-zoom-out"
                : "cursor-default"
            } justify-center items-center `}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30.2703 31.433L26.1857 27.3484H1.07803V25.0985H23.9126L22.4126 23.5985H5.46264C4.70494 23.5985 4.06359 23.336 3.53859 22.811C3.01359 22.286 2.75109 21.6446 2.75109 20.887V5.17164C2.75109 5.00817 2.79436 4.86152 2.88091 4.73169C2.96746 4.60189 3.07805 4.49852 3.21268 4.42157L0.570312 1.73308L2.15105 0.152344L31.8511 29.8523L30.2703 31.433ZM14.0588 15.2532L12.1001 13.2716C11.9367 13.4966 11.8088 13.7629 11.7165 14.0706C11.6242 14.3783 11.578 14.7177 11.578 15.0889V18.0889H13.828V15.8735C13.828 15.7388 13.8472 15.6235 13.8857 15.5273C13.9241 15.4311 13.9818 15.3398 14.0588 15.2532ZM29.6183 23.3446L20.3501 14.0764L22.3087 12.0889L18.703 8.48319V10.9639H17.2376L8.87229 2.59858H28.5395C29.2972 2.59858 29.9385 2.86108 30.4635 3.38608C30.9885 3.91108 31.251 4.55242 31.251 5.31009V20.887C31.251 21.4216 31.1082 21.9086 30.8227 22.348C30.5371 22.7874 30.1356 23.1196 29.6183 23.3446Z"
                fill="#A7A9AB"
              />
            </svg>
            <div className="text-[#C4C4C4] text-[16px] mt-2 h-[19px]">
              {t("Meeting.ScreenSharePausedBy")} {`${screenShare[0].name}`}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {/* {
          isCall ?  <video
          ref={videoRef}
          onClick={() => {
            fullScreen ? closeMembersTab() : handleMaximizeView()
          }}
          className={`relative w-fit h-fit max-h-[calc(100%-4px)] max-w-full object-contain ${!fullScreen
            ? !maximizeView
              ? "cursor-zoom-in"
              : "cursor-zoom-out"
            : "cursor-default"
            } `}
          id={"screenshare" + screenShare[0].participant_id}
          autoPlay
          muted
        /> :  */}

        {isCall ? (
          <video
            ref={videoRef}
            onClick={() => {
              fullScreen ? closeMembersTab() : handleMaximizeView()
            }}
            className={`relative w-fit h-full max-h-[calc(100%-4px)] max-w-full object-contain ${
              !fullScreen
                ? !maximizeView
                  ? "cursor-zoom-in"
                  : "cursor-zoom-out"
                : "cursor-default"
            } `}
            id={"screenshare" + screenShare[0].participant_id}
            autoPlay
            muted
          />
        ) : (
          <video
            onClick={() => {
              fullScreen ? closeMembersTab() : handleMaximizeView()
            }}
            className={`relative w-fit xl-screen h-fit max-h-[calc(100%-4px)] max-w-full object-contain ${
              !fullScreen
                ? !maximizeView
                  ? "cursor-zoom-in"
                  : "cursor-zoom-out"
                : "cursor-default"
            } `}
            id={"screenshare" + screenShare[0].participant_id}
            autoPlay
          />
        )}
        {/* } */}
        {/* <video
          onClick={() => {
            fullScreen ? closeMembersTab() : handleMaximizeView()
          }}
          className={`relative w-fit h-fit max-h-[calc(100%-4px)] max-w-full object-contain ${
            !fullScreen
              ? !maximizeView
                ? "cursor-zoom-in"
                : "cursor-zoom-out"
              : "cursor-default"
          } `}
          id={"screenshare" + screenShare[0].participant_id}
          autoPlay
        /> */}
      </div>
    </div>
  )
}

export default memo(ScreenShareContent)