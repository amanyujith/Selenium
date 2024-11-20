import { t } from 'i18next';
import React from 'react';

function Editmsgsendicon(props:any) {
    return (
      <div className="h-[30px] w-[79px] font-bold  bg-[#E57600] hover:bg-[#CC6900] text-[#FFFFFF] border-[1px] ml-[-36px] rounded-[7px]">
        <div className=" flex justify-center content-center mt-1 text-sm">
          {t("Chat.Update")}
        </div>
      </div>
    );
}

export default Editmsgsendicon;