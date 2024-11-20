import { MeetingSessionType } from 'hdmeet'
import React, { Dispatch } from 'react'
import { actionCreators, store } from '../../../../../../store'
import hoverTimer from '../../../../../../utils/hoverTimer'
import { callDetails } from '../../../../../../store/actions'

const pbxListeners = (dispatch :Dispatch<any> , meetingSession:MeetingSessionType) => {

    const endCallCompletely = (data: any) => {
         if (data.reason) {
            dispatch(actionCreators.setCallState(data.reason)) 
            } else {
            dispatch(actionCreators.setCallState("Call Ended"))
            }
            hoverTimer(false, dispatch, 'pbxcall')  
            dispatch(actionCreators.setPbxCallData({ type: null, data: {} }))
            dispatch(actionCreators.callButtonState({
               muteButton: "Mute",
                holdButton: "Hold",
               addCallButton: false
            }))
            setTimeout(() => {
                const callStatus = store.getState().Call.callStatus
                dispatch(actionCreators.setCallState('inactive')) 
                dispatch(actionCreators.setActiveCall(false))
                dispatch(actionCreators.setCallStatus(callStatus === "active" ? "active" : ""))  
            }, 1200);
    }


    meetingSession.addEventListener("voip_ready_state", () => {
        const callstate = store.getState().Call.pbxCallData
        const user_info = store.getState().Main.loggedInUserInfo
        console.log('incomingPbxCall444', callstate)
        if (callstate.type === "outgoing" && callstate.data.callee) {
            meetingSession.publishVoipcall(callstate.data.callee)
        }
        else if (callstate.type === "incoming") {
            if(callstate.data.user_sil_id && callstate.data.caller && callstate.data.uuid)
                meetingSession.joinVoipcall(callstate.data.user_sil_id, callstate.data.caller, callstate.data.uuid)
        }
    })

    meetingSession.addEventListener("voipstreamreceived", () => {
        meetingSession.voipStreamBind('voipCall')
    })
    meetingSession.addEventListener("voipnotification", (data : any) => {
        console.log('voipNotification', data)
        if (data.event === 'calling') {
            console.log(data, "event.Calling")
            const pbxCallData = store.getState().Call.pbxCallData
            console.log(pbxCallData, 'CallingCheck')
            dispatch(actionCreators.setPbxCallData({
                ...pbxCallData,
                data: {
                    ...pbxCallData.data,
                    handle_id : data.handle_id
                }
            }))
            dispatch(actionCreators.setCallState("calling"))
        } else if (data.event === 'ringing') {
             dispatch(actionCreators.setCallState("ringing"))
        }
        else if (data.event === 'hangup') {
            const pbxCallData = store.getState().Call.pbxCallData
            if (pbxCallData?.callonHold?.length) {
                            console.log('hangup.11111', pbxCallData )

                if (pbxCallData?.data?.handle_id === data.handle_id) {
                 console.log('hangup.2222', pbxCallData )
            if (data.reason) {
             dispatch(actionCreators.setCallState(data.reason)) 
            } else {
              dispatch(actionCreators.setCallState("Call Ended"))
            }
                setTimeout(() => {
                dispatch(actionCreators.setPbxCallData({...pbxCallData, data: pbxCallData?.callonHold?.[0] as callDetails , callonHold : null}))
                const callStatus = store.getState().Call.callStatus
                dispatch(actionCreators.setCallState('inCall')) 
                dispatch(actionCreators.setActiveCall(false))
                dispatch(actionCreators.callButtonState({
                 muteButton: "Mute",
                 holdButton: "Hold",
                 addCallButton: false
            }))
            }, 1200);
                } else if (pbxCallData?.callonHold?.[0].handle_id === data.handle_id) {
                     console.log('hangup.3333', pbxCallData )
                dispatch(actionCreators.setPbxCallData({...pbxCallData, callonHold : null}))       
                }   
            } else if (pbxCallData?.data?.handle_id === data.handle_id) {
                 console.log('hangup.4444', pbxCallData )
               endCallCompletely(data)
            }
  
        } else if (data.event === "registration_failed") {
            dispatch(actionCreators.setCallState(data.reason))
            dispatch(actionCreators.setPbxCallData({ type: null, data: {} }))
            dispatch(actionCreators.callButtonState({
              muteButton: "Mute",
                holdButton: "Hold",
                addCallButton: false
             }))
            setTimeout(() => {
                 const callStatus = store.getState().Call.callStatus
                dispatch(actionCreators.setCallState('inactive'))   
                dispatch(actionCreators.setActiveCall(false))
                dispatch(actionCreators.setCallStatus(callStatus === "active" ? "active" : ""))  
            }, 1200);
        } else if (data.event === "hold" || data.event === 'unhold') {
            const pbxCallData = store.getState().Call.pbxCallData
            if (pbxCallData?.data?.handle_id === data?.handle_id) {
                    dispatch(actionCreators.setPbxCallData({
                ...pbxCallData, data: {
                    ...pbxCallData.data,
                    holdButton: data.event === 'hold' ? 'Unhold' : 'Hold'
            }}))
            } else if(pbxCallData?.callonHold?.[0].handle_id === data.handle_id) {
                dispatch(actionCreators.setPbxCallData({
                ...pbxCallData, callonHold: [{
                    ...pbxCallData.callonHold?.[0],
                    holdButton: data.event === 'hold' ? 'Unhold' : 'Hold'
            }]}))
            }
        
        } else if (data.event === 'accepted') {
        dispatch(actionCreators.setCallState("inCall"))
        hoverTimer(true,dispatch,'pbxcall')
        }
    })   
}   

export default pbxListeners
