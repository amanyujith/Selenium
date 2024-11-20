interface ListItemButtonType {
    children: any,
    color: string,
    textColor: string,
    onClick?: any,
    id?: any,
    restClass?: any,
    rest?: any
}
const ListItemButton = ({ children, color, textColor, onClick, id, restClass, ...rest }: ListItemButtonType) => {
    return (
        <button
            id={id}
            // className={`bg-${color} hover:bg-${color}-light pl-3 py-2.5 pr-2.5 flex items-center w-full text-sm text-${textColor} ${restClass}`}
            className={`bg-${color} hover:bg-[#C4C4C4] pl-3 py-2.5 pr-2.5 flex items-center w-full text-sm text-${textColor} ${restClass}`}
            onClick={() => onClick()}
            {...rest}
        >
            {children}
        </button>
    )

}
export default ListItemButton;