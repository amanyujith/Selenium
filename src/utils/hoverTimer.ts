import { actionCreators } from "../store";
import Timer from "./UtilTimer/utilTimer";

const hoverTimer = (state: boolean, dispatch: any, recording ?:any) => {
    
    const timer = Timer.getInstance();
    const recordtimer = Timer.getInstance();
    const pbxTimer = Timer.getInstance();
    let currSeconds = 0;
    let hoverTimer = 0;
    let recordSec = 0;
    let pbxSec = 0;
    let dispatchFalseflag = false
    const resetTimer = () => {
        if (!dispatchFalseflag || hoverTimer > 6) {
            dispatch(actionCreators.setIdleState(false))
            dispatchFalseflag = true
        }
        hoverTimer = 0;
    }
    if (state && !recording) {
        timer.addWorker("timer", () => {
            dispatch(actionCreators.setTimer(currSeconds,'meeting'))
            if (hoverTimer > 7) {
                dispatch(actionCreators.setIdleState(true))
                dispatchFalseflag = false
            }
            hoverTimer += 1;
            currSeconds += 1
        },1000)


    
        // timer = setInterval(() => {
        //     dispatch(actionCreators.setTimer(currSeconds))
        //     if (hoverTimer > 7) {
        //         dispatch(actionCreators.setIdleState(true))
        //         dispatchFalseflag = false
        //     }
        //     hoverTimer += 1;
        //     currSeconds += 1
        // }, 1000)
    } else if (state && recording === 'recording') {
        
            recordtimer.addWorker("recordtimer", () => {
                dispatch(actionCreators.setTimer(recordSec, 'recording'))
            recordSec += 1
            }, 1000)
    } else if (state && recording === 'pbxcall') {
          pbxTimer.addWorker("pbxtimer", () => {
              dispatch(actionCreators.setCallTimer(pbxSec, 'pbxcall'))
            pbxSec += 1
        },1000)
    }
    else if(recording === 'recording') {
        recordtimer.stopWorker("recordtimer")
        dispatch(actionCreators.setTimer(0, 'recording'))
    } else if (recording === 'pbxcall') {
        pbxTimer.stopWorker("pbxtimer")
        dispatch(actionCreators.setCallTimer(0, 'pbxcall'))
    }
    else {
        //recordtimer.stopWorker("recordtimer")
        timer.stopWorker("timer")
    }
    if (recording !== 'recording') {
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;
    window.onkeypress = resetTimer;
    }

}
export default hoverTimer
