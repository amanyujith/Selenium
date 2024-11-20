import { CallActionType } from "../action-types";
import { callDetails } from "../actions";

export const setPbxCallData = (data: {
    type: "incoming" | "outgoing" | null,
    data: {
        user_sil_id?: string,
        caller?: string,
        uuid?: string,
        callee?: string
        name?: string
        profile_picture?: string
        handle_id?: string
        holdButton?: string
        muteButton?: string
    }
    callonHold?: callDetails[] | null
}) => {
    return {
        type: CallActionType.SET_CALL_TYPE,
        data: data
    }
}
export const setIncomingPbxCall = (state: any) => {
    return {
        type: CallActionType.SET_INCOMING_PBX_CALL,
        data: state
    }
}
export const setSilDetails = (data: any) => {
    return {
        type: CallActionType.SET_SIL_DETAILS,
        data: data
    }
}
export const setCallState = (data: any) => {
    return {
        type: CallActionType.SET_CALL_STATE,
        data: data
    }
}
export const setCallTimer = (timeInSec: number, timertype : string) => {
    return {
        type: CallActionType.SET_CALL_TIMER,
        timeInSec,
        timertype
    }
}
export const setContactlist = (data: any) => {
    return {
        type: CallActionType.SET_CONTACT_LIST,
        data: data
    }
}
export const setActiveContact = (data: any) => {
    return {
        type: CallActionType.SET_ACTIVE_CONTACT,
        data: data
    }
}
export const setCallStatus = (data: any) => {
    return {
        type: CallActionType.SET_CALL_STATUS,
        data: data
    }
}
export const setCallHistory = (data: any, table ?: string) => {
    return {
        type: CallActionType.SET_CALL_HISTORY,
        data: data,
        table: table
    }
}
export const clearPbxStore = () => {
  return {
    type: CallActionType.CLEAR_PBX_STORE,
  };
};

export const callButtonState = (data: {
    muteButton: string
    holdButton: string
    addCallButton: boolean
}) => {
  return {
      type: CallActionType.CALL_BUTTON_STATE,
      data : data
  };
};
export const extensionUpdateEvent = (data: any) => {
  return {
      type: CallActionType.EXTENSION_UPDATE,
      data : data
  };
};
export const setActiveCall = (data: any) => {
  return {
      type: CallActionType.SET_ACTIVE_CALL,
      data : data
  };
};
