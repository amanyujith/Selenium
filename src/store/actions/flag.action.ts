import { FlagActionType } from "../action-types";

interface SetMembersList {
    type: FlagActionType.SET_MEMBERSLIST;
    payload: boolean,
}

// interface SetAudio {
//     type: FlagActionType.SET_AUDIO;
//     audio: boolean,
// }

// interface SetVideo {
//     type: FlagActionType.SET_VIDEO;
//     video: boolean,
// }

interface SetPublisherState {
    type: FlagActionType.SET_PUBLISHERSTATE;
    state: boolean,
}

interface setLoginState {
    type: FlagActionType.LOGIN_STATE;
    state: boolean
}

interface setCreateMeeting {
    type: FlagActionType.CREATE_MEETING;
    state: boolean
}

interface SetPrivateChatState {
    type: FlagActionType.SET_PRIVATECHAT;
    state: boolean
}

interface SetFullScreen {
    type: FlagActionType.SET_FULLSCREEN;
    state: boolean
}

interface SetPopUp {
    action: any;
    type: FlagActionType.SET_POPUP;
    state: 'meetingInfoFlag' | 'endButtonFlag' | 'moreOptionFlag' | 'reactionFlag' | 'filterMenuFlag' | 'viewFlag' | 'meetingOpenFlag' | 'profilerOpenFlag' | 'calenderFlag' | 'calenderFlag1' | 'calenderFlag2' | 'calenderFlag3' | 'newChat' | 'searchDropDown' | 'sharePopup' | 'closeAll'
}

interface SetIsHost {
    type: FlagActionType.SET_ISHOST;
    state: boolean
}

interface setHostEndForAll {
    type: FlagActionType.HOST_END_FOR_ALL;
    state: boolean
}

interface setHostMuteAudio {
    type: FlagActionType.HOST_MUTED_MIC;
    state: boolean
}

interface setHostTurnedOffVideo {
    type: FlagActionType.HOST_TURNED_OFF_CAMERA;
    state: boolean
}

interface setHostKickout {
    type: FlagActionType.HOST_KICKOUT;
    state: boolean
}

interface setLockMeeting {
    type: FlagActionType.LOCKED_MEETING;
    state: boolean
}

interface clearMeetingFlags {
    type: FlagActionType.CLEAR_MEETING_FLAGS;
}

// interface setNewMeetingFlag {
//     type: FlagActionType.NEW_MEETING_FLAG;
//     state: boolean
// }

interface idleState {
    type: FlagActionType.IDLESTATE;
    state: boolean
}

interface setGroupChat {
    type: FlagActionType.SET_GROUPCHAT_STATE;
    data: boolean
}
interface setPageVisibilityState {
    type: FlagActionType.SET_PAGE_VISIBILITY_STATE;
    data: boolean
}
interface setInviteModal {
    type: FlagActionType.SET_INVITE_MODAL_STATE;
    data: boolean
}
interface setDialModal {
    type: FlagActionType.SET_DIAL_MODAL;
    data: boolean
}
interface setWhiteBoardModal {
    type: FlagActionType.SET_WHITEBOARD_MODAL;
    data: boolean
}

interface setScreensharePause {
    type: FlagActionType.SET_SCREENSHARE_PAUSE;
    data: boolean;
}

interface setEditScheduleMeet {
    type: FlagActionType.SET_EDIT_SCHEDULEDMEET;
    data: boolean
}

interface setAllRecurrenceScheduleMeet {
    type: FlagActionType.SET_ALL_RECURRENCES_SCHEDULEDMEET;
    data: boolean
}

interface setSingleRecurrenceScheduleMeet {
    type: FlagActionType.SET_SINGLE_RECURRENCES_SCHEDULEDMEET;
    data: boolean
}
interface setEditSingleMeet {
    type: FlagActionType.SET_EDIT_SINGLE_MEET;
    data: boolean
}
interface setEditSingleRecMeet {
    type: FlagActionType.SET_EDIT_SINGLE_REC_MEET;
    data: boolean
}
interface setFlagEditMeetingTime {
    type: FlagActionType.FLAG_EDIT_MEETING_TIME;
    data: boolean
}
interface setFileDownload {
    type: FlagActionType.SET_FILE_DOWNLOAD;
    data: boolean
}
interface setFileNavigate {
    type: FlagActionType.SET_FILE_NAVIGATE;
    data: boolean
}
interface setOnReady {
    type: FlagActionType.SET_ON_READY;
    data: boolean
}

interface setLogrocketState {
    type: FlagActionType.SET_LOGROCKET_STATE;
    data: boolean
}

interface setWhiteBoardSocket {
    type: FlagActionType.SET_WHITEBOARD_SOCKET;
    state: boolean
}

interface setProgress {
    type: FlagActionType.SET_PROGRESS;
    data: boolean
}
interface setRecording {
    type: FlagActionType.SET_RECORDING;
    data: boolean
}
interface setPauseRecording {
    type: FlagActionType.SET_PAUSE_RECORDING;
    data: boolean
}

interface setUserInviteModal {
     type: FlagActionType.SET_USER_INVITE_MODAL,
     data: boolean
}



export type FlagAction =
    | SetMembersList | SetPublisherState | setLoginState | setCreateMeeting | SetPrivateChatState |
    SetFullScreen | SetPopUp | SetIsHost | setHostEndForAll | setHostMuteAudio | setHostTurnedOffVideo | setHostKickout
    | setLockMeeting | clearMeetingFlags | idleState | setGroupChat | setEditScheduleMeet | setAllRecurrenceScheduleMeet | setSingleRecurrenceScheduleMeet
    | setEditSingleMeet | setEditSingleRecMeet | setFlagEditMeetingTime | setPageVisibilityState | setInviteModal | setDialModal | setScreensharePause | setWhiteBoardModal
    | setFileDownload | setFileNavigate | setOnReady | setLogrocketState | setWhiteBoardSocket |setProgress | setRecording | setPauseRecording | setUserInviteModal;



