import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const DialIn = () => {
  const meetingSession = useSelector((state: any) => state.Main.meetingSession);
  const meetingInfo = useSelector((state: any) => state.Main.meetingInfo)
  const [country, setCountry]: any = useState('India');
  const [dialIn, setDialIn]: any = useState([]);

  useEffect(() => {
    meetingSession.dialIn().then((res: any) => {
      setDialIn(res);
      
    });
  }, []);
  

  const handleSelect = (event: any) => {
    setCountry(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex mt-5 h-[206px]">
        <div className="text-left">
          <select
            className="text-primary-200 border rounded-[3px]  focus:outline-none bg-[#ffffff] w-[271px] h-9 "
            value={country}
            onChange={handleSelect}
          >
            {dialIn.map((data: any) => {
              return <option value={data.country}>{data.country}</option>
            })}
          </select>
        </div>
        <div className="flex flex-col ml-2 justify-items-start">
          <div className="flex p-1">
            <h3 className="pr-5">{t("MeetingID")}</h3> <span>{meetingInfo.meetingId}</span>
          </div>
          <div className="flex p-1">
            <h3 className="pr-5">{t("Dial.PassCode")}</h3> <span>{meetingInfo.pin}</span>
          </div>
          <div className="flex flex-col p-1 items-start">
            <h3>{t("Dial.DialByYourLocation")}</h3>
            {dialIn
              ?.filter((data: any) => data.country === country)
              ?.map((dialdata: any) => {
                return (
                  <span>
                    {dialdata.did} {dialdata.country}
                  </span>
                )
              })}
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse items-end">
        <button className="h-[32px] w-[178px] mr-1 bg-primary-200 text-[#FFFFFF] rounded-[3px] ml-3 mt-3">
        {t("Dial.JoinMeeting")}
        </button>
      </div>
    </div>
  )
};

export default DialIn;
