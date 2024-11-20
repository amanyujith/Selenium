import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../../../store"

interface callToggle {
  callDetail: any
  status: any
  isGroup: any
  members: any
  uuid: any
  joinExistingCall: any
  setAudioCall: any
  postInvite: any
  setEndCall: any
  name: any
}

const CallActions = ({
  callDetail,
  status,
  isGroup,
  members,
  uuid,
  joinExistingCall,
  setAudioCall,
  postInvite,
  setEndCall,
  name,
}: callToggle) => {
  const callInfo = useSelector((state: RootState) => state.Chat.chatCallInfo)
  const { data: activeChat, isGroups } = useSelector(
    (state: RootState) => state.Chat.activeChat
  )
  const loggedInUserInfo = useSelector(
    (state: RootState) => state.Main.loggedInUserInfo
  )
  const participantList = useSelector(
    (state: RootState) => state.Main.participantList
  )
  return (
    <div>
      {callDetail?.meeting_id &&
        callDetail?.password &&
        !callInfo &&
        !callDetail?.guestMember && (
          <div className="flex mx-2 text-[#293241] text-[14px] flex-row gap-2 items-center bg-[#F7931F1F] p-1 rounded-[10px] ">
            <svg
              className="mb-[2px]"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M9.18353 7.34947C8.88457 7.22187 8.53822 7.30572 8.33223 7.55728L7.72702 8.29739C6.88848 7.81067 6.18848 7.11067 5.70176 6.27213L6.44004 5.66874C6.6916 5.46275 6.77728 5.1164 6.64785 4.81744L5.77285 2.77577C5.63613 2.45494 5.2916 2.27629 4.95072 2.34921L2.90905 2.78671C2.57363 2.8578 2.33301 3.15494 2.33301 3.49947C2.33301 7.81431 5.67806 11.3471 9.91634 11.6461C9.99837 11.6516 10.0822 11.657 10.1661 11.6607C10.1661 11.6607 10.1661 11.6607 10.1679 11.6607C10.2791 11.6643 10.3885 11.668 10.5015 11.668C10.846 11.668 11.1432 11.4273 11.2143 11.0919L11.6518 9.05025C11.7247 8.70937 11.546 8.36483 11.2252 8.22812L9.18353 7.35312V7.34947ZM10.4942 11.0828C6.30879 11.0792 2.91634 7.68671 2.91634 3.49947C2.91634 3.4302 2.96374 3.37187 3.03118 3.35728L5.07285 2.91978C5.1403 2.9052 5.20957 2.94166 5.23691 3.00546L6.11191 5.04713C6.13744 5.10728 6.12103 5.17655 6.06999 5.21666L5.32988 5.82187C5.10931 6.00233 5.05098 6.3177 5.19499 6.56562C5.73275 7.49348 6.50566 8.2664 7.43171 8.80233C7.67962 8.94634 7.99499 8.88801 8.17546 8.66744L8.78066 7.92733C8.82259 7.87629 8.89186 7.85989 8.9502 7.88541L10.9919 8.76041C11.0557 8.78775 11.0921 8.85702 11.0775 8.92447L10.64 10.9661C10.6255 11.0336 10.5653 11.081 10.4979 11.081C10.496 11.081 10.4942 11.081 10.4924 11.081L10.4942 11.0828Z"
                fill="#5C6779"
              />
            </svg>
            <div className="italic">
              You have an active call in this conversation
            </div>
            <div
              id="JoinExistingCall"
              onClick={joinExistingCall}
              className="bg-[#F7931F] rounded-[7px] py-1 px-4 cursor-pointer"
            >
              Join
            </div>
          </div>
        )}
      {callInfo === null &&
      status !== "inactive" &&
      status !== "archive" &&
      status !== "disabled" &&
      status !== "deleted" &&
      ((isGroup &&
        activeChat?.members?.find(
          (member: any) => member.user_id === loggedInUserInfo?.sub
        )) ||
        !isGroup) &&
      !callDetail?.meeting_id &&
      !callDetail?.password ? (
        <>
          {/* <div className={`flex items-center mr-[20px] `}>
                <button
                  onClick={() => dispatch(actionCreators.setMiniProfile(true))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M4.5 4.5C4.08516 4.5 3.75 4.83516 3.75 5.25V12.75C3.75 13.1648 4.08516 13.5 4.5 13.5H13.5C13.9148 13.5 14.25 13.1648 14.25 12.75V6.75C14.25 6.33516 13.9148 6 13.5 6H9.84141C9.44297 6 9.06094 5.84297 8.77969 5.56172L7.93828 4.72031C7.79766 4.57969 7.60781 4.5 7.40859 4.5H4.5ZM3 5.25C3 4.42266 3.67266 3.75 4.5 3.75H7.40859C7.80703 3.75 8.18906 3.90703 8.47031 4.18828L9.31172 5.02969C9.45234 5.17031 9.64219 5.25 9.84141 5.25H13.5C14.3273 5.25 15 5.92266 15 6.75V12.75C15 13.5773 14.3273 14.25 13.5 14.25H4.5C3.67266 14.25 3 13.5773 3 12.75V5.25Z"
                      fill="#5C6779"
                    />
                  </svg>
                </button>
              </div> */}
          <div className={`flex items-center mr-[27px]`}>
            <button
              id="startAudioCall"
              disabled={isGroup && members.length === 1}
              onClick={() => {
                setAudioCall(activeChat);
              }}
              className="disabled:cursor-not-allowed"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="16" fill="#76B947" />
                <rect
                  width="32"
                  height="32"
                  rx="16"
                  fill="white"
                  fill-opacity="0.7"
                />
                <path
                  d="M18.8078 16.4497C18.4234 16.2857 17.9781 16.3935 17.7133 16.7169L16.9352 17.6685C15.857 17.0427 14.957 16.1427 14.3313 15.0646L15.2805 14.2888C15.6039 14.024 15.7141 13.5786 15.5477 13.1943L14.4227 10.5693C14.2469 10.1568 13.8039 9.92708 13.3656 10.0208L10.7406 10.5833C10.3094 10.6747 10 11.0568 10 11.4997C10 17.0474 14.3008 21.5896 19.75 21.974C19.8555 21.981 19.9633 21.988 20.0711 21.9927C20.0711 21.9927 20.0711 21.9927 20.0734 21.9927C20.2164 21.9974 20.357 22.0021 20.5023 22.0021C20.9453 22.0021 21.3273 21.6927 21.4188 21.2615L21.9813 18.6365C22.075 18.1982 21.8453 17.7552 21.4328 17.5794L18.8078 16.4544V16.4497ZM20.493 21.2497C15.1117 21.245 10.75 16.8833 10.75 11.4997C10.75 11.4107 10.8109 11.3357 10.8977 11.3169L13.5227 10.7544C13.6094 10.7357 13.6984 10.7825 13.7336 10.8646L14.8586 13.4896C14.8914 13.5669 14.8703 13.656 14.8047 13.7075L13.8531 14.4857C13.5695 14.7177 13.4945 15.1232 13.6797 15.4419C14.3711 16.6349 15.3648 17.6286 16.5555 18.3177C16.8742 18.5029 17.2797 18.4279 17.5117 18.1443L18.2898 17.1927C18.3438 17.1271 18.4328 17.106 18.5078 17.1388L21.1328 18.2638C21.2148 18.299 21.2617 18.388 21.243 18.4747L20.6805 21.0997C20.6617 21.1865 20.5844 21.2474 20.4977 21.2474C20.4953 21.2474 20.493 21.2474 20.4906 21.2474L20.493 21.2497Z"
                  fill="#5C6779"
                />
              </svg>
            </button>
          </div>
        </>
      ) : !isGroup &&
        callInfo &&
        callInfo.uuid !== uuid &&
        !participantList.find((member: any) => member.user_uuid === uuid) &&
        !activeChat.inviteState ? (
        <div className="flex mx-2 text-[#293241] text-[14px] flex-row gap-2 items-center bg-[#F7931F1F] py-1 px-2 rounded-[10px] ">
          <svg
            className="mb-[2px]"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M5.25033 2.91667C5.48014 2.91667 5.7077 2.96193 5.92002 3.04988C6.13234 3.13783 6.32526 3.26673 6.48776 3.42923C6.65026 3.59173 6.77917 3.78465 6.86711 3.99697C6.95506 4.20929 7.00033 4.43686 7.00033 4.66667C7.00033 4.89648 6.95506 5.12405 6.86711 5.33637C6.77917 5.54869 6.65026 5.7416 6.48776 5.90411C6.32526 6.06661 6.13234 6.19551 5.92002 6.28346C5.7077 6.3714 5.48014 6.41667 5.25033 6.41667C5.02051 6.41667 4.79295 6.3714 4.58063 6.28346C4.36831 6.19551 4.17539 6.06661 4.01289 5.90411C3.85039 5.7416 3.72148 5.54869 3.63354 5.33637C3.54559 5.12405 3.50033 4.89648 3.50033 4.66667C3.50033 4.43686 3.54559 4.20929 3.63354 3.99697C3.72148 3.78465 3.85039 3.59173 4.01289 3.42923C4.17539 3.26673 4.36831 3.13783 4.58063 3.04988C4.79295 2.96193 5.02051 2.91667 5.25033 2.91667ZM5.25033 7C5.86916 7 6.46266 6.75417 6.90024 6.31659C7.33783 5.879 7.58366 5.28551 7.58366 4.66667C7.58366 4.04783 7.33783 3.45434 6.90024 3.01675C6.46266 2.57917 5.86916 2.33334 5.25033 2.33334C4.63149 2.33334 4.03799 2.57917 3.60041 3.01675C3.16282 3.45434 2.91699 4.04783 2.91699 4.66667C2.91699 5.28551 3.16282 5.879 3.60041 6.31659C4.03799 6.75417 4.63149 7 5.25033 7ZM4.41725 8.45834H6.0834C7.54173 8.45834 8.72663 9.63047 8.75033 11.0833H1.75033C1.7722 9.63047 2.9571 8.45834 4.41725 8.45834ZM4.41725 7.875C2.62168 7.875 1.16699 9.32969 1.16699 11.1253C1.16699 11.4242 1.40944 11.6667 1.7084 11.6667H8.79225C9.09121 11.6667 9.33366 11.4242 9.33366 11.1253C9.33366 9.32969 7.87897 7.875 6.0834 7.875H4.41725ZM10.5003 7.875C10.5003 8.03542 10.6316 8.16667 10.792 8.16667C10.9524 8.16667 11.0837 8.03542 11.0837 7.875V6.41667H12.542C12.7024 6.41667 12.8337 6.28542 12.8337 6.125C12.8337 5.96459 12.7024 5.83334 12.542 5.83334H11.0837V4.375C11.0837 4.21459 10.9524 4.08334 10.792 4.08334C10.6316 4.08334 10.5003 4.21459 10.5003 4.375V5.83334H9.04199C8.88158 5.83334 8.75033 5.96459 8.75033 6.125C8.75033 6.28542 8.88158 6.41667 9.04199 6.41667H10.5003V7.875Z"
              fill="#5C6779"
            />
          </svg>
          <div className="italic">You can add {name} to your ongoing call</div>
          <div
            id="InviteUserButton"
            onClick={postInvite}
            className="bg-[#F7931F] rounded-[7px] py-1 px-4 cursor-pointer"
          >
            Add
          </div>
        </div>
      ) : !participantList.find((member: any) => member.user_uuid === uuid) &&
        (activeChat?.inviteState === "invited" ||
          activeChat?.inviteState === "waiting") &&
        callInfo ? (
        <div className="flex mx-2 text-[#293241] text-[14px] flex-row gap-2 items-center bg-[#F7931F1F] p-1 rounded-[10px] ">
          <svg
            className="mb-[2px]"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M5.25033 2.91667C5.48014 2.91667 5.7077 2.96193 5.92002 3.04988C6.13234 3.13783 6.32526 3.26673 6.48776 3.42923C6.65026 3.59173 6.77917 3.78465 6.86711 3.99697C6.95506 4.20929 7.00033 4.43686 7.00033 4.66667C7.00033 4.89648 6.95506 5.12405 6.86711 5.33637C6.77917 5.54869 6.65026 5.7416 6.48776 5.90411C6.32526 6.06661 6.13234 6.19551 5.92002 6.28346C5.7077 6.3714 5.48014 6.41667 5.25033 6.41667C5.02051 6.41667 4.79295 6.3714 4.58063 6.28346C4.36831 6.19551 4.17539 6.06661 4.01289 5.90411C3.85039 5.7416 3.72148 5.54869 3.63354 5.33637C3.54559 5.12405 3.50033 4.89648 3.50033 4.66667C3.50033 4.43686 3.54559 4.20929 3.63354 3.99697C3.72148 3.78465 3.85039 3.59173 4.01289 3.42923C4.17539 3.26673 4.36831 3.13783 4.58063 3.04988C4.79295 2.96193 5.02051 2.91667 5.25033 2.91667ZM5.25033 7C5.86916 7 6.46266 6.75417 6.90024 6.31659C7.33783 5.879 7.58366 5.28551 7.58366 4.66667C7.58366 4.04783 7.33783 3.45434 6.90024 3.01675C6.46266 2.57917 5.86916 2.33334 5.25033 2.33334C4.63149 2.33334 4.03799 2.57917 3.60041 3.01675C3.16282 3.45434 2.91699 4.04783 2.91699 4.66667C2.91699 5.28551 3.16282 5.879 3.60041 6.31659C4.03799 6.75417 4.63149 7 5.25033 7ZM4.41725 8.45834H6.0834C7.54173 8.45834 8.72663 9.63047 8.75033 11.0833H1.75033C1.7722 9.63047 2.9571 8.45834 4.41725 8.45834ZM4.41725 7.875C2.62168 7.875 1.16699 9.32969 1.16699 11.1253C1.16699 11.4242 1.40944 11.6667 1.7084 11.6667H8.79225C9.09121 11.6667 9.33366 11.4242 9.33366 11.1253C9.33366 9.32969 7.87897 7.875 6.0834 7.875H4.41725ZM10.5003 7.875C10.5003 8.03542 10.6316 8.16667 10.792 8.16667C10.9524 8.16667 11.0837 8.03542 11.0837 7.875V6.41667H12.542C12.7024 6.41667 12.8337 6.28542 12.8337 6.125C12.8337 5.96459 12.7024 5.83334 12.542 5.83334H11.0837V4.375C11.0837 4.21459 10.9524 4.08334 10.792 4.08334C10.6316 4.08334 10.5003 4.21459 10.5003 4.375V5.83334H9.04199C8.88158 5.83334 8.75033 5.96459 8.75033 6.125C8.75033 6.28542 8.88158 6.41667 9.04199 6.41667H10.5003V7.875Z"
              fill="#5C6779"
            />
          </svg>
          <div className="italic">
            {`Waiting for ${name} to join your call`}
          </div>
          <div
            className={`${
              activeChat?.inviteState === "invited"
                ? "bg-[#F7931F] cursor-pointer"
                : "bg-[#cbcbcb] cursor-not-allowed"
            } rounded-[7px] py-1 px-4 `}
            id="addAgainButton"
            onClick={() => {
              activeChat?.inviteState === "invited" && postInvite();
            }}
          >
            Add Again{" "}
            {/* {waitingPersons.find(
                  (person: any) => person.id === uuid
                )?.count} */}
          </div>
        </div>
      ) : (callInfo?.uuid === uuid ||
          participantList.find((member: any) => member.user_uuid === uuid)) &&
        callInfo ? (
        <div className="flex mx-2 text-[#293241] text-[14px] flex-row gap-2 items-center bg-[#F7931F1F] py-1 px-2 rounded-[10px] ">
          <svg
            className="mb-[2px]"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M5.25033 2.91667C5.48014 2.91667 5.7077 2.96193 5.92002 3.04988C6.13234 3.13783 6.32526 3.26673 6.48776 3.42923C6.65026 3.59173 6.77917 3.78465 6.86711 3.99697C6.95506 4.20929 7.00033 4.43686 7.00033 4.66667C7.00033 4.89648 6.95506 5.12405 6.86711 5.33637C6.77917 5.54869 6.65026 5.7416 6.48776 5.90411C6.32526 6.06661 6.13234 6.19551 5.92002 6.28346C5.7077 6.3714 5.48014 6.41667 5.25033 6.41667C5.02051 6.41667 4.79295 6.3714 4.58063 6.28346C4.36831 6.19551 4.17539 6.06661 4.01289 5.90411C3.85039 5.7416 3.72148 5.54869 3.63354 5.33637C3.54559 5.12405 3.50033 4.89648 3.50033 4.66667C3.50033 4.43686 3.54559 4.20929 3.63354 3.99697C3.72148 3.78465 3.85039 3.59173 4.01289 3.42923C4.17539 3.26673 4.36831 3.13783 4.58063 3.04988C4.79295 2.96193 5.02051 2.91667 5.25033 2.91667ZM5.25033 7C5.86916 7 6.46266 6.75417 6.90024 6.31659C7.33783 5.879 7.58366 5.28551 7.58366 4.66667C7.58366 4.04783 7.33783 3.45434 6.90024 3.01675C6.46266 2.57917 5.86916 2.33334 5.25033 2.33334C4.63149 2.33334 4.03799 2.57917 3.60041 3.01675C3.16282 3.45434 2.91699 4.04783 2.91699 4.66667C2.91699 5.28551 3.16282 5.879 3.60041 6.31659C4.03799 6.75417 4.63149 7 5.25033 7ZM4.41725 8.45834H6.0834C7.54173 8.45834 8.72663 9.63047 8.75033 11.0833H1.75033C1.7722 9.63047 2.9571 8.45834 4.41725 8.45834ZM4.41725 7.875C2.62168 7.875 1.16699 9.32969 1.16699 11.1253C1.16699 11.4242 1.40944 11.6667 1.7084 11.6667H8.79225C9.09121 11.6667 9.33366 11.4242 9.33366 11.1253C9.33366 9.32969 7.87897 7.875 6.0834 7.875H4.41725ZM10.5003 7.875C10.5003 8.03542 10.6316 8.16667 10.792 8.16667C10.9524 8.16667 11.0837 8.03542 11.0837 7.875V6.41667H12.542C12.7024 6.41667 12.8337 6.28542 12.8337 6.125C12.8337 5.96459 12.7024 5.83334 12.542 5.83334H11.0837V4.375C11.0837 4.21459 10.9524 4.08334 10.792 4.08334C10.6316 4.08334 10.5003 4.21459 10.5003 4.375V5.83334H9.04199C8.88158 5.83334 8.75033 5.96459 8.75033 6.125C8.75033 6.28542 8.88158 6.41667 9.04199 6.41667H10.5003V7.875Z"
              fill="#5C6779"
            />
          </svg>
          <div className="italic">
            You are in an active call in this conversation
          </div>
          <div
            id="LeaveaCall"
            onClick={() => setEndCall(true)}
            className="border rounded-[7px] py-1 px-4 cursor-pointer"
          >
            Leave
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CallActions
