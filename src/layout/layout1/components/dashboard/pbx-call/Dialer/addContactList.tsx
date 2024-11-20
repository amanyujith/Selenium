import React, { useState } from "react"
import Lottiefy from "../../../../../../atom/Lottie/lottie"
import * as noDataFound from "../../../../../../atom/Lottie/noDataFound.json"
import { RootState } from "../../../../../../store"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import ContactList from "../PbxDashboard/Contacts/contactList"

const AddContactList = () => {
  const contactList = useSelector((state: RootState) => state.Call.contactList)
  const pbxCallData = useSelector((state: RootState) => state.Call.pbxCallData)
  const [searchValue, setSearchValue] = useState("")
  const profileColors = ["#557BBB", "#B78931", "#91785B"]
  return (
    <motion.div
      key="addcontactlist"
      initial={{ opacity: 0, translateY: "10px" }}
      animate={{
        opacity: 1,
        translateY: "0px",
        transition: { duration: 0.3 },
      }}
      className="rounded-xl  h-[390px]"
    >
      <div onClick={(e: any) => {}}>
        <div className="h-12 flex items-center  mb-3 mx-3 py-2.5 pl-3.5 border-[1px] bg-[#ffffff14] border-[#0000001f] border-solid rounded-[10px]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_10_664)">
              <path
                d="M14.625 7.3125C14.625 8.92617 14.1012 10.4168 13.2188 11.6262L17.6695 16.0805C18.109 16.5199 18.109 17.2336 17.6695 17.673C17.2301 18.1125 16.5164 18.1125 16.077 17.673L11.6262 13.2188C10.4168 14.1047 8.92617 14.625 7.3125 14.625C3.27305 14.625 0 11.352 0 7.3125C0 3.27305 3.27305 0 7.3125 0C11.352 0 14.625 3.27305 14.625 7.3125ZM7.3125 12.375C7.97732 12.375 8.63562 12.2441 9.24984 11.9896C9.86405 11.7352 10.4221 11.3623 10.8922 10.8922C11.3623 10.4221 11.7352 9.86405 11.9896 9.24984C12.2441 8.63562 12.375 7.97732 12.375 7.3125C12.375 6.64768 12.2441 5.98938 11.9896 5.37516C11.7352 4.76095 11.3623 4.20287 10.8922 3.73277C10.4221 3.26268 9.86405 2.88977 9.24984 2.63536C8.63562 2.38095 7.97732 2.25 7.3125 2.25C6.64768 2.25 5.98938 2.38095 5.37516 2.63536C4.76095 2.88977 4.20287 3.26268 3.73277 3.73277C3.26268 4.20287 2.88977 4.76095 2.63536 5.37516C2.38095 5.98938 2.25 6.64768 2.25 7.3125C2.25 7.97732 2.38095 8.63562 2.63536 9.24984C2.88977 9.86405 3.26268 10.4221 3.73277 10.8922C4.20287 11.3623 4.76095 11.7352 5.37516 11.9896C5.98938 12.2441 6.64768 12.375 7.3125 12.375Z"
                fill="#B1B1B1"
              />
            </g>
            <defs>
              <clipPath id="clip0_10_664">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <input
            // ref={searchRef}
            type="text"
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
            placeholder={"Search numbers or names"}
            className=" ml-3 outline-none bg-[#ffffff01] text-[#B1B1B1] w-80"
            // value={searchText}
            // onClick={(event: any) => event.stopPropagation()}
            //   onClick={(event: any) => {dispatch(actionCreators.setPopUp("searchDropDown"))
            // }}
            //onClick={(event: any) => handlePopUpData(event)}
            // onChange={handleUserSearch}
            // onKeyDown={handleKeyPress}
            // onChange={(e: any) =>
            //   handleSearch(e.target.value, e, "searchDropDown")
            // }
            autoFocus
          />
          {/* )} */}
        </div>
      </div>
      <div className="overflow-y-auto h-full">
        {contactList.length > 0 ? (
          contactList
            .filter(
              (contact: any) =>
                (searchValue === "" ||
                  contact?.display_name
                    ?.toLowerCase()
                    ?.includes(searchValue.toLowerCase()) ||
                  contact?.id?.includes(searchValue)) &&
                contact?.id != pbxCallData?.data?.callee &&
                contact?.id != pbxCallData?.data?.caller
            )
            .map((item: any, index: number) => {
              let colorIndex =
                (item?.id?.match(/\d/g)?.join("") + new Date()?.getDate()) %
                profileColors.length
              return (
                <>
                  <ContactList
                    key={item.hoolva_user}
                    uuid={item.hoolva_user}
                    index={index}
                    name={item.display_name.trim()}
                    profile_picture={item.profile_picture}
                    presence={item.presence}
                    color={profileColors[colorIndex]}
                    phone={item.id}
                    inCall={true}
                    restClass={"text-[white]"}
                  ></ContactList>
                </>
              )
            })
        ) : (
          <div className="flex h-3/5 justify-center items-center flex-col">
            <Lottiefy loop={true} json={noDataFound} height={30} width={30} />
            <div className="text-[#C4C4C4] text-lg py-1">No data found!</div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AddContactList
