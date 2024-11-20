/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import "../../dashboard/Styles.css"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import path from "../../../../../navigation/routes.path"
import "../Styles.css"
import { useTranslation } from "react-i18next"
import UpcomingMeetings from "./upcomingMeetings"
import ScheduleMeeting from "./scheduleMeeting"
import PersonalMeeting from "./personalMeeting"
import PastMeetingPage from "./pastMeetingPage"
import OpenMeetings from "./openMeetings"
import ScreenLoader from "../../../../../atom/ScreenLoader/screenLoader"
import { motion } from "framer-motion"
const Meetings = (props: any) => {
  const { t } = useTranslation()
  const [readDatas, setReadDatas] = useState(new Date())
  const user = useSelector((state: any) => state.Main.meetingSession)
  const [dateTaken, setDateTaken] = useState(false)
  const [openData, setOpenData] = useState([])
  const [activeTab, setActiveTab] = useState<number>(0)
  const [activeItem, setActiveItem] = useState<any>({})
  const [calenderData, setCalenderData] = useState([])

  const {
    setSortedDate,
    sortedDate,
    apiResponce,
    setApiResponce,
    searchData,
    setDisplayFilter,
    displayFilter,
    listAll,
    setListAll,
  } = props

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const flagEditMeeting = useSelector(
    (state: any) => state.Flag.setEditScheduleState
  )

  //dispatch(actionCreators.setProgress(false));
  //dispatch(actionCreators.setEditSingleMeet(false))
  //dispatch(actionCreators.setEditSingleRecMeet(false))

  dispatch(actionCreators.setChatscreen(false))

  const [loader, setloader] = useState<any>(false)

  const handleActiveTab = (node: number, title: string) => {
    if (node === 1) {
      dispatch(actionCreators.setProgress(false))
      dispatch(actionCreators.setEditScheduleMeet(false))
      dispatch(actionCreators.setSingleRecurrenceScheduleMeet(false))
      dispatch(actionCreators.setAllRecurrenceScheduleMeet(false))
      dispatch(actionCreators.setFlagEditMeetingTime(false))
    }
    if (node !== 1 && node !== 5) {
      dispatch(actionCreators.setSelectedDate(new Date()))
    }
    dispatch(actionCreators.setMeetingModal(false))
    setActiveTab(node)
    //setEndNode(title);
  }

  const handleReadValues = async (value: any) => {
    setloader(true)
    setReadDatas(value)

    if (value) {
      value = Number(Math.round(new Date().getTime() / 1000))
    }

    await user
      .meetingList(value)
      .then((res: any) => {
        const mappedArray = res.map((item: any) => ({
          id: item.meeting_uuid,
          end: new Date(item.expiry_date * 1000).toLocaleString("en-US", {
            timeZone: "UTC",
          }),
          start: new Date(item.start_date_time * 1000).toLocaleString("en-US", {
            timeZone: "UTC",
          }),
          title: item.name,
        }))
        setCalenderData(mappedArray)

        setApiResponce(res)
        setloader(false)
      })
      .catch((e: any) => {})
    setDateTaken(true)
    setDisplayFilter(false)
  }

  const onChange = (value: any) => {
    handleReadValues(value)
    setListAll(false)
  }

  useEffect(() => {
    // if (readDatas) {
    //   onChange(readDatas);
    // }
    handleReadValues(readDatas)
  }, [activeTab])

  return (
    <div className="lg:flex w-[calc(100vw-60px)]  h-screen bg-[#F1F1F1] ">
      <motion.div
        key="meetingpage"
        className=" origin-top w-full p-2 ml-1 flex flex-col items-center"
        initial={{ opacity: 0, translateY: "80px" }}
        animate={{
          opacity: 1,
          translateY: "0px",
          transition: { duration: 0.5 },
        }}
      >
        <ul className="flex justify-between w-full 2xl:w-[calc(100vw-700px)] max-h-[60px] h-fit text-center transition-all ease-in-out text-[#293241] rounded-t-lg px-1 pt-1">
          <li
            className={`inline-block w-[100%] rounded-t-lg ${
              activeTab === 0 ? "bg-[#FEFDFB] " : ""
            }`}
          >
            <a
              id="upcoming_Meeting"
              onClick={() => {
                handleActiveTab(0, "upcoming_Meeting")
              }}
              className={`flex justify-center py-2 cursor-pointer items-center rounded-t-lg}`}
            >
              <span
                className={`inline-block mb-1 pr-2  ${
                  activeTab === 0 ? "text-primary-text" : ""
                }`}
              >
                <svg
                  className="mt-[2px]"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.88281 3.75C2.53213 3.75 2.25 4.03213 2.25 4.38281V5.64844C2.25 5.99912 2.53213 6.28125 2.88281 6.28125H4.14844C4.49912 6.28125 4.78125 5.99912 4.78125 5.64844V4.38281C4.78125 4.03213 4.49912 3.75 4.14844 3.75H2.88281ZM6.89062 4.17188C6.42393 4.17188 6.04688 4.54893 6.04688 5.01562C6.04688 5.48232 6.42393 5.85938 6.89062 5.85938H14.4844C14.9511 5.85938 15.3281 5.48232 15.3281 5.01562C15.3281 4.54893 14.9511 4.17188 14.4844 4.17188H6.89062ZM6.89062 8.39062C6.42393 8.39062 6.04688 8.76768 6.04688 9.23438C6.04688 9.70107 6.42393 10.0781 6.89062 10.0781H14.4844C14.9511 10.0781 15.3281 9.70107 15.3281 9.23438C15.3281 8.76768 14.9511 8.39062 14.4844 8.39062H6.89062ZM6.89062 12.6094C6.42393 12.6094 6.04688 12.9864 6.04688 13.4531C6.04688 13.9198 6.42393 14.2969 6.89062 14.2969H14.4844C14.9511 14.2969 15.3281 13.9198 15.3281 13.4531C15.3281 12.9864 14.9511 12.6094 14.4844 12.6094H6.89062ZM2.25 8.60156V9.86719C2.25 10.2179 2.53213 10.5 2.88281 10.5H4.14844C4.49912 10.5 4.78125 10.2179 4.78125 9.86719V8.60156C4.78125 8.25088 4.49912 7.96875 4.14844 7.96875H2.88281C2.53213 7.96875 2.25 8.25088 2.25 8.60156ZM2.88281 12.1875C2.53213 12.1875 2.25 12.4696 2.25 12.8203V14.0859C2.25 14.4366 2.53213 14.7188 2.88281 14.7188H4.14844C4.49912 14.7188 4.78125 14.4366 4.78125 14.0859V12.8203C4.78125 12.4696 4.49912 12.1875 4.14844 12.1875H2.88281Z"
                    fill={activeTab === 0 ? "#293241" : "#5C6779"}
                  />
                </svg>
              </span>
              <div
                className={`text-left capitalize ${
                  activeTab === 0
                    ? "text-[#293241] font-semibold"
                    : "text-[#5C6779]"
                }`}
              >
                Upcoming Meeting
              </div>
            </a>
          </li>
          <li
            className={`inline-block w-[100%] rounded-t-lg ${
              activeTab === 1 ? "bg-[#FEFDFB] " : ""
            }`}
          >
            <a
              id="schedule_Meeting"
              onClick={() => handleActiveTab(1, "schedule_Meeting")}
              className={`flex justify-center py-2 cursor-pointer items-center rounded-t-lg}`}
            >
              <span
                className={`inline-block pr-2 ${
                  activeTab === 1 ? "text-primary-text" : ""
                }`}
              >
                <svg
                  className="mb-[2px]"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.10714 1.5C6.64051 1.5 7.07143 1.93092 7.07143 2.46429V3.42857H10.9286V2.46429C10.9286 1.93092 11.3595 1.5 11.8929 1.5C12.4262 1.5 12.8571 1.93092 12.8571 2.46429V3.42857H14.3036C15.1021 3.42857 15.75 4.07645 15.75 4.875V6.32143H2.25V4.875C2.25 4.07645 2.89788 3.42857 3.69643 3.42857H5.14286V2.46429C5.14286 1.93092 5.57377 1.5 6.10714 1.5ZM2.25 7.28571H15.75V15.4821C15.75 16.2807 15.1021 16.9286 14.3036 16.9286H3.69643C2.89788 16.9286 2.25 16.2807 2.25 15.4821V7.28571ZM4.17857 9.69643V10.6607C4.17857 10.9259 4.39554 11.1429 4.66071 11.1429H5.625C5.89018 11.1429 6.10714 10.9259 6.10714 10.6607V9.69643C6.10714 9.43125 5.89018 9.21429 5.625 9.21429H4.66071C4.39554 9.21429 4.17857 9.43125 4.17857 9.69643ZM8.03571 9.69643V10.6607C8.03571 10.9259 8.25268 11.1429 8.51786 11.1429H9.48214C9.74732 11.1429 9.96429 10.9259 9.96429 10.6607V9.69643C9.96429 9.43125 9.74732 9.21429 9.48214 9.21429H8.51786C8.25268 9.21429 8.03571 9.43125 8.03571 9.69643ZM12.375 9.21429C12.1098 9.21429 11.8929 9.43125 11.8929 9.69643V10.6607C11.8929 10.9259 12.1098 11.1429 12.375 11.1429H13.3393C13.6045 11.1429 13.8214 10.9259 13.8214 10.6607V9.69643C13.8214 9.43125 13.6045 9.21429 13.3393 9.21429H12.375ZM4.17857 13.5536V14.5179C4.17857 14.783 4.39554 15 4.66071 15H5.625C5.89018 15 6.10714 14.783 6.10714 14.5179V13.5536C6.10714 13.2884 5.89018 13.0714 5.625 13.0714H4.66071C4.39554 13.0714 4.17857 13.2884 4.17857 13.5536ZM8.51786 13.0714C8.25268 13.0714 8.03571 13.2884 8.03571 13.5536V14.5179C8.03571 14.783 8.25268 15 8.51786 15H9.48214C9.74732 15 9.96429 14.783 9.96429 14.5179V13.5536C9.96429 13.2884 9.74732 13.0714 9.48214 13.0714H8.51786ZM11.8929 13.5536V14.5179C11.8929 14.783 12.1098 15 12.375 15H13.3393C13.6045 15 13.8214 14.783 13.8214 14.5179V13.5536C13.8214 13.2884 13.6045 13.0714 13.3393 13.0714H12.375C12.1098 13.0714 11.8929 13.2884 11.8929 13.5536Z"
                    fill={activeTab === 1 ? "#293241" : "#5C6779"}
                  />
                </svg>
              </span>
              <div
                className={`text-left capitalize ${
                  activeTab === 1
                    ? "text-[#293241] font-semibold"
                    : "text-[#5C6779]"
                }`}
              >
                Schedule Meeting
              </div>
            </a>
          </li>
          <li
            className={`inline-block w-[100%] rounded-t-lg ${
              activeTab === 2 ? "bg-[#FEFDFB] " : ""
            }`}
          >
            <a
              id="personal_meeting"
              onClick={() => handleActiveTab(2, "personal_meeting")}
              className={`flex justify-center py-2 cursor-pointer items-center rounded-t-lg}`}
            >
              <span
                className={`inline-block pr-2 ${
                  activeTab === 2 ? "text-primary-text" : ""
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.875 9C10.0685 9 11.2131 8.52589 12.057 7.68198C12.9009 6.83807 13.375 5.69347 13.375 4.5C13.375 3.30653 12.9009 2.16193 12.057 1.31802C11.2131 0.474106 10.0685 0 8.875 0C7.68153 0 6.53693 0.474106 5.69302 1.31802C4.84911 2.16193 4.375 3.30653 4.375 4.5C4.375 5.69347 4.84911 6.83807 5.69302 7.68198C6.53693 8.52589 7.68153 9 8.875 9ZM7.26836 10.6875C3.80547 10.6875 1 13.493 1 16.9559C1 17.5324 1.46758 18 2.04414 18H15.7059C16.2824 18 16.75 17.5324 16.75 16.9559C16.75 13.493 13.9445 10.6875 10.4816 10.6875H7.26836Z"
                    fill={activeTab === 2 ? "#293241" : "#5C6779"}
                  />
                </svg>
              </span>
              <div
                className={`text-left capitalize ${
                  activeTab === 2
                    ? "text-[#293241] font-semibold"
                    : "text-[#5C6779]"
                }`}
              >
                Personal Meeting
              </div>
            </a>
          </li>
          <li
            className={`inline-block w-[100%] rounded-t-lg ${
              activeTab === 3 ? "bg-[#FEFDFB] " : ""
            }`}
          >
            <a
              id="open_meeting"
              onClick={() => handleActiveTab(3, "open_meeting")}
              className={`flex justify-center py-2 cursor-pointer  items-center rounded-t-lg }`}
            >
              <span
                className={`inline-block pr-2 ${
                  activeTab === 3 ? "text-primary-text" : ""
                }`}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.77416 3.79725C9.77416 3.55773 9.66529 3.33273 9.47658 3.18757C9.28787 3.04241 9.04352 2.98918 8.81126 3.04725L4.45884 4.13596C3.94352 4.26418 3.58061 4.7287 3.58061 5.26096V13.8618H2.80642C2.37819 13.8618 2.03223 14.2077 2.03223 14.636C2.03223 15.0642 2.37819 15.4102 2.80642 15.4102H4.35481H8.99997H9.77416V14.636V3.79725ZM8.22577 9.2166C8.22577 9.64483 7.9669 9.9908 7.64513 9.9908C7.32336 9.9908 7.06448 9.64483 7.06448 9.2166C7.06448 8.78838 7.32336 8.44241 7.64513 8.44241C7.9669 8.44241 8.22577 8.78838 8.22577 9.2166ZM10.5484 6.11983H12.8709V14.636C12.8709 15.0642 13.2169 15.4102 13.6451 15.4102H15.1935C15.6217 15.4102 15.9677 15.0642 15.9677 14.636C15.9677 14.2077 15.6217 13.8618 15.1935 13.8618H14.4193V6.11983C14.4193 5.2658 13.725 4.57144 12.8709 4.57144H10.5484V6.11983Z"
                    fill={activeTab === 3 ? "#293241" : "#5C6779"}
                  />
                </svg>
              </span>
              <div
                className={`text-left capitalize ${
                  activeTab === 3
                    ? "text-[#293241] font-semibold"
                    : "text-[#5C6779]"
                }`}
              >
                Open Meeting
              </div>
            </a>
          </li>
          <li
            className={`inline-block w-[100%] rounded-t-lg items-center ${
              activeTab === 4 ? "bg-[#FEFDFB] " : ""
            }`}
          >
            <a
              id="past_meeting"
              onClick={() => handleActiveTab(4, "past_meeting")}
              className={`flex justify-center py-2 cursor-pointer items-center rounded-t-lg }`}
            >
              <span
                className={`inline-block pr-2  ${
                  activeTab === 4 ? "text-primary-text" : ""
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_38_2071)">
                    <path
                      d="M2.63672 2.63672L1.44141 1.44141C0.910547 0.910547 0 1.28672 0 2.03555V5.90625C0 6.37383 0.376172 6.75 0.84375 6.75H4.71445C5.4668 6.75 5.84297 5.83945 5.31211 5.30859L4.2293 4.22578C5.44922 3.00586 7.13672 2.25 9 2.25C12.7266 2.25 15.75 5.27344 15.75 9C15.75 12.7266 12.7266 15.75 9 15.75C7.56563 15.75 6.23672 15.3035 5.14336 14.5406C4.63359 14.1855 3.93398 14.3086 3.57539 14.8184C3.2168 15.3281 3.34336 16.0277 3.85312 16.3863C5.31562 17.4023 7.09102 18 9 18C13.9711 18 18 13.9711 18 9C18 4.02891 13.9711 0 9 0C6.51445 0 4.26445 1.00898 2.63672 2.63672ZM9 4.5C8.53242 4.5 8.15625 4.87617 8.15625 5.34375V9C8.15625 9.225 8.24414 9.43945 8.40234 9.59766L10.9336 12.1289C11.2641 12.4594 11.7984 12.4594 12.1254 12.1289C12.4523 11.7984 12.4559 11.2641 12.1254 10.9371L9.84023 8.65195V5.34375C9.84023 4.87617 9.46406 4.5 8.99648 4.5H9Z"
                      fill={activeTab === 4 ? "#293241" : "#5C6779"}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_38_2071">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <div
                className={`text-left capitalize ${
                  activeTab === 4
                    ? "text-[#293241] font-semibold"
                    : "text-[#5C6779]"
                }`}
              >
                Past Meeting
              </div>
            </a>
          </li>
          {flagEditMeeting && activeTab !== 0 && (
            <li
              className={`inline-block w-[100%] rounded-t-lg items-center ${
                activeTab === 5 ? "bg-[#FEFDFB] " : ""
              }`}
            >
              <a
                id="edit_meeting"
                onClick={() => handleActiveTab(5, "edit_meeting")}
                className={`flex justify-center py-2 cursor-pointer items-center rounded-t-lg }`}
              >
                <span
                  className={`inline-block pr-2  ${
                    activeTab === 5 ? "text-primary-text" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M14.8142 2.68759C14.2308 2.10414 13.2876 2.10414 12.7042 2.68759L11.9023 3.48684L14.5105 6.09506L15.3124 5.29314C15.8959 4.70969 15.8959 3.76658 15.3124 3.18312L14.8142 2.68759ZM6.84302 8.54876C6.68051 8.71127 6.55529 8.91108 6.48336 9.13221L5.69477 11.498C5.61751 11.7271 5.67878 11.9802 5.84929 12.1534C6.0198 12.3265 6.27289 12.3852 6.50467 12.3079L8.87046 11.5193C9.08892 11.4474 9.28873 11.3222 9.45391 11.1596L13.9111 6.69982L11.3002 4.08894L6.84302 8.54876ZM4.8076 3.81453C3.39559 3.81453 2.25 4.96012 2.25 6.37213V13.1924C2.25 14.6044 3.39559 15.75 4.8076 15.75H11.6279C13.0399 15.75 14.1855 14.6044 14.1855 13.1924V10.6348C14.1855 10.1632 13.8045 9.78227 13.3329 9.78227C12.8614 9.78227 12.4804 10.1632 12.4804 10.6348V13.1924C12.4804 13.664 12.0994 14.0449 11.6279 14.0449H4.8076C4.33604 14.0449 3.95507 13.664 3.95507 13.1924V6.37213C3.95507 5.90057 4.33604 5.5196 4.8076 5.5196H7.3652C7.83676 5.5196 8.21773 5.13862 8.21773 4.66707C8.21773 4.19551 7.83676 3.81453 7.3652 3.81453H4.8076Z"
                      fill={activeTab === 5 ? "#293241" : "#5C6779"}
                    />
                  </svg>
                </span>
                <div
                  className={`text-left capitalize ${
                    activeTab === 5
                      ? "text-[#293241] font-semibold"
                      : "text-[#5C6779]"
                  }`}
                >
                  Edit Meeting
                </div>
              </a>
            </li>
          )}
        </ul>

        <div className="bg-[#FEFDFB]  w-full 2xl:w-[calc(100vw-707px)] rounded-b-lg ml-[7px] 2xl:ml-0">
          {activeTab === 0 ? (
            <UpcomingMeetings
              onChange={onChange}
              value={calenderData}
              setListAll={setListAll}
              apiResponce={apiResponce}
              setApiResponce={setApiResponce}
              setSortedDate={setSortedDate}
              sortedDate={sortedDate}
              openData={openData}
              displayFilter={displayFilter}
              searchData={searchData}
              readDatas={readDatas}
              setReadDatas={setReadDatas}
              handleReadValues={handleReadValues}
              setActiveTab={setActiveTab}
              loader={loader}
              setloader={setloader}
            />
          ) : null}
          {activeTab === 1 ? (
            <ScheduleMeeting setActiveTab={setActiveTab} />
          ) : null}
          {activeTab === 2 ? <PersonalMeeting /> : null}
          {activeTab === 3 ? (
            <OpenMeetings
              onChange={onChange}
              value={calenderData}
              setListAll={setListAll}
              apiResponce={apiResponce}
              setSortedDate={setSortedDate}
              sortedDate={sortedDate}
              openData={openData}
              displayFilter={displayFilter}
              searchData={searchData}
              readDatas={readDatas}
              setReadDatas={setReadDatas}
              handleReadValues={handleReadValues}
              setActiveTab={setActiveTab}
            />
          ) : null}
          {activeTab === 4 ? (
            <PastMeetingPage setActiveTab={setActiveTab} />
          ) : null}
          {activeTab === 5 ? (
            <ScheduleMeeting setActiveTab={setActiveTab} />
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}
export default Meetings
