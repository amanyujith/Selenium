
import FadeIn from "react-fade-in/lib/FadeIn";
import * as React from "react";
import { motion } from "framer-motion";

const Modal = (props:any) => {
  const { title, closeEvent, bgColour } = props;
  return (
    <div className=" bg-opacity-100 backdrop-blur-sm bg-[#00000033] fixed inset-0 z-[300]">
      <motion.div
        key="custommodal"
        initial={{ opacity: 0, translateY: "60px" }}
        animate={{
          opacity: 1,
          translateY: "0px",
          transition: { duration: 0.4 },
        }}
        className="flex items-center place-content-center w-full h-full justify-center"
      >
        <div className="flex flex-col min-w-[470px] min-h-[180px] max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden w-fit bg-[white] p-[24px] rounded-[15px] shadow-[4px_4px_12px_2px_rgba(0,0,0,0.10)]">
          {title && (
            <div
              className={`px-3 flex justify-between ${
                bgColour ?? "bg-[#FFFFFF]"
              }`}
            >
              <span className="flex">
                <div className="text-[17px] font-semibold text-[#404041]">
                  {title}
                </div>
              </span>
              {closeEvent && (
                <span
                  id="modalClose"
                  onClick={() => closeEvent()}
                  className="cursor-pointer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.0187 5.09653C14.3271 4.78819 14.3271 4.2896 14.0187 3.98454C13.7104 3.67948 13.2118 3.67619 12.9067 3.98454L9.00328 7.888L5.09653 3.98126C4.78819 3.67291 4.2896 3.67291 3.98454 3.98126C3.67948 4.2896 3.67619 4.78819 3.98454 5.09325L7.888 8.99672L3.98126 12.9035C3.67291 13.2118 3.67291 13.7104 3.98126 14.0155C4.2896 14.3205 4.78819 14.3238 5.09325 14.0155L8.99672 10.112L12.9035 14.0187C13.2118 14.3271 13.7104 14.3271 14.0155 14.0187C14.3205 13.7104 14.3238 13.2118 14.0155 12.9067L10.112 9.00328L14.0187 5.09653Z"
                      fill="#5C6779"
                    />
                  </svg>
                </span>
              )}
            </div>
          )}
          <div className={` ${bgColour ?? "bg-[#FFFFFF] p-4"}`}>
            {props.children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default Modal;
