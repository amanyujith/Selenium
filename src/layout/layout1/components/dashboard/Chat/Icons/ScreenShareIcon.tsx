import React from "react";

function ScreenShareIcon(props: any) {
  return (
    <div className="cursor-pointer">
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
          fill="url(#paint0_linear_6010_23543)"
        />
        <path
          d="M17.2526 6.75H6.7526C6.1051 6.75 5.58594 7.26917 5.58594 7.91667V16.0833C5.58594 16.7308 6.1051 17.25 6.7526 17.25H17.2526C17.9001 17.25 18.4193 16.7308 18.4193 16.0833V7.91667C18.4193 7.26917 17.9001 6.75 17.2526 6.75ZM17.2526 16.095H6.7526V7.905H17.2526V16.095ZM10.8359 12H9.66927L12.0026 9.66667L14.3359 12H13.1693V14.3333H10.8359V12Z"
          fill="#A7A9AB"
        />
        <rect
          x="0.25"
          y="0.25"
          width="23.5"
          height="23.5"
          rx="11.75"
          stroke="url(#paint1_linear_6010_23543)"
          strokeOpacity="0.12"
          stroke-width="0.5"
        />
        <defs>
          <linearGradient
            id="paint0_linear_6010_23543"
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
            id="paint1_linear_6010_23543"
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
    </div>
  );
}

export default ScreenShareIcon;
