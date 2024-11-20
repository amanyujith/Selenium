import { BreakOutActionType } from "../action-types";

export const setCreateRoomModal = (data: boolean) => {
    return {
        type: BreakOutActionType.SET_CREATE_ROOM_MODAL,
        data
    }
}

export const setRoomDurationModal = (data: any) => {
    return {
        type: BreakOutActionType.SET_ROOM_DURATION_MODAL,
        data
    }
}

export const setRoomDuration = (data: any) => {
    return {
        type: BreakOutActionType.SET_ROOM_DURATION,
        data
    }
}
export const setCustom = (data: any) => {
    return {
        type: BreakOutActionType.SET_CUSTOM,
        data
    }
}
export const setManageRoomsModal = (data: boolean) => {
    return {
        type: BreakOutActionType.SET_MANAGE_ROOMS_MODAL,
        data
    }
}
export const setRoomsList = (data: any) => {
    return {
        type: BreakOutActionType.ROOMS_LIST,
        data
    }
}
export const setAddMemberBox = (data: any) => {
    return {
        type: BreakOutActionType.SET_ADD_MEMBER_BOX,
        data
    }
}
export const setMembersLists = (data: any) => {
    return {
        type: BreakOutActionType.SET_MEMBERS_LISTS,
        data
    }
}
export const setRoom = (data: any) => {
    return {
        type: BreakOutActionType.SET_ROOM,
        data
    }
}
export const flagSetRoom = (data: boolean) => {
    return {
        type: BreakOutActionType.FLAG_SET_ROOM,
        data
    }
}
export const setThreeDotMenu = (data: any) => {
    return {
        type: BreakOutActionType.SET_THREE_DOT_MENU,
        data
    }
}
export const setAddMemberModal = (data: boolean) => {
    return {
        type: BreakOutActionType.SET_ADD_MEMBER_MODAL,
        data
    }
}
export const setGuestJoinRoomModal = (data: boolean) => {
    return {
        type: BreakOutActionType.SET_GUEST_JOIN_ROOM_MODAl,
        data
    }
}
