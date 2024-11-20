import { useTranslation } from "react-i18next"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import InputFields from "../../../../../atom/InputField/inputField"

const SignupForm = (props: any) => {
  const { t } = useTranslation()
  return (
    <div className=" flex flex-col pl-12 pr-12">
      <InputFields
        label={t("Meeting.FirstName")}
        name={"firstname"}
        type={"text"}
        autoFocus={true}
        restClass={"rounded-md  w-[311px] mt-7"}
      />
      <InputFields
        label={t("Meeting.LastName")}
        name={"lastname"}
        restClass={"rounded-md  w-[311px] mt-3"}
        type={"text"}
      />
      <InputFields
        label={t("Meeting.CreatePassword")}
        name={"createpassword"}
        restClass={"rounded-md  w-[311px] mt-3"}
        type={"password"}
      />
      <InputFields
        label={t("Meeting.Email")}
        name={"email"}
        restClass={"rounded-md  w-[311px] mt-3"}
        type={"email"}
      />
      <p className=" text-[14px] leading-4 mt-4 text-primary-100">
        {" "}
        {t("Meeting.ByClicking")}
        <a href="#" className="text-[#1C64D8]">
          {" "}
          {t("Meeting.Terms")}{" "}
        </a>
        {t("Meeting.And")}
        <a href="#" className="text-[#1C64D8]">
          {" "}
          {t("Meeting.PrivacyPolicy")}{" "}
        </a>
      </p>
      <HomeButton
        color={"#F7931F"}
        textColor="#293241"
        restClass={"mt-5 w-[100px] ml-auto text-[#293241]"}
        handleClick={props.handleVerification}
      >
        Create
      </HomeButton>
      <hr className="text-[#00000022] mt-7 w-[311px]" />
      <div className="flex justify-between	rounded-[10px] mt-6 bg-[#ffffff] bg-opacity-10 py-4 w-[279px]">
        <p className="text-[16px] leading-5	text-[#293241]">
          {t("Meeting.AlreadyAMember")}
        </p>
        <span
          className="text-base cursor-pointer text-[#1C64D8]"
          onClick={props.handleLoginModal}
        >
          {t("SignIn")}
        </span>
      </div>
    </div>
  )
}

export default SignupForm
