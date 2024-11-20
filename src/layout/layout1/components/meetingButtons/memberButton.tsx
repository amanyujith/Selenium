import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../store";
import { t } from "i18next";

const MemberButton = (props: any) => {
    const membersList = useSelector((state: any) => state.Flag.membersList)
    const selectedTab = useSelector((state: any) => state.Main.selectedTab)
    const themePalette = useSelector((state: any) => state.Main.themePalette);
    const dispatch = useDispatch();
    const openMembersList = () => {
        if (selectedTab !== "members") {
            dispatch(actionCreators.setMembersList(true));
            dispatch(actionCreators.setTab("members"));
        } else
            dispatch(actionCreators.setMembersList(!membersList));

    }
    return (
        <div id="openMembersList" onClick={openMembersList} className='w-[57px] text-center text-[14px] leading-4 mr-5 cursor-pointer text-[#ffffff]'>
            <div className='h-[32px] relative flex items-center justify-center'>
                <span className={`w-5 h-5 rounded-full text-[9px] absolute top-1 right-1 leading-4 font-bold flex justify-center items-center bg-[${themePalette?.main}]`} style={{backgroundColor : themePalette?.main}}>{props.length}</span>
                <svg width="26" height="26" viewBox="0 0 18 19" fill="none">
                    <path d="M6.59899 5.90352C5.40368 5.90352 4.42985 6.80703 4.42985 7.93203C4.42985 9.04648 5.40368 9.96055 6.59899 9.96055C7.7943 9.96055 8.76813 9.04648 8.76813 7.93203C8.76813 6.80703 7.7943 5.90352 6.59899 5.90352ZM11.6404 5.90352C10.4451 5.90352 9.47126 6.80703 9.47126 7.93203C9.47126 9.04648 10.4451 9.96055 11.6404 9.96055C12.8463 9.96055 13.8095 9.04648 13.8095 7.93203C13.8131 6.80703 12.8463 5.90352 11.6404 5.90352ZM17.1459 9.06758L16.9349 9.21875V2.24727C16.9349 1.28398 16.2107 0.5 15.3177 0.5H2.69313C1.80016 0.5 1.07594 1.28398 1.07594 2.24727V9.21875C1.00563 9.16953 0.924769 9.1168 0.854457 9.06758C0.323598 8.69492 -0.0279649 9.2082 0.291957 9.68984C0.935316 10.4844 2.15875 11.4582 4.02907 12.2211C2.04977 18.9605 8.85954 20.0363 8.75055 16.584C8.75055 16.5594 8.7611 14.5941 8.7611 13.1879C8.9404 13.2266 9.09157 13.2688 9.24274 13.2969C9.24274 14.6926 9.25329 16.5594 9.25329 16.584C9.1443 20.0398 15.9541 18.9641 13.9748 12.2246C15.8416 11.4617 17.0685 10.4879 17.7119 9.69336C18.0318 9.2082 17.6802 8.69844 17.1459 9.06758ZM16.0736 9.74258C13.6513 11.0574 11.5631 10.8359 10.4275 10.7867C9.5943 10.7551 9.28141 11.1066 9.24274 11.6621C8.88063 11.3914 8.58883 11.1172 8.52907 11.0609C8.34977 10.8711 8.04743 10.7797 7.57633 10.7902C6.46188 10.8289 4.42282 11.0504 2.04274 9.80586V3.0418C2.04274 1.81484 2.35563 1.43516 3.47008 1.43516H14.6392C15.7045 1.43516 16.0771 1.88867 16.0771 3.0418V9.74258H16.0736Z" fill="#A7A9AB" />
                </svg>
            </div>
            {t("Meeting.Members")}
        </div>
    )
}

export default memo(MemberButton)