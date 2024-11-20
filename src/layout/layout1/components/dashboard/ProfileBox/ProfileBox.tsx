/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import "./ProfileBox.css"
import { useSelector } from "react-redux"
import LogoutModal from "../Modal/LogoutModal"
import { branding_logo_half } from "../../../../../constants/constantValues"
import EditPencilIcon from "../Chat/Icons/EditPencilIcon"
import { t } from "i18next"
import SettingsPanel from "../settingsPanel"
import Status from "./status"
import { Menu } from "@headlessui/react"
import { motion } from "framer-motion"
import {
  PREFERENCE_ICON,
  LOGOUT_ICON,
  PORTAL_LINK_ICON,
} from "../../../../../utils/SVG/svgsRestHere";
import UseEscape from "../Chat/hooks/useEscape"
const ProfileBox = (props: any) => {
  // const [closeCard, setCloseCard] = useState(false)

  const {
    closeCard,
    setCloseCard,
    setProfilerOn,
    profileOn,
    settingsPanel,
    setSettingsPanel,
  } = props
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const popUp = useSelector((state: any) => state.Flag.popUp)
  const [modal, setModal] = useState(false)
  const [brokenImage, setBrokenImage] = useState(false)
  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)
  const profileRef = useRef<HTMLDivElement>(null)
  const callMeetingData = useSelector(
    (state: any) => state.Chat.callMeetingData
  )
  const [profile, setProfile] = useState("")
  const selfData = useSelector((state: any) => state.Chat.selfData)

   UseEscape(() => setModal(false));

  const handleCloseClick = () => {
    setCloseCard(false)
    popUp.profilerOpenFlag = false
    if (profileOn) setProfilerOn(false); 
   }
  const handleData = (event: any) => {
    event.stopPropagation()
  }

  const setModalclose = () => {
    setModal(false)
  }

  const LogOut = () => {
    setModal(true)
    //keycloak.logout({ redirectUri: window.location.origin + '/app2/home' });
  }

  const handleBrokenImage = () => {
    setBrokenImage(true)
  }

  useEffect(() => {
    const newUrl = selfData?.profile_picture?.replace(
      /\.(jpg|jpeg|png|gif)$/,
      "-low.webp"
    )
    setProfile(newUrl)
  }, [selfData?.profile_picture])

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       profileRef.current &&
  //       !profileRef.current.contains(event.target as Node)
  //     ) {
  //

  //      handleCloseClick()
  //     }
  //   }
  //     document.addEventListener("mousedown", handleClickOutside)

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside)
  //   }
  // }, [profileOn])

  const portalNavigate = () => {
    // window.location.href = window.location.origin + "/portal";
    var path = window.location.origin + "/portal";
    window.open(path, "_blank");
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        transition: {
          duration: 0.3,
          type: "tween",
          ease: "easeOut",
        },
      }}
      key="profileBox"
      exit={{
        scale: 0,
        transition: {
          duration: 0.3,
          type: "tween",
          ease: "easeOut",
        },
      }}
      ref={profileRef}
      id="profileBox"
      onClick={(e: any) => e.stopPropagation()}
      className="origin-top-right absolute w-[310px] h-[420px] right-[50px] top-14 bg-[#FFFFFF] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-2xl z-[70]"
    >
      <div className="flex flex-col">
        <div className="bg-[#F1F1F1] flex flex-col p-3 rounded-lg">
          <div className="flex justify-end items-center mt-2 mr-3">
            <Menu.Item>
              <button id="profileBoxClick" onClick={() => handleCloseClick()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_632_23981)">
                    <path
                      d="M15.8337 5.3415L14.6587 4.1665L10.0003 8.82484L5.34199 4.1665L4.16699 5.3415L8.82533 9.99984L4.16699 14.6582L5.34199 15.8332L10.0003 11.1748L14.6587 15.8332L15.8337 14.6582L11.1753 9.99984L15.8337 5.3415Z"
                      fill="#A7A9AB"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_632_23981">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </Menu.Item>
          </div>
          <div className="flex items-center mt-4">
            <button className="flex justify-center text-[18px] font-semibold items-center w-[42px] h-[42px] mr-2 rounded-[33.3333px_33.3333px_33.3333px_0px] bg-[#91785B] border-[2px] border-[#E9EBF8] text-[#FFFFFF] p-[1px]">
              {selfData?.profile_picture &&
              selfData?.profile_picture !== "undefined" ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                !brokenImage ? (
                  <img
                    src={profile}
                    onError={() => setProfile(selfData?.profile_picture)}
                    className={"rounded-[33.3333px_33.3333px_33.3333px_0px]"}
                  />
                ) : (
                  <img
                    src={branding_logo_half}
                    className={"rounded-[33.3333px_33.3333px_33.3333px_0px]"}
                  />
                )
              ) : selfData?.display_name ? (
                selfData?.display_name?.charAt(0).toUpperCase()
              ) : (
                loggedInUserInfo?.given_name?.charAt(0).toUpperCase()
              )}
            </button>
            <div className="ml-[26px] mt-[29px] absolute">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="5.75"
                  fill={
                    callInfo || callMeetingData?.[0] ? "#EF4036" : "#76B947"
                  }
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
          <div className="text-[#293241] text-[20px] font-bold mt-4">
            {selfData?.display_name
              ? selfData?.display_name
              : loggedInUserInfo?.given_name}
          </div>
          <div className="text-[#5C6779] text-[14px]">
            {loggedInUserInfo?.email}
          </div>
          <Menu.Item disabled>
            <Status />
          </Menu.Item>
        </div>
        <div className="bg-[#FEFDFB] flex flex-col gap-2 mt-1">
          <Menu.Item>
            <div
              id="portalNavigate"
              onClick={(e) => portalNavigate()}
              className="flex flex-row px-4 pt-3 gap-4 cursor-pointer items-center text-[#5C6779]"
            >
              {PORTAL_LINK_ICON}
              <div>Workspace Settings </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div
              id="settingsPanel"
              onClick={(e) => setSettingsPanel(!settingsPanel)}
              className="flex flex-row px-4 pt-3 gap-4 cursor-pointer items-center text-[#5C6779]"
            > 
              {PREFERENCE_ICON}
              <div id="preferences">Preferences </div>
            </div>
          </Menu.Item>
          <div
            id="logout"
            onClick={() => LogOut()}
            className="flex flex-row px-4 pt-3 gap-4 items-center cursor-pointer text-[#F74B14]"
          >
            {LOGOUT_ICON}
            <div>Logout</div>
          </div>
        </div>
      </div>

      {modal && <LogoutModal setclose={setModalclose} />}
    </motion.div>
  );
}

export default ProfileBox
