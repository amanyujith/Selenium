import React, { useState } from "react"
import { t } from "i18next"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../../../store"
import { motion } from "framer-motion"
import { CLOSE_BUTTON } from "../../../../../utils/SVG/svgsRestHere"
import ScreenLoader from "../../../../../atom/ScreenLoader/screenLoader"

function LogoutModal(props: any) {
  const brandingInfo = useSelector(
    (state: RootState) => state.Main.brandingInfo
  )
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handlelogout = () => {
    setLoading(true)
    dispatch(actionCreators.clearLoginSession(true))
  }

  const handleCancelClick = () => {
    props.setclose()
  }

  return (
    <div className="bg-[#00000033] bg-opacity-100 fixed backdrop-blur  inset-0 z-[300] ">
      <div className="flex items-center place-content-center w-full h-full justify-center">
        <motion.div
          initial={{ opacity: 0, translateY: "80px" }}
          animate={{
            opacity: 1,
            translateY: "0px",
            transition: { duration: 0.4 },
          }}
          className="flex flex-col h-[200px] w-[512px] bg-[white] p-[24px] rounded-[15px] "
        >
          <div
            id="LogoutClose"
            className="flex flex-row-reverse mt-2 ml-auto cursor-pointer w-[13px]"
            onClick={() => handleCancelClick()}
          >
            {CLOSE_BUTTON}
          </div>
          <div className="my-[30px] text-left ml-7">
            {t("Dashboard.LogoutMsg")}
            {brandingInfo?.data?.brandname}
            {"?"}
          </div>
          <div className="flex flex-row-reverse">
            <>
              <div className="flex gap-[20px]">
                <button
                  id="Logoutcancel"
                  onClick={() => handleCancelClick()}
                  className="text-[#293241] rounded-[7px] w-fit px-[16px] h-[32px]"
                >
                  {t("Cancel")}
                </button>
                <button
                  id="Logoutok"
                  onClick={() => handlelogout()}
                  className=" bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] rounded-[7px] w-fit min-w-[80px] px-[17px] h-[32px]"
                >
                  {loading ? (
                    <ScreenLoader container={"w-full"} style={"w-4 h-4"} />
                  ) : (
                    t("Logout")
                  )}
                </button>
              </div>
            </>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LogoutModal
