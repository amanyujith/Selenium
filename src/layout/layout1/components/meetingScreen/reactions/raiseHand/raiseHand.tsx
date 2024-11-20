import React, { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const RaiseHand = () => {
    const participantList = useSelector((state: any) => state.Main.participantList)
    const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
    // const participantRaiseHandState = useSelector((state: any) => state.Main.participantRaiseHandState)
    const meetingSession = useSelector((state: any) => state.Main.meetingSession)
    const [selfTileData, setSelfTileData] = useState<any>(participantList[selfTileIndex])
    const handleRaiseHand = (raise: boolean) => {
        meetingSession.raiseHandAction(!raise)
    }

    return (
        <div onClick={() => handleRaiseHand(selfTileData?.raiseHand)} className=' cursor-pointer border-r-2 border-opacity-20 pr-2 mr-2 border-[#ffffff]'>
            {selfTileData?.raiseHand ?
                <span className=' text-2xl'>✊</span>
                :
                <span className=' text-2xl'>🤚</span>
            }
        </div>
    )
}

export default memo(RaiseHand)