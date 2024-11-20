import React from 'react';
import CheckBox from '../../../../atom/CheckBox/checkBox';
import { t } from 'i18next';

const FeedbackQuestion = () => {
  return (
    <div className='flex text-left mt-6 justify-center'>
        <div>
            <p className=' text-[18px] leading-5 font-bold text-[rgb(64,64,65)]'>{t("Meeting.AudioIssues")}</p>
            <CheckBox color={''} 
                label={t("Meeting.IHeardEcho")}
                id={'echo'} 
                restClass={'w-[335px] border-[0.2px] rounded-[3px] py-2.5 px-1 mt-[15px] mr-[26px] border-[#C4C4C4]'}
            />
            <CheckBox color={''} 
                label={t("Meeting.ICouldntHearOneParticipant")}
                id={'mute'}
                restClass={'w-[335px] border-[0.2px] rounded-[3px] py-2.5 px-1 mt-[15px] mr-[26px] border-[#C4C4C4]'}
            />
        </div>
        <div>
            <p className=' text-[18px] leading-5 font-bold text-primary-200'>{t("Meeting.VideoIssues")}</p>
            <div>
                <CheckBox color={''} 
                    label={t("Meeting.VideoWasFrozen")}
                    id={'videoFrozen'}
                    restClass={'w-[335px] border-[0.2px] rounded-[3px] py-2.5 px-1 mt-[15px] mr-[26px] border-[#C4C4C4]'}
                />
                <CheckBox color={''} 
                    label={t("Meeting.Flickering")}
                    id={'videoFlickering'}
                    restClass={'w-[335px] border-[0.2px] rounded-[3px] py-2.5 px-1 mt-[15px] mr-[26px] border-[#C4C4C4]'}
                />
            </div>
        </div>
    </div>
  )
}

export default FeedbackQuestion