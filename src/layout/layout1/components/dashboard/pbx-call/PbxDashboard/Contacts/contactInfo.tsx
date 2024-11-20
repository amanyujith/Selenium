import React, { useEffect, useState } from "react"
import { RootState, actionCreators } from "../../../../../../../store"
import { useDispatch, useSelector } from "react-redux"
import Table from "../../vault/table"
import CallButton from "../../vault/Buttons/callButton"
import ChatButton from "../../vault/Buttons/chatButton"
import {
  filter_icon,
  incoming_call,
  missed_icon,
  outgoing_icon,
} from "../../vault/svg"
import { motion } from "framer-motion"
import moment from "moment-timezone"
import { Menu } from "@headlessui/react"
import DateFilterModal from "../../vault/dateFilterModal"
import { filterDate } from "../../vault/interfaces"

interface contactInfo {
  initiateCall: (phone: string) => void
}

const ContactInfo = ({ initiateCall }: contactInfo) => {
  const activeContact = useSelector(
    (state: RootState) => state.Call.activeContact
  )
  const callHistory = useSelector((state: RootState) => state.Call.callHistory)
  const chatInstance = useSelector(
    (state: RootState) => state.Chat.chatInstance
  )
  const intialFilter: filterDate = {
    startDate: new Date(
      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    ).setHours(0, 0, 0, 0),
    endDate: new Date().getTime(),
  } as filterDate

  const dispatch = useDispatch()
  const [type, setType] = useState<string>("All")
  const [filter, setFilter] = useState(intialFilter)

  const tableTitles: any[] = [
    {
      key: "data1",
      title: "Number",
      type: "typeCall",
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
      key: type === "Missed" ? "" : "data4",
      title: type === "Missed" ? "" : "Duration",
    },
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

  const tableData =
    activeContact?.call_history?.[0] === "noData"
      ? []
      : activeContact?.call_history
          ?.filter(
            (log: any) =>
              log?.dialed_number == activeContact?.id ||
              log?.calling_number == activeContact?.id
          )
          ?.map((call: any) => {
            return {
              data2: moment(call?.time).format("MM/DD/YYYY"),
              data3: moment(call?.time).format("hh:mm A"),
              data4:
                call?.type === "missed_call"
                  ? ""
                  : calculateTime(call?.talk_time),
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
              },
              number:
                call?.type === "incoming_call" || call?.type === "missed_call"
                  ? call?.calling_number
                  : call?.dialed_number,
              voiceMail: true,
            }
          })

  const sections = ["All", "Incoming", "Outgoing", "Missed"]

  const handleClick = () => {
    dispatch(actionCreators.setCallHistory([], "contactinfo"))
    chatInstance
      .CallHistory({
        type: type !== "All" ? type.toLowerCase() : "",
        start_date_time: filter.startDate,
        end_date_time: filter.endDate,
      })
      .then((res: any) => {
        dispatch(
          actionCreators.setCallHistory(
            res?.length ? res : ["noData"],
            "contactinfo"
          )
        )
      })
  }

  useEffect(() => {
    if (activeContact?.id) {
      setFilter(intialFilter)
      dispatch(actionCreators.setCallHistory([], "contactinfo"))
      chatInstance
        .CallHistory({
          type: type !== "All" ? type.toLowerCase() : "",
          extension: activeContact?.id,
          start_date_time: filter.startDate,
          end_date_time: filter.endDate,
        })
        .then((res: any) => {
          dispatch(
            actionCreators.setCallHistory(
              res?.length ? res : ["noData"],
              "contactinfo"
            )
          )
        })
    }
  }, [activeContact?.id, type])

  return (
    <motion.div
      key="contactInfo"
      initial={{ opacity: 0, translateY: "60px" }}
      animate={{
        opacity: 1,
        translateY: "0px",
        transition: { duration: 0.5 },
      }}
      className="origin-top rounded-xl w-full h-[calc(100vh-130px)] ml-1 bg-[#ffffff]"
    >
      <div className="bg-[#FFF7F5] w-[96%] mx-auto p-6 mt-6">
        <div className="text-[24px] font-semibold pb-2">
          {activeContact?.display_name}
        </div>
        <div className=" flex gap-2">
          {activeContact?.id ? (
            <div className="w-[20px] h-[20px] rounded-md bg-[#F7931F] flex justify-center items-center text-[12px]">
              1
            </div>
          ) : null}
          <div> {activeContact?.id}</div>
        </div>
      </div>
      <div className="flex gap-9 ml-[26px] mt-1 mr-8">
        {sections.map((sec: string,index: number) => {
          return (
            <div
            key={index}
             id={`Section-Contacts-${index}`}
              className={`px-3 py-2 cursor-pointer ${
                sec === type && "font-semibold"
              } `}
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
              <Menu.Items className="absolute right-4 top-[180px] z-[400]">
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
        className="origin-top"
      >
        <Table
          tableTitles={tableTitles}
          tableData={
            type === "All"
              ? tableData
              : tableData?.filter((data: any) => data.data1.text === type)
          }
          tableClass="w-full rounded-xl"
          headClass="bg-[#FFF7F5] "
          mainClass=" h-[calc(100vh-320px)]"
          handleAction={initiateCall}
          dataExist={activeContact?.call_history?.length}
        />
      </motion.div>
    </motion.div>
  )
}

export default ContactInfo
