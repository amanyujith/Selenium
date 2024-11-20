import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../../../store";

interface ChatMicButtonType {
  onClick?: any;
}

const ChatMicButton = ({ onClick }: ChatMicButtonType) => {
    const dispatch = useDispatch();
    
    const Mic = useSelector((state: any) => state.Chat.chatCallMic);

    const onMicClick = () => {
  dispatch(actionCreators.setChatCallMic(!Mic));
    }
  return (
    <div onClick={onMicClick} className="cursor-pointer">
      {!Mic ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="24"
            height="24"
            rx="12"
            fill="url(#paint0_linear_2_99)"
          />
          <path
            d="M15.7091 13.4013L15.0078 12.6416C15.1117 12.4502 15.1923 12.2364 15.2497 12C15.3066 11.7636 15.3351 11.516 15.3351 11.2571H16.2701C16.2701 11.6736 16.2209 12.059 16.1224 12.4133C16.0235 12.7681 15.8857 13.0974 15.7091 13.4013ZM13.6987 11.2065L10.6597 7.8974V7.20519C10.6597 6.73247 10.8104 6.3329 11.1117 6.00649C11.413 5.68009 11.7818 5.51688 12.2182 5.51688C12.6545 5.51688 13.0234 5.68009 13.3247 6.00649C13.626 6.3329 13.7766 6.73247 13.7766 7.20519V10.8182C13.7766 10.897 13.7689 10.9672 13.7536 11.0289C13.7378 11.091 13.7195 11.1502 13.6987 11.2065ZM11.7506 17.8416V15.613C10.7221 15.4892 9.86764 15.0137 9.18732 14.1867C8.5066 13.3592 8.16623 12.3827 8.16623 11.2571H9.1013C9.1013 12.1913 9.4053 12.9876 10.0133 13.6458C10.6209 14.3044 11.3558 14.6338 12.2182 14.6338C12.613 14.6338 12.987 14.555 13.3403 14.3974C13.6935 14.2398 14.0052 14.026 14.2753 13.7558L14.9455 14.4818C14.6442 14.7857 14.3013 15.036 13.9169 15.2328C13.5325 15.43 13.1221 15.5567 12.6857 15.613V17.8416H11.7506ZM17.3455 18.5L6 6.20909L6.65455 5.5L18 17.774L17.3455 18.5Z"
            fill="#A7A9AB"
          />
          <rect
            x="0.25"
            y="0.25"
            width="23.5"
            height="23.5"
            rx="11.75"
            stroke="url(#paint1_linear_2_99)"
            strokeOpacity="0.12"
            stroke-width="0.5"
          />
          <defs>
            <linearGradient
              id="paint0_linear_2_99"
              x1="12"
              y1="0"
              x2="12"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1D1D1D" />
              <stop offset="1" stopColor="#404041" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_2_99"
              x1="12"
              y1="0"
              x2="12"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="24"
            height="24"
            rx="12"
            fill="url(#paint0_linear_6010_23585)"
          />
          <mask
            id="mask0_6010_23585"
            maskUnits="userSpaceOnUse"
            x="4"
            y="4"
            width="16"
            height="16"
          >
            <rect x="4" y="4" width="16" height="16" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_6010_23585)">
            <path
              d="M12.0026 13.332C11.447 13.332 10.9748 13.1376 10.5859 12.7487C10.197 12.3598 10.0026 11.8876 10.0026 11.332V7.33203C10.0026 6.77648 10.197 6.30425 10.5859 5.91536C10.9748 5.52648 11.447 5.33203 12.0026 5.33203C12.5582 5.33203 13.0304 5.52648 13.4193 5.91536C13.8082 6.30425 14.0026 6.77648 14.0026 7.33203V11.332C14.0026 11.8876 13.8082 12.3598 13.4193 12.7487C13.0304 13.1376 12.5582 13.332 12.0026 13.332ZM11.3359 17.9987V15.9487C10.1804 15.7931 9.22483 15.2765 8.46927 14.3987C7.71372 13.5209 7.33594 12.4987 7.33594 11.332H8.66927C8.66927 12.2543 8.99438 13.0403 9.6446 13.69C10.2944 14.3403 11.0804 14.6654 12.0026 14.6654C12.9248 14.6654 13.711 14.3403 14.3613 13.69C15.011 13.0403 15.3359 12.2543 15.3359 11.332H16.6693C16.6693 12.4987 16.2915 13.5209 15.5359 14.3987C14.7804 15.2765 13.8248 15.7931 12.6693 15.9487V17.9987H11.3359Z"
              fill="#A7A9AB"
            />
          </g>
          <rect
            x="0.25"
            y="0.25"
            width="23.5"
            height="23.5"
            rx="11.75"
            stroke="url(#paint1_linear_6010_23585)"
            strokeOpacity="0.12"
            stroke-width="0.5"
          />
          <defs>
            <linearGradient
              id="paint0_linear_6010_23585"
              x1="12"
              y1="0"
              x2="12"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1D1D1D" />
              <stop offset="1" stopColor="#404041" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_6010_23585"
              x1="12"
              y1="0"
              x2="12"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
};

export default ChatMicButton;
