import React from 'react';

interface TwoOptionModalType {
    option1?: any;
    option2?: any;
    svg1?:any;
    svg2:any;
    data?: any;
    onClick : ( buttonName: string, data ? : any) => void
  }
  
  const TwoOptionModal = ({
    option1,option2,svg1,svg2,  onClick, data
  }: TwoOptionModalType) => {

    return (
        <div>
            <div className={"pl-3 flex flex-col w-full z-10 h-[36px] "}>
        <div className={`flex flex-col w-full text-sm rounded-[3px]`}>
          <div className="h-[38px] flex flex-row cursor-pointer">
            {svg2}
            <div className="mt-2 ml-3 text-primary-200 text-sm" onClick={() => onClick(option1, data)}>{option1}</div>
          </div>
          <div className="h-[38px] flex flex-row cursor-pointer ">
            {svg1}
            < div className="mt-2 ml-3 text-primary-200 text-sm" onClick={() => onClick(option2, data)} >{option2}</div>
          </div>
        </div>
      </div>
        </div>
    );
}

export default TwoOptionModal;