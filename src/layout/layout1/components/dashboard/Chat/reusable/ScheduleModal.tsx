import moment from "moment";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../../../store";
import CheckBox from "../../../../../../atom/CheckBox/checkBox";
import CustomModal from "./CustomModal";
import { t } from "i18next";

interface ScheduleModalType {
  title: string;
  onclick: any;
}

const ScheduleModal = ({ title, onclick }: ScheduleModalType) => {
  const dispatch = useDispatch();
  const [custom, setCustom] = useState(false);
  const onClose = () =>{
    setCustom(false);
  }
  

  return (
    <div>
      <div
        // onClick={() => }
        className="bg-[#00000033] backdrop-blur fixed inset-0 z-20"
      >
        <div className="flex justify-center items-center place-content-center w-full h-full">
          <div className="flex flex-col h-fit w-[500px] bg-[white] p-[24px] rounded-[15px]">
            <div className="flex flex-row relative">
              <span className="text-primary-200 text-lg font-bold">{title}</span>
              <span
                onClick={onclick}
                className="absolute mt-[6px] top-0 right-0 cursor-pointer"
              >
                <svg
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

            <div className="flex flex-col mt-5">
              <div className="flex flex-row w-full">
                <div className="text-primary-200 text-left w-1/2 text-sm">
                 {t("Chat.In10minutes")}
                </div>
                <div className="text-right w-1/2 flex flex-row-reverse">
                  <div className="">
                    <CheckBox color={""} label={""} id={"box1"} />
                  </div>
                  <div className="text-[#0000004d] text-xs italic">
                    {new Date(
                      new Date(new Date().getTime() + 10 * 60000)
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-row w-full mt-[13px]">
                <div className="text-primary-200 text-left w-1/2 text-sm">
                {t("Chat.LaterToday")}
                </div>
                <div className="text-right w-1/2 flex flex-row-reverse">
                  <div className="">
                    <CheckBox color={""} label={""} id={"box1"} />
                  </div>
                  <div className="text-[#0000004d] text-xs italic">
                    {new Date(
                      new Date(new Date().getTime() + 360 * 60000)
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-row w-full mt-[13px]">
                <div className="text-primary-200 text-left w-1/2 text-sm">
                {t("Chat.TomorrowMorning")}
                </div>
                <div className="text-right w-1/2 flex flex-row-reverse">
                  <div className="">
                    <CheckBox color={""} label={""} id={"box1"} />
                  </div>
                  <div className="text-[#0000004d] text-xs italic">
                  10:10 AM
                  </div>
                </div>
              </div>
              <div className="flex flex-row w-full mt-[13px]">
                <div className="text-primary-200 text-left w-1/2 text-sm">
                {t("Chat.NextWeek")}
                </div>
                <div className="text-right w-1/2 flex flex-row-reverse">
                  <div className="">
                    <CheckBox color={""} label={""} id={"box1"} />
                  </div>
                  <div className="text-[#0000004d] text-xs italic">
                  {new Date(
                      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                    ).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        year:"numeric"
                      })}
                  </div>
                </div>
              </div>
              <div className="flex flex-row w-full mt-[13px]">
                <div className="text-primary-200 text-left w-1/2 text-sm">
                {t("Chat.NextMonth")}
                </div>
                <div className="text-right w-1/2 flex flex-row-reverse">
                  <div className="">
                    <CheckBox color={""} label={""} id={"box1"} />
                  </div>
                  <div className="text-[#0000004d] text-xs italic">
                  {new Date(
                      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                    ).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        year:"numeric"
                      })}
                  </div>
                </div>
              </div>
              <div className="flex w-full mt-[15px]">
                <div onClick={()=>setCustom(true)} className="text-link text-left w-fit cursor-pointer text-sm">
                {t("Chat.Custom")}
                </div>
              </div>

            </div>

            <div className="flex flex-row-reverse mt-2 h-full pt-1">
              <button
                //onClick={Onsubmit}
                className="h-[32px] w-[78px] mr-1 bg-primary-200 text-[#FFFFFF] rounded-[3px] ml-1 mb-1"
              >
                {t("Set")}
              </button>
              <button
                onClick={onclick}
                className="h-[32px] w-[78px] border-[#404041] border-[1.5px] text-primary-200 rounded-[3px] mb-1"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
      { custom === true ? <CustomModal title={"Custom Schedule"} onclick={onClose} /> : null}
    </div>
  );
};

export default ScheduleModal;
