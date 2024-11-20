import { memo } from "react";
import { useDispatch } from "react-redux";
import { actionCreators } from "../../../../store";
import { t } from "i18next";



const ReactionButton = (props: any) => {

    const dispatch = useDispatch()

    const handlePopUp = (event: any, type: 'meetingInfoFlag' | 'endButtonFlag' | 'moreOptionFlag' | 'reactionFlag' | 'filterMenuFlag' | 'viewFlag' | 'newChat' | 'closeAll') => {
        event.stopPropagation();
        dispatch(actionCreators.setPopUp(type));
    }
    // const handleReaction = (event: any) => {
    //     event.stopPropagation();
    //     handlePopUp(event, 'reactionFlag');
    // }


    return (
        <div id="reactionButton" onClick={(e) => handlePopUp(e, 'reactionFlag')} className='w-[57px] mr-5 cursor-pointer text-center text-[14px] leading-4 text-[#ffffff]'>
            <div className='h-[32px] flex items-center justify-center cursor-pointer'>
                <svg width="26" height="26" viewBox="0 0 18 19" fill="none">
                    <path d="M15.4962 5.00025C14.7078 4.98517 14.0625 5.64548 14.0625 6.43403V9.50001H13.7812V3.30512C13.7812 2.51657 13.1359 1.85627 12.3475 1.87135C11.5836 1.88597 10.9688 2.50986 10.9688 3.27735V9.50001H10.6875V1.93403C10.6875 1.14548 10.0422 0.485171 9.25379 0.500253C8.48981 0.514878 7.875 1.13876 7.875 1.90626V9.50001H7.59375V3.34028C7.59375 2.55173 6.94842 1.89142 6.16004 1.9065C5.39606 1.92113 4.78125 2.54501 4.78125 3.31251V11.6091L3.66863 10.0791C3.21184 9.45104 2.33237 9.31213 1.7042 9.76895C1.07613 10.2258 0.937267 11.1052 1.39405 11.7334L5.80971 17.805C5.96626 18.0203 6.17151 18.1955 6.4087 18.3163C6.64588 18.437 6.90827 18.5 7.17444 18.5H14.121C14.904 18.5 15.5842 17.9613 15.7636 17.199L16.6955 13.2383C16.8147 12.7316 16.875 12.2128 16.875 11.6923V6.40626C16.875 5.63876 16.2602 5.01488 15.4962 5.00025Z" fill="#A7A9AB" />
                </svg>
            </div>
            {t("Meeting.Reactions")}
        </div>
    )
}

export default memo(ReactionButton)