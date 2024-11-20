import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../../../../store"
import AddCallListOptions from "../PbxDashboard/Contacts/addCallListOptions"

const CallOnHold = () => {
  const pbxCallData = useSelector((state: RootState) => state.Call.pbxCallData)

  return (
    <div className="flex flex-col h-[69px] w-[300px] bg-[#ffffff] overflow-y-scroll overflow-x-hidden">
      {pbxCallData?.callonHold?.map((user: any) => {
        return (
          <div className="flex h-full w-full px-4 pt-2 ">
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
                  {user?.name?.slice(0, 1)?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col ml-2">
              <div className="text-[#293241] text-base truncate">
                {user?.name?.length
                  ? user.name
                  : pbxCallData.type === "incoming"
                  ? user?.caller
                  : user?.callee}
              </div>
              <div className=" text-[#293241] text-[10px] truncate">
                {pbxCallData.type === "incoming" ? user?.caller : user?.callee}
              </div>
              <span className="text-[#F74B14] text-[10px]">On Hold</span>
            </div>
            <div className="flex items-center w-full">
              <AddCallListOptions holdScreen={true} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CallOnHold
