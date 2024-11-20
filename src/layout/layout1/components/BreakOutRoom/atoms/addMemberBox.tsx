import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import checkBox from "../../../../../atom/CheckBox/checkBox";
import { actionCreators } from "../../../../../store";

interface AddMemberBox {
  participants: any;
  profile_picture?: string;
}

const AddMemberBox = ({ participants, profile_picture }: AddMemberBox) => {
  const dispatch = useDispatch();
  const [memberslist, setMemberslist] = useState<any[]>([]);
  

  const onClose = () => {
    dispatch(actionCreators.setAddMemberBox(-1));
  };
  const handleCheckboxChange = (e:any) =>{
    if (e.target.checked) {
        setMemberslist([
        ...memberslist,e.target.value
      ]);
    }}

  const Onsubmit =() =>{
    dispatch(actionCreators.setMembersLists(memberslist));
    dispatch(actionCreators.setAddMemberBox(-1));
  }  

  return (
    <div>
      <div className={" pl-2 flex flex-col w-full z-50 h-[36px] "}>
        <div className={`flex w-full text-sm rounded-[3px]`}>
          <div className="w-full h-8 p-1 ">
            <div className="flex flex-row content-center ">
              <svg
                className="mt-1 mr-3"
                width="13"
                height="12"
                viewBox="0 0 12 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4052 10.5021L6.73021 6.84167C6.43854 7.08472 6.10312 7.2743 5.72396 7.41042C5.34479 7.54653 4.9559 7.61458 4.55729 7.61458C3.5559 7.61458 2.71007 7.26944 2.01979 6.57917C1.32951 5.88889 0.984375 5.04306 0.984375 4.04167C0.984375 3.05 1.32951 2.2065 2.01979 1.51117C2.71007 0.816222 3.5559 0.46875 4.55729 0.46875C5.54896 0.46875 6.38993 0.813889 7.08021 1.50417C7.77049 2.19444 8.11562 3.04028 8.11562 4.04167C8.11562 4.45972 8.04757 4.85833 7.91146 5.2375C7.77535 5.61667 7.59062 5.94722 7.35729 6.22917L11.0177 9.88958L10.4052 10.5021ZM4.55729 6.73958C5.3059 6.73958 5.94038 6.47708 6.46071 5.95208C6.98065 5.42708 7.24062 4.79028 7.24062 4.04167C7.24062 3.29306 6.98065 2.65625 6.46071 2.13125C5.94038 1.60625 5.3059 1.34375 4.55729 1.34375C3.79896 1.34375 3.15982 1.60625 2.63987 2.13125C2.11954 2.65625 1.85938 3.29306 1.85938 4.04167C1.85938 4.79028 2.11954 5.42708 2.63987 5.95208C3.15982 6.47708 3.79896 6.73958 4.55729 6.73958Z"
                  fill="#A7A9AB"
                />
              </svg>

              <input
                className="text-primary-200 border-0 focus:border-0 focus:outline-none w-full"
                placeholder="Search members"
                type="text"
                name="searchMembers"
              />
            </div>
          </div>
        </div>
        <hr className="text-[#00000021]" />
        <div>
          {participants.map((item: any) => {
            return (
              <div className="flex flex-row h-9 w-full p-[9px]">
                <input
                  type="checkbox"
                  value={item}
                  onChange={(e) => handleCheckboxChange(e)}
                  className="mr-3 h-6 w-6"
                />
                <div
                  className={`w-[24px] shrink-0 h-[18px] rounded-bl-none rounded-[44%] border-[2px] border-[#E9EBF8] text-[4px] text-primary-200 bg-primary-100 overflow-hidden`}
                >
                  {profile_picture !== "undefined" ? (
                    <img
                      className="w-full h-full  object-cover"
                      src={profile_picture}
                      alt=""
                    />
                  ) : (
                    item?.slice(0, 1)
                  )}
                </div>
                <div
                  className={`flex flex-row w-full text-[16px] pl-3 text-[#6d6e70]`}
                >
                  <div className={`w-4/5 flex justify-start text-primary-200`}>
                    {" "}
                    {item}{" "}
                  </div>
                </div>
              </div>
            );
          })}
          </div>

        <div>
          <div className="flex flex-row-reverse h-full pt-1">
            <button onClick={Onsubmit} className="h-[32px] w-[78px] mr-1 bg-primary-200 text-[#FFFFFF] rounded-[3px] ml-1 mb-1">
              Confirm
            </button>
            <button
              onClick={onClose}
              className="h-[32px] w-[78px] border-[#404041] border-[1.5px] text-primary-200 rounded-[3px] mb-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberBox;
