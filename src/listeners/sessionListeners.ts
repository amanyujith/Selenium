import { useSelector } from "react-redux";
import { actionCreators } from "../store"

const sessionListeners = (dispatch: any, user: any) => {
        

    user.addEventListener("deviceListModified", (data: any) => {
        
        
        if (data.title === "device_modified") {
            user.listAvailableDevices()
                .then((device: any) => {
                    
                    dispatch(actionCreators.setDeviceList(device))
                    const devices = device.filter((dev: any) => dev.type === "videoinput")
                       if(devices.length === 1) 
                        dispatch(actionCreators.setCurrentDevices({
                            audioInput: "unchanged",
                            audioOutput: "unchanged",
                            videoInput : devices?.[0]?.id
                         }))
                })
         
        }
        if (data.title === "currentdevice") {
             
            dispatch(actionCreators.setCurrentDevices(data.currentDevice))
        }
    })
}

export default sessionListeners