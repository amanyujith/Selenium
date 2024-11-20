interface RadioButtonType {
  radioData: any
  name: string
  onChange?: any
  restClass?: any
  rest?: any
}

const RadioButton = ({
  radioData,
  name,
  onChange,
  restClass,
  rest,
}: RadioButtonType) => {
  return (
    <>
      {radioData.map((item: any, index: any) => {
        return (
          <div key={item.id} className={`flex items-center ${restClass}`}>
            <input
              type="radio"
              id={item.id}
              name={name}
              onChange={onChange}
              checked={item.checked}
              className="cursor-pointer accent-[#F7931F]"
            />
            <label className="ml-2.5 text-[16px] leading-5" htmlFor={item.id}>
              {item.label}
            </label>
          </div>
        )
      })}
    </>
  )
}

export default RadioButton
