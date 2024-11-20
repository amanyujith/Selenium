import { setAcitveChat } from './../action-creators/chat.actions.creators';
import { callButtonState} from './../action-creators/call.action.creators';
import { CallActionType } from "../action-types";

export interface callDetails {
            user_sil_id?: string,
            caller?: string,
            uuid?: string,
            callee?: string,
            name?: string,
            profile_picture?: string,
            handle_id?: string,
            holdButton?: string
            muteButton?: string
}

interface setPbxCallData {
    type: CallActionType.SET_CALL_TYPE;
    data: {
        type: "incoming" | "outgoing" | null,
        data: {
            user_sil_id?: string,
            caller?: string,
            uuid?: string,
            callee?: string,
            name?: string
            profile_picture?: string
            handle_id?: string
            holdButton?: string
            muteButton?: string
        },
        callonHold?: callDetails[] | null
    },
}

interface setIncomingPbxCall {
    type: CallActionType.SET_INCOMING_PBX_CALL;
    data: any,
}
interface setSilDetails {
    type: CallActionType.SET_SIL_DETAILS;
    data: any,
}
interface setCallState {
    type: CallActionType.SET_CALL_STATE;
    data: any,
}
interface setCallTimer {
    type: CallActionType.SET_CALL_TIMER;
    timeInSec: number,
    timertype: string
}
interface setContactlist {
    type: CallActionType.SET_CONTACT_LIST;
    data: any
}
interface setActiveContact {
    type: CallActionType.SET_ACTIVE_CONTACT;
    data: any
}
interface setCallStatus {
    type: CallActionType.SET_CALL_STATUS;
    data: any
}
interface setCallHistory {
    type: CallActionType.SET_CALL_HISTORY;
    data: any
    table ?: string
}
interface clearPbxStore {
    type: CallActionType.CLEAR_PBX_STORE;
}
interface callButtonState {
    type: CallActionType.CALL_BUTTON_STATE;
    data: {
        muteButton: string
        holdButton: string
        addCallButton: boolean
    }
}
interface extensionUpdateEvent {
    type: CallActionType.EXTENSION_UPDATE;
    data: any
}
interface setAcitveChat {
    type: CallActionType.SET_ACTIVE_CALL;
    data: any
}


export type CallAction = 
    | setPbxCallData | setIncomingPbxCall | setSilDetails | setCallState | setCallTimer | setContactlist | setActiveContact | setCallStatus | setCallHistory | clearPbxStore | callButtonState | extensionUpdateEvent | setAcitveChat
