import React, { memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import HomeButton from "../../../../atom/HomeButton/homeButton"
import { actionCreators } from "../../../../store"
import { AnimatePresence, motion } from "framer-motion"

const Modal = (props:any) => {
  const {isCall} = props;
  const dispatch = useDispatch()
  const modals = useSelector((state: any) => state.Main.modals)
  const themePalette = useSelector((state: any) => state.Main.themePalette)

  const closeModal = (id: string) => {
    dispatch(actionCreators.removeModal(id))
  }

  return (
    <AnimatePresence mode="wait">
      {modals.length !== 0 ? (
        <motion.div className=" w-screen h-screen absolute top-0 left-0 flex justify-center items-center z-50 bg-[#000000] bg-opacity-10 backdrop-blur-xl lg:backdrop-blur-lg">
          {modals[0].type === "NetworkEvents" ? (
            <div className=" w-full h-6 absolute top-3 flex justify-center items-center bg-[#F75E1D]">
              <div className=" text-base leading-5 text-[#FFFFFF]">
                {modals[0].message}
              </div>
            </div>
          ) : (
            <motion.div
          key="Modalss"
          initial={isCall ? {} : { translateY: "80px" }}
          animate={
            isCall
              ? {}
              : {
                  translateY: "0px",
                  transition: {
                    duration: 0.2,
                    type: "tween",
                    ease: "easeOut",
                  },
                }
          }
          exit={
            isCall
              ? {}
              : {
                  translateY: "80px",
                  transition: {
                    duration: 0.1,
                    type: "tween",
                    ease: "easeOut",
                  },
                }
          }
              className=" min-w-[500px] min-h-[117px] rounded-2xl px-4 pt-4 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#ffffff] z-[60]"
            >
              <div className=" w-full flex justify-between pb-2.5 cursor-pointer">
                <span></span>
                {modals[0].closeButton ? (
                  <svg
                    id="closeReuseModal"
                    onClick={() => closeModal(modals[0].id)}
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                  >
                    <path
                      d="M12.3332 1.84297L11.1582 0.667969L6.49984 5.3263L1.8415 0.667969L0.666504 1.84297L5.32484 6.5013L0.666504 11.1596L1.8415 12.3346L6.49984 7.6763L11.1582 12.3346L12.3332 11.1596L7.67484 6.5013L12.3332 1.84297Z"
                      fill="#A7A9AB"
                    />
                  </svg>
                ) : null}
              </div>
              <div className="">
                {modals[0].header ? (
                  <span className=" text-lg leading-5 text-[#000000] flex justify-start ml-3 mt-[-12px] mb-3">
                    {modals[0].header}
                  </span>
                ) : null}
                <div className="text-[#000000]">{modals[0].message}</div>
              </div>
              <div className=" mt-5 pb-5 flex justify-around">
                {modals[0].buttons.map((button: any) => {
                  return (
                    <HomeButton
                      id="homeButton"
                      handleClick={() => {
                        closeModal(modals[0].id);
                        if (button.callback) {
                          button?.callback();
                        }
                      }}
                      color={themePalette?.primary300}
                      restClass={" flex items-center"}
                    >
                      {button.icon ? (
                        <span className=" mr-2.5">{button.icon}</span>
                      ) : null}
                      <span className="">{button.buttonName}</span>
                    </HomeButton>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default memo(Modal)
