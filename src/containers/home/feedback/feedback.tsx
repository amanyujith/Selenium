import { useEffect, useState } from "react"
import HomeButton from "../../../atom/HomeButton/homeButton";
import { useNavigate } from "react-router-dom";
import path from "../../../navigation/routes.path";
import { useSelector } from "react-redux";
import * as constant from "../../../constants/constantValues";
import { t } from "i18next";


const Feedback = () => {

    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [showSubmitOption, setShowSubmitOption] = useState(false);
    const meetingSession = useSelector((state: any) => state.Main.meetingSession)
    const loginState = useSelector((state: any) => state.Flag.loginState)
    const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
    const theme = useSelector((state: any) => state.Main.setTheme)

    useEffect(() => {
        if (!meetingSession) {
            navigate(path.AUTHSCREEN)
            window.location.reload();
        }
    }, [meetingSession])

    // useEffect(() => {
    //     if (loginState)
    //         navigate(path.DASHBOARD)
    //     else
    //         navigate(path.HOME)
    // })

    const onRatingChange = (ratingValue: any) => {
        setRating(ratingValue);
        if (!showSubmitOption)
            setShowSubmitOption(true)
    }

    const handleClose = () => {
        // if (loginState)
        //     navigate(path.DASHBOARD)
        // else
            navigate(path.HOME)
    }

    return (
      <div className=" w-screen h-screen grid place-content-center">
        {/** Feedback page Design strat */}
        {/* <div className="w-[836px] h-[650px] shadow-[0_1px_4px_0px_rgba(0,0,0,0.25)] rounded-r-[3px] rounded-l-[40px] ">
                <div className=" w-full text-right mt-9 pr-11 text-sm text-link">Signup for FREE</div>
                <div className=" mx-14 mt-12">
                    <h2 className=" pt-6 text-[28px] leading-9 font-bold text-center">Do you like to keep a copy?</h2>
                    <div className="flex p-[20px] justify-center">
                        <CheckBox color={""} label={"Chat history"} id={'ChatHistory'} restClass={'mr-5'} />
                        <CheckBox color={""} label={"Shared files"} id={'SharedFiles'} />
                    </div>
                    <HomeButton color={'primary-200'}>
                        Download Now
                    </HomeButton>
                    <p className="text-[18px] leading-5 mt-10 pt-5 pb-2.5 text-center font-bold border-t-[0.2px] border-[#c4c4c4] ">How was your overall meeting experience? </p>
                    <div className="flex flex-col items-center">
                        <StarRatings
                            rating={rating}
                            starDimension="30px"
                            starRatedColor="#F7931D"
                            changeRating={onRatingChange}
                            numberOfStars={5}
                            starHoverColor="#F7931D"
                        />
                        {!showSubmitOption ?
                            <div className=" my-7 text-link">
                                <Link to={path.HOME}>Ask me later</Link>

                            </div> :
                            <>
                                {
                                    (rating < 5) ?
                                        <FeedbackQuestion /> :
                                        null
                                }
                                <HomeButton color={'primary-200'} restClass={'mt-8 w-20'}>
                                    Submit
                                </HomeButton>
                            </>
                        }
                    </div>
                </div>
            </div> */}
        {/**Feedback Page design End */}

        {/** Temporary Design */}
        {!loginState ? (
          <div className="flex flex-col justify-center items-center relative ">
            <img
              className="max-h-[250px] max-w-[250px]"
              src={brandingInfo?.data?.logos?.logoDark}
            />
            {/* <div className=' w-full flex justify-between pb-2.5'> */}

            <span className=" text-base text-primary-200 font-bold mb-[5px]">
              {t("Meeting.MeetingEnded")}
            </span>
            {/* <svg onClick={() => handleClose()} width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M12.3332 1.84297L11.1582 0.667969L6.49984 5.3263L1.8415 0.667969L0.666504 1.84297L5.32484 6.5013L0.666504 11.1596L1.8415 12.3346L6.49984 7.6763L11.1582 12.3346L12.3332 11.1596L7.67484 6.5013L12.3332 1.84297Z" fill="#A7A9AB" />
                    </svg> */}
            {/* </div> */}
            <div className="">
              <div className="text-[#000000] text-center">
                {t("Meeting.ThankYouForUsing")}{" "}
                {brandingInfo?.data?.brandname === "devBrand"
                  ? "NCS"
                  : brandingInfo?.data?.brandname}
              </div>
            </div>
            <div className=" mt-5 flex justify-around">
              <HomeButton
                id="feedbackOk"
                handleClick={() => {
                  handleClose();
                }}
                color={"primary-200"}
                restClass={" flex items-center"}
              >
                {t("Dashboard.OK")}
              </HomeButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center relative ">
            <img
              className="max-h-[250px] max-w-[250px]"
              src={brandingInfo?.data?.logos?.logoDark}
            />
            {/* <div className=' w-full flex justify-between pb-2.5'> */}

            <span className=" text-base text-primary-200 font-bold mb-[5px]">
              {t("Meeting.MeetingEnded")}
            </span>
            {/* <svg onClick={() => handleClose()} width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M12.3332 1.84297L11.1582 0.667969L6.49984 5.3263L1.8415 0.667969L0.666504 1.84297L5.32484 6.5013L0.666504 11.1596L1.8415 12.3346L6.49984 7.6763L11.1582 12.3346L12.3332 11.1596L7.67484 6.5013L12.3332 1.84297Z" fill="#A7A9AB" />
                    </svg> */}
            {/* </div> */}
            <div className="">
              <div className="text-[#000000] text-center">
                {t("Meeting.ThankYouForUsing")} {""}
                {brandingInfo?.data?.brandname === "devBrand"
                  ? "NCS"
                  : brandingInfo?.data?.brandname}
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
export default Feedback;