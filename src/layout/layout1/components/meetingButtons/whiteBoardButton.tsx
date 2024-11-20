import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../store";
import { t } from "i18next";

interface WhiteButtonType {
    onClick?: any,
}

const WhiteBoardButton = ({ onClick }: WhiteButtonType) => {
    const whiteBoardState = useSelector((state: any) => state.Main.whiteBoardState)
    const participantID = useSelector((state: any) => state.Main.selfParticipantID)
    const participantList = useSelector((state: any) => state.Main.participantList)
    // const membersList = useSelector((state: any) => state.Flag.membersList);
    // const unReadMessages = useSelector((state: any) => state.Main.unReadMessages);
    // const selectedTab = useSelector((state: any) => state.Main.selectedTab)

    // // const participantList = useSelector((state: any) => state.Main.participantList);
    // const dispatch = useDispatch();
    // const openMembersList = () => {
    //     if (selectedTab != "chat") {
    //         dispatch(actionCreators.setTab("chat"));
    //         dispatch(actionCreators.setMembersList(true));
    //     } else
    //         dispatch(actionCreators.setMembersList(!membersList));

    // }
    return (
        <div onClick={() => { (whiteBoardState === participantID || !(participantList.some((participant: any) => participant.participant_id === whiteBoardState)) || whiteBoardState === '') && onClick(whiteBoardState !== '' ? '' : participantID) }} className={`${(whiteBoardState !== participantID && whiteBoardState !== '' && participantList.some((participant: any) => participant.participant_id === whiteBoardState)) && "cursor-not-allowed"}  w-[94px] text-center text-[14px] leading-4 mr-5 cursor-pointer text-[#ffffff]`}>
            <div className='h-[32px] relative flex items-center justify-center'>
                <svg width="26" height="26" viewBox="0 0 14 15" fill="none">
                    <path d="M8.5 14.25C8.2875 14.25 8.1095 14.178 7.966 14.034C7.822 13.8905 7.75 13.7125 7.75 13.5C7.75 13.2875 7.822 13.1095 7.966 12.966C8.1095 12.822 8.2875 12.75 8.5 12.75C9.0875 12.75 9.60925 12.6345 10.0653 12.4035C10.5217 12.172 10.75 11.9125 10.75 11.625C10.75 11.45 10.6687 11.2875 10.5062 11.1375C10.3437 10.9875 10.1187 10.85 9.83125 10.725L10.9375 9.61875C11.3375 9.85625 11.6562 10.1375 11.8937 10.4625C12.1312 10.7875 12.25 11.175 12.25 11.625C12.25 12.45 11.8562 13.0938 11.0687 13.5563C10.2812 14.0188 9.425 14.25 8.5 14.25ZM1.43125 8.5125C1.06875 8.3 0.78125 8.053 0.56875 7.7715C0.35625 7.4905 0.25 7.15 0.25 6.75C0.25 6.225 0.44375 5.78425 0.83125 5.42775C1.21875 5.07175 1.9125 4.675 2.9125 4.2375C3.7 3.875 4.203 3.62175 4.4215 3.47775C4.6405 3.33425 4.75 3.175 4.75 3C4.75 2.8 4.628 2.625 4.384 2.475C4.1405 2.325 3.7625 2.25 3.25 2.25C2.9375 2.25 2.675 2.2875 2.4625 2.3625C2.25 2.4375 2.05625 2.5625 1.88125 2.7375C1.74375 2.875 1.575 2.95625 1.375 2.98125C1.175 3.00625 0.99375 2.95 0.83125 2.8125C0.66875 2.6875 0.575 2.525 0.55 2.325C0.525 2.125 0.58125 1.94375 0.71875 1.78125C0.95625 1.49375 1.297 1.25 1.741 1.05C2.1845 0.85 2.6875 0.75 3.25 0.75C4.15 0.75 4.875 0.953 5.425 1.359C5.975 1.7655 6.25 2.3125 6.25 3C6.25 3.4875 6.06875 3.925 5.70625 4.3125C5.34375 4.7 4.6125 5.13125 3.5125 5.60625C2.7875 5.91875 2.3125 6.15 2.0875 6.3C1.8625 6.45 1.75 6.6 1.75 6.75C1.75 6.8625 1.82175 6.972 1.96525 7.0785C2.10925 7.1845 2.30625 7.2875 2.55625 7.3875L1.43125 8.5125ZM12.1375 6.3L8.95 3.1125L9.7375 2.325C10.0375 2.025 10.3967 1.875 10.8153 1.875C11.2343 1.875 11.5875 2.025 11.875 2.325L12.925 3.375C13.225 3.6625 13.375 4.0155 13.375 4.434C13.375 4.853 13.225 5.2125 12.925 5.5125L12.1375 6.3ZM1 14.25V11.0625L7.9 4.1625L11.0875 7.35L4.1875 14.25H1Z"
                        fill={whiteBoardState === participantID ? "#ff0000" : "#A7A9AB"}
                    />
                </svg>
            </div>
           {t("Meeting.WhiteBoard")}
        </div>
    )
}

export default memo(WhiteBoardButton)