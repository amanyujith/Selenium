import {useMemo, useEffect} from 'react'


interface DividerProps {
    timestamp: number;
    dateNum : string; 
    addToDateSet : (dateNum : string) => void
  }
  
  const ChatDivider: React.FC<DividerProps> = ({ timestamp , dateNum, addToDateSet }: DividerProps) => {
    
    addToDateSet(dateNum)

    
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000); // 86400000 milliseconds = 1 day
    const messageDate = new Date(timestamp);
    const messageDateString = messageDate.toLocaleDateString();
  
    let dividerLabel: string;
  
    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      dividerLabel = 'Today';
    } else if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      dividerLabel = 'Yesterday';
    } else {
      dividerLabel = messageDateString;
    }

    

  
    return (
      <div id="Divider" className="flex flex-row pt-1">
      <hr className="w-full ml-[60px] mr-5 text-[#C4C4C4]"/>
      <div className=" pl-4 h-6 rounded-[50px] flex flex-row text-[#000000] mt-[-12px] text-xs min-w-[160px] w-fit pr-2 py-1">{dividerLabel}
      </div>
      <hr className=" w-full mr-[60px] ml-5 text-[#C4C4C4]"/>
      </div>
    );
  };


  export default ChatDivider