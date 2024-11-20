interface DateFiledType {
  color: string,
  label: string,
  id: any,
  restClass?: any,
  rest?: any,
  value?: any,
  onChange?: any
}

const DateField = ({ color, label, id, value, onChange, restClass, rest }: DateFiledType) => {
  return (
    <input
      className={`border border-solid box-border rounded-[3px] py-2 px-3 outline-none border-[#404041] ${restClass}`}
      type="date"
      name={id}
      id={id}
      value={value}
      onChange={onChange}
    />
  )
}

export default DateField