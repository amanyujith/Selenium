import { actionCreators } from "..";
import { setActiveChat, setMultipleMsgList } from "../action-creators";
import { ChatActionType } from "../action-types";
import { ChatAction } from "../actions";

interface IMessage {
  uuid: string;
  type: string;
  to: string;
  tenant: string;
  status: string;
  seen: Array<any>;
  reply_to: string | undefined;
  other_info_map: Array<string>;
  from: string;
  forward_from: string | undefined;
  category: string;
  body: any;
  a_mtime: number;
  a_ctime: number;
  reactions: Array<any>;
  is_seen: boolean;
  pinned: boolean;
  pinned_by: string;

}
interface IUserData {
  uuid: string;
  unread_msg_count: number;
  status: string;
  profile_picture: string;
  presence: string;
  messages: Array<IMessage>;
  cachedMessages?: Array<IMessage>;
  lastname: string;
  last_seen: number;
  firstname: string;
  display_name?: any;
  scrollPos?: number | null;
  call_details: any,
  draft?: any;
  files?: any;
  uploading?: boolean;
  isTyping?: null | string;
  pinned_messages: Array<IMessage>
  personal_status: any,
  messageRecieved?: boolean
  inviteState?: string
  phone?: string
}

interface IGroupMembers {
  uuid: string;
  user_id: string;
  status: string;
  name: string;
  modified_by: string;
  left_time: string;
  join_time: any;
  group_id: string;
  external_member: boolean;
  created_by: string;
  a_mtime: any;
  a_ctime: any;
}

interface IGroupData {
  uuid: string;
  unread_msg_count: number;
  tenant: string;
  status: string;
  profile_picture?: any;
  name: string;
  modified_by: string;
  messages: any[];
  cachedMessages?: Array<IMessage>;
  members: IGroupMembers[];
  inactive_members: any[];
  call_details: any,
  link_id?: any;
  external_group: boolean;
  description?: any;
  created_by: string;
  admin: string[];
  a_mtime: number;
  a_ctime: number;
  scrollPos?: number | null;
  draft?: any;
  files?: any;
  uploading?: boolean;
  isTyping?: null | string;
  pinned_messages: Array<IMessage>,
  messageRecieved?: boolean
}

interface IActiveChat {
  data: IGroupData | IUserData;
  isGroup: boolean;
}

export interface ChatRepoState {
  userData: IUserData[];
  groupData: IGroupData[];
  isReady: boolean;
  showEmoji: boolean;
  activeChat: any;
  uuid: string;
  reaction: any;
  edit: string;
  editMsg: any;
  chatScreen: boolean;
  emojiBox: boolean;
  deleteModal: string;
  chatInstance: any;
  personalInfo: any;
  chatCallMic: boolean;
  chatCallCamera: boolean;
  chatCallScreenshare: boolean;
  chatCallInfo: any | null;
  showOption: boolean;
  replyMsg: any;
  replyFlag: boolean;
  createGrpOption: boolean;
  setNewChatOption: boolean;
  createGrpModal: boolean;
  grpMembers: any;
  memberBubbleDelete: any;
  setCall: any;
  flagSetCall: boolean;
  setShareMsgModal: boolean;
  setAddAdminModal: boolean;
  setTwoOptionModal: any;
  alignOneSide: boolean;
  incomingCall: null | any;
  setIncomingCallModal: boolean;
  searchResultMessage: string;
  kickOut: string;
  messageDelivered: number;
  callData: object;
  searchFlag: boolean;
  hoveredMessage: string;
  updateOptions: boolean;
  searchActiveChat: any;
  callToggle: any;
  callMeetingData: any;
  rejectReasonModal: boolean;
  pinnedChat: any;
  selfData: any;
  setMiniProfile: boolean;
  callConnected: any;
  activePlaying: any;
  setMeetingModal: boolean;
  callToggleFlag: any;
  setMiniUuid: any;
  setMqttStatus: any;
  setNotification: any;
  gotoFile: any;
  setMentionUuid: any;
  callReconnection: boolean;
  meetCredentials: any;
  endCall: boolean;
  setMultipleMsgSelect: boolean;
  setMultipleMsgList: any;
}

const initialState = {
  userData: [],
  groupData: [],
  isReady: false,
  showEmoji: false,
  activeChat: {
    data: {},
    isGroup: false,
  },
  uuid: "",
  reaction: {},
  edit: "",
  editMsg: {},
  chatScreen: false,
  emojiBox: false,
  deleteModal: "",
  chatInstance: null,
  personalInfo: null,
  chatCallMic: false,
  chatCallCamera: false,
  chatCallScreenshare: false,
  chatCallInfo: null,
  showOption: false,
  replyMsg: {},
  replyFlag: false,
  createGrpOption: false,
  setNewChatOption: false,
  createGrpModal: false,
  grpMembers: [],
  memberBubbleDelete: "",
  setCall: "",
  flagSetCall: false,
  setShareMsgModal: false,
  setAddAdminModal: false,
  setTwoOptionModal: -1,
  alignOneSide: true,
  incomingCall: null,
  setIncomingCallModal: false,
  searchResultMessage: "",
  kickOut: "",
  messageDelivered: 0,
  callData: {},
  searchFlag: false,
  hoveredMessage: "",
  updateOptions: false,
  searchActiveChat: "",
  callToggle: "",
  callMeetingData: "",
  rejectReasonModal: false,
  pinnedChat: "",
  setMiniProfile: false,
  selfData: "",
  callConnected: false,
  setMeetingModal: false,
  activePlaying: {},
  callToggleFlag: false,
  setMiniUuid: "",
  setMqttStatus: "",
  setNotification: {
    content: "",
    type: "",
  },
  gotoFile: "",
  setMentionUuid: "",
  callReconnection: false,
  meetCredentials: {
    id: "",
    password: "",
  },
  endCall: false,
  setMultipleMsgSelect:false,
  setMultipleMsgList:[],
};


const ChatReducer = (
  state: ChatRepoState = initialState,
  action: ChatAction
): ChatRepoState => {
  switch (action.type) {
    case ChatActionType.SET_USERS_LIST: {
      const activeChat = { ...state.activeChat };

      if (activeChat.data.uuid) {
        const participant_index = action.data.findIndex(
          (node: any) => node.uuid === activeChat.data.uuid
        );

        if (participant_index !== -1) {
          activeChat.data = { ...action.data[participant_index] };
          return {
            ...state,
            userData: action.data,
            activeChat: activeChat,
          };
        } else {
          return {
            ...state,
            userData: action.data,
            activeChat: {
              data: {},
              isGroup: false,
            },
          };
        }
      } else {
        return {
          ...state,
          userData: action.data,
        };
      }
    }
    case ChatActionType.SET_GROUPS_LIST: {
      const activeChat = { ...state.activeChat };

      if (activeChat.data.uuid) {
        const participant_index = action.data.findIndex(
          (node: any) => node.uuid === activeChat.data.uuid
        );

        if (participant_index !== -1) {
          activeChat.data = { ...action.data[participant_index] };
          return {
            ...state,
            groupData: action.data,
            activeChat: activeChat,
          };
        } else {
          return {
            ...state,
            groupData: action.data,
            activeChat: {
              data: {},
              isGroup: false,
            },
          };
        }
      } else {
        return {
          ...state,
          groupData: action.data,
        };
      }
    }

    case ChatActionType.SET_CHAT_DATA_UPDATE: {
      const activeChat = { ...state.activeChat };

      if (activeChat.data.uuid) {
        const participant_index = activeChat.isGroup
          ? action.data.group_info.findIndex(
              (node: any) => node.uuid === activeChat.data.uuid
            )
          : action.data.member_info.findIndex(
              (node: any) => node.uuid === activeChat.data.uuid
            );

        if (participant_index !== -1) {
          if (activeChat.isGroup) {
            activeChat.data = { ...action.data.group_info[participant_index] };
          } else {
            activeChat.data = { ...action.data.member_info[participant_index] };
          }
          return {
            ...state,
            groupData: action.data.group_info,
            userData: action.data.member_info,
            // activeChat: activeChat,
          };
        } else {
          return {
            ...state,
            groupData: action.data.group_info,
            userData: action.data.member_info,
            activeChat: {
              data: {},
              isGroup: false,
            },
          };
        }
      } else {
        return {
          ...state,
          groupData: action.data.group_info,
          userData: action.data.member_info,
        };
      }
    }

    case ChatActionType.SET_SHOWEMOJI: {
      return {
        ...state,
        showEmoji: action.data,
      };
    }
    case ChatActionType.SET_ACTIVE_MESSENGER: {
      let time = new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      const tempArray = [...state.activeChat.messages];

      if (action.data.a_mtime === action.data.a_ctime) {
        tempArray.push({
          ...action.data,
          name: "you",
          status: "not_delivered_remote_participant",
          seen: false,
        });
      } else {
        let newMsg = {
          id: action.data.id,
          name: "you",
          time: time,
          text: action.data.text,
          a_mtime: 1673250990999,
          a_ctime: 1673250990921,
          status: "delivered_remote_participant",
          seen: false,
        };
        const editIndex = tempArray.findIndex(
          (item: any) => item.id === action.data.id
        );

        tempArray.splice(editIndex, 1, newMsg);
      }

      return {
        ...state,
        activeChat: { ...state.activeChat, messages: tempArray },
      };
    }
    case ChatActionType.SET_CHAT_SCREEN: {
      return {
        ...state,
        chatScreen: action.data,
      };
    }
    case ChatActionType.SET_ACTIVE_CHAT: {
      if (action.isGroup) {
        let tempArray = [...state.groupData];
        const active = tempArray.find((item: any) => item.uuid === action.uuid);
        return {
          ...state,
          activeChat: { data: { ...active }, isGroup: action.isGroup },
        };
      } else {
        let tempArray = [...state.userData];
        const active = tempArray.find((item: any) => item.uuid === action.uuid);
        return {
          ...state,
          activeChat: { data: { ...active }, isGroup: action.isGroup },
        };
      }
    }
    case ChatActionType.SET_SEARCH_RESULT_CHAT: {
      if (action.isGroup) {
        // let tempArray = [...state.groupData];
        // let active: any = tempArray.find((item: any) => item.uuid === action.uuid);
        // active = {...active, messages:action.messages}
        // const index: any = tempArray.findIndex((item: any) => item.uuid === action.uuid);
        // const active = {...tempArray[index], messages:action.messages}
        // tempArray[index] = active;

        return {
          ...state,
          // activeChat: { data: { ...active }, isGroup: action.isGroup },
          searchResultMessage: action.msgUuid,
          // groupData: tempArray,
        };
      } else {
        // let tempArray = [...state.userData];
        // const index: any = tempArray.findIndex((item: any) => item.uuid === action.uuid);
        // const active = {...tempArray[index], messages:action.messages}
        // tempArray[index] = active;
        return {
          ...state,
          // activeChat: { data: { ...active }, isGroup: action.isGroup },
          searchResultMessage: action.msgUuid,
          // userData: tempArray,
        };
      }
    }
    case ChatActionType.UNSET_SEARCH_RESULT_CHAT: {
      return {
        ...state,
        searchResultMessage: "",
      };
    }
    case ChatActionType.HANLDE_REACTION: {
      if (!action.data.isGroup) {
        const userData = [...state.userData];
        const activeChat = { ...state.activeChat };
        const participant_index = userData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );

        const message_index = userData[participant_index].messages.findIndex(
          (message: any) => message.uuid === action.data.message.uuid
        );
        if (message_index !== -1) {
          if (
            action.data.message.event === "add" &&
            userData[participant_index].messages[message_index].reactions
          ) {
            let flag = true;
            let newArray = userData[participant_index].messages[
              message_index
            ].reactions.map((node: any, i: number) => {
              if (action.data.message.emoji === node.emoji) {
                flag = false;
                node.count++;
                node.member.push(action.data.message.from);

                return node;
              } else return node;
            });
            flag &&
              newArray.push({
                count: 1,
                emoji: action.data.message.emoji,
                member: [action.data.message.from],
              });
            userData[participant_index].messages[message_index].reactions =
              newArray;
          } else if (
            userData[participant_index].messages[message_index].reactions
          ) {
            let newArray = userData[participant_index].messages[
              message_index
            ].reactions.filter((node: any, i: number) => {
              if (action.data.message.emoji === node.emoji) {
                if (node.count > 1) {
                  node.count--;
                  const index = node.member.indexOf(action.data.message.from);
                  if (index > -1) {
                    node.member.splice(index, 1);
                  }
                  return node;
                }
              } else return node;
            });
            userData[participant_index].messages[message_index].reactions =
              newArray;
          } else {
            userData[participant_index].messages[message_index].reactions = [
              {
                count: 1,
                emoji: action.data.message.emoji,
                member: [action.data.message.from],
              },
            ];
          }
          if (activeChat.data.uuid === userData[participant_index].uuid) {
            activeChat.data = userData[participant_index];
          }
        }

        return {
          ...state,
          userData: userData,
          activeChat: activeChat,
        };
      } else {
        const groupData = [...state.groupData];
        const activeChat = { ...state.activeChat };
        const participant_index = groupData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );

        const message_index = groupData[participant_index].messages.findIndex(
          (message: any) => message.uuid === action.data.message.uuid
        );
        if (message_index !== -1) {
          if (
            action.data.message.event === "add" &&
            groupData[participant_index].messages[message_index].reactions
          ) {
            let flag = true;
            let newArray = groupData[participant_index].messages[
              message_index
            ].reactions.map((node: any, i: number) => {
              if (action.data.message.emoji === node.emoji) {
                flag = false;
                node.count++;
                node.member.push(action.data.message.from);

                return node;
              } else return node;
            });
            flag &&
              newArray.push({
                count: 1,
                emoji: action.data.message.emoji,
                member: [action.data.message.from],
              });
            groupData[participant_index].messages[message_index].reactions =
              newArray;
          } else if (
            groupData[participant_index].messages[message_index].reactions
          ) {
            let newArray = groupData[participant_index].messages[
              message_index
            ].reactions.filter((node: any, i: number) => {
              if (action.data.message.emoji === node.emoji) {
                if (node.count > 1) {
                  node.count--;
                  const index = node.member.indexOf(action.data.message.from);
                  if (index > -1) {
                    node.member.splice(index, 1);
                  }
                  return node;
                }
              } else return node;
            });
            groupData[participant_index].messages[message_index].reactions =
              newArray;
          } else {
            groupData[participant_index].messages[message_index].reactions = [
              {
                count: 1,
                emoji: action.data.message.emoji,
                member: [action.data.message.from],
              },
            ];
          }
          if (activeChat.data.uuid === groupData[participant_index].uuid) {
            activeChat.data = groupData[participant_index];
          }
        }

        return {
          ...state,
          groupData: groupData,
          activeChat: activeChat,
        };
      }
    }
    case ChatActionType.SET_EDIT: {
      return {
        ...state,
        edit: action.data,
      };
    }
    case ChatActionType.SET_EMOJI_BOX: {
      return {
        ...state,
        emojiBox: action.data,
      };
    }

    case ChatActionType.SET_DELETE_MODAL: {
      return {
        ...state,
        deleteModal: action.data,
      };
    }
    case ChatActionType.SET_CHAT_INSTANCE: {
      return {
        ...state,
        chatInstance: action.data,
      };
    }
    case ChatActionType.HANDLE_CHAT_MESSAGE: {
      state.chatInstance.grafanaLogger([
        "Client : Messages",
        {
          category: action.data?.message?.category,
          uuid: action.data?.message?.uuid,
          from: action.data?.message?.from,
          to: action.data?.message?.to,
          type: action.data?.message?.type
            ? action.data?.message?.type
            : action.data?.message?.category,
        },
      ]);
      if (!action.data.isGroup) {
        const userData = [...state.userData];
        const participant_index = userData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );
        const message_index = userData[participant_index].messages.findIndex(
          (message: any) => message.uuid === action.data.message.uuid
        );

        let call_details = { ...state.activeChat.call_details };
        const userWithCall = userData
          .filter((user: any) => user.call_details)
          .map((usr: any) => {
            return usr.call_details.meeting_id;
          });

        if (
          action.data.message.type === "system" &&
          userWithCall.includes(action.data.message.body.meeting_id)
        ) {
          // state.callToggle = ''

          userData[participant_index].call_details = "";
          if (
            userData[participant_index]?.uuid === state.activeChat.data.uuid
          ) {
            call_details = userData[participant_index].call_details;
          }
        }
        if (message_index !== -1) {
          if (
            (action.data.message.category === "publish_ack",
            userData[participant_index].messages[message_index])
          ) {
            userData[participant_index].messages[message_index].a_ctime =
              action.data.message.a_ctime;
            userData[participant_index].messages[message_index].a_mtime =
              action.data.message.a_mtime;
          }
          if (action.data.message.category === "delivered_ack") {
            userData[participant_index].messages[message_index].other_info_map =
              action.data.message.other_info_map;
          }
          // if(userData[participant_index].messages[message_index].status)
          if (
            userData[participant_index].messages[message_index].status !==
            "delivered_remote_participant"
          )
            userData[participant_index].messages[message_index].status =
              action.data.message.status;
        } else if (action.data.message.category !== "delivered_ack") {
          if (userData[participant_index].cachedMessages && action.data.message.from === state.selfData.uuid) {
            userData[participant_index].messages =
              userData[participant_index].cachedMessages || [];
            userData[participant_index].cachedMessages = undefined;
          }

          const lastMessage = userData[participant_index].messages.at(-1);
          if (
            lastMessage &&
            action.data.message.a_ctime < lastMessage.a_ctime &&
            state.personalInfo.uuid !== action.data.message.from
          ) {
            let pos = null;

            [...userData[participant_index].messages]
              .slice()
              .reverse()
              .every((node, index) => {
                if (action.data.message.a_ctime > node.a_ctime) {
                  pos = userData[participant_index].messages.length - index;
                  return false;
                } else {
                  return true;
                }
              });
            if (pos) {
              userData[participant_index].messages = [
                ...userData[participant_index].messages.slice(0, pos),
                action.data.message,
                ...userData[participant_index].messages.slice(pos),
              ];
            } else {
              userData[participant_index].messages.unshift({
                ...action.data.message,
              });
              if (action.data.message.from !== state.selfData.uuid)
                userData[participant_index].isTyping = null;
            }
          } else {
            if (!userData[participant_index].cachedMessages) {
              userData[participant_index].messages.push({
                ...action.data.message,
              });
            } else {
              userData[participant_index]?.cachedMessages?.push({
                ...action.data.message,
              });
            }
            if (action.data.message.from !== state.selfData.uuid)
              userData[participant_index].isTyping = null;
          }
          if (
            state.personalInfo.uuid !== action.data.message.from &&
            action.data.message.type !== "system"
          ) {
            userData[participant_index].unread_msg_count =
              userData[participant_index].unread_msg_count + 1;
          }
        }

        //
        //

        if (userData[participant_index].uuid === state.activeChat.data.uuid) {
          const currentItem = userData[participant_index];

          if (message_index === -1) {
            userData.splice(participant_index, 1);
            userData.unshift(currentItem);
          }

          return {
            ...state,
            userData: userData,
            activeChat: {
              data: currentItem,
              isGroup: state.activeChat.isGroup,
              call_details: call_details,
            },
          };
        } else {
          if (message_index === -1) {
            let currentItem = userData[participant_index];
            userData.splice(participant_index, 1);
            userData.unshift(currentItem);
          }
          return {
            ...state,
            userData: userData,
          };
        }
      } else {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node) => action.data.message.to === node.uuid
        );
        let call_details = { ...state.activeChat.call_details };

        const message_index = groupData[participant_index].messages.findIndex(
          (message: any) => message.uuid === action.data.message.uuid
        );
        const groupWithCall = groupData
          .filter((group: any) => group.call_details)
          .map((grp: any) => {
            return grp.call_details.meeting_id;
          });

        if (
          action.data.message.type === "system" &&
          groupWithCall.includes(action.data.message.body.meeting_id)
        ) {
          // state.callToggle = ''
          groupData[participant_index].call_details = "";
          if (
            groupData[participant_index]?.uuid === state.activeChat.data.uuid
          ) {
            call_details = groupData[participant_index].call_details;
          }
        }
        if (message_index !== -1) {
          if (action.data.message.category === "publish_ack") {
            groupData[participant_index].messages[message_index].a_ctime =
              action.data.message.a_ctime;
            groupData[participant_index].messages[message_index].a_mtime =
              action.data.message.a_mtime;
          }

          if (action.data.message.category === "delivered_ack") {
            groupData[participant_index].messages[
              message_index
            ].other_info_map = action.data.message.other_info_map;
          }
          groupData[participant_index].messages[message_index].status =
            action.data.message.status;
        } else if (action.data.message.category !== "delivered_ack") {
          const lastMessage = groupData[participant_index].messages.at(-1);
         if (groupData[participant_index].cachedMessages && action.data.message.from === state.selfData.uuid) {
            groupData[participant_index].messages =
              groupData[participant_index].cachedMessages || [];
            groupData[participant_index].cachedMessages = undefined;
          }
          if (
            lastMessage &&
            action.data.message.a_ctime < lastMessage.a_ctime &&
            state.personalInfo.uuid !== action.data.message.from
          ) {
            let pos = null;
            groupData[participant_index].messages
              .slice()
              .reverse()
              .every((node, index) => {
                if (action.data.message.a_ctime > node.a_ctime) {
                  pos = groupData[participant_index].messages.length - index;
                  return false;
                } else {
                  return true;
                }
              });
            if (pos) {
              groupData[participant_index].messages = [
                ...groupData[participant_index].messages.slice(0, pos),
                action.data.message,
                ...groupData[participant_index].messages.slice(pos),
              ];
            } else {
              groupData[participant_index].messages.unshift(
                action.data.message
              );
              if (action.data.message.from !== state.selfData.uuid)
                groupData[participant_index].isTyping = null;
            }
          } else {
            if (!groupData[participant_index].cachedMessages) {
              groupData[participant_index].messages.push(action.data.message);
              if (action.data.message.from !== state.selfData.uuid)
                groupData[participant_index].isTyping = null;
            } else {
              groupData[participant_index]?.cachedMessages?.push(
                action.data.message
              );
              if (action.data.message.from !== state.selfData.uuid)
                groupData[participant_index].isTyping = null;
            }
          }
          if (
            state.personalInfo.uuid !== action.data.message.from &&
            action.data.message.type !== "system"
          ) {
            groupData[participant_index].unread_msg_count =
              groupData[participant_index].unread_msg_count + 1;
          }
        }

        if (groupData[participant_index].uuid === state.activeChat.data.uuid) {
          let currentItem = groupData[participant_index];

          if (message_index === -1) {
            groupData.splice(participant_index, 1);
            groupData.unshift(currentItem);
          }

          return {
            ...state,
            groupData: groupData,
            activeChat: {
              data: currentItem,
              isGroup: state.activeChat.isGroup,
              call_details: call_details,
            },
          };
        } else {
          if (message_index === -1) {
            let currentItem = groupData[participant_index];
            groupData.splice(participant_index, 1);
            groupData.unshift(currentItem);
          }
          return {
            ...state,
            groupData: groupData,
          };
        }
      }
    }

    case ChatActionType.HANDLE_SEEN: {
      const activeChat = { ...state.activeChat };

      if (action.data.isGroup) {
        const groupData = [...state.groupData];

        const participant_index = groupData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );

        action.data.message.uuid &&
          action.data.message.uuid.forEach((uuid: string) => {
            const message_index = groupData[
              participant_index
            ].messages.findIndex((message: any) => message.uuid === uuid);
            if (groupData[participant_index].messages[message_index]) {
              groupData[participant_index].messages[message_index].is_seen =
                true;
            }
          });
        if (activeChat.data.uuid === groupData[participant_index].uuid) {
          activeChat.data = groupData[participant_index];
        }

        return {
          ...state,
          groupData: groupData,
          activeChat: { ...activeChat },
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );

        action.data.message.uuid &&
          action.data.message.uuid.forEach((uuid: string) => {
            const message_index = userData[
              participant_index
            ].messages.findIndex((message: any) => message.uuid === uuid);
            if (userData[participant_index].messages[message_index]) {
              userData[participant_index].messages[message_index].is_seen =
                true;
            }
          });
        if (activeChat.data.uuid === userData[participant_index].uuid) {
          activeChat.data = userData[participant_index];
        }
        return {
          ...state,
          userData: userData,
          activeChat: { ...activeChat },
        };
      }
    }

    case ChatActionType.HANDLE_DELETE: {
      if (action.data.isGroup) {
        const groupData = [...state.groupData];
        const activeChat = { ...state.activeChat };
        const participant_index = groupData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );
        action.data.message.uuid.forEach((uuid: string) => {
          const message_index = groupData[participant_index].messages.findIndex(
            (message: any) => message.uuid === uuid
          );
          if (message_index !== -1) {
            groupData[participant_index].messages[message_index].category =
              action.data.message.category;
            if (activeChat.data.uuid === groupData[participant_index].uuid) {
              activeChat.data = groupData[participant_index];
            }
          }

        });
        return {
          ...state,
          groupData: groupData,
          activeChat: activeChat,
        };
      } else {
        const userData = [...state.userData];
        const activeChat = { ...state.activeChat };
        const participant_index = userData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );
        action.data.message.uuid.forEach((uuid: string) => {
          const message_index = userData[participant_index].messages.findIndex(
            (message: any) => message.uuid === uuid
          );
          if (message_index !== -1) {
            userData[participant_index].messages[message_index].category =
              action.data.message.category;
            if (activeChat.data.uuid === userData[participant_index].uuid) {
              activeChat.data = userData[participant_index];
            }
          }
        });

        return {
          ...state,
          userData: userData,
          activeChat: activeChat,
        };
      }
    }

    case ChatActionType.HANDLE_EDIT: {
      if (action.data.isGroup) {
        let groupData = [...state.groupData];
        let activeChat = { ...state.activeChat };
        const participant_index = groupData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );
        const message_index = groupData[participant_index].messages.findIndex(
          (message: any) => message.uuid === action.data.message.uuid
        );
        if (message_index !== -1) {
          groupData[participant_index].messages[message_index].a_mtime =
            action.data.message.timestamp;
          groupData[participant_index].messages[message_index].body =
            action.data.message.body;
          groupData[participant_index].messages[message_index].category =
            action.data.message.category;

          if (activeChat.data.uuid === groupData[participant_index].uuid) {
            activeChat.data = groupData[participant_index];
          }
        }

        return {
          ...state,
          groupData: groupData,
          activeChat: activeChat,
        };
      } else {
        let userData = [...state.userData];
        let activeChat = { ...state.activeChat };
        const participant_index = userData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );
        const message_index = userData[participant_index].messages.findIndex(
          (message: any) => message.uuid === action.data.message.uuid
        );
        if (message_index !== -1) {
          userData[participant_index].messages[message_index].a_mtime =
            action.data.message.timestamp;
          userData[participant_index].messages[message_index].body =
            action.data.message.body;
          userData[participant_index].messages[message_index].category =
            action.data.message.category;

          if (activeChat.data.uuid === userData[participant_index].uuid) {
            activeChat.data = userData[participant_index];
          }
        }

        return {
          ...state,
          userData: userData,
          activeChat: activeChat,
        };
      }
    }
    case ChatActionType.SET_PERSONAL_INFO: {
      return {
        ...state,
        isReady: true,
        personalInfo: {
          firstname: action.data.firstname,
          lastname: action.data.lastname,
          uuid: action.data.uuid,
        },
      };
    }
    case ChatActionType.SET_CHAT_CALL_MIC: {
      return {
        ...state,
        chatCallMic: action.data,
      };
    }
    case ChatActionType.SET_CHAT_CALL_CAMERA: {
      return {
        ...state,
        chatCallCamera: action.data,
      };
    }
    case ChatActionType.SET_CHAT_CALL_SCREENSHARE: {
      return {
        ...state,
        chatCallScreenshare: action.data,
      };
    }
    case ChatActionType.SET_CHAT_CALL_INFO: {
      return {
        ...state,
        chatCallInfo: action.data,
      };
    }
    case ChatActionType.SET_OPTION_BOX: {
      return {
        ...state,
        showOption: action.data,
      };
    }
    case ChatActionType.SET_REPLY_MSG: {
      return {
        ...state,
        replyMsg: action.data,
      };
    }

    case ChatActionType.SET_REPLY_FLAG: {
      return {
        ...state,
        replyFlag: action.data,
      };
    }

    case ChatActionType.SET_PAST_MESSAGES: {
      if (action.isGroup) {
        const groupData = [...state.groupData];
        const activeChat = { ...state.activeChat };
        const participant_index = groupData.findIndex(
          (node) => node.uuid === action.data.uuid
        );
          
        if (action.isNew) {
          groupData[participant_index].messages = [
            ...groupData[participant_index].messages,
            ...action.data.message,
          ];
        } else {
          if (
            activeChat.data.messages[0].a_ctime !=
            action.data.message[0].a_ctime
          ) {
            groupData[participant_index].messages = [
              ...action.data.message,
              ...groupData[participant_index].messages,
            ];
          }
        }

        if (activeChat.data.uuid === groupData[participant_index].uuid) {
          activeChat.data = groupData[participant_index];
          activeChat.data.messageRecieved = true;
        }

        return {
          ...state,
          groupData: groupData,
          activeChat: activeChat,
        };
      } else {
        const userData = [...state.userData];
        const activeChat = { ...state.activeChat };
        const participant_index = userData.findIndex(
          (node) => node.uuid === action.data.uuid
        );

        if (action.isNew) {
          userData[participant_index].messages = [
            ...userData[participant_index].messages,
            ...action.data.message,
          ];
        } else {
          if (
            activeChat.data.messages[0].a_ctime !=
            action.data.message[0].a_ctime
          ) {
            userData[participant_index].messages = [
              ...action.data.message,
              ...userData[participant_index].messages,
            ];
          }
        }

        if (activeChat.data.uuid === userData[participant_index].uuid) {
          activeChat.data = userData[participant_index];
          activeChat.data.messageRecieved = true;
        }

        return {
          ...state,
          userData: userData,
          activeChat: activeChat,
        };
      }
    }

    case ChatActionType.SET_CREATE_GRP_OPTION: {
      return {
        ...state,
        createGrpOption: action.data,
      };
    }

    case ChatActionType.SET_CREATE_GRP_MODAL: {
      return {
        ...state,
        createGrpModal: action.data,
      };
    }

    case ChatActionType.SET_NEW_CHAT_OPTION: {
      return {
        ...state,
        setNewChatOption: action.data,
      };
    }

    case ChatActionType.SET_MEMBER_BUBBLE_DELETE: {
      let tempArr = [...state.grpMembers];

      let index = tempArr.findIndex((tempArr) => tempArr === action.data);

      tempArr.splice(index, 1);

      return {
        ...state,
        grpMembers: tempArr,
      };
    }
    case ChatActionType.HANDLE_ONLINE_STATUS: {
      let userData = [...state.userData];
      let activeChat = { ...state.activeChat };
      const participant_index = userData.findIndex(
        (node) => node.uuid === action.data.uuid
      );
      let callMeetingData = [...state.callMeetingData];
      if (action.data.uuid === state.personalInfo.uuid) {
        action.data.presence === "online"
          ? (callMeetingData = [])
          : (callMeetingData = ["call/meeting"]);
      }
      if (participant_index !== -1) {
        userData[participant_index].presence = action.data.presence;
        userData[participant_index].last_seen = action.data.last_seen;
        if (activeChat.data.uuid === userData[participant_index].uuid) {
          activeChat.data = userData[participant_index];
        }
      }

      return {
        ...state,
        userData: userData,
        activeChat: activeChat,
        callMeetingData: callMeetingData,
      };
    }

    case ChatActionType.SET_CALL: {
      return {
        ...state,
        setCall: action.data,
      };
    }

    case ChatActionType.FLAG_SET_CALL: {
      return {
        ...state,
        flagSetCall: action.data,
      };
    }

    case ChatActionType.SET_SHARE_MSG_MODAL: {
      return {
        ...state,
        setShareMsgModal: action.data,
      };
    }

    case ChatActionType.SET_ADD_ADMIN_MODAL: {
      return {
        ...state,
        setAddAdminModal: action.data,
      };
    }

    case ChatActionType.SET_TWO_OPTION_MODAL: {
      return {
        ...state,
        setTwoOptionModal: action.data,
      };
    }

    case ChatActionType.UNSET_UNREAD: {
      if (action.isGroup) {
        let groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node) => node.uuid === action.uuid
        );
        groupData[participant_index].unread_msg_count = 0;

        return {
          ...state,
          groupData: groupData,
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex(
          (node) => node.uuid === action.uuid
        );

        userData[participant_index].unread_msg_count = 0;
        return {
          ...state,
          userData: userData,
        };
      }
    }

    case ChatActionType.UPDATE_GROUP_DATA: {
      const groupData = [...state.groupData];
      const activeChat = { ...state.activeChat };
      const participant_index = groupData.findIndex(
        (node) => node.uuid === action.data.uuid
      );

      if (participant_index === -1) {
        groupData.unshift(action.data);
        if (action.isCreate === true) {
          const updated_data = action.data;
          updated_data.messageRecieved = true;
          activeChat.data = updated_data;
          activeChat.isGroup = true;
        }
      } else {
        groupData[participant_index] = action.data;
        if (activeChat.data.uuid === action.data.uuid) {
          const updated_data = action.data;
          updated_data.messageRecieved = true;
          activeChat.data = updated_data;
        }
      }

      return {
        ...state,
        groupData: groupData,
        activeChat: activeChat,
      };
    }

    case ChatActionType.IS_SCROLLED: {
      if (action.isGroup) {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node) => node.uuid === action.data
        );
        if (participant_index !== -1) {
          groupData[participant_index].scrollPos = action.scrollPos;
        }

        return {
          ...state,
          groupData: groupData,
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex(
          (node) => node.uuid === action.data
        );
        if (participant_index !== -1) {
          userData[participant_index].scrollPos = action.scrollPos;
        }

        return {
          ...state,
          userData: userData,
        };
      }
    }
    case ChatActionType.SET_CHAT_BY_UUID: {
      let userChat = state.userData.find(
        (node: any) => node.uuid === action.uuid
      );
      let userData = [...state.userData];
      let participant_index = userData.findIndex(
        (node: any) => node.uuid === action.uuid
      );

      if (userChat && participant_index !== -1) {
        userData[participant_index] = action.data;

        userChat = action.data as IUserData;
        userChat.messageRecieved = true;
        return {
          ...state,
          activeChat: {
            data: { ...userChat },
            isGroup: false,
          },
          userData: userData,
        };
      } else {
        let groupChat = state.groupData.find(
          (node: any) => node.uuid === action.uuid
        );
        let groupData = [...state.groupData];
        let participant_index = groupData.findIndex(
          (node: any) => node.uuid === action.uuid
        );

        if (groupChat && participant_index !== -1) {
          groupData[participant_index] = action.data;
          groupChat = action.data;
          if (groupChat) groupChat.messageRecieved = true;

          return {
            ...state,
            activeChat: {
              data: { ...groupChat },
              isGroup: true,
            },
            groupData: groupData,
          };
        } else {
          if (action.data.isGroup) {
            let groupData = [...state.groupData];
            let data = action.data;
            data.messageRecieved = true;
            groupData.unshift(data);
            return {
              ...state,
              groupData: groupData,
              activeChat: {
                data: { ...action.data },
                isGroup: true,
              },
            };
          } else {
            let userData = [...state.userData];
            let data = action.data;
            data.messageRecieved = true;

            userData.unshift(data);
            return {
              ...state,
              userData: userData,
              activeChat: {
                data: { ...action.data },
                isGroup: false,
              },
            };
          }
        }
      }
    }

    case ChatActionType.SET_DRAFT_MESSAGE: {
      if (action.isGroup) {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node) => node.uuid === action.uuid
        );
        if (participant_index !== -1) {
          groupData[participant_index].draft = action.draftText;
        }

        return {
          ...state,
          groupData: groupData,
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex(
          (node) => node.uuid === action.uuid
        );
        if (participant_index !== -1) {
          userData[participant_index].draft = action.draftText;
        }

        return {
          ...state,
          userData: userData,
        };
      }
    }
    case ChatActionType.REMOVE_GROUP_MEMBER: {
      const groupData = [...state.groupData];
      const activeChat = { ...state.activeChat };

      const participant_index = groupData.findIndex(
        (node) => node.uuid === action.data.group_uuid
      );
      if (participant_index !== -1) {
        const removedMemberIndex = groupData[
          participant_index
        ].members.findIndex((node) => node.user_id === action.data.member);

        if (removedMemberIndex !== -1) {
          groupData[participant_index].inactive_members.push(
            groupData[participant_index].members[removedMemberIndex]
          );
          groupData[participant_index].members.splice(removedMemberIndex, 1);
          if (groupData[participant_index].admin.includes(action.data.member)) {
            groupData[participant_index].admin.splice(
              groupData[participant_index].admin.indexOf(action.data.member),
              1
            );
          }
          // groupData[participant_index].members = JSON.parse(JSON.stringify(tempMembers))

          if (state.personalInfo.uuid === action.data.member) {
            groupData[participant_index].status = "inactive";
            groupData[participant_index].call_details = null;
          }
          // groupData[participant_index].members = newMemberList;
        }
      }

      if (activeChat.data.uuid === action.data.group_uuid) {
        activeChat.data = groupData[participant_index];
      }

      return {
        ...state,
        groupData: groupData,
        activeChat: activeChat,
      };
    }
    case ChatActionType.ALIGN_ONE_SIDE: {
      return {
        ...state,
        alignOneSide: action.data,
      };
    }
    case ChatActionType.SET_CHAT_MESSAGE: {
      const activeChat = { ...state.activeChat };

      if (!action.isGroup) {
        const userData = [...state.userData];
        const participant_index = userData.findIndex(
          (node) => action.uuid === node.uuid
        );

        if (participant_index != -1) {
          userData[participant_index].messages = [...action.data.messages];
          userData[participant_index].pinned_messages = [
            ...action.data.pinned_messages,
          ];
          userData[participant_index].messageRecieved = true;
        }
        if (activeChat.data.uuid === action.uuid) {
          activeChat.data = userData[participant_index];
        }
        return {
          ...state,
          userData: [...userData],
          activeChat: activeChat
            
        };
      } else {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node) => action.uuid === node.uuid
        );
        if (participant_index != -1) {
          if (action.data.messages)
            groupData[participant_index].messages = [...action.data.messages];
          if (action.data.pinned_messages)
            groupData[participant_index].pinned_messages = [
              ...action.data.pinned_messages,
            ];
          if (action.data.members)
            groupData[participant_index].members = [...action.data.members];
          if (action.data.inactive_members)
            groupData[participant_index].inactive_members = [
              ...action.data.inactive_members,
            ];
          groupData[participant_index].messageRecieved = true;
        }
        if (activeChat.data.uuid === action.uuid) {
          activeChat.data = groupData[participant_index];
        }

        return {
          ...state,
          groupData: [...groupData],
          activeChat:  activeChat
        };
      }
    }
    case ChatActionType.ADD_NEW_CHAT: {
      const notExist = [...state.groupData, ...state.userData].every(
        (chat: any) => {
          if (action.data.data.api_response) {
            return chat.uuid != action.data.data.api_response.uuid;
          } else {
            return chat.uuid != action.data.data.uuid;
          }
        }
      );
      if (
        action.data.isGroup &&
        notExist &&
        (action?.data?.data?.api_response?.uuid || action?.data?.data?.uuid)
      ) {
        let groupData = [...state.groupData];
        const updated_data = action.data.data.api_response ?? action.data.data;
        updated_data.messageRecieved = true;
        groupData.unshift(updated_data);
        if (action.setActive) {
          return {
            ...state,
            groupData: groupData,
            activeChat: {
              data: action.data.data.api_response
                ? { ...action.data.data.api_response }
                : { ...action.data.data },
              isGroup: action.data.isGroup,
            },
          };
        } else {
          return {
            ...state,
            groupData: groupData,
          };
        }
      } else if (
        notExist &&
        (action?.data?.data?.api_response?.uuid || action?.data?.data?.uuid)
      ) {
        let userData = [...state.userData];
        const updated_data =
          action.data.data?.api_response ?? action.data?.data;
        updated_data.messageRecieved = true;
        userData.unshift(updated_data);
        if (action.setActive) {
          return {
            ...state,
            userData: userData,
            activeChat: {
              data: action.data.data.api_response
                ? { ...action.data.data?.api_response }
                : { ...action.data.data },
              isGroup: action.data.isGroup,
            },
          };
        } else {
          return {
            ...state,
            userData: userData,
          };
        }
      } else {
        return {
          ...state,
        };
      }
    }
    case ChatActionType.ADD_GROUP_MEMBER: {
      const groupData = [...state.groupData];
      const activeChat = { ...state.activeChat };
      const participant_index = groupData.findIndex(
        (node) => node.uuid === action.data.group_uuid
      );
      if (participant_index !== -1) {
        groupData[participant_index].members.push(action.data.member_info);
      }

      const filteredJsonArray = groupData[
        participant_index
      ].inactive_members.filter(
        (item: any) => item.user_id !== action.data.member_info.user_id
      );

      groupData[participant_index].inactive_members = filteredJsonArray;

      if (activeChat.data.uuid === action.data.group_uuid) {
        activeChat.data = groupData[participant_index];
      }
      if (state.personalInfo.uuid === action.data.member) {
        groupData[participant_index].status = "active";
      }

      return {
        ...state,
        groupData: groupData,
        activeChat: activeChat,
      };
    }
    case ChatActionType.SET_ATTACHMENT: {
      if (action.isGroup) {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node) => node.uuid === action.uuid
        );
        if (participant_index !== -1) {
          groupData[participant_index].files = action.files;
        }

        return {
          ...state,
          groupData: groupData,
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex(
          (node) => node.uuid === action.uuid
        );
        if (participant_index !== -1) {
          userData[participant_index].files = action.files;
        }

        return {
          ...state,
          userData: userData,
        };
      }
    }
    case ChatActionType.SET_ATTACHMENT_URL: {
      if (action.isGroup) {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node) => node.uuid === action.uuid
        );
        if (participant_index !== -1) {
          groupData[participant_index].files[action.index].url = action.url;
          groupData[participant_index].files[action.index].progress = 100;
          const isFullyLoaded = groupData[participant_index].files.every(
            (item: any) => item.progress === 100 || item.cancelled
          );
          state.chatInstance.grafanaLogger([
            "Client : File upload groupData attachment",
            {
              uploadingStatus: isFullyLoaded,
            },
          ]);
          groupData[participant_index].uploading = !isFullyLoaded;
        }

        return {
          ...state,
          groupData: groupData,
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex(
          (node) => node.uuid === action.uuid
        );

        if (participant_index !== -1) {
          userData[participant_index].files[action.index].url = action.url;
          userData[participant_index].files[action.index].progress = 100;

          const isFullyLoaded = userData[participant_index].files.every(
            (item: any) => item.progress === 100 || item.cancelled
          );
          state.chatInstance.grafanaLogger([
            "Client : File upload userData attachment",
            {
              uploadingStatus: isFullyLoaded,
            },
          ]);
          userData[participant_index].uploading = !isFullyLoaded;
        }

        return {
          ...state,
          userData: userData,
        };
      }
    }

    case ChatActionType.SET_UPLOADING_FAILED: {
      if (action.isGroup) {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node) => node.uuid === action.uuid
        );
        if (participant_index !== -1) {
          groupData[participant_index].files[action.index].failed = true;
          groupData[participant_index].files[action.index].progress = 100;
        }

        return {
          ...state,
          groupData: groupData,
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex(
          (node) => node.uuid === action.uuid
        );

        if (participant_index !== -1) {
          userData[participant_index].files[action.index].failed = true;
          userData[participant_index].files[action.index].progress = 100;
        }

        return {
          ...state,
          userData: userData,
        };
      }
    }
    case ChatActionType.SET_UPLOADING_STATUS: {
      const activeChat = { ...state.activeChat };

      if (action.isGroup) {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node) => node.uuid === action.uuid
        );
        if (participant_index !== -1) {
          groupData[participant_index].uploading = action.status;
          state.chatInstance.grafanaLogger([
            "Client : File upload groupData upload status",
            {
              uploadingStatus: action?.status,
            },
          ]);
        }

        if (activeChat.data.uuid === action.uuid) {
          activeChat.data = groupData[participant_index];
        }

        return {
          ...state,
          groupData: groupData,
          activeChat: activeChat,
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex(
          (node) => node.uuid === action.uuid
        );
        if (participant_index !== -1) {
          state.chatInstance.grafanaLogger([
            "Client : File upload userData upload status",
            {
              uploadingStatus: action?.status,
            },
          ]);
          userData[participant_index].uploading = action.status;
        }
        if (activeChat.data.uuid === action.uuid) {
          activeChat.data = userData[participant_index];
        }

        return {
          ...state,
          userData: userData,
          activeChat: activeChat,
        };
      }
    }
    case ChatActionType.SET_INCOMING_CALL: {
      return {
        ...state,
        incomingCall: action.data,
        setIncomingCallModal: true,
      };
    }
    case ChatActionType.UNSET_INCOMING_CALL: {
      if (
        (action.id && state.incomingCall.from === action.id) ||
        action.id === state.incomingCall.body.meetingId
      ) {
        return {
          ...state,
          incomingCall: null,
          setIncomingCallModal: false,
        };
      } else {
        if (action.isCurrentCall) {
          return {
            ...state,
            incomingCall: null,
            setIncomingCallModal: false,
          };
        } else {
          return {
            ...state,
            setIncomingCallModal: false,
          };
        }
      }
    }

    case ChatActionType.INCOMING_CALL_MODAL: {
      return {
        ...state,
        setIncomingCallModal: action.data,
      };
    }
    case ChatActionType.UNSET_ACTIVE_CHAT: {
      return {
        ...state,
        activeChat: {
          data: {},
          isGroup: false,
        },
      };
    }
    case ChatActionType.SET_ARROWUP_EDIT: {
      const lastMessage = state.activeChat.data.messages.findLast(
        (el: IMessage) => el.from === state.personalInfo.uuid
      );
      return {
        ...state,
        edit: lastMessage?.uuid || "",
      };
    }

    case ChatActionType.SET_TYPING_INDICATOR: {
      const activeChat = { ...state.activeChat };

      if (action.data.isGroup) {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex((node) =>
          [action.data.message.to].includes(node.uuid)
        );
        if (participant_index !== -1) {
          groupData[participant_index].isTyping = action.data.message.body.uuid;
        }

        if (groupData[participant_index].uuid === state.activeChat.data.uuid) {
          activeChat.data = groupData[participant_index];
        }

        return {
          ...state,
          groupData: groupData,
          activeChat: activeChat,
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex((node) =>
          [action.data.message.from].includes(node.uuid)
        );
        if (participant_index !== -1) {
          userData[participant_index].isTyping = action.data.message.body.uuid;
        }
        if (userData[participant_index].uuid === state.activeChat.data.uuid) {
          activeChat.data = userData[participant_index];
        }

        return {
          ...state,
          userData: userData,
          activeChat: activeChat,
        };
      }
    }

    case ChatActionType.UNSET_TYPING_INDICATOR: {
      const activeChat = { ...state.activeChat };
      if (action.data.isGroup) {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );
        if (participant_index !== -1) {
          groupData[participant_index].isTyping = null;
        }

        if (groupData[participant_index].uuid === state.activeChat.data.uuid) {
          activeChat.data = groupData[participant_index];
        }

        return {
          ...state,
          groupData: groupData,
          activeChat: activeChat,
        };
      } else {
        const userData = [...state.userData];
        const participant_index = userData.findIndex((node) =>
          [action.data.message.to, action.data.message.from].includes(node.uuid)
        );
        if (participant_index !== -1) {
          userData[participant_index].isTyping = null;
        }
        if (userData[participant_index].uuid === state.activeChat.data.uuid) {
          activeChat.data = userData[participant_index];
        }

        return {
          ...state,
          userData: userData,
          activeChat: activeChat,
        };
      } //HANDLE_MESSAGES_IN_LIMBO
    }
    case ChatActionType.HANDLE_MESSAGES_IN_LIMBO: {
      const activeChat = { ...state.activeChat };
      if (action.isGroup) {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node: any) => node.uuid === action.data.uuid
        );

        if (participant_index !== -1) {
          if (!groupData[participant_index].cachedMessages) {
            groupData[participant_index].cachedMessages = [
              ...groupData[participant_index].messages,
            ];
          }
          groupData[participant_index].messages = [...action.data.messages];
        }

        if (groupData[participant_index].uuid === state.activeChat.data.uuid) {
          activeChat.data = groupData[participant_index];
        }

        return {
          ...state,
          groupData: groupData,
          activeChat: activeChat,
        };
      } else {
        const userData = [...state.userData];

        const participant_index = userData.findIndex(
          (node: any) => node.uuid === action.data.uuid
        );

        if (participant_index !== -1) {
          if (!userData[participant_index].cachedMessages) {
            userData[participant_index].cachedMessages = [
              ...userData[participant_index].messages,
            ];
          }
          userData[participant_index].messages = [...action.data.messages];
        }
        if (userData[participant_index].uuid === state.activeChat.data.uuid) {
          activeChat.data = userData[participant_index];
        }
        // activeChat.data.cachedMessages =  [...activeChat.data.messages]
        // activeChat.data.messages = [...action.data.messages]

        return {
          ...state,
          userData: userData,
          activeChat: activeChat,
        };
      }
    }
    case ChatActionType.ARCHIVE_GROUP: {
      const groupData = [...state.groupData];
      const activeChat = { ...state.activeChat };
      const participant_index = groupData.findIndex(
        (node) => node.uuid === action.uuid
      );

      if (participant_index !== -1) {
        groupData[participant_index].status = "archive";
      }

      if (activeChat.data.uuid === action.uuid) {
        // activeChat.data = groupData[participant_index];
        activeChat.data.status = "archive";
        activeChat.data.archive_members = activeChat.data.members;
      }

      return {
        ...state,
        groupData: groupData,
        activeChat: { ...activeChat },
      };
    }

    case ChatActionType.HANDLE_PIN_MESSAGE: {
      console.log("pin_message1", action);
      const activeChat = { ...state.activeChat };
      if (action.isGroup) {
        const groupData = [...state.groupData];

        const participant_index = groupData.findIndex(
          (node: any) => node.uuid === action.data
        );
        if (participant_index !== -1) {
          const message_index = groupData[participant_index].messages.findIndex(
            (message: any) => message.uuid === action.messageUUID
          );
          if (message_index !== -1) {
            if (groupData[participant_index].messages[message_index].pinned) {
              groupData[participant_index].messages[message_index].pinned_by =
                "undefined";
              groupData[participant_index].pinned_messages = groupData[
                participant_index
              ].pinned_messages.filter((el) => el.uuid !== action.messageUUID);
            } else {
              // groupData[participant_index]?.pinned_messages?.push(groupData[participant_index].messages[message_index])
              if (groupData[participant_index]?.pinned_messages)
                groupData[participant_index]?.pinned_messages?.unshift(
                  action.pinnedMessage
                );
              else
                groupData[participant_index].pinned_messages =
                  action.pinnedMessage;
              groupData[participant_index].messages[message_index].pinned_by =
                action.pinnedBy;
            }
            groupData[participant_index].messages[message_index].pinned =
              !groupData[participant_index].messages[message_index].pinned;
          } else {
            if (action.isPin && action.pinnedMessage) {
              groupData[participant_index].pinned_messages.unshift(
                action.pinnedMessage
              );
            } else if (!action.isPin) {
              groupData[participant_index].pinned_messages = groupData[
                participant_index
              ].pinned_messages.filter((el) => el.uuid !== action.messageUUID);
            }
          }
          if (
            groupData[participant_index].uuid === state.activeChat.data.uuid
          ) {
            activeChat.data = groupData[participant_index];
          }
        }

        return {
          ...state,
          groupData: groupData,
          activeChat: activeChat,
        };
      } else {
        const userData = [...state.userData];

        const participant_index = userData.findIndex(
          (node: any) => node.uuid === action.data
        );
        if (participant_index !== -1) {
          const message_index = userData[participant_index].messages.findIndex(
            (message: any) => message.uuid === action.messageUUID
          );
          if (message_index !== -1) {
            if (userData[participant_index].messages[message_index].pinned) {
              userData[participant_index].messages[message_index].pinned_by =
                "undefined";
              userData[participant_index].pinned_messages = userData[
                participant_index
              ].pinned_messages.filter((el) => el.uuid !== action.messageUUID);
            } else {
              userData[participant_index].pinned_messages.unshift(
                userData[participant_index].messages[message_index]
              );
              userData[participant_index].messages[message_index].pinned_by =
                action.pinnedBy;
            }
            userData[participant_index].messages[message_index].pinned =
              !userData[participant_index].messages[message_index].pinned;
          } else {
            if (action.isPin && action.pinnedMessage) {
              userData[participant_index].pinned_messages.unshift(
                action.pinnedMessage
              );
            } else if (!action.isPin) {
              userData[participant_index].pinned_messages = userData[
                participant_index
              ].pinned_messages.filter((el) => el.uuid !== action.messageUUID);
            }
          }
        }

        if (userData[participant_index].uuid === state.activeChat?.data?.uuid) {
          activeChat.data = userData[participant_index];
        }
        // activeChat.data.cachedMessages =  [...activeChat.data.messages]
        // activeChat.data.messages = [...action.data.messages]

        return {
          ...state,
          userData: userData,
          activeChat: activeChat,
        };
      }
    }

    case ChatActionType.KICK_OUT: {
      return {
        ...state,
        kickOut: action.data,
      };
    }
    case ChatActionType.MESSAGE_DELIVERED: {
      return {
        ...state,
        messageDelivered: action.data,
      };
    }
    case ChatActionType.CALL_DATA: {
      return {
        ...state,
        callData: action.data,
      };
    }
    case ChatActionType.UPDATE_CACHED_MESSAGES: {
      const userData = [...state.userData];
      const activeChat = { ...state.activeChat };
      const participant_index = userData.findIndex((node) =>
        [action.data.to, action.data.from].includes(node.uuid)
      );
      if (!action.data.isGroup) {
        if (userData[participant_index]?.cachedMessages) {
          if (!action.remove) {
            userData[participant_index].messages =
              userData[participant_index]?.cachedMessages || [];
          }
          userData[participant_index].cachedMessages = undefined;
        }
        if (
          userData[participant_index]?.uuid === state?.activeChat?.data?.uuid
        ) {
          activeChat.data = userData[participant_index];
        }
      } else {
        const groupData = [...state.groupData];
        const participant_index = groupData.findIndex(
          (node: any) => node.uuid === action.data.to
        );
        if (groupData[participant_index]?.cachedMessages) {
          if (!action.remove) {
            groupData[participant_index].messages =
              groupData[participant_index]?.cachedMessages || [];
          }
          groupData[participant_index].cachedMessages = undefined;
        }
        if (
          groupData[participant_index]?.uuid === state?.activeChat?.data?.uuid
        ) {
          activeChat.data = groupData[participant_index];
        }
      }
      return {
        ...state,
        userData: userData,
        activeChat: activeChat,
      };
    }
    case ChatActionType.SEARCH_FLAG: {
      return {
        ...state,
        searchFlag: action.data,
      };
    }
    case ChatActionType.HOVERED_MESSAGE: {
      return {
        ...state,
        hoveredMessage: action.data,
      };
    }
    case ChatActionType.UPDATE_OPTIONS: {
      return {
        ...state,
        updateOptions: action.data,
      };
    }
    case ChatActionType.SEARCH_ACTIVE_CHAT: {
      return {
        ...state,
        searchActiveChat: action.data,
      };
    }
    case ChatActionType.CALL_TOGGLE: {
      if (action.data.body.data.isGroup) {
        const groupData = [...state.groupData];
        const activeChat = { ...state.activeChat };
        const participant_index = groupData.findIndex(
          (node: any) => node.uuid === action.data.to
        );
        if (participant_index !== -1) {
          groupData[participant_index].call_details = {
            meeting_id: action.data.body.meetingData.meetingId,
            password: action.data.body.meetingData.password,
            with: action.data.to,
            isGroup: true,
          };
          if (
            groupData[participant_index]?.uuid === state.activeChat?.data?.uuid
          ) {
            activeChat.data = groupData[participant_index];
          }
        }

        return {
          ...state,
          activeChat: activeChat,
          groupData: groupData,
          callToggle: action.data,
        };
      } else {
        const userData = [...state.userData];
        const activeChat = { ...state.activeChat };
        const participant_index = userData.findIndex((node) =>
          [action.data.to, action.data.from].includes(node.uuid)
        );
        console.log(
          "disconnect=issue2222",
          action.data,
          userData[participant_index],
          participant_index
        );
        if (!action.data?.body?.data?.guestMember && participant_index !== -1) {
          console.log(
            "disconnect=issue11",
            action.data,
            userData[participant_index],
            participant_index
          );
          userData[participant_index].call_details = {
            meeting_id: action.data.body.meetingData?.meetingId,
            password: action.data.body.meetingData?.password,
            with: action.data?.to,
            isGroup: false,
            name: userData[participant_index]?.display_name,
            profile_picture: userData[participant_index]?.profile_picture,
          };
        }
        if (
          userData[participant_index]?.uuid === state.activeChat?.data?.uuid
        ) {
          activeChat.data = userData[participant_index];
        }

        return {
          ...state,
          activeChat: activeChat,
          userData: userData,
          callToggle: action.data,
        };
      }
    }
    case ChatActionType.CALL_MEETING_DATA: {
      return {
        ...state,
        callMeetingData: action.data,
      };
    }
    case ChatActionType.SELF_DATA: {
      if (action.data.length) {
        return {
          ...state,
          selfData: action.data?.[0],
        };
      } else {
        return {
          ...state,
        };
      }
    }

    case ChatActionType.REJECT_REASON_MODAL: {
      return {
        ...state,
        rejectReasonModal: action.data,
      };
    }

    case ChatActionType.PINNED_CHAT: {
      return {
        ...state,
        pinnedChat: action.data,
      };
    }

    case ChatActionType.SET_MINI_PROFILE: {
      return {
        ...state,
        setMiniProfile: action.data,
      };
    }

    case ChatActionType.SET_PERSONAL_STATUS: {
      console.log(action.data, "personalStatus111");
      const userData = [...state.userData];
      const participant_index = userData.findIndex(
        (node: any) => node.uuid === action.data.body.user_uuid
      );
      const data = { ...state.selfData };
      console.log(action.data, "personalStatus222");
      if (action.data.event === "remove_personal_status") {
        if (
          state.personalInfo.uuid === action.data.body.user_uuid &&
          data.personal_status
        ) {
          data.personal_status = null;
        } else {
          userData[participant_index].personal_status = null;
        }
        return {
          ...state,
          userData: userData,
          selfData: data,
        };
      } else if (action.data.event === "update_personal_status") {
        console.log(action.data, "personalStatus333");
        if (state.personalInfo.uuid === action.data.body.user_uuid) {
          console.log(action.data, "personalStatus333");
          data.personal_status = [action.data?.body?.personal_status];
        } else {
          console.log(userData, "personalStatus");
          userData[participant_index].personal_status = [
            action.data?.body?.personal_status,
          ];
        }

        return {
          ...state,
          userData: userData,
          selfData: data,
        };
      } else {
        return {
          ...state,
          userData: userData,
        };
      }
    }

    case ChatActionType.CALL_CONNECTED: {
      return {
        ...state,
        callConnected: action.data,
      };
    }
    case ChatActionType.SETACTIVEPLAYING: {
      return {
        ...state,
        activePlaying: action.data,
      };
    }

    case ChatActionType.SET_MEETING_MODAL: {
      return {
        ...state,
        setMeetingModal: action.data,
      };
    }
    case ChatActionType.CALL_TOGGLE_FLAG: {
      return {
        ...state,
        callToggleFlag: action.data,
      };
    }
    case ChatActionType.SET_MINI_UUID: {
      return {
        ...state,
        setMiniUuid: action.data,
      };
    }

    case ChatActionType.SET_MQTT_STATUS: {
      return {
        ...state,
        setMqttStatus: action.data,
      };
    }

    case ChatActionType.SET_NOTIFICATION: {
      return {
        ...state,
        setNotification: action.data,
      };
    }
    case ChatActionType.SET_INVITE_STATE: {
      let userData = [...state.userData];
      const activeChat = { ...state.activeChat };
      const participant_index = userData.findIndex(
        (node) => node.uuid === action.data.uuid
      );
      if (participant_index !== -1 && state.chatCallInfo) {
        userData[participant_index].inviteState = action.data.state;
        if (
          userData[participant_index]?.uuid === state.activeChat?.data?.uuid
        ) {
          activeChat.data.inviteState = action.data.state;
        }
      }

      if (!action.data) {
        userData = state.userData.map((user: any) => {
          user.inviteState = action.data;
          return user;
        });
      }
      return {
        ...state,
        userData: userData,
      };
    }

    case ChatActionType.GOTOFILE: {
      return {
        ...state,
        gotoFile: action.data,
      };
    }

    case ChatActionType.SET_MENTION_UUID: {
      return {
        ...state,
        setMentionUuid: action.data,
      };
    }
    case ChatActionType.CLEAR_CHAT_DATA: {
      let resetState = { ...initialState };
      resetState.chatInstance = state.chatInstance;
      return resetState;
      // {
      //   ...state,
      //   selfData: "",
      //   userData: [],
      //   groupData: [],
      //   activeChat: {
      //      data: {},
      //      isGroup: false,
      //   },
      //   chatCallInfo: null,
      //   incomingCall: null,
      //   setMqttStatus: "",
      // };
    }
    case ChatActionType.CALL_RECONNECTION: {
      return {
        ...state,
        callReconnection: action.data,
      };
    }
    case ChatActionType.UPDATE_USER_EVENT: {
      const userData = [...state.userData];
      const selfInfo = { ...state.selfData };
      const participant_index = userData.findIndex(
        (node) => node.uuid === action.data.body.user_uuid
      );
      const activeChat = { ...state.activeChat };
      if (
        Object.keys(action.data.body).includes("profile_picture") &&
        Object.keys(action.data.body).includes("phone") &&
        Object.keys(action.data.body).includes("display_name")
      ) {
        if (action.data.body.user_uuid === state.selfData.uuid) {
          selfInfo.display_name = action?.data?.body?.display_name;
          selfInfo.phone = action?.data?.body?.phone;
          selfInfo.profile_picture = action?.data?.body?.profile_picture;
        } else if (participant_index !== -1) {
          userData[participant_index].display_name =
            action?.data?.body?.display_name;
          userData[participant_index].phone = action?.data?.body?.phone;
          userData[participant_index].profile_picture =
            action?.data?.body?.profile_picture;
        }
        if (state.activeChat?.data?.uuid === action.data.body.user_uuid) {
          activeChat.data.display_name = action?.data?.body?.display_name;
          activeChat.data.phone = action?.data?.body?.phone;
          activeChat.profile_picture = action?.data?.body?.profile_picture;
        }
      }
      return {
        ...state,
        userData: userData,
        selfData: selfInfo,
        activeChat: activeChat,
      };
    }
    case ChatActionType.ENABLE_DISABLE_EVENT: {
      const USERDATA = [...state.userData];
      const PARTICIPANT_INDEX = USERDATA.findIndex(
        (node) => node.uuid === action.data.body.user_uuid
      );
      const ACTIVECHAT = { ...state.activeChat };

      if (
        PARTICIPANT_INDEX !== -1 &&
        action.data.event === "disable_user_event"
      ) {
        USERDATA[PARTICIPANT_INDEX].status = "disabled";
        USERDATA[PARTICIPANT_INDEX].presence = "offline";
      } else if (
        PARTICIPANT_INDEX !== -1 &&
        action.data.event === "enable_user_event"
      ) {
        USERDATA[PARTICIPANT_INDEX].status = "enabled";
      } else if (
        PARTICIPANT_INDEX !== -1 &&
        action.data.event === "delete_user_event"
      ) {
        USERDATA[PARTICIPANT_INDEX].status = "deleted";
        USERDATA[PARTICIPANT_INDEX].presence = "offline";
      }
      if (state.activeChat?.data?.uuid === action.data.body.user_uuid) {
        if (action.data.event === "disable_user_event") {
          ACTIVECHAT.data.status = "disabled";
          ACTIVECHAT.data.presence = "offline";
        } else if (action.data.event === "enable_user_event") {
          ACTIVECHAT.data.status = "enabled";
        } else if (action.data.event === "enable_user_event") {
          ACTIVECHAT.data.status = "enabled";
          ACTIVECHAT.data.presence = "offline";
        }
      }
      return {
        ...state,
        userData: USERDATA,
        activeChat: ACTIVECHAT,
      };
    }

    case ChatActionType.MEET_CREDENTIALS: {
      return {
        ...state,
        meetCredentials: action,
      };
    }
    case ChatActionType.END_CALL: {
      return {
        ...state,
        endCall: action.data,
      };
    }
    case ChatActionType.SET_MULTIPLE_MSG_SELECT: {
      return {
        ...state,
        setMultipleMsgSelect: action.data,
      };
    }
    case ChatActionType.SET_MULTIPLE_MSG_LIST: {
      let list = [...state.setMultipleMsgList ];
      let chat = [...state.activeChat?.data?.messages];
      if (action.data.checked === true) {
        let data = chat.find((item: any) => item.uuid === action.data.value);
        list.push(data);
      } else if (Object.keys(action.data).length === 0) {
        list = [];
      } else {
        const index = list.findIndex(
          (value: any) => value.uuid === action.data.value
        );
        list.splice(index, 1);
      }
      return {
        ...state,
        setMultipleMsgList: list,
      };
    }

    default:
      return state;
  }
};

export default ChatReducer;
