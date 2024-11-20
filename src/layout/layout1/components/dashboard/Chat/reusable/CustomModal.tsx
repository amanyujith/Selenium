
import moment from "moment";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../../../store";
import CheckBox from "../../../../../../atom/CheckBox/checkBox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { t } from "i18next";

interface CustomModalType {
  title: string;
  onclick: any;
}

const CustomModal = ({ title, onclick }: CustomModalType) => {
  const dispatch = useDispatch();
  const [calender, setCalender] = useState(false);
 const calenderdata = () =>{ }

 const handleCalender = () => {
    setCalender(!calender);
  };
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
                  width="14"
                  height="14"
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

            <div className="flex mt-6">
                <div className="text-primary-200 mt-2 mr-4">{t("Date")}</div>
              <div
                className="border border-solid box-border rounded-[5px] py-2 px-3 outline-none border-[#C4C4C4] w-40 flex"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 14 16"
                  fill="none"
                  className="mr-2.5 cursor-pointer "
                  onClick={() => handleCalender()}
                >
                  <path
                    d="M0 14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V6H0V14.5ZM10 8.375C10 8.16875 10.1687 8 10.375 8H11.625C11.8313 8 12 8.16875 12 8.375V9.625C12 9.83125 11.8313 10 11.625 10H10.375C10.1687 10 10 9.83125 10 9.625V8.375ZM10 12.375C10 12.1687 10.1687 12 10.375 12H11.625C11.8313 12 12 12.1687 12 12.375V13.625C12 13.8313 11.8313 14 11.625 14H10.375C10.1687 14 10 13.8313 10 13.625V12.375ZM6 8.375C6 8.16875 6.16875 8 6.375 8H7.625C7.83125 8 8 8.16875 8 8.375V9.625C8 9.83125 7.83125 10 7.625 10H6.375C6.16875 10 6 9.83125 6 9.625V8.375ZM6 12.375C6 12.1687 6.16875 12 6.375 12H7.625C7.83125 12 8 12.1687 8 12.375V13.625C8 13.8313 7.83125 14 7.625 14H6.375C6.16875 14 6 13.8313 6 13.625V12.375ZM2 8.375C2 8.16875 2.16875 8 2.375 8H3.625C3.83125 8 4 8.16875 4 8.375V9.625C4 9.83125 3.83125 10 3.625 10H2.375C2.16875 10 2 9.83125 2 9.625V8.375ZM2 12.375C2 12.1687 2.16875 12 2.375 12H3.625C3.83125 12 4 12.1687 4 12.375V13.625C4 13.8313 3.83125 14 3.625 14H2.375C2.16875 14 2 13.8313 2 13.625V12.375ZM12.5 2H11V0.5C11 0.225 10.775 0 10.5 0H9.5C9.225 0 9 0.225 9 0.5V2H5V0.5C5 0.225 4.775 0 4.5 0H3.5C3.225 0 3 0.225 3 0.5V2H1.5C0.671875 2 0 2.67188 0 3.5V5H14V3.5C14 2.67188 13.3281 2 12.5 2Z"
                    fill="#A7A9AB"
                  />
                </svg>
               
                <DatePicker
                  className="w-24 outline-none"
                  open={calender}
                  onClickOutside={() => setCalender(false)}
                  readOnly
                  minDate={new Date()}
                  selected ={new Date()}
                  onChange={calenderdata}
                  placeholderText=""
                />
              </div>
              <div className="text-primary-200 mt-2 mx-4">{t("Time")}</div>
              <TimePicker
                className="rc-time-picker-input"
                value={moment()}
                onChange={calenderdata}
                showSecond={false}
                use12Hours
              />
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
    </div>
  );
};

export default CustomModal;
