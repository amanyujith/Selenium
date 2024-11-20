import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../store";
import AddMemberBox from "./atoms/addMemberBox";

function ManageRoomsModal() {
  const dispatch = useDispatch();
  const [nameEdit, setNameEdit] = useState(-1);
  const [custom, setCustom] = useState("");
  const participants = [
    "maria",
    "mia",
    "anna",
    "george",
    "manu",
    "mary",
    "surya",
    "dona",
  ];

  const rooms = useSelector((state: any) => state.Breakout.roomsList);
  const addmember = useSelector((state: any) => state.Breakout.addMemberBox);
  

  const openList = (index: number) => {
    dispatch(actionCreators.setAddMemberBox(index));
  };
  const onClose = () => {
    dispatch(actionCreators.setManageRoomsModal(false));
  };
  const onJoin = (name: any) => {
    dispatch(actionCreators.setRoom(name));
    dispatch(actionCreators.flagSetRoom(true));
    dispatch(actionCreators.setManageRoomsModal(false));
  };

  return (
    <div>
      <div className="bg-[#00000033] opacity-100  backdrop-blur fixed inset-0 z-10">
        <div className="flex justify-center items-center place-content-center w-full h-full">
          <div className="flex flex-col h-fit w-[500px] bg-[white] p-[18px] rounded-[15px]">
            <div className="flex flex-row relative">
              <span className="text-primary-200 text-base font-bold">
                Create Breakout Rooms ({rooms.length})
              </span>
              <span className="absolute mt-[6px] top-0 right-0">
                <svg
                  onClick={onClose}
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
            <div className="w-full h-8 flex flex-row mt-6">
              <div className="text-primary-200 text-sm font-normal">Rooms</div>
              <div className="w-full flex flex-row-reverse">
                <button className="bg-primary-200 h-8 w-[124px] flex flex-row justify-center">
                  <svg
                    className="mt-2"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.75 14.25V8.25H0.75V6.75H6.75V0.75H8.25V6.75H14.25V8.25H8.25V14.25H6.75Z"
                      fill="#A7A9AB"
                    />
                  </svg>
                  <span className="text-[#FFFFFF] ml-4 text-sm font-normal mt-[6px]">
                    Add Room
                  </span>
                </button>
              </div>
            </div>
            <hr className="text-[#0000001f] mt-3 " />
            {rooms.map((item: any, index: number) => {
              return (
                <div>
                  <div className="h-8 w-full flex flex-row mb-1">
                    {nameEdit === index ? (
                      <div className="w-1/3 mt-2 text-left text-primary-200 text-sm font-normal">
                        <input
                          className="border-[0.5px] w-32 mt-2 rounded-sm text-sm border-[#404041] h-5 text-primary-200 focus:outline-none"
                          type="text"
                          autoComplete="off"
                          value={custom}
                          name="duration"
                          onChange={(e: any) => setCustom(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="w-1/3 mt-3 text-left text-primary-200 text-sm font-normal">
                        {item.roomName}
                      </div>
                    )}
                    <div className="w-1/3 mt-2 flex flex-row">
                      <svg
                        onClick={() =>
                          setNameEdit(nameEdit === index ? -1 : index)
                        }
                        className="mt-2 cursor-pointer"
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.063 4.26615L8.81302 2.03281L9.69635 1.16615C9.88524 0.977257 10.1215 0.882812 10.405 0.882812C10.6881 0.882812 10.9241 0.977257 11.113 1.16615L11.9297 1.98281C12.1186 2.18281 12.2186 2.41881 12.2297 2.69081C12.2408 2.96326 12.1464 3.19392 11.9464 3.38281L11.063 4.26615ZM10.3464 4.99948L3.17969 12.1661H0.929688V9.91615L8.09635 2.74948L10.3464 4.99948Z"
                          fill="#A7A9AB"
                        />
                      </svg>
                      {item.members != null && (
                        <div className="flex mt-1 -space-x-1 ml-3">
                          {item.members.slice(0, 2).map((item: any) => {
                            return (
                              <div
                                className={`w-[21px] h-[21px] rounded-bl-none rounded-[44%] border-[2px] border-[#E9EBF8] text-[15px] text-primary-200 bg-primary-100 overflow-hidden`}
                              >
                                {item.slice(0, 1)}
                              </div>
                            );
                          })}
                          {item.members.length > 2 && (
                            <div
                              className={`w-[21px] h-[21px] rounded-bl-none rounded-[44%] border-[2px] border-[#E9EBF8] pt-[3px] text-[10px] text-primary-200 bg-primary-100 overflow-hidden`}
                            >
                              +{item.members.length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="w-1/3 mt-2 flex flex-row ">
                      <svg
                        className="mr-5 mt-[8px] ml-2 cursor-pointer"
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.975 12.875C2.6 12.875 2.28125 12.7438 2.01875 12.4813C1.75625 12.2188 1.625 11.9 1.625 11.525V2H0.875V0.875H4.25V0.21875H8.75V0.875H12.125V2H11.375V11.525C11.375 11.9 11.2438 12.2188 10.9813 12.4813C10.7188 12.7438 10.4 12.875 10.025 12.875H2.975ZM4.55 10.25H5.675V3.5H4.55V10.25ZM7.325 10.25H8.45V3.5H7.325V10.25Z"
                          fill="#A7A9AB"
                        />
                      </svg>
                      <div
                        onClick={(e) => openList(index)}
                        className=" flex flex-row  h-[31px] border-[0.5px] w-12 rounded-sm  cursor-pointer mt-[1px] text-sm border-[#404041] text-primary-200"
                      >
                        <span className="text-primary-200 ml-1 mt-[4px] text-sm font-normal">
                          Add
                        </span>
                        <svg
                          className="mt-[13px] mr-1 ml-2 "
                          width="7"
                          height="4"
                          viewBox="0 0 7 4"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.49635 3.04518L0.929688 0.478516H6.06302L3.49635 3.04518Z"
                            fill="#1C1B1F"
                          />
                        </svg>
                      </div>
                      <div
                        onClick={() => onJoin(item.roomName)}
                        className="h-[32px] w-[58px] ml-2 bg-primary-200 cursor-pointer text-[#FFFFFF] border-[1.5px] rounded-[3px]"
                      >
                        <div className="mt-[3px]">Join</div>
                      </div>
                    </div>
                  </div>
                  <hr className="text-[#0000001f] mt-4 " />
                  <div>
                    {addmember === index && (
                      <div className="absolute mt-1 ml-52 z-50 w-[200px] h-[188px] shadow-[0_4px_10px_0px_rgba(0,0,0,0.25)] bg-[#FFFFFF] overflow-y-scroll overflow-x-hidden rounded-[4px]">
                        <AddMemberBox participants={participants} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {}
            <div className="flex flex-row-reverse h-full pt-8">
              <button
                onClick={onClose}
                className="h-[32px] w-fit px-3 mr-1 bg-primary-200 text-[#FFFFFF] text-sm rounded-[3px] ml-3 mt-3"
              >
                Close all rooms
              </button>
              <button
                onClick={onClose}
                className="h-[32px] w-[78px] border-[#404041] border-[1.5px] text-primary-200 text-sm rounded-[3px] mt-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ManageRoomsModal);
