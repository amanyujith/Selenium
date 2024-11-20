import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import whiteboardImage from "../../../../image_1777.jpg"
import { actionCreators } from "../../../../store"
import { t } from "i18next"

const Whiteboard = (props: any) => {
  const dispatch = useDispatch()
  const whiteBoardState = useSelector(
    (state: any) => state.Main.whiteBoardState
  )
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)

  const participantID = useSelector(
    (state: any) => state.Main.selfParticipantID
  )
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )

  const handleWhiteBoard = (status: any) => {
    
    meetingSession.broadCastMessage({ title: "whiteboard", type: "button", status: status }, "broadcast", "whiteboardButton")
    dispatch(actionCreators.setWhiteBoardState(status))
  }


  return (
    <div className="w-full h-full bg-none flex justify-center items-start absolute top-[5%]">
      <div
        id="whiteboardModal"
        className="w-screen h-screen  z-50 backdrop-blur-xl lg:backdrop-blur-lg "
        onClick={() => {
          dispatch(actionCreators.setWhiteBoardModal(false))
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="w-[600px] m-auto outline-1 focus:outline-none z-50 max-h-[400px] mt-32"
        >
          <div className="relative w-[600px]  my-0 mx-auto max-w-3xl min-w-[600px] max-h-[400px]">
            <div className="border-0  rounded-xl shadow-[0_55px_50px_-15px_rgba(0,0,0,0.)] z-100 bg-[white] shadow-slate-200   relative flex  flex-col  w-full bg-white outline-hidden focus:outline-hidden">
              <div className="flex ml-[24px] mt-[18.5px] p-0 justify-between">
                <h3 className="text-[18px] font-semibold text-primary-200 ">
                  {t("Meeting.ShareNow")}
                </h3>
                <div
                  id="whiteboardModalClose"
                  className="mr-[23px] cursor-pointer"
                  onClick={() => {
                    dispatch(actionCreators.setWhiteBoardModal(false))
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.3346 1.84297L11.1596 0.667969L6.5013 5.3263L1.84297 0.667969L0.667969 1.84297L5.3263 6.5013L0.667969 11.1596L1.84297 12.3346L6.5013 7.6763L11.1596 12.3346L12.3346 11.1596L7.6763 6.5013L12.3346 1.84297Z"
                      fill="#A7A9AB"
                    />
                  </svg>
                </div>
              </div>
              <span className={"w-[150px] mt-3"}>{t("Meeting.WhiteBoard")}</span>
              <div className="flex flex-col w-600px h-[360px] items-center">
                <img
                  src={whiteboardImage}
                  className="h-[180px] w-[276px] mt-[12px]"
                  alt=""
                />
                {
                  whiteBoardState !== participantID && whiteBoardState !== "" && whiteBoardState !== "unrestricted" ?
                    <p className=" mt-5">{t("Meeting.WhiteboardIsInProgress")}</p>
                    :
                    <button
                      id="whiteboardButton"
                      className="flex rounded bg-primary-200 w-[198px] h-[32px] text-[16px]  text-[white] mt-[37px] content-start"
                      onClick={() => {
                        ; (whiteBoardState === participantID ||
                          !participantList.some(
                            (participant: any) =>
                              participant.participant_id === whiteBoardState
                          ) ||
                          whiteBoardState === "") &&
                          handleWhiteBoard(
                            whiteBoardState !== "" ? "" : participantID
                          )
                        dispatch(actionCreators.setWhiteBoardModal(false))
                      }}
                    >
                      <div className="ml-[18.5px] my-[9.5px]">
                        <svg
                          width="14"
                          height="15"
                          viewBox="0 0 14 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 14.25C8.7875 14.25 8.6095 14.178 8.466 14.034C8.322 13.8905 8.25 13.7125 8.25 13.5C8.25 13.2875 8.322 13.1095 8.466 12.966C8.6095 12.822 8.7875 12.75 9 12.75C9.5875 12.75 10.1092 12.6345 10.5652 12.4035C11.0217 12.172 11.25 11.9125 11.25 11.625C11.25 11.45 11.1687 11.2875 11.0062 11.1375C10.8437 10.9875 10.6187 10.85 10.3312 10.725L11.4375 9.61875C11.8375 9.85625 12.1562 10.1375 12.3937 10.4625C12.6312 10.7875 12.75 11.175 12.75 11.625C12.75 12.45 12.3562 13.0938 11.5687 13.5563C10.7812 14.0188 9.925 14.25 9 14.25ZM1.93125 8.5125C1.56875 8.3 1.28125 8.053 1.06875 7.7715C0.85625 7.4905 0.75 7.15 0.75 6.75C0.75 6.225 0.94375 5.78425 1.33125 5.42775C1.71875 5.07175 2.4125 4.675 3.4125 4.2375C4.2 3.875 4.703 3.62175 4.9215 3.47775C5.1405 3.33425 5.25 3.175 5.25 3C5.25 2.8 5.128 2.625 4.884 2.475C4.6405 2.325 4.2625 2.25 3.75 2.25C3.4375 2.25 3.175 2.2875 2.9625 2.3625C2.75 2.4375 2.55625 2.5625 2.38125 2.7375C2.24375 2.875 2.075 2.95625 1.875 2.98125C1.675 3.00625 1.49375 2.95 1.33125 2.8125C1.16875 2.6875 1.075 2.525 1.05 2.325C1.025 2.125 1.08125 1.94375 1.21875 1.78125C1.45625 1.49375 1.797 1.25 2.241 1.05C2.6845 0.85 3.1875 0.75 3.75 0.75C4.65 0.75 5.375 0.953 5.925 1.359C6.475 1.7655 6.75 2.3125 6.75 3C6.75 3.4875 6.56875 3.925 6.20625 4.3125C5.84375 4.7 5.1125 5.13125 4.0125 5.60625C3.2875 5.91875 2.8125 6.15 2.5875 6.3C2.3625 6.45 2.25 6.6 2.25 6.75C2.25 6.8625 2.32175 6.972 2.46525 7.0785C2.60925 7.1845 2.80625 7.2875 3.05625 7.3875L1.93125 8.5125ZM12.6375 6.3L9.45 3.1125L10.2375 2.325C10.5375 2.025 10.8967 1.875 11.3152 1.875C11.7342 1.875 12.0875 2.025 12.375 2.325L13.425 3.375C13.725 3.6625 13.875 4.0155 13.875 4.434C13.875 4.853 13.725 5.2125 13.425 5.5125L12.6375 6.3ZM1.5 14.25V11.0625L8.4 4.1625L11.5875 7.35L4.6875 14.25H1.5Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <span className=" mr-[16px] my-[5.5px] ml-[12px]  text-[16px] h-[19px]">
                        {whiteBoardState === participantID || whiteBoardState === "unrestricted" ?
                          t("Meeting.CloseWhiteBoard") :
                          whiteBoardState === "" &&
                          t("Meeting.OpenWhiteBoard")
                        }
                      </span>
                    </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Whiteboard
