import React, { useState } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { Fragment } from "react"
import timezones from "timezones-list"

interface TimeZoneType {
  children?: any;
  color?: string;
  restClass?: any;
  rest?: any;
  value?: any;
  onChange?: any;
  id?: string;
  restOptionClass?:any;
}

const TimeZone = ({
  children,
    restClass,
  rest,
  value,
  onChange,
  id,
  restOptionClass,
}: TimeZoneType) => {
  


  return (
    <div>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button
            className={`relative w-full cursor-default rounded-md border border-[#A7A9AB] bg-[white] py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ${rest}`}
          >
            <span className="block truncate">
              {timezones.find((time) => time?.tzCode == value?.country)?.name ??
                `(${value.time}) ${value.country}`}{" "}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M9.10898 11.1387C9.2543 11.284 9.49336 11.284 9.63867 11.1387L13.3887 7.38867C13.534 7.24336 13.534 7.0043 13.3887 6.85898C13.2434 6.71367 13.0043 6.71367 12.859 6.85898L9.37383 10.3441L5.88867 6.85898C5.74336 6.71367 5.5043 6.71367 5.35898 6.85898C5.21367 7.0043 5.21367 7.24336 5.35898 7.38867L9.10898 11.1387Z"
                  fill="#5C6779"
                />
              </svg>
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`absolute mt-1 max-h-60 w-full  overflow-auto rounded-[3px] shadow-md bg-[#FEFDFB] py-1 text-base outline-none  sm:text-sm z-[100] ${restClass}`}
            >
              {timezones?.map((option, personIdx) => (
                <Listbox.Option
                  key={option.label}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-2  ${
                      value.value === option.tzCode && "bg-[#0000000a]"
                    } pr-4 ${
                      active ? "bg-[#0000000a] text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={{
                    country: option?.tzCode,
                    time: option.utc,
                  }}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          value.time === option.tzCode
                            ? "font-semibold"
                            : "font-normal"
                        }`}
                      >
                        {option?.name}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default TimeZone;
