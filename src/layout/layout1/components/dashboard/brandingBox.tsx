import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { actionCreators } from "../../../../store"

interface BrandboxTypes {
  setOpenTodayMeeting: (args: boolean) => void
  setProfileSettingsClick: (args: boolean) => void
}

const BrandingBox = ({
  setOpenTodayMeeting,
  setProfileSettingsClick,
}: BrandboxTypes) => {
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(actionCreators.toggleLeftbar("hidden"))
    // setOpenTodayMeeting(true)mathew
    setOpenTodayMeeting(false)
    setProfileSettingsClick(false)
    dispatch(actionCreators.setChatscreen(false));
    dispatch(actionCreators.unsetAcitveChat());
  }
  
  return (
    <div className="flex justify-between items-center bg-[#293241] min-h-[52px] max-h-[52px]">
      <Link to="">
        <div className="ml-3.5 text-lg text-left ">
          <button
            className="cursor-pointer font-bold font-roboto flex flex-row gap-2 min-w-[200px] max-w-[200px]"
            onClick={() => handleClick()}
          >
            {brandingInfo?.data?.logos?.logoDark ? (
              <img
                src={brandingInfo?.data?.logos?.logoDark}
                alt="logo"
                className="max-w-[200px] max-h-[42px]"
              />
            ) : (
              <>
                <span className=" w-6 h-6 rounded-full flex justify-center items-center">
                  <img
                    src={brandingInfo?.data?.logos?.favicon}
                    alt="logo"
                    className="rounded-full"
                  />
                </span>
                <span className="text-[#4F4F4F]">
                  {brandingInfo?.data?.brandname}
                </span>
              </>
            )}
          </button>
        </div>
      </Link>
      <div className="mr-5 flex flex-row items-center gap-1">
        {/* <div className="mt-2">
            <Link to="settings/general">
              <button onClick={() => handleToggleNext()}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M17.1352 11.0993L15.6375 10.2344C15.7887 9.41878 15.7887 8.58206 15.6375 7.76644L17.1352 6.9016C17.3074 6.80316 17.3848 6.59925 17.3285 6.40941C16.9383 5.15785 16.2738 4.02581 15.4055 3.08363C15.2719 2.93949 15.0539 2.90433 14.8852 3.00277L13.3875 3.86761C12.7582 3.32621 12.034 2.90785 11.25 2.63363V0.907455C11.25 0.71058 11.1129 0.538314 10.9195 0.496127C9.6293 0.207845 8.30743 0.221908 7.08048 0.496127C6.88712 0.538314 6.75001 0.71058 6.75001 0.907455V2.63714C5.96954 2.91488 5.24532 3.33324 4.61251 3.87113L3.11837 3.00628C2.9461 2.90785 2.73165 2.93949 2.59805 3.08714C1.7297 4.02581 1.06524 5.15785 0.675008 6.41292C0.615242 6.60277 0.696101 6.80667 0.868367 6.90511L2.36602 7.76995C2.21485 8.58558 2.21485 9.4223 2.36602 10.2379L0.868367 11.1028C0.696101 11.2012 0.618758 11.4051 0.675008 11.595C1.06524 12.8465 1.7297 13.9785 2.59805 14.9207C2.73165 15.0649 2.94962 15.1 3.11837 15.0016L4.61602 14.1368C5.24532 14.6782 5.96954 15.0965 6.75352 15.3707V17.1004C6.75352 17.2973 6.89063 17.4696 7.08399 17.5118C8.37423 17.8 9.6961 17.786 10.9231 17.5118C11.1164 17.4696 11.2535 17.2973 11.2535 17.1004V15.3707C12.034 15.093 12.7582 14.6746 13.391 14.1368L14.8887 15.0016C15.0609 15.1 15.2754 15.0684 15.409 14.9207C16.2774 13.9821 16.9418 12.85 17.332 11.595C17.3848 11.4016 17.3074 11.1977 17.1352 11.0993ZM9.00001 11.8129C7.44962 11.8129 6.18751 10.5508 6.18751 9.00042C6.18751 7.45003 7.44962 6.18792 9.00001 6.18792C10.5504 6.18792 11.8125 7.45003 11.8125 9.00042C11.8125 10.5508 10.5504 11.8129 9.00001 11.8129Z"
                    fill="#A7A9AB"
                  />
                </svg>
              </button>
            </Link>
          </div> */}
      </div>
    </div>
  )
}

export default BrandingBox
