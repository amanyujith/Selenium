import { ActionType } from "../action-types";
import { Action } from '../actions';
interface AuthRepoState {
    user: string;
    meetingId:number
}

const initialState = {
    user: "Ashok",
    meetingId:0
}

const AuthReducer = (
    state: AuthRepoState = initialState,
    action: Action
): AuthRepoState => {
    switch(action.type) {
        case ActionType.SET_USER:
            return {
                ...state,
                user: action.payload
            };
            case ActionType.MEETING_ID:
                return {
                    ...state,
                    meetingId: action.payload
                };
        default:
            return state;
    }
};
export default AuthReducer;
