import { kickOut, searchFlag, setPersonalInfo, setPersonalStatus, callConnected, updateUserEvent, enableDisableEvent } from './../action-creators/chat.actions.creators';
import { ChatActionType } from "../action-types/";

interface setChatInstance {
  type: ChatActionType.SET_CHAT_INSTANCE;
  data: any;
}

interface handleMessage {
  type: ChatActionType.HANDLE_CHAT_MESSAGE;
  data: any;
}

interface handleSeen {
  type: ChatActionType.HANDLE_SEEN;
  data: any;
}

interface setUsersList {
  type: ChatActionType.SET_USERS_LIST;
  data: any;
}

interface setGroupsList {
  type: ChatActionType.SET_GROUPS_LIST;
  data: any;
}
interface setShowEmoji {
  type: ChatActionType.SET_SHOWEMOJI;
  data: boolean;
}
interface setActiveMessenger {
  type: ChatActionType.SET_ACTIVE_MESSENGER;
  data: any;
}
interface setActiveChat {
  type: ChatActionType.SET_ACTIVE_CHAT;
  uuid: string;
  isGroup: boolean;
}

interface setSerachResultChat {
  type: ChatActionType.SET_SEARCH_RESULT_CHAT;
  uuid: string;
  messages: any;
  isGroup: boolean;
  msgUuid: string;
}

interface unsetSearchResultChat {
  type: ChatActionType.UNSET_SEARCH_RESULT_CHAT;
}

interface setChatscreen {
  type: ChatActionType.SET_CHAT_SCREEN;
  data: boolean;
}
interface handleReaction {
  type: ChatActionType.HANLDE_REACTION;
  data: any;
}
interface setEdit {
  type: ChatActionType.SET_EDIT;
  data: string;
}
interface setEmojiBox {
  type: ChatActionType.SET_EMOJI_BOX;
  data: boolean;
}
interface setDeleteModal {
  type: ChatActionType.SET_DELETE_MODAL;
  data: string;
}

interface setPersonalInfo {
  type: ChatActionType.SET_PERSONAL_INFO;
  data: any;
}
interface setChatCallMic {
  type: ChatActionType.SET_CHAT_CALL_MIC;
  data: boolean;
}
interface setChatCallCamera {
  type: ChatActionType.SET_CHAT_CALL_CAMERA;
  data: boolean;
}
interface setChatCallScreenshare {
  type: ChatActionType.SET_CHAT_CALL_SCREENSHARE;
  data: boolean;
}
interface setChatCallInfo {
  type: ChatActionType.SET_CHAT_CALL_INFO;
  data: any;
}
interface setOptionBox {
  type: ChatActionType.SET_OPTION_BOX;
  data: any;
}
interface setReplyMsg {
  type: ChatActionType.SET_REPLY_MSG;
  data: any;
}

interface setPastMessages {
  type: ChatActionType.SET_PAST_MESSAGES;
  data: any;
  isGroup: boolean;
  isNew?: boolean
}

interface handleOnlineStatus {
  type: ChatActionType.HANDLE_ONLINE_STATUS;
  data: any;
}
interface setReplyFlag {
  type: ChatActionType.SET_REPLY_FLAG;
  data: boolean;
}
interface handleDelete {
  type: ChatActionType.HANDLE_DELETE;
  data: any;
}
interface setCreateGrpOption {
  type: ChatActionType.SET_CREATE_GRP_OPTION;
  data: boolean;
}
interface setNewChatOption {
  type: ChatActionType.SET_NEW_CHAT_OPTION;
  data: boolean;
}
interface setCreateGrpModal {
  type: ChatActionType.SET_CREATE_GRP_MODAL;
  data: boolean;
}
interface setMemberBubbleDelete {
  type: ChatActionType.SET_MEMBER_BUBBLE_DELETE;
  data: any;
}
interface handleEdit {
  type: ChatActionType.HANDLE_EDIT;
  data: any;
}
interface setCall {
  type: ChatActionType.SET_CALL;
  data: any;
}
interface flagSetCall {
  type: ChatActionType.FLAG_SET_CALL;
  data: boolean;
}
interface setShareMsgModal {
  type: ChatActionType.SET_SHARE_MSG_MODAL;
  data: boolean;
}
interface setAddAdminModal {
  type: ChatActionType.SET_ADD_ADMIN_MODAL;
  data: boolean;
}
interface setTwoOptionModal {
  type: ChatActionType.SET_TWO_OPTION_MODAL;
  data: any;
}

interface unsetUnread {
  type: ChatActionType.UNSET_UNREAD;
  uuid: string;
  isGroup: boolean;
}

interface updateGroupData {
  type: ChatActionType.UPDATE_GROUP_DATA;
  data: any;
  isCreate: boolean;
}

interface chatIsScrolled {
  type: ChatActionType.IS_SCROLLED;
  data: any;
  scrollPos: number | null;
  isGroup: boolean;
}

interface getChatByUUID {
  type: ChatActionType.SET_CHAT_BY_UUID;
  uuid: string;
  data: any;
}

interface setDraftMessage {
  type: ChatActionType.SET_DRAFT_MESSAGE;
  uuid: string;
  draftText: any;
  isGroup: boolean;
}

interface removeGroupMember {
  type: ChatActionType.REMOVE_GROUP_MEMBER;
  data: any;
}
interface alignOneSide {
  type: ChatActionType.ALIGN_ONE_SIDE;
  data: boolean;
}

interface addNewChat {
  type: ChatActionType.ADD_NEW_CHAT;
  data: any;
  setActive: boolean;
}
interface addGroupMember {
  type: ChatActionType.ADD_GROUP_MEMBER;
  data: any;
}

interface setAttachment {
  type: ChatActionType.SET_ATTACHMENT;
  uuid: string;
  files: any;
  isGroup: boolean;
}

interface setAttachmentURL {
  type: ChatActionType.SET_ATTACHMENT_URL;
  uuid: string;
  isGroup: boolean;
  url: string;
  index: number;
}

interface setUploadingStatus {
  type: ChatActionType.SET_UPLOADING_STATUS;
  uuid: string;
  isGroup: boolean;
  status: boolean;
}

interface setIncomingCall {
  type: ChatActionType.SET_INCOMING_CALL;
  data: any;
}

interface unsetIncomingCall {
  type: ChatActionType.UNSET_INCOMING_CALL;
  isCurrentCall: boolean;
  id?: string
  data?: any
}

interface setIncomingCallModal {
  type: ChatActionType.INCOMING_CALL_MODAL;
  data: any;
}

interface setChatData {
  type: ChatActionType.SET_CHAT_DATA_UPDATE;
  data: any;
}

interface setUploadingFailed {
  type: ChatActionType.SET_UPLOADING_FAILED;
  uuid: string;
  isGroup: boolean;
  index: number;
}
interface unsetAcitveChat {
  type: ChatActionType.UNSET_ACTIVE_CHAT;
}

interface setArrowUpEdit {
  type: ChatActionType.SET_ARROWUP_EDIT
}
interface setTypingIndicator {
  type: ChatActionType.SET_TYPING_INDICATOR,
  data: any
}

interface unsetTypingIndicator {
  type: ChatActionType.UNSET_TYPING_INDICATOR,
  data: any
}
interface handleMessageInLimbo {
  type: ChatActionType.HANDLE_MESSAGES_IN_LIMBO,
  data: any,
  isGroup: boolean
}

interface archiveGroup {
  type: ChatActionType.ARCHIVE_GROUP,
  uuid: string,
}
interface kickOut {
  type: ChatActionType.KICK_OUT,
  data: string,
}
interface pinMessage {
  type: ChatActionType.HANDLE_PIN_MESSAGE,
  data: any,
  isGroup: boolean,
  messageUUID: string,
  pinnedBy: string,
  isPin: boolean,
  pinnedMessage?: any
}
interface messageDelivered {
  type: ChatActionType.MESSAGE_DELIVERED;
  data: number;
}
interface callData {
  type: ChatActionType.CALL_DATA;
  data: object
}
interface updateCachedMessages {
  type: ChatActionType.UPDATE_CACHED_MESSAGES;
  data: any
  remove?: boolean
}

interface searchFlag {
  type: ChatActionType.SEARCH_FLAG;
  data: any
}
interface hoveredMessage {
  type: ChatActionType.HOVERED_MESSAGE;
  data: any;
}
interface updateOptions {
  type: ChatActionType.UPDATE_OPTIONS;
  data: any;
}
interface searchActiveChat {
  type: ChatActionType.SEARCH_ACTIVE_CHAT;
  data: any;
}
interface callToggle {
  type: ChatActionType.CALL_TOGGLE;
  data: any;
}
interface callMeetingData {
  type: ChatActionType.CALL_MEETING_DATA;
  data: any;
}

interface rejectReasonModal {
  type: ChatActionType.REJECT_REASON_MODAL;
  data: boolean;
}

interface pinnedChat {
  type: ChatActionType.PINNED_CHAT;
  data: any
}
interface selfData {
  type: ChatActionType.SELF_DATA;
  data: any;
}

interface setMiniProfile {
  type: ChatActionType.SET_MINI_PROFILE;
  data: boolean;
}

interface setPersonalStatus {
  type: ChatActionType.SET_PERSONAL_STATUS;
  data: any;
}
interface callConnected {
  type: ChatActionType.CALL_CONNECTED;
  data: any;
}
interface activePlaying {
  type: ChatActionType.SETACTIVEPLAYING;
  data: any;
}

interface setMeetingModal {
  type: ChatActionType.SET_MEETING_MODAL;
  data: boolean;
}
interface callToggleFlag {
  type: ChatActionType.CALL_TOGGLE_FLAG;
  data: any;
}
interface setChatMessage {
  type: ChatActionType.SET_CHAT_MESSAGE;
  data: any;
  isGroup: boolean;
  uuid: string
}
interface setMiniUuid {
  type: ChatActionType.SET_MINI_UUID;
  data: any;
}

interface setMqttStatus {
  type: ChatActionType.SET_MQTT_STATUS;
  data: any;
}

interface setNotification {
  type: ChatActionType.SET_NOTIFICATION;
  data: any;
}
interface setInviteState {
  type: ChatActionType.SET_INVITE_STATE;
  data: any;
}
interface gotoFile {
  type: ChatActionType.GOTOFILE;
  data: any;
}
interface setMentionUuid {
  type: ChatActionType.SET_MENTION_UUID;
  data: any;
}
interface clearChatData {
  type: ChatActionType.CLEAR_CHAT_DATA;
}

interface callReconnection {
  type: ChatActionType.CALL_RECONNECTION;
  data: any;
}
interface updateUserEvent {
  type: ChatActionType.UPDATE_USER_EVENT;
  data: any;
}
interface enableDisableEvent {
  type: ChatActionType.ENABLE_DISABLE_EVENT;
  data: any;
}
interface meetCredentials {
  type: ChatActionType.MEET_CREDENTIALS;
  id: any;
  password: any;
}
interface endCall {
  type: ChatActionType.END_CALL;
  data: any
}
interface setMultipleMsgSelect {
  type: ChatActionType.SET_MULTIPLE_MSG_SELECT;
  data: boolean;
}
interface setMultipleMsgList {
  type: ChatActionType.SET_MULTIPLE_MSG_LIST;
  data: any;
}


export type ChatAction =
  | setUsersList
  | setGroupsList
  | setShowEmoji
  | setActiveMessenger
  | handleReaction
  | setEdit
  | setChatscreen
  | setEmojiBox
  | setDeleteModal
  | setChatInstance
  | setActiveChat
  | setSerachResultChat
  | unsetSearchResultChat
  | handleMessage
  | activePlaying
  | setPersonalInfo
  | handleSeen
  | handleOnlineStatus
  | setPastMessages
  | setChatCallMic
  | setChatCallCamera
  | setChatCallScreenshare
  | setChatCallInfo
  | setOptionBox
  | setReplyMsg
  | setReplyFlag
  | setCreateGrpOption
  | setNewChatOption
  | setCreateGrpModal
  | setMemberBubbleDelete
  | handleDelete
  | setPastMessages
  | setCall
  | flagSetCall
  | handleEdit
  | setShareMsgModal
  | setAddAdminModal
  | setTwoOptionModal
  | unsetUnread
  | updateGroupData
  | chatIsScrolled
  | getChatByUUID
  | setDraftMessage
  | removeGroupMember
  | alignOneSide
  | addNewChat
  | addGroupMember
  | setAttachment
  | setAttachmentURL
  | setUploadingStatus
  | setIncomingCall
  | unsetIncomingCall
  | setIncomingCallModal
  | setChatData
  | setUploadingFailed
  | unsetAcitveChat
  | setArrowUpEdit
  | setTypingIndicator
  | unsetTypingIndicator
  | handleMessageInLimbo
  | archiveGroup
  | pinMessage
  | kickOut
  | messageDelivered
  | callData
  | updateCachedMessages
  | searchFlag
  | hoveredMessage
  | updateOptions
  | searchActiveChat
  | callToggle
  | callMeetingData
  | rejectReasonModal
  | pinnedChat
  | selfData
  | setMiniProfile
  | setPersonalStatus
  | callConnected
  | setMeetingModal
  | callToggleFlag
  | setChatMessage
  | setMiniUuid
  | setMqttStatus
  | setNotification
  | setInviteState
  | gotoFile
  | setMentionUuid
  | clearChatData
  | callReconnection
  | updateUserEvent
  | enableDisableEvent
  | meetCredentials
  | endCall
  | setMultipleMsgSelect
  | setMultipleMsgList;

