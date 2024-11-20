import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../../../../../store"
import { end_call, incoming_ring } from "../../vault/svg"
import { motion } from "framer-motion"

interface list {
  name: string
  number: string
}

const MultipleIncomingView = () => {
  const incomingCallData = useSelector(
    (state: RootState) => state.Chat.incomingCall
  )?.body?.data
  const brandingInfo = useSelector(
    (state: RootState) => state.Main.brandingInfo
  )
  const call_list = [
    {
      name: "Leo",
      number: "101010101",
    },
    {
      name: "Robert",
      number: "82989110910",
    },
  ]
  return (
    <div>
      {call_list.map((call: list) => {
        return (
          <div className="flex gap-3 mx-3 mb-2 border-b-[1px]  border-[#ffffff]/[0.12]">
            <div className="w-[32px] h-[32px]">
              <img src={brandingInfo?.data?.logos?.favicon} alt="" />
            </div>
            <div className="flex flex-col text-[#ffffff] min-w-[145px]">
              <span className="font-bold">{call.name}</span>
              <span>{call.number}</span>
            </div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                className="w-[32px] h-[32px] rounded-[50%]  bg-[#76B947] flex justify-center items-center cursor-pointer"
                // onClick={() => setCallState("inCall")}
              >
                {incoming_ring}
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                className="w-[32px] h-[32px] rounded-[50%]  bg-[#F74B14] flex justify-center items-center cursor-pointer"
                // onClick={() => setCallState("inactive")}
              >
                {end_call("white")}
              </motion.div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MultipleIncomingView
