interface ThemedButtonType {
    children: any,
    color: string,
    rest?: any
}
const ThemedButton = ({ children, color, ...rest }: ThemedButtonType) => {
    return (
        <button
            className={`rounded-md bg-${color} hover:bg-${color}-light text-text-base px-3 py-1`}
            {...rest}
        >
            {children}
         </button>
    )

}
export default ThemedButton;