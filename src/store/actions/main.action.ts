import { notificationData, permissionSettings, clearLoginSession } from './../action-creators/main.actions.creators';
import { MainActionType } from "../action-types";
import { Json } from '@liveblocks/client';

interface meetingID {
    type: MainActionType.SET_MEETING_ID,
    id: number
}

interface setMeetingInfo {
    type: MainActionType.SET_MEETING_INFO,
    data: object
}

interface setMeetingSession {
    type: MainActionType.SET_MEETING_SESSION,
    data: any
}

interface setParticipant {
    type: MainActionType.SET_PARTICIPANT,
    data: any
}

interface setRoomState {
    type: MainActionType.SET_ROOMSTATE,
    state: string
}

interface removeParticipant {
    type: MainActionType.REMOVE_PARTICIPANT,
    data: any
}

interface updateParticipantList {
    type: MainActionType.UPDATE_PARTICIPANT_LIST,
    data: any
}

interface setMaxTileinSlider {
    type: MainActionType.SET_MAX_TILEINSLIDER,
    tiles: number
}

interface addNotification {
    type: MainActionType.ADD_NOTIFICATION,
    data: any
}

interface removeNotification {
    type: MainActionType.REMOVE_NOTIFICATION,
    id: any
}

// interface addHomeNotification {
//     type: MainActionType.ADD_HOME_NOTIFICATION,
//     data: any
// }

// interface removeHomeNotification {
//     type: MainActionType.REMOVE_HOME_NOTIFICATION,
//     id: number
// }

interface addGroupChat {
    type: MainActionType.ADD_GROUPCHAT,
    data: any
}

interface addPrivateChat {
    type: MainActionType.ADD_PRIVATECHAT,
    data: any
}

interface setPrivateChatParticipant {
    type: MainActionType.SET_PRIVATECHAT_PARTICIPANT,
    id: number,
    name: string
}

interface setDeviceList {
    type: MainActionType.DEVICE_LIST,
    list: any
}

interface setCurrentDevices {
    type: MainActionType.CURRENT_DEVICE,
    list: any
}

interface addReactions {
    type: MainActionType.ADD_REACTIONS,
    data: any
}

interface removeReaction {
    type: MainActionType.REMOVE_REACTIONS,
}

interface setHostName {
    type: MainActionType.SET_HOSTNAME,
    id: number,
    name: string
}

interface setUnReadPrivateChat {
    type: MainActionType.SET_UNREAD_PRIVATECHAT,
    data: any
}

interface setUnReadGroupChat {
    type: MainActionType.SET_UNREAD_GROUPCHAT,
}

interface setTimer {
    type: MainActionType.SET_MEETING_TIMER,
    timeInSec: number,
    timertype: string
}

interface addModal {
    type: MainActionType.ADD_MODAL,
    data: any
}

interface removeModal {
    type: MainActionType.REMOVE_MODAL,
    data: any
}

interface setWaitingList {
    type: MainActionType.ADD_TO_WAITING_LIST,
    data: any
}

interface removeFromWaitingList {
    type: MainActionType.REMOVE_FROM_WAITING_LIST,
    data: any
}

interface clearWaitingList {
    type: MainActionType.CLEAR_WAITING_LIST,
}

interface clearParticipantList {
    type: MainActionType.CLEAR_PARTICIPANT_LIST,
}

interface setMeetingInvite {
    type: MainActionType.SET_MEETING_INVITE,
    data: any
}

interface pauseVideo {
    type: MainActionType.PAUSE_VIDEO,
    data: any
}

// interface setParticipantVideoChange {
//     type: MainActionType.PARTICIPANT_VIDEO_STATE;
// }

interface setMeetingTimerRef {
    type: MainActionType.MEETING_TIMER_REF;
    data: any
}

interface clearMeetingStore {
    type: MainActionType.CLEAR_MEETING_STORE;
}

interface setVideoQuality {
    type: MainActionType.VIDEO_QUALITY;
    data: any
}

interface setMeetingEnviornemnt {
    type: MainActionType.SET_MEETING_ENVIORNEMNT;
    data: any
}

interface setLoggedInUserInfo {
    type: MainActionType.SET_LOGGEDIN_USER_INFO;
    data: any
}

interface setParticipantListFlags {
    type: MainActionType.SET_PARTICIPANT_LIST_FLAGS;
    data: any,
}
interface setSpeakingState {
    type: MainActionType.SET_SPEAKING_STATE;
    data: any,
}

interface setMeetingList {
    type: MainActionType.SET_MEETING_LIST;
    meetingList: any,
    update: boolean
}

interface setMeetingType {
    type: MainActionType.SET_MEETING_TYPE;
    data: string
}

interface setTab {
    type: MainActionType.SET_TAB;
    data: string
}

interface setScheduledMeetingInfo {
    type: MainActionType.SET_SCHEDULED_MEETING_DETAILS;
    data: string
}
interface setKeycloakToken {
    type: MainActionType.SET_KEYCLOAK_TOKEN;
    data: any
}

interface selectScreenshare {
    type: MainActionType.SELECT_SCREENSHARE;
    index: number
}

interface updateWaitingList {
    type: MainActionType.UPDATE_WAITING_LIST;
    data: any
}

interface addWhiteBoardData {
    type: MainActionType.ADD_WHITEBOARD_DATA;
    data: any
}

interface clearWhiteBoardData {
    type: MainActionType.CLEAR_WHITEBOARD_DATA;
}

interface setWhiteBoardState {
    type: MainActionType.SET_WHITEBOARD_STATE;
    data: any
}
interface setSelectedDate {
    type: MainActionType.SET_SELECTED_DATE;
    data: any
}
interface setFileShareModalState {
    type: MainActionType.SET_FILESHARE_MODAL_STATE;
    data: any
}
interface setFileShareState {
    type: MainActionType.SET_FILESHARE_STATE;
    data: any
}

interface setActiveChat {
    type: MainActionType.ACTIVE_CHAT;
    data: any
}

interface setHandRaise {
    type: MainActionType.SET_HANDRAISE;
    data: any;
}
interface setHostControlId {
    type: MainActionType.SET_HOSTCONTROL_ID;
    data: any;
}

interface setKeycloackLoggedInState {
    type: MainActionType.KEYCLOAK_LOGGEDIN_STATE;
    data: any;
}

interface setScreensharePauseListener {
    type: MainActionType.SET_SCREENSHARE_PAUSE_LISTENER,
    data: any
}
interface setScreensharePausePublisher {
    type: MainActionType.SET_SCREENSHARE_PAUSE_PUBLISHER,
    data: any
}

interface switchShareList {
    type: MainActionType.SWITCH_SHARELIST,
    data: any
}
interface setMediaStream {
    type: MainActionType.SET_MEDIA_STREAM,
    stream : MediaStream
    streamType : "video" | "screenshare",
    id : string
}

interface setMembersCount {
    type: MainActionType.SET_MEMBERS_COUNT
    count: any
}

interface toggleLeftBar {
  type : MainActionType.TOGGLE_LEFTBAR,
  data: any,
}
interface soundAndNotification {
  type : MainActionType.SOUND_AND_NOTIFICATION,
  data: any,
}
interface notificationData {
  type : MainActionType.NOTIFICATION_DATA,
  data: any,
}
interface setBrandingInfo {
  type: MainActionType.BRANDING_INFO;
  data: any;
}
interface setTheme {
  type: MainActionType.SET_THEME;
  data: any;
}
interface setThemePalette {
  type: MainActionType.SET_THEME_PALETTE;
  data: any;
}

interface setCallPopup {
    type: MainActionType.SET_CALL_POPUP;
    data: any;
}
interface enableMouseHover {
    type: MainActionType.ENABLE_MOUSE_HOVER;
    data: boolean;
}
interface permissionSettings {
    type: MainActionType.PERMISSION_SETTINGS;
    data: any;
}

interface setAuthentication {
  type: MainActionType.AUTHENCATION_DATA;
  data: Json;
}
interface setTenant {
  type: MainActionType.TENANT_DATA;
  data: Json;
}
interface clearLoginSession {
  type: MainActionType.CLEAR_LOGIN_SESSION;
  data: boolean;
}

export type MainAction =
    | meetingID | setMeetingInfo | setMeetingSession | setParticipant | setRoomState | removeParticipant | updateParticipantList |
    setMaxTileinSlider | addNotification | removeNotification | addGroupChat |
    addPrivateChat | setPrivateChatParticipant | setDeviceList | setCurrentDevices | addReactions | removeReaction | setHostName
    | setUnReadPrivateChat | setTimer | addModal | removeModal | setWaitingList | removeFromWaitingList | clearWaitingList |
    clearParticipantList | setMeetingInvite | pauseVideo | setMeetingTimerRef | clearMeetingStore |
    setVideoQuality | setMeetingEnviornemnt | setLoggedInUserInfo | setParticipantListFlags | setMeetingList | setSpeakingState | setTab
    | setUnReadGroupChat | setMeetingType | setScheduledMeetingInfo | setKeycloakToken | selectScreenshare | updateWaitingList | setSelectedDate |
    addWhiteBoardData | clearWhiteBoardData | setWhiteBoardState | setActiveChat | setHandRaise | setKeycloackLoggedInState | setHostControlId |
    setFileShareModalState | setFileShareState | setScreensharePauseListener | setScreensharePausePublisher | switchShareList | setMediaStream | setMembersCount | toggleLeftBar | setBrandingInfo
    | setTheme | setThemePalette | soundAndNotification | notificationData | setCallPopup | enableMouseHover | permissionSettings  | setAuthentication
  | setTenant | clearLoginSession;

