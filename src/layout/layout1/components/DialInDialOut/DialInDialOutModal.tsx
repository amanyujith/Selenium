import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { actionCreators } from '../../../../store';
import ComputerAudio from './ComputerAudio';
import DialIn from './DialIn';
import DialOut from './DialOut';
import { t } from 'i18next';

const DialInDialOutModal = () => {
  const dispatch = useDispatch();
  const [page, setPage]: any = useState('DialIn');
  return (
    <div>
      <div className="bg-[#00000033] opacity-100  backdrop-blur-xl lg:backdrop-blur-lg fixed inset-0 z-10">
        <div className="flex justify-center items-center place-content-center w-full h-full">
          <div className="flex flex-col h-[400px] w-[600px] bg-[white] p-[18px] rounded-[15px]">
            <div className="flex flex-row relative">
              <span className="text-primary-200 text-lg font-bold leading-5 h-[21px] mb-5 p-3">
                {t("Dial.ChooseMsg")}
              </span>
              <span
                className="absolute mt-[6px] top-0 right-0 cursor-pointer"
                onClick={() => dispatch(actionCreators.setDialModal(false))}
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
            <div className="flex items-center w-[552px] h-[32px] justify ">
              <span
                className={
                  page === 'ComputerAudio'
                    ? 'w-[276px] px-[16px] py-[2px] border-b-2'
                    : 'w-[276px] px-[16px] py-[2px] border-b-2 text-[#C4C4C4] border-[#C4C4C4]'
                }
                onClick={() => setPage('ComputerAudio')}
              >
                {t("Dial.ComputerAudio")}
              </span>
              <span
                className={
                  page === 'DialIn'
                    ? 'w-[276px] px-[16px] py-[2px] border-b-2'
                    : 'w-[276px] px-[16px] py-[2px] border-b-2 text-[#C4C4C4] border-[#C4C4C4]'
                }
                onClick={() => setPage('DialIn')}
              >
                {t("Dial.DialIn")}
              </span>
              {/* <span
                className={
                  page === 'DialOut'
                    ? 'w-[184px] px-[16px] py-[2px] border-b-2'
                    : 'w-[184px] px-[16px] py-[2px] border-b-2 text-[#C4C4C4] border-[#C4C4C4]'
                }
                onClick={() => setPage('DialOut')}
              >
                Dial Out
              </span> */}
            </div>
            {page === 'DialIn' ? (
              <DialIn />
            )
              // : page === 'DialOut' ? (
              //   <DialOut />
              // )
              : page === 'ComputerAudio' ? (
                <ComputerAudio />
              ) : (
                ''
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialInDialOutModal;
