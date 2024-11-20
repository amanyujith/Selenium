import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../store";
import "../../../../App.css";
import NoOfRoomsInput from "./atoms/noOfRoomsInput";


function CreateRoomModal() {
  const dispatch = useDispatch();
//   const [roomNumber, setRoomNumber] = useState(0);
  const [radioValue, setRadioValue] = useState("");
  const [roomInfo, setRoomInfo] = useState<any>([]);
    
  const onClose = () => {
    dispatch(actionCreators.setCreateRoomModal(false));
  };

  const onSubmit = () => {
    dispatch(actionCreators.setRoomsList(roomInfo));
    dispatch(actionCreators.setCreateRoomModal(false));
    dispatch(actionCreators.setManageRoomsModal(true));
  };

  const handleChange = (event: any) => {
      const temp_roomInfo= [...roomInfo]
    if(event<roomInfo.length){
        // temp_roomInfo.pop()
        temp_roomInfo.length = event
        setRoomInfo(temp_roomInfo)
    }
    else{
     increment(temp_roomInfo,event)
    
        setRoomInfo(temp_roomInfo)
    }
    // setRoomNumber(event);

    function increment(temp_roomInfo:any,count:number):any{
        
        if(count<=temp_roomInfo.length){
            return temp_roomInfo
        }
        else{
       temp_roomInfo.push({
            duration:"",
            roomName:"",
            members:null,
        })   
        return increment(temp_roomInfo,count)
        }
    }
  };

//   const handleRoomInfo = (event: any,index:any) => {
//       const roomInfos=[...roomInfo,roomInfo[index].roomName= event]
//       
    
//     // roomInfos[type]=event
//         // setRoomInfo((roomInfo) => ({
//         //     ...roomInfo,
//         //     {
//         //         roomName: event,


//         //     }
            
//         // }))
//     // } else {
//     //     setRoomInfo({...roomInfo,
//     //         roomName: event
//     //     })
//     // }
    
//   }

  const handleRadio = (event: any) => {
    
    setRadioValue(event);
  };

  return (
    <div>
      <div className="bg-[#00000033] opacity-100  backdrop-blur fixed inset-0 z-10">
        <div className="flex justify-center items-center place-content-center w-full h-full">
          <div className="flex flex-col h-fit w-[500px] bg-[white] p-[18px] rounded-[15px]">
            <div className="flex flex-row relative">
              <span className="text-primary-200 text-lg font-bold">
                Create Breakout Rooms
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
            <div className="mt-5 flex flex-row">
              <div className="text-sm font-normal text-primary-200 mt-1">
                Rooms
              </div>
              <input
                className="border-[0.5px] w-20 rounded-sm border-[#404041] ml-20 focus:border-[#404041] focus:outline-none px-2 text-primary-200"
                type="number"
                placeholder="Nos"
                min="1"
                max="999"
                onChange={(e) => handleChange(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto max-h-56">{
                roomInfo.map((_item:any,index:number)=>(
                    <NoOfRoomsInput
                    index={index}
                    onChange={(e: any) => [...roomInfo,roomInfo[index].roomName= e.target.value]}
                    setDuration={(e: any) => [...roomInfo,roomInfo[index].duration= e]}
                  />
                ))
            }</div>

            <div className="flex flex-col text-left ml-2 mt-3 ">
              <div className="">
                <input
                  type="radio"
                  name="roomRadio"
                  value="auto"
                  onChange={(e) => handleRadio(e.target.value)}
                ></input>
                <span className=" ml-6 text-base font-normal text-primary-200">
                  Assign Automatically
                </span>
              </div>
              <div className="mt-1">
                <input
                  type="radio"
                  name="roomRadio"
                  value="manual"
                  onChange={(e) => handleRadio(e.target.value)}
                ></input>
                <span className=" ml-6 text-base font-normal text-primary-200">
                  Asssign Manually
                </span>
              </div>
              <div className="mt-1">
                <input
                  type="radio"
                  name="roomRadio"
                  value="choose"
                  onChange={(e) => handleRadio(e.target.value)}
                ></input>
                <span className=" ml-6 text-base font-normal text-primary-200">
                  Let’s participants choose room
                </span>
              </div>
            </div>

            <div className="flex flex-row-reverse h-full pt-4">
              <button onClick={onSubmit} className="h-[32px] w-[78px] mr-1 bg-primary-200 text-[#FFFFFF] rounded-[3px] ml-3 mt-3">
                Create
              </button>
              <button
                onClick={onClose}
                className="h-[32px] w-[78px] border-[#404041] border-[1.5px] text-primary-200 rounded-[3px] mt-3"
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

export default memo(CreateRoomModal);
