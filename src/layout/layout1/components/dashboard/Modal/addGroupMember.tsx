import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import membersList from "../../meetingScreen/membersList/membersList"
import { t } from "i18next"
import CheckBox from "../../../../../atom/CheckBox/checkBox"
const _ = require("lodash")

interface AddMembersModalType {
  name?: any
  members?: any
  title: any
  chat?: any
  buttonText?: any
  toggleModal: () => void
  uuid: string
}
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
}

const AddMembersModal = ({
  name,
  members,
  title,
  chat,
  toggleModal,
  uuid,
  buttonText,
}: AddMembersModalType) => {
  const dispatch = useDispatch()
  const { data: activeChat, isGroup } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const messengerslist = useSelector((state: any) => state.Chat.userData)
  const [memberslist, setMemberslist] = useState<any[]>([])
  const [membersList, setMemebersList] = useState(messengerslist)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const [searchText, setSearchText] = useState<string>("")
  const [groupMembers, setGroupMembers] = useState<IMember[]>([])
  const [addedMemberslist, setAddedMemberslist] = useState<any[]>([])

  const handleCheckboxChange = (e: any, item: any) => {
    if (e.target.checked) {
      setAddedMemberslist([...addedMemberslist, item.uuid])
    } else {
      setAddedMemberslist(addedMemberslist.filter((el) => el !== item.uuid))
    }
  }

  useEffect(() => {
    // const userData = chatInstance?.fetchUserData();
    // setMemberslist(userData)

    chatInstance?.searchUser("global_search", "", uuid).then((res: any) => {
      setMemberslist(res)
    })
  }, [])

  const updateMemberList = () => {
    let newMemberList = messengerslist.filter((el: IMember) =>
      groupMembers.every((f) => f.uuid !== el.uuid)
    )
    return newMemberList
  }

  // useEffect(() => {
  //   const updatedList = updateMemberList();
  //   setMemberslist(updatedList);
  //   handleDebounceFn(searchText);
  // }, [groupMembers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debounceFn(e.target.value)
  }

  const handleDebounceFn = (searchText: string) => {
    chatInstance
      ?.searchUser("global_search", searchText.trim(), uuid)
      .then((res: any) => {
        setMemberslist(res)
      })
    // let arr = updatedList.filter((item: IMember) =>
    //   item.firstname.toLowerCase().includes(searchText.toLowerCase())
    // );
    // setMemberslist(arr);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 500), [
    membersList,
  ])

  const Onsubmit = () => {
    chatInstance?.addGroupMember(uuid, addedMemberslist).then((res: any) => {
      dispatch(actionCreators.updateGroupData(res, false))
      toggleModal()
    })
  }

  return (
    <div>
      <div
        onClick={() => dispatch(actionCreators.setTwoOptionModal(-1))}
        className="bg-[#0a0a0a23] backdrop-blur fixed inset-0 z-[300] rounded-[15px]"
      >
        <div className="flex justify-center items-center place-content-center w-full h-full overflow-y-auto overflow-x-hidden rounded-[15px]">
          <div className="flex flex-col h-fit w-[500px] bg-[white] p-[20px] rounded-[15px]">
            <div className="flex flex-row relative mb-2">
              <span className="text-primary-200 font-bold">{title}</span>
              <span className="absolute mt-[6px] top-0 right-0">
                <svg
                  onClick={toggleModal}
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

            <div className="w-full border-[1.5px] border-[#C4C4C4] mt-4 rounded-[7px] h-[32px]">
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
                  placeholder={t("Chat.SearchMembersToAdd")}
                  type="text"
                  name="AddMembersearch"
                  value={searchText}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div
              className={` pl-2 flex flex-col mt-5 w-full overflow-y-scroll overflow-x-hidden border-[0.5px] border-[#C4C4C4] rounded-[7px] 
                h-[116px]
               `}
            >
              <div>
                {memberslist &&
                  memberslist.map((item: any, index: any) => {
                    if (!item.group_member) {
                      return (
                        <div className="flex flex-row h-9 w-full p-[9px]">
                          <CheckBox
                            restClass={"mt-3"}
                            checked={addedMemberslist.find(
                              (n) => n === item.uuid
                            )}
                            onChange={(e: any) => handleCheckboxChange(e, item)}
                            value={item.uuid}
                            color={""}
                            label={""}
                            id={"previewMessage"}
                            restCheckClass={"h-[17px]"}
                          />
                          <div
                            className={`w-[22px] h-[22px] text-center shrink-0 rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8] text-[12px] text-[white] bg-[#91785B] overflow-hidden`}
                          >
                            {item.profile_picture ? (
                              <img
                                className="w-full h-full  object-cover"
                                src={item.profile_picture}
                                alt=""
                              />
                            ) : (
                              <div className=" capitalize">
                                {item.firstname?.slice(0, 1)}
                              </div>
                            )}
                          </div>
                          <div
                            className={`flex flex-row w-full text-[16px] pl-3 text-[#6d6e70]`}
                          >
                            <div
                              className={`shrink-0 w-4/5 flex justify-start text-primary-200`}
                            >
                              {item.firstname + " " + item.lastname}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>

            <div className="flex flex-row-reverse mt-2 h-full pt-1">
              <button
                onClick={Onsubmit}
                disabled={addedMemberslist.length < 1}
                className="h-[32px] w-[78px] mr-1 bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] rounded-[7px] ml-1 mb-1 disabled:bg-[#ECECEC] disabled:text-[#B1B1B1] "
              >
                {buttonText}
              </button>
              <button
                onClick={toggleModal}
                className="h-[32px] w-[78px] text-[#293241] rounded-[7px] mb-1"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMembersModal
