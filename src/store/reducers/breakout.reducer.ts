import { BreakOutActionType } from "../action-types";
import { BreakOutAction } from "../actions";

interface BreakOutRepoState {
  createRoomModal: boolean;
  roomDurationModal: any;
  roomDuration: any;
  custom: any;
  manageRoomsModal: boolean;
  roomsList: any;
  addMemberBox: any;
  membersLists: any;
  setRoom: any;
  flagSetRoom: any;
  threeDotMenu: any;
  addMemberModal: boolean;
  guestJoinRoomModal: boolean;
}

const initialState = {
  createRoomModal: false,
  roomDurationModal: -1,
  roomDuration: [],
  custom: -1,
  manageRoomsModal: false,
  roomsList: [],
  addMemberBox: -1,
  membersLists: [],
  setRoom: "",
  flagSetRoom: false,
  threeDotMenu: -1,
  addMemberModal: false,
  guestJoinRoomModal: false,
};

const BreakoutReducer = (
  state: BreakOutRepoState = initialState,
  action: BreakOutAction
): BreakOutRepoState => {
  switch (action.type) {
    case BreakOutActionType.SET_CREATE_ROOM_MODAL:
      return {
        ...state,
        createRoomModal: action.data,
      };

    case BreakOutActionType.SET_ROOM_DURATION_MODAL:
      return {
        ...state,
        roomDurationModal: action.data,
      };

    case BreakOutActionType.SET_ROOM_DURATION:
      return {
        ...state,
        roomDuration: action.data,
      };
    case BreakOutActionType.SET_CUSTOM:
      return {
        ...state,
        custom: action.data,
      };
    case BreakOutActionType.SET_MANAGE_ROOMS_MODAL:
      return {
        ...state,
        manageRoomsModal: action.data,
      };
    case BreakOutActionType.ROOMS_LIST:
      return {
        ...state,
        roomsList: action.data,
      };
    case BreakOutActionType.SET_ADD_MEMBER_BOX:
      return {
        ...state,
        addMemberBox: action.data,
      };
    case BreakOutActionType.SET_MEMBERS_LISTS:
      let temp = [...state.roomsList];
      temp[state.addMemberBox].members = action.data;
      return {
        ...state,
        roomsList: temp,
      };
    case BreakOutActionType.SET_ROOM:
      return {
        ...state,
        setRoom: action.data,
      };
    case BreakOutActionType.FLAG_SET_ROOM:
      return {
        ...state,
        flagSetRoom: action.data,
      };
    case BreakOutActionType.SET_THREE_DOT_MENU:
      return {
        ...state,
        threeDotMenu: action.data,
      };
    case BreakOutActionType.SET_ADD_MEMBER_MODAL:
      return {
        ...state,
        addMemberModal: action.data,
      };
    case BreakOutActionType.SET_GUEST_JOIN_ROOM_MODAl:
      return {
        ...state,
        guestJoinRoomModal: action.data,
      };

    default:
      return state;
  }
};
export default BreakoutReducer;
