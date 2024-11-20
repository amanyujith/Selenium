import React, { memo, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actionCreators } from '../../../../store';

const Notification = () => {
    // 
    // const { page } = props
    const dispatch = useDispatch();
    const notification = useSelector((state: any) => state.Main.meetingNotifications)

    const removeAfterTimeOut = (notificationInfo: any, time: any) => {
        setTimeout(() => {
            dispatch(actionCreators.removeNotification(notificationInfo.id))

        }, time)
    }

    let notificationInfo = notification[0];

    if (notificationInfo) {
        removeAfterTimeOut(notificationInfo, 4000);
    }

    return (
        <>
            {
                notificationInfo ?
                    <div className=' z-10 h-9 absolute top-20 left-10 pl-2.5 py-2.5 pr-5 flex items-center box-border border-[1px] rounded-[3px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] border-[rgba(255, 255, 255, 0.12)] bg-[#000000]'>
                        {
                            notificationInfo.type === 'error' ?
                                <span className=' text-[#F75E1D]'>{notificationInfo.message}</span>
                                : <span className=' text-[#B6B860]'>{notificationInfo.message}</span>
                        }
                    </div>
                    : null
            }
        </>
    )
}

export default memo(Notification)