import { ActionType } from "../action-types";

interface SetUertAction {
    type: ActionType.SET_USER;
    payload: string,
}

interface setmeet {
    type: ActionType.MEETING_ID;
    payload: number,
}

export type Action = 
    | SetUertAction | setmeet