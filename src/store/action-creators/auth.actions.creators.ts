import { ActionType } from "../action-types";

export const setUser = (user: string) => {
    return {
        type: ActionType.SET_USER,
        payload: user
    }
}

export const setMeetingId = (id:number) =>{
    return {
        type: ActionType.MEETING_ID,
        payload: id
    }
}