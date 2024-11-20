// import HomeButton from '../../../../../atom/HomeButton/homeButton';
import { useTranslation } from "react-i18next"
import * as constant from "../../../../../constants/constantValues"

const LoginLeft = (props: any) => {
  const { t } = useTranslation()
  return (
    <div className="w-[480px] pt-16 pl-12 pr-11 text-left flex flex-col justify-center h-full">
      <h2 className="text-3xl font-bold text-[#ffffff]">
        {t("Meeting.CreateAnAccount")}
      </h2>
      <p className="mt-[28px] text-[18px] h-40	overflow-auto	leading-6	text-[#ffffff]">
        {constant.branding_name} {t("Meeting.HoolvaMsg")}{" "}
      </p>
      {/* <div className='flex flex-col	rounded-[10px] mt-4 bg-[#ffffff] bg-opacity-10 p-4'>
        <p className='text-[18px] leading-5	text-[#ffffff]'>{t("Meeting.AlreadyAMember")}</p>
        <span
          className='text-lg cursor-pointer text-link'
          onClick={props.handleLoginModal}
        >
          {t("SignIn")}
        </span>
      </div> */}
    </div>
  )
}

export default LoginLeft
