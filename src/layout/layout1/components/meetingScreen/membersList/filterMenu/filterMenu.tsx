import { memo } from 'react'
import { useDispatch } from 'react-redux';
import { actionCreators } from '../../../../../../store';
import { t } from 'i18next';

const FilterMenu = (props: any) => {
    const { setFilterType, filterType } = props;
    const dispatch = useDispatch();
    const handleFilterMenu = (type: string) => {
        setFilterType(type)
        dispatch(actionCreators.setPopUp('closeAll'));
    }
    return (
        <div onClick={(e) => e.stopPropagation()} className=' z-[11] absolute top-28 right-7 w-48 h-[200px] text-left border-[0.2px] border-[#A7A9AB] box-border shadow-[0_4px_4px_0_rgba(0, 0, 0, 0.25)] rounded-[3px] bg-[#ffffff]'>
            <div className=' pl-2.5 py-2.5 text-xs leading-3 text-primary-100'> {t("Meeting.SortBy")}</div>
            <div className=' pl-0.5 pr-0.5'>
                <div onClick={() => handleFilterMenu("alphabets")} className={` pl-5 py-2.5 mt-0.5 cursor-pointer text-sm leading-4 hover:bg-primary-100 text-primary-200 ${filterType === "alphabets" ? "bg-primary-100" : ""}`}>
                {t("Meeting.Participant")}
                </div>
                <div onClick={() => handleFilterMenu("time")} className={` cursor-pointer pl-5 py-2.5 mt-0.5 text-sm leading-4 hover:bg-primary-100 text-primary-200 ${filterType === "time" ? "bg-primary-100" : ""}`}>
                {t("Meeting.MeetingjoinTime")}
                </div>
                <div onClick={() => handleFilterMenu("muted")} className={` cursor-pointer pl-5 py-2.5 mt-0.5 text-sm leading-4 hover:bg-primary-100 text-primary-200 ${filterType === "muted" ? "bg-primary-100" : ""}`}>
                {t("Meeting.ParticipantsUnmuted")}
                </div>
                <div onClick={() => handleFilterMenu("videoOff")} className={` cursor-pointer pl-5 py-2.5 mt-0.5 text-sm leading-4 hover:bg-primary-100 text-primary-200 ${filterType === "videoOff" ? "bg-primary-100" : ""}`}>
                {t("Meeting.ParticipantsVideoOn")}
                </div>
            </div>
        </div>
    )
}

export default memo(FilterMenu)