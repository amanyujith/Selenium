import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import Remove from "../../dashboard/Chat/Icons/Remove"
import Addadmin from "../../dashboard/Chat/Icons/Addadmin"
import { t } from "i18next"

interface ParticipantModalType {
  name?: string
  members?: any
  title: string
  chat?: any
  buttonText?: any
  status: string
}

const ParticipantModal = ({
  name,
  members,
  title,
  chat,
  status,
  buttonText,
}: ParticipantModalType) => {
  const dispatch = useDispatch()
  const [memberslist, setMemberslist] = useState<any[]>([])
  const flagShareMsg = useSelector((state: any) => state.Chat.setShareMsgModal)
  const { data: activeChat, isGroup } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const flagAddAdminModal = useSelector(
    (state: any) => state.Chat.setAddAdminModal
  )
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)

  const optionindex = useSelector((state: any) => state.Chat.setTwoOptionModal)
  const length = activeChat.members.length || 0

  const [errMsg, setErrMsg] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)

  useEffect(() => {
    if (errMsg) {
      timeoutRef.current = setTimeout(() => {
        setErrMsg(null)
      }, 5000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current!)
      }
    }
  }, [errMsg])

  const handleErrorMessage = (msg: string) => {
    // clearTimeout(timeoutRef.current!);
    // setMaxSize(true);

    if (msg) {
      setErrMsg(msg)
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setErrMsg(null)
      }, 5000)
    } else {
      setErrMsg(null)
    }
  }

  const onClose = () => {
    dispatch(actionCreators.setAddMemberModal(false))
    dispatch(actionCreators.setThreeDotMenu(-1))
    dispatch(actionCreators.setShareMsgModal(false))
    dispatch(actionCreators.setAddAdminModal(false))
  }
  const Onsubmit = () => {
    dispatch(actionCreators.setMembersLists(memberslist))
    dispatch(actionCreators.setAddMemberModal(false))
    dispatch(actionCreators.setThreeDotMenu(-1))
    dispatch(actionCreators.setShareMsgModal(false))
    dispatch(actionCreators.setAddAdminModal(false))
  }
  const leaveGroup = () => {
    chatInstance
      ?.deleteGroupMember(activeChat.uuid, personalInfo.uuid)
      .then((res: any) => {
        //dispatch(actionCreators.updateGroupData(res, false));
        onClose()
      })
      .catch((err: any) => {
        handleErrorMessage(err.response.data.reason)
      })
  }

  const archiveGroup = () => {
    chatInstance
      ?.archiveGroup(activeChat.uuid)
      .then((res: any) => {
        onClose()
      })
      .catch((err: any) => {
        //handleErrorMessage(err.response.data.reason);
      })
  }

  const handleCheckboxChange = (e: any) => {
    if (e.target.checked) {
      setMemberslist([...memberslist, e.target.value])
    }
  }

  const twoOptionMenu = (index: any, e: any) => {
    e.stopPropagation()
    dispatch(
      actionCreators.setTwoOptionModal(index === optionindex ? -1 : index)
    )
  }

  const onItemClick = (value: string, data: any) => {
    if (value == t("Chat.AddAsAdmin")) {
      chatInstance
        ?.addGroupAdminPrivilege(activeChat.uuid, [data.user_id])
        .then((res: any) => {
          dispatch(actionCreators.updateGroupData(res, false))
        })
    } else if (value == t("Remove")) {
      chatInstance
        ?.deleteGroupMember(activeChat.uuid, data.user_id)
        .then((res: any) => {
          //dispatch(actionCreators.updateGroupData(res, false));
        })
        .catch((err: any) => {
          handleErrorMessage(err.response.data.reason)
        })
    } else if (value == t("Chat.RemoveAsAdmin")) {
      chatInstance
        ?.removeGroupAdminPrivilege(activeChat.uuid, [data.user_id])
        .then((res: any) => {
          dispatch(actionCreators.updateGroupData(res, false))
        })
        .catch((error: any) => {
          handleErrorMessage(error.error_data.response.data.reason)
        })
    }
  }

  //

  return (
    <div>
      <div
        onClick={() => dispatch(actionCreators.setTwoOptionModal(-1))}
        className="bg-[#00000033] backdrop-blur fixed inset-0 z-[300]"
      >
        <div className="flex justify-center items-center place-content-center w-full h-full">
          <div className="flex flex-col h-fit w-[500px] bg-[white] p-[20px] rounded-[15px]">
            <div className="flex flex-row relative">
              <span className="text-primary-200 text-lg font-bold">
                {title}
              </span>

              <span className="absolute mt-[6px] top-0 right-0">
                <svg
                  onClick={onClose}
                  className="cursor-pointer"
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

            <div className="flex flex-row relative mt-4">
              {/* for breakout room add member modal room info */}
              <div className="flex justify-center text-[#f21a1a]  w-full">
                {errMsg}
              </div>
              <span className="text-primary-200 text-sm">{name}</span>
              <span className="absolute top-0 right-0">
                {members != null && (
                  <div className="flex mt-1 -space-x-1 ml-3">
                    {members.slice(0, 2).map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`w-[21px] h-[21px] rounded-bl-none capitalize rounded-[50%] border-[2px] border-[#E9EBF8] text-[15px] text-[white] bg-[#91785B] overflow-hidden`}
                        >
                          {item.slice(0, 1)}
                        </div>
                      )
                    })}
                    {members.length > 2 && (
                      <div
                        className={`w-[21px] h-[21px] rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8] pt-[3px] text-[10px] text-[white] bg-[#91785B] overflow-hidden`}
                      >
                        +{members.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </span>
            </div>

            {/* <div className="w-full border-[1.5px] border-[#C4C4C4] mt-4 rounded-[3px] h-[32px]">
              <div className="flex flex-row content-center">
                <svg
                  className="mt-2 mx-3"
                  width="13"
                  height="13"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.90521 10.5021L6.23021 6.84167C5.93854 7.08472 5.60312 7.27431 5.22396 7.41042C4.84479 7.54653 4.4559 7.61458 4.05729 7.61458C3.0559 7.61458 2.21007 7.26944 1.51979 6.57917C0.829514 5.88889 0.484375 5.04306 0.484375 4.04167C0.484375 3.05 0.829514 2.2065 1.51979 1.51117C2.21007 0.816222 3.0559 0.46875 4.05729 0.46875C5.04896 0.46875 5.88993 0.813889 6.58021 1.50417C7.27049 2.19444 7.61562 3.04028 7.61562 4.04167C7.61562 4.45972 7.54757 4.85833 7.41146 5.2375C7.27535 5.61667 7.09062 5.94722 6.85729 6.22917L10.5177 9.88958L9.90521 10.5021ZM4.05729 6.73958C4.8059 6.73958 5.44038 6.47708 5.96071 5.95208C6.48065 5.42708 6.74063 4.79028 6.74063 4.04167C6.74063 3.29306 6.48065 2.65625 5.96071 2.13125C5.44038 1.60625 4.8059 1.34375 4.05729 1.34375C3.29896 1.34375 2.65982 1.60625 2.13987 2.13125C1.61954 2.65625 1.35937 3.29306 1.35937 4.04167C1.35937 4.79028 1.61954 5.42708 2.13987 5.95208C2.65982 6.47708 3.29896 6.73958 4.05729 6.73958Z"
                    fill="#A7A9AB"
                  />
                </svg>
                <input
                  className="text-primary-200 text-sm border-0 focus:border-0 mt-1 focus:outline-none w-full"
                  placeholder="Search members to add"
                  type="text"
                  name="search"
                />
              </div>
            </div> */}

            <div
              className={` pl-2 flex flex-col w-full overflow-y-auto overflow-x-hidden border-[0.5px] border-[#C4C4C4] mt-2 rounded-[4px] relative ${
                flagAddAdminModal ? "h-[182px]" : "h-[116px]"
              } `}
            >
              <div>
                {activeChat.members.map((item: any, index: any) => {
                  return (
                    <div
                      className="flex flex-row h-9 w-full p-[9px]"
                      key={item.uuid}
                    >
                      {!flagAddAdminModal && (
                        <input
                          type="checkbox"
                          value={item.uuid}
                          onChange={(e) => handleCheckboxChange(e)}
                          className="mr-3 h-6 w-6"
                        />
                      )}
                      <div
                        className={`w-[24px] h-[18px] text-center  rounded-bl-none rounded-[44%] border-[2px] border-[#E9EBF8] text-[12px] text-[white] bg-[#91785B] overflow-hidden`}
                      >
                        {item.profile_picture ? (
                          <img
                            className="w-full h-full  object-cover"
                            src={item.profile_picture}
                            alt=""
                          />
                        ) : (
                          <div className="capitalize">
                            {item.display_name?.slice(0, 1)}
                          </div>
                        )}
                      </div>
                      <div
                        className={`flex flex-row items-center w-full text-[16px] pl-3 text-[#6d6e70]`}
                      >
                        <div
                          className={`shrink-0 w-4/5 flex justify-start text-primary-200`}
                        >
                          {item.display_name}
                        </div>

                        {item.status === "active" ? (
                          activeChat.admin.includes(item.user_id) ? (
                            <div className="h-4 w-10 rounded-[50px] flex   border-[1px] border-[#DFDEDE] px-1 py-[1px] text-[#000000] text-[8px]">
                              {t("Chat.Admin")}
                            </div>
                          ) : null
                        ) : (
                          <div className="h-4 w-10 rounded-[50px] border-[1px] border-[#DFDEDE] px-1 py-[1px] text-[#ff1c1c] text-[8px]">
                            {t("Chat.Inactive")}
                          </div>
                        )}

                        {item.status === "active" &&
                          status === "active" &&
                          flagAddAdminModal &&
                          activeChat.admin.includes(
                            chatInstance?.globalInfo.user_token
                          ) && (
                            <div className="w-full flex flex-row-reverse mr-3">
                              <div
                                onClick={(e: any) => twoOptionMenu(index, e)}
                                className="w-fit h-fit p-1 cursor-pointer"
                              >
                                <svg
                                  width="3"
                                  height="12"
                                  viewBox="0 0 3 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1.5 11.4555C1.1875 11.4555 0.922 11.346 0.7035 11.127C0.4845 10.9085 0.375 10.643 0.375 10.3305C0.375 10.018 0.4845 9.75222 0.7035 9.53322C0.922 9.31472 1.1875 9.20547 1.5 9.20547C1.8125 9.20547 2.078 9.31472 2.2965 9.53322C2.5155 9.75222 2.625 10.018 2.625 10.3305C2.625 10.643 2.5155 10.9085 2.2965 11.127C2.078 11.346 1.8125 11.4555 1.5 11.4555ZM1.5 7.12422C1.1875 7.12422 0.922 7.01472 0.7035 6.79572C0.4845 6.57722 0.375 6.31172 0.375 5.99922C0.375 5.68672 0.4845 5.42122 0.7035 5.20272C0.922 4.98372 1.1875 4.87422 1.5 4.87422C1.8125 4.87422 2.078 4.98372 2.2965 5.20272C2.5155 5.42122 2.625 5.68672 2.625 5.99922C2.625 6.31172 2.5155 6.57722 2.2965 6.79572C2.078 7.01472 1.8125 7.12422 1.5 7.12422ZM1.5 2.79297C1.1875 2.79297 0.922 2.68347 0.7035 2.46447C0.4845 2.24597 0.375 1.98047 0.375 1.66797C0.375 1.35547 0.4845 1.08972 0.7035 0.870719C0.922 0.652219 1.1875 0.542969 1.5 0.542969C1.8125 0.542969 2.078 0.652219 2.2965 0.870719C2.5155 1.08972 2.625 1.35547 2.625 1.66797C2.625 1.98047 2.5155 2.24597 2.2965 2.46447C2.078 2.68347 1.8125 2.79297 1.5 2.79297Z"
                                    fill="#A7A9AB"
                                  />
                                </svg>
                              </div>
                              {optionindex === index && (
                                <div
                                  className={`absolute z-10 w-[164px] h-[76px] shadow-[0_4px_10px_0px_rgba(0,0,0,0.3)] bg-[#FFFFFF] rounded-[4px] ${
                                    optionindex ===
                                      (length - 1 || length - 2) && length > 2
                                      ? "mt-[-57px]"
                                      : null
                                  } `}
                                >
                                  <OptionsModal
                                    data={item}
                                    onClick={onItemClick}
                                    options={
                                      activeChat.admin.includes(item.user_id)
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
                  )
                })}

                {activeChat.inactive_members.map((item: any, index: any) => {
                  if (!item.deleted) {
                    return (
                      <div
                        className="flex flex-row h-9 w-full p-[9px]"
                        key={item.uuid}
                      >
                        {!flagAddAdminModal && (
                          <input
                            type="checkbox"
                            value={item.uuid}
                            onChange={(e) => handleCheckboxChange(e)}
                            className="mr-3 h-6 w-6"
                          />
                        )}
                        <div
                          className={`w-[24px] h-[18px] text-center rounded-bl-none rounded-[44%] border-[2px] border-[#E9EBF8] text-[12px] text-[white] bg-[#91785B] overflow-hidden`}
                        >
                          {item.profile_picture ? (
                            <img
                              className="w-full h-full  object-cover"
                              src={item.profile_picture}
                              alt=""
                            />
                          ) : (
                            <div className="capitalize">
                              {item.display_name?.slice(0, 1)}
                            </div>
                          )}
                        </div>
                        <div
                          className={`flex flex-row w-full text-[16px] pl-3 text-[#6d6e70]`}
                        >
                          <div
                            className={`shrink-0 w-4/5 flex justify-start text-primary-200`}
                          >
                            {item.display_name}
                          </div>

                          <div className="h-4 w-10 mt-1 rounded-[50px] border-[1px] border-[#DFDEDE] px-1 py-[1px] text-[#ff1c1c] text-[8px]">
                            {t("Chat.Inactive")}
                          </div>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
            {status === "active" && (
              <div className="py-2 w-full flex justify-between	items-center	self-stretch">
                <button
                  onClick={archiveGroup}
                  disabled={!activeChat.admin.includes(personalInfo.uuid)}
                  className="w-[150px] h-8 px-4 rounded-[3px] justify-center items-center gap-2.5 inline-flex disabled:invisible"
                >
                  <div className="text-[#F65E1D] text-sm font-normal ">
                    {t("Chat.ArchiveGroup")}
                  </div>
                </button>
                <button
                  onClick={leaveGroup}
                  className="w-[150px] h-8 px-4 rounded-[3px] border border-neutral-700 justify-center items-center gap-2.5 inline-flex group hover:bg-primary-200"
                >
                  <div className="text-primary-200 group-hover:text-[#ffffff] text-sm font-normal">
                    {t("Chat.LeaveGroup")}
                  </div>
                </button>
              </div>
            )}

            {flagAddAdminModal === false ? (
              <div className="flex flex-row-reverse mt-2 h-full pt-1">
                <button
                  onClick={Onsubmit}
                  className="h-[32px] w-[78px] mr-1 bg-primary-200 text-[#FFFFFF] rounded-[3px] ml-1 mb-1"
                >
                  {buttonText}
                </button>
                <button
                  onClick={onClose}
                  className="h-[32px] w-[78px] border-[#404041] border-[1.5px] text-primary-200 rounded-[3px] mb-1"
                >
                  {t("Cancel")}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantModal

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
