interface InputFieldType {
  id?: string;
  label: string;
  name: string;
  type?: string;
  value?: any;
  onChange?: any;
  onKeyPress?: any;
  autoFocus?: boolean;
  list?: any;
  flagSingleRecurrenceMeeting?: any;
  restClass?: any;
  rest?: any;
  flagSetEditSingleMeet?: any;
  onKeyDown?: any;
  ref?: any;
  onProgress?: any;
  onBlur?: any;
  autocomplete?: any;
  maxLength?: any;
  minLength?: any;
}
const InputFields = ({
  id,
  label,
  name,
  type,
  value,
  onChange,
  onKeyPress,
  autoFocus,
  list,
  ref,
  flagSetEditSingleMeet,
  flagSingleRecurrenceMeeting,
  onKeyDown,
  restClass,
  onProgress,
  onBlur,
  maxLength,
  autocomplete,
  minLength,
  ...rest
}: InputFieldType) => {
  return (
    <input
      id={id}
      className={`border-[0.5px] border-solid rounded-[3px] box-border border-[#C4C4C4] px-3 py-2 ${restClass} `}
      name={name}
      type={type}
      autoComplete={autocomplete ?? "off"}
      placeholder={label}
      value={value}
      maxLength={maxLength}
      minLength={minLength}
      disabled={
        (flagSingleRecurrenceMeeting === true &&
          flagSetEditSingleMeet === true) ||
        onProgress === true
          ? true
          : false
      }
      onChange={onChange}
      onKeyDown={onKeyDown}
      onKeyPress={onKeyPress}
      autoFocus={autoFocus}
      onBlur={onBlur}
      list={list}
      ref={ref}
      {...rest}
    />
  )
}
export default InputFields
