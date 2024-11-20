import React, { useState, useCallback, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import { useNavigate } from "react-router-dom"
import path from "../../../../../navigation/routes.path"
import AddGrpDropdown from "./AddGrpDropdown"
import AddMemberBubble from "./AddMemberBubble"
import useFocus from "./hooks/useFocus"
import { t } from "i18next"
import DropDown from "../../../../../atom/DropDown/dropDown"
import { motion } from "framer-motion"
import UseEscape from "./hooks/useEscape"
const _ = require("lodash")
const maxDiscriptionLength = 120

interface IMember {
  uuid: string
  unread_msg_count: number
  status: string
  profile_picture: string | null
  presence: string
  messages: any[]
  lastname: string
  last_seen?: number | null
  firstname: string
  display_name: string | null
  type: "user" | "group"
}

const maxNameLength = 30

const CreateGrouppModal = (props: any) => {
  const [dropdown, setDropdown] = useState(false)
  const messengerslist = useSelector((state: any) => state.Chat.userData)
  //const members = useSelector((state: any) => state.Chat.grpMembers);
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const [inputRef, setInputFocus] = useFocus()
  const [title, setTitle] = useState<any>("private")
  const [membersList, setMemebersList] = useState([])
  const [groupMembers, setGroupMembers] = useState<IMember[]>([])
  const [groupName, setGroupName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [searchText, setSearchText] = useState<string>("")
  const [errorMsg, setErrorMsg] = useState<string>("")
UseEscape(() => onClose());
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const titles = [
    {
      name: "Private",
      value: "private",
    },
    {
      name: "Public",
      value: "public",
    },
  ]
  const onClose = () => {
    dispatch(actionCreators.setCreateGrpModal(false))
    dispatch(actionCreators.setCreateGrpOption(false))
  }
  const onDropDownClick = () => {
    setDropdown(!dropdown)
  }

  const closeDropDown = (e: any) => {
    e.stopPropagation()
    setDropdown(false)
  }

  const updateMemberList = (messengerslist: any) => {
    let newMemberList = messengerslist.filter((el: IMember) =>
      groupMembers.every((f) => f.uuid !== el.uuid && el.type === "user")
    )
    return newMemberList
  }

  useEffect(() => {
    // const updatedList = updateMemberList();
    //setMemebersList(updatedList);
    handleDebounceFn(searchText)
  }, [groupMembers])

  const addMember = (item: IMember) => {
    if (!groupMembers.some((e) => e.uuid === item.uuid)) {
      setGroupMembers([...groupMembers, item])
      setSearchText("")
      setInputFocus()
      // setDropdown(false);
    }
  }

  const removeMember = (item: IMember) => {
    let arr = groupMembers.filter((el) => el.uuid !== item.uuid)
    setGroupMembers(arr)
    setInputFocus()
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debounceFn(e.target.value)
    if (!dropdown) setDropdown(true)
  }

  const handleDebounceFn = (searchText: string) => {
    //const updatedList = updateMemberList();
    chatInstance?.tenantSearch(searchText).then((res: any) => {
      const updatedList = updateMemberList(
        res.filter((node: any) => node.type === "user")
      )
      // setUserList(res)
      // let arr = updatedList.filter((item: IMember) =>
      //   item.firstname.toLowerCase().includes(searchText.toLowerCase())
      // );
      setMemebersList(updatedList)
    })
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 500), [
    membersList,
  ])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value)
  }

  const createGroup = () => {
    const arr = groupMembers.map((item) => item.uuid)
    chatInstance
      ?.addGroup({
        name: groupName,
        members: arr,
        private: title === "private" ? true : false,
        description: description,
      })
      .then((res: any) => {
        // const response = res;
        // response.pinned_messages = []
        dispatch(actionCreators.updateGroupData(res, true))
        navigate(`${path.CHAT}/${res.uuid}`)

        onClose()
        //contains group data
      })
      .catch((e: any) => {
        setErrorMsg(e.data.reason)
      })
  }

  return (
    <div>
      <div className="bg-[#00000033] opacity-100  backdrop-blur fixed inset-0 z-[400]">
        <div
          id="closecreateGroup"
          className="flex justify-center items-center place-content-center w-full h-full overflow-y-auto overflow-x-hidden"
          onClick={(e) => closeDropDown(e)}
        >
          <motion.div
            key="createGroupModal"
            initial={{ opacity: 0, translateY: "60px" }}
            animate={{
              opacity: 1,
              translateY: "0px",
              transition: { duration: 0.4 },
            }}
            className="flex flex-col h-fit w-[500px] bg-[white] p-[24px] rounded-[15px]"
          >
            <div className="flex flex-row relative">
              <span className="text-[#293241] text-base font-bold">
                {t("Chat.CreateGroup")}
              </span>
              <span className="absolute mt-[6px] top-0 right-0 cursor-pointer">
                <svg
                  onClick={onClose}
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
            <span className="flex flex-row mt-6 w-full">
              <input
                id="createGroupName"
                type="text"
                value={groupName}
                onChange={handleNameChange}
                maxLength={maxNameLength}
                placeholder={t("Chat.GroupName")}
                className="rounded-[8px] border-[1px] text-[#767676] border-[#B1B1B1] h-[44px] box-border py-2 px-3 outline-none w-2/3 flex"
              />
              <DropDown
                id="createGroupDropdown"
                value={title}
                options={titles}
                onChange={(e: any) => {
                  setTitle(e.target.value);
                }}
                restClass={
                  "rounded-[8px] border-[1px] ml-4 cursor-pointer text-[#767676] border-[#B1B1B1] h-[44px] box-border py-2 px-3 outline-none w-[150px] flex"
                }
              />
            </span>

            <textarea
              id="createGroupTextArea"
              value={description}
              onChange={(e: any) => {
                setDescription(e.target.value);
              }}
              maxLength={maxDiscriptionLength}
              placeholder={"Putdown about group..."}
              className=" w-full rounded-[8px] border-[1px] border-[#B1B1B1] focus:border-[#C4C4C4] focus:outline-none  mt-3 min-h-[100px]  p-3 mb-3 text-primary-200"
            />
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-[8px] border-[1px] border-[#B1B1B1] focus:border-[#C4C4C4] focus:outline-none mt-3s h-fit min-h-[44px]"
            >
              <div className="flex flex-row flex-wrap max-h-[150px] overflow-y-auto overflow-x-hidden my-1 h-fit w-full">
                {groupMembers.map((item: any) => {
                  return (
                    <AddMemberBubble
                      member={item}
                      removeMember={removeMember}
                    />
                  );
                })}
              </div>
              <div className="flex flex-row content-center">
                <svg
                  className="mt-[2px] mx-3"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <g clip-path="url(#clip0_797_20343)">
                    <path
                      d="M14.625 7.3125C14.625 8.92617 14.1012 10.4168 13.2188 11.6262L17.6695 16.0805C18.109 16.5199 18.109 17.2336 17.6695 17.673C17.2301 18.1125 16.5164 18.1125 16.077 17.673L11.6262 13.2188C10.4168 14.1047 8.92617 14.625 7.3125 14.625C3.27305 14.625 0 11.352 0 7.3125C0 3.27305 3.27305 0 7.3125 0C11.352 0 14.625 3.27305 14.625 7.3125ZM7.3125 12.375C7.97732 12.375 8.63562 12.2441 9.24984 11.9896C9.86405 11.7352 10.4221 11.3623 10.8922 10.8922C11.3623 10.4221 11.7352 9.86405 11.9896 9.24984C12.2441 8.63562 12.375 7.97732 12.375 7.3125C12.375 6.64768 12.2441 5.98938 11.9896 5.37516C11.7352 4.76095 11.3623 4.20287 10.8922 3.73277C10.4221 3.26268 9.86405 2.88977 9.24984 2.63536C8.63562 2.38095 7.97732 2.25 7.3125 2.25C6.64768 2.25 5.98938 2.38095 5.37516 2.63536C4.76095 2.88977 4.20287 3.26268 3.73277 3.73277C3.26268 4.20287 2.88977 4.76095 2.63536 5.37516C2.38095 5.98938 2.25 6.64768 2.25 7.3125C2.25 7.97732 2.38095 8.63562 2.63536 9.24984C2.88977 9.86405 3.26268 10.4221 3.73277 10.8922C4.20287 11.3623 4.76095 11.7352 5.37516 11.9896C5.98938 12.2441 6.64768 12.375 7.3125 12.375Z"
                      fill="#B1B1B1"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_797_20343">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <input
                  className="text-primary-200 border-0 focus:border-0 focus:outline-none w-[calc(100%-50px)]"
                  placeholder={"Search people add to group"}
                  type="text"
                  name="CreateGroupSearch"
                  id="CreateGroupSearch"
                  ref={inputRef}
                  value={searchText}
                  onClick={onDropDownClick}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div>
              {dropdown && (
                <div className="absolute mt-1 z-50 w-[451px] max-h-[165px] shadow-[0_4px_10px_0px_rgba(0,0,0,0.1)] bg-[#FFFFFF] overflow-y-scroll overflow-x-hidden rounded-[4px]">
                  {membersList &&
                    membersList.map((item: any) => {
                      return (
                        <AddGrpDropdown
                          item={item}
                          type="person"
                          addMember={addMember}
                        ></AddGrpDropdown>
                      );
                    })}
                </div>
              )}
            </div>
            <div className=" mt-4 font-normal">
              <span className="text-xs text-[#ff4747] ">{errorMsg}</span>
            </div>
            {groupName.length > maxNameLength ? (
              <div className=" mt-4 font-normal">
                <span className="text-xs text-[#ff4747] ">
                  {t("Chat.GrpNameErrorMsg")}
                </span>
              </div>
            ) : null}

            <div className="flex flex-row-reverse h-full mt-2">
              <button
                id="createGroupButton"
                className="h-[32px] w-[78px] mr-1 bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] rounded-[7px] ml-3 mt-9 disabled:opacity-50 "
                disabled={groupName.trim() === ""}
                onClick={createGroup}
              >
                {t("Create")}
              </button>
              <button
                id="cancelCreateGroup"
                onClick={onClose}
                className="h-[32px] w-[78px] text-[#293241] rounded-[7px] mt-9"
              >
                {t("Cancel")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CreateGrouppModal
