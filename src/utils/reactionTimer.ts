import { actionCreators } from "../store"

const startTimer = (dispatch: any, time: any) => {
    setTimeout(() => {
        dispatch(actionCreators.removeReaction())
    }, time)
}
const addReactions = (dispatch: any, data: any, time: any) => {
    dispatch(actionCreators.addReactions(data))
    startTimer(dispatch, time)
}

export default addReactions;