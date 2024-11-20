import { t } from 'i18next';
import React from 'react';

function SafariPopUpModal(props:any) {

    const handleCancelClick = () =>{
        props.setclose();
    }
    
    return (
        <div>
        <div className="bg-[#00000033] bg-opacity-100  backdrop-blur fixed inset-0 z-[300]">
          <div className="flex items-center place-content-center w-full h-full justify-center">
            <div className="flex flex-col h-[200px] w-[512px] bg-[white] p-[24px] rounded-[15px] ">
              <div className="flex flex-row-reverse mt-2">
                <svg
                  id='safariModalclose'
                  onClick={() => handleCancelClick()}
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.3307 1.84102L11.1557 0.666016L6.4974 5.32435L1.83906 0.666016L0.664062 1.84102L5.3224 6.49935L0.664062 11.1577L1.83906 12.3327L6.4974 7.67435L11.1557 12.3327L12.3307 11.1577L7.6724 6.49935L12.3307 1.84102Z"
                    fill="#A7A9AB"
                  />
                </svg>
              </div>
              <div className="my-[30px] text-left ml-7">
                {t("Dashboard.SafariMsg")}
              </div>
              <div className="flex flex-row-reverse">
                  <>
                  <div className="flex gap-[20px]">
                  <button
                      id='safariModalcancel'
                      onClick={() => handleCancelClick()}
                      className="rounded-[3px] text-primary-200 w-fit px-[16px] h-[32px] border-[#404041] border-[1px] text-sm "
                    >
                      {t("Cancel")}
                    </button>
                  </div>
                  </>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default SafariPopUpModal;