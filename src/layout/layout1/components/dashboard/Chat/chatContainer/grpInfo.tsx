import { t } from "i18next"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Remove from "../../../dashboard/Chat/Icons/Remove"
import Addadmin from "../../../dashboard/Chat/Icons/Addadmin"
import { actionCreators } from "../../../../../../store"
import AddMemberModal from "../../Modal/addGroupMember"
import { motion } from "framer-motion"
import Modal from "../../../../../../atom/customModal"
import UseEscape from "../hooks/useEscape"
const _ = require("lodash")

const GrpInfo = (props: any) => {
  const dispatch = useDispatch()
  const { userData, handleErrorMessage, errMsg } = props
  const [searchText, setSearchText] = useState("")
  const [resultStatus, setResultStatus] = useState<any>(false)
  const optionindex = useSelector((state: any) => state.Chat.setTwoOptionModal)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
    const [modal, setModal] = useState<any>();
  const length =
    userData.status === "archive"
      ? userData.archive_members?.length || 0
      : userData.members?.length || 0
  const [addMemberModal, setAddMemberModal] = useState<boolean>(false)

  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const [members, setMembers] = useState<any>(
    userData.status === "archive" ? userData.archive_members : userData.members
  )

  useEffect(() => {
    setMembers(
      userData.status === "archive"
        ? userData.archive_members
        : userData.members
    )
  }, [userData])

  const userRemove = () =>{
    chatInstance
      ?.deleteGroupMember(userData.uuid, modal.user_id)
      .then((res: any) => {
        setModal(null)
        dispatch(
          actionCreators.setNotification({
            content: "User removed successfully!",
            type: "success",
          })
        );
      })
      .catch((err: any) => {
        dispatch(
          actionCreators.setNotification({
            content: err.data.reason,
            type: "error",
          })
        );
      })
  }

  const onItemClick = (value: string, data: any) => {
    if (value == t("Chat.AddAsAdmin")) {
      chatInstance
        ?.addGroupAdminPrivilege(userData.uuid, [data.user_id])
        .then((res: any) => {
          dispatch(actionCreators.updateGroupData(res, false))
        })
    } else if (value == t("Remove")) {
      setModal(data);
    } else if (value == t("Chat.RemoveAsAdmin")) {
      chatInstance
        ?.removeGroupAdminPrivilege(userData.uuid, [data.user_id])
        .then((res: any) => {
          dispatch(actionCreators.updateGroupData(res, false))
        })
        .catch((error: any) => {
          handleErrorMessage(error.data?.reason)
        })
    }
  }

  const handleDebounceFn = async (searchText: string) => {
    if (searchText !== "") {
      await chatInstance
        ?.searchUser("group_search", searchText, userData.uuid)
        .then((res: any) => {
          setMembers(res)
        })
        .catch((e: any) => {})
    } else {
      onHandleClose()
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debounceFn(e.target.value)
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 500), [members])

  const onHandleClose = () => {
    setSearchText("")
    setMembers(
      userData.status === "archive"
        ? userData.archive_members
        : userData.members
    )
    setResultStatus(false)
  }

  const toggleAddMemberModal = () => {
    setAddMemberModal((prev) => !prev)
  }

  const twoOptionMenu = (index: any, e: any) => {
    e.stopPropagation()
    dispatch(
      actionCreators.setTwoOptionModal(index === optionindex ? -1 : index)
    )
  }

  // UseEscape(() => setModal(null));

  return (
    <div>
      <motion.div
        key="groupInfo"
        initial={{ opacity: 0, translateY: "60px" }}
        animate={{
          opacity: 1,
          translateY: "0px",
          transition: { duration: 0.4 },
        }}
        className="p-1"
        onClick={() => dispatch(actionCreators.setTwoOptionModal(-1))}
      >
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="font-bold text-sm py-3">
            Members (
            {userData.status === "archive"
              ? userData.archive_members?.length
              : userData.members?.length}
            )
          </div>
          {(!userData.private &&
            userData?.status === "active" &&
            userData?.members?.find(
              (member: any) => member.user_id === loggedInUserInfo?.sub
            )) ||
          (userData?.status === "active" &&
            userData?.admin?.find(
              (member: any) => member === loggedInUserInfo?.sub
            )) ? (
            <div
              onClick={toggleAddMemberModal}
              className="text-[14px] bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] px-3 py-1 cursor-pointer rounded-[7px]"
            >
              Add new member
            </div>
          ) : null}
        </div>

        <div className="flex flex-row content-center border-[1px] rounded-[7px] mb-2 mx-1 p-1 mt-3 border-[#0000001F]">
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
            className="text-primary-200 border-0 focus:border-0 focus:outline-none w-full"
            placeholder={"Search for people"}
            type="text"
            name="CreateGroupSearch"
            onChange={handleSearchChange}
          />
        </div>
        <div className="overflow-x-hidden overflow-y-auto h-[calc(100vh-630px)] mb-6 relative">
          {members &&
            members.map((item: any, index: any) => {
              return (
                <div
                  className="flex flex-row w-full p-[8px] ml-2 hover:bg-[#F7931F1F]"
                  key={item.uuid}
                >
                  <div
                    className={`w-[24px] h-[24px] text-center shrink-0 capitalize rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8] text-[12px] text-[white] bg-[#91785B] overflow-hidden`}
                  >
                    {item.profile_picture ? (
                      <img
                        className="w-full h-full  object-cover"
                        src={item.profile_picture}
                        alt=""
                      />
                    ) : (
                      <div className="mt-[1px] capitalize">
                        {item.display_name?.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex flex-row items-center w-full text-[16px] pl-3 text-[#6d6e70]`}
                  >
                    <div
                      className={`shrink-0 w-fit flex justify-start text-[#5C6779]`}
                    >
                      {item.display_name}
                    </div>

                    {item?.status === "active" ? (
                      userData.admin.includes(item.user_id) ? (
                        <div className=" rounded-[7px] flex   border-[1px] border-[#B1B1B1] px-3 ml-2  text-[#293241] bg-[#FEF4E9] text-[14px]">
                          {t("Chat.Admin")}
                        </div>
                      ) : null
                    ) : (
                      item?.status === "inactive" && (
                        <div className=" rounded-[7px] border-[1px] border-[#B1B1B1] px-3 ml-2  text-[#293241] bg-[#FEF4E9] text-[14px]">
                          {t("Chat.Inactive")}
                        </div>
                      )
                    )}

                    {item.status === "active" &&
                      userData.status !== "archive" &&
                      userData.admin.includes(
                        chatInstance?.globalInfo.user_token
                      ) && (
                        <div className="w-full flex flex-row-reverse mr-3">
                          <div
                            onClick={(e: any) => twoOptionMenu(index, e)}
                            className="w-fit h-fit p-1 cursor-pointer"
                          >
                            <svg
                              className="mr-3"
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                            >
                              <path
                                d="M10.75 9.25C10.75 9.59612 10.6474 9.93446 10.4551 10.2222C10.2628 10.51 9.98947 10.7343 9.6697 10.8668C9.34993 10.9992 8.99806 11.0339 8.65859 10.9664C8.31913 10.8988 8.00731 10.7322 7.76256 10.4874C7.51782 10.2427 7.35115 9.93087 7.28363 9.59141C7.2161 9.25194 7.25076 8.90007 7.38321 8.5803C7.51566 8.26053 7.73997 7.98722 8.02775 7.79493C8.31554 7.60264 8.65388 7.5 9 7.5C9.46413 7.5 9.90925 7.68437 10.2374 8.01256C10.5656 8.34075 10.75 8.78587 10.75 9.25ZM4 7.5C3.65388 7.5 3.31554 7.60264 3.02775 7.79493C2.73997 7.98722 2.51566 8.26053 2.38321 8.5803C2.25076 8.90007 2.2161 9.25194 2.28363 9.59141C2.35115 9.93087 2.51782 10.2427 2.76256 10.4874C3.00731 10.7322 3.31913 10.8988 3.65859 10.9664C3.99806 11.0339 4.34993 10.9992 4.6697 10.8668C4.98947 10.7343 5.26278 10.51 5.45507 10.2222C5.64736 9.93446 5.75 9.59612 5.75 9.25C5.75 8.78587 5.56563 8.34075 5.23744 8.01256C4.90925 7.68437 4.46413 7.5 4 7.5ZM14 7.5C13.6539 7.5 13.3155 7.60264 13.0278 7.79493C12.74 7.98722 12.5157 8.26053 12.3832 8.5803C12.2508 8.90007 12.2161 9.25194 12.2836 9.59141C12.3512 9.93087 12.5178 10.2427 12.7626 10.4874C13.0073 10.7322 13.3191 10.8988 13.6586 10.9664C13.9981 11.0339 14.3499 10.9992 14.6697 10.8668C14.9895 10.7343 15.2628 10.51 15.4551 10.2222C15.6474 9.93446 15.75 9.59612 15.75 9.25C15.75 9.02019 15.7047 8.79262 15.6168 8.5803C15.5288 8.36798 15.3999 8.17507 15.2374 8.01256C15.0749 7.85006 14.882 7.72116 14.6697 7.63321C14.4574 7.54526 14.2298 7.5 14 7.5Z"
                                fill="#5C6779"
                              />
                            </svg>
                          </div>
                          {optionindex === index && (
                            <div
                              className={`absolute z-10 w-[164px] h-[76px] shadow-[0_4px_10px_0px_rgba(0,0,0,0.3)] bg-[#FFFFFF] rounded-[4px] ${
                                optionindex === (length - 1 || length - 2) &&
                                length > 2
                                  ? "mt-[-57px]"
                                  : null
                              } `}
                            >
                              <OptionsModal
                                data={item}
                                onClick={onItemClick}
                                options={
                                  userData.admin.includes(item.user_id)
                                    ? [
                                        {
                                          name: t("Chat.RemoveAsAdmin"),
                                          icon: <Remove />,
                                        },
                                        {
                                          name: t("Remove"),
                                          icon: <Remove />,
                                        },
                                      ]
                                    : [
                                        {
                                          name: t("Chat.AddAsAdmin"),
                                          icon: <Addadmin />,
                                        },
                                        {
                                          name: t("Remove"),
                                          icon: <Remove />,
                                        },
                                      ]
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
        </div>
      </motion.div>
      {addMemberModal ? (
        <AddMemberModal
          title={t("Chat.AddMembers")}
          toggleModal={toggleAddMemberModal}
          uuid={userData.uuid}
          buttonText={t("Add")}
        />
      ) : null}
      {modal && (
        <Modal title={"Remove Member"} closeEvent={() => setModal(null)}>
          <div className="text-[#404041]">
            Are you sure you want to remove
            <span className="font-bold ml-1">{modal.display_name}</span> from
            this group?
          </div>
          <div className="flex flex-row-reverse mt-6 h-full pt-1">
            <button
              onClick={() => userRemove()}
              className="h-[32px] w-[78px] mr-1 bg-[#E57600] hover:bg-[#CC6900] text-[#FFFFFF] rounded-[7px] ml-1 mb-1 disabled:opacity-50 p-1"
            >
              Remove
            </button>
            <button
              onClick={() => setModal(null)}
              className="h-[32px] w-[78px] text-[#293241] rounded-[7px] mb-1"
            >
              {t("Cancel")}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default GrpInfo

interface OptionModalType {
  data?: any
  options: any
  onClick: (buttonName: string, data?: any) => void
}

const OptionsModal = ({ onClick, data, options }: OptionModalType) => {
  return (
    <div>
      <div className={"pl-3 flex flex-col w-full z-10 h-[36px] "}>
        <div className={`flex flex-col w-full text-sm rounded-[3px]`}>
          {options &&
            options.map((item: any, index: number) => {
              return (
                <div
                  onClick={() => onClick(item.name, data)}
                  className="h-[38px] flex flex-row cursor-pointer"
                >
                  {item.icon}
                  <div className="mt-2 ml-3 text-primary-200 text-sm">
                    {item.name}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
