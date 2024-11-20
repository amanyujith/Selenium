interface TimeFiledType {
  color: string,
  label: string,
  id: any,
  restClass?: any,
  rest?: any,
  value?: any,
  onChange?: any
}


const timeField = ({ color, label, id, value, onChange, restClass, rest }: TimeFiledType) => {
  return (
    <input
      className={`border border-solid box-border rounded-[3px] py-2 px-3 outline-none border-[#404041] ${restClass}`}
      type="time"
      name={id}
      id={id}
      value={value}
      onChange={onChange}
    />
  )
}

export default timeField