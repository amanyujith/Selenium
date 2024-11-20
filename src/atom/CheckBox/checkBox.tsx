interface CheckBoxType {
  color: string;
  label: string;
  id?: any;
  checked?: any;
  onChange?: any;
  restClass?: any;
  rest?: any;
  value?: any;
  flagSingleRecurrenceMeeting?: any;
  flagSetEditSingleMeet?: any;
  labelClass?:any;
  onProgress ?: any;
  restCheckClass?:any;
}
const checkBox = ({
  checked,
  value,
  onChange,
  color,
  label,
  id,
  flagSingleRecurrenceMeeting,
  flagSetEditSingleMeet,
  restClass,
  labelClass,
  onProgress,
  restCheckClass,
  rest,
}: CheckBoxType) => {
  return (
    <div className={`CheckBox flex items-center ${restClass}`}>
      <label className="relative ml-2.5 text-[16px] leading-5">
        <input
          className={`InputCheckBox w-4 h-4 rounded-[20px] mr-2.5 accent-[#F7931F] ${restCheckClass}`}
          checked={checked}
          onChange={onChange}
          value={value}
          type="checkbox"
          id={id}
          name=""
          disabled={
            (flagSingleRecurrenceMeeting === true &&
              flagSetEditSingleMeet === true) ||
            onProgress === true
              ? true
              : false
          }
        />
        <span
          className={`${
            (flagSingleRecurrenceMeeting === true &&
              flagSetEditSingleMeet === true) ||
            onProgress === true
              ? "disabled: cursor-not-allowed bg-[lightgray]"
              : ""
          } checkmark absolute top-[0.5px] left-0 w-4 h-4 rounded-[3px] cursor-pointer  ${labelClass}`}
        ></span>
        {label}
      </label>
    </div>
  );
};
export default checkBox;
