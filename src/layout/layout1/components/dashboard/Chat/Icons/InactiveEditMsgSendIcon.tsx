import { t } from 'i18next';
import React from 'react';

function InactiveEditMsgSendIcon(props:any) {
    return (
        <div className='h-[30px] w-[79px] bg-[#FFFFFF] text-primary-100 border-[1px]  ml-[-36px] border-[#F4F4F4]'>
            <div className=' flex justify-center content-center text-sm mt-1'>
                {t("Chat.Update")}
            </div>
            
        </div>
    );
}

export default InactiveEditMsgSendIcon;