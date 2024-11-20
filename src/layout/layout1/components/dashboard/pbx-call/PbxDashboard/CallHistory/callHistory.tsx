import React, { useEffect, useState } from "react"
import {
  filter_icon,
  incoming_call,
  missed_icon,
  outgoing_icon,
} from "../../vault/svg"
import Table from "../../vault/table"
import CallButton from "../../vault/Buttons/callButton"
import ChatButton from "../../vault/Buttons/chatButton"
import { motion } from "framer-motion"
import DateFilterModal from "../../vault/dateFilterModal"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import ChatSessionInstance from "hdmeet/lib/chatSession/chatSessionInstance"
import { RootState, actionCreators } from "../../../../../../../store"
import moment from "moment-timezone"
import { Menu } from "@headlessui/react"
import { filterDate } from "../../vault/interfaces"

interface callHistory {
  initiateCall: (phone: string) => void
}

const CallHistory = ({ initiateCall }: callHistory) => {
  const [type, setType] = useState<string>("All")
  const sections = ["All", "Incoming", "Outgoing", "Missed"]
  const [filter, setFilter] = useState({
    startDate: new Date(
      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    ).setHours(0, 0, 0, 0),
    endDate: new Date().getTime(),
  } as filterDate)
  const callHistory = useSelector((state: RootState) => state.Call.callHistory)
  const chatInstance = useSelector(
    (state: RootState) => state.Chat.chatInstance
  )
  const dispatch = useDispatch()
  const tableTitles: any[] = [
    {
      key: "data1",
      title: "Number",
      type: "Details",
    },
    {
      key: "data2",
      title: "Date",
    },
    {
      key: "data3",
      title: "Time",
    },
    {
      key: type === "Missed" ? null : "data4",
      title: type === "Missed" ? null : "Duration",
    },
    // {
    //   type: "voiceMail",
    //   childrens: [
    //     // {
    //     //   icon: <ChatButton />,
    //     //   action: "",
    //     // },
    //     {
    //       icon: <CallButton />,
    //       action: "",
    //     },
    //   ],
    // },
    {
      type: "hover",
      number: "number",
      childrens: [
        // {
        //   icon: <ChatButton />,
        //   action: "chat",
        // },
        {
          icon: <CallButton />,
          action: "call",
        },
      ],
    },
  ]

  const calculateTime = (seconds: number) => {
    // Calculate hours
    const hours = Math.floor(seconds / 3600)

    // Calculate remaining seconds after calculating hours
    const remainingSecondsAfterHours = seconds % 3600

    // Calculate minutes from remaining seconds
    const minutes = Math.floor(remainingSecondsAfterHours / 60)

    // Calculate remaining seconds after calculating minutes
    const remainingSeconds = remainingSecondsAfterHours % 60

    // Format the time string
    const timeString = `${hours ? `${hours}hr` : ""} ${
      minutes ? `${minutes}m` : ""
    } ${remainingSeconds}s `

    return timeString
  }

  const handleClick = () => {
    dispatch(actionCreators.setCallHistory([]))
    chatInstance
      .CallHistory({
        type: type !== "All" ? type.toLowerCase() : "",
        start_date_time: filter.startDate,
        end_date_time: filter.endDate,
      })
      .then((res: any) => {
        dispatch(actionCreators.setCallHistory(res?.length ? res : ["noData"]))
      })
  }

  const tableData =
    callHistory[0] === "noData"
      ? []
      : callHistory?.map((call: any) => {
          return {
            data2: moment(call?.time).format("MM/DD/YYYY"),
            data3: moment(call?.time).format("hh:mm A"),
            data4:
              call?.type === "missed_call" ? "" : calculateTime(call.talk_time),
            data6: "Subdomain",
            data1: {
              icon:
                call?.type === "missed_call"
                  ? missed_icon
                  : call?.type === "outgoing_call"
                  ? outgoing_icon
                  : call?.type === "incoming_call"
                  ? incoming_call
                  : "",
              text:
                call?.type === "missed_call"
                  ? "Missed"
                  : call?.type === "outgoing_call"
                  ? "Outgoing"
                  : call?.type === "incoming_call"
                  ? "Incoming"
                  : "",
              number:
                call?.type === "incoming_call" || call?.type === "missed_call"
                  ? call?.calling_number
                  : call?.dialed_number,
              name:
                call?.type === "incoming_call" || call?.type === "missed_call"
                  ? call?.calling_number_display_name
                  : call?.dialed_number_display_name,
            },
            number:
              call?.type === "incoming_call" || call?.type === "missed_call"
                ? call?.calling_number
                : call?.dialed_number,
            voiceMail: true,
          }
        })

  useEffect(() => {
    dispatch(actionCreators.setCallHistory([]))
    chatInstance
      .CallHistory({
        type: type !== "All" ? type.toLowerCase() : "",
        start_date_time: filter.startDate,
        end_date_time: filter.endDate,
      })
      .then((res: any) => {
        dispatch(actionCreators.setCallHistory(res?.length ? res : ["noData"]))
      })
  }, [type])

  return (
    <motion.div
      key="callHistory"
      initial={{ opacity: 0, translateY: "60px" }}
      animate={{
        opacity: 1,
        translateY: "0px",
        transition: { duration: 0.5 },
      }}
      className="bg-[#ffffff] w-[99%] h-[calc(100vh-130px)] rounded-lg "
    >
      <div className="ml-[24px] mt-[24px] mb-2 font-semibold ">
        Call History
      </div>
      <div className="flex gap-9 mx-auto bg-[#ffffff] w-[95%] relative">
        {sections.map((sec: string, index: number) => {
          return (
            <div
            key={index}
             id={`Section-Call_History-${index}`}
              className={`px-3 py-2 cursor-pointer ${
                sec === type && "font-semibold"
              }`}
              onClick={() => setType(sec)}
            >
              {sec}
            </div>
          )
        })}
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button
                className={`ml-auto p-2 h-[34px] hover:bg-[#EEEEEE] ${
                  open && "bg-[#EEEEEE]"
                } rounded-md cursor-pointer`}
              >
                {filter_icon}
              </Menu.Button>
              <Menu.Items className="absolute right-0 top-9 z-[400]">
                <DateFilterModal
                  type={type}
                  filter={filter}
                  setFilter={setFilter}
                  handleClick={handleClick}
                />
              </Menu.Items>
            </>
          )}
        </Menu>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="origin-top "
      >
        <Table
          tableTitles={tableTitles}
          tableData={
            type === "All"
              ? tableData
              : type === "Voice Mail"
              ? tableData.filter((data: any) => data.voiceMail)
              : tableData.filter((data: any) => data.data1.text === type)
          }
          tableClass="w-full rounded-xl"
          headClass="bg-[#FFF7F5]"
          mainClass=" h-[calc(100vh-260px)]"
          handleAction={initiateCall}
          dataExist={callHistory?.length}
        />
      </motion.div>
    </motion.div>
  )
}

export default CallHistory
