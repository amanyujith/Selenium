import { act } from "@testing-library/react";
import { setHostControlId, permissionSettings, clearLoginSession } from './../action-creators/main.actions.creators';
import NotificationData from "../../constructors/notification/notificationData";
import arrayManipulationUtil from "../../utils/arrayManipulation";
import { MainActionType } from "../action-types";
import { MainAction } from '../actions';
import screenShare from '../../layout/layout1/components/meetingScreen/screenShare/screenShare';
import { formatWhiteboardData } from '../../utils';

interface MainRepoState {
    meetingID: number;
    meetingInfo: object;
    meetingSession: any;
    participantList: any;
    roomState: string;
    maxTileinSlider: number;
    meetingNotifications: any;
    // homeNotifications: any;
    groupChat: any;
    privateChat: any;
    selfTileIndex: number;
    privateChatParticipant: number;
    privateChatParticipantName: string;
    selfTile: number;
    deviceList: any;
    currentDevice: any;
    reactions: any;
    hostName: string;
    hostID: number
    time: any;
    timeInSec: any;
    modals: any;
    waitingList: any;
    meetingInvite: any;
    participantVideoState: number;
    timerRef: any,
    userName: string,
    videoQuality: string,
    environmentLevel: string,
    loggedInUserInfo: any,
    participantAudioState: number;
    participantScreenShareState: number;
    participantSpeakingState: number;
    speakingList: { participant_id: string, state: boolean }[]
    participantRaiseHandState: number;
    participantListLength: number;
    participantPauseState: number;
    meetingList: any;
    meetingType: string;
    selectedTab: string;
    recentChats: any;
    unReadMessages: {
        isGroup: boolean,
        count: number
    }
    scheduledMeetingInfo: any;
    keyCloakToken: any;
    screenShare: any;
    whiteBoardData: any;
    whiteBoardState: any;
    fileShareModalState: boolean;
    selfParticipantID: number;
    activeChat: any;
    handRaise: any
    selectedDate: any;
    keyCloakLoggedInState: boolean;
    hostControlId: any;
    fileShareState: any;
    screensharePauseListener: any;
    screensharePausePublisher: any;
    shareList: any;
    membersCount: any;
    recordTime: any;
    recordTimeInSec: any;
    toggleLeftbar: string;
    soundAndNotification: any;
    notificationData: any;
    brandingInfo: any;
    setTheme : any;
    themePalette : any;
    disableMouseHoverDetection: boolean;
    isOpen: boolean;
    permissionSettings: any
    tenantData: any;
    authInfo: any;
    clearLoginSession: boolean
}

const initialState = {
    meetingID: 0,
    meetingInfo: {},
    meetingSession: null,
    participantList: [],
    roomState: "",
    maxTileinSlider: 24,
    meetingNotifications: [],
    // homeNotifications: [],
    groupChat: [],
    privateChat: [],
    selfTileIndex: 0,
    privateChatParticipant: 0,
    privateChatParticipantName: 'test',
    selfTile: 0,
    deviceList: [],
    currentDevice: {},
    reactions: [],
    hostName: '',
    time: '00:00:00',
    timeInSec: 0,
    modals: [],
    waitingList: [],
    hostID: 0,
    meetingInvite: {},
    participantVideoState: Date.now(),
    timerRef: null,
    userName: '',
    videoQuality: '',
    environmentLevel: '',
    loggedInUserInfo: {},
    participantAudioState: Date.now(),
    participantScreenShareState: Date.now(),
    participantSpeakingState: Date.now(),
    participantRaiseHandState: Date.now(),
    participantListLength: Date.now(),
    participantPauseState: Date.now(),
    meetingList: [],
    meetingType: '',
    speakingList: [],
    selectedTab: '',
    recentChats: [],
    unReadMessages: {
        isGroup: false,
        count: 0
    },
    scheduledMeetingInfo: {},
    keyCloakToken: {},
    screenShare: [],
    whiteBoardData: [],
    whiteBoardState: '',
    fileShareModalState: false,
    fileShareState: {
        modalState: false,
        hostId: '',
        status: '',
        files: [],
        activeFile: -1,
        activePage: 0
    },
    selfParticipantID: 0,
    activeChat: '',
    handRaise: '',

    selectedDate: Date.now(),
    keyCloakLoggedInState: true,
    hostControlId: '',
    screensharePauseListener: '',
    screensharePausePublisher: '',
    shareList: [],
    membersCount: 0,
    recordTime: '00:00:00',
    recordTimeInSec: 0,
    toggleLeftbar: 'hidden',
    soundAndNotification: [],
    notificationData: '',
    brandingInfo : {},
    setTheme: {},
    themePalette : {},
    disableMouseHoverDetection: false,
    isOpen: false,
    permissionSettings: {},
    tenantData: {},
    authInfo: {},
    clearLoginSession : false
}

const MainReducer = (
    state: MainRepoState = initialState,
    action: MainAction
): MainRepoState => {
    switch (action.type) {
      case MainActionType.SET_MEETING_ID:
        return {
          ...state,
          meetingID: action.id,
        };
      case MainActionType.SET_MEETING_INFO:
        return {
          ...state,
          meetingInfo: action.data,
        };
      case MainActionType.SET_MEETING_SESSION:
        return {
          ...state,
          meetingSession: action.data,
        };
      case MainActionType.SET_PARTICIPANT: {
        let index = 0;
        if (action.data.isPublisher) {
          index = state.participantList.length;
          const new_participant = action.data;
          new_participant.profile_picture =
            state.loggedInUserInfo?.picture ?? null;
          // state.participantList.push(action.data)
          return {
            ...state,
            selfTileIndex: index,
            participantList: [...state.participantList, new_participant],
            selfTile: 1,
            userName: action.data.name,
            selfParticipantID: action.data.participant_id,
          };
        } else if (state.selfTile === 0) {
          let notification = new NotificationData({
            message: `${action.data.name} just joined`,
            type: "success",
            check: "joined",
          });
          let data: any[] = [...state.meetingNotifications, notification];
          // state.participantList.push(action.data)
          return {
            ...state,
            participantList: [...state.participantList, action.data],
            meetingNotifications: data,
          };
        } else {
          //state.participantList.push(action.data)
          return {
            ...state,
            participantList: [...state.participantList, action.data],
          };
        }
      }

      case MainActionType.SET_ROOMSTATE:
        return {
          ...state,
          roomState: action.state,
        };
      case MainActionType.REMOVE_PARTICIPANT: {
        const val = state.participantList.filter(
          (participant: any) =>
            participant.participant_id !== action.data.participant_id
        );

        const updatedRecentChat = state.recentChats.filter(
          (participant: any) =>
            participant.participant_id !== action.data.participant_id
        );

        const updateScreenshare = state.screenShare.filter(
          (participant: any) =>
            participant.participant_id !== action.data.participant_id
        );

        const updateShareList = state.shareList.filter(
          (participant: any) => participant !== action.data.participant_id
        );

        const index = state.privateChat.findIndex(
          (data: any) => data.participant_id === action.data.participant_id
        );
        if (index !== -1) {
          const tempCount = { ...state.unReadMessages };
          tempCount.count = tempCount.count - 1;
          return {
            ...state,
            participantList: val,
            recentChats: updatedRecentChat,
            unReadMessages: tempCount,
            screenShare: updateScreenshare,
            shareList: updateShareList,
          };
        } else {
          return {
            ...state,
            participantList: val,
            recentChats: updatedRecentChat,
            screenShare: updateScreenshare,
            shareList: updateShareList,
          };
        }
      }
      // state.participantList.splice(state.participantList.findIndex((participant: any) =>
      //     participant.participant_id === action.data.participant_id), 1)

      case MainActionType.UPDATE_PARTICIPANT_LIST: {
        if (action.data.type === "speaking" || action.data.type === "pause") {
          state.participantList.every((participant: any) => {
            if (participant.participant_id === action.data.participant_id) {
              participant[action.data.type] = action.data.state;
              return false;
            }
            return true;
          });

          return {
            ...state,
          };
        } else {
          const index = state.participantList.findIndex(
            (data: any) => data.participant_id === action.data.participant_id
          );
          const tempParticipantList = [...state.participantList];
          if (index !== -1) {
            if (
              action.data.type === "screenshare" &&
              !state.participantList[index].isPublisher
            ) {
              const tempScreenshare = [...state.screenShare];
              const tempShareList = [...state.shareList];
              if (action.data.state) {
                //new screenshare
                if (
                  !tempScreenshare.some(
                    (participant: any) =>
                      participant.participant_id ==
                      tempParticipantList[index].participant_id
                  )
                ) {
                  tempScreenshare.unshift(tempParticipantList[index]);
                  tempShareList.unshift(
                    tempParticipantList[index].participant_id
                  );
                }
              } else {
                //stopscreenshare
                const index = tempScreenshare.findIndex(
                  (participant) =>
                    participant.participant_id === action.data.participant_id
                );
                if (index != -1) {
                  tempScreenshare.splice(
                    tempScreenshare.findIndex(
                      (participant) =>
                        participant.participant_id ===
                        action.data.participant_id
                    ),
                    1
                  );
                  tempShareList.splice(
                    tempShareList.findIndex(
                      (participantID) =>
                        participantID === action.data.participant_id
                    ),
                    1
                  );
                }
              }
              tempParticipantList[index][action.data.type] = action.data.state;
              return {
                ...state,
                participantList: tempParticipantList,
                screenShare: tempScreenshare,
                shareList: tempShareList,
              };
            } else {
              tempParticipantList[index][action.data.type] = action.data.state;
              return {
                ...state,
                participantList: tempParticipantList,
              };
            }
          } else {
            return {
              ...state,
            };
          }
        }
      }
      case MainActionType.SET_MAX_TILEINSLIDER:
        return {
          ...state,
          maxTileinSlider: action.tiles,
        };
      case MainActionType.ADD_NOTIFICATION: {
        let data: any[] = [...state.meetingNotifications, action.data];
        return {
          ...state,
          meetingNotifications: data,
        };
      }
      case MainActionType.REMOVE_NOTIFICATION: {
        if (action.id) {
          let data: any[] = [...state.meetingNotifications].filter(
            (item: any) => {
              return action.id !== item.id;
            }
          );
          return {
            ...state,
            meetingNotifications: data,
          };
        } else {
          return {
            ...state,
            meetingNotifications: [],
          };
        }
      }
      // case MainActionType.ADD_HOME_NOTIFICATION: {
      //     let data: any[] = [...state.homeNotifications, action.data]
      //     return {
      //         ...state,
      //         homeNotifications: data
      //     }
      // }
      // case MainActionType.REMOVE_HOME_NOTIFICATION: {
      //     let data: any[] = [...state.homeNotifications].filter((item: any) => {
      //         return action.id !== item.id
      //     })
      //     return {
      //         ...state,
      //         homeNotifications: data
      //     }
      // }
      case MainActionType.ADD_GROUPCHAT: {
        const tempChatArray = [...state.groupChat];
        const index = state.groupChat.findIndex(
          (data: any) => data.timestamp === action.data.timestamp
        );
        if (index === -1) tempChatArray.push(action.data);
        else tempChatArray[index].status = action.data.status;

        if (!state.unReadMessages.isGroup && state.activeChat !== "group") {
          const tempCount = { ...state.unReadMessages };
          tempCount.count = tempCount.count + 1;
          tempCount.isGroup = true;
          return {
            ...state,
            groupChat: tempChatArray,
            unReadMessages: tempCount,
          };
        } else {
          return {
            ...state,
            groupChat: tempChatArray,
          };
        }
      }
      case MainActionType.ADD_PRIVATECHAT: {
        const tempChatArray = [...state.privateChat];
        const index = state.privateChat.findIndex(
          (data: any) => data.timestamp === action.data.timestamp
        );
        const recentChatIndex = state.recentChats.findIndex(
          (data: any) => data.participant_id === action.data.participant_id
        );
        const tempCount = { ...state.unReadMessages };
        const latestChat = { ...action.data };
        if (index === -1) {
          if (state.activeChat === latestChat.participant_id) {
            latestChat.seen = true;
          }
          tempChatArray.push(latestChat);
          if (
            action.data.sender !==
              state.participantList[state.selfTileIndex].participant_id &&
            state.activeChat !== action.data.participant_id
          ) {
            tempCount.count = tempCount.count + 1;
          }
        } else {
          tempChatArray[index].status = action.data.status;
        }

        const tempRecentChats = [...state.recentChats];
        if (recentChatIndex === -1) tempRecentChats.unshift(action.data);
        else tempRecentChats[recentChatIndex].status = action.data.status;

        return {
          ...state,
          privateChat: tempChatArray,
          recentChats: tempRecentChats,
          unReadMessages: tempCount,
        };
      }
      case MainActionType.SET_PRIVATECHAT_PARTICIPANT: {
        return {
          ...state,
          privateChatParticipant: action.id,
          privateChatParticipantName: action.name,
        };
      }
      case MainActionType.DEVICE_LIST: {
        const tempList = action.list;
        return {
          ...state,
          deviceList: tempList,
        };
      }
      case MainActionType.CURRENT_DEVICE: {
        const listcopy = { ...state.currentDevice };
        listcopy.audioInput =
          action.list.audioInput != "unchanged"
            ? action.list.audioInput
            : state.currentDevice.audioInput;
        listcopy.audioOutput =
          action.list.audioOutput != "unchanged"
            ? action.list.audioOutput
            : state.currentDevice.audioOutput;
        listcopy.videoInput =
          action.list.videoInput != "unchanged"
            ? action.list.videoInput
            : state.currentDevice.videoInput;
        return {
          ...state,
          currentDevice: listcopy,
        };
      }
      case MainActionType.ADD_REACTIONS: {
        const tempReactionArray = [...state.reactions];
        const index = state.reactions.findIndex(
          (data: any) => data.timestamp === action.data.timestamp
        );
        if (index === -1) tempReactionArray.push(action.data);
        // else
        //     tempReactionArray[index]['chatType'] = action.data.chatType

        return {
          ...state,
          reactions: tempReactionArray,
        };
      }
      case MainActionType.REMOVE_REACTIONS: {
        const data = [...state.reactions];
        // .filter((item: any) => {
        //     return action.data !== item.timestamp
        // })

        data.shift();

        return {
          ...state,
          reactions: data,
        };
      }
      case MainActionType.SET_HOSTNAME: {
        return {
          ...state,
          hostID: action.id,
          hostName: action.name,
        };
      }
      case MainActionType.SET_UNREAD_PRIVATECHAT: {
        const tempChatArray = [...state.privateChat];
        const tempCount = { ...state.unReadMessages };
        if (tempCount.count > 0) {
          tempChatArray.forEach((item) => {
            if (item.participant_id === action.data && item.seen === false) {
              item.seen = true;
              tempCount.count = tempCount.count - 1;
            }
          });
        }

        return {
          ...state,
          privateChat: tempChatArray,
          unReadMessages: tempCount,
        };
      }
      case MainActionType.SET_UNREAD_GROUPCHAT: {
        if (state.unReadMessages.isGroup) {
          const tempCount = { ...state.unReadMessages };
          tempCount.isGroup = false;
          tempCount.count = tempCount.count - 1;
          return {
            ...state,
            unReadMessages: tempCount,
          };
        } else {
          return {
            ...state,
          };
        }
      }
      case MainActionType.SET_MEETING_TIMER: {
        if (action.timertype === "meeting") {
          let hours: any = Math.floor(action.timeInSec / 3600);
          let minutes: any = Math.floor((action.timeInSec - hours * 3600) / 60);
          let sec: any = action.timeInSec - hours * 3600 - minutes * 60;
          if (hours < 10) {
            hours = "0" + hours;
          }
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          const time = hours + ":" + minutes + ":" + sec;
          if (time < "00:00:09") {
            let disableStatus: boolean = true;
            if (time === "00:00:08") disableStatus = false;
            return {
              ...state,
              timeInSec: action.timeInSec,
              time: time,
              disableMouseHoverDetection: disableStatus,
            };
          } else
            return {
              ...state,
              timeInSec: action.timeInSec,
              time: time,
            };
        } else if (action.timertype === "recording") {
          let hours: any = Math.floor(action.timeInSec / 3600);
          let minutes: any = Math.floor((action.timeInSec - hours * 3600) / 60);
          let sec: any = action.timeInSec - hours * 3600 - minutes * 60;
          if (hours < 10) {
            hours = "0" + hours;
          }
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          const time = hours + ":" + minutes + ":" + sec;
          //
          return {
            ...state,
            recordTimeInSec: action.timeInSec,
            recordTime: time,
          };
        } else {
          return {
            ...state,
          };
        }
      }
      case MainActionType.ADD_MODAL: {
        let modalsArray = [...state.modals];
        let index = modalsArray
          .map((item) => {
            return item.message;
          })
          .indexOf(action.data.message);
        if (index === -1) modalsArray.push(action.data);
        if (action.data.type == "HostMessageVideo") {
          if (state.participantList[0]?.video === false) {
            return {
              ...state,
              modals: modalsArray,
            };
          }
        } else if (action.data.type == "HostMessageAudio") {
          if (state.participantList[0].audio === false) {
            return {
              ...state,
              modals: modalsArray,
            };
          }
        } else {
          return {
            ...state,
            modals: modalsArray,
          };
        }
        return {
          ...state,
        };
      }
      case MainActionType.REMOVE_MODAL: {
        let modalsArray = [];
        //
        if (action.data !== "*") {
          modalsArray = [...state.modals].filter((item: any) => {
            return action.data !== item.id;
          });
        }
        return {
          ...state,
          modals: modalsArray,
        };
      }

      case MainActionType.ADD_TO_WAITING_LIST: {
        const tempList = action.data;
        tempList.loader = false;
        return {
          ...state,
          waitingList: [...state.waitingList, tempList],
        };
      }

      case MainActionType.REMOVE_FROM_WAITING_LIST: {
        let transactions: any = [];
        state.waitingList.map((transaction: any) => {
          const index = action.data.transactions.findIndex(
            (data: any) => data === transaction.transaction_id
          );
          if (index == -1) {
            transactions.push(transaction);
          }
        });
        return {
          ...state,
          waitingList: transactions,
        };
      }

      case MainActionType.UPDATE_WAITING_LIST: {
        const tempList = [...state.waitingList];
        const index = tempList.findIndex((transaction: any) => {
          action.data.includes(transaction.transaction_id);
        });
        if (index !== -1) {
          tempList[index].loader = true;
          return {
            ...state,
            waitingList: [...tempList],
          };
        } else {
          return {
            ...state,
          };
        }
      }

      case MainActionType.CLEAR_WAITING_LIST: {
        return {
          ...state,
          waitingList: [],
        };
      }

      case MainActionType.CLEAR_PARTICIPANT_LIST: {
        return {
          ...state,
          participantList: [],
          screenShare: [],
          meetingInvite: {},
          meetingInfo: {},
          selfParticipantID: 0,
        };
      }

      case MainActionType.SET_MEETING_INVITE: {
        return {
          ...state,
          meetingInvite: action.data,
        };
      }

      case MainActionType.PAUSE_VIDEO: {
        // const tempList = [...state.participantList]
        //
        action.data.participants.forEach((id: string) => {
          const index = state.participantList.findIndex(
            (participant: any) => participant.participant_id === id
          );
          if (index !== -1) {
            state.participantList[index].pause = action.data.pause;
          }
        });
        return {
          ...state,
        };
      }

      // case MainActionType.PARTICIPANT_VIDEO_STATE: {
      //     return {
      //         ...state,
      //         participantVideoState: Date.now()
      //     }
      // }

      case MainActionType.MEETING_TIMER_REF: {
        return {
          ...state,
          timerRef: action.data,
        };
      }

      case MainActionType.CLEAR_MEETING_STORE: {
        //
        return {
          ...state,
          participantList: [],
          roomState: "",
          meetingNotifications: [],
          groupChat: [],
          privateChat: [],
          reactions: [],
          time: "00:00:00",
          modals: [],
          waitingList: [],
          hostName: "",
          hostID: 0,
          shareList: [],
          userName: "",
          meetingList: [],
          selectedTab: "",
          recentChats: [],
          unReadMessages: {
            isGroup: false,
            count: 0,
          },
          screenShare: [],
          whiteBoardData: [],
          whiteBoardState: "",
          handRaise: "",
          hostControlId: "",
          fileShareModalState: false,
          fileShareState: {
            modalState: false,
            hostId: "",
            status: "",
            files: [],
            activeFile: -1,
            activePage: 0,
          },
          screensharePauseListener: "",
          screensharePausePublisher: "",
          disableMouseHoverDetection: false,
          isOpen: false,
        };
      }

      case MainActionType.VIDEO_QUALITY: {
        return {
          ...state,
          videoQuality: action.data,
        };
      }

      case MainActionType.SET_MEETING_ENVIORNEMNT: {
        return {
          ...state,
          environmentLevel: action.data,
        };
      }

      case MainActionType.SET_LOGGEDIN_USER_INFO: {
        let permissionSettings = Object.keys(state.authInfo).length > 0 ? {...state.permissionSettings } : {}
        let authInfo = Object.keys(state.authInfo).length > 0 ? {...state.authInfo } : {}
        let keyCloakToken = state.keyCloakToken 
        if (!action.data) {
          permissionSettings = {}
          authInfo = {}
          keyCloakToken = null
        }
        return {
          ...state,
          loggedInUserInfo: action.data,
          permissionSettings: permissionSettings,
          authInfo: authInfo,
          keyCloakToken: keyCloakToken
        };
      }
      case MainActionType.SET_SPEAKING_STATE: {
        const templist = [...state.speakingList];
        const index = state.speakingList.findIndex(
          (node) => node.participant_id == action.data.participant_id
        );
        if (index === -1) {
          templist.push({
            participant_id: action.data.participant_id,
            state: action.data.state,
          });
          return {
            ...state,
            speakingList: templist,
          };
        } else {
          templist[index].state = action.data.state;
          return {
            ...state,
            speakingList: templist,
          };
        }
      }

      case MainActionType.SET_PARTICIPANT_LIST_FLAGS: {
        if (action.data === "video") {
          return {
            ...state,
            participantVideoState: Date.now(),
          };
        } else if (action.data === "audio") {
          return {
            ...state,
            participantAudioState: Date.now(),
          };
        } else if (action.data === "screenshare") {
          return {
            ...state,
            participantScreenShareState: Date.now(),
          };
        } else if (action.data === "speaking") {
          return {
            ...state,
            participantSpeakingState: Date.now(),
          };
        } else if (action.data === "pause") {
          return {
            ...state,
            participantPauseState: Date.now(),
          };
        } else if (action.data === "raiseHand") {
          return {
            ...state,
            participantRaiseHandState: Date.now(),
          };
        } else if (action.data === "length") {
          return {
            ...state,
            participantListLength: Date.now(),
          };
        } else {
          {
            return state;
          }
        }
      }

      case MainActionType.SET_MEETING_LIST: {
        return {
          ...state,
          // meetingList: action.update ? [...action.meetingList] : [...action.meetingList, ...state.meetingList]
          meetingList: action.meetingList,
        };
      }

      case MainActionType.SET_MEETING_TYPE: {
        return {
          ...state,
          meetingType: action.data,
        };
      }

      case MainActionType.SET_TAB: {
        return {
          ...state,
          selectedTab: action.data,
        };
      }

      case MainActionType.SET_SCHEDULED_MEETING_DETAILS: {
        return {
          ...state,
          scheduledMeetingInfo: action.data,
        };
      }
      case MainActionType.SET_KEYCLOAK_TOKEN: {
        return {
          ...state,
          keyCloakToken: action.data,
        };
      }

      case MainActionType.SELECT_SCREENSHARE: {
        const tempScreenshare = [...state.screenShare];

        arrayManipulationUtil.sort(tempScreenshare, action.index, 0);

        return {
          ...state,
          screenShare: tempScreenshare,
        };
      }

      case MainActionType.ADD_WHITEBOARD_DATA: {
        const tempDataArray = [...state.whiteBoardData];
        if (action.data.shapes.length === 0) {
          tempDataArray[0] = {};
          tempDataArray[1] = {};
          tempDataArray[2] = {};
        } else {
          tempDataArray[0] = formatWhiteboardData(action.data.shapes);
          tempDataArray[1] = formatWhiteboardData(action.data.bindings);
          tempDataArray[2] = formatWhiteboardData(action.data.assets);
        }

        tempDataArray.push(action.data);

        return {
          ...state,
          whiteBoardData: tempDataArray,
        };
      }

      case MainActionType.CLEAR_WHITEBOARD_DATA: {
        return {
          ...state,
          whiteBoardData: [],
        };
      }

      case MainActionType.SET_WHITEBOARD_STATE: {
        const tempShareList = [...state.shareList];
        if (action.data !== "unrestricted" && action.data !== "")
          tempShareList.unshift("whiteboard");
        else if (action.data === "")
          tempShareList.splice(
            tempShareList.findIndex((element) => element === "whiteboard"),
            1
          );
        return {
          ...state,
          whiteBoardState: action.data,
          shareList: tempShareList,
        };
      }
      case MainActionType.SET_SELECTED_DATE: {
        return {
          ...state,
          selectedDate: action.data,
        };
      }

      case MainActionType.ACTIVE_CHAT: {
        return {
          ...state,
          activeChat: action.data,
        };
      }

      case MainActionType.KEYCLOAK_LOGGEDIN_STATE: {
        return {
          ...state,
          keyCloakLoggedInState: action.data,
        };
      }
      case MainActionType.SET_HANDRAISE: {
        return {
          ...state,
          handRaise: action.data,
        };
      }
      case MainActionType.SET_HOSTCONTROL_ID: {
        return {
          ...state,
          hostControlId: action.data,
        };
      }

      case MainActionType.SET_FILESHARE_MODAL_STATE: {
        return {
          ...state,
          fileShareModalState: action.data,
        };
      }
      case MainActionType.SET_FILESHARE_STATE: {
        return {
          ...state,
          fileShareState: action.data,
        };
      }
      case MainActionType.SET_SCREENSHARE_PAUSE_LISTENER: {
        let listeners = [...state.screensharePauseListener];
        if (action.data.content?.pause) {
          if (!listeners.includes(action.data.content?.participant_id))
            listeners.push(action.data.content?.participant_id);
        } else {
          listeners = listeners.filter(
            (node) => node !== action.data.content?.participant_id
          );
        }
        return {
          ...state,
          screensharePauseListener: listeners,
        };
      }
      case MainActionType.SWITCH_SHARELIST: {
        const tempShareList = [...state.shareList];
        if (action.data === "whiteboard") {
          const index = tempShareList.indexOf("whiteboard");
          arrayManipulationUtil.sort(tempShareList, index, 0);
        } else {
          arrayManipulationUtil.sort(tempShareList, 1, 0);
        }
        return {
          ...state,
          shareList: tempShareList,
        };
      }
      // case MainActionType.SET_SCREENSHARE_PAUSE_LISTENER: {

      //   const tempList = [...state.screenShare]
      //   const participantId = action.data.content?.participant_id

      //   const index = state.screenShare?.findIndex((participant: any) => participant?.participant_id === participantId)
      //
      //     if (index !== -1) {
      //

      //         tempList[index].screensharepause = action.data.content?.pause
      //     }
      //     return {
      //         ...state,
      //         screensharePauseListener: action.data,
      //         screenShare : tempList
      //     }
      // }
      case MainActionType.SET_SCREENSHARE_PAUSE_PUBLISHER: {
        return {
          ...state,
          screensharePausePublisher: action.data,
        };
      }

      case MainActionType.SET_MEDIA_STREAM: {
        const index = state.participantList.findIndex(
          (data: any) => data.participant_id === action.id
        );

        let newParticipantList = state.participantList;

        if (index !== -1) {
          if (action.streamType === "video") {
            newParticipantList[index].videoStream = action.stream;
          } else if (action.streamType === "screenshare") {
            newParticipantList[index].screenshareStream = action.stream;
          }
        }

        return {
          ...state,
          participantList: [...newParticipantList],
        };
      }

      case MainActionType.SET_MEMBERS_COUNT: {
        return {
          ...state,
          membersCount: action.count,
        };
      }
      case MainActionType.TOGGLE_LEFTBAR: {
        return {
          ...state,
          toggleLeftbar: action.data,
        };
      }
      case MainActionType.SOUND_AND_NOTIFICATION: {
        return {
          ...state,
          soundAndNotification: action.data,
        };
      }
      case MainActionType.NOTIFICATION_DATA: {
        state.meetingSession.grafanaLogger(
          ["Client : Notification Data Redux"],
          { title: action.data.title, uuid: action.data.uuid }
        );
        return {
          ...state,
          notificationData: action.data,
        };
      }
      case MainActionType.BRANDING_INFO: {
        return {
          ...state,
          brandingInfo: action.data,
        };
      }
      case MainActionType.SET_THEME: {
        return {
          ...state,
          setTheme: action.data,
        };
      }
      case MainActionType.SET_THEME_PALETTE: {
        return {
          ...state,
          themePalette: action.data,
        };
      }

      case MainActionType.SET_CALL_POPUP: {
        if (action.data && !state.disableMouseHoverDetection) {
          return {
            ...state,
            isOpen: action.data,
            disableMouseHoverDetection: true,
          };
        } else {
            return {
                ...state,
                isOpen: action.data,
              };
        }
      }
      case MainActionType.ENABLE_MOUSE_HOVER: {
        return {
          ...state,
          disableMouseHoverDetection: action.data
        }
      }
      case MainActionType.NOTIFICATION_DATA: {
            state.meetingSession.grafanaLogger(['Client : Notification Data Redux'], {title : action.data.title, uuid : action.data.uuid});   
            return {
                ...state,
                notificationData: action?.data
            }
        }
      case MainActionType.PERMISSION_SETTINGS: {
        return {
            ...state,
            permissionSettings: action.data
        }
      }
    case MainActionType.AUTHENCATION_DATA: {
      return {
        ...state,
        authInfo: action.data,
      };
    }
    case MainActionType.TENANT_DATA: {
      return {
        ...state,
        tenantData: action.data,
      };
    }
      case MainActionType.CLEAR_LOGIN_SESSION: {
      return {
        ...state,
        clearLoginSession: action.data,
      };
    }
      default:
        return state;
    }
};

export default MainReducer;