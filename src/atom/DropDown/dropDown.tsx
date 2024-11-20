import { detect } from "detect-browser";

interface DropDownType {
  children?: any;
  color?: string;
  options?: any[];
  restClass?: any;
  rest?: any;
  value?: any;
  onChange?: any;
  id?: string;
  disabled?: boolean;
}

const DropDown = ({
  children,
  options,
  restClass,
  rest,
  value,
  onChange,
  id,
  disabled,
}: DropDownType) => {
  const browser = detect();
  return (
    <div>
      <select
        onChange={onChange}
        value={value}
        className={` ${
          browser?.name === "opera" ? "hover:bg-[#ffffff]" : "border-r-8"
        } border-transparent px-4 outline-[1px] outline outline-offset-[-2px] outline-[#A7A9AB] border-[1px] border-[white] box-border rounded-[8px] p-1 text-sm outline-none bg-[#ffffff] ${restClass}`}
        // value={"Default"}
        // onChange={onChange}
        disabled={disabled}
      >
        {options?.map((option) => {
          return (
            <option
              key={option.value}
              value={option.value}
              selected={option.select ? true : false}
              disabled={option.disabled ? true : false}
              className="appearance-none h-32 p-24"
            >
              {id === "timezone" && `(${option.value}) `}
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default DropDown;
