import React, { useState } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { Fragment } from "react"

interface DropDownType {
  children?: any
  color?: string
  options?: any[]
  restClass?: any
  rest?: any
  value?: any
  onChange?: any
  id?: string
  disabled?: boolean
}
const CustomDropdown = ({
  children,
  options,
  restClass,
  rest,
  value,
  onChange,
  id,
  disabled,
}: DropDownType) => {
  const [selected, setSelected] = useState(options?.[0])
  return (
    <div className="w-full">
      <Listbox disabled={disabled} value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={`relative w-full cursor-default rounded-md border border-[#A7A9AB] bg-[white] py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ${rest}`}
          >
            <span className="block truncate capitalize" id={`optionDefault`}>
              {value?.name ?? value}
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
              className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-[3px] shadow-md bg-[#FEFDFB] py-1 text-base outline-none  sm:text-sm z-[100] ${restClass}`}
            >
              {options?.map((option, personIdx) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default capitalize select-none py-2 pl-2  ${
                      value?.value === option?.value && "bg-[#0000000a]"
                    } pr-4 ${
                      active ? "bg-[#0000000a] text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={option?.value}
                >
                  {({ selected }) => (
                    <>
                      <span id={`${option?.value}`} //gave id to each options
                        className={`block truncate ${
                          value?.value === option?.value
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

export default CustomDropdown
