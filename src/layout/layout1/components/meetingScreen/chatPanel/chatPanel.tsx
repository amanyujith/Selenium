import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../../store";
import { t } from "i18next";

const ChatPanel = () => {
  const dispatch = useDispatch();
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  );
  const privateChat = useSelector((state: any) => state.Main.privateChat);
  const recentChats = useSelector((state: any) => state.Main.recentChats);
  const unReadMessages = useSelector((state: any) => state.Main.unReadMessages);
  const popUp = useSelector((state: any) => state.Flag.popUp);
  const rooms = useSelector((state: any) => state.Breakout.roomsList);
  const flagRooms = useSelector((state: any) => state.Breakout.flagSetRoom);
  const themePalette = useSelector((state: any) => state.Main.themePalette);

    // const [newChat, setNewChat] = useState(false);
    useEffect(() => {
        
        
    },[privateChat])
    const [searchTerm, setSearchTerm] = useState('')

  const handlePrivateChat = (id: number, name: string, event: any) => {
    // event.stopPropagation();
    dispatch(actionCreators.setPrivateChatParticipant(id, name));
    dispatch(actionCreators.setPrivateChatState(true));
    // dispatch(actionCreators.setUnReadPrivateChat(id))
  };

  const handleAllChat = () => {
    dispatch(actionCreators.setGroupChat(true));
  };

  const handleSearch = (event: any, value: string) => {
    if (!popUp.newChat) {
      handlePopUp(event, "newChat");
    }
    setSearchTerm(value);
  };

  const handlePopUp = (
    event: any,
    type:
      | "meetingInfoFlag"
      | "endButtonFlag"
      | "moreOptionFlag"
      | "reactionFlag"
      | "filterMenuFlag"
      | "newChat"
      | "closeAll"
  ) => {
    event.stopPropagation();
    dispatch(actionCreators.setPopUp(type));
  };

  return (
    <div>
      <div className=" w-full flex  items-center py-2 px-2.5 my-2 rounded-[5px] box-border text-[16px] leading-5 mr-2.5 border-[0.2px]">
        <input
          id="searchInputs"
          onChange={(event: any) => handleSearch(event, event.target.value)}
          value={searchTerm}
          onClick={(e) => handlePopUp(e, "newChat")}
          className=" w-full outline-0 outline-none"
          tabIndex={-1}
          type="text"
          placeholder={t("Meeting.ChooseMembers")}
        />
        {/* onChange={(event: any) => handleSearch(event.target.value)} value={searchTerm} */}
        {/* {searchTerm === '' ? */}
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
          <path
            d="M13.8086 12.1051L11.0824 9.37891C10.9594 9.25586 10.7926 9.1875 10.6176 9.1875H10.1719C10.9266 8.22227 11.375 7.0082 11.375 5.6875C11.375 2.5457 8.8293 0 5.6875 0C2.5457 0 0 2.5457 0 5.6875C0 8.8293 2.5457 11.375 5.6875 11.375C7.0082 11.375 8.22227 10.9266 9.1875 10.1719V10.6176C9.1875 10.7926 9.25586 10.9594 9.37891 11.0824L12.1051 13.8086C12.3621 14.0656 12.7777 14.0656 13.032 13.8086L13.8059 13.0348C14.0629 12.7777 14.0629 12.3621 13.8086 12.1051ZM5.6875 9.1875C3.7543 9.1875 2.1875 7.62344 2.1875 5.6875C2.1875 3.7543 3.75156 2.1875 5.6875 2.1875C7.6207 2.1875 9.1875 3.75156 9.1875 5.6875C9.1875 7.6207 7.62344 9.1875 5.6875 9.1875Z"
            fill="#A7A9AB"
          />
        </svg>
        {/* // :
                    // <svg onClick={() => handleClearSearchTerm()} className='cursor-pointer' width="20" height="20" viewBox="0 0 20 20" fill="none">
                    //     <path d="M15.8334 5.34102L14.6584 4.16602L10 8.82435L5.34169 4.16602L4.16669 5.34102L8.82502 9.99935L4.16669 14.6577L5.34169 15.8327L10 11.1743L14.6584 15.8327L15.8334 14.6577L11.175 9.99935L15.8334 5.34102Z" fill="#A7A9AB" />
                    // </svg> */}
        {/* } */}
      </div>
      {popUp.newChat ? (
        <div className=" absolute top-[115px] w-[93%] max-h-52 overflow-auto border-[0.5] shadow-[0_4px_18px_0px_rgba(0,0,0,0.25)] rounded-md z-[1] bg-[#FFFFFF] border-[#404041] ">
          {participantList
            .filter((participant: any) => {
              return participant.name
                .trim()
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase())
            })
            .map((participant: any) => {
              if (participant.isPublisher) {
                return
              } else {
                return (
                  <div
                    key={participant.participant_id}
                    id="handlePrivateChat"
                    onClick={(e) =>
                      handlePrivateChat(
                        participant.participant_id,
                        participant.name,
                        e
                      )
                    }
                    className={` cursor-pointer px-2.5 py-3 flex justify-between border-b border-solid border-b-[#000000]/[0.12] `}
                  >
                    <div className=" w-2/3 flex items-center relative">
                      <div
                        className=" w-8 h-8 rounded-full mr-2.5 flex items-center justify-center text-[#ffffff] bg-primary-200"
                        style={{ backgroundColor: themePalette?.primary300 }}
                      >
                        {participant.profile_picture &&
                        participant.profile_picture != "undefined" ? (
                          <img
                            src={participant.profile_picture}
                            className={"rounded-full"}
                          />
                        ) : (
                          participant.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-[15px] leading-5 max-w-[60%] w-fit text-left overflow-hidden text-ellipsis whitespace-nowrap text-[#000000]">
                        {participant.name}
                      </span>
                      {participant.isPublisher ? (
                        <span className="text-[16px] leading-5 text-left text-[#000000]">
                          ({t("Meeting.You")})
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              }
            })}
        </div>
      ) : null}
      <div
        onClick={handleAllChat}
        id="handleAllChat"
        className=" cursor-pointer flex items-center pt-4 px-2.5 pb-2.5 border-b border-[#C4C4C4]"
      >
        <div
          className=" w-8 h-8 rounded-full mr-2.5 flex items-center justify-center text-[#ffffff] "
          style={{ backgroundColor: themePalette?.primary300 }}
        >
          <span>{t("Meeting.All")}</span>
        </div>
        <span
          className={` relative text-[15px] leading-5 max-w-[60%] w-fit text-left overflow-hidden text-ellipsis whitespace-nowrap ${
            unReadMessages.isGroup
              ? "font-bold text-[#000000]"
              : "text-[#000000]"
          } `}
        >
          {t("Meeting.Everyone")}
          {unReadMessages.isGroup ? (
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5 border-[1px] -top-[5px] -right-[1px] border-[#ffffff] bg-main"
              style={{ backgroundColor: themePalette?.main }}
            ></span>
          ) : null}
        </span>
      </div>
      <div>
        {flagRooms && (
          <div className="text-left">
            <select
              className="text-primary-200 border-0 focus:border-0 focus:outline-none bg-[#FFFFFF] w-[90px] h-9"
              name="room"
            >
              {rooms.map((item: any, index: any) => {
                return (
                  <option>
                    {t("Meeting.Room")} &nbsp;{index + 1}
                  </option>
                )
              })}
            </select>
          </div>
        )}
        <span className=" block w-full pt-2 pb-2.5 text-sm leading-3 text-left text-[#C4C4C4]">
          {t("Meeting.RecentChats")}
        </span>
        <div className="h-[calc(100vh-191px)] overflow-auto">
          {recentChats?.map((participant: any) => {
            const chatParticipant = participantList.find(
              (member: any) =>
                member.participant_id === participant.participant_id
            )
            return (
              <div
                key={participant.participant_id}
                id="privateChats"
                onClick={(e) =>
                  handlePrivateChat(
                    participant.participant_id,
                    chatParticipant?.name,
                    e
                  )
                }
                className={` cursor-pointer px-2.5 py-3 flex justify-between border-b border-solid border-b-[#000000]/[0.12] `}
              >
                <div className=" w-2/3 flex items-center relative">
                  {/* {participant.participant_id === hostID ? */}
                  {participant.host ? (
                    <span
                      className=" absolute -top-2 flex items-center px-1 py-1 h-3 rounded-xl border-[1px] text-[10px] border-[#ffffff] bg-main text-[#FFFFFF]"
                      style={{ backgroundColor: themePalette?.main }}
                    >
                      {t("Meeting.Host")}
                    </span>
                  ) : null}
                  <div
                    className=" w-8 h-8 rounded-full mr-2.5 flex items-center justify-center text-[#ffffff] bg-primary-200"
                    style={{ backgroundColor: themePalette?.primary300 }}
                  >
                    {chatParticipant?.profile_picture &&
                    chatParticipant?.profile_picture != "undefined" ? (
                      <img
                        src={chatParticipant?.profile_picture}
                        className={"rounded-full"}
                      />
                    ) : (
                      chatParticipant?.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span
                    className={`text-[15px] leading-5 max-w-[60%] w-fit text-left overflow-hidden text-ellipsis whitespace-nowrap  ${
                      privateChat?.some(
                        (item: any) =>
                          item.participant_id == participant.participant_id &&
                          item.seen == false
                      )
                        ? "font-bold text-[#000000]"
                        : "text-[#000000]"
                    }`}
                  >
                    {chatParticipant?.name}
                    {/* participant_name */}
                    {privateChat?.some(
                      (item: any) =>
                        item.participant_id == participant.participant_id &&
                        item.seen == false
                    ) ? (
                      <span
                        className="relative inline-flex rounded-full h-2.5 w-2.5 border-[1px] -top-[5px] -right-[1.2px] border-[#ffffff] bg-main"
                        style={{ backgroundColor: themePalette?.main }}
                      ></span>
                    ) : null}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
};

export default ChatPanel;
