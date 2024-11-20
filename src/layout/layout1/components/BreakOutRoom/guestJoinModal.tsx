import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators } from '../../../../store';

function GuestJoinModal() {
    const dispatch = useDispatch();
    const rooms = [{
      roomName: "UX Designs",
      members:["Dona","Maria","Shibu","Sandra","Rajan"]
    },
    {
      roomName: "Discusssion",
      members:["Shibu","Maria","Shifana","Sandra","Rajan"]
    }
    ]
    //const rooms = useSelector((state: any) => state.Breakout.roomsList);
    const onClose = () => {
        dispatch(actionCreators.setGuestJoinRoomModal(false));
      };
    const onJoin = (name: any) => {
        dispatch(actionCreators.setRoom(name));
        dispatch(actionCreators.flagSetRoom(true));
        dispatch(actionCreators.setGuestJoinRoomModal(false));
      }; 
    return (
        <div className="bg-[#00000033] opacity-100  backdrop-blur fixed inset-0 z-10">
        <div className="flex justify-center items-center place-content-center w-full h-full">
          <div className="flex flex-col h-fit w-[500px] bg-[white] p-[18px] rounded-[15px]">
            <div className="flex flex-row relative">
              <span className="text-primary-200 text-base font-bold">
                Breakout Rooms ({rooms.length})
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
            <hr className="text-[#0000001f] mt-4 " />
            {rooms.map((item: any, index: number) => {
              return (
                <div>
                  <div className="h-8 w-full flex flex-row mb-2">
                    <div className="w-1/3 mt-3 text-left text-primary-200 text-sm font-normal">
                      {item.roomName}
                    </div>
                    <div className="w-1/3 mt-2 flex flex-row">
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
                    <div className="w-1/3 mt-2 flex flex-row-reverse ">
                      <div
                        onClick={() => onJoin(item.roomName)}
                        className="h-[32px] w-[58px] ml-2 bg-primary-200 cursor-pointer text-[#FFFFFF] border-[1.5px] rounded-[3px]"
                      >
                        <div className="mt-[4px] text-sm">Join</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
            </div>
        </div>
    );
}

export default GuestJoinModal;
