import { memo } from "react"
import { useDispatch } from "react-redux";
import { actionCreators } from "../../../../store";
import { t } from "i18next"

const MoreButton = () => {
  const dispatch = useDispatch()
  const handlePopUp = (event: any, type: 'meetingInfoFlag' | 'endButtonFlag' | 'moreOptionFlag' | 'reactionFlag' | 'filterMenuFlag' | 'viewFlag' | 'newChat' | 'closeAll') => {
    event.stopPropagation();
    dispatch(actionCreators.setPopUp(type));
  }
  return (
    <div id="moreButton" onClick={(e) => handlePopUp(e, 'moreOptionFlag')} className='w-[57px] cursor-pointer text-center text-[14px] leading-4 text-[#ffffff]'>
      <div className='h-[32px] flex items-center justify-center '>
        <svg width="26" height="26" viewBox="0 0 18 18" fill="none">
          <path d="M9 6.46875C10.3992 6.46875 11.5312 7.60078 11.5312 9C11.5312 10.3992 10.3992 11.5312 9 11.5312C7.60078 11.5312 6.46875 10.3992 6.46875 9C6.46875 7.60078 7.60078 6.46875 9 6.46875ZM6.46875 2.8125C6.46875 4.21172 7.60078 5.34375 9 5.34375C10.3992 5.34375 11.5312 4.21172 11.5312 2.8125C11.5312 1.41328 10.3992 0.28125 9 0.28125C7.60078 0.28125 6.46875 1.41328 6.46875 2.8125ZM6.46875 15.1875C6.46875 16.5867 7.60078 17.7188 9 17.7188C10.3992 17.7188 11.5312 16.5867 11.5312 15.1875C11.5312 13.7883 10.3992 12.6562 9 12.6562C7.60078 12.6562 6.46875 13.7883 6.46875 15.1875Z" fill="#A7A9AB" />
        </svg>
      </div>
      {t("Meeting.More")}
    </div>
  )
}

// export default memo(MoreButton)
export default MoreButton