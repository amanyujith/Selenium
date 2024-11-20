import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from '../../../../../store';
import Chat from "../chat/chat";
import ChatPanel from "../chatPanel/chatPanel";
import MembersList from "../membersList/membersList";
import { t } from "i18next";

interface IRightSidePanel {
    isCall? : boolean
}

const RightSidePanel = ({isCall = false} :IRightSidePanel ) => {

    const dispatch = useDispatch();
    // const [selectedTab, setSelectedTab] = useState("members")
    const selectedTab = useSelector((state: any) => state.Main.selectedTab)
    const unReadMessages = useSelector((state: any) => state.Main.unReadMessages)


    const closeMembersList = () => {
        dispatch(actionCreators.setMembersList(false));
    }

    const handleTab = (type: string) => {
        dispatch(actionCreators.setTab(type))
    }
    return (
      <div
        className=" w-[350px] h-[calc(100vh-5px)] rounded-2xl pl-[7px] pr-2.5 m-1 pt-2.5 bg-[#ffffff] "
        onClick={() => {
          dispatch(actionCreators.setHostControlId(""))
        }}
      >
        <div className=" h-[54px] pl-[3px] py-2 pr-5 flex justify-between items-center">
          <div className="flex">
            {!isCall && (
              <div
                onClick={() => handleTab("chat")}
                className={`relative h-8 w-[140px] text-base leading-5 cursor-pointer border-b ${
                  selectedTab === "chat"
                    ? "font-bold border-[#404041] text-primary-200"
                    : "border-[#C4C4C4] text-[#C4C4C4]"
                } `}
              >
                {t("Meeting.Chat")}
                {unReadMessages?.count > 0 ? (
                  <span className="flex h-2.5 w-2.5 absolute right-[36px] top-0 ">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 border-[1px] border-[#ffffff] bg-main"></span>
                  </span>
                ) : null}
              </div>
            )}
            <div
              onClick={() => handleTab("members")}
              className={`${
                isCall ? "w-[250px]" : "w-[140px]"
              } h-8  text-base cursor-pointer leading-5 border-b  ${
                selectedTab === "members"
                  ? "font-bold border-[#404041] text-primary-200"
                  : "border-[#C4C4C4] text-[#C4C4C4]"
              } `}
            >
              {t("Meeting.Members")}
            </div>
          </div>
          <svg
            onClick={closeMembersList}
            className="cursor-pointer"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.8334 5.34102L14.6584 4.16602L10 8.82435L5.34169 4.16602L4.16669 5.34102L8.82502 9.99935L4.16669 14.6577L5.34169 15.8327L10 11.1743L14.6584 15.8327L15.8334 14.6577L11.175 9.99935L15.8334 5.34102Z"
              fill="#A7A9AB"
            />
            close
          </svg>
        </div>
        {selectedTab === "members" ? (
          <MembersList isCall={isCall} />
        ) : (
          <ChatPanel />
        )}
      </div>
    )
}

export default RightSidePanel