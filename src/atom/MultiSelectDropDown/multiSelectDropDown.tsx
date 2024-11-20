import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import DatePicker from "react-datepicker"
import { t } from "i18next"
import useOutsideClick from "../../layout/layout1/components/dashboard/Chat/hooks/useOutsideClick "
import UseEscape from "../../layout/layout1/components/dashboard/Chat/hooks/useEscape"
interface multiSelectDropdownType {
  options?: any
  selected?: any
  toggleOption?: any
  placeholder?: string
  setOptions?: any
  setUserList?: any
}

export const MultiSelectDropdown = ({
  options,
  selected,
  toggleOption,
  placeholder,
  setOptions,
  setUserList,
}: multiSelectDropdownType) => {
  const modalRef = useRef<null | HTMLDivElement | any>(null)
  const [dropDown, setDropdown] = useState(false)
  const [custom, setCustom] = useState("")
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const groupsList = useSelector((state: any) => state.Chat.groupData)
  const [searchText, setSearchText] = useState<string>("")
  const userData = useSelector((state: any) => state.Chat.userData)
  const [hover, setHover] = useState("")
  const [mergedOptions, setMergedOptions] = useState<any>([])
  UseEscape(() => setCustom(""));
  useEffect(() => {
    if (placeholder === "In") {
      setOptions(groupsList)
      sortOptions(selected, options)
    }
  }, [groupsList])

  useEffect(() => {
    sortOptions(selected, options)
  }, [options, selected])

  const sortOptions = (selected: any, options: any) => {
    if (selected.length > 0) {
      const combinedArray = [...selected, ...options]
      const uniqueArray = Array.from(
        new Set(combinedArray.map((item) => item.uuid))
      ).map((uuid) => {
        return combinedArray.find((item) => item.uuid === uuid)
      })
      setMergedOptions(uniqueArray)
    } else {
      setMergedOptions(options)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    chatInstance?.tenantSearch(searchText.trim()).then((res: any) => {
      if (placeholder === "From" || placeholder === "With") {
        let users = res.filter((item: any) => item.type === "user")
        sortOptions(selected, users)
      } else {
        let groups = res.filter((item: any) => item.type === "group")
        sortOptions(selected, groups)
      }
    })
  }

  const dateUpdate = (option: any, placeholder: any) => {
    setHover(option.label)
    if (option.value !== "custom") toggleOption(option, placeholder)
    setCustom(option.value)
  }

  const closeModal = () => {
    setDropdown(false)
    if (placeholder !== "Date" && placeholder !== "In") setUserList(userData)
  }

  useOutsideClick(modalRef, closeModal)

  return (
    <div className=" w-fit  mt-3">
      <div
        onClick={() => setDropdown(!dropDown)}
        className=" flex justify-between w-fit text-[#C4C4C4] text-xs items-center h-6 rounded-[3px] px-2 py-1.5 border-[0.5px] border-[#404041]"
      >
        <div className="whitespace-nowrap">
          {placeholder === "Date"
            ? selected === "custom"
              ? `${placeholder} : Custom`
              : `${placeholder} : ${selected?.label}`
            : selected?.length !== 0
            ? `${placeholder} ${selected?.length} members`
            : placeholder}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <mask maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <rect width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_9294_57067)">
            <path
              d="M12.0016 15.0492L6.35156 9.37422L7.40156 8.32422L12.0016 12.9242L16.6016 8.32422L17.6516 9.37422L12.0016 15.0492Z"
              fill="#A7A9AB"
            />
          </g>
        </svg>
      </div>
      {dropDown && (
        <ul
          ref={modalRef}
          className=" w-fit max-w-[500px] mt-[3px] z-20 p-1 h-40 overflow-y-auto overflow-x-hidden list-none py-[5px] absolute rounded-[5px] border shadow-[0_4px_4px_0px_rgba(0,0,0,0.10)] border-[rgba(0,0,0,0.12)] bg-[#ffffff]"
        >
          {placeholder !== "Date" && (
            <div className="w-full border-[1.5px] border-[#C4C4C4] rounded-[3px] h-[32px]">
              <div className="flex flex-row content-center">
                <svg
                  className="mt-2 mx-3"
                  width="14"
                  height="14"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.90521 10.5021L6.23021 6.84167C5.93854 7.08472 5.60312 7.27431 5.22396 7.41042C4.84479 7.54653 4.4559 7.61458 4.05729 7.61458C3.0559 7.61458 2.21007 7.26944 1.51979 6.57917C0.829514 5.88889 0.484375 5.04306 0.484375 4.04167C0.484375 3.05 0.829514 2.2065 1.51979 1.51117C2.21007 0.816222 3.0559 0.46875 4.05729 0.46875C5.04896 0.46875 5.88993 0.813889 6.58021 1.50417C7.27049 2.19444 7.61562 3.04028 7.61562 4.04167C7.61562 4.45972 7.54757 4.85833 7.41146 5.2375C7.27535 5.61667 7.09062 5.94722 6.85729 6.22917L10.5177 9.88958L9.90521 10.5021ZM4.05729 6.73958C4.8059 6.73958 5.44038 6.47708 5.96071 5.95208C6.48065 5.42708 6.74063 4.79028 6.74063 4.04167C6.74063 3.29306 6.48065 2.65625 5.96071 2.13125C5.44038 1.60625 4.8059 1.34375 4.05729 1.34375C3.29896 1.34375 2.65982 1.60625 2.13987 2.13125C1.61954 2.65625 1.35937 3.29306 1.35937 4.04167C1.35937 4.79028 1.61954 5.42708 2.13987 5.95208C2.65982 6.47708 3.29896 6.73958 4.05729 6.73958Z"
                    fill="#A7A9AB"
                  />
                </svg>
                <input
                  className="text-primary-200 text-sm border-0 focus:border-0 mt-1 focus:outline-none w-full"
                  placeholder={t("Search")}
                  type="text"
                  onChange={handleSearch}
                />
              </div>
            </div>
          )}

          {placeholder !== "Date" &&
            options &&
            mergedOptions.map((option: any) => {
              const isSelected = selected.includes(option)
              return (
                <li
                  className="flex items-center cursor-pointer gap-2 px-3 py-2.5"
                  onClick={() => toggleOption(option, placeholder)}
                >
                  <input
                    className=" w-4 h-4 rounded-sm"
                    type="checkbox"
                    checked={isSelected}
                    name=""
                    id=""
                  />
                  <div className="flex items-center">
                    <div
                      className={`w-[20px] h-[20px] text-center shrink-0 rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8] text-[12px] text-primary-200 bg-[#91785B] overflow-hidden`}
                    >
                      {option?.profile_picture ? (
                        <img
                          className="w-full h-full  object-cover"
                          src={option.profile_picture}
                          alt=""
                        />
                      ) : (
                        <div className=" capitalize">
                          {option.display_name
                            ? option.display_name.slice(0, 1)
                            : option.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div
                      className={`flex flex-row w-full text-[14px] pl-3 text-[#404041]`}
                    >
                      <div
                        className={`shrink-0 flex justify-start text-primary-200`}
                      >
                        {option?.display_name
                          ? option?.display_name
                          : option?.name}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}

          {placeholder === "Date" &&
            options?.map((option: any) => {
              return (
                <li
                  className={`${
                    hover === option?.label ? "bg-[#8d8d8d99]" : ""
                  } flex items-center cursor-pointer gap-1 px-2 py-1.5 hover:bg-[#8d8d8d99]`}
                  onClick={() => {
                    dateUpdate(option, placeholder)
                  }}
                >
                  <div className="flex items-center ">
                    <div
                      className={`flex flex-row w-full text-[14px] pl-3 text-[#404041] `}
                    >
                      <div
                        className={`shrink-0 flex justify-start text-primary-200`}
                      >
                        {option.label}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
        </ul>
      )}
      {custom === "custom" && (
        <DateSearch setCustom={setCustom} toggleOption={toggleOption} />
      )}
    </div>
  )
}

export const DateSearch = (props: any) => {
  const { setCustom, toggleOption } = props
  const [calender1, setCalender1] = useState(false)
  const [calender2, setCalender2] = useState(false)
  const [date, setDate] = useState<any>({
    start: new Date().getTime(),
    end: new Date().getTime(),
  })

  const handleSearch = () => {
    setCustom("")
    toggleOption("custom", "Date", date)
  }

  const handleReadValuesCalender = (event: any, type: any) => {
    if (type === "start") {
      setDate((prevDate: any) => ({
        ...prevDate,
        start: new Date(event).getTime(),
      }))
    } else {
      setDate((prevDate: any) => ({
        ...prevDate,
        end: new Date(event).getTime(),
      }))
    }
  }

  return (
    <div>
      <div className="bg-[#00000033] backdrop-blur fixed inset-0 z-[300]">
        <div className="flex justify-center items-center place-content-center w-full h-full overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col h-fit w-[500px] bg-[white] p-[20px] rounded-[15px]">
            <div className="flex flex-row relative mb-5">
              <span className="text-primary-200 text-lg font-bold">
                Range...
              </span>
              <span className="absolute mt-[6px] top-0 right-0">
                <svg
                  onClick={() => setCustom("")}
                  className="cursor-pointer"
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8307 1.84102L10.6557 0.666016L5.9974 5.32435L1.33906 0.666016L0.164062 1.84102L4.8224 6.49935L0.164062 11.1577L1.33906 12.3327L5.9974 7.67435L10.6557 12.3327L11.8307 11.1577L7.1724 6.49935L11.8307 1.84102Z"
                    fill="#A7A9AB"
                  />
                </svg>
              </span>
            </div>
            <div className="flex flex-row w-full justify-between">
              <div className="flex flex-row items-center gap-5 ">
                <div>From</div>
                <div className="border border-solid box-border rounded-[3px] py-2 px-3 outline-none border-[#C4C4C4] w-40 flex">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 14 16"
                    fill="none"
                    className="mr-2.5 cursor-pointer "
                    onClick={() => setCalender1(!calender1)}
                  >
                    <path
                      d="M0 14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V6H0V14.5ZM10 8.375C10 8.16875 10.1687 8 10.375 8H11.625C11.8313 8 12 8.16875 12 8.375V9.625C12 9.83125 11.8313 10 11.625 10H10.375C10.1687 10 10 9.83125 10 9.625V8.375ZM10 12.375C10 12.1687 10.1687 12 10.375 12H11.625C11.8313 12 12 12.1687 12 12.375V13.625C12 13.8313 11.8313 14 11.625 14H10.375C10.1687 14 10 13.8313 10 13.625V12.375ZM6 8.375C6 8.16875 6.16875 8 6.375 8H7.625C7.83125 8 8 8.16875 8 8.375V9.625C8 9.83125 7.83125 10 7.625 10H6.375C6.16875 10 6 9.83125 6 9.625V8.375ZM6 12.375C6 12.1687 6.16875 12 6.375 12H7.625C7.83125 12 8 12.1687 8 12.375V13.625C8 13.8313 7.83125 14 7.625 14H6.375C6.16875 14 6 13.8313 6 13.625V12.375ZM2 8.375C2 8.16875 2.16875 8 2.375 8H3.625C3.83125 8 4 8.16875 4 8.375V9.625C4 9.83125 3.83125 10 3.625 10H2.375C2.16875 10 2 9.83125 2 9.625V8.375ZM2 12.375C2 12.1687 2.16875 12 2.375 12H3.625C3.83125 12 4 12.1687 4 12.375V13.625C4 13.8313 3.83125 14 3.625 14H2.375C2.16875 14 2 13.8313 2 13.625V12.375ZM12.5 2H11V0.5C11 0.225 10.775 0 10.5 0H9.5C9.225 0 9 0.225 9 0.5V2H5V0.5C5 0.225 4.775 0 4.5 0H3.5C3.225 0 3 0.225 3 0.5V2H1.5C0.671875 2 0 2.67188 0 3.5V5H14V3.5C14 2.67188 13.3281 2 12.5 2Z"
                      fill="#A7A9AB"
                    />
                  </svg>

                  <DatePicker
                    className="w-24 outline-none"
                    open={calender1}
                    onClickOutside={() => setCalender1(false)}
                    readOnly
                    maxDate={new Date()}
                    selected={date.start}
                    onChange={(e: any) => handleReadValuesCalender(e, "start")}
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-5">
                <div>To</div>
                <div className="border border-solid box-border rounded-[3px] py-2 px-3 outline-none border-[#C4C4C4] w-40 flex">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 14 16"
                    fill="none"
                    className="mr-2.5 cursor-pointer "
                    onClick={() => setCalender2(!calender2)}
                  >
                    <path
                      d="M0 14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V6H0V14.5ZM10 8.375C10 8.16875 10.1687 8 10.375 8H11.625C11.8313 8 12 8.16875 12 8.375V9.625C12 9.83125 11.8313 10 11.625 10H10.375C10.1687 10 10 9.83125 10 9.625V8.375ZM10 12.375C10 12.1687 10.1687 12 10.375 12H11.625C11.8313 12 12 12.1687 12 12.375V13.625C12 13.8313 11.8313 14 11.625 14H10.375C10.1687 14 10 13.8313 10 13.625V12.375ZM6 8.375C6 8.16875 6.16875 8 6.375 8H7.625C7.83125 8 8 8.16875 8 8.375V9.625C8 9.83125 7.83125 10 7.625 10H6.375C6.16875 10 6 9.83125 6 9.625V8.375ZM6 12.375C6 12.1687 6.16875 12 6.375 12H7.625C7.83125 12 8 12.1687 8 12.375V13.625C8 13.8313 7.83125 14 7.625 14H6.375C6.16875 14 6 13.8313 6 13.625V12.375ZM2 8.375C2 8.16875 2.16875 8 2.375 8H3.625C3.83125 8 4 8.16875 4 8.375V9.625C4 9.83125 3.83125 10 3.625 10H2.375C2.16875 10 2 9.83125 2 9.625V8.375ZM2 12.375C2 12.1687 2.16875 12 2.375 12H3.625C3.83125 12 4 12.1687 4 12.375V13.625C4 13.8313 3.83125 14 3.625 14H2.375C2.16875 14 2 13.8313 2 13.625V12.375ZM12.5 2H11V0.5C11 0.225 10.775 0 10.5 0H9.5C9.225 0 9 0.225 9 0.5V2H5V0.5C5 0.225 4.775 0 4.5 0H3.5C3.225 0 3 0.225 3 0.5V2H1.5C0.671875 2 0 2.67188 0 3.5V5H14V3.5C14 2.67188 13.3281 2 12.5 2Z"
                      fill="#A7A9AB"
                    />
                  </svg>

                  <DatePicker
                    className="w-24 outline-none"
                    open={calender2}
                    onClickOutside={() => setCalender2(false)}
                    readOnly
                    maxDate={new Date()}
                    selected={date.end}
                    onChange={(e: any) => handleReadValuesCalender(e, "end")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row-reverse mt-6 h-full pt-1">
              <button
                onClick={handleSearch}
                className="h-[32px] w-[78px] mr-1 bg-primary-200 text-[#FFFFFF] rounded-[3px] ml-1 mb-1 disabled:opacity-50 "
              >
                {t("Search")}
              </button>
              <button
                onClick={() => setCustom("")}
                className="h-[32px] w-[78px] border-[#404041] border-[1.5px] text-primary-200 rounded-[3px] mb-1"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
