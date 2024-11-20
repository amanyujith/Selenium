import React, {useEffect, useRef} from "react";
import { useDispatch,  } from "react-redux";
import { actionCreators } from "../../../../../../store";

interface SingleOptionModalType {
  label : string;
  icon : any;
  onclick: any;
  button: any;
}

const SingleOptionModal = ({label , icon, onclick, button}: SingleOptionModalType) => {
  const dispatch = useDispatch()
  const divRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        divRef.current &&
        !divRef.current.contains(event.target as Node) &&
        !button.current.contains(event.target as Node)
      ) {
        // Clicked outside the picker, handle the event here
        dispatch(actionCreators.setNewChatOption(false))
        dispatch(actionCreators.setCreateGrpModal(false))
        dispatch(actionCreators.setCreateGrpOption(false))
        
      }
    };
    // Bind the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div ref={divRef} className="block relative ">
      <div className="absolute z-50 cursor-pointer ml-1 mt-[-15px] bg-[#FFFFFF] rounded-[4px] shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col">
        <div
          onClick={onclick}
          className="h-[32px] pt-3 w-[200px] flex flex-row px-4"
        >
          {icon}
          <span className="ml-4 text-primary-200 mt-[-6px]">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default SingleOptionModal;
