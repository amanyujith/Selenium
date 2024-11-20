import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState, actionCreators } from "../../../../../../../store"
import path from "../../../../../../../navigation/routes.path"
import { useEffect, useState } from "react"
import Tooltip from "../../../../../../../atom/ToolTip/Tooltip"
import { motion } from "framer-motion"
import { MeetingSessionType } from "hdmeet"
import {
  PHONE_ICON,
  PLUS_ICON,
} from "../../../../../../../utils/SVG/svgsRestHere"
import AddCallListOptions from "./addCallListOptions"
const presenceColors: any = {
  online: "#76B947",
  call: "#EF4036",
  meeting: "#EF4036",
}

interface iContactList {
  children?: any
  uuid: string
  name?: string
  profile_picture: string
  presence: string
  restClass?: any
  rest?: any
  handleClick?: any
  index?: number
  phone?: string
  color?: any
  initiateCall?: (phone: string) => void
  inCall?: boolean
}

const ContactList = ({
  uuid,
  name,
  restClass,
  handleClick,
  children,
  profile_picture,
  presence,
  index,
  color,
  phone,
  initiateCall,
  inCall,
  ...rest
}: iContactList) => {
  const dispatch = useDispatch()
  const activeContact = useSelector(
    (state: RootState) => state.Call.activeContact
  )
  const silDetails = useSelector((state: RootState) => state.Call.silDetails)
  const [image, setImage] = useState("")
  const callState = useSelector((state: RootState) => state.Call.callState)

  useEffect(() => {
    const newUrl = profile_picture?.replace(
      /\.(jpg|jpeg|png|gif)$/,
      "-low.webp"
    )
    setImage(newUrl)
  }, [])

  const handleError = () => {
    setImage(profile_picture)
  }

  const routeChange = (uuid: string) => {
    if (activeContact.id !== uuid)
      dispatch(actionCreators.setActiveContact(uuid))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`flex flex-row mx-3 ${restClass}  ${
        phone === activeContact?.id && !inCall
          ? "bg-[#FDE7CE] rounded-lg group "
          : ""
      }`}
      key={uuid}
    >
      <div id="name"
        onClick={() => !inCall && routeChange(uuid)}
        className={`pl-3 group ${
          !inCall && "hover:bg-[#E9EBF8] cursor-pointer"
        }  py-[.400rem] pr-2.5 flex flex-row items-center w-full text-sm rounded-[8px] relative text-center`}
      >
        <div 
          style={{ backgroundColor: color }}
          className={` ${"border-[2px] border-[#E9EBF8] bg-[#91785B]"} w-[27px] h-[27px] rounded-bl-none rounded-[50%] text-[white] overflow-hidden shrink-0`}
        >
          {image ? (
            <img
              className="w-full h-full  object-cover "
              onError={() => handleError()}
              src={image}
              alt=""
            />
          ) : (
            <div className="capitalize mt-[2px]">{name?.slice(0, 1)}</div>
          )}
        </div>
        <div className="flex flex-col w-[250px]">
          <div className="ml-[7px] flex flex-row w-[175px] truncate text-[18px] ">
            {name}
          </div>
          <div className="ml-[7px] flex flex-row w-[70%] truncate text-[10px] ">
            {phone}
          </div>
        </div>
        {callState === "inactive" && silDetails?.id && !inCall && (
          <motion.div
            className="w-6 h-6  ml-auto bg-[#F7941E] rounded-[50%]  invisible group-hover:visible flex justify-center items-center"
            onClick={(e) => {
              e.stopPropagation()
              if (initiateCall) initiateCall(phone as string)
            }}
          >
            <span id='phone-icon' className="scale-90">{PHONE_ICON}</span>
          </motion.div>
        )}
        {inCall && (
          <AddCallListOptions
            uuid={uuid}
            phone={phone}
            profile_picture={profile_picture}
            index={index}
            name={name}
          />
        )}
      </div>
    </motion.div>
  )
}

export default ContactList
