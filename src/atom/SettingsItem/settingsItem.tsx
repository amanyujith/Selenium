import { useParams } from "react-router-dom"

interface SettingsItemType {
    children?: any,
    label: string,
    restClass?: any,
    rest?: any,
    handleClick?: any,
    key?: string
}
const SettingsItem = ({ children, label, key,restClass, handleClick, ...rest }: SettingsItemType) => {

    
    return (
      <button
        className={`hover:bg-[#FEF3E6] pl-3 py-2.5 pr-2.5 flex items-center w-full text-sm rounded-[3px] text-[#293241] ${restClass}`}
        {...rest}
        onClick={handleClick}
      >
        <span className=" w-6">{children}</span>
        <span id={`${label}`} className=" ml-2.5">{label}</span>
      </button>
    );

}
export default SettingsItem;