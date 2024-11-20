import InputFields from "../../../../../atom/InputField/inputField"
import CheckBox from "../../../../../atom/CheckBox/checkBox"
import RadioButton from "../../../../../atom/RadioButtons/radioButtons"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import { detect } from "detect-browser"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import moment from "moment"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import TimePicker from "rc-time-picker"
import "rc-time-picker/assets/index.css"
import "../../dashboard/Styles.css"
import { actionCreators } from "../../../../../store"
import Notification from "../Notification/Notification"
import { t } from "i18next"
import FadeIn from "react-fade-in/lib/FadeIn"
import CustomDropdown from "../../../../../atom/DropDown/customDropdown"

const ScheduleMeeting = (props: any) => {
  const { setActiveTab } = props
  const navigate = useNavigate()
  const browser = detect()
    const editMeetingData = useSelector(
    (state: any) => state.Main.scheduledMeetingInfo
  )
  const flagEditMeeting = useSelector(
    (state: any) => state.Flag.setEditScheduleState
  )
  const flagAllRecurrenceMeeting = useSelector(
    (state: any) => state.Flag.setAllRecurrenceScheduleState
  )
  const flagSingleRecurrenceMeeting = useSelector(
    (state: any) => state.Flag.setSingleRecurrenceScheduleState
  )
  const flagEditSingleRecMeet = useSelector(
    (state: any) => state.Flag.setEditSingleRecMeet
  )
  const selecteddate = useSelector((state: any) => state.Main.selectedDate)
  const flagSetEditSingleMeet = useSelector(
    (state: any) => state.Flag.setEditSingleMeet
  )
  const flagSetEditMeetTime = useSelector(
    (state: any) => state.Flag.setFlagEditMeetingTime
  )
  const progress = useSelector((state: any) => state.Flag.setProgress)

  const getCalenderDate = () => {
    let today = new Date()
    if (today >= selecteddate && flagSetEditMeetTime === false) {
      return today
    } else if (flagSetEditMeetTime === false) {
      return selecteddate
    } else {
      return new Date(editMeetingData.start_date_time * 1000)
    }
  }

  const getCalenderTime = () => {
    let today = moment()
    
    if (today >= selecteddate && flagSetEditMeetTime === false) {
      return moment().add(30, "minutes")
    } else if (flagSetEditMeetTime === false) {
      return moment().add(30, "minutes");
    } else {
      return moment(editMeetingData.start_date_time * 1000)
    }
  }

  const [times, setTimes] = React.useState("01")
  const [timeBox, setTimeBox] = useState(false);
  const [errorFlag, setErrorFlag] = useState(true)
  let flag = true
  const [timeChange, setTimeChange] = useState(false)
  const [expiryChange, setExpiryChange] = useState(false)
  let timeFlag = true
  const [checked, setChecked] = React.useState(false)
  const [dropDownValue, setDropDownValue] = useState("daily")
  
  
  const [readValues, setReadValues] = useState<any>({
    auto_record: false,
    dial_in: false,
    e2ee: false,
    expiry_date: null,
    join_mode: 'open',
    name: "Discussion",
    password: null,
    pin: null,
    record_mode: null,
    recurrence: false,
    recurrence_count: null,
    recurrence_date: null,
    recurrence_repeat: null,
    recurrence_type: null,
    recurrence_weekdays: null,
    start_date_time: null,
    // time_zone: moment.tz.guess(),
    time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    description: "",
    duration: null,
    recurrence_day: null,
  })

  const dispatch = useDispatch()
  const [dateReading, setDateReading] = useState<any>({
    daysCalender: new Date(),
    timeCalender: moment(),
  })

  const [durationReading, setDurationReading] = useState({
    hours: "01",
    minutes: "00",
  })

  const [expiryDates, setExpiryDates] = useState<any>()
  const [securityJoin, setSecurityJoin] = useState<any>("open");
  const [recordMode, setRecordMode] = useState<any>("host_with_others")
  const [occurrences, setOccurrences] = useState(7)
  const [radioDaily, setRadioDaily] = useState("endTime")
  const [radioMonthly, setRadioMonthly] = useState("DaysInMonth")
  const [occursMonth, setOccursMonth] = useState({
    firstMonth: "1",
    daysOfMonth: "sun",
  })

  const selectingMonth = [
    { name: "First", value: 1 },
    { name: "Second", value: 2 },
    { name: "Third", value: 3 },
    { name: "Fourth", value: 4 },
    { name: "Last", value: 5 },
  ]

  const recordList = [
    { label: "Host only", value: "host_only" },
    { label: "Host with others", value: "host_with_others" },
    { label: "Audio only", value: "audio_only" },
  ]

  const securityList = [
    { name: "Allow people to join before host", value: "open" },
    { name: "Allow people to join when host admits", value: "locked" },
    { name: "Allow people to join after host", value: "closed" },
  ];

  const selectingWeekInMonth = [
    { name: "Sunday", value: "sun" },
    { name: "Monday", value: "mon" },
    { name: "Tuesday", value: "tue" },
    { name: "Wednesday", value: "wed" },
    { name: "Thursday", value: "thu" },
    { name: "Friday", value: "fri" },
    { name: "Saturday", value: "sat" },
  ]

  

  const [webinarType, setWebinarType] = useState(false)
  const [roundType, setRoundType] = useState(false)
  const [firstCalender, setFirstCalender] = useState(false)
  const [secondCalender, setSecondCalender] = useState(false)

  const [newRecurrence, setNewRecurrence] = useState<any>({
    recurrence_repeat: 1,
    recurrence_type: "daily",
    recurrence_weekdays: [],
    recurrence_day: [],
    recurrence_date: 1,
  })

  const meetingType = useSelector((state: any) => state.Main.meetingType)

  const meetingSession = useSelector((state: any) => state.Main.meetingSession)

  const user = useSelector((state: any) => state.Main.meetingSession)

  const popUp = useSelector((state: any) => state.Flag.popUp)

  const handlePopUp = (
    event: any,
    type:
      | "meetingInfoFlag"
      | "endButtonFlag"
      | "moreOptionFlag"
      | "reactionFlag"
      | "meetingOpenFlag"
      | "profilerOpenFlag"
      | "calenderFlag"
      | "calenderFlag1"
      | "calenderFlag3"
      | "calenderFlag2"
      | "searchDropDown"
      | "closeAll"
  ) => {
    event.stopPropagation()
    dispatch(actionCreators.setPopUp(type))
  }

  const handleFirstCalender = () => {
    setFirstCalender(!firstCalender)
  }

  const handleSecondCalender = () => {
    setSecondCalender(!secondCalender)
  }

  const handleChange = (value: any, type: any) => {
    setChecked(!readValues.recurrence)
    let x: any = { ...readValues }
    x[type] = value
    setReadValues(x)
 
  }

  const checkedDatas = [
    {
      name: "No fixed time",
      value: "No fixed time",
    },
    {
      name: "daily",
      value: "daily",
    },
    {
      name: "weekly",
      value: "weekly",
    },
    {
      name: "monthly",
      value: "monthly",
    },
  ];

  const checkDates = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

  const handleDropdown = (value: any, type: any) => {
    setDropDownValue(value)
    // if(flagEditMeeting === true && value === undefined){
    //   value = newRecurrence.recurrence_type
    // }
    let x: any = { ...newRecurrence }
    x[type] = value
    setNewRecurrence(x)
  }

  const handleSecurity = (value: any) => {
    
    setSecurityJoin(value)
    let x: any = { ...readValues }
    x.join_mode = value
    setReadValues(x)
  }

  const handleRecordMode = (value: any) => {
    
    setRecordMode(value)
    let x: any = { ...readValues }
    x.record_mode = value
    setReadValues(x)
  }

  const handleDropdownDays = (value: any, type: any) => {
    // 
    // setDropDownValueDays(e)
    // setReadValues(e)

    
    const newvalue = 1
    if (value === 0) {
      value = newvalue
    }
    let x: any = { ...newRecurrence }
    x[type] = value
    setNewRecurrence(x)
  }

  const handleRadioDaily = (value: any) => {
    

    setRadioDaily(value)
  }

  const handleRadioMonthly = (value: any) => {
    setRadioMonthly(value)
  }

  const handleOnChangeRadioMonthly = (value: any, type: any) => {
    let x: any = { ...occursMonth }
    x[type] = value
    setOccursMonth(x)
  }

  const handleCheckbox = (event: any, type: any) => {
    

    if (event.target.checked === true) {
      let x: any = { ...newRecurrence }
      x.recurrence_weekdays.push(event.target.value)
      if (
        x.recurrence_weekdays[0] === "sun" &&
        x.recurrence_weekdays.length > 1
      ) {
        const temp = x.recurrence_weekdays[0]
        x.recurrence_weekdays[0] = x.recurrence_weekdays[1]
        x.recurrence_weekdays[1] = temp
        setNewRecurrence(x)
      }
      setNewRecurrence(x)
    } else {
      let x: any = { ...newRecurrence }
      const index = x.recurrence_weekdays.findIndex(
        (value: any) => value === event.target.value
      )
      x.recurrence_weekdays.splice(index, 1)
      setNewRecurrence(x)
    }
  }

  const handleTimesChange = (event: any) => {
    setTimes(event.target.value)
  }

  const AmPm = [
    { option: "AM", value: "am" },
    { option: "PM", value: "pm" },
  ]

  const [mins, setmins] = useState([])
  const [hrs, setHrs] = useState([])
  const [days, setDays] = useState([])
  const monthlyRepeat = [
    { name: 1, value: 1 },
    { name: 2, value: 2 },
    { name: 3, value: 3 },
    { name: 4, value: 4 },
  ];
  useEffect(() => {
    let a: any = [...mins]
    let b: any = [...hrs]
    let c: any = [...days]
    if (a.length === 0) {
      for (let i = 0; i < 60; i++) {
        if (i < 10) {
          if (i < 13) {
            b.push({ name: "0" + i, value: "0" + i });
          }

          a.push({ name: "0" + i, value: "0" + i })
        } else {
          if (i < 13) {
            b.push({ name: i, value: i });
          }

          a.push({ name: i, value: i });
        }
      }
    }
    if (c.length === 0) {
      for (let i = 1; i <= 31; i++) {
        c.push({ name: i, value: i})
        
      }
      // 
    }

    setmins(a)
    setHrs(b)
    setDays(c)
    
    
  }, [])

  

  const handleReadValues = (value: any, type: any) => {
    let x: any = { ...readValues }
    x[type] = value
    setReadValues(x)
  }

  const newhandleReadValuesExpiryDates = (value: any) => {
    setExpiryChange(true)
    setExpiryDates(value)
    
  }

  const handleReadValuesCalender = (value: any, type: any) => {
    // setFlag(false)
    if (type === "daysCalender") {
      dispatch(actionCreators.setFlagEditMeetingTime(false))
      dispatch(actionCreators.setSelectedDate(value))
      setTimeChange(true)
    }
    let x: any = { ...dateReading }
    x[type] = value
    
    setDateReading(x)
  }

  const handleOccurrences = (value: any) => {
    setOccurrences(value)
  }

  const handleReadValuesDuration = (value: any, type: any) => {
    let x: any = { ...durationReading }
    x[type] = value
    setDurationReading(x)

    
  }

  useEffect(() => {
    if (meetingType) {
      if (meetingType === "ROUND") {
        
        setRoundType(true)
        setWebinarType(false)
      } else if (meetingType === "WEBINAR") {
        setWebinarType(true)
      } else if (meetingType === "SCHEDULE") {
        setRoundType(false)
        setWebinarType(false)
      }
    }
    if (flagEditMeeting === false) {
      //setDropDownValue("daily")
      setDateReading({
        daysCalender: getCalenderDate(),
        timeCalender: getCalenderTime(),
      })
    }
    if (flagEditMeeting == true) {
      

      setDropDownValue(editMeetingData.recurrence_type)
      // }

      setReadValues({
        name: editMeetingData.name.trim(),
        password: editMeetingData.password,
        description: editMeetingData.notes,
        recurrence: editMeetingData.recurrence,
        join_mode: editMeetingData.join_mode,
      });

      let newhours = editMeetingData.duration / 3600
      let newminutes = editMeetingData.duration % 3600
      setDurationReading({
        hours:
          Math.floor(newhours).toString().length > 1
            ? Math.floor(newhours).toString()
            : "0" + Math.floor(newhours).toString(),
        minutes:
          newminutes.toString().length > 1
            ? newminutes.toString()
            : "0" + newminutes.toString(),
      })

      

      if (editMeetingData.recurrence_weekdays === null) {
        editMeetingData.recurrence_weekdays = []
      }

      setNewRecurrence({
        recurrence_type: editMeetingData.recurrence_type === "" ? "daily" : editMeetingData.recurrence_type,
        recurrence_date: editMeetingData.recurrence_date,
        recurrence_count: editMeetingData.recurrence_count,
        recurrence_repeat: editMeetingData.recurrence_repeat,
        recurrence_weekdays: editMeetingData.recurrence_weekdays,
        recurrence_day: editMeetingData.recurrence_day,
      })

      if (editMeetingData.recurrence_day && editMeetingData.recurrence_day.length !== 0){
        setRadioMonthly("weekInMonth");
        let temp = {
          firstMonth: editMeetingData?.recurrence_day[1],
          daysOfMonth: editMeetingData?.recurrence_day[0],
        };
        setOccursMonth(temp);
      }

      if (
        editMeetingData.recurrence_type === "open" &&
        editMeetingData.recurrence === true
      ) {
        setDropDownValue("No fixed time")
        editMeetingData.recurrence_type = "No fixed time"
        editMeetingData.start_date_time = Math.floor(
          moment().add(30, "minutes").valueOf() / 1000
        )
        editMeetingData.expiry_date = Math.floor(moment().valueOf() / 1000)
      }

      if (
        editMeetingData.expiry_date === null ||
        editMeetingData.expiry_date === ""
      ) {
        editMeetingData.expiry_date = Math.floor(moment().valueOf() / 1000)
      }

      setDateReading({
        daysCalender: new Date(editMeetingData.start_date_time * 1000),
        timeCalender: moment(editMeetingData.start_date_time * 1000),
      })

      setExpiryDates(new Date(editMeetingData.expiry_date * 1000))
    }
  }, [editMeetingData, flagEditMeeting])

  useEffect(() => {
    
    
    let x = { ...expiryDates }

    let y = expiryDates

    if (dropDownValue === "No fixed time") {
      y = new Date(getCalenderDate()).setDate(
        new Date(getCalenderDate()).getDate() + 7
      )
      

      if (
        flagEditMeeting === true &&
        editMeetingData.recurrence_count === null
      ) {
        setExpiryDates(new Date(editMeetingData.expiry_date * 1000))
      } else {
        setExpiryDates(y)
      }

      if (
        flagEditMeeting === true &&
        editMeetingData.recurrence_count !== null
      ) {
        setRadioDaily("occurrences")
        setOccurrences(editMeetingData.recurrence_count)
      } else {
        setOccurrences(7)
      }
    }
    if (dropDownValue === "daily") {
      y = new Date(getCalenderDate()).setDate(
        new Date(getCalenderDate()).getDate() + 7
      )
      
      if (
        flagEditMeeting === true &&
        editMeetingData.recurrence_count === null
      ) {
        setExpiryDates(new Date(editMeetingData.expiry_date * 1000))
      } else {
        setExpiryDates(y)
      }

      if (
        flagEditMeeting === true &&
        editMeetingData.recurrence_count !== null
      ) {
        setRadioDaily("occurrences")
        setOccurrences(editMeetingData.recurrence_count)
      } else {
        setOccurrences(7)
      }
    }
    if (dropDownValue === "weekly") {
      y = new Date(getCalenderDate()).setDate(
        new Date(getCalenderDate()).getDate() + 49
      )

      if (
        flagEditMeeting === true &&
        editMeetingData.recurrence_count === null
      ) {
        setExpiryDates(new Date(editMeetingData.expiry_date * 1000))
      } else {
        setExpiryDates(y)
      }

      if (
        flagEditMeeting === true &&
        editMeetingData.recurrence_count !== null
      ) {
        setRadioDaily("occurrences")
        setOccurrences(editMeetingData.recurrence_count)
      } else {
        setOccurrences(7)
      }
    }
    if (dropDownValue === "monthly") {
      // x.monthlyExpiry = new Date().setDate(new Date().getDate() + 90)
      // setExpiryDates(x)
      // 

      // y = new Date().setDate(new Date().getDate() + 90)
      y = new Date(getCalenderDate()).setDate(
        new Date(getCalenderDate()).getDate() + 90
      )

      if (
        flagEditMeeting === true &&
        editMeetingData.recurrence_count === null
      ) {
        setExpiryDates(new Date(editMeetingData.expiry_date * 1000))
      } else {
        setExpiryDates(y)
      }

      if (
        flagEditMeeting === true &&
        editMeetingData.recurrence_count !== null
      ) {
        setRadioDaily("occurrences")
        setOccurrences(editMeetingData.recurrence_count)
      } else {
        setOccurrences(7)
      }
    }
    // })
  }, [dropDownValue])


  const handleClick = async (event: any) => {
    const intRegex = /^[a-zA-Z' ]*$/
    
    Object.keys(readValues).forEach((node: any) => {
      if (node === "name" && readValues[node] == null) {
        flag = false
        setErrorFlag(false)
        dispatch(
          actionCreators.setNotification({
            content: t("Dashboard.TopicError"),
            type: "error",
          })
        );
      } else if (node === "name" && readValues[node]?.length > 100) {
        flag = false
        setErrorFlag(false)
        dispatch(
          actionCreators.setNotification({
            content: t("Dashboard.TopicMaxLenError"),
            type: "error",
          })
        );
      } else if (node === "description" && readValues[node]?.length > 255) {
        flag = false
        setErrorFlag(false)
        dispatch(
          actionCreators.setNotification({
            content: t("Dashboard.DiscriptionError"),
            type: "error",
          })
        );
      } else if (node === "name" && readValues[node]?.length <= 2) {
        flag = false
        setErrorFlag(false)
        dispatch(
          actionCreators.setNotification({
            content: t("Dashboard.TopicMinLenError"),
            type: "error",
          })
        );
        }else if (
          node === "password" &&
          readValues[node]?.length <= 3 &&
          readValues[node]?.length > 0
        ) {
          flag = false;
          setErrorFlag(false);
          dispatch(
            actionCreators.setNotification({
              content: "Password must be at least 4 characters",
              type: "error",
            })
          );
        } else if (node === "password" && readValues[node]?.length > 12) {
          flag = false;
          setErrorFlag(false);
          dispatch(
            actionCreators.setNotification({
              content: "Password must be at most 12 characters",
              type: "error",
            })
          );
        } else if (
          node === "name" &&
          intRegex.test(readValues[node]) == false
        ) {
          flag = false;
          setErrorFlag(false);
          dispatch(
            actionCreators.setNotification({
              content: t("Dashboard.TopicNumError"),
              type: "error",
            })
          );
        } else if (
          node === "name" &&
          readValues[node].toString().trim() === ""
        ) {
          flag = false;
          setErrorFlag(false);
          dispatch(
            actionCreators.setNotification({
              content: t("Dashboard.TopicBlankError"),
              type: "error",
            })
          );
        }
    })

    if (flag) {
      if (readValues.start_date_time == null || readValues.start_date_time) {
        let g = dateReading.timeCalender
        let times = moment(g).format("h:mm a")
        let days = moment(getCalenderDate(), "MM-DD-YYYY HH:mm:ss A").format(
          "MMMM DD YYYY"
        )
        const a = days + " " + times
        const dateTime = `${days} ${times}`
        readValues.start_date_time =
          new Date(dateTime.replace(/-/g, "/")).getTime() / 1000
       
      }

      let durationTime = 0
      if (durationReading.hours !== "" || durationReading.minutes !== "") {
        durationTime =
          +durationReading.hours * 60 * 60 + +durationReading.minutes * 60
      }
      readValues.duration = durationTime


      if (radioDaily == "endTime") {
        if (expiryDates) {
          //
          readValues.expiry_date = Math.floor(expiryDates / 1000)
        }
      }

      if (occurrences && radioDaily == "occurrences") {
        if (
          dropDownValue == "daily" ||
          newRecurrence.recurrence_type == "daily"
        ) {
          readValues.recurrence_count = +occurrences
          let occurrencesNew = +occurrences - 1
          let repeat = +newRecurrence.recurrence_repeat
          if (repeat === 0) {
            repeat = 1
          }
          readValues.expiry_date = new Date(dateReading.daysCalender).setDate(
            new Date(dateReading.daysCalender).getDate() +
              repeat * occurrencesNew
          )
          // readValues.expiry_date = readValues.expiry_date / 1000
          readValues.expiry_date = Math.floor(readValues.expiry_date / 1000)
        } else if (
          dropDownValue == "weekly" ||
          newRecurrence.recurrence_type == "weekly"
        ) {
          readValues.recurrence_count = +occurrences
          let occurrencesNew = +occurrences - 1
          // let repeat = + readValues.recurrence_repeat
          let repeat = +newRecurrence.recurrence_repeat
          if (repeat === 0) {
            repeat = 1
          }
          readValues.expiry_date = new Date(dateReading.daysCalender).setDate(
            new Date(dateReading.daysCalender).getDate() +
              repeat * occurrencesNew * 7
          )
          // readValues.expiry_date = readValues.expiry_date / 1000
          readValues.expiry_date = Math.floor(readValues.expiry_date / 1000)
        } else if (
          dropDownValue == "monthly" ||
          newRecurrence.recurrence_type == "monthly"
        ) {
          readValues.recurrence_count = +occurrences
          let occurrencesNew = +occurrences - 1
          // let repeat = + readValues.recurrence_repeat
          let repeat = +newRecurrence.recurrence_repeat
          if (repeat === 0) {
            repeat = 1
          }
          readValues.expiry_date = new Date(dateReading.daysCalender).setDate(
            new Date(dateReading.daysCalender).getDate() +
              repeat * occurrencesNew * 30
          )
          // readValues.expiry_date = readValues.expiry_date / 1000
          readValues.expiry_date = Math.floor(readValues.expiry_date / 1000)
        }
      }

      if (readValues.recurrence == true) {
        if (
          dropDownValue == "No fixed time" ||
          newRecurrence.recurrence_type == "No fixed time"
        ) {
          if (flagEditMeeting === true) {
            readValues.recurrence_type = newRecurrence.recurrence_type
          } else {
            newRecurrence.recurrence_type = "open"
            readValues.recurrence_type = newRecurrence.recurrence_type
          }
        }

        if (
          dropDownValue == "daily" ||
          newRecurrence.recurrence_type == "daily"
        ) {
          readValues.recurrence_repeat = +newRecurrence.recurrence_repeat
          if (+newRecurrence.recurrence_repeat === 0) {
            readValues.recurrence_repeat = 1
          }
          readValues.recurrence_type = newRecurrence.recurrence_type
        }
        if (
          dropDownValue == "weekly" ||
          newRecurrence.recurrence_type == "weekly"
        ) {
          readValues.recurrence_repeat = +newRecurrence.recurrence_repeat
          if (+newRecurrence.recurrence_repeat === 0) {
            readValues.recurrence_repeat = 1
          }
          readValues.recurrence_weekdays = newRecurrence.recurrence_weekdays
          readValues.recurrence_type = newRecurrence.recurrence_type
        }

        if (
          dropDownValue == "monthly" ||
          newRecurrence.recurrence_type == "monthly"
        ) {
          

          readValues.recurrence_repeat = +newRecurrence.recurrence_repeat
          if (+newRecurrence.recurrence_repeat === 0) {
            readValues.recurrence_repeat = 1
          }
          readValues.recurrence_type = newRecurrence.recurrence_type
          if (
            occursMonth.firstMonth &&
            occursMonth.daysOfMonth &&
            radioMonthly == "weekInMonth"
          ) {
            readValues.recurrence_day = [
              occursMonth.daysOfMonth,
              +occursMonth.firstMonth,
            ]
            // readValues.recurrence_day = occursMonth.daysOfMonth, +occursMonth.firstMonth
          } else {
            readValues.recurrence_date = +newRecurrence.recurrence_date
          }
        }
      }
      
      if (
        readValues.recurrence_type !== "open" &&
        readValues.recurrence !== "true"
      ) {
        if (readValues.start_date_time < Math.floor(Date.now() / 1000)) {
          timeFlag = false
           dispatch(
             actionCreators.setNotification({
               content: t("Dashboard.TimeError"),
               type: "error",
             })
           );
        }
      }

      if (
        readValues.recurrence_count !== null &&
        readValues.recurrence_count < 2
      ) {
        timeFlag = false
        dispatch(
          actionCreators.setNotification({
            content: t("Dashboard.OccurenceError"),
            type: "error",
          })
        );
      }

      if (
        dropDownValue == "weekly" &&
        newRecurrence.recurrence_weekdays == ""
      ) {
        timeFlag = false
        dispatch(
          actionCreators.setNotification({
            content: t("Dashboard.PleaseMarkDays"),
            type: "error",
          })
        );
      }

      if (flag === true && timeFlag !== false) {
        
        event.currentTarget.disabled = true
      }

      if (timeFlag) {

        if (flagAllRecurrenceMeeting == true) {
          if (readValues.recurrence_date === 0) {
            readValues.recurrence_date = 1
          }
          if (readValues.recurrence === false) {
            newRecurrence.recurrence_type = null
          }

          if (
            newRecurrence.recurrence_type === "daily" &&
            flagEditMeeting === false
          ) {
            readValues.expiry_date = readValues.expiry_date - 86400
          }

          if (
            readValues.recurrence_count !== null &&
            readValues.recurrence_count !== undefined
          ) {
            delete readValues.expiry_date;
            delete readValues.expiry_date_time;
          }

          console.log("wwwwwww1111111111");
          editMeetingData.name = readValues.name.trim();
          editMeetingData.password = readValues.password
          editMeetingData.notes = readValues.description
          editMeetingData.duration = readValues.duration
          editMeetingData.join_mode = readValues.join_mode
          editMeetingData.start_date_time = readValues.start_date_time
          editMeetingData.recurrence = readValues.recurrence
          editMeetingData.recurrence_type = newRecurrence.recurrence_type
          editMeetingData.recurrence_count = readValues.recurrence_count
          editMeetingData.recurrence_date = readValues.recurrence_date
          editMeetingData.recurrence_repeat = readValues.recurrence_repeat
          editMeetingData.recurrence_weekdays = readValues.recurrence_weekdays
          editMeetingData.recurrence_day = readValues.recurrence_day
          editMeetingData.expiry_date = readValues.expiry_date
          editMeetingData.expiry_date = readValues.expiry_date;
          editMeetingData.personal = false;


          if (editMeetingData.recurrence_type === "No fixed time") {
            editMeetingData.recurrence_type = "open"
          }
          if (
            editMeetingData.recurrence_type === "open" &&
            editMeetingData.recurrence === true
          ) {
            editMeetingData.start_date_time = null
            delete editMeetingData.expiry_date
          }

          if (
            editMeetingData.recurrence_count !== null &&
            editMeetingData.recurrence_count !== undefined
          ) {
            editMeetingData.expiry_date = null
            editMeetingData.expiry_date_time = null
          }

          
          console.log("wwwwwww1111111111");
          await user
            .UpdateMeeting(editMeetingData, editMeetingData.uuid)
            .then((res: any) => {
              dispatch(
                actionCreators.setNotification({
                  content: t("Dashboard.MeetingEditedMsg"),
                  type: "success",
                })
              );
            })
            .catch((e: any) => {
              dispatch(
                actionCreators.setNotification({
                  content: t("Dashboard.MeetingNotEditedMsg"),
                  type: "error",
                })
              );
            })
        } else if (
          flagSetEditSingleMeet === false &&
          readValues.recurrence === true &&
          flagSingleRecurrenceMeeting === true
        ) {
          

          if (newRecurrence.recurrence_type === "daily") {
            readValues.expiry_date = readValues.expiry_date - 86400
          }

          if (readValues.recurrence_date === 0) {
            readValues.recurrence_date = 1
          }

          editMeetingData.name = readValues.name.trim();
          editMeetingData.password = readValues.password
          editMeetingData.notes = readValues.description
          editMeetingData.duration = readValues.duration
          editMeetingData.join_mode = readValues.join_mode
          editMeetingData.start_date_time = readValues.start_date_time
          editMeetingData.recurrence = readValues.recurrence
          editMeetingData.recurrence_type = newRecurrence.recurrence_type
          editMeetingData.recurrence_count = readValues.recurrence_count
          editMeetingData.recurrence_date = readValues.recurrence_date
          editMeetingData.recurrence_repeat = readValues.recurrence_repeat
          editMeetingData.recurrence_weekdays = readValues.recurrence_weekdays
          editMeetingData.recurrence_day = readValues.recurrence_day
          editMeetingData.expiry_date = readValues.expiry_date
          editMeetingData.personal = false;
       

          if (editMeetingData.recurrence_type === "No fixed time") {
            
            editMeetingData.recurrence_type = "open"
          }

          if (
            editMeetingData.recurrence_count !== null &&
            editMeetingData.recurrence_count !== undefined
          ) {
            
            editMeetingData.expiry_date = null
            editMeetingData.expiry_date_time = null
          }

          if (
            editMeetingData.recurrence_type === "open" &&
            editMeetingData.recurrence === true
          ) {
            
            editMeetingData.start_date_time = null
            delete editMeetingData.expiry_date
          }

          let uuid = editMeetingData.meeting_uuid

          if (editMeetingData.meeting_uuid === undefined) {
            uuid = editMeetingData.uuid
          }
          console.log("wwwwwww2222222222");
          await user
            .UpdateMeeting(editMeetingData, uuid)
            .then((res: any) => {
              dispatch(
                actionCreators.setNotification({
                  content: t("Dashboard.MeetingEditedMsg"),
                  type: "success",
                })
              );
            })
            .catch((e: any) => {
              dispatch(
                actionCreators.setNotification({
                  content: t("Dashboard.MeetingNotEditedMsg"),
                  type: "error",
                })
              );
            })
        } else if (
          flagSingleRecurrenceMeeting === true &&
          readValues.recurrence === false
        ) {
          
     
          
          editMeetingData.name = readValues.name.trim();
          editMeetingData.personal = false;
          editMeetingData.password = readValues.password
          editMeetingData.notes = readValues.description
          editMeetingData.duration = readValues.duration
          editMeetingData.join_mode = readValues.join_mode
          editMeetingData.start_date_time = readValues.start_date_time
          editMeetingData.recurrence = readValues.recurrence
          editMeetingData.recurrence_type = newRecurrence.recurrence_type
          editMeetingData.recurrence_count = readValues.recurrence_count
          editMeetingData.recurrence_date = readValues.recurrence_date
          editMeetingData.recurrence_repeat = readValues.recurrence_repeat
          editMeetingData.recurrence_weekdays = readValues.recurrence_weekdays
          editMeetingData.recurrence_day = readValues.recurrence_day
          editMeetingData.expiry_date = readValues.expiry_date
          editMeetingData.end_date_time =
            readValues.start_date_time + readValues.duration

          if (editMeetingData.recurrence_type === "No fixed time") {
            editMeetingData.recurrence_type = "open"
          }

          if (
            editMeetingData.recurrence === false
          ) {
            editMeetingData.recurrence_type = "open";
          }

          if (
            editMeetingData.recurrence_type === "open" &&
            editMeetingData.recurrence === true
          ) {
            editMeetingData.start_date_time = null
            delete editMeetingData.expiry_date
          }

          if (
            editMeetingData.recurrence_count !== null &&
            editMeetingData.recurrence_count !== undefined
          ) {
            editMeetingData.expiry_date = null
            editMeetingData.expiry_date_time = null
          }

          let uuid = editMeetingData.meeting_uuid

          if (editMeetingData.meeting_uuid === undefined) {
            uuid = editMeetingData.uuid
          }
          console.log("wwwwwww3333333333");
          await user
            .UpdateMeeting(editMeetingData, uuid)
            .then((res: any) => {
               dispatch(
                actionCreators.setNotification({
                  content: t("Dashboard.MeetingEditedMsg"),
                  type: "success",
                })
              );
            })
            .catch((e: any) => {
              dispatch(
                actionCreators.setNotification({
                  content: t("Dashboard.MeetingNotEditedMsg"),
                  type: "error",
                })
              );
            })
        } else if (
          flagSingleRecurrenceMeeting == true &&
          readValues.recurrence === true
        ) {
          
          editMeetingData.personal = false;
          editMeetingData.name = readValues.name.trim();
          editMeetingData.password = readValues.password
          editMeetingData.notes = readValues.description
          editMeetingData.duration = readValues.duration
          editMeetingData.join_mode = readValues.join_mode
          editMeetingData.recurrence_date = readValues.recurrence_date
          editMeetingData.start_date_time = readValues.start_date_time
          editMeetingData.end_date_time =
            readValues.start_date_time + readValues.duration

          if (editMeetingData.recurrence_type === "No fixed time") {
            editMeetingData.recurrence_type = "open"
          }
          if (
            editMeetingData.recurrence_type === "open" &&
            editMeetingData.recurrence === true
          ) {
            editMeetingData.start_date_time = null
            delete editMeetingData.expiry_date
          }
          if (
            editMeetingData.recurrence_count !== null &&
            editMeetingData.recurrence_count !== undefined
          ) {
            editMeetingData.expiry_date = null
            editMeetingData.expiry_date_time = null
          }
          console.log("wwwwww444444444444");
          await user
            .UpdateScheduleMeeting(editMeetingData, editMeetingData.uuid)
            .then((res: any) => {
              dispatch(
                actionCreators.setNotification({
                  content: t("Dashboard.MeetingEditedMsg"),
                  type: "success",
                })
              );
            })
            .catch((e: any) => {
              dispatch(
                actionCreators.setNotification({
                  content: t("Dashboard.MeetingNotEditedMsg"),
                  type: "error",
                })
              );
            })
        } else {
          if (
            readValues.recurrence_count !== null &&
            editMeetingData.recurrence_count !== undefined
          ) {
            editMeetingData.expiry_date = null
            editMeetingData.expiry_date_time = null
          }

          if (readValues.recurrence_type === "No fixed time") {
            readValues.recurrence_type = "open"
          }

          if (
            readValues.recurrence_type === "open" &&
            readValues.recurrence === true
          ) {
            
            readValues.start_date_time = null
            delete readValues.expiry_date
          }
          console.log("wwwwwww555555555");
          await user
            .scheduledMeetingCreate(readValues)
            .then((res: any) => {
              dispatch(
                actionCreators.setNotification({
                  content: "Your meeting scheduled successfully!",
                  type: "success",
                })
              );
              hostMail(res.uuid, readValues.recurrence)
            })
            .catch((e: any) => {
              dispatch(
                actionCreators.setNotification({
                  content: "Your meeting schedule failed!",
                  type: "error",
                })
              );
            })
        }
        setTimeChange(false)
        setExpiryChange(false)
        dispatch(actionCreators.setProgress(false))
        dispatch(actionCreators.setMeetingModal(false));
        dispatch(actionCreators.setSelectedDate(new Date()));
        setActiveTab(0)
      }
    }
  }

  const hostMail = async (uuid: any, rec: any) => {
    if (rec === true) {
      await meetingSession.sendCalendarMeetingInvite(uuid).then((res: any) => {
        
      })
    } else {
      await meetingSession
        .sendCalendarScheduleMeeting(uuid)
        .then((res: any) => {
          
        })
    }
  }

  return (
    <div
      id="scheduleMeetingComponent"
      onClick={() => setTimeBox(false)}
      className="h-[calc(100vh-122px)] relative  py-[40px] px-[50px] overflow-y-scroll overflow-x-hidden"
    >
      <FadeIn>
        <div className="flex flex-col">
          <div className="flex flex-row text-[#293241]">
            <div className="w-1/4 font-semibold p-4">Meeting</div>
            <div className="w-1/4 flex flex-col gap-52 ">
              <div className=" p-4">General</div>
              <div className=" p-4">Schedule</div>
            </div>
            <div className="w-2/4 flex flex-col gap-4 p-4">
              <InputFields
                id="topic"
                label={"Topic"}
                name={"myMeeting"}
                autoFocus={true}
                value={readValues.name}
                flagSetEditSingleMeet={flagSetEditSingleMeet}
                flagSingleRecurrenceMeeting={flagSingleRecurrenceMeeting}
                onProgress={progress}
                onChange={(e: any) => handleReadValues(e.target.value, "name")}
                restClass={`w-full border-[#B1B1B1] text-[#293241] rounded-[7px] border-[1px] focus:border-[#B1B1B1]`}
              />
              <textarea
                id="descriptionMeeting"
                className={`h-28 resize-none text-[#293241] w-full border-[1px] border-solid rounded-[7px] box-border border-[#C4C4C4] px-3 py-3 pt-[10px]`}
                placeholder={t("Dashboard.EnterDescription")}
                name={"Description"}
                disabled={
                  (flagSingleRecurrenceMeeting === true &&
                    flagSetEditSingleMeet === true) ||
                  progress === true
                    ? true
                    : false
                }
                value={readValues.description}
                onChange={(e: any) =>
                  handleReadValues(e.target.value, "description")
                }
              />
              <InputFields
                id="meetingPassword"
                label={"Password (Optional)"}
                name={"password"}
                value={readValues.password}
                flagSetEditSingleMeet={flagSetEditSingleMeet}
                flagSingleRecurrenceMeeting={flagSingleRecurrenceMeeting}
                onProgress={progress}
                onChange={(e: any) =>
                  handleReadValues(e.target.value, "password")
                }
                restClass={`w-full text-[#293241] border-[#B1B1B1] rounded-[7px] border-[1px] focus:border-[#B1B1B1]`}
              />

              {(dropDownValue !== "No fixed time" ||
                readValues.recurrence !== true) && (
                <div className="flex mt-3 w-full  ">
                  <div className="rounded-[7px] border-[1px] min-w-[50%] border-[#B1B1B1] py-2 pl-6 pr-1 outline-none flex justify-between">
                    <DatePicker
                      id="daysCalenderMeet"
                      className="w-full min-w-[50%] outline-none text-[#293241]"
                      open={firstCalender}
                      onClickOutside={() => setFirstCalender(false)}
                      readOnly
                      dateFormat={"MM/dd/yyyy"}
                      minDate={new Date()}
                      selected={dateReading.daysCalender}
                      onChange={(e: any) =>
                        handleReadValuesCalender(e, "daysCalender")
                      }
                      placeholderText=""
                    />
                    <svg
                      id="handleFirstCalenderMeet"
                      width="20"
                      height="20"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-4 cursor-pointer"
                      onClick={() => handleFirstCalender()}
                    >
                      <path
                        d="M6.10714 1.5C6.64051 1.5 7.07143 1.93092 7.07143 2.46429V3.42857H10.9286V2.46429C10.9286 1.93092 11.3595 1.5 11.8929 1.5C12.4262 1.5 12.8571 1.93092 12.8571 2.46429V3.42857H14.3036C15.1021 3.42857 15.75 4.07645 15.75 4.875V6.32143H2.25V4.875C2.25 4.07645 2.89788 3.42857 3.69643 3.42857H5.14286V2.46429C5.14286 1.93092 5.57377 1.5 6.10714 1.5ZM2.25 7.28571H15.75V15.4821C15.75 16.2807 15.1021 16.9286 14.3036 16.9286H3.69643C2.89788 16.9286 2.25 16.2807 2.25 15.4821V7.28571ZM4.17857 9.69643V10.6607C4.17857 10.9259 4.39554 11.1429 4.66071 11.1429H5.625C5.89018 11.1429 6.10714 10.9259 6.10714 10.6607V9.69643C6.10714 9.43125 5.89018 9.21429 5.625 9.21429H4.66071C4.39554 9.21429 4.17857 9.43125 4.17857 9.69643ZM8.03571 9.69643V10.6607C8.03571 10.9259 8.25268 11.1429 8.51786 11.1429H9.48214C9.74732 11.1429 9.96429 10.9259 9.96429 10.6607V9.69643C9.96429 9.43125 9.74732 9.21429 9.48214 9.21429H8.51786C8.25268 9.21429 8.03571 9.43125 8.03571 9.69643ZM12.375 9.21429C12.1098 9.21429 11.8929 9.43125 11.8929 9.69643V10.6607C11.8929 10.9259 12.1098 11.1429 12.375 11.1429H13.3393C13.6045 11.1429 13.8214 10.9259 13.8214 10.6607V9.69643C13.8214 9.43125 13.6045 9.21429 13.3393 9.21429H12.375ZM4.17857 13.5536V14.5179C4.17857 14.783 4.39554 15 4.66071 15H5.625C5.89018 15 6.10714 14.783 6.10714 14.5179V13.5536C6.10714 13.2884 5.89018 13.0714 5.625 13.0714H4.66071C4.39554 13.0714 4.17857 13.2884 4.17857 13.5536ZM8.51786 13.0714C8.25268 13.0714 8.03571 13.2884 8.03571 13.5536V14.5179C8.03571 14.783 8.25268 15 8.51786 15H9.48214C9.74732 15 9.96429 14.783 9.96429 14.5179V13.5536C9.96429 13.2884 9.74732 13.0714 9.48214 13.0714H8.51786ZM11.8929 13.5536V14.5179C11.8929 14.783 12.1098 15 12.375 15H13.3393C13.6045 15 13.8214 14.783 13.8214 14.5179V13.5536C13.8214 13.2884 13.6045 13.0714 13.3393 13.0714H12.375C12.1098 13.0714 11.8929 13.2884 11.8929 13.5536Z"
                        fill="#5C6779"
                      />
                    </svg>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div
                    onClick={(e: any) => e.stopPropagation()}
                    className="flex flex-row items-center min-w-[30%] mr-[-18px] rounded-[7px] border-[1px] border-[#B1B1B1] h-[42px] text-[16px] text-center text-[#293241]"
                  >
                    <TimePicker
                      id="timeCalender"
                      className=""
                      value={dateReading.timeCalender}
                      onChange={(e: any) =>
                        handleReadValuesCalender(e, "timeCalender")
                      }
                      open={timeBox}
                      showSecond={false}
                      use12Hours
                    />
                    <svg
                      id="setTime"
                      onClick={(e: any) => {
                        setTimeBox(!timeBox);
                        e.stopPropagation();
                      }}
                      className="mr-3 cursor-pointer"
                      width="20"
                      height="20"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9C15.75 10.7902 15.0388 12.5071 13.773 13.773C12.5071 15.0388 10.7902 15.75 9 15.75C7.20979 15.75 5.4929 15.0388 4.22703 13.773C2.96116 12.5071 2.25 10.7902 2.25 9C2.25 7.20979 2.96116 5.4929 4.22703 4.22703C5.4929 2.96116 7.20979 2.25 9 2.25ZM8.36719 5.41406V9C8.36719 9.21094 8.47266 9.40869 8.64932 9.52734L11.1806 11.2148C11.4706 11.41 11.8635 11.3309 12.0586 11.0382C12.2537 10.7455 12.1746 10.3553 11.8819 10.1602L9.63281 8.6625V5.41406C9.63281 5.06338 9.35068 4.78125 9 4.78125C8.64932 4.78125 8.36719 5.06338 8.36719 5.41406Z"
                        fill="#5C6779"
                      />
                    </svg>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                </div>
              )}

              <div>
                <div className="flex flex-row">
                  <CheckBox
                    checked={readValues.recurrence}
                    value={readValues.recurrence}
                    onChange={(e: any) =>
                      handleChange(e.target.checked, "recurrence")
                    }
                    color={""}
                    label={t("Dashboard.RecurringMeeting")}
                    id={"recurringMeeting"}
                    restClass={
                      "mt-2 -ml-2 rounded-[5px] text-primary-200 shrink-0 w-2/5"
                    }
                    flagSetEditSingleMeet={flagSetEditSingleMeet}
                    flagSingleRecurrenceMeeting={flagSingleRecurrenceMeeting}
                    onProgress={progress}
                  />
                  {console.log(
                    newRecurrence,
                    editMeetingData,
                    "newRecurrence.recurrence_type"
                  )}
                  {readValues.recurrence &&
                  flagEditSingleRecMeet === false &&
                  progress === false ? (
                    <div className="w-3/5 ml-2 text-[#293241]">
                      <CustomDropdown
                        id="recurrence_type"
                        options={checkedDatas}
                        value={newRecurrence.recurrence_type}
                        rest={"text-[#293241]"}
                        restClass={"text-[#293241]"}
                        onChange={(e: any) =>
                          handleDropdown(e, "recurrence_type")
                        }
                      />
                    </div>
                  ) : null}
                </div>

                {readValues.recurrence &&
                flagEditSingleRecMeet === false &&
                progress === false ? (
                  <div>
                    {(dropDownValue === "open" ||
                      dropDownValue === "No fixed time") &&
                    (newRecurrence.recurrence_type === "No fixed time" ||
                      newRecurrence.recurrence_type === "open") ? null : (
                      <div>
                        <div className="mt-8 relative items-center">
                          <div className="flex flex-row items-center w-full">
                            <p className="w-2/5 text-[16px] text-primary-200">
                              {t("Dashboard.RepeatEvery")}
                            </p>
                            <div className="w-3/5 gap-3 flex items-center ">
                              <CustomDropdown
                                id="recurrence_repeat"
                                options={
                                  dropDownValue !== "monthly" ||
                                  newRecurrence.recurrence_type !== "monthly"
                                    ? days
                                    : monthlyRepeat
                                }
                                value={newRecurrence.recurrence_repeat}
                                rest={"text-[#293241] w-full"}
                                restClass={"text-[#293241] w-full"}
                                onChange={(e: any) =>
                                  handleDropdownDays(e, "recurrence_repeat")
                                }
                              />
                              <div className=" self-center">
                                {dropDownValue === "daily" ||
                                newRecurrence.recurrence_type === "daily" ? (
                                  <p className="text-[16px] relative text-primary-200">
                                    {t("Dashboard.Day")}
                                  </p>
                                ) : dropDownValue === "weekly" ||
                                  newRecurrence.recurrence_type === "weekly" ? (
                                  <p className="text-[16px] relative text-primary-200">
                                    {t("Dashboard.Week")}
                                  </p>
                                ) : dropDownValue === "monthly" ||
                                  newRecurrence.recurrence_type ===
                                    "monthly" ? (
                                  <p className="text-[16px] relative text-primary-200">
                                    {t("Dashboard.Month")}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div>
                            {dropDownValue === "weekly" ||
                            newRecurrence.recurrence_type === "weekly" ? (
                              <div className="flex flex-row items-center w-full mt-7">
                                <p className="w-2/5 text-[16px] text-primary-200">
                                  {t("Dashboard.OccursOn")}
                                </p>
                                <div className="w-3/5 flex flex-row flex-wrap items-center gap-2 justify-start">
                                  {checkDates.map((dates: any) => {
                                    return (
                                      <div className="w-[40px]">
                                        <CheckBox
                                          color={""}
                                          label={dates}
                                          id={"dates"}
                                          restClass={""}
                                          checked={
                                            newRecurrence.recurrence_weekdays.includes(
                                              dates
                                            )
                                              ? true
                                              : false
                                          }
                                          value={dates}
                                          onChange={(e: any) =>
                                            handleCheckbox(
                                              e,
                                              "recurrence_weekdays"
                                            )
                                          }
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : dropDownValue === "monthly" ||
                              newRecurrence.recurrence_type === "monthly" ? (
                              <div>
                                <div className="flex flex-row items-center w-full mt-7">
                                  <p className="w-2/5 text-[16px] text-primary-200">
                                    {t("Dashboard.OccursOn")}
                                  </p>
                                  <div className="w-3/5 flex items-center gap-3">
                                    <input
                                      id="radioMonthly"
                                      className={`${
                                        browser?.name === "safari"
                                          ? "mt-[5px]"
                                          : ""
                                      }`}
                                      type="radio"
                                      name="radioMonthly"
                                      value="DaysInMonth"
                                      onChange={(e) =>
                                        handleRadioMonthly(e.target.value)
                                      }
                                      checked={
                                        radioMonthly === "DaysInMonth"
                                          ? true
                                          : false
                                      }
                                    ></input>
                                    <p className="text-[16px] text-primary-200 ">
                                      {t("Dashboard.Day")}
                                    </p>
                                    <CustomDropdown
                                      id="recurrence_date"
                                      options={days}
                                      value={newRecurrence.recurrence_date}
                                      rest={`text-[#293241] w-full ${
                                        radioMonthly === "DaysInMonth"
                                          ? ""
                                          : " cursor-not-allowed bg-[#c3c1c14e]"
                                      }`}
                                      disabled={
                                        radioMonthly === "DaysInMonth"
                                          ? false
                                          : true
                                      }
                                      restClass={"text-[#293241] w-full"}
                                      onChange={(e: any) =>
                                        handleDropdownDays(e, "recurrence_date")
                                      }
                                    />

                                    <p className="text-[16px] text-primary-200 ">
                                      {t("Dashboard.Ofthemonth")}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex mt-5">
                                  <p className="text-[16px] w-2/5 text-primary-200"></p>
                                  <div className="w-3/5 flex flex-row 2xl:items-center gap-3">
                                    <input
                                      id="radioMonthly"
                                      className={`${
                                        browser?.name === "safari"
                                          ? "mt-[5px]"
                                          : "mt-3 2xl:mt-0"
                                      }`}
                                      type="radio"
                                      name="radioMonthly"
                                      value="weekInMonth"
                                      checked={
                                        radioMonthly === "weekInMonth"
                                          ? true
                                          : false
                                      }
                                      onChange={(e) =>
                                        handleRadioMonthly(e.target.value)
                                      }
                                    ></input>
                                    <div className="flex flex-col gap-2 w-full ">
                                      <CustomDropdown
                                        id="firstMonth"
                                        options={selectingMonth}
                                        value={selectingMonth.find(
                                          (month: any) =>
                                            month.value ===
                                            +occursMonth.firstMonth
                                        )}
                                        rest={`text-[#293241] w-full ${
                                          radioMonthly === "weekInMonth"
                                            ? ""
                                            : " cursor-not-allowed bg-[#c3c1c14e]"
                                        }`}
                                        disabled={
                                          radioMonthly === "weekInMonth"
                                            ? false
                                            : true
                                        }
                                        restClass={"text-[#293241] w-full"}
                                        onChange={(e: any) =>
                                          handleOnChangeRadioMonthly(
                                            e,
                                            "firstMonth"
                                          )
                                        }
                                      />
                                      <CustomDropdown
                                        id="daysOfMonth"
                                        options={selectingWeekInMonth}
                                        value={selectingWeekInMonth.find(
                                          (month: any) =>
                                            month.value ===
                                            occursMonth.daysOfMonth
                                        )}
                                        rest={`text-[#293241] w-full ${
                                          radioMonthly === "weekInMonth"
                                            ? ""
                                            : " cursor-not-allowed bg-[#c3c1c14e]"
                                        }`}
                                        disabled={
                                          radioMonthly === "weekInMonth"
                                            ? false
                                            : true
                                        }
                                        restClass={"text-[#293241] w-full"}
                                        onChange={(e: any) =>
                                          handleOnChangeRadioMonthly(
                                            e,
                                            "daysOfMonth"
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          <div className="flex flex-col mt-7">
                            <div className="flex justify-between items-center">
                              <p className="text-[16px] text-primary-200 w-2/5 ">
                                {t("Dashboard.EndDate")}
                              </p>
                              <div className="flex flex-row w-3/5 items-center gap-4">
                                <input
                                  id="radioDaily"
                                  className={`${
                                    browser?.name === "safari" ? "mt-4" : ""
                                  }`}
                                  type="radio"
                                  name="radioDaily"
                                  value="endTime"
                                  onChange={(e) =>
                                    handleRadioDaily(e.target.value)
                                  }
                                  checked={
                                    radioDaily === "endTime" ? true : false
                                  }
                                ></input>
                                <div
                                  className={`${
                                    radioDaily == "endTime"
                                      ? ""
                                      : " disabled: cursor-not-allowed bg-[lightgray]"
                                  } rounded-[7px] border-[1px] border-[#B1B1B1] py-2 pl-3 pr-2 w-full outline-none flex justify-between`}
                                >
                                  <DatePicker
                                    id="expiryDates"
                                    open={
                                      radioDaily === "endTime"
                                        ? secondCalender
                                        : false
                                    }
                                    onClickOutside={() =>
                                      setSecondCalender(false)
                                    }
                                    minDate={getCalenderDate()}
                                    dateFormat={"MM/dd/yyyy"}
                                    readOnly
                                    className={`${
                                      radioDaily == "endTime"
                                        ? ""
                                        : " cursor-not-allowed bg-[lightgray]"
                                    } w-full outline-none`}
                                    selected={expiryDates}
                                    onChange={(e: any) =>
                                      newhandleReadValuesExpiryDates(e)
                                    }
                                    disabled={
                                      radioDaily == "endTime" ? false : true
                                    }
                                  />
                                  <svg
                                    id="handleSecondCalenderMeet"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`${
                                      radioDaily == "endTime"
                                        ? ""
                                        : " cursor-not-allowed bg-[lightgray]"
                                    } mr-2.5 cursor-pointer`}
                                    onClick={() => handleSecondCalender()}
                                  >
                                    <path
                                      d="M6.10714 1.5C6.64051 1.5 7.07143 1.93092 7.07143 2.46429V3.42857H10.9286V2.46429C10.9286 1.93092 11.3595 1.5 11.8929 1.5C12.4262 1.5 12.8571 1.93092 12.8571 2.46429V3.42857H14.3036C15.1021 3.42857 15.75 4.07645 15.75 4.875V6.32143H2.25V4.875C2.25 4.07645 2.89788 3.42857 3.69643 3.42857H5.14286V2.46429C5.14286 1.93092 5.57377 1.5 6.10714 1.5ZM2.25 7.28571H15.75V15.4821C15.75 16.2807 15.1021 16.9286 14.3036 16.9286H3.69643C2.89788 16.9286 2.25 16.2807 2.25 15.4821V7.28571ZM4.17857 9.69643V10.6607C4.17857 10.9259 4.39554 11.1429 4.66071 11.1429H5.625C5.89018 11.1429 6.10714 10.9259 6.10714 10.6607V9.69643C6.10714 9.43125 5.89018 9.21429 5.625 9.21429H4.66071C4.39554 9.21429 4.17857 9.43125 4.17857 9.69643ZM8.03571 9.69643V10.6607C8.03571 10.9259 8.25268 11.1429 8.51786 11.1429H9.48214C9.74732 11.1429 9.96429 10.9259 9.96429 10.6607V9.69643C9.96429 9.43125 9.74732 9.21429 9.48214 9.21429H8.51786C8.25268 9.21429 8.03571 9.43125 8.03571 9.69643ZM12.375 9.21429C12.1098 9.21429 11.8929 9.43125 11.8929 9.69643V10.6607C11.8929 10.9259 12.1098 11.1429 12.375 11.1429H13.3393C13.6045 11.1429 13.8214 10.9259 13.8214 10.6607V9.69643C13.8214 9.43125 13.6045 9.21429 13.3393 9.21429H12.375ZM4.17857 13.5536V14.5179C4.17857 14.783 4.39554 15 4.66071 15H5.625C5.89018 15 6.10714 14.783 6.10714 14.5179V13.5536C6.10714 13.2884 5.89018 13.0714 5.625 13.0714H4.66071C4.39554 13.0714 4.17857 13.2884 4.17857 13.5536ZM8.51786 13.0714C8.25268 13.0714 8.03571 13.2884 8.03571 13.5536V14.5179C8.03571 14.783 8.25268 15 8.51786 15H9.48214C9.74732 15 9.96429 14.783 9.96429 14.5179V13.5536C9.96429 13.2884 9.74732 13.0714 9.48214 13.0714H8.51786ZM11.8929 13.5536V14.5179C11.8929 14.783 12.1098 15 12.375 15H13.3393C13.6045 15 13.8214 14.783 13.8214 14.5179V13.5536C13.8214 13.2884 13.6045 13.0714 13.3393 13.0714H12.375C12.1098 13.0714 11.8929 13.2884 11.8929 13.5536Z"
                                      fill="#5C6779"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="flex mt-1 justify-between items-center">
                              <p className="text-[16px] text-primary-200 w-1/5">
                                {t("Dashboard.After")}
                              </p>
                              <div className="flex flex-row w-3/5 items-center gap-4">
                                <input
                                  id="radioDailyoccurrences"
                                  className={`${
                                    browser?.name === "safari" ? "mt-4" : ""
                                  }`}
                                  type="radio"
                                  name="radioDaily"
                                  value="occurrences"
                                  onChange={(e) =>
                                    handleRadioDaily(e.target.value)
                                  }
                                  checked={
                                    radioDaily === "endTime" ? false : true
                                  }
                                ></input>

                                <input
                                  id="radioDailyhandleOccurrences"
                                  type="number"
                                  min="2"
                                  className={`${
                                    radioDaily == "occurrences"
                                      ? ""
                                      : " cursor-not-allowed bg-[lightgray]"
                                  } rounded-[7px] border-[1px] border-[#B1B1B1] px-3 py-2 w-full`}
                                  value={occurrences}
                                  onChange={(e) =>
                                    handleOccurrences(e.target.value)
                                  }
                                  onInput={(e: any) => {
                                    if (e.target.value.length > 2) {
                                      e.target.value = e.target.value.slice(
                                        0,
                                        2
                                      );
                                    }
                                  }}
                                  disabled={
                                    radioDaily == "occurrences" ? false : true
                                  }
                                ></input>

                                <p className=" text-[16px] text-primary-200">
                                  {t("Dashboard.Occurrences")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <hr className="text-[#0000001f] my-6" />
          <div className="flex flex-row text-[#293241]">
            <div className="w-1/4 font-semibold p-4 flex items-center">
              Advanced Settings
            </div>
            <div className="w-1/4 flex flex-col gap-12 ">
              {/* <div className=" p-4">Record Mode</div> */}
              <div className=" mt-[6px] p-4 justify-center">Security</div>
              {/* <div className="-mt-10 p-4">Co-Host</div> */}
            </div>
            <div className="w-2/4 flex flex-col gap-4 p-4">
              {/* <div className="flex gap-12 relative items-center">
              <select
                className="border-[#B1B1B1] rounded-[7px] border-[1px] px-3 py-2 bg-[white]"
                value={readValues.join_mode}
                onChange={(e: any) => handleRecordMode(e.target.value)}
              >
                {recordList.map((datas: any) => {
                  return <option value={datas.value}>{datas.label}</option>;
                })}
              </select>
            </div>

            <CheckBox
              // checked={readValues.recurrence}
              // value={readValues.recurrence}
              // onChange={(e: any) =>
              //   handleChange(e.target.checked, "recurrence")
              // }
              color={""}
              label={"Record Automatically"}
              id={"record"}
              restClass={"mt-2 -ml-2 rounded-[7px] text-primary-200"}
            /> */}

              <div className="flex  gap-12 relative items-center">
                <CustomDropdown
                  id="join_mode"
                  options={securityList}
                  value={securityList.find(
                    (list: any) => list?.value === readValues.join_mode
                  )}
                  rest={`text-[#293241] w-full ${
                    flagSingleRecurrenceMeeting === true &&
                    flagSetEditSingleMeet === true
                      ? true
                      : false
                  }`}
                  disabled={
                    flagSingleRecurrenceMeeting === true &&
                    flagSetEditSingleMeet === true
                      ? true
                      : false
                  }
                  restClass={"text-[#293241] w-full"}
                  onChange={(e: any) => handleSecurity(e)}
                />
              </div>

              {/* <CheckBox
              // checked={readValues.recurrence}
              // value={readValues.recurrence}
              // onChange={(e: any) =>
              //   handleChange(e.target.checked, "recurrence")
              // }
              color={""}
              label={"Enable Co-Host"}
              id={"record"}
              restClass={"mt-5 -ml-2 rounded-[7px] text-primary-200"}
            /> */}
            </div>
          </div>
        </div>
        <div className="relative flex mt-6 justify-end gap-5 ">
          <div
            id="cancelBtn"
            onClick={() => {
              dispatch(actionCreators.setProgress(false));
              dispatch(actionCreators.setEditScheduleMeet(false));
              dispatch(actionCreators.setMeetingModal(false));
              dispatch(actionCreators.setSelectedDate(new Date()));
              setActiveTab(0);
            }}
            className={`text-[#293241] mr-2 mt-[2px] cursor-pointer h-[40px] w-24  rounded-[8px] p-3 flex items-center justify-center`}
          >
            {t("Cancel")}
          </div>

          <div
            id="scheduleBtn"
            onClick={(e: any) => handleClick(e)}
            className={`bg-[#E57600] hover:bg-[#CC6900] font-bold text-[#FFFFFF] mr-2 mt-[2px] cursor-pointer h-[40px] w-24  rounded-[8px] p-3 flex items-center justify-center`}
          >
            {flagEditMeeting === true ? "Update" : "Schedule"}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export default ScheduleMeeting
