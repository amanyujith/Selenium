import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useNotificationSound from "../hooks/useNotificationSound"
import { t } from "i18next"
import { actionCreators } from "../../../../../../store"
import { detect } from "detect-browser"

interface IncomingCallModalType {
  title: string
  onclose: (hangup: boolean) => void
  onAccept: (video: boolean) => void
  incomingCallData: any
  existingCallInfo: any
  answerLater: () => void
}

const IncomingCallModal = ({
  title,
  onclose,
  onAccept,
  incomingCallData,
  existingCallInfo,
  answerLater
}: IncomingCallModalType) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const browser = detect()
  // useEffect(() =>{
  //   var audio = new Audio(ringSound);
  //   audio.loop = true;
  //   audio.play();

  //   return () => {
  //     audio.pause()
  //   }
  // },[])
  const reasons = [
    { message: "In a meeting" },
    { message: "Will call you  later" },
    { message: "Please message me" },
  ]

  const sendMsg = (input: any) => {
    console.log(incomingCallData, "incomingCallData")
    chatInstance?.publishMessage(
      "text",
      incomingCallData.uuid,
      incomingCallData.isGroup,
      {
        message: { plainText: input, type: "v1" },
      }
    )
    onclose(true)
    dispatch(actionCreators.rejectReasonModal(false))
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true
      audioRef.current
        .play()
        .then(() => {
          // Playback started successfully, handle any further actions if needed
        })
        .catch((error: any) => {
          // Playback failed, handle the error if needed
        })
    }
    return () => {
      if (audioRef.current) audioRef.current.pause()
    }
  }, [])

  return (
    <div className="flex flex-col justify-center items-center place-content-center w-full h-full">
      <div
        className={`${
          browser?.name === "opera" ? "pb-10" : ""
        }  bg-[#EBEDEF] w-full h-2/3 flex flex-col`}
      >
        <div className="w-full h-1/4 flex flex-row gap-3 p-4 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
          >
            <path
              d="M16.1264 2.96954L11.7836 7.31231H14.1409C14.3729 7.31231 14.5628 7.50216 14.5628 7.7342C14.5628 7.96623 14.3729 8.15608 14.1409 8.15608H10.7658C10.5338 8.15608 10.3439 7.96623 10.3439 7.7342V4.35912C10.3439 4.12709 10.5338 3.93724 10.7658 3.93724C10.9978 3.93724 11.1877 4.12709 11.1877 4.35912V6.7164L15.5305 2.37363C15.6939 2.21015 15.9629 2.21015 16.1264 2.37363C16.2898 2.53711 16.2898 2.80606 16.1264 2.96954ZM11.425 9.80934C11.723 9.44547 12.2239 9.32154 12.6564 9.50875L15.6096 10.7744C16.0736 10.9722 16.332 11.4731 16.2266 11.9636L15.5937 14.9168C15.4883 15.4019 15.0585 15.75 14.5628 15.75C14.4019 15.75 14.2411 15.7474 14.0802 15.7395H14.0776C13.9563 15.7342 13.8376 15.7289 13.7164 15.7184C7.58849 15.2886 2.75 10.1785 2.75 3.93724C2.75 3.43889 3.09805 3.0091 3.58322 2.90626L6.53641 2.27343C7.02949 2.16796 7.52784 2.42637 7.7256 2.89044L8.99125 5.84363C9.17582 6.27606 9.05453 6.77705 8.69066 7.075L7.62013 7.95041C8.32415 9.16333 9.33667 10.1759 10.5496 10.8799L11.425 9.80934ZM14.5628 14.9062C14.663 14.9062 14.7473 14.8377 14.7684 14.7401L15.4013 11.7869C15.4223 11.6894 15.3696 11.5892 15.2773 11.5496L12.3241 10.284C12.2371 10.247 12.1369 10.2708 12.0789 10.3446L11.2035 11.4151C10.9425 11.7342 10.4863 11.8186 10.1277 11.6103C8.78558 10.8324 7.66759 9.71442 6.89238 8.37494C6.68407 8.01633 6.76845 7.56017 7.0875 7.29913L8.15803 6.42372C8.23186 6.36307 8.25559 6.26288 8.21867 6.1785L6.95302 3.22531C6.91347 3.13302 6.81327 3.08029 6.71571 3.10138L3.76252 3.73421C3.66232 3.75267 3.59377 3.83704 3.59377 3.93724C3.59377 9.99128 8.50081 14.901 14.5548 14.9062H14.5628Z"
              fill="#293241"
            />
          </svg>
          <div className="text-[16px] text-[#404041]">Incoming Call</div>
        </div>
        <div className="w-full h-3/4 flex flex-col gap-1 justify-center items-center">
          <div
            className={`w-[40px] h-[40px] shrink-0 text-center rounded-bl-none rounded-[50%] text-[20px] border-[2px] border-[#E9EBF8] text-[white] bg-[#91785B] overflow-hidden relative`}
          >
            {incomingCallData?.profile_picture &&
            incomingCallData?.profile_picture !== "undefined" ? (
              <img
                className="w-full h-full  object-cover "
                src={incomingCallData.profile_picture}
                alt=""
              />
            ) : incomingCallData?.isGroup ? (
              <svg
                className="mt-[10px] ml-[6px]"
                width="25"
                height="19"
                viewBox="0 0 16 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.01927 3.33333C6.77483 3.33333 6.57216 3.23889 6.41127 3.05C6.24994 2.86111 6.19149 2.63889 6.23594 2.38333L6.4026 1.35C6.46927 0.961111 6.65549 0.638889 6.96127 0.383333C7.2666 0.127778 7.61371 0 8.0026 0C8.4026 0 8.75549 0.127778 9.06127 0.383333C9.3666 0.638889 9.5526 0.961111 9.61927 1.35L9.78594 2.38333C9.83038 2.63889 9.77216 2.86111 9.61127 3.05C9.44994 3.23889 9.24705 3.33333 9.0026 3.33333H7.01927ZM7.2526 2.33333H8.76927L8.63594 1.51667C8.61371 1.36111 8.54149 1.236 8.41927 1.14133C8.29705 1.04711 8.15816 1 8.0026 1C7.84705 1 7.71083 1.04711 7.59394 1.14133C7.47749 1.236 7.40816 1.36111 7.38594 1.51667L7.2526 2.33333ZM2.28594 3.88333C2.07483 3.89444 1.88883 3.85267 1.72794 3.758C1.5666 3.66378 1.46372 3.51667 1.41927 3.31667C1.39705 3.22778 1.39149 3.14156 1.4026 3.058C1.41372 2.97489 1.43594 2.89444 1.46927 2.81667C1.46927 2.82778 1.46372 2.80556 1.4526 2.75C1.44149 2.72778 1.39705 2.61667 1.31927 2.41667C1.29705 2.29444 1.31105 2.18333 1.36127 2.08333C1.41105 1.98333 1.46927 1.89444 1.53594 1.81667C1.54705 1.81667 1.55816 1.80556 1.56927 1.78333C1.59149 1.60556 1.6666 1.45556 1.7946 1.33333C1.92216 1.21111 2.08038 1.15 2.26927 1.15C2.29149 1.15 2.38038 1.16667 2.53594 1.2H2.58594C2.63038 1.14444 2.69149 1.10556 2.76927 1.08333C2.84705 1.06111 2.92483 1.05 3.0026 1.05C3.11372 1.05 3.21105 1.06667 3.2946 1.1C3.37772 1.13333 3.44149 1.18333 3.48594 1.25C3.49705 1.25 3.50549 1.25267 3.51127 1.258L3.51927 1.26667C3.6526 1.27778 3.76927 1.31933 3.86927 1.39133C3.96927 1.46378 4.04705 1.56111 4.1026 1.68333C4.11372 1.75 4.11927 1.81111 4.11927 1.86667C4.11927 1.92222 4.10816 1.98333 4.08594 2.05L4.1026 2.1C4.16927 2.17778 4.21927 2.25267 4.2526 2.32467C4.28594 2.39711 4.3026 2.47778 4.3026 2.56667C4.3026 2.6 4.27483 2.7 4.21927 2.86667V2.93333C4.23038 2.94444 4.24149 3.02222 4.2526 3.16667C4.2526 3.36667 4.16927 3.536 4.0026 3.67467C3.83594 3.81378 3.63594 3.88333 3.4026 3.88333H2.28594ZM13.1859 3.91667C12.8637 3.91667 12.5915 3.80556 12.3693 3.58333C12.147 3.36111 12.0359 3.09444 12.0359 2.78333C12.0359 2.66111 12.0526 2.55289 12.0859 2.45867C12.1193 2.364 12.1637 2.26667 12.2193 2.16667L11.8193 1.81667C11.7193 1.73889 11.7026 1.64444 11.7693 1.53333C11.8359 1.42222 11.9248 1.36667 12.0359 1.36667H13.1693C13.4915 1.36667 13.7637 1.47778 13.9859 1.7C14.2082 1.92222 14.3193 2.18889 14.3193 2.5V2.78333C14.3193 3.09444 14.2082 3.36111 13.9859 3.58333C13.7637 3.80556 13.497 3.91667 13.1859 3.91667ZM0.335938 6.86667V6.05C0.335938 5.59445 0.569271 5.22778 1.03594 4.95C1.5026 4.67222 2.1026 4.53333 2.83594 4.53333C2.98038 4.53333 3.11371 4.536 3.23594 4.54133C3.35816 4.54711 3.47483 4.56111 3.58594 4.58333C3.46372 4.78333 3.36927 4.99444 3.3026 5.21667C3.23594 5.43889 3.2026 5.67222 3.2026 5.91667V6.86667H0.335938ZM4.33594 6.86667V5.95C4.33594 5.30556 4.67483 4.79178 5.3526 4.40867C6.03038 4.02511 6.91371 3.83333 8.0026 3.83333C9.1026 3.83333 9.98883 4.02511 10.6613 4.40867C11.3333 4.79178 11.6693 5.30556 11.6693 5.95V6.86667H4.33594ZM13.1693 4.53333C13.9137 4.53333 14.5164 4.67222 14.9773 4.95C15.4386 5.22778 15.6693 5.59445 15.6693 6.05V6.86667H12.8026V5.91667C12.8026 5.67222 12.7719 5.43889 12.7106 5.21667C12.6497 4.99444 12.5582 4.78333 12.4359 4.58333C12.5582 4.56111 12.6804 4.54711 12.8026 4.54133C12.9248 4.536 13.047 4.53333 13.1693 4.53333ZM8.0026 4.83333C7.31371 4.83333 6.71927 4.92489 6.21927 5.108C5.71927 5.29156 5.44149 5.51667 5.38594 5.78333V5.86667H10.6359V5.78333C10.5693 5.51667 10.2888 5.29156 9.7946 5.108C9.29994 4.92489 8.7026 4.83333 8.0026 4.83333Z"
                  fill="#ffffff"
                />
              </svg>
            ) : (
              <div className="mt-1 capitalize">
                {incomingCallData?.name?.slice(0, 1)}
              </div>
            )}
          </div>
          <div className="text-[#404041] text-[16px] mt-3 font-bold">
            {incomingCallData?.isGroup
              ? incomingCallData?.groupName
              : incomingCallData?.name}
          </div>
          <div className="text-[#404041] text-[16px] mt-1"> Calling you...</div>
        </div>
        {existingCallInfo ? (
          <div className="text-xs text-[#fe3932]  text-center py-2">
            <div>
              {t("Call.AlreadyInCall")} {existingCallInfo?.name}
            </div>
            <div>{t("Call.AcceptPrompt")}</div>
          </div>
        ) : null}
      </div>

      <div
        className={`bg-[#FFFFFF] w-full flex flex-row justify-around items-center h-1/3 px-4`}
      >
        <button
          className="text-[14px] font-sans h-[35px] w-fit flex flex-row gap-2 justify-center items-center text-[#293241] mr-1 rounded-[7px] shrink-0"
          onClick={() => dispatch(actionCreators.setIncomingCallModal(false))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
          >
            <path
              d="M3.90088 2.375C2.78247 2.375 1.875 3.28247 1.875 4.40088C1.875 4.80078 1.99146 5.17432 2.19141 5.48853C2.29468 5.65332 2.51221 5.69946 2.677 5.59619C2.8418 5.49292 2.88794 5.27539 2.78467 5.1106C2.65503 4.90625 2.57812 4.66235 2.57812 4.40088C2.57812 3.66919 3.16919 3.07812 3.90088 3.07812C4.24805 3.07812 4.56445 3.21216 4.79956 3.43188C4.94238 3.56372 5.16431 3.55493 5.29614 3.41431C5.42798 3.27368 5.41919 3.04956 5.27856 2.91772C4.91602 2.57935 4.43262 2.375 3.90088 2.375ZM9.72144 2.91553C9.57861 3.04736 9.56982 3.26929 9.70386 3.41211C9.83789 3.55493 10.0576 3.56372 10.2004 3.42969C10.4355 3.21216 10.752 3.07812 11.0991 3.07812C11.8286 3.07812 12.4219 3.66919 12.4219 4.40088C12.4219 4.66235 12.3472 4.90625 12.2153 5.1106C12.1121 5.27539 12.1582 5.49072 12.323 5.59619C12.4878 5.70166 12.7031 5.65332 12.8086 5.48853C13.0085 5.17432 13.125 4.80078 13.125 4.40088C13.125 3.28247 12.2175 2.375 11.0991 2.375C10.5674 2.375 10.0818 2.57935 9.72144 2.91553ZM3.17798 13.5217L4.27661 12.4231C5.14014 13.1724 6.26733 13.625 7.5 13.625C8.73267 13.625 9.85986 13.1724 10.7234 12.4231L11.822 13.5217C11.9583 13.658 12.1824 13.658 12.3186 13.5217C12.4548 13.3855 12.4548 13.1614 12.3186 13.0251L11.22 11.9265C11.9692 11.063 12.4219 9.93579 12.4219 8.70312C12.4219 5.98511 10.218 3.78125 7.5 3.78125C4.78198 3.78125 2.57812 5.98511 2.57812 8.70312C2.57812 9.93579 3.03076 11.063 3.78003 11.9265L2.6814 13.0251C2.54517 13.1614 2.54517 13.3855 2.6814 13.5217C2.81763 13.658 3.04175 13.658 3.17798 13.5217ZM7.5 4.48438C8.61888 4.48438 9.69194 4.92885 10.4831 5.72002C11.2743 6.51119 11.7188 7.58424 11.7188 8.70312C11.7188 9.82201 11.2743 10.8951 10.4831 11.6862C9.69194 12.4774 8.61888 12.9219 7.5 12.9219C6.38112 12.9219 5.30806 12.4774 4.51689 11.6862C3.72572 10.8951 3.28125 9.82201 3.28125 8.70312C3.28125 7.58424 3.72572 6.51119 4.51689 5.72002C5.30806 4.92885 6.38112 4.48438 7.5 4.48438ZM7.85156 6.24219C7.85156 6.04883 7.69336 5.89062 7.5 5.89062C7.30664 5.89062 7.14844 6.04883 7.14844 6.24219V9.05469C7.14844 9.16455 7.20117 9.27002 7.28906 9.33594L8.69531 10.3906C8.85132 10.5071 9.07104 10.4763 9.1875 10.3203C9.30395 10.1643 9.27319 9.94458 9.11719 9.82813L7.85156 8.87891V6.24219Z"
              fill="#293241"
            />
          </svg>
          Snooze
        </button>
        {modal && (
          <div className="w-[170px] absolute z-50 top-20 bg-[#FEFDFB] text-[#767676] right-24 rounded-[10x] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ">
            <div className="text-[#B1B1B1] text-[10px] pl-3 pt-1">
              Reject with message
            </div>
            {reasons.map((item: any) => {
              return (
                <div
                  //onClick={() => timeManage(item)}
                  className="cursor-pointer py-1 pl-3 flex text-sm hover:bg-[#6e6e6e37]"
                >
                  <div onClick={() => sendMsg(item?.message)}>
                    {item?.message}
                  </div>
                </div>
              );
            })}
            <hr className="text-[#0000001F]" />
            <div
              onClick={() => {
                dispatch(actionCreators.rejectReasonModal(true));
                dispatch(actionCreators.setIncomingCallModal(false));
              }}
              className="cursor-pointer py-2 pl-3 flex text-sm hover:bg-[#6e6e6e37]"
            >
              Custom
            </div>
          </div>
        )}
        <button className="text-[14px] border-[1px] border-[#B1B1B1] font-sans h-[35px] w-[100px] flex flex-row gap-2 justify-center items-center text-[#767676] mr-1 rounded-[7px] shrink-0">
          <div onClick={() => onclose(true)}> Reject </div>
          <svg
            width="2"
            height="26"
            viewBox="0 0 2 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="1"
              y1="-1.84932e-08"
              x2="1"
              y2="26"
              stroke="black"
              stroke-opacity="0.12"
            />
          </svg>
          <svg
            onClick={() => setModal(!modal)}
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
          >
            <path
              d="M15.5229 7.14797L9.89792 12.773C9.84568 12.8253 9.78365 12.8668 9.71536 12.8951C9.64707 12.9234 9.57388 12.9379 9.49996 12.9379C9.42603 12.9379 9.35284 12.9234 9.28455 12.8951C9.21627 12.8668 9.15423 12.8253 9.10199 12.773L3.47699 7.14797C3.39823 7.0693 3.34459 6.96903 3.32284 6.85986C3.3011 6.75069 3.31224 6.63752 3.35485 6.53468C3.39747 6.43184 3.46963 6.34396 3.56221 6.28216C3.6548 6.22036 3.76364 6.18741 3.87495 6.1875H15.125C15.2363 6.18741 15.3451 6.22036 15.4377 6.28216C15.5303 6.34396 15.6024 6.43184 15.6451 6.53468C15.6877 6.63752 15.6988 6.75069 15.6771 6.85986C15.6553 6.96903 15.6017 7.0693 15.5229 7.14797Z"
              fill="#5C6779"
            />
          </svg>
        </button>
        <button
          className="bg-[#E57600] hover:bg-[#CC6900] font-bold text-[#FFFFFF] flex flex-row  justify-center gap-1 h-[35px] w-[100px] shrink-0 items-center  p-3 rounded-[7px]"
          onClick={() => onAccept(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
          >
            <path
              d="M9.83984 8.37478C9.51953 8.23806 9.14844 8.32791 8.92773 8.59744L8.2793 9.39041C7.38086 8.86892 6.63086 8.11892 6.10938 7.22048L6.90039 6.574C7.16992 6.3533 7.26172 5.9822 7.12305 5.66189L6.18555 3.47439C6.03906 3.13064 5.66992 2.93923 5.30469 3.01736L3.11719 3.48611C2.75781 3.56228 2.5 3.88064 2.5 4.24978C2.5 8.87283 6.08398 12.658 10.625 12.9783C10.7129 12.9842 10.8027 12.99 10.8926 12.9939C10.8926 12.9939 10.8926 12.9939 10.8945 12.9939C11.0137 12.9978 11.1309 13.0017 11.252 13.0017C11.6211 13.0017 11.9395 12.7439 12.0156 12.3845L12.4844 10.197C12.5625 9.83181 12.3711 9.46267 12.0273 9.31619L9.83984 8.37869V8.37478ZM11.2441 12.3748C6.75977 12.3709 3.125 8.73611 3.125 4.24978C3.125 4.17556 3.17578 4.11306 3.24805 4.09744L5.43555 3.62869C5.50781 3.61306 5.58203 3.65212 5.61133 3.72048L6.54883 5.90798C6.57617 5.97244 6.55859 6.04666 6.50391 6.08962L5.71094 6.73806C5.47461 6.93142 5.41211 7.26931 5.56641 7.53494C6.14258 8.52908 6.9707 9.3572 7.96289 9.93142C8.22852 10.0857 8.56641 10.0232 8.75977 9.78689L9.4082 8.99392C9.45312 8.93923 9.52734 8.92166 9.58984 8.949L11.7773 9.8865C11.8457 9.9158 11.8848 9.99001 11.8691 10.0623L11.4004 12.2498C11.3848 12.322 11.3203 12.3728 11.248 12.3728C11.2461 12.3728 11.2441 12.3728 11.2422 12.3728L11.2441 12.3748Z"
              fill="#293241"
            />
          </svg>
          <div className="text-[14px] font-sans  w-full">Answer</div>
        </button>
      </div>
      {/* <div className="flex flex-col justify-center items-center h-fit min-w-[300px] p-5">
        <div
          className={`w-[39px] h-[39px] mt-5 shrink-0 text-center rounded-bl-none rounded-[50%] text-[20px] ring-1 ring-offset-1 ring-[#A7A9AB] text-[#000000]  overflow-hidden relative`}
        >
          {incomingCallData?.profile_picture &&
          incomingCallData?.profile_picture !== "undefined" ? (
            <img
              className="w-full h-full  object-cover "
              src={incomingCallData.profile_picture}
              alt=""
            />
          ) : incomingCallData.isGroup ? (
            <svg
              className="mt-[10px] ml-[6px]"
              width="25"
              height="19"
              viewBox="0 0 16 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.01927 3.33333C6.77483 3.33333 6.57216 3.23889 6.41127 3.05C6.24994 2.86111 6.19149 2.63889 6.23594 2.38333L6.4026 1.35C6.46927 0.961111 6.65549 0.638889 6.96127 0.383333C7.2666 0.127778 7.61371 0 8.0026 0C8.4026 0 8.75549 0.127778 9.06127 0.383333C9.3666 0.638889 9.5526 0.961111 9.61927 1.35L9.78594 2.38333C9.83038 2.63889 9.77216 2.86111 9.61127 3.05C9.44994 3.23889 9.24705 3.33333 9.0026 3.33333H7.01927ZM7.2526 2.33333H8.76927L8.63594 1.51667C8.61371 1.36111 8.54149 1.236 8.41927 1.14133C8.29705 1.04711 8.15816 1 8.0026 1C7.84705 1 7.71083 1.04711 7.59394 1.14133C7.47749 1.236 7.40816 1.36111 7.38594 1.51667L7.2526 2.33333ZM2.28594 3.88333C2.07483 3.89444 1.88883 3.85267 1.72794 3.758C1.5666 3.66378 1.46372 3.51667 1.41927 3.31667C1.39705 3.22778 1.39149 3.14156 1.4026 3.058C1.41372 2.97489 1.43594 2.89444 1.46927 2.81667C1.46927 2.82778 1.46372 2.80556 1.4526 2.75C1.44149 2.72778 1.39705 2.61667 1.31927 2.41667C1.29705 2.29444 1.31105 2.18333 1.36127 2.08333C1.41105 1.98333 1.46927 1.89444 1.53594 1.81667C1.54705 1.81667 1.55816 1.80556 1.56927 1.78333C1.59149 1.60556 1.6666 1.45556 1.7946 1.33333C1.92216 1.21111 2.08038 1.15 2.26927 1.15C2.29149 1.15 2.38038 1.16667 2.53594 1.2H2.58594C2.63038 1.14444 2.69149 1.10556 2.76927 1.08333C2.84705 1.06111 2.92483 1.05 3.0026 1.05C3.11372 1.05 3.21105 1.06667 3.2946 1.1C3.37772 1.13333 3.44149 1.18333 3.48594 1.25C3.49705 1.25 3.50549 1.25267 3.51127 1.258L3.51927 1.26667C3.6526 1.27778 3.76927 1.31933 3.86927 1.39133C3.96927 1.46378 4.04705 1.56111 4.1026 1.68333C4.11372 1.75 4.11927 1.81111 4.11927 1.86667C4.11927 1.92222 4.10816 1.98333 4.08594 2.05L4.1026 2.1C4.16927 2.17778 4.21927 2.25267 4.2526 2.32467C4.28594 2.39711 4.3026 2.47778 4.3026 2.56667C4.3026 2.6 4.27483 2.7 4.21927 2.86667V2.93333C4.23038 2.94444 4.24149 3.02222 4.2526 3.16667C4.2526 3.36667 4.16927 3.536 4.0026 3.67467C3.83594 3.81378 3.63594 3.88333 3.4026 3.88333H2.28594ZM13.1859 3.91667C12.8637 3.91667 12.5915 3.80556 12.3693 3.58333C12.147 3.36111 12.0359 3.09444 12.0359 2.78333C12.0359 2.66111 12.0526 2.55289 12.0859 2.45867C12.1193 2.364 12.1637 2.26667 12.2193 2.16667L11.8193 1.81667C11.7193 1.73889 11.7026 1.64444 11.7693 1.53333C11.8359 1.42222 11.9248 1.36667 12.0359 1.36667H13.1693C13.4915 1.36667 13.7637 1.47778 13.9859 1.7C14.2082 1.92222 14.3193 2.18889 14.3193 2.5V2.78333C14.3193 3.09444 14.2082 3.36111 13.9859 3.58333C13.7637 3.80556 13.497 3.91667 13.1859 3.91667ZM0.335938 6.86667V6.05C0.335938 5.59445 0.569271 5.22778 1.03594 4.95C1.5026 4.67222 2.1026 4.53333 2.83594 4.53333C2.98038 4.53333 3.11371 4.536 3.23594 4.54133C3.35816 4.54711 3.47483 4.56111 3.58594 4.58333C3.46372 4.78333 3.36927 4.99444 3.3026 5.21667C3.23594 5.43889 3.2026 5.67222 3.2026 5.91667V6.86667H0.335938ZM4.33594 6.86667V5.95C4.33594 5.30556 4.67483 4.79178 5.3526 4.40867C6.03038 4.02511 6.91371 3.83333 8.0026 3.83333C9.1026 3.83333 9.98883 4.02511 10.6613 4.40867C11.3333 4.79178 11.6693 5.30556 11.6693 5.95V6.86667H4.33594ZM13.1693 4.53333C13.9137 4.53333 14.5164 4.67222 14.9773 4.95C15.4386 5.22778 15.6693 5.59445 15.6693 6.05V6.86667H12.8026V5.91667C12.8026 5.67222 12.7719 5.43889 12.7106 5.21667C12.6497 4.99444 12.5582 4.78333 12.4359 4.58333C12.5582 4.56111 12.6804 4.54711 12.8026 4.54133C12.9248 4.536 13.047 4.53333 13.1693 4.53333ZM8.0026 4.83333C7.31371 4.83333 6.71927 4.92489 6.21927 5.108C5.71927 5.29156 5.44149 5.51667 5.38594 5.78333V5.86667H10.6359V5.78333C10.5693 5.51667 10.2888 5.29156 9.7946 5.108C9.29994 4.92489 8.7026 4.83333 8.0026 4.83333Z"
                fill="#404041"
              />
            </svg>
          ) : (
            <div className="mt-1 capitalize">
              {incomingCallData.name?.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="text-[#000000] mt-3 font-bold">
          {incomingCallData.isGroup
            ? incomingCallData.groupName
            : incomingCallData.name}
        </div>
        <div className="text-[#000000] mt-3 ">{t("Call.CallingYou")}</div>
        {existingCallInfo ? (
          <div className="text-xs text-[#fe3932]  text-center py-2">
            <div>
              {t("Call.AlreadyInCall")} {existingCallInfo.name}
            </div>
            <div>{t("Call.AcceptPrompt")}</div>
          </div>
        ) : null}

        <div className="flex flex-row gap-6 mt-4">
          <svg
            className="cursor-pointer"
            onClick={() => onAccept(false)}
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="3" fill="#B6B860" />
            <path
              d="M23.0088 24C21.1839 24 19.3709 23.5633 17.5698 22.6898C15.7681 21.817 14.1593 20.6726 12.7434 19.2566C11.3274 17.8407 10.183 16.236 9.31021 14.4425C8.43674 12.649 8 10.8319 8 8.99115C8 8.70796 8.0944 8.47198 8.28319 8.28319C8.47198 8.0944 8.70796 8 8.99115 8H12.059C12.3107 8 12.5269 8.07457 12.7075 8.22372C12.8887 8.37349 13.0029 8.56637 13.0501 8.80236L13.5929 11.587C13.6244 11.823 13.6165 12.0354 13.5693 12.2242C13.5221 12.413 13.4199 12.5782 13.2625 12.7198L11.115 14.8437C11.8545 16.1023 12.7393 17.2429 13.7694 18.2655C14.8002 19.2881 15.9685 20.177 17.2743 20.9322L19.3746 18.8083C19.532 18.6509 19.717 18.5408 19.9297 18.4779C20.1418 18.4149 20.3579 18.3992 20.5782 18.4307L23.1976 18.9735C23.4336 19.0206 23.6265 19.1308 23.7763 19.3038C23.9254 19.4769 24 19.6893 24 19.941V23.0089C24 23.292 23.9056 23.528 23.7168 23.7168C23.528 23.9056 23.292 24 23.0088 24Z"
              fill="white"
            />
          </svg>

          <svg
            className="mt-2 cursor-pointer"
            onClick={() => onclose(true)}
            width="27"
            height="11"
            viewBox="0 0 27 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.4969 0.46875C15.8128 0.46875 18.1087 0.936777 20.3844 1.87283C22.6601 2.80969 24.684 4.22465 26.4563 6.11771C26.6375 6.29896 26.7281 6.51525 26.7281 6.76658C26.7281 7.01872 26.6375 7.22535 26.4563 7.38646L23.6771 10.1052C23.516 10.2663 23.3247 10.3569 23.1031 10.3771C22.8816 10.3972 22.6802 10.3368 22.499 10.1958L19.0552 7.59792C18.9142 7.49722 18.8083 7.37115 18.7374 7.21971C18.6673 7.06907 18.6323 6.90313 18.6323 6.72188V3.15729C17.7865 2.87535 16.9358 2.65906 16.0803 2.50842C15.224 2.35697 14.3628 2.28125 13.4969 2.28125C12.6309 2.28125 11.7702 2.35697 10.9147 2.50842C10.0584 2.65906 9.20729 2.87535 8.36146 3.15729V6.72188C8.36146 6.90313 8.32601 7.06907 8.25513 7.21971C8.18504 7.37115 8.07951 7.49722 7.93854 7.59792L4.49479 10.1958C4.31354 10.3368 4.11215 10.3972 3.89063 10.3771C3.6691 10.3569 3.47778 10.2663 3.31667 10.1052L0.5375 7.38646C0.35625 7.20521 0.265625 6.99375 0.265625 6.75208C0.265625 6.51042 0.35625 6.29896 0.5375 6.11771C2.28958 4.22465 4.30831 2.80969 6.59367 1.87283C8.87983 0.936777 11.1809 0.46875 13.4969 0.46875Z"
              fill="#F75E1D"
            />
          </svg>
        </div>
      </div> */}
      {incomingCallData?.participants?.length > 0 && (
        <div className="bg-[#F7931F1F] italic text-[#5C6779] text-sm p-2 w-full text-center">
          {incomingCallData?.participants?.length} other participants in this
          call
        </div>
      )}
    </div>
  );
}

export default IncomingCallModal