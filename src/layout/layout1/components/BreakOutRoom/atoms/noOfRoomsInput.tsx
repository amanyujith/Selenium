import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../../store";
import DurationPicker from "./durationPicker";

interface NoOfRoomsInputType {
  index: any;
  onChange?: any;
  setDuration?: any;
}

const NoOfRoomsInput = ({
  index,
  onChange,
  setDuration,
}: NoOfRoomsInputType) => {
  const dispatch = useDispatch();
  const [roomDuration, setRoomDuration] = useState("");
  const [custom, setCustom] = useState("");
  const durationModal = useSelector(
    (state: any) => state.Breakout.roomDurationModal
  );
  const customDuration = useSelector((state: any) => state.Breakout.custom);
  const Onclick = () => {
    dispatch(
      actionCreators.setRoomDurationModal(index !== durationModal ? index : -1)
    );
  };

  const handleDuration = (item: any) => {
    setDuration(item);
    setRoomDuration(item);
    dispatch(actionCreators.setRoomDurationModal(-1));
  };

  return (
    <div>
      <div className=" flex flex-row mt-2">
        <div className="text-sm font-normal text-primary-200 mt-1">Room</div>
        <input
          className="border-[0.5px] w-40 rounded-sm text-sm border-[#404041] py-[2px] ml-2 focus:border-[#404041] focus:outline-none px-2 text-primary-200"
          type="text"
          placeholder="Enter room name"
          onChange={onChange}
        />

        <div className="text-sm  ml-4 font-normal text-primary-200 mt-1">
          Duration
        </div>
        {customDuration === index ? (
          <div className=" flex flex-row border-2 w-24 rounded-sm text-sm  border-[#5aacdb] py-[2px] ml-2 px-2 text-primary-200">
            <input
              className="text-primary-200 border-0 focus:border-0 focus:outline-none w-full"
              type="text"
              autoComplete="off"
              value={custom}
              name="duration"
              onChange={(e: any) => setCustom(e.target.value)}
            />
            <div className="text-[#C4C4C4] mr-3 text-sm">min</div>
            <div onClick={Onclick} className="cursor-pointer">
              <svg
                className="mt-2 mr-1 "
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
          </div>
        ) : (
          <div className=" flex flex-row border-[0.5px] w-24 rounded-sm text-sm border-[#404041] py-[2px] ml-2 px-2 text-primary-200">
            <input
              className="text-primary-200 border-0 focus:border-0 focus:outline-none w-full"
              type="text"
              autoComplete="off"
              value={roomDuration}
              name="duration"
              onClick={Onclick}
            />
            <div onClick={Onclick} className="cursor-pointer">
              <svg
                className="mt-2 mr-1 "
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
          </div>
        )}

        {durationModal === index && (
          <div className="absolute mt-7 ml-60 z-50 w-[135px] h-[130px] shadow-[0_4px_10px_0px_rgba(0,0,0,0.1)] bg-[#FFFFFF] overflow-y-scroll overflow-x-hidden rounded-[4px]">
            <DurationPicker
              index={index}
              onChange={(e: any) => handleDuration(e.target.outerText)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoOfRoomsInput;
