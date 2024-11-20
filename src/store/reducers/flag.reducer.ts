import { FlagActionType } from "../action-types";
import { FlagAction } from '../actions';

interface FlagRepoState {
    membersList: boolean
    idleState: boolean
    // meetingAudio: boolean,
    // meetingVideo: boolean,
    publisherState: boolean
    loginState: boolean
    createMeeting: boolean,
    privateChatState: boolean,
    fullScreen: boolean,
    popUp: any,
    isHost: boolean,
    hostEndForAll: boolean,
    hostMutedMic: boolean,
    hostTurnedOffCam: boolean,
    hostkickOut: boolean,
    lockedMeetingState: boolean,
    newMeetingState: boolean,
    PageVisibilityState: boolean,
    InviteModal: boolean,
    DialModal: boolean,
    whiteBoardModal: boolean,
    ScreensharePause: boolean,
    groupChatState: boolean,
    setEditScheduleState: boolean,
    setAllRecurrenceScheduleState: boolean,
    setSingleRecurrenceScheduleState: boolean,
    setEditSingleMeet: boolean,
    setEditSingleRecMeet: boolean,
    setFlagEditMeetingTime: boolean

    setFileDownload: boolean;
    setFileNavigate: boolean;
    onReady: boolean;
    logRocketState: boolean;
    whiteboardSocketState: boolean;
    setProgress: boolean;
    recording: boolean;
    pauseRecording: boolean;
    userInviteModal : boolean;
}

const initialState = {
    membersList: false,
    // meetingAudio: false,
    // meetingVideo: false,
    publisherState: false,
    loginState: false,
    createMeeting: false,
    privateChatState: false,
    fullScreen: false,
    idleState: false,
    popUp: {
        meetingInfoFlag: false,
        endButtonFlag: false,
        moreOptionFlag: false,
        reactionFlag: false,
        filterMenuFlag: false,
        viewFlag: false,
        calenderFlag: false,
        calenderFlag1: false,
        calenderFlag2: false,
        calenderFlag3: false,
        newChat: false,
        searchDropDown: false
    },
    isHost: false,
    hostEndForAll: false,
    hostMutedMic: false,
    hostTurnedOffCam: false,
    hostkickOut: false,
    lockedMeetingState: false,
    newMeetingState: false,
    groupChatState: false,
    InviteModal: false,
    DialModal: false,
    PageVisibilityState: true,
    ScreensharePause: false,
    setEditScheduleState: false,
    setAllRecurrenceScheduleState: false,
    setSingleRecurrenceScheduleState: false,
    setEditSingleMeet: false,
    setEditSingleRecMeet: false,
    setFlagEditMeetingTime: false,
    whiteBoardModal: false,
    setFileDownload: false,
    setFileNavigate: false,
    onReady: false,
    logRocketState: false,
    whiteboardSocketState: false,
    setProgress: false,
    recording: false,
    pauseRecording: false,
    userInviteModal : false
}

const FlagReducer = (
    state: FlagRepoState = initialState,
    action: FlagAction
): FlagRepoState => {
    switch (action.type) {
        case FlagActionType.SET_MEMBERSLIST:
            return {
                ...state,
                membersList: action.payload
            };
        // case FlagActionType.SET_AUDIO:
        //     return {
        //         ...state,
        //         meetingAudio: action.audio
        //     }
        // case FlagActionType.SET_VIDEO:
        //     return {
        //         ...state,
        //         meetingVideo: action.video
        //     }
        case FlagActionType.SET_PUBLISHERSTATE:
            return {
                ...state,
                publisherState: action.state
            }
        case FlagActionType.LOGIN_STATE:
            return {
                ...state,
                loginState: action.state
            }
        case FlagActionType.CREATE_MEETING:
            return {
                ...state,
                createMeeting: action.state
            }
        case FlagActionType.SET_PRIVATECHAT:
            return {
                ...state,
                privateChatState: action.state
            }
        case FlagActionType.SET_FULLSCREEN:
            return {
                ...state,
                fullScreen: action.state
            }
        case FlagActionType.SET_POPUP:
            const previousPopUpFlags = {
                meetingInfoFlag: false,
                endButtonFlag: false,
                moreOptionFlag: false,
                reactionFlag: false,
                profilerOpenFlag: false,
                meetingOpenFlag: false,
                filterMenuFlag: false,
                viewFlag: false,
                calenderFlag: false,
                calenderFlag1: false,
                calenderFlag2: false,
                calenderFlag3: false,
                newChat: false,
                searchDropDown: false,
                sharePopup: false
            }
            // 


            if (action.state !== 'closeAll') {
                previousPopUpFlags[action.state] = !state.popUp[action.state];
                return {
                    ...state,
                    popUp: previousPopUpFlags
                }
            }
            else if (Object.values(state.popUp).includes(true)) {
                return {
                    ...state,
                    popUp: previousPopUpFlags
                }
            }
            else {
                return {
                    ...state,
                }
            }
        case FlagActionType.SET_ISHOST:
            return {
                ...state,
                isHost: action.state
            }
        case FlagActionType.IDLESTATE:
            if (action.state === state.idleState) {
                return {
                    ...state,
                }
            } else {
                return {
                    ...state,
                    idleState: action.state
                }
            }

        case FlagActionType.HOST_END_FOR_ALL:
            return {
                ...state,
                hostEndForAll: action.state
            }

        case FlagActionType.HOST_MUTED_MIC:
            return {
                ...state,
                hostMutedMic: action.state
            }
        case FlagActionType.HOST_TURNED_OFF_CAMERA:
            return {
                ...state,
                hostTurnedOffCam: action.state
            }
        case FlagActionType.HOST_KICKOUT:
            return {
                ...state,
                hostkickOut: action.state
            }
        case FlagActionType.LOCKED_MEETING:
            return {
                ...state,
                lockedMeetingState: action.state
            }
        case FlagActionType.SET_GROUPCHAT_STATE: {
            return {
                ...state,
                groupChatState: action.data
            }
        }
        case FlagActionType.SET_PAGE_VISIBILITY_STATE: {
            return {
                ...state,
                PageVisibilityState: action.data
            }
        }
        case FlagActionType.SET_INVITE_MODAL_STATE: {
            return {
                ...state,
                InviteModal: action.data
            }
        }
        case FlagActionType.SET_DIAL_MODAL: {
            return {
                ...state,
                DialModal: action.data
            }
        }
        case FlagActionType.SET_WHITEBOARD_MODAL: {
            return {
                ...state,
                whiteBoardModal: action.data
            }
        }

        case FlagActionType.SET_SCREENSHARE_PAUSE: {
            return {
                ...state,
                ScreensharePause: action.data,
            };
        }
        case FlagActionType.SET_EDIT_SCHEDULEDMEET: {
            return {
                ...state,
                setEditScheduleState: action.data
            }
        }
        case FlagActionType.SET_ALL_RECURRENCES_SCHEDULEDMEET: {
            return {
                ...state,
                setAllRecurrenceScheduleState: action.data
            }
        }

        case FlagActionType.SET_SINGLE_RECURRENCES_SCHEDULEDMEET: {
            return {
                ...state,
                setSingleRecurrenceScheduleState: action.data
            }
        }

        case FlagActionType.SET_EDIT_SINGLE_MEET: {
            
            return {
                ...state,
                setEditSingleMeet: action.data
            }
        }

        case FlagActionType.SET_EDIT_SINGLE_REC_MEET: {
            return {
                ...state,
                setEditSingleRecMeet: action.data
            }
        }
        case FlagActionType.FLAG_EDIT_MEETING_TIME: {
            return {
                ...state,
                setFlagEditMeetingTime: action.data
            }
        }

        case FlagActionType.SET_FILE_DOWNLOAD: {
            return {
                ...state,
                setFileDownload: action.data
            }
        }
        case FlagActionType.SET_FILE_NAVIGATE: {
            return {
                ...state,
                setFileNavigate: action.data
            }
        }

        case FlagActionType.SET_ON_READY: {
            return {
                ...state,
                onReady: action.data
            }
        }

        case FlagActionType.SET_LOGROCKET_STATE: {
            
            return {
                ...state,
                logRocketState: action.data
            }
        }

        case FlagActionType.SET_WHITEBOARD_SOCKET: {
            return {
                ...state,
                whiteboardSocketState: action.state
            }
        }

        case FlagActionType.SET_PROGRESS: {
            return {
                ...state,
                setProgress: action.data
            }
        }
        case FlagActionType.SET_RECORDING: {
            return {
                ...state,
                recording: action.data
            }
        }
        case FlagActionType.SET_PAUSE_RECORDING: {
            return {
                ...state,
                pauseRecording: action.data
            }
        }
        case FlagActionType.SET_USER_INVITE_MODAL: {
            return {
                ...state,
                userInviteModal: action.data
            }
        }



        // case FlagActionType.NEW_MEETING_FLAG:
        //     return {
        //         ...state,
        //         newMeetingState: action.state
        //     }
        case FlagActionType.CLEAR_MEETING_FLAGS:
            return {
                ...state,
                isHost : false,
                membersList: false,
                createMeeting: false,
                privateChatState: false,
                fullScreen: false,
                popUp: {
                    meetingInfoFlag: false,
                    endButtonFlag: false,
                    moreOptionFlag: false,
                    reactionFlag: false,
                    filterMenuFlag: false,
                    viewFlag: false,
                    calenderFlag: false,
                    calenderFlag1: false,
                    calenderFlag2: false,
                    calenderFlag3: false,
                    newChat: false,
                    searchDropDown: false,
                    sharePopup: false
                },
                hostEndForAll: false,
                hostMutedMic: false,
                hostTurnedOffCam: false,
                hostkickOut: false,
                lockedMeetingState: false,
                newMeetingState: false,
                groupChatState: false,
                InviteModal: false,
                DialModal: false,
                ScreensharePause: false,
                whiteBoardModal: false,
                whiteboardSocketState: false,
                recording: false,
                pauseRecording: false,
                publisherState : false
            }



        default:
            return state;
    }
};
export default FlagReducer;
