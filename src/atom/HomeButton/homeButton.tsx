interface HomeButtonType {
  children: any
  cursor?: any
  color?: string
  handleClick?: any
  id?: string
  clicks?: any
  disabled?: boolean
  textColor?: string
  restClass?: any
  rest?: any
}
const HomeButton = ({
  children,
  color,
  handleClick,
  id,
  disabled,
  textColor,
  restClass,
  rest,
  cursor,
  clicks,
}: HomeButtonType) => {
  return (
    <button
      id={id}
      clicks={clicks}
      className={` ${restClass} rounded bg-${color} hover:bg-${color}-light px-[15px] py-[10px] ${cursor} text-[${
        textColor ?? "white"
      }] `}
      style={{ backgroundColor: color }}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
export default HomeButton
