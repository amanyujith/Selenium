import { t } from "i18next"
import { useEffect, useState } from "react"

const ScheduleTimer = (props:{start_date_time:number})=>{
const [time,setTime]= useState(Math.floor(
    (new Date(
      props.start_date_time
    ).getTime() -
    Math.floor(new Date().getTime() / 1000)) /
      60
  ))
const [timerHandler,setTimerHandler]= useState<any>(0)

const handleTimer= () =>{
    const interval =  setInterval(() => {
            setTime(Math.floor(
                (new Date(
                  props.start_date_time
                ).getTime() -
                Math.floor(new Date().getTime() / 1000)) /
                  60
              ))
        }, 60000)
        setTimerHandler(interval)
}

useEffect(()=>{
    handleTimer()
    return()=>{
        clearInterval(timerHandler)
    }
},[])


if(time>=0){
  return(
    <div>
    {t("Dashboard.StartsIn")}
    &nbsp;
    {time}
    &nbsp;
    {t("Dashboard.Minutes")}
  </div>
)
} else{
  return(
    <div>
   {t("Dashboard.MeetinginProgress")}
  </div>
)
}
}

export default ScheduleTimer