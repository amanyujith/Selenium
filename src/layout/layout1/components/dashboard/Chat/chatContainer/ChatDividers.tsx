import { t } from "i18next";
import { useSelector } from "react-redux";

export const Dividers = ({
  newMessages: (
    <div className="flex flex-row mt-2">
      <hr className="w-full mr-5 text-[#00000049]" />
      <div className=" pl-4 h-6 rounded-[50px] flex flex-row text-[#5C6779] mt-[-12px] text-xs min-w-[110px] w-fit py-1">
        {t("Chat.NewMessages")}
      </div>
      <hr className=" w-full ml-5 text-[#00000049]" />
    </div>
  ),
  historyLoader: (
    <div
      id="loading"
      className="flex justify-center top-0 inset-x-0 relative my-[8px] mt-5"
    >
      <hr className="w-full mr-6 text-[#00000049]" />
      <div className="flex flex-row w-fit mt-[-9px]">
        <svg
          className="animate-spin"
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M21.896 11C21.896 17.0177 17.0177 21.896 11 21.896C4.9823 21.896 0.104004 17.0177 0.104004 11C0.104004 4.9823 4.9823 0.104004 11 0.104004C17.0177 0.104004 21.896 4.9823 21.896 11ZM2.29842 11C2.29842 15.8057 6.19424 19.7016 11 19.7016C15.8057 19.7016 19.7016 15.8057 19.7016 11C19.7016 6.19424 15.8057 2.29842 11 2.29842C6.19424 2.29842 2.29842 6.19424 2.29842 11Z"
            fill="url(#paint0_linear_2993_20663)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_2993_20663"
              x1="8.03545"
              y1="1.24821"
              x2="26.5768"
              y2="13.5484"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#B3B3B3" />
              <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="ml-3 text-xs text-[#5C6779]">{t("Chat.Loading")}..</div>
      </div>
      <hr className=" w-full ml-6 text-[#00000049]" />
    </div>
  ),
  futureLoader: (
    <div
      id="loading"
      className="flex justify-center bottom-0 inset-x-0 relative my-[8px] mb-5"
    >
      <hr className="w-full mr-6 text-[#00000049]" />
      <div className="flex flex-row w-fit mt-[-9px]">
        <svg
          className="animate-spin"
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M21.896 11C21.896 17.0177 17.0177 21.896 11 21.896C4.9823 21.896 0.104004 17.0177 0.104004 11C0.104004 4.9823 4.9823 0.104004 11 0.104004C17.0177 0.104004 21.896 4.9823 21.896 11ZM2.29842 11C2.29842 15.8057 6.19424 19.7016 11 19.7016C15.8057 19.7016 19.7016 15.8057 19.7016 11C19.7016 6.19424 15.8057 2.29842 11 2.29842C6.19424 2.29842 2.29842 6.19424 2.29842 11Z"
            fill="url(#paint0_linear_2993_20663)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_2993_20663"
              x1="8.03545"
              y1="1.24821"
              x2="26.5768"
              y2="13.5484"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#B3B3B3" />
              <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="ml-3 text-xs text-[#5C6779]">{t("Chat.Loading")}..</div>
      </div>
      <hr className=" w-full ml-6 text-[#00000049]" />
    </div>
  ),
});


export const Calldiv = (props:any) => {
const { item, name } = props;
const personalInfo = useSelector((state: any) => state.Chat.personalInfo);
let time = new Date(item.a_ctime).toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
});
function formatDuration(durationInSeconds: number): string {
  if (durationInSeconds < 60) {
    return `${durationInSeconds} sec`;
  } else if (durationInSeconds < 3600) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  } else {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    return `${hours} hr ${minutes} min ${seconds} sec`;
  }
}
switch (item.body.status) {
  case "completed":
    return (
      <div id="Divider" className="flex flex-row py-4 text-notification ">
        <hr className="w-full mr-5 flex-shrink text-[#00000049]" />
        <div className=" h-6 rounded-[50px] flex justify-center text-[#5C6779]  mt-[-12px] text-xs min-w-[190px] w-fit py-1 gap-2 text-center whitespace-nowrap flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
          >
            <path
              d="M7.09795 2.89923C6.89492 2.4088 6.35967 2.14776 5.84814 2.28751L3.52783 2.92032C3.06904 3.04688 2.75 3.46349 2.75 3.93809C2.75 10.4613 8.03926 15.7506 14.5625 15.7506C15.0371 15.7506 15.4537 15.4316 15.5803 14.9728L16.2131 12.6524C16.3528 12.1409 16.0918 11.6057 15.6014 11.4026L13.0701 10.348C12.6403 10.1687 12.142 10.2926 11.8493 10.6538L10.7841 11.9537C8.92783 11.0757 7.4249 9.57276 6.54688 7.71651L7.84678 6.65391C8.20801 6.3586 8.33193 5.8629 8.15264 5.43311L7.09795 2.90186V2.89923Z"
              fill="#5C6779"
            />
          </svg>
          {t("Chat.YouWereInACall")} {formatDuration(item.body.duration)}{" "}
          {t("with")} {name} at {time}
        </div>
        <hr className=" w-full ml-5 flex-shrink text-[#00000049]" />
      </div>
    );
  case "missed":
    return (
      <>
        {item.body.from !== personalInfo.uuid ? (
          <div id="Divider" className="flex flex-row py-4 text-notification">
            <hr className="w-full mr-5 flex-shrink text-[#00000049]" />

            <div className=" h-6 rounded-[50px] text-[#F74B14] flex justify-center  mt-[-12px] text-xs min-w-[190px] w-fit py-1 gap-2 text-center whitespace-nowrap flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
              >
                <g clip-path="url(#clip0_700_26107)">
                  <path
                    d="M6.94692 2.00145C7.22829 2.00145 7.48355 2.16969 7.59088 2.43076C7.6982 2.69182 7.64019 2.99059 7.44004 3.19074L6.30876 4.32202L8.01148 6.02474C8.40598 6.42214 8.94261 6.64259 9.49955 6.64259C10.0565 6.64259 10.5931 6.42214 10.9876 6.02474L14.8078 2.2045C15.0805 1.93183 15.5214 1.93183 15.7912 2.2045C16.061 2.47717 16.0639 2.91808 15.7912 3.18784L11.9739 7.01098C11.3154 7.66654 10.4278 8.03493 9.49955 8.03493C8.57132 8.03493 7.6837 7.66654 7.02524 7.01098L5.32252 5.30536L4.19124 6.43664C3.99109 6.63679 3.69232 6.6948 3.43126 6.58748C3.17019 6.48015 3.00195 6.22489 3.00195 5.94352V2.69762C3.00195 2.31183 3.31233 2.00145 3.69812 2.00145H6.94692ZM1.70823 16.212L0.68138 14.4136C0.400011 13.9234 0.440621 13.3084 0.840919 12.9139C2.32318 11.4549 5.38344 9.42727 9.49955 9.42727C13.6157 9.42727 16.6759 11.4549 18.1582 12.9139C18.5614 13.3084 18.5991 13.9234 18.3177 14.4136L17.2909 16.212C17.0762 16.5862 16.6324 16.7661 16.2176 16.6413L12.9456 15.658C12.554 15.5391 12.2842 15.1794 12.2842 14.7704V13.1402C10.4771 12.5368 8.52201 12.5368 6.71486 13.1402V14.7704C6.71486 15.1794 6.4451 15.542 6.0535 15.658L2.7815 16.6413C2.36669 16.7661 1.92289 16.5891 1.70823 16.212Z"
                    fill="#F74B14"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_700_26107">
                    <rect
                      width="18"
                      height="18"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              {t("Chat.YouHaveMissedCall")} {name} at {time}
            </div>
            <hr className=" w-full ml-5 flex-shrink text-[#00000049]" />
          </div>
        ) : (
          <div id="Divider" className="flex flex-row py-4 text-notification">
            <hr className="w-full mr-5 flex-shrink text-[#00000049]" />
            <div className=" h-6 rounded-[50px] flex justify-center text-[#5C6779] mt-[-12px] text-xs min-w-[190px] w-fit py-1 gap-2 text-center whitespace-nowrap flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="17"
                viewBox="0 0 640 512"
              >
                <path
                  d="M181.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L208 207.3c33.3 70.4 90.3 127.4 160.7 160.7L409 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C545.8 499.9 530 512 512 512C264.6 512 64 311.4 64 64c0-18 12.1-33.8 29.5-38.6l88-24zM399 15c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47L399 49c-9.4-9.4-9.4-24.6 0-33.9z"
                  fill="#5C6779"
                />
              </svg>
              Your call was not answered by {name} at {time}
            </div>
            <hr className=" w-full ml-5 flex-shrink text-[#00000049]" />
          </div>
        )}
      </>
    );
  default:
    return null;
}
}