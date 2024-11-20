import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { actionCreators } from "../../../../../store"
import path from "../../../../../navigation/routes.path"
import { useEffect, useState } from "react"
import Tooltip from "../../../../../atom/ToolTip/Tooltip"

const presenceColors: any = {
  online: "#76B947",
  call: "#EF4036",
  meeting: "#EF4036",
}

interface iMenuNodeList {
  children?: any
  uuid: string
  name?: string
  isGroup: boolean
  profile_picture: string
  presence: string
  unread?: any
  restClass?: any
  rest?: any
  handleClick?: any
  isTyping?: null | string
  callDetails: any
  admin?: any
  privategrp?: boolean
  status?: any
  index?: number
  setActive?: any
  messageRecieved?: boolean
  color?: any
}

const MenuNodeList = ({
  uuid,
  name,
  restClass,
  handleClick,
  children,
  isGroup,
  profile_picture,
  presence,
  unread,
  isTyping,
  callDetails,
  admin,
  privategrp,
  status,
  index,
  setActive,
  messageRecieved,
  color,
  ...rest
}: iMenuNodeList) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const unreads = unread
  const { data: activeChat } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const [image, setImage] = useState("")

  useEffect(() => {
    const newUrl = profile_picture?.replace(
      /\.(jpg|jpeg|png|gif)$/,
      "-low.webp"
    )
    setImage(newUrl)
  }, [profile_picture])

  const handleError = () => {
    setImage(profile_picture)
  }

  const routeChange = (uuid: string) => {
    dispatch(actionCreators.toggleLeftbar("hidden"))
    // const active = messengerslist.find((item:any) => item.uuid === uuid )
    dispatch(actionCreators.setAcitveChat(uuid, isGroup))
    dispatch(actionCreators.setMultipleMsgList({}));
    dispatch(actionCreators.setMultipleMsgSelect(false));
    navigate(`${path.CHAT}/${uuid}`)
  }

  return (
    <div
      className={`flex flex-row ml-8 ${uuid === activeChat?.uuid ? "bg-[#FEF3E6] rounded-[3px]" : ""
        }`}
      key={uuid}
    >
      <button
        id={uuid}
        onClick={() => routeChange(uuid)}
        className={`pl-3 group hover:bg-[#FEF3E6] py-[.400rem] pr-2.5 flex flex-row items-center w-full text-sm rounded-[8px] relative`}
      >
        {isGroup && (
          <div className="rounded-[50px] border-[1px] border-[#EBEDEF] bg-[#FEFDFB] absolute mb-4 ml-3">
            {privategrp ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
              >
                <path
                  d="M5.28841 5.16732V6.33398H8.78841V5.16732C8.78841 4.20117 8.00456 3.41732 7.03841 3.41732C6.07227 3.41732 5.28841 4.20117 5.28841 5.16732ZM4.70508 6.33398V5.16732C4.70508 3.87852 5.74961 2.83398 7.03841 2.83398C8.32721 2.83398 9.37174 3.87852 9.37174 5.16732V6.33398H9.66341C10.4691 6.33398 11.1217 6.98659 11.1217 7.79232V10.709C11.1217 11.5147 10.4691 12.1673 9.66341 12.1673H4.41341C3.60768 12.1673 2.95508 11.5147 2.95508 10.709V7.79232C2.95508 6.98659 3.60768 6.33398 4.41341 6.33398H4.70508ZM3.53841 7.79232V10.709C3.53841 11.1921 3.93034 11.584 4.41341 11.584H9.66341C10.1465 11.584 10.5384 11.1921 10.5384 10.709V7.79232C10.5384 7.30925 10.1465 6.91732 9.66341 6.91732H4.41341C3.93034 6.91732 3.53841 7.30925 3.53841 7.79232Z"
                  fill="#B1B1B1"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
              >
                <path
                  d="M7.03776 11.584C7.34219 11.584 7.77422 11.3215 8.16615 10.5395C8.34661 10.1785 8.49792 9.74284 8.60547 9.25065H5.47005C5.5776 9.74284 5.72891 10.1785 5.90938 10.5395C6.3013 11.3215 6.73333 11.584 7.03776 11.584ZM5.36615 8.66732H8.70938C8.76042 8.29909 8.78776 7.90716 8.78776 7.50065C8.78776 7.09414 8.76042 6.70221 8.70938 6.33398H5.36615C5.3151 6.70221 5.28776 7.09414 5.28776 7.50065C5.28776 7.90716 5.3151 8.29909 5.36615 8.66732ZM5.47005 5.75065H8.60547C8.49792 5.25846 8.34661 4.82279 8.16615 4.46185C7.77422 3.67982 7.34219 3.41732 7.03776 3.41732C6.73333 3.41732 6.3013 3.67982 5.90938 4.46185C5.72891 4.82279 5.5776 5.25846 5.47005 5.75065ZM9.29818 6.33398C9.34557 6.70768 9.37109 7.09779 9.37109 7.50065C9.37109 7.90352 9.34557 8.29362 9.29818 8.66732H10.9534C11.0628 8.29727 11.1229 7.90534 11.1229 7.50065C11.1229 7.09596 11.0646 6.70404 10.9534 6.33398H9.29818ZM10.7292 5.75065C10.257 4.75716 9.39662 3.98424 8.34297 3.6306C8.72578 4.14648 9.02839 4.88477 9.20339 5.75065H10.731H10.7292ZM4.87578 5.75065C5.05078 4.88294 5.35339 4.14648 5.7362 3.6306C4.68073 3.98424 3.81849 4.75716 3.34818 5.75065H4.87396H4.87578ZM3.12578 6.33398C3.01641 6.70404 2.95625 7.09596 2.95625 7.50065C2.95625 7.90534 3.01458 8.29727 3.12578 8.66732H4.77734C4.72995 8.29362 4.70443 7.90352 4.70443 7.50065C4.70443 7.09779 4.72995 6.70768 4.77734 6.33398H3.12396H3.12578ZM8.34115 11.3707C9.39479 11.0152 10.2552 10.2441 10.7273 9.25065H9.20156C9.02656 10.1184 8.72396 10.8548 8.34115 11.3707ZM5.73438 11.3707C5.35156 10.8548 5.05078 10.1165 4.87396 9.25065H3.34818C3.82031 10.2441 4.68073 11.0171 5.73438 11.3707ZM7.03776 12.1673C5.80008 12.1673 4.6131 11.6757 3.73793 10.8005C2.86276 9.92531 2.37109 8.73833 2.37109 7.50065C2.37109 6.26297 2.86276 5.07599 3.73793 4.20082C4.6131 3.32565 5.80008 2.83398 7.03776 2.83398C8.27544 2.83398 9.46242 3.32565 10.3376 4.20082C11.2128 5.07599 11.7044 6.26297 11.7044 7.50065C11.7044 8.73833 11.2128 9.92531 10.3376 10.8005C9.46242 11.6757 8.27544 12.1673 7.03776 12.1673Z"
                  fill="#B1B1B1"
                />
              </svg>
            )}
          </div>
        )}
        <div
          style={{ ...(isGroup === false && { backgroundColor: color }) }}
          className={` ${!isGroup
              ? "border-[2px] border-[#E9EBF8] bg-[#91785B]"
              : "border-[#E1E1E1] bg-[#E1E1E1] pl-[2px] pt-1"
            } w-[27px] h-[27px] rounded-bl-none rounded-[50%] text-[white] overflow-hidden shrink-0`}
        >
          {image ? (
            <img
              className="w-full h-full  object-cover "
              onError={() => handleError()}
              src={image}
              alt=""
            />
          ) : isGroup ? (
            <svg
              className="-mt-1 -ml-[3px]"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 26V27H2H14C21.1797 27 27 21.1797 27 14C27 6.8203 21.1797 1 14 1C6.8203 1 1 6.8203 1 14V26Z"
                fill=""
              />
              <path
                d="M1 26V27H2H14C21.1797 27 27 21.1797 27 14C27 6.8203 21.1797 1 14 1C6.8203 1 1 6.8203 1 14V26Z"
                stroke="white"
                stroke-width="2"
              />
              <path
                d="M7.8 9.79996C7.8 9.42866 7.9475 9.07256 8.21005 8.81001C8.4726 8.54746 8.8287 8.39996 9.2 8.39996C9.5713 8.39996 9.9274 8.54746 10.1899 8.81001C10.4525 9.07256 10.6 9.42866 10.6 9.79996C10.6 10.1713 10.4525 10.5274 10.1899 10.7899C9.9274 11.0525 9.5713 11.2 9.2 11.2C8.8287 11.2 8.4726 11.0525 8.21005 10.7899C7.9475 10.5274 7.8 10.1713 7.8 9.79996ZM7.6 13.7425C7.35 14.0225 7.2 14.395 7.2 14.8C7.2 15.205 7.35 15.5775 7.6 15.8575V13.7425ZM11.21 12.51C10.4675 13.1675 10 14.13 10 15.2C10 16.0575 10.3 16.845 10.8 17.4625V18C10.8 18.4425 10.4425 18.8 10 18.8H8.4C7.9575 18.8 7.6 18.4425 7.6 18V17.33C6.655 16.88 6 15.9175 6 14.8C6 13.2525 7.2525 12 8.8 12H9.6C10.2 12 10.755 12.1875 11.21 12.5075V12.51ZM17.2 18V17.4625C17.7 16.845 18 16.0575 18 15.2C18 14.13 17.5325 13.1675 16.79 12.5075C17.245 12.1875 17.8 12 18.4 12H19.2C20.7475 12 22 13.2525 22 14.8C22 15.9175 21.345 16.88 20.4 17.33V18C20.4 18.4425 20.0425 18.8 19.6 18.8H18C17.5575 18.8 17.2 18.4425 17.2 18ZM17.4 9.79996C17.4 9.42866 17.5475 9.07256 17.8101 8.81001C18.0726 8.54746 18.4287 8.39996 18.8 8.39996C19.1713 8.39996 19.5274 8.54746 19.7899 8.81001C20.0525 9.07256 20.2 9.42866 20.2 9.79996C20.2 10.1713 20.0525 10.5274 19.7899 10.7899C19.5274 11.0525 19.1713 11.2 18.8 11.2C18.4287 11.2 18.0726 11.0525 17.8101 10.7899C17.5475 10.5274 17.4 10.1713 17.4 9.79996ZM20.4 13.7425V15.86C20.65 15.5775 20.8 15.2075 20.8 14.8025C20.8 14.3975 20.65 14.025 20.4 13.745V13.7425ZM14 8.39996C14.4243 8.39996 14.8313 8.56853 15.1314 8.86859C15.4314 9.16865 15.6 9.57562 15.6 9.99996C15.6 10.4243 15.4314 10.8313 15.1314 11.1313C14.8313 11.4314 14.4243 11.6 14 11.6C13.5757 11.6 13.1687 11.4314 12.8686 11.1313C12.5686 10.8313 12.4 10.4243 12.4 9.99996C12.4 9.57562 12.5686 9.16865 12.8686 8.86859C13.1687 8.56853 13.5757 8.39996 14 8.39996ZM12 15.2C12 15.605 12.15 15.975 12.4 16.2575V14.1425C12.15 14.425 12 14.795 12 15.2ZM15.6 14.1425V16.26C15.85 15.9775 16 15.6075 16 15.2025C16 14.7975 15.85 14.425 15.6 14.145V14.1425ZM17.2 15.2C17.2 16.3175 16.545 17.28 15.6 17.73V18.8C15.6 19.2425 15.2425 19.6 14.8 19.6H13.2C12.7575 19.6 12.4 19.2425 12.4 18.8V17.73C11.455 17.28 10.8 16.3175 10.8 15.2C10.8 13.6525 12.0525 12.4 13.6 12.4H14.4C15.9475 12.4 17.2 13.6525 17.2 15.2Z"
                fill={color}
              />
            </svg>
          ) : (
            <div className="capitalize mt-[2px]">{name?.slice(0, 1)}</div>
          )}
        </div>
        {(() => {
          if (
            presence === "online" ||
            presence === "call" ||
            presence === "meeting"
          ) {
            return (
              <div className="ml-[17px] mt-[18px] absolute z-10">
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 7 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="3.5"
                    cy="3.5"
                    r="3"
                    fill={presenceColors[presence]}
                    stroke="white"
                  />
                </svg>
              </div>
            )
          }
        })()}
        <div className={`ml-[7px] flex flex-row w-full text-[15px] relative`}>
          <div
            className={`w-[180px] text-left justify-start ${unreads > 0 ? "text-[#293241] font-bold" : "text-[#293241]"
              }`}
          >
            {" "}
            <div className="flex">
              <span className="max-w-[150px] w-fit truncate "> {name}</span>{" "}
              {status && (
                <Tooltip
                  content={status?.name}
                  direction={index === 0 ? "bottom" : "top"}
                  onclick={true}
                >
                  <span className="px-1">{status?.emoji}</span>
                </Tooltip>
              )}
              {presence === "call" && !callDetails ? (
                <Tooltip
                  content={"In a call"}
                  direction={index === 0 ? "bottom" : "top"}
                  onclick={true}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-[4.3px] ml-2"
                  >
                    <path
                      d="M7.18402 5.3524C6.88506 5.2248 6.5387 5.30865 6.33272 5.56021L5.72751 6.30032C4.88897 5.8136 4.18897 5.1136 3.70225 4.27506L4.44053 3.67167C4.69209 3.46568 4.77777 3.11933 4.64834 2.82037L3.77334 0.778701C3.63662 0.457868 3.29209 0.279222 2.9512 0.352139L0.909538 0.789639C0.574121 0.860732 0.333496 1.15787 0.333496 1.5024C0.333496 5.81724 3.67855 9.35006 7.91683 9.64901C7.99886 9.65448 8.08272 9.65995 8.16657 9.6636C8.16657 9.6636 8.16657 9.6636 8.16839 9.6636C8.27959 9.66724 8.38897 9.67089 8.50199 9.67089C8.84652 9.67089 9.14365 9.43026 9.21475 9.09485L9.65225 7.05318C9.72516 6.7123 9.54652 6.36776 9.22568 6.23105L7.18402 5.35604V5.3524ZM8.49469 9.08573C4.30928 9.08209 0.916829 5.68964 0.916829 1.5024C0.916829 1.43313 0.964225 1.37479 1.03167 1.36021L3.07334 0.922712C3.14079 0.908128 3.21006 0.944587 3.2374 1.00839L4.1124 3.05006C4.13792 3.11021 4.12152 3.17948 4.07048 3.21959L3.33037 3.8248C3.1098 4.00526 3.05147 4.32063 3.19548 4.56855C3.73324 5.49641 4.50615 6.26933 5.43219 6.80526C5.68011 6.94927 5.99548 6.89094 6.17594 6.67037L6.78115 5.93026C6.82308 5.87922 6.89235 5.86282 6.95068 5.88834L8.99235 6.76334C9.05615 6.79068 9.09261 6.85995 9.07803 6.9274L8.64053 8.96907C8.62595 9.03651 8.56579 9.08391 8.49834 9.08391C8.49652 9.08391 8.49469 9.08391 8.49287 9.08391L8.49469 9.08573Z"
                      fill="#5C6779"
                    />
                  </svg>
                </Tooltip>
              ) : presence === "meeting" ? (
                <Tooltip
                  content={"In a meeting"}
                  direction={index === 0 ? "bottom" : "top"}
                  onclick={true}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-[3px] ml-2"
                  >
                    <path
                      d="M2.95312 0.25C3.18516 0.25 3.375 0.439844 3.375 0.671875V1.9375H8.4375V0.671875C8.4375 0.439844 8.62734 0.25 8.85938 0.25C9.09141 0.25 9.28125 0.439844 9.28125 0.671875V1.9375H10.125C11.0558 1.9375 11.8125 2.69424 11.8125 3.625V4.46875V5.3125V12.0625C11.8125 12.9933 11.0558 13.75 10.125 13.75H1.6875C0.756738 13.75 0 12.9933 0 12.0625V5.3125V4.46875V3.625C0 2.69424 0.756738 1.9375 1.6875 1.9375H2.53125V0.671875C2.53125 0.439844 2.72109 0.25 2.95312 0.25ZM10.9688 5.3125H8.22656V7.21094H10.9688V5.3125ZM10.9688 8.05469H8.22656V10.1641H10.9688V8.05469ZM10.9688 11.0078H8.22656V12.9062H10.125C10.5917 12.9062 10.9688 12.5292 10.9688 12.0625V11.0078ZM7.38281 10.1641V8.05469H4.42969V10.1641H7.38281ZM4.42969 11.0078V12.9062H7.38281V11.0078H4.42969ZM3.58594 10.1641V8.05469H0.84375V10.1641H3.58594ZM0.84375 11.0078V12.0625C0.84375 12.5292 1.2208 12.9062 1.6875 12.9062H3.58594V11.0078H0.84375ZM0.84375 7.21094H3.58594V5.3125H0.84375V7.21094ZM4.42969 7.21094H7.38281V5.3125H4.42969V7.21094ZM10.125 2.78125H1.6875C1.2208 2.78125 0.84375 3.1583 0.84375 3.625V4.46875H10.9688V3.625C10.9688 3.1583 10.5917 2.78125 10.125 2.78125Z"
                      fill="#5C6779"
                    />
                  </svg>
                </Tooltip>
              ) : (
                ""
              )}
              {callDetails?.meeting_id && callDetails?.password && (
                <Tooltip
                  content={"Call in progress"}
                  direction={index === 0 ? "bottom" : "top"}
                  onclick={true}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="mt-[3.5px] ml-2"
                  >
                    <path
                      d="M5.13174 2.25495C4.97383 1.87351 4.55752 1.67048 4.15967 1.77917L2.35498 2.27136C1.99814 2.3698 1.75 2.69382 1.75 3.06296C1.75 8.1366 5.86387 12.2505 10.9375 12.2505C11.3066 12.2505 11.6307 12.0023 11.7291 11.6455L12.2213 9.84079C12.33 9.44294 12.127 9.02663 11.7455 8.86872L9.77676 8.04841C9.44248 7.90896 9.05488 8.00535 8.82725 8.2863L7.99873 9.29734C6.55498 8.61443 5.38603 7.44548 4.70312 6.00173L5.71416 5.17527C5.99512 4.94558 6.0915 4.56003 5.95205 4.22576L5.13174 2.25701V2.25495Z"
                      fill="#F7931F"
                    />
                  </svg>
                </Tooltip>

                // <span className="relative flex h-2 w-2 my-auto ml-2">
                //   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b14f4f] opacity-75 left"></span>
                //   <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b14f4f] "></span>
                // </span>
              )}
              {presence === "archive" && (
                <span className="mx-2 truncate">(archived)</span>
              )}
            </div>
          </div>
          <div
            className={`pr-1 flex items-center w-fit inset-y-0 right-0 absolute`}
          >
            {isTyping && (
              <div className=" flex items-center gap-1 pr-1">
                <div className="h-1 w-1 bg-[#FA8C2C] rounded-full  animate-bounce" />
                <div
                  style={{ animationDelay: "100ms" }}
                  className="h-1 w-1   bg-[#818285]  rounded-full animate-bounce"
                />
                <div
                  style={{ animationDelay: "200ms" }}
                  className="h-1 w-1 bg-danger rounded-full    animate-bounce"
                />
              </div>
            )}
            {(() => {
              if (unreads > 0) {
                return (
                  <div
                    className={`rounded-full w-fit text-[12px] px-1 h-[14px] flex items-center content-center text-[#FFFFFF] bg-[#AD6716]  `}
                  >
                    {unread}
                  </div>
                )
              }
            })()}
          </div>
        </div>
        {/* {isGroup && (
          <div
            className={`  ${
              uuid === activeChat.uuid ? "visible" : "invisible"
            } group-hover:visible`}
          >
            <svg
              width="32"
              height="25"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.9688 16C17.9688 16.3894 17.8533 16.77 17.637 17.0938C17.4206 17.4175 17.1132 17.6699 16.7534 17.8189C16.3937 17.9679 15.9978 18.0069 15.6159 17.9309C15.234 17.855 14.8832 17.6675 14.6079 17.3921C14.3326 17.1168 14.145 16.766 14.0691 16.3841C13.9931 16.0022 14.0321 15.6063 14.1811 15.2466C14.3301 14.8869 14.5825 14.5794 14.9062 14.363C15.23 14.1467 15.6106 14.0312 16 14.0312C16.5221 14.0312 17.0229 14.2387 17.3921 14.6079C17.7613 14.9771 17.9688 15.4779 17.9688 16ZM10.375 14.0312C9.98562 14.0312 9.60498 14.1467 9.28122 14.363C8.95746 14.5794 8.70512 14.8869 8.55611 15.2466C8.4071 15.6063 8.36812 16.0022 8.44408 16.3841C8.52004 16.766 8.70755 17.1168 8.98288 17.3921C9.25822 17.6675 9.60902 17.855 9.99092 17.9309C10.3728 18.0069 10.7687 17.9679 11.1284 17.8189C11.4882 17.6699 11.7956 17.4175 12.012 17.0938C12.2283 16.77 12.3438 16.3894 12.3438 16C12.3438 15.4779 12.1363 14.9771 11.7671 14.6079C11.3979 14.2387 10.8971 14.0312 10.375 14.0312ZM21.625 14.0312C21.2356 14.0312 20.855 14.1467 20.5312 14.363C20.2075 14.5794 19.9551 14.8869 19.8061 15.2466C19.6571 15.6063 19.6181 16.0022 19.6941 16.3841C19.77 16.766 19.9575 17.1168 20.2329 17.3921C20.5082 17.6675 20.859 17.855 21.2409 17.9309C21.6228 18.0069 22.0187 17.9679 22.3784 17.8189C22.7382 17.6699 23.0456 17.4175 23.262 17.0938C23.4783 16.77 23.5938 16.3894 23.5938 16C23.5938 15.7415 23.5428 15.4855 23.4439 15.2466C23.3449 15.0077 23.1999 14.7907 23.0171 14.6079C22.8343 14.4251 22.6173 14.2801 22.3784 14.1811C22.1395 14.0822 21.8835 14.0312 21.625 14.0312Z"
                fill="#5C6779"
                transform="rotate(-90 16 16)"
              />
            </svg>
          </div>
        )} */}
      </button>
    </div>
  )
}

export default MenuNodeList
