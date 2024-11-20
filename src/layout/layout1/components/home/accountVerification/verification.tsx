import { t } from "i18next";
import * as constant from "../../../../../constants/constantValues";


const Verification = (props: any) => {
    return (
        <div className=" flex flex-col pl-4 pr-4 w-[403px] h-[440px] rounded-r-[40px]">
            <img className=' h-10 mt-16 mx-auto' src={constant.branding_logo_dark} />
            <h2 className=" pt-8 text-[32px] leading-9 font-bold text-main">{t("Meeting.AccountVerification")}</h2>
            <p className="text-[18px] leading-5 mt-7 text-left text-[#58585B]">{t("Meeting.EmailText")}</p>
            <p className="text-[16px] leading-5 mt-11 text-left text-[#58585B]">{t("Meeting.WrongEmail")} <span onClick={props.handleSignupModal} className='text-link'> {t("SignUp")} </span> {t("Page")}</p>
            <div className="text-[20px] leading-5 mt-16 text-left text-link ">{t("Meeting.ResendEmail")} </div>
        </div>
    )
}

export default Verification