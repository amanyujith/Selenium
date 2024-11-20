import { FlagActionType, MainActionType } from "../action-types";

export const setMembersList = (status: boolean) => {
    return {
        type: FlagActionType.SET_MEMBERSLIST,
        payload: status
    }
}

// export const setAudio = (audio: boolean) => {
//     return {
//         type: FlagActionType.SET_AUDIO,
//         audio
//     }
// }

// export const setVideo = (video: boolean) => {
//     return {
//         type: FlagActionType.SET_VIDEO,
//         video
//     }
// }

export const setPublisherState = (state: boolean) => {
    return {
        type: FlagActionType.SET_PUBLISHERSTATE,
        state
    }
}

export const setLoginState = (state: boolean) => {
    return {
        type: FlagActionType.LOGIN_STATE,
        state
    }
}

export const createMeetingState = (state: boolean) => {
    return {
        type: FlagActionType.CREATE_MEETING,
        state
    }
}

export const setPrivateChatState = (state: boolean) => {
    return {
        type: FlagActionType.SET_PRIVATECHAT,
        state
    }
}

//screen share full screen
export const setFullScreen = (state: boolean) => {
    return {
        type: FlagActionType.SET_FULLSCREEN,
        state
    }
}

//control pop up list
export const setPopUp = (state: 'meetingInfoFlag' | 'endButtonFlag' | 'moreOptionFlag' | 'reactionFlag' | 'filterMenuFlag' | 'meetingOpenFlag' | 'viewFlag' | 'profilerOpenFlag' | 'calenderFlag' | 'calenderFlag1' | 'calenderFlag2' | 'calenderFlag3' | 'newChat' | 'searchDropDown' | 'sharePopup' | 'closeAll') => {
    return {
        type: FlagActionType.SET_POPUP,
        state
    }
}
//To check user is host or not
export const setIsHost = (state: boolean) => {
    return {
        type: FlagActionType.SET_ISHOST,
        state
    }
}
//Host end meeting for all
export const setHostEndForAll = (state: boolean) => {
    return {
        type: FlagActionType.HOST_END_FOR_ALL,
        state,
    }
}

//Host mute participant mic
export const setHostMuteAudio = (state: boolean) => {
    return {
        type: FlagActionType.HOST_MUTED_MIC,
        state,
    }
}
//Host turned off Participant camera
export const setHostTurnedOffVideo = (state: boolean) => {
    return {
        type: FlagActionType.HOST_TURNED_OFF_CAMERA,
        state,
    }
}
//Host kicked out participant.
export const setHostKickout = (state: boolean) => {
    return {
        type: FlagActionType.HOST_KICKOUT,
        state,
    }
}

//Locked Meeting
export const setLockMeeting = (state: boolean) => {
    return {
        type: FlagActionType.LOCKED_MEETING,
        state
    }
}

//clear store - flags
export const clearMeetingFlags = () => {
    return {
        type: FlagActionType.CLEAR_MEETING_FLAGS,
    }
}
//set participant name on tile - flags
export const setIdleState = (state: boolean) => {
    return {
        type: FlagActionType.IDLESTATE,
        state,
    }
}

//Set Groupchat state
export const setGroupChat = (data: boolean) => {
    return {
        type: FlagActionType.SET_GROUPCHAT_STATE,
        data,
    }
}
export const setPageVisibilityState = (data: boolean) => {
    return {
        type: FlagActionType.SET_PAGE_VISIBILITY_STATE,
        data,
    }
}
export const setInviteModal = (data: boolean) => {
    return {
        type: FlagActionType.SET_INVITE_MODAL_STATE,
        data,
    }
}
export const setDialModal = (data: boolean) => {
    return {
        type: FlagActionType.SET_DIAL_MODAL,
        data,
    }
}
export const setWhiteBoardModal = (data: boolean) => {
    return {
        type: FlagActionType.SET_WHITEBOARD_MODAL,
        data,
    }
}

export const setScreensharePause = (data: boolean) => {
    return {
        type: FlagActionType.SET_SCREENSHARE_PAUSE,
        data,
    };
};
//Set Edit ScheduleMeet Flag
export const setEditScheduleMeet = (data: boolean) => {
    return {
        type: FlagActionType.SET_EDIT_SCHEDULEDMEET,
        data
    }
}
export const setFileDownload = (data: boolean) => {
    return {
        type: FlagActionType.SET_FILE_DOWNLOAD,
        data,
    }
}

// Set All Recurrence ScheduleMeet Flag

export const setAllRecurrenceScheduleMeet = (data: boolean) => {
    return {
        type: FlagActionType.SET_ALL_RECURRENCES_SCHEDULEDMEET,
        data,
    }
}
export const setFileNavigate = (data: boolean) => {
    return {
        type: FlagActionType.SET_FILE_NAVIGATE,
        data,
    }
}


// Set Single Recurrence ScheduleMeet Flag

export const setSingleRecurrenceScheduleMeet = (data: boolean) => {
    return {
        type: FlagActionType.SET_SINGLE_RECURRENCES_SCHEDULEDMEET,
        data,
    }
}

export const setEditSingleMeet = (data: boolean) => {
    return {
        type: FlagActionType.SET_EDIT_SINGLE_MEET,
        data,
    }
}

export const setEditSingleRecMeet = (data: boolean) => {
    return {
        type: FlagActionType.SET_EDIT_SINGLE_REC_MEET,
        data,
    }
}
export const setFlagEditMeetingTime = (data: boolean) => {

    return {
        type: FlagActionType.FLAG_EDIT_MEETING_TIME,
        data
    }
}

export const setOnReady = (data: boolean) => {

    return {
        type: FlagActionType.SET_ON_READY,
        data
    }
}

//log rocket temporary set up
export const setLogrocketState = (data: boolean) => {
    return {
        type: FlagActionType.SET_LOGROCKET_STATE,
        data
    }
}

//new websocket state
export const setWhiteBoardSocket = (state: boolean) => {
    return {
        type: FlagActionType.SET_WHITEBOARD_SOCKET,
        state,
    }
}

export const setProgress = (data: boolean) => {
    return {
        type: FlagActionType.SET_PROGRESS,
        data
    }
}
export const setRecording = (data: boolean) => {
    return {
        type: FlagActionType.SET_RECORDING,
        data
    }
}
export const setPauseRecording = (data: boolean) => {
    return {
        type: FlagActionType.SET_PAUSE_RECORDING,
        data
    }
}

export const setUserInviteModal = (data: boolean) => {
    return {
        type: FlagActionType.SET_USER_INVITE_MODAL,
        data
    }
}




// //set new meeting state
// export const setNewMeetingFlag = (state: boolean) => {
//     
//     return {
//         type: FlagActionType.NEW_MEETING_FLAG,
//         state
//     }
// }

