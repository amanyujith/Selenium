import React, { useEffect } from "react"
import { Fragment, useState } from "react"
import { Combobox, Transition } from "@headlessui/react"
import { DOWN_ARROW } from "../../utils/SVG/svgsRestHere"

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

const SearchableDropdown = ({
  children,
  options,
  restClass,
  rest,
  value,
  onChange,
  id,
  disabled,
}: DropDownType) => {
  const [selected, setSelected] = useState(value)

  const [query, setQuery] = useState("")

const filteredPeople = query === ""
  ? options || []  // If options is undefined, default to an empty array
  : (() => {
      const filteredItems = (options || []).filter((option) => option?.name?.toLowerCase().includes(query.toLowerCase()));
      const remainingItems = (options || []).filter((option) => !option?.name?.toLowerCase().includes(query.toLowerCase()));
      return [...filteredItems, ...remainingItems];
    })();

  
    
    useEffect(() => {
      setSelected(value)
      setQuery(value.name)
    }, [value])

  return (
    <div>
      <Combobox
        value={selected}
        onChange={(e) => {
          setSelected(e);
          if (onChange) {
            onChange(e);
            setQuery(e.name);
          }
        }}
      >
        <div  className="relative mt-1">
          <div
            className={`relative w-full cursor-default overflow-hidden rounded-lg bg-[white] text-left sm:text-sm flex`}
          >
            <Combobox.Input
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.code) e.stopPropagation();
              }}
              className={` border-none outline-none py-2 pl-2  text-sm leading-5 text-gray-900 ${restClass}`}
              displayValue={(person) => query}
              placeholder={"Update your status"}
              maxLength={100}
              onChange={(event) => {
                setQuery(event.target.value);
                onChange(event.target.value);
              }}
            />
            <Combobox.Button id="statusDropdown" className="inset-y-0 right-0 flex items-center px-1 pb-1 mt-1">
              {DOWN_ARROW}
            </Combobox.Button>
          </div>
          {filteredPeople?.length != 0 && (
            <Combobox.Options
              className={`absolute mt-1 max-h-48  overflow-auto rounded-md bg-[white] py-1 text-base shadow-lg   sm:text-sm ${rest}`}
            >
              {filteredPeople?.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  No Matches
                </div>
              ) : (
                filteredPeople?.map((person,index) => (
                  <Combobox.Option
                    key={person.id}
                    id={`status-${index}`}
                    className={({ active }) =>
                      `relative cursor-default outline-none bg-[white] select-none  py-2 pl-3 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-"
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span id="emojistatus"
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          <span className="pr-4">{person.emoji}</span>
                          {person.name}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
}

export default SearchableDropdown
