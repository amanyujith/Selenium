import { MainActionType } from "../action-types";

export const meetingID = (id: number) => {
    return {
        type: MainActionType.SET_MEETING_ID,
        id
    }
}

export const setMeetingInfo = (data: object) => {
    return {
        type: MainActionType.SET_MEETING_INFO,
        data
    }
}

export const setMeetingSession = (data: any) => {
    return {
        type: MainActionType.SET_MEETING_SESSION,
        data
    }
}

export const setParticipant = (data: any) => {
    return {
        type: MainActionType.SET_PARTICIPANT,
        data
    }
}

export const setRoomState = (state: string) => {
    return {
        type: MainActionType.SET_ROOMSTATE,
        state
    }
}

export const removeParticipant = (data: any) => {
    return {
        type: MainActionType.REMOVE_PARTICIPANT,
        data
    }
}

//To update participant Data
export const UpdateParticipantList = (data: any) => {
    
    return {
        type: MainActionType.UPDATE_PARTICIPANT_LIST,
        data
    }
}

//set maximum tile in a slider.
export const SetMaxTileinSlider = (tiles: any) => {
    return {
        type: MainActionType.SET_MAX_TILEINSLIDER,
        tiles
    }
}

//Add meeting notification
export const addNotification = (data: any) => {
    return {
        type: MainActionType.ADD_NOTIFICATION,
        data
    }
}

//Remove notification from meeting page
export const removeNotification = (id?: any) => {
    return {
        type: MainActionType.REMOVE_NOTIFICATION,
        id
    }
}


// //Add home page notifications
// export const addHomeNotification = (data: any) => {
//     return {
//         type: MainActionType.ADD_HOME_NOTIFICATION,
//         data
//     }
// }

// //To remove notifcation from Home page.
// export const removeHomeNotification = (id: number) => {
//     return {
//         type: MainActionType.REMOVE_HOME_NOTIFICATION,
//         id
//     }
// }

//Add group chat message
export const addGroupChat = (data: any) => {
    return {
        type: MainActionType.ADD_GROUPCHAT,
        data
    }
}
//Add privateChat
export const addPrivateChat = (data: any) => {
    return {
        type: MainActionType.ADD_PRIVATECHAT,
        data
    }
}

//Set current private chat participant id
export const setPrivateChatParticipant = (id: number, name: string) => {
    return {
        type: MainActionType.SET_PRIVATECHAT_PARTICIPANT,
        id,
        name
    }
}

//set audio and video device list
export const setDeviceList = (list: any) => {
    return {
        type: MainActionType.DEVICE_LIST,
        list
    }
}
//set selected device
export const setCurrentDevices = (list: any) => {
    return {
        type: MainActionType.CURRENT_DEVICE,
        list
    }
}
//Add reactions
export const addReactions = (data: any) => {
    return {
        type: MainActionType.ADD_REACTIONS,
        data
    }
}

// Remove first reaction
export const removeReaction = () => {
    return {
        type: MainActionType.REMOVE_REACTIONS,
    }
}

//To set host name
export const setHostName = (id: number, name: string) => {
    return {
        type: MainActionType.SET_HOSTNAME,
        id,
        name
    }
}

export const setUnReadPrivateChat = (data: any) => {
    return {
        type: MainActionType.SET_UNREAD_PRIVATECHAT,
        data
    }
}

export const setUnReadGroupChat = () => {
    return {
        type: MainActionType.SET_UNREAD_GROUPCHAT,
    }
}

//Meeting Timer
export const setTimer = (timeInSec: number, timertype : string) => {
    return {
        type: MainActionType.SET_MEETING_TIMER,
        timeInSec,
        timertype
    }
}

//Modal 
export const addModal = (data: any) => {
    return {
        type: MainActionType.ADD_MODAL,
        data
    }
}

export const removeModal = (data: any) => {
    return {
        type: MainActionType.REMOVE_MODAL,
        data
    }
}

//TO ADD PARTICIPANTS TO WAITING LIST
export const setWaitingList = (data: any) => {
    return {
        type: MainActionType.ADD_TO_WAITING_LIST,
        data
    }
}
//To remove a participant from waiting list
export const removeFromWaitingList = (data: any) => {
    return {
        type: MainActionType.REMOVE_FROM_WAITING_LIST,
        data
    }
}

//To remove all participants from waiting list.
export const clearWaitingList = () => {
    return {
        type: MainActionType.CLEAR_WAITING_LIST,
    }
}

//To clear participant list
export const clearParticipantList = () => {
    return {
        type: MainActionType.CLEAR_PARTICIPANT_LIST,
    }
}

//To store meeting URL
export const setMeetingInvite = (data: any) => {
    return {
        type: MainActionType.SET_MEETING_INVITE,
        data
    }
}

//To pause remote participants video
export const pauseVideo = (data: any) => {
    return {
        type: MainActionType.PAUSE_VIDEO,
        data
    }
}

//set video state change of participants
// export const setParticipantVideoChange = () => {
//     return {
//         type: MainActionType.PARTICIPANT_VIDEO_STATE,
//     }
// }

//Set meeting timer ref
export const setMeetingTimerRef = (data: any) => {
    return {
        type: MainActionType.MEETING_TIMER_REF,
        data
    }
}

//CLEAR MEETING REDUX STORE VALUES
export const clearMeetingStore = () => {
    return {
        type: MainActionType.CLEAR_MEETING_STORE,
    }
}

//Video quality status
export const setVideoQuality = (data: any) => {
    return {
        type: MainActionType.VIDEO_QUALITY,
        data
    }
}

export const setMeetingEnviornemnt = (data: any) => {
    return {
        type: MainActionType.SET_MEETING_ENVIORNEMNT,
        data
    }
}

//set logged in user info
export const setLoggedInUserInfo = (data: any) => {
    return {
        type: MainActionType.SET_LOGGEDIN_USER_INFO,
        data
    }
}

export const setParticipantListFlags = (data: any) => {
    return {
        type: MainActionType.SET_PARTICIPANT_LIST_FLAGS,
        data,
    }
}

export const setMeetingList = (meetingList: any, update: boolean) => {
    return {
        type: MainActionType.SET_MEETING_LIST,
        meetingList,
        update
    }
}

// Set meeting type for schedule

export const setMeetingType = (data: string) => {
    return {
        type: MainActionType.SET_MEETING_TYPE,
        data
    }
}
export const setSpeakingState = (data: any) => {
    return {
        type: MainActionType.SET_SPEAKING_STATE,
        data
    }
}

//set rightside panel tab
export const setTab = (data: any) => {
    return {
        type: MainActionType.SET_TAB,
        data,
    }
}

//set Scheduled_Meeting Id
export const setScheduledMeetingInfo = (data: any) => {
    return {
        type: MainActionType.SET_SCHEDULED_MEETING_DETAILS,
        data
    }
}
//SET KEYCLOAK TOKEN
export const setKeycloakToken = (data: any) => {
    return {
        type: MainActionType.SET_KEYCLOAK_TOKEN,
        data
    }
}

//Select screenshare
export const selectScreenshare = (index: any) => {
    return {
        type: MainActionType.SELECT_SCREENSHARE,
        index
    }
}

export const updateWaitingList = (data: any) => {
    return {
        type: MainActionType.UPDATE_WAITING_LIST,
        data
    }
}

//white board transfer data
export const addWhiteBoardData = (data: any) => {
    return {
        type: MainActionType.ADD_WHITEBOARD_DATA,
        data
    }
}

//CLEAR     whiteBoard Data
export const clearWhiteBoardData = () => {
    return {
        type: MainActionType.CLEAR_WHITEBOARD_DATA
    }
}

//set whiteboard state
export const setWhiteBoardState = (data: any) => {
    return {
        type: MainActionType.SET_WHITEBOARD_STATE,
        data
    }
}

//set active chat screen
export const setActiveChat = (data: any) => {
    return {
        type: MainActionType.ACTIVE_CHAT,
        data
    }
}
//set HAND RAISE
export const setHandRaise = (data: any) => {
    return {
        type: MainActionType.SET_HANDRAISE,
        data,
    };
};
//set PARTICIPATN ID TO HOST CONTROLS
export const setHostControlId = (data: any) => {
    return {
        type: MainActionType.SET_HOSTCONTROL_ID,
        data,
    };
};
export const setSelectedDate = (data: any) => {

    return {
        type: MainActionType.SET_SELECTED_DATE,
        data
    }
}
export const setKeycloackLoggedInState = (data: any) => {
    return {
        type: MainActionType.KEYCLOAK_LOGGEDIN_STATE,
        data
    }
}
//set FileShare Modal state
export const setFileShareModalState = (data: any) => {
    return {
        type: MainActionType.SET_FILESHARE_MODAL_STATE,
        data
    }
}
//set FileShare state
export const setFileShareState = (data: any) => {
    return {
        type: MainActionType.SET_FILESHARE_STATE,
        data
    }
}

//set Screen share pause participant id
export const setScreensharePauseListener = (data: any) => {
    return {
        type: MainActionType.SET_SCREENSHARE_PAUSE_LISTENER,
        data
    }
}
//set Screen share pause participant id for host
export const setScreensharePausePublisher = (data: any) => {
    return {
        type: MainActionType.SET_SCREENSHARE_PAUSE_PUBLISHER,
        data
    }
}

//switch sharelist
export const switchShareList = (data: any) => {
    return {
        type: MainActionType.SWITCH_SHARELIST,
        data
    }
}
export const setMediaStream = (stream: MediaStream , streamType : "video" | "screenshare", id: string) => {
    return {
        type: MainActionType.SET_MEDIA_STREAM,
        stream,
        streamType,
        id
    }
}
//members count
export const setMembersCount = (count: any) => {
    return {
        type: MainActionType.SET_MEMBERS_COUNT,
        count,
    }
}
export const toggleLeftbar = (data: string) => {

    return {
        type: MainActionType.TOGGLE_LEFTBAR,
        data,
    }
}
export const soundAndNotification = (data: any) => {

    return {
        type: MainActionType.SOUND_AND_NOTIFICATION,
        data,
    }
}
export const notificationData = (data: any) => {

    return {
        type: MainActionType.NOTIFICATION_DATA,
        data,
    }
}
export const setBrandingInfo = (data: any) => {
  return {
    type: MainActionType.BRANDING_INFO,
    data,
  };
};
export const setTheme = (data: any) => {
  return {
    type: MainActionType.SET_THEME,
    data,
  };
};
export const setThemePalette = (data: any) => {
  return {
    type: MainActionType.SET_THEME_PALETTE,
    data,
  };
};
export const setCallPopup = (data: boolean) => {
    return {
        type: MainActionType.SET_CALL_POPUP,
        data,
    }
}
export const enableMouseHover = (data: boolean) => {
    return {
        type: MainActionType.ENABLE_MOUSE_HOVER,
        data
    }
}
export const permissionSettings = (data: any) => {
    return {
        type: MainActionType.PERMISSION_SETTINGS,
        data
    }
}
export const setAuthentication = (data: any) => {
  return {
    type: MainActionType.AUTHENCATION_DATA,
    data: data,
  };
};
export const setTenant = (data: any) => {
  return {
    type: MainActionType.TENANT_DATA,
    data: data,
  };
};
export const clearLoginSession = (data: boolean) => {
  return {
    type: MainActionType.CLEAR_LOGIN_SESSION,
    data: data,
  };
};