import React, { MutableRefObject } from "react"
import { motion } from "framer-motion"
import { DIALER_ICON } from "../../../../../../utils/SVG/svgsRestHere"
import { useSelector } from "react-redux"
import Dtmf from "./dtmfTonePlayer"
const _ = require("lodash")

interface keyPad {
  focusInputAtIndex: (position: string) => void
  setNumber: (number: string | ((prev: string) => string)) => void
  selectionStart: MutableRefObject<number | null>
  click: string
  inCall?: boolean
}

const KeyPad = ({
  focusInputAtIndex,
  setNumber,
  selectionStart,
  click,
  inCall,
}: keyPad) => {
  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"]
  const alphabets = ["ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"]
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)

  const { handleKeyPress, handleKeyUp } = Dtmf()
  // const debounceFn = _.debounce(handleKeyPress, 200)

  return (
    <div className="flex flex-row w-[290px] flex-wrap place-content-center  px-[12px] ">
      {buttons.map((char: string, index: number) => (
        <motion.button
          key={index}
          initial={{
            scale: 0,
            opacity: 0,
            // borderRadius: "0%"
          }}
          whileHover={{
            // borderRadius: "20%",
            transition: {
              duration: 0,
              type: "just",
              ease: "easeIn",
            },
          }}
          animate={{
            // borderRadius: "50%",
            scale: 1,
            opacity: 1,
            transition: {
              duration: inCall ? 0.2 : 0.3,
              ease: [0.85, 0, 0.15, 1],
              type: "tween",
            },
          }}
          onMouseDown={() => handleKeyPress(char)}
          onMouseUp={handleKeyUp}
          onClick={(e) => {
            if (inCall) {
              meetingSession.sendDTMF({
                tones: char,
              })
            }
            e.stopPropagation()
            e.preventDefault()
            focusInputAtIndex("forward")
            if (selectionStart.current || selectionStart.current === 0)
              setNumber((prev: string) => {
                if (selectionStart.current || selectionStart.current === 0)
                  return (
                    prev.substring(0, selectionStart.current) +
                    char +
                    prev.substring(selectionStart.current)
                  )
                else return ""
              })
          }}
          className={`w-[63px] h-[63px] text-xl font-thin text-[#1F1F21] bg-[#FFF7F5] rounded-[50%] ${
            inCall ? "duration-100" : "duration-200"
          } hover:bg-[#c1c1c1] border hover:animate-round ${
            click === char && "animate-round2"
          }   border-[#AFB4BD] m-2
                 `}
        >
          <div className="flex flex-col items-center justify-center font-normal font-sans">
            {char}
            <div className="text-[10px] leading-3 font-semibold ">
              {char === "1" ? (
                <div className="-mt-0.5">{DIALER_ICON}</div>
              ) : (
                alphabets[index - 1]
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

export default KeyPad
