import React from 'react';
// import useTimer from './useTimer';
import { formatTime } from '../../../../../../utils/meetingTimer';
import { useSelector } from 'react-redux';

const Timer = () => {

    // const { startTimer } = useTimer()
    // const timeInSec = useSelector((state: any) => state.Main.timeInSec)
    const time = useSelector((state: any) => state.Main.time)

    // 
    return (
        <div className=' mr-2 text-[#ffffff]'>
            {/* {formatTime(timeInSec)} */}
            {time}
        </div>
    )
}

export default Timer