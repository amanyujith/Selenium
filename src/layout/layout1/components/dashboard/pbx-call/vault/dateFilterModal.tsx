import React, { useState } from "react"
import DatePicker from "react-datepicker"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../../store"
import { filterDate } from "./interfaces"

interface dateFilter {
  type: string
  filter: filterDate
  setFilter: ({ startDate, endDate }: filterDate) => void
  handleClick: () => void
}

const DateFilterModal = ({
  type,
  filter,
  setFilter,
  handleClick,
}: dateFilter) => {
  const [calender1, setCalender1] = useState(false)
  const [calender2, setCalender2] = useState(false)
  const chatInstance = useSelector(
    (state: RootState) => state.Chat.chatInstance
  )
  const dispatch = useDispatch()

  return (
    <div className="w-[342px] h-[160px] shadow-xl bg-[#ffffff] rounded-xl p-4">
      <div className="text-[14px] text-[#5C6779]">Filter by Date</div>
      <div className="flex">
        <div
          className="border border-solid box-border rounded-lg py-1.5 px-2 outline-none border-[#C4C4C4] w-40 flex cursor-pointer m-2"
          onClick={() => setCalender1(true)}
        >
          <div className="flex flex-col text-[14px]">
            <span className="text-[10px]">From</span>
            <DatePicker
              id="callHistoryCalenderStart"
              className="w-24 outline-none"
              open={calender1}
              onClickOutside={() => setCalender1(false)}
              readOnly
              maxDate={new Date(filter.endDate as Date)}
              selected={(filter.startDate as Date | null) ?? new Date()}
              onChange={(event: any) => {
                setFilter({
                  ...filter,
                  startDate: new Date(event).setHours(0, 0, 0, 0),
                })
              }}
              dateFormat={"MM/dd/yyyy"}
              placeholderText=""
            />
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 14 16"
            fill="none"
            className="mr-2.5 cursor-pointer mt-2.5"
          >
            <path
              d="M0 14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V6H0V14.5ZM10 8.375C10 8.16875 10.1687 8 10.375 8H11.625C11.8313 8 12 8.16875 12 8.375V9.625C12 9.83125 11.8313 10 11.625 10H10.375C10.1687 10 10 9.83125 10 9.625V8.375ZM10 12.375C10 12.1687 10.1687 12 10.375 12H11.625C11.8313 12 12 12.1687 12 12.375V13.625C12 13.8313 11.8313 14 11.625 14H10.375C10.1687 14 10 13.8313 10 13.625V12.375ZM6 8.375C6 8.16875 6.16875 8 6.375 8H7.625C7.83125 8 8 8.16875 8 8.375V9.625C8 9.83125 7.83125 10 7.625 10H6.375C6.16875 10 6 9.83125 6 9.625V8.375ZM6 12.375C6 12.1687 6.16875 12 6.375 12H7.625C7.83125 12 8 12.1687 8 12.375V13.625C8 13.8313 7.83125 14 7.625 14H6.375C6.16875 14 6 13.8313 6 13.625V12.375ZM2 8.375C2 8.16875 2.16875 8 2.375 8H3.625C3.83125 8 4 8.16875 4 8.375V9.625C4 9.83125 3.83125 10 3.625 10H2.375C2.16875 10 2 9.83125 2 9.625V8.375ZM2 12.375C2 12.1687 2.16875 12 2.375 12H3.625C3.83125 12 4 12.1687 4 12.375V13.625C4 13.8313 3.83125 14 3.625 14H2.375C2.16875 14 2 13.8313 2 13.625V12.375ZM12.5 2H11V0.5C11 0.225 10.775 0 10.5 0H9.5C9.225 0 9 0.225 9 0.5V2H5V0.5C5 0.225 4.775 0 4.5 0H3.5C3.225 0 3 0.225 3 0.5V2H1.5C0.671875 2 0 2.67188 0 3.5V5H14V3.5C14 2.67188 13.3281 2 12.5 2Z"
              fill="#5C6779"
            />
          </svg>
        </div>
        <div
          className="border border-solid box-border rounded-lg py-1.5 px-2 outline-none border-[#C4C4C4] w-40 flex cursor-pointer m-2"
          onClick={() => setCalender2(true)}
        >
          <div className="flex flex-col text-[14px]">
            <span className="text-[10px]">To</span>
            <DatePicker
              id="callHistoryCalenderEnd"
              className="w-24 outline-none"
              open={calender2}
              onClickOutside={() => setCalender2(false)}
              readOnly
              maxDate={new Date(new Date().setHours(23, 59, 59, 0))}
              selected={
                (filter.endDate as Date) ?? new Date().setHours(23, 59, 59, 0)
              }
              onChange={(event: any) => {
                if (filter.startDate > new Date(event)) {
                  setFilter({
                    startDate: new Date(
                      new Date(event).getTime() - 7 * 24 * 60 * 60 * 1000
                    ).setHours(0, 0, 0, 0),
                    endDate: new Date(event).setHours(23, 59, 59, 0),
                  })
                } else {
                  setFilter({
                    ...filter,
                    endDate: new Date(event).setHours(23, 59, 59, 0),
                  })
                }
              }}
              dateFormat={"MM/dd/yyyy"}
              placeholderText=""
            />
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 14 16"
            fill="none"
            className="mr-2.5 cursor-pointer mt-2.5"
          >
            <path
              d="M0 14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V6H0V14.5ZM10 8.375C10 8.16875 10.1687 8 10.375 8H11.625C11.8313 8 12 8.16875 12 8.375V9.625C12 9.83125 11.8313 10 11.625 10H10.375C10.1687 10 10 9.83125 10 9.625V8.375ZM10 12.375C10 12.1687 10.1687 12 10.375 12H11.625C11.8313 12 12 12.1687 12 12.375V13.625C12 13.8313 11.8313 14 11.625 14H10.375C10.1687 14 10 13.8313 10 13.625V12.375ZM6 8.375C6 8.16875 6.16875 8 6.375 8H7.625C7.83125 8 8 8.16875 8 8.375V9.625C8 9.83125 7.83125 10 7.625 10H6.375C6.16875 10 6 9.83125 6 9.625V8.375ZM6 12.375C6 12.1687 6.16875 12 6.375 12H7.625C7.83125 12 8 12.1687 8 12.375V13.625C8 13.8313 7.83125 14 7.625 14H6.375C6.16875 14 6 13.8313 6 13.625V12.375ZM2 8.375C2 8.16875 2.16875 8 2.375 8H3.625C3.83125 8 4 8.16875 4 8.375V9.625C4 9.83125 3.83125 10 3.625 10H2.375C2.16875 10 2 9.83125 2 9.625V8.375ZM2 12.375C2 12.1687 2.16875 12 2.375 12H3.625C3.83125 12 4 12.1687 4 12.375V13.625C4 13.8313 3.83125 14 3.625 14H2.375C2.16875 14 2 13.8313 2 13.625V12.375ZM12.5 2H11V0.5C11 0.225 10.775 0 10.5 0H9.5C9.225 0 9 0.225 9 0.5V2H5V0.5C5 0.225 4.775 0 4.5 0H3.5C3.225 0 3 0.225 3 0.5V2H1.5C0.671875 2 0 2.67188 0 3.5V5H14V3.5C14 2.67188 13.3281 2 12.5 2Z"
              fill="#5C6779"
            />
          </svg>
        </div>
      </div>
      <button id="submit"
        onClick={handleClick}
        className="ml-auto flex justify-center font-bold bg-[#E57600] hover:bg-[#CC6900] text-[#FFFFFF] items-center w-[100px] rounded-[7px] h-[44px] m-1"
      >
        {"Submit"}
      </button>
    </div>
  )
}

export default DateFilterModal
