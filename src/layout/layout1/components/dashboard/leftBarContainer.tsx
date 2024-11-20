import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SettingsItem from '../../../../atom/SettingsItem/settingsItem'
import { actionCreators } from '../../../../store';
import path from "../../../../navigation/routes.path";


const LeftBarContainer = (props: any) => {
    const { setOpenTodayMeeting, setProfileSettingsClick } = props;
    const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const pastNav = () => {
        navigate(`${path.PAST}`);
        dispatch(actionCreators.setChatscreen(false));
    };
    const handleClick = () => {
        // setOpenTodayMeeting(true)mathew
        setOpenTodayMeeting(false);
        setProfileSettingsClick(false);
        dispatch(actionCreators.setChatscreen(false));
        dispatch(actionCreators.setProgress(false));
    };
    return (
      <div className="mt-5 ml-[5px] mr-1.5">
        <Link to="">
          <div className="ml-2.5 text-lg text-left pt-3 pb-5 text-primary-100">
            <button
              className="cursor-pointer font-bold font-roboto"
              onClick={() => handleClick()}
            >
              {" "}
              {brandingInfo?.data?.brandname}
            </button>
          </div>
        </Link>
        <hr className="px-0 opacity-20 text-primary-100" />

        <div onClick={pastNav}>
          <SettingsItem label={"History"}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.97188 17.5C6.80521 17.5 4.91754 16.7877 3.30887 15.363C1.70087 13.9377 0.780208 12.15 0.546875 10H2.07187C2.32187 11.7333 3.09688 13.1667 4.39688 14.3C5.69688 15.4333 7.22188 16 8.97188 16C10.9219 16 12.5762 15.3207 13.9349 13.962C15.2929 12.604 15.9719 10.95 15.9719 9C15.9719 7.05 15.2929 5.39567 13.9349 4.037C12.5762 2.679 10.9219 2 8.97188 2C7.88854 2 6.86788 2.24167 5.90987 2.725C4.95121 3.20833 4.13021 3.875 3.44687 4.725H6.04688V6.225H0.971875V1.15H2.47187V3.525C3.28854 2.55833 4.26354 1.81233 5.39687 1.287C6.53021 0.762334 7.72188 0.5 8.97188 0.5C10.1552 0.5 11.2635 0.725 12.2969 1.175C13.3302 1.625 14.2302 2.23333 14.9969 3C15.7635 3.76667 16.3675 4.66267 16.8089 5.688C17.2509 6.71267 17.4719 7.81667 17.4719 9C17.4719 10.1833 17.2509 11.2873 16.8089 12.312C16.3675 13.3373 15.7635 14.2333 14.9969 15C14.2302 15.7667 13.3302 16.375 12.2969 16.825C11.2635 17.275 10.1552 17.5 8.97188 17.5ZM11.9719 13.025L8.24687 9.3V4H9.74687V8.7L13.0219 11.975L11.9719 13.025Z"
                fill="#A7A9AB"
              />
            </svg>
          </SettingsItem>
        </div>
      </div>
    )
}

export default LeftBarContainer