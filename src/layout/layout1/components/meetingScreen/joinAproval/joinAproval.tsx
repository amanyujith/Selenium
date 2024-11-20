import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actionCreators } from '../../../../../store';
import { t } from 'i18next';

const JoinAproval = () => {

    const dispatch = useDispatch()
    const waitingList = useSelector((state: any) => state.Main.waitingList);
    const meetingSession = useSelector((state: any) => state.Main.meetingSession);
    const [waitingListParticipants, setWaitingListParticipants] = useState([""]);

    useEffect(() => {
        const participants = waitingList.map((participant: any) => {
            return participant.transaction_id
        })
        setWaitingListParticipants(participants)

    }, [waitingList])

    const handleWaitingList = (participantId: string[], allow: boolean) => {
        meetingSession.hostAllowParticipants(participantId, allow)
        dispatch(actionCreators.updateWaitingList(participantId))
    }

    return (


        <div className='w-[410px] h-[166px] border border-solid border-[rgba(255, 255, 255, 0.12)] box-border rounded-[3px] pt-[14px] pr-[7px] absolute left-10 top-2 z-10 bg-primary-500'>
            <div className=' flex justify-between px-5 pt-2 pb-3'>
                <h4 className='text-[16px] leading-5 text-[#ffffff]'>{t("Meeting.MembersWaitingToJoin")}</h4>
                <div    
                    id='allowAll'
                    onClick={() => handleWaitingList(waitingListParticipants, true)}
                    className='text-[16px] leading-5 cursor-pointer text-[#05AF05]'
                >
                    {t("Meeting.AllowAll")}
                </div>
            </div>
            <div className='px-[6px] h-24 overflow-auto'>

                {
                    waitingList?.map((participant: any) => {
                        return (
                            <div key={participant.participant_id} className='pl-5 py-2 flex justify-between group hover:bg-opacity-10 hover:bg-[#ffffff]'>
                                <span className='text-[16px] leading-5 text-[#ffffff]'>{participant.name}</span>
                                <div className='invisible group-hover:visible'>
                                    <span   
                                        id='deny'
                                        onClick={() => !participant.loader && handleWaitingList([participant.transaction_id], false)}
                                        className={` ${participant.loader ? "text-[#6b7b77] cursor-progress" : "cursor-pointer text-[red]"} text-[16px] leading-5 mr-4 cursor-pointer text-[red]`}
                                    >
                                       {t("Deny")}
                                    </span>
                                    <span
                                        id='allow'
                                        onClick={() => !participant.loader && handleWaitingList([participant.transaction_id], true)}
                                        className={` ${participant.loader ? "text-[#6b7b77] cursor-progress" : "cursor-pointer text-[#05AF05]"} text-[16px] leading-5 mr-2 `}
                                    >
                                        {t("Allow")}
                                    </span>
                                </div>
                            </div>

                        )
                    })
                }
            </div>

        </div >


    )
}

export default JoinAproval