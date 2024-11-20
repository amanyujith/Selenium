import React from "react"
// import useTimer from './useTimer';
import { formatTime } from "../../../../../../utils/meetingTimer"
import { useSelector } from "react-redux"

const RecordTimer = () => {
  // const { startTimer } = useTimer()
  // const timeInSec = useSelector((state: any) => state.Main.timeInSec)
  const time = useSelector((state: any) => state.Main.recordTime)
  // 
  return (
    <div className=" mr-2 text-[#F65E1D]">
      {/* {formatTime(timeInSec)} */}
      {time}
    </div>
  )
}

export default RecordTimer
