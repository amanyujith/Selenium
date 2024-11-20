import { BreakOutActionType } from "../action-types/";

interface setCreateRoomModal {
    type: BreakOutActionType.SET_CREATE_ROOM_MODAL;
    data: boolean
}
interface setRoomDurationModal {
  type: BreakOutActionType.SET_ROOM_DURATION_MODAL;
  data: any
}
interface setRoomDuration {
  type: BreakOutActionType.SET_ROOM_DURATION;
  data: any
}
interface setCustom {
  type: BreakOutActionType.SET_CUSTOM;
  data: any
}
interface setManageRoomsModal {
  type: BreakOutActionType.SET_MANAGE_ROOMS_MODAL;
  data: boolean
}
interface setRoomsList {
  type: BreakOutActionType.ROOMS_LIST;
  data: any
}
interface setAddMemberBox {
  type: BreakOutActionType.SET_ADD_MEMBER_BOX;
  data: any
}
interface setMembersLists {
  type: BreakOutActionType.SET_MEMBERS_LISTS;
  data: any
}
interface setRoom {
  type: BreakOutActionType.SET_ROOM;
  data: any
}
interface FlagSetRoom {
  type: BreakOutActionType.FLAG_SET_ROOM;
  data: boolean
}
interface setThreeDotMenu {
  type: BreakOutActionType.SET_THREE_DOT_MENU;
  data: any
}
interface setAddMemberModal {
  type: BreakOutActionType.SET_ADD_MEMBER_MODAL;
  data: boolean
}
interface setGuestJoinRoomModal {
  type: BreakOutActionType.SET_GUEST_JOIN_ROOM_MODAl;
  data: boolean
}


export type BreakOutAction =
  | setCreateRoomModal | setRoomDurationModal | setRoomDuration | setManageRoomsModal | setRoomsList | setAddMemberBox | setMembersLists | setRoom
  | FlagSetRoom | setThreeDotMenu | setAddMemberModal | setCustom | setGuestJoinRoomModal
