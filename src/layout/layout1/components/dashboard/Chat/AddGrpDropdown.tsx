import { useDispatch, useSelector } from "react-redux"

interface IAddGrpDropdown {
  type: string
  item: any
  restClass?: any
  rest?: any
  handleClick?: any
  addMember: any
}

const AddGrpDropdown = ({
  restClass,
  handleClick,
  type,
  addMember,
  item,
  ...rest
}: IAddGrpDropdown) => {
  const profileColors = ["#557BBB", "#B78931", "#91785B"]
  let colorIndex: any =
    (item.uuid?.match(/\d/g).join("") + new Date().getDate()) %
    profileColors.length

  const setMember = (e: any) => {
    e.stopPropagation()
    addMember(item)
  }

  return (
    <div className={"pl-6 flex flex-row w-full z-50 h-[36px]"}>
      <button
        id="addGroupMember"
        onClick={setMember}
        className={`flex items-center w-full text-sm rounded-[3px]`}
      >
        <div
          style={{
            backgroundColor: profileColors[colorIndex],
          }}
          className={`w-[24px] h-[24px] flex justify-center items-center shrink-0 rounded-bl-none rounded-[44%] border-[2px] border-[#E9EBF8] text-[12px] text-[white] bg-[#91785B] overflow-hidden`}
        >
          {item.profile_picture ? (
            <img
              className="w-full h-full  object-cover"
              src={item.profile_picture}
              alt=""
            />
          ) : (
            <div className="capitalize">{item.display_name?.slice(0, 1)}</div>
          )}
        </div>
        <div
          className={`ml-[12px] flex flex-row w-full text-[16px] text-[#6d6e70]`}
        >
          <div className={`w-4/5 flex justify-start`}>
            {" "}
            {item.display_name}{" "}
          </div>
        </div>
      </button>
    </div>
  )
}

export default AddGrpDropdown
