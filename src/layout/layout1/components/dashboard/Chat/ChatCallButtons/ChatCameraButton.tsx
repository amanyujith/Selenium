import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../../../store";

interface ChatCameraButtonType {
  onClick?: any;
}

const ChatCameraButton = ({ onClick }: ChatCameraButtonType) => {
    const dispatch = useDispatch();
    
    const Cam = useSelector((state: any) => state.Chat.chatCallCamera);

    const onCamClick = () => {

  dispatch(actionCreators.setChatCallCamera(!Cam));
    }
  return (
    <div onClick={onCamClick} className="cursor-pointer">
      {Cam ? (
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
          fill="url(#paint0_linear_6010_23589)"
        />
        <mask
          id="mask0_6010_23589"
          maskUnits="userSpaceOnUse"
          x="5"
          y="5"
          width="14"
          height="14"
        >
          <rect x="5" y="5" width="14" height="14" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_6010_23589)">
          <path
            d="M7.33073 16.6654C7.0099 16.6654 6.73534 16.5512 6.50706 16.3229C6.2784 16.0943 6.16406 15.8195 6.16406 15.4987V8.4987C6.16406 8.17786 6.2784 7.90331 6.50706 7.67503C6.73534 7.44636 7.0099 7.33203 7.33073 7.33203H14.3307C14.6516 7.33203 14.9263 7.44636 15.155 7.67503C15.3833 7.90331 15.4974 8.17786 15.4974 8.4987V11.1237L17.8307 8.79036V15.207L15.4974 12.8737V15.4987C15.4974 15.8195 15.3833 16.0943 15.155 16.3229C14.9263 16.5512 14.6516 16.6654 14.3307 16.6654H7.33073Z"
            fill="#A7A9AB"
          />
        </g>
        <rect
          x="0.25"
          y="0.25"
          width="23.5"
          height="23.5"
          rx="11.75"
          stroke="url(#paint1_linear_6010_23589)"
          strokeOpacity="0.12"
          stroke-width="0.5"
        />
        <defs>
          <linearGradient
            id="paint0_linear_6010_23589"
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
            id="paint1_linear_6010_23589"
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
          fill="url(#paint0_linear_6010_31087)"
        />
        <mask
          id="mask0_6010_31087"
          maskUnits="userSpaceOnUse"
          x="5"
          y="5"
          width="14"
          height="14"
        >
          <rect x="5" y="5" width="14" height="14" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_6010_31087)">
          <path
            d="M17.426 14.6961L15.3698 12.6544V13.7482L9.23021 7.62318H14.3052C14.6066 7.62318 14.8594 7.72526 15.0635 7.92943C15.2677 8.13359 15.3698 8.38151 15.3698 8.67318V11.3419L17.426 9.30026V14.6961ZM16.6531 17.919L5.89062 7.17109L6.51771 6.55859L17.2656 17.3065L16.6531 17.919ZM7.59687 7.63776L15.3552 15.3961C15.3358 15.6683 15.2265 15.8991 15.0274 16.0885C14.8279 16.2783 14.5872 16.3732 14.3052 16.3732H7.66979C7.37812 16.3732 7.13021 16.2711 6.92604 16.0669C6.72187 15.8628 6.61979 15.6148 6.61979 15.3232V8.67318C6.61979 8.40095 6.71468 8.16509 6.90446 7.96559C7.09385 7.76648 7.32465 7.6572 7.59687 7.63776Z"
            fill="#A7A9AB"
          />
        </g>
        <rect
          x="0.25"
          y="0.25"
          width="23.5"
          height="23.5"
          rx="11.75"
          stroke="url(#paint1_linear_6010_31087)"
          strokeOpacity="0.12"
          stroke-width="0.5"
        />
        <defs>
          <linearGradient
            id="paint0_linear_6010_31087"
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
            id="paint1_linear_6010_31087"
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

export default ChatCameraButton;
