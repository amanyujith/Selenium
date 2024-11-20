import InputField from "../../../../../atom/InputField/inputField"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import copy from "copy-to-clipboard"
import { memo, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import ModalData from "../../../../../constructors/modal/modalData"
import { t } from "i18next"
import { branding_name } from "../../../../../constants/constantValues"

const Invite = (props: any) => {
  const { setInviteModal } = props
  const [clipboardState, setClipboardState] = useState(false)
  const meetingInvite = useSelector((state: any) => state.Main.meetingInvite)
  const dispatch = useDispatch()
  const [emailError, setEmailError] = useState(true)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const meetingId = meetingSession.meetingSessionConfiguration.meetingId
  const password = meetingSession.meetingSessionConfiguration.password
  const [email, setEmail] = useState()
  const [dialIn, setDialIn]: any = useState()
  const [loading, setLoading]: any = useState()
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  useEffect(() => {
    meetingSession.dialIn().then((res: any) => {
      setDialIn(res)
    })
  }, [])

  const handleCopyURL = () => {
    const result = copy(meetingInvite.meeting_url)
    setClipboardState(result)
    setTimeout(() => {
      setClipboardState(false)
    }, 3000)
    //
  }
  const handleInput = (event: any) => {
    setLoading(false)
    /* eslint-disable */
    const regEx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (regEx.test(event.target.value)) {
      setEmailError(false)
      setEmail(event.target.value)
    } else {
      if (!emailError) {
        setEmailError(true)
      }
    }
  }

  const inviteToMeeting = () => {
    setLoading(true)
    let template: string = ""
    if (dialIn) {
      let DialIn = ""
      let DialByLoc = ""
      if (dialIn) {
        DialIn = dialIn.length === 0 ? "" : "One tap mobile\n"
        DialByLoc = dialIn.length === 0 ? "" : "Dial by your location\n"
        dialIn
          .sort((a: any, b: any) => (a.country > b.country ? 1 : -1))
          .map((node: any) => {
            DialIn +=
              "    tel:" +
              node.did +
              "," +
              meetingInvite.meeting_id +
              "#" +
              (meetingSession?.meetingSessionConfiguration?.pin
                ? "," + meetingSession?.meetingSessionConfiguration?.pin + "# "
                : " ") +
              node.country +
              "\n"
            DialByLoc += "    " + node.did + " " + node.country + "\n"
          })
      }
      // if (activeMeeting && !activeMeeting.dial_in) {
      //   DialIn = '';
      //   DialByLoc = '';
      // }
      template = `${meetingInvite.tenant} is inviting you to join a ${branding_name} Meeting

      Meeting URL: ${meetingInvite.meeting_url}

      Meeting Topic: ${meetingInvite.meeting_topic}

      Meeting ID: ${meetingId}`
      if (password) {
        template =
          template +
          `

      Password: ${password}`
      }
      if (meetingSession?.meetingSessionConfiguration?.pin) {
        template =
          template +
          `

      Phone PIN: ${meetingSession?.meetingSessionConfiguration?.pin}`
      }

      template =
        template +
        `

      ${
        meetingInvite?.date_time
          ? "Date & Time: " + meetingInvite?.date_time
          : ""
      }
      ${brandingInfo.data.dial_in ? DialIn : ""}
      ${brandingInfo.data.dial_in ? DialByLoc : ""}`
    }

    meetingSession
      .sendEmail(
        [email],
        `${loggedInUserInfo?.given_name}`,
        `${loggedInUserInfo?.family_name}`,
        template,
        `${loggedInUserInfo?.email}`,
        `JOIN ${branding_name} ${meetingSession?.meetingSessionConfiguration?.name}`
      )
      .then((data: any) => {
        let modal = new ModalData({
          message: t("Meeting.InviteMailSendSuccessfully"),
          type: "SDK INFO",
          closeButton: false,
          buttons: [
            {
              buttonName: t("Dashboard.OK"),
              callback: inviteDone,
            },
          ],
        })
        dispatch(actionCreators.addModal(modal))
      })
      .catch((error: any) => {
        let modal = new ModalData({
          message: t("Meeting.MailNotSend"),
          type: "SDK INFO",
          closeButton: false,
          buttons: [
            {
              buttonName: t("Dashboard.OK"),
              callback: inviteDone,
            },
          ],
        })
        dispatch(actionCreators.addModal(modal))
        throw error
      })

    const inviteDone = () => {
      dispatch(actionCreators.setInviteModal(false))
    }
  }

  return (
    <div className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center z-20 bg-[#000000] bg-opacity-10 backdrop-blur-xl lg:backdrop-blur-lg">
      <div className=" relative w-[525px] h-48 p-4 rounded-2xl shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#FFFFFF]">
        <div className=" flex justify-between">
          <span className=" text-lg leading-5 mb-9 text-primary-200">
            {t("Meeting.InvitePeople")}
          </span>
          <svg
            id="closeinviteemail"
            onClick={() => dispatch(actionCreators.setInviteModal(false))}
            className=" mr-4 cursor-pointer"
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
        </div>
        <div className=" flex justify-between ml-[1px]">
          <InputField
            id="EmailPlaceholder"
            label={t("Dashboard.EmailPlaceholder")}
            name={"invite"}
            onChange={handleInput}
            restClass={"w-[388px]"}
          />
          <HomeButton
            id="inviteToMeetingss"
            color={emailError || loading ? "primary-alpha-20" : "primary-200"}
            handleClick={inviteToMeeting}
            disabled={emailError}
            cursor={
              emailError ? "cursor-not-allowed" : loading ? "cursor-wait" : ""
            }
            restClass={"w-[100px]"}
          >
            {t("Invite")}
          </HomeButton>
        </div>
        <div
          id="handleCopyURLMeeting"
          onClick={() => handleCopyURL()}
          className=" absolute bottom-6 right-7 flex text-[16px] leading-5 cursor-pointer py-2 text-link"
        >
          <svg
            className="mr-2"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
          >
            <path
              d="M12.375 16.25V17.6562C12.375 18.1222 11.9972 18.5 11.5312 18.5H1.96875C1.50275 18.5 1.125 18.1222 1.125 17.6562V4.71875C1.125 4.25275 1.50275 3.875 1.96875 3.875H4.5V14.2812C4.5 15.3668 5.38316 16.25 6.46875 16.25H12.375ZM12.375 4.15625V0.5H6.46875C6.00275 0.5 5.625 0.877754 5.625 1.34375V14.2812C5.625 14.7472 6.00275 15.125 6.46875 15.125H16.0312C16.4972 15.125 16.875 14.7472 16.875 14.2812V5H13.2188C12.7547 5 12.375 4.62031 12.375 4.15625ZM16.6279 3.06539L14.3096 0.747113C14.1514 0.58889 13.9368 0.500001 13.713 0.5L13.5 0.5V3.875H16.875V3.66199C16.875 3.43822 16.7861 3.22362 16.6279 3.06539Z"
              fill="#A7A9AB"
            />
          </svg>
          {clipboardState ? t("Meeting.Copied") : t("Meeting.CopyMeetingURL")}
        </div>
      </div>
    </div>
  )
}

export default memo(Invite)
