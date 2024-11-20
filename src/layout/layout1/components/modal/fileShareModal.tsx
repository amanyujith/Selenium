import * as React from "react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeButton from "../../../../atom/HomeButton/homeButton";
import { actionCreators } from "../../../../store";
import CheckBox from "../../../../atom/CheckBox/checkBox";
import { t } from "i18next";

const FileShareModal = () => {
  const inputFileBox = useRef<any>();
  const dispatch = useDispatch();
  const meetingSession = useSelector((state: any) => state.Main.meetingSession);
  const fileShareState = useSelector((state: any) => state.Main.fileShareState);
  const enableDownload = useSelector((state: any) => state.Flag.setFileDownload);
  const enableNavigate = useSelector((state: any) => state.Flag.setFileNavigate);
  const participantID = useSelector(
    (state: any) => state.Main.selfParticipantID
  );
  const [activeFile, setActiveFile] = useState<number>(-1);
  const [uploadingState, setUploadingState] = useState<boolean>(false);
  const handleClick = () => {
    inputFileBox.current.click();
  };
  const handleUploadedFile = async (file: any) => {
    setUploadingState(true);
    const state = { ...fileShareState };
    if (!state.files) {
      state.files = [];
    }
    
    const url = await meetingSession.uploadFile(file);
    state.files.push({ url: url, fileName: file.name });
    
    setActiveFile(state.files.length - 1);
    dispatch(actionCreators.setFileShareState(state));
    inputFileBox.current.value = null;
    setUploadingState(false);
  };
  const handleFileShare = () => {
    if (
      (activeFile !== parseInt(fileShareState.activeFile) &&
        fileShareState.status === "progress") ||
      fileShareState.status === ""
    ) {
      // const reader = new FileReader();
      // reader.re(fileShareState.files[activeFile]);
      // reader.addEventListener("load", () => {
      meetingSession.broadCastMessage(
        {
          title: "fileShare",
          action: "start",
          value: fileShareState.files[activeFile],
        },
        "broadcast",
        "fileshare"
      );
      const state = { ...fileShareState };
      state.modalState = false;
      state.base64 = fileShareState.files[activeFile];
      state.activeFile = activeFile;
      state.hostId = participantID;
      state.status = "progress";
      dispatch(actionCreators.setFileShareState(state));
      // })
    }
  };
  const stopFileShare = () => {
    const state = { ...fileShareState };
    state.modalState = false;
    state.base64 = "";
    state.status = "";
    state.hostId = "";
    meetingSession.broadCastMessage(
      { title: "fileShare", action: "end", value: "" },
      "broadcast",
      "fileshare",
    );
    meetingSession.broadCastMessage({}, "clearBroadcast");
    dispatch(actionCreators.setFileShareState(state));
  };
  const handleActiveFile = (index: number) => {
    const state = { ...fileShareState };
    setActiveFile(index);
    dispatch(actionCreators.setFileShareState(state));
  };
  const closeFileShareModal = () => {
    const state = { ...fileShareState };
    state.modalState = false;
    dispatch(actionCreators.setFileShareState(state));
  };
  React.useEffect(() => {
    setActiveFile(fileShareState?.activeFile);
  }, []);
  return (
    <div className=" w-screen h-screen absolute top-0 left-0 flex justify-center items-center z-20 bg-[#000000] bg-opacity-10 backdrop-blur-xl lg:backdrop-blur-lg">
      <div className=" min-w-[600px] min-h-[510px] rounded-2xl px-6 py-6 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#ffffff]">
        <div className="flex flex-row relative">
          <span className="text-primary-200 text-lg font-bold">{t("Meeting.ShareNow")}</span>
          <span className="absolute mt-[6px] top-0 right-0">
            <svg
              className="cursor-pointer"
              onClick={() => closeFileShareModal()}
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8307 1.84102L10.6557 0.666016L5.9974 5.32435L1.33906 0.666016L0.164062 1.84102L4.8224 6.49935L0.164062 11.1577L1.33906 12.3327L5.9974 7.67435L10.6557 12.3327L11.8307 11.1577L7.1724 6.49935L11.8307 1.84102Z"
                fill="#A7A9AB"
              />
            </svg>
          </span>
        </div>

        <div className="mt-8">
          <div className="text-[#000000] flex">
            <div className="w-[200px] h-[260px] border-[0.2px] rounded-[3px] border-dashed border-[#C4C4C4] justify-center items-center m-auto flex flex-col content-center">
              <div className=" text-[#C4C4C4] text-sm">{t("Meeting.DropFileHere")}</div>
              <div className=" text-[#C4C4C4] text-sm mt-1">{t("Meeting.Or")}</div>
              <div
                className="cursor-pointer text-primary-200 text-sm border-[1px] px-4 py-2 rounded-[3px] mt-1"
                onClick={() => handleClick()}
              >
                {t("Meeting.SelectFile")}
              </div>
            </div>
            <div className="w-[340px] h-[260px] border-[0.2px] overflow-y-auto overflow-x-hidden rounded-[3px] border-[#C4C4C4] py-2 ml-3">
              {fileShareState?.files?.map((node: any, index: number) => {
                return (
                  <div
                    onClick={() => handleActiveFile(index)}
                    className={`p-1 m-1 text-left flex relative ${fileShareState?.activeFile === index
                      ? "border-[#61DAFB]"
                      : "border-[#ddd]"
                      } cursor-pointer hover:bg-[#ddd]`}
                  >
                    {activeFile === index ? (
                      <span className="inline-block w-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 50 50"
                          width="22px"
                          height="22px"
                        >
                          <path
                            fill="#61DAFB"
                            d="M 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 15 L 44 17.3125 L 44 39 C 44 41.800781 41.800781 44 39 44 L 11 44 C 8.199219 44 6 41.800781 6 39 L 6 11 C 6 8.199219 8.199219 6 11 6 L 37.40625 6 L 39 4 Z M 43.25 7.75 L 23.90625 30.5625 L 15.78125 22.96875 L 14.40625 24.4375 L 23.3125 32.71875 L 24.09375 33.4375 L 24.75 32.65625 L 44.75 9.03125 Z"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-block w-8"></span>
                    )}
                    {node.fileName}
                    <svg
                      className="mt-[6px] cursor-pointer absolute right-0 mr-3"
                      width="3"
                      height="13"
                      viewBox="0 0 3 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 12.5C1.0875 12.5 0.7345 12.3533 0.441 12.0597C0.147 11.7657 0 11.4125 0 11C0 10.5875 0.147 10.2343 0.441 9.94025C0.7345 9.64675 1.0875 9.5 1.5 9.5C1.9125 9.5 2.26575 9.64675 2.55975 9.94025C2.85325 10.2343 3 10.5875 3 11C3 11.4125 2.85325 11.7657 2.55975 12.0597C2.26575 12.3533 1.9125 12.5 1.5 12.5ZM1.5 8C1.0875 8 0.7345 7.853 0.441 7.559C0.147 7.2655 0 6.9125 0 6.5C0 6.0875 0.147 5.73425 0.441 5.44025C0.7345 5.14675 1.0875 5 1.5 5C1.9125 5 2.26575 5.14675 2.55975 5.44025C2.85325 5.73425 3 6.0875 3 6.5C3 6.9125 2.85325 7.2655 2.55975 7.559C2.26575 7.853 1.9125 8 1.5 8ZM1.5 3.5C1.0875 3.5 0.7345 3.353 0.441 3.059C0.147 2.7655 0 2.4125 0 2C0 1.5875 0.147 1.2345 0.441 0.941C0.7345 0.647 1.0875 0.5 1.5 0.5C1.9125 0.5 2.26575 0.647 2.55975 0.941C2.85325 1.2345 3 1.5875 3 2C3 2.4125 2.85325 2.7655 2.55975 3.059C2.26575 3.353 1.9125 3.5 1.5 3.5Z"
                        fill="#A7A9AB"
                      />
                    </svg>
                  </div>
                );
              })}
              {uploadingState && (
                <div
                  className={`p-1 m-1 border  text-[#61DAFB] text-left flex border-[#61DAFB]`}
                >
                  <span className="inline-block w-8"></span> {t("Meeting.Uploading")}
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            accept=".doc,.ppt,.docx,.pdf,audio/*,video/*,image/*"
            onInputCapture={(event: any) => {
              handleUploadedFile(event.target.files[0]);
            }}
            className="hidden"
            ref={inputFileBox}
          />
        </div>
        <div className="flex flex-col text-left">
          <div className="mt-4">
            <CheckBox
              label={t("Meeting.AllowMembersToDownload")}
              color={""}
              id={"download"}
              labelClass={"text-sm"}
              checked={enableDownload}
              onChange={(e: any) =>
                dispatch(actionCreators.setFileDownload(e.target.checked))
              }
            />
          </div>
          <div className="mt-4">
            <CheckBox
              label={t("Meeting.AllowMembersToNavigate")}
              color={""}
              checked={enableNavigate}
              id={"navigate"}
              labelClass={"text-sm"}
              onChange={(e: any) =>
                dispatch(actionCreators.setFileNavigate(e.target.checked))
              }
            />
          </div>
          <div className="text-sm text-link mt-4 ml-2 cursor-pointer">{t("Meeting.RestrictAccess")}</div>
        </div>

        <div className="pb-4 pt-4 text-right">
          {fileShareState?.hostId === participantID &&
            fileShareState.status === "progress" && (
              <div
                onClick={() => stopFileShare()}
                className="border border-[red] mr-2 text-[red] pb-1 pr-4 pl-4 inline-block pt-1 rounded-[3px]  cursor-pointer hover:bg-[#eee]"
              >
                 {t("Meeting.StopShare")}
              </div>
            )}
          <div className="flex flex-row-reverse h-full pt-4">
            <button
              onClick={() => handleFileShare()}
              className={`${activeFile === parseInt(fileShareState.activeFile) &&
                fileShareState.status === "progress"
                ? "cursor-not-allowed border-[gray] text-[gray]"
                : ""
                } h-[32px] w-[105px] mr-1 bg-primary-200 text-[#FFFFFF] rounded-[3px] ml-3 mt-3`}
            >
              {fileShareState.status === "progress" ? "Switch" : "Share"}
            </button>
            <button
              onClick={() => closeFileShareModal()}
              className="h-[32px] w-[105px] border-[#404041] border-[1.5px] text-primary-200 rounded-[3px] mt-3"
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FileShareModal;
