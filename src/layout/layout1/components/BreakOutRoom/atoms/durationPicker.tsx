import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../../store";

interface DurationPickerType {
  index: any;
  onChange?: any;
}

const DurationPicker = ({ index, onChange }: DurationPickerType) => {
  const dispatch = useDispatch();
  const duration = ["15 min", "20 min", "30 min", "45 min", "50 min", "1 hour"];

  const custom = () => {
    dispatch(actionCreators.setCustom(index));
    dispatch(actionCreators.setRoomDurationModal(-1));
  };
  return (
    <div className="flex flex-col text-left w-full z-50 h-fit">
      {duration.map((item: any) => {
        return (
          <div
            className="h-8 pl-4 w-full py-1 pr-1 cursor-pointer text-primary-200"
            onClick={onChange}
          >
            {item}{" "}
          </div>
        );
      })}
      <hr className="w-full pl-4 text-[#C4C4C4]" />
      <div
        onClick={custom}
        className="h-8 pl-4 w-full py-1 pr-1 text-primary-200 cursor-pointer"
      >
        Custom
      </div>
    </div>
  );
};

export default DurationPicker;
