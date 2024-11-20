import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { actionCreators } from '../../store'

const PageVisibility = (props: any) => {
    
    const dispatch = useDispatch()

    //Page Visibility check
    let hidden: any = null
    let visibilityChange: any = null
    if (typeof document.hidden !== "undefined") {
        // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden"
        visibilityChange = "visibilitychange"
    }
    //@ts-ignore
    else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden"
        visibilityChange = "msvisibilitychange"
    }
    //@ts-ignore
    else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden"
        visibilityChange = "webkitvisibilitychange"
    }
    const onVisibilityChange = (flag: any) => {
        //Focus-Blur
        if (typeof flag === "boolean") {
            if (flag) setVisibility(true)
            else setVisibility(false)
        }
        //page visibility API
        //@ts-ignore
        else if (document[hidden]) {
            setVisibility(false)
        } else {
            setVisibility(true)
        }
    }
    const forceVisibilityTrue = () => {
        onVisibilityChange(true)
    }
    const forceVisibilityFalse = () => {
        onVisibilityChange(false)
    }
    const setVisibility = (status: boolean) => {
        dispatch(actionCreators.setPageVisibilityState(status))
    }


    useEffect(() => {
        window.addEventListener(visibilityChange, onVisibilityChange, false)
        window.addEventListener("focus", forceVisibilityTrue, false)
        window.addEventListener("blur", forceVisibilityFalse, false)
        return () => {
            window.removeEventListener(visibilityChange, onVisibilityChange)
            window.removeEventListener("focus", forceVisibilityTrue)
            window.removeEventListener("blur", forceVisibilityFalse)
        }
    }, [])


    return (
        props.children
    )
}

export default PageVisibility