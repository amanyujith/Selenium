import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../../../store";
import { t } from "i18next";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getURL } from "../../../../../../utils/linkManipulation";
import MsgInfo from "../MsgInfo";
import { MULTIPLE_SELECT } from "../../../../../../utils/SVG/svgsRestHere";

export interface SelectorProps {
  reactions?: string[];
  id: string;
  body?: any;
  shouldShowOptn?: boolean;
  lastChild: boolean;
  closemodal: any;
  shouldshowEmoji?: boolean;
  isOwnChat?: boolean;
  quadrant?: string | undefined;
}
export const Selector = React.forwardRef<HTMLDivElement, SelectorProps>(
  (
    {
      id,
      body,
      shouldShowOptn,
      lastChild,
      closemodal,
      shouldshowEmoji,
      isOwnChat,
      quadrant,
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const { data: activeChat, isGroup } = useSelector(
      (state: any) => state.Chat.activeChat
    );
    const [infoModal, setInfoModal] = useState(false);
    const [infoData, setInfoData] = useState<any>({});
    const [loader, setLoader] = useState<boolean>(false);
    const editSec = useSelector((state: any) => state.Chat.edit);
    const options = useSelector((state: any) => state.Chat.showOption);
    const [emoji, addEmoji] = useState("");
    const chatInstance = useSelector((state: any) => state.Chat.chatInstance);
    const personalInfo = useSelector((state: any) => state.Chat.personalInfo);
    const msgDelete = (id: any) => {
      dispatch(actionCreators.setDeleteModal(body));
      dispatch(actionCreators.setOptionBox(false));
    };
    const openEdit = () => {
      dispatch(actionCreators.setEdit(id !== editSec ? id : ""));
      dispatch(actionCreators.setReplyFlag(false));
    };
    const handleClick = (e: any) => {
      addEmoji(e.native);
      let flag = true;
      body?.reactions &&
        body?.reactions.map((node: any) => {
          if (
            node.emoji === e.native &&
            node.member.includes(personalInfo.uuid)
          ) {
            flag = false;
          }
        });
      flag &&
        chatInstance?.reactionMessage(
          e.native,
          "add",
          id,
          activeChat.uuid,
          isGroup
        );
      dispatch(actionCreators.setOptionBox(false));
      closemodal();
    };

    const msgInfo = (data: any) => {
      setLoader(true);
      setInfoModal(true);
      chatInstance?.getMessageInfo(data.uuid).then((res: any) => {
        setInfoData(res[0] ? res[0] : res);
        setLoader(false);
      });
    };

    const downloadAll = (data: any) => {
      const container = document.createElement("div");
      document.body.appendChild(container);
      data.forEach((item: any) => {
        const anchor = document.createElement("a");
        anchor.href = getURL(item.url);
        anchor.target = "_blank";
        anchor.download = "";
        container.appendChild(anchor);
        anchor.click();
        container.removeChild(anchor);
      });
      document.body.removeChild(container);
    };

    return (
      <div
        ref={ref}
        className={`${
          lastChild ? "bottom-[-10px]" : "pt-[1px]"
        } z-[300] absolute ${
          !shouldshowEmoji && "bg-[#FFFFFF] "
        } w-fit min-w-[150px] gap-3  shadow-[0_2px_8px_0px_rgba(0,0,0,0.2)] rounded-[5px] `}
      >
        {shouldShowOptn  ? (
          <button
            className="px-[12px] py-[7px] flex flex-row w-full"
            onClick={() => {
              dispatch(actionCreators.setMultipleMsgSelect(true));
              dispatch(actionCreators.setOptionBox(false));
            }}
          >
            {MULTIPLE_SELECT}
            <div className="text-sm text-[#5C6779] ml-3">Multiple Select</div>
          </button>
        ) : null}
        <div className="flex">
          {!shouldShowOptn ? (
            <div className="flex">
              {" "}
              <div
                className={`absolute ${
                  quadrant === "Top-Left"
                    ? " left-[20px]"
                    : quadrant === "Top-Right"
                    ? "right-[30px] top-0 "
                    : quadrant === "Bottom-Left"
                    ? "bottom-[35px]  left-[25px]"
                    : "bottom-[40px] right-[20px]"
                }`}
              >
                <Picker
                  data={data}
                  // ref={pickerRef}
                  onEmojiSelect={(e: any) => {
                    addEmoji(e);
                    handleClick(e);
                  }}
                  // onClickOutside={() => {
                  //   setIsEmojiOpen(false)
                  // }}
                  theme="light"
                  previewPosition="none"
                  exceptEmojis="SmilingFace"
                  categories={[
                    "frequent",
                    "people",
                    "objects",
                    "foods",
                    "nature",
                    "activity",
                  ]}
                  perLine="8"
                  autoFocus={true}
                  skinTonePosition="none"
                  searchPosition="sticky"
                />
              </div>
            </div>
          ) : null}
        </div>

        {body?.attachments?.length > 0 || shouldShowOptn ? (
          <div>
            {shouldShowOptn && isOwnChat ? (
              <button
                onClick={openEdit}
                className="px-[12px] w-full pb-[7px] pt-[7px] flex flex-row"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.1031 1.46827L16.5317 1.89688C16.9745 2.33967 16.9745 3.05875 16.5317 3.50153L15.5859 4.44731L13.5527 2.41405L14.4985 1.46827C14.9413 1.02549 15.6603 1.02549 16.1031 1.46827ZM6.69487 9.27187L12.7521 3.2146L14.7854 5.24786L8.72813 11.3051C8.57936 11.4539 8.38807 11.5602 8.18262 11.6098L5.8589 12.1446L6.39378 9.81738C6.43983 9.61193 6.5461 9.42065 6.69842 9.27187H6.69487ZM13.6979 0.664177L5.89432 8.47132C5.59323 8.77241 5.38424 9.15143 5.2886 9.56588L4.54826 12.7752C4.50576 12.9664 4.56243 13.1648 4.70058 13.303C4.83873 13.4411 5.0371 13.4978 5.22838 13.4553L8.43767 12.7149C8.85211 12.6193 9.23113 12.4103 9.53222 12.1092L17.3358 4.30208C18.2214 3.41651 18.2214 1.9819 17.3358 1.09633L16.9072 0.664177C16.0216 -0.221388 14.587 -0.221388 13.7015 0.664177H13.6979ZM2.83381 2.13067C1.26813 2.13067 0 3.3988 0 4.96448V15.1662C0 16.7319 1.26813 18 2.83381 18H13.0355C14.6012 18 15.8693 16.7319 15.8693 15.1662V10.6321C15.8693 10.3204 15.6143 10.0653 15.3026 10.0653C14.9908 10.0653 14.7358 10.3204 14.7358 10.6321V15.1662C14.7358 16.1049 13.9742 16.8665 13.0355 16.8665H2.83381C1.89511 16.8665 1.13352 16.1049 1.13352 15.1662V4.96448C1.13352 4.02578 1.89511 3.2642 2.83381 3.2642H7.3679C7.67962 3.2642 7.93467 3.00915 7.93467 2.69743C7.93467 2.38572 7.67962 2.13067 7.3679 2.13067H2.83381Z"
                    fill="#5C6779"
                  />
                </svg>
                <div className="text-sm text-[#5C6779] ml-3">{t("Edit")}</div>
              </button>
            ) : null}

            {body?.attachments?.length > 0 && shouldShowOptn ? (
              <button
                className="px-[12px] py-[7px] flex flex-row w-full"
                onClick={() => downloadAll(body.attachments)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5625 0.5625C9.5625 0.253125 9.30937 0 9 0C8.69063 0 8.4375 0.253125 8.4375 0.5625V11.5805L4.89727 8.04023C4.6793 7.82227 4.3207 7.82227 4.10273 8.04023C3.88477 8.2582 3.88477 8.6168 4.10273 8.83477L8.60273 13.3348C8.8207 13.5527 9.1793 13.5527 9.39727 13.3348L13.8973 8.83477C14.1152 8.6168 14.1152 8.2582 13.8973 8.04023C13.6793 7.82227 13.3207 7.82227 13.1027 8.04023L9.5625 11.5805V0.5625ZM4.92539 11.25H2.25C1.00898 11.25 0 12.259 0 13.5V15.75C0 16.991 1.00898 18 2.25 18H15.75C16.991 18 18 16.991 18 15.75V13.5C18 12.259 16.991 11.25 15.75 11.25H13.0746L11.9496 12.375H15.75C16.3723 12.375 16.875 12.8777 16.875 13.5V15.75C16.875 16.3723 16.3723 16.875 15.75 16.875H2.25C1.62773 16.875 1.125 16.3723 1.125 15.75V13.5C1.125 12.8777 1.62773 12.375 2.25 12.375H6.05039L4.92539 11.25ZM15.1875 14.625C15.1875 14.4012 15.0986 14.1866 14.9404 14.0284C14.7821 13.8701 14.5675 13.7812 14.3438 13.7812C14.12 13.7812 13.9054 13.8701 13.7471 14.0284C13.5889 14.1866 13.5 14.4012 13.5 14.625C13.5 14.8488 13.5889 15.0634 13.7471 15.2216C13.9054 15.3799 14.12 15.4688 14.3438 15.4688C14.5675 15.4688 14.7821 15.3799 14.9404 15.2216C15.0986 15.0634 15.1875 14.8488 15.1875 14.625Z"
                    fill="#5C6779"
                  />
                </svg>

                <div className="text-sm text-[#5C6779] ml-3">
                  {body?.attachments?.length > 1 ? "Download All" : "Download"}
                </div>
              </button>
            ) : null}

            {shouldShowOptn && isOwnChat ? (
              <button
                className="px-[12px] py-[7px] flex flex-row w-full"
                onClick={() => msgDelete(body)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.31592 1.125H9.60361C9.79909 1.125 9.98036 1.22344 10.087 1.38867L10.6308 2.25H5.29229L5.83609 1.38867C5.93917 1.22344 6.12399 1.125 6.31947 1.125H6.31592ZM11.9743 2.25L11.0537 0.794531C10.741 0.298828 10.1936 0 9.60716 0H6.31592C5.72946 0 5.18211 0.298828 4.86933 0.794531L3.94878 2.25H2.27828H1.13736H0.568681C0.255907 2.25 0 2.50312 0 2.8125C0 3.12188 0.255907 3.375 0.568681 3.375H1.21911L2.12545 15.9117C2.20719 17.0895 3.19883 18 4.39306 18H11.53C12.7242 18 13.7123 17.0895 13.7976 15.9117L14.704 3.375H15.3544C15.6672 3.375 15.9231 3.12188 15.9231 2.8125C15.9231 2.50312 15.6672 2.25 15.3544 2.25H14.7857H13.6448H11.9743ZM13.5666 3.375L12.6638 15.8309C12.6212 16.418 12.1271 16.875 11.53 16.875H4.39306C3.79595 16.875 3.30191 16.418 3.25925 15.8309L2.36003 3.375H13.563H13.5666Z"
                    fill="#5C6779"
                  />
                </svg>

                <div className="text-sm text-[#5C6779] ml-3">
                  {body?.attachments?.length > 1 ? "Delete All" : "Delete"}
                </div>
              </button>
            ) : null}
            {shouldShowOptn && isOwnChat ? (
              <button
                onClick={() => msgInfo(body)}
                className="px-[8px] w-full pb-[7px] pt-[7px] flex flex-row"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5198_6749)">
                    <path
                      d="M12 4.125C14.0886 4.125 16.0916 4.95468 17.5685 6.43153C19.0453 7.90838 19.875 9.91142 19.875 12C19.875 14.0886 19.0453 16.0916 17.5685 17.5685C16.0916 19.0453 14.0886 19.875 12 19.875C9.91142 19.875 7.90838 19.0453 6.43153 17.5685C4.95468 16.0916 4.125 14.0886 4.125 12C4.125 9.91142 4.95468 7.90838 6.43153 6.43153C7.90838 4.95468 9.91142 4.125 12 4.125ZM12 21C14.3869 21 16.6761 20.0518 18.364 18.364C20.0518 16.6761 21 14.3869 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 14.3869 3.94821 16.6761 5.63604 18.364C7.32387 20.0518 9.61305 21 12 21ZM10.3125 15.375C10.0031 15.375 9.75 15.6281 9.75 15.9375C9.75 16.2469 10.0031 16.5 10.3125 16.5H13.6875C13.9969 16.5 14.25 16.2469 14.25 15.9375C14.25 15.6281 13.9969 15.375 13.6875 15.375H12.5625V11.4375C12.5625 11.1281 12.3094 10.875 12 10.875H10.5938C10.2844 10.875 10.0312 11.1281 10.0312 11.4375C10.0312 11.7469 10.2844 12 10.5938 12H11.4375V15.375H10.3125ZM12 9.46875C12.2238 9.46875 12.4384 9.37986 12.5966 9.22162C12.7549 9.06339 12.8438 8.84878 12.8438 8.625C12.8438 8.40122 12.7549 8.18661 12.5966 8.02838C12.4384 7.87014 12.2238 7.78125 12 7.78125C11.7762 7.78125 11.5616 7.87014 11.4034 8.02838C11.2451 8.18661 11.1562 8.40122 11.1562 8.625C11.1562 8.84878 11.2451 9.06339 11.4034 9.22162C11.5616 9.37986 11.7762 9.46875 12 9.46875Z"
                      fill="#5C6779"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5198_6749">
                      <rect
                        width="18"
                        height="18"
                        fill="white"
                        transform="translate(3 3)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div className="text-sm text-[#5C6779] ml-2 mt-[2px]">Info</div>
              </button>
            ) : null}
          </div>
        ) : null}
        {infoModal && (
          <MsgInfo
            infoData={infoData}
            setInfoModal={setInfoModal}
            quadrant={quadrant}
            loader={loader}
            activeChat={activeChat}
          />
        )}
      </div>
    );
  }
);

export const defaultProps: Required<SelectorProps> = {
  reactions: ["👍", "👎", "😄", "😕", "❤️"],
  id: "",
  body: "",
  shouldShowOptn: false,
  lastChild: false,
  closemodal: false,
  shouldshowEmoji: false,
  isOwnChat: false,
  quadrant: "",
};

export default Selector;
