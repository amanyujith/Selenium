import { t } from 'i18next';
import React, { useState } from 'react';

const DialOut = () => {
  const [number, setNumber]: any = useState();
  const Regx = /^[0-9\*\#]+$/;
  const validation = (evt: any) => {
    if (Regx.test(evt.target.value) || evt.target.value === '') {
      setNumber(evt.target.value);
    }
  };
  return (
    <div>
      <div className="flex flex-row place-content-center mt-10 h-[206px]">
        <select className="text-primary-200 border rounded-[3px] p-2 mr-1 border-1 focus:border-1 focus:outline-none bg-[#FFFFFF] w-[90px] h-9">
          {t("Dial.return")} (<option>+91</option>
          <option>+1</option>)
        </select>
        <div className="flex flex-row">
          <input
            className="text-primary-200 text-xl p-3 pt-0 border-b-2 focus:border-1  focus:outline-none h-9 ml-2"
            value={number}
            onChange={(evt) => validation(evt)}
          />
          <div
            className=" content-center pr-3"
            onClick={() => {
              setNumber(number.slice(0, number.length - 1));
            }}
          >
            <svg
              className="cursor-pointer"
              width="19"
              height="15"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.22188 10.65L10.8219 8.05L13.4219 10.65L14.4719 9.6L11.8719 7L14.4719 4.4L13.4219 3.35L10.8219 5.95L8.22188 3.35L7.17188 4.4L9.77187 7L7.17188 9.6L8.22188 10.65ZM0.546875 7L4.52188 1.4C4.72188 1.11667 4.97187 0.895667 5.27187 0.737C5.57187 0.579 5.89687 0.5 6.24687 0.5H15.6219C16.1219 0.5 16.5512 0.675 16.9099 1.025C17.2679 1.375 17.4469 1.8 17.4469 2.3V11.7C17.4469 12.2 17.2679 12.625 16.9099 12.975C16.5512 13.325 16.1219 13.5 15.6219 13.5H6.24687C5.89687 13.5 5.57187 13.4167 5.27187 13.25C4.97187 13.0833 4.72188 12.8667 4.52188 12.6L0.546875 7Z"
                fill="#A7A9AB"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse items-end">
        <button className="h-[32px] w-[78px] mr-1 bg-primary-200 text-[#FFFFFF] rounded-[3px] ml-3 mt-3">
          {t("Calls")}
        </button>
      </div>
    </div>
  );
};

export default DialOut;
