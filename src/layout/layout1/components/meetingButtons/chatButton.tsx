import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../store";
import { t } from "i18next";

const ChatButton = (props: any) => {
    const membersList = useSelector((state: any) => state.Flag.membersList);
    const unReadMessages = useSelector((state: any) => state.Main.unReadMessages);
    const selectedTab = useSelector((state: any) => state.Main.selectedTab)
    const themePalette = useSelector((state: any) => state.Main.themePalette)

    // const participantList = useSelector((state: any) => state.Main.participantList);
    const dispatch = useDispatch();
    const openMembersList = () => {
        if (selectedTab != "chat") {
            dispatch(actionCreators.setTab("chat"));
            dispatch(actionCreators.setMembersList(true));
        } else
            dispatch(actionCreators.setMembersList(!membersList));

    }
    return (
      <div
        id="openMeetChatList"
        onClick={openMembersList}
        className="w-[57px] text-center text-[14px] leading-4 mr-5 cursor-pointer text-[#ffffff]"
      >
        <div className="h-[32px] relative flex items-center justify-center">
          {/* <span className=" w-5 h-5 rounded-full text-[9px] absolute top-1 right-1 leading-4 font-bold flex justify-center items-center bg-main">{props.length}</span> */}
          <svg width="26" height="26" viewBox="0 0 17 17" fill="none">
            <path
              d="M2.16771 0.111328H14.8342C15.9986 0.111328 16.9453 1.05802 16.9453 2.22241V11.7223C16.9453 12.8867 15.9986 13.8334 14.8342 13.8334H11.6676V16.6042C11.6676 16.9274 11.2982 17.1155 11.0376 16.9241L6.91766 13.8334H2.16771C1.00332 13.8334 0.0566273 12.8867 0.0566273 11.7223V2.22241C0.0566273 1.05802 1.00332 0.111328 2.16771 0.111328Z"
              fill="#A7A9AB"
            />
          </svg>
          {unReadMessages?.count > 0 ? (
            <span className="flex h-2.5 w-2.5 absolute right-[36px] top-0 ">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main opacity-75"
                style={{ backgroundColor: themePalette?.main }}
              ></span>
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5 border-[1px] border-[#ffffff] bg-main "
                style={{ backgroundColor: themePalette?.main }}
              ></span>
            </span>
          ) : null}
        </div>
        {t("Meeting.Chat")}
      </div>
    );
}

export default memo(ChatButton)