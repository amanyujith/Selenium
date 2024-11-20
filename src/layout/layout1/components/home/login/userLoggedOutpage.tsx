import React from "react"
import { useNavigate } from "react-router-dom"
import path from "../../../../../navigation/routes.path"
import { t } from "i18next"

const UserLoggedOutpage = () => {
  const navigate = useNavigate()
  return (
    <div
      className={`w-screen h-screen absolute top-0 left-0 flex justify-center items-center z-10 bg-[#EBEDEF] `}
    >
      <div className="bg-[#293241] w-[500px] h-[350px] rounded-[10px] p-[20px] flex justify-center flex-col top-0 left-0 gap-5 items-center text-[#ffffff]">
        <svg
          width="120"
          height="57"
          viewBox="0 0 120 57"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36.1338 18.2061C41.0232 18.2061 44.9868 14.2424 44.9868 9.35304C44.9868 4.46364 41.0232 0.5 36.1338 0.5C31.2444 0.5 27.2808 4.46364 27.2808 9.35304C27.2808 14.2424 31.2444 18.2061 36.1338 18.2061Z"
            fill="white"
          />
          <path
            d="M83.8662 18.2061C88.7556 18.2061 92.7193 14.2424 92.7193 9.35304C92.7193 4.46364 88.7556 0.5 83.8662 0.5C78.9768 0.5 75.0132 4.46364 75.0132 9.35304C75.0132 14.2424 78.9768 18.2061 83.8662 18.2061Z"
            fill="white"
          />
          <path
            d="M82.4265 50.1776L81.5589 48.5292C81.4845 48.3804 73.354 33.3588 57.0063 33.3588C42.0962 33.3588 38.4648 47.5004 38.316 48.1077L37.8699 49.9049L34.2632 49.0373L34.697 47.2278C34.7342 47.0543 39.1217 29.6406 57.0063 29.6406C74.8909 29.6406 84.4839 46.0999 84.8557 46.8064L85.7232 48.4548L82.4265 50.1776Z"
            fill="white"
          />
        </svg>
        {t("Dashboard.UserIsLoggedout")}
        <button
          className="bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] rounded-[8px] px-5 py-1 m-3"
          onClick={() => {
            navigate(path.HOME);
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default UserLoggedOutpage
