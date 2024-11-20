import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../store"
import { t } from "i18next"

const ScreenshareButton = (props: any) => {
    const dispatch = useDispatch()
    const popUp = useSelector((state: any) => state.Flag.popUp)
    const idleState = useSelector((state: any) => state.Flag.idleState)

    const handlePopUp = (
        event: any,
        type:
            | "meetingInfoFlag"
            | "endButtonFlag"
            | "moreOptionFlag"
            | "reactionFlag"
            | "filterMenuFlag"
            | "newChat"
            | "viewFlag"
            | "closeAll"
            | "sharePopup"
    ) => {
        event.stopPropagation()
        dispatch(actionCreators.setPopUp(type))
        

    }

    return (
        <div className="w-[67px]">
            <div id="sharePopup" onClick={(e) => handlePopUp(e, 'sharePopup')} className='w-[75px] cursor-pointer text-center text-[14px] mx-auto my-0 leading-4 text-[#ffffff]'>
                <div className={`h-[32px] w-[57px] m-auto rounded-full flex items-center justify-center`}>
                    {/* mb-2.5   ${sharing ? 'bg-[#ff0000]' : 'bg-primary-200'}*/}
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M21 3H3C1.89 3 1 3.89 1 5V19C1 20.11 1.89 21 3 21H21C22.11 21 23 20.11 23 19V5C23 3.89 22.11 3 21 3ZM21 19.02H3V4.98H21V19.02ZM10 12H8L12 8L16 12H14V16H10V12Z" fill={"#A7A9AB"} />
                    </svg>
                </div>
                {t("Meeting.ShareNow")}
            </div>
        </div>
    )
}

export default ScreenshareButton