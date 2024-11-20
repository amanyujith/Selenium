import  {useEffect, useRef} from "react";
import { useDispatch, useSelector,  } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ListItemButton from '../../../../../atom/ListItemButton/listItemButton';
import { actionCreators } from '../../../../../store';
import path from "../../../../../navigation/routes.path";
import LocalDb from '../../../../../dbServices/dbServices';
import { t } from "i18next";

interface MeetingMenuType {
  color: string,
  dashboard: boolean,
  restClass?: any,
  rest?: any,
  setOpenTodayMeeting?: any,
  setProfileSettingsClick?: any,

}

const StartMeetingMenu = ({ color, dashboard, restClass, setOpenTodayMeeting, setProfileSettingsClick, ...rest }: MeetingMenuType) => {

  const deviceDB = LocalDb.loadLocalDB('hoolvaUser', "UserData", 2);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);


  const handleClick = (type: any) => {
    if (type == "START") {
      dispatch(actionCreators.createMeetingState(true))
      LocalDb.set(deviceDB, "UserData", "createState", true)
      window.open(path.JOIN, "_blank");
    }
    else {
      // navigate(path.SCHEDULE)
      dispatch(actionCreators.setMeetingType(type))
      setOpenTodayMeeting(true)
      setProfileSettingsClick(false)
    }
  }

  const handleMeetingClick = () => {
    dispatch(actionCreators.setEditScheduleMeet(false))
    dispatch(actionCreators.setSingleRecurrenceScheduleMeet(false))
    dispatch(actionCreators.setAllRecurrenceScheduleMeet(false))
    navigate(path.SCHEDULEMEETING)
  }




  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        // Clicked outside the picker, handle the event here
        dispatch(actionCreators.setPopUp("closeAll"));
        
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
    // <div className='  pt-[1px] pr-[5px] pb-2.5 pl-2.5 absolute right-[50px] bg-[#FFFFFF] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-2xl z-50'>


    <div ref={divRef} className={` z-[555555] w-fit px-2 pt-1 h-[85px] absolute shadow-[0px_2px_4px_rgba(0,0,0,0.25)]  rounded-[4px_4px_4px_4px] bg-${color} ${restClass}`} >
      {/* <div className={`z-[555555] w-[186px] h-[190px] absolute shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded-[4px_4px_4px_4px] bg-${color} ${restClass}`}> */}
      <div className=' top-[0px] w-fit relative'>

        {/* 
        <Link to="meeting">
          <ListItemButton id='startMeeting' onClick={() => handleClick("ROUND")} color={color} textColor={dashboard ? '[#000000]' : '[#ffffff]'}>

            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="mr-2"
            >
              <path d="M9 12.375C10.864 12.375 12.375 10.864 12.375 9V3.375C12.375 1.51102 10.864 0 9 0C7.13602 0 5.625 1.51102 5.625 3.375V9C5.625 10.864 7.13602 12.375 9 12.375ZM14.625 6.75H14.0625C13.7517 6.75 13.5 7.00172 13.5 7.3125V9C13.5 11.6297 11.2328 13.7398 8.55035 13.4782C6.21246 13.25 4.5 11.1484 4.5 8.79961V7.3125C4.5 7.00172 4.24828 6.75 3.9375 6.75H3.375C3.06422 6.75 2.8125 7.00172 2.8125 7.3125V8.72437C2.8125 11.8758 5.06145 14.6851 8.15625 15.1119V16.3125H6.1875C5.87672 16.3125 5.625 16.5642 5.625 16.875V17.4375C5.625 17.7483 5.87672 18 6.1875 18H11.8125C12.1233 18 12.375 17.7483 12.375 17.4375V16.875C12.375 16.5642 12.1233 16.3125 11.8125 16.3125H9.84375V15.1253C12.857 14.7118 15.1875 12.1254 15.1875 9V7.3125C15.1875 7.00172 14.9358 6.75 14.625 6.75Z" fill="#A7A9AB" />
            </svg>
            Audio Round Table
          </ListItemButton>
        </Link> */}




        <div className='cursor-pointer bg-sky-500 hover:bg-sky-700 relative'>
          <ListItemButton id='startMeeting' onClick={() => handleMeetingClick()} color={color} textColor={dashboard ? '[#000000]' : '[#FFFFFF]'} >
            <svg
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              className="mr-2.5 "
            >
              <path
                d="M0 14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V6H0V14.5ZM10 8.375C10 8.16875 10.1687 8 10.375 8H11.625C11.8313 8 12 8.16875 12 8.375V9.625C12 9.83125 11.8313 10 11.625 10H10.375C10.1687 10 10 9.83125 10 9.625V8.375ZM10 12.375C10 12.1687 10.1687 12 10.375 12H11.625C11.8313 12 12 12.1687 12 12.375V13.625C12 13.8313 11.8313 14 11.625 14H10.375C10.1687 14 10 13.8313 10 13.625V12.375ZM6 8.375C6 8.16875 6.16875 8 6.375 8H7.625C7.83125 8 8 8.16875 8 8.375V9.625C8 9.83125 7.83125 10 7.625 10H6.375C6.16875 10 6 9.83125 6 9.625V8.375ZM6 12.375C6 12.1687 6.16875 12 6.375 12H7.625C7.83125 12 8 12.1687 8 12.375V13.625C8 13.8313 7.83125 14 7.625 14H6.375C6.16875 14 6 13.8313 6 13.625V12.375ZM2 8.375C2 8.16875 2.16875 8 2.375 8H3.625C3.83125 8 4 8.16875 4 8.375V9.625C4 9.83125 3.83125 10 3.625 10H2.375C2.16875 10 2 9.83125 2 9.625V8.375ZM2 12.375C2 12.1687 2.16875 12 2.375 12H3.625C3.83125 12 4 12.1687 4 12.375V13.625C4 13.8313 3.83125 14 3.625 14H2.375C2.16875 14 2 13.8313 2 13.625V12.375ZM12.5 2H11V0.5C11 0.225 10.775 0 10.5 0H9.5C9.225 0 9 0.225 9 0.5V2H5V0.5C5 0.225 4.775 0 4.5 0H3.5C3.225 0 3 0.225 3 0.5V2H1.5C0.671875 2 0 2.67188 0 3.5V5H14V3.5C14 2.67188 13.3281 2 12.5 2Z"
                fill="#A7A9AB"
              />
            </svg>
            {t("Schedule")}
          </ListItemButton></div>



        <ListItemButton id='startMeeting' onClick={() => handleClick("START")} color={color} textColor={dashboard ? '[#000000]' : '[#ffffff]'}>
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            className="mr-2.5 "
          >
            <path
              d="M9.33889 0.666016H1.32778C0.594444 0.666016 0 1.26046 0 1.99379V10.0049C0 10.7382 0.594444 11.3327 1.32778 11.3327H9.33889C10.0722 11.3327 10.6667 10.7382 10.6667 10.0049V1.99379C10.6667 1.26046 10.0722 0.666016 9.33889 0.666016ZM14.6 1.71324L11.5556 3.81324V8.18546L14.6 10.2827C15.1889 10.6882 16 10.2743 16 9.56602V2.4299C16 1.72435 15.1917 1.30768 14.6 1.71324Z"
              fill="#A7A9AB"
            />
          </svg>
          {t("StartNow")}
        </ListItemButton>


        {/* <Link to="meeting">

          <ListItemButton id='startMeeting' onClick={() => handleClick("WEBINAR")} color={color} textColor={dashboard ? '[#000000]' : '[#ffffff]'}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="mr-2.5 "
            >
              <path
                d="M10.7656 5C10.3125 2.20937 9.24375 0.25 8 0.25C6.75625 0.25 5.6875 2.20937 5.23438 5H10.7656ZM5 8C5 8.69375 5.0375 9.35938 5.10313 10H10.8938C10.9594 9.35938 10.9969 8.69375 10.9969 8C10.9969 7.30625 10.9594 6.64062 10.8938 6H5.10313C5.0375 6.64062 5 7.30625 5 8ZM15.1469 5C14.2531 2.87812 12.4438 1.2375 10.2094 0.575C10.9719 1.63125 11.4969 3.22187 11.7719 5H15.1469ZM5.7875 0.575C3.55625 1.2375 1.74375 2.87812 0.853125 5H4.22813C4.5 3.22187 5.025 1.63125 5.7875 0.575ZM15.4812 6H11.8969C11.9625 6.65625 12 7.32812 12 8C12 8.67188 11.9625 9.34375 11.8969 10H15.4781C15.65 9.35938 15.7469 8.69375 15.7469 8C15.7469 7.30625 15.65 6.64062 15.4812 6ZM4 8C4 7.32812 4.0375 6.65625 4.10313 6H0.51875C0.35 6.64062 0.25 7.30625 0.25 8C0.25 8.69375 0.35 9.35938 0.51875 10H4.1C4.0375 9.34375 4 8.67188 4 8ZM5.23438 11C5.6875 13.7906 6.75625 15.75 8 15.75C9.24375 15.75 10.3125 13.7906 10.7656 11H5.23438ZM10.2125 15.425C12.4437 14.7625 14.2562 13.1219 15.15 11H11.775C11.5 12.7781 10.975 14.3688 10.2125 15.425ZM0.853125 11C1.74688 13.1219 3.55625 14.7625 5.79063 15.425C5.02813 14.3688 4.50313 12.7781 4.22813 11H0.853125Z"
                fill="#A7A9AB"
              />
            </svg>
            Webinar
          </ListItemButton>
        </Link> */}



      </div>
    </div>
  )
}

export default StartMeetingMenu