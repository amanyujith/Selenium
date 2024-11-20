import React from "react"

const ContactDropDown = ({ user }: any) => {
  return (
    <div>
      <div
        key={user?.id}
        id="contactDropdown"
        className="flex flex-row h-fit py-2 px-3  cursor-pointer bg-[#ffffff] hover:bg-[#fffffff0] rounded-md shadow-[4px_4px_12px_0px_#00000012]"
        onClick={() => {}}
      >
        <div
          className={`w-[26px] h-[26px] shrink-0 rounded-bl-none rounded-[50%] text-[15px] border-[2px] border-[#E9EBF8] text-[white] bg-[#91785B] overflow-hidden`}
        >
          {user?.profile_picture ? (
            <img
              className="w-full h-full  object-cover "
              src={user?.profile_picture}
              alt=""
            />
          ) : (
            <div className="ml-[6px] ">
              {user?.display_name?.slice(0, 1)?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="ml-3 text-[#293241] text-base truncate">
          {user?.display_name}
        </div>
      </div>
    </div>
  )
}

export default ContactDropDown
