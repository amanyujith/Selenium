import React from "react";
import { useDispatch } from "react-redux";
import { actionCreators } from "../../../../../store";

function ThreeDotsMenu() {
    const dispatch = useDispatch();
  return (
    <div>
      <div className={"pl-1 flex flex-col w-full z-10 h-[36px] "}>
        <div className={`flex flex-col w-full text-sm rounded-[3px]`}>
          <div className="h-8 flex flex-row cursor-pointer">
            <svg
            className="mt-3 ml-2"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.4375 11.0625V6.5625H0.9375V5.4375H5.4375V0.9375H6.5625V5.4375H11.0625V6.5625H6.5625V11.0625H5.4375Z"
                fill="#A7A9AB"
              />
            </svg>
            <div onClick={() =>dispatch(actionCreators.setAddMemberModal(true))} className="mt-2 ml-3 text-primary-200 text-sm">Add member</div>
          </div>
          <hr className="text-[#0000001f] " />
          <div className="h-8 flex flex-row cursor-pointer ">
            <svg
             className="mt-3 ml-2"
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.475 13.375C2.1 13.375 1.78125 13.2438 1.51875 12.9813C1.25625 12.7188 1.125 12.4 1.125 12.025V2.5H0.375V1.375H3.75V0.71875H8.25V1.375H11.625V2.5H10.875V12.025C10.875 12.4 10.7438 12.7188 10.4813 12.9813C10.2188 13.2438 9.9 13.375 9.525 13.375H2.475ZM4.05 10.75H5.175V4H4.05V10.75ZM6.825 10.75H7.95V4H6.825V10.75Z"
                fill="#A7A9AB"
              />
            </svg>
            < div className="mt-2 ml-3 text-primary-200 text-sm">Delete Room</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreeDotsMenu;
