import { callButtonState } from "../action-creators";
import { CallActionType } from "../action-types";
import { CallAction, callDetails } from '../actions';



interface CallRepoState {
    pbxCallData:  {
        type: "incoming" | "outgoing" | null,
        conference ?: boolean,
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
        callonHold?: callDetails[] | null,
    },
    incomingPbxCall: any;
    silDetails: any;
    callState: string;
    timeInSec: number;
    time: string;
    contactList: any
    activeContact: any
    callStatus: string
    callHistory: any
    callButtonState: {
        muteButton: string,
        holdButton: string
        addCallButton: boolean
    },
    activeCall : any
}

const initialState = {
    pbxCallData: {
        type: null,
        conference : false,
        data: {},
        callonHold : null
    },
    incomingPbxCall: [],
    silDetails: {},
    callState: "inactive",
    timeInSec : 0,
    time: '00:00:00',
    contactList: [],
    activeContact: {},
    callStatus: "",
    callHistory: [],
    callButtonState: {
        muteButton: "Mute",
        holdButton: "Hold",
        addCallButton: false
    },
    activeCall : false,
}

const CallReducer = (
    state: CallRepoState = initialState,
    action: CallAction
): CallRepoState => {
    switch(action.type) {
        case CallActionType.SET_CALL_TYPE:
            return {
                ...state,
                pbxCallData: action.data
            };
        case CallActionType.SET_INCOMING_PBX_CALL:
            return {
                ...state,
            incomingPbxCall: action.data ? [action.data] : null
            };
           case CallActionType.SET_SIL_DETAILS:
            return {
                ...state,
                silDetails: action.data
            };
          case CallActionType.SET_CALL_STATE:
            return {
                ...state,
                callState: action.data
            };
          case CallActionType.SET_CALL_TIMER:
          let hours: any = Math.floor(action.timeInSec / 3600);
          let minutes: any = Math.floor((action.timeInSec - hours * 3600) / 60);
            let sec: any = action.timeInSec - hours * 3600 - minutes * 60;
            console.log('PbxCallCheckRedux')
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
            return {
              ...state,
              timeInSec: action.timeInSec,
              time: time,
            };
        case CallActionType.SET_CONTACT_LIST:
            return {
                ...state,
                contactList: action.data
            };
      case CallActionType.SET_ACTIVE_CONTACT:
        const contacts = [...state.contactList]
        const activeContact  =  contacts.find((user : any)=> user.id === action.data)
            return {
                ...state,
                activeContact: activeContact
            };
      case CallActionType.SET_CALL_STATUS:
            return {
                ...state,
                callStatus: action.data
            };
        case CallActionType.SET_CALL_HISTORY:
            if (action.table === 'contactinfo') {
                const activeContact = {...state.activeContact}
                activeContact.call_history = action.data
                  return {
                ...state,
                activeContact: activeContact
            };
            } else{
            return {
                ...state,
                callHistory: action.data
                };
            }
     case CallActionType.CLEAR_PBX_STORE:
            return {
                ...initialState,
            };
     case CallActionType.CALL_BUTTON_STATE:
            return {
                ...state,
                callButtonState : action.data

            };
     case CallActionType.SET_ACTIVE_CALL:
            return {
                ...state,
                activeCall : action.data

            };
        case CallActionType.EXTENSION_UPDATE:
            const CONTACTS = [...state.contactList]
            const SILDETAILS = {...state.silDetails}
            const ACTIVECONTACT = {...state.activeContact}
            const PARTICIPANT_INDEX = CONTACTS.findIndex((contact: any) => contact.hoolva_user === action.data.body.user_uuid)
            if (PARTICIPANT_INDEX !== -1) {
                CONTACTS[PARTICIPANT_INDEX].id = action.data.body.extension
            } else if (state.silDetails.hoolva_user === action.data.body.user_uuid) {
                SILDETAILS.id = action.data.body.extension
            }
            if (state.activeContact.hoolva_user === action.data.body.user_uuid) {
                ACTIVECONTACT.id = action.data.body.extension
            }

            return {
                ...state,
                contactList: CONTACTS,
                silDetails: SILDETAILS,
                activeContact: ACTIVECONTACT
            };
        default:
            return state;
    }
};
export default CallReducer;
