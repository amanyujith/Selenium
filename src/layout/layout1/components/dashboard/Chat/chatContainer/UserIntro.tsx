import { useSelector } from "react-redux";

const UserIntro = (props: any) => {
  const { setViewMore, isGroup } = props;
  const { data: activeChat, groupCheck } = useSelector(
    (state: any) => state.Chat.activeChat
  );
  const profileColors = ["#557BBB", "#B78931", "#91785B"];
  const presenceColors: any = {
    online: "#76B947",
    call: "#EF4036",
  };
  let colorIndex: any =
    (activeChat?.uuid?.match(/\d/g).join("") + new Date().getDate()) %
    profileColors.length;

  return (
    <div
      className="h-[calc(100vh-420px)] flex justify-center items-center"
    >
      <div className="flex flex-col gap-2 justify-center items-center static">
        <div
          style={{
            ...(isGroup === false && {
              backgroundColor: profileColors[colorIndex],
            }),
          }}
          className={`${
            !isGroup
              ? "border-[2px] border-[#E9EBF8] text-[white]"
              : "bg-[#ffffff]"
          } w-[80px] h-[80px] text-center shrink-0 capitalize rounded-bl-none rounded-[50%] text-[52px] text-[white] overflow-hidden`}
        >
          {activeChat.profile_picture ? (
            <img
              className="w-full h-full  object-cover"
              src={activeChat.profile_picture}
              alt=""
            />
          ) : activeChat.members ? (
            <svg
              className="mt-7 ml-4"
              width="44"
              height="30"
              viewBox="0 0 38 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.90927 3.45526C4.90927 2.61139 5.2445 1.80208 5.8412 1.20537C6.43791 0.608664 7.24722 0.273438 8.09109 0.273438C8.93496 0.273438 9.74427 0.608664 10.341 1.20537C10.9377 1.80208 11.2729 2.61139 11.2729 3.45526C11.2729 4.29913 10.9377 5.10843 10.341 5.70514C9.74427 6.30185 8.93496 6.63707 8.09109 6.63707C7.24722 6.63707 6.43791 6.30185 5.8412 5.70514C5.2445 5.10843 4.90927 4.29913 4.90927 3.45526ZM4.45472 12.4155C3.88654 13.0518 3.54563 13.8984 3.54563 14.8189C3.54563 15.7393 3.88654 16.5859 4.45472 17.2223V12.4155ZM12.6593 9.61435C10.9718 11.1087 9.90927 13.2962 9.90927 15.728C9.90927 17.6768 10.5911 19.4666 11.7275 20.87V22.0916C11.7275 23.0973 10.915 23.9098 9.90927 23.9098H6.27291C5.26722 23.9098 4.45472 23.0973 4.45472 22.0916V20.5689C2.307 19.5462 0.818359 17.3587 0.818359 14.8189C0.818359 11.3018 3.66495 8.45526 7.182 8.45526H9.00018C10.3638 8.45526 11.6252 8.88139 12.6593 9.60867V9.61435ZM26.2729 22.0916V20.87C27.4093 19.4666 28.0911 17.6768 28.0911 15.728C28.0911 13.2962 27.0286 11.1087 25.3411 9.60867C26.3752 8.88139 27.6365 8.45526 29.0002 8.45526H30.8184C34.3354 8.45526 37.182 11.3018 37.182 14.8189C37.182 17.3587 35.6934 19.5462 33.5456 20.5689V22.0916C33.5456 23.0973 32.7331 23.9098 31.7275 23.9098H28.0911C27.0854 23.9098 26.2729 23.0973 26.2729 22.0916ZM26.7275 3.45526C26.7275 2.61139 27.0627 1.80208 27.6594 1.20537C28.2561 0.608664 29.0654 0.273438 29.9093 0.273438C30.7531 0.273438 31.5624 0.608664 32.1592 1.20537C32.7559 1.80208 33.0911 2.61139 33.0911 3.45526C33.0911 4.29913 32.7559 5.10843 32.1592 5.70514C31.5624 6.30185 30.7531 6.63707 29.9093 6.63707C29.0654 6.63707 28.2561 6.30185 27.6594 5.70514C27.0627 5.10843 26.7275 4.29913 26.7275 3.45526ZM33.5456 12.4155V17.228C34.1138 16.5859 34.4547 15.745 34.4547 14.8246C34.4547 13.9041 34.1138 13.0575 33.5456 12.4212V12.4155ZM19.0002 0.273438C19.9646 0.273438 20.8895 0.656553 21.5715 1.3385C22.2534 2.02045 22.6365 2.94538 22.6365 3.9098C22.6365 4.87423 22.2534 5.79915 21.5715 6.4811C20.8895 7.16305 19.9646 7.54617 19.0002 7.54617C18.0358 7.54617 17.1108 7.16305 16.4289 6.4811C15.7469 5.79915 15.3638 4.87423 15.3638 3.9098C15.3638 2.94538 15.7469 2.02045 16.4289 1.3385C17.1108 0.656553 18.0358 0.273438 19.0002 0.273438ZM14.4547 15.728C14.4547 16.6484 14.7956 17.4893 15.3638 18.1314V13.3246C14.7956 13.9666 14.4547 14.8075 14.4547 15.728ZM22.6365 13.3246V18.1371C23.2047 17.495 23.5456 16.6541 23.5456 15.7337C23.5456 14.8132 23.2047 13.9666 22.6365 13.3303V13.3246ZM26.2729 15.728C26.2729 18.2678 24.7843 20.4553 22.6365 21.478V23.9098C22.6365 24.9155 21.824 25.728 20.8184 25.728H17.182C16.1763 25.728 15.3638 24.9155 15.3638 23.9098V21.478C13.2161 20.4553 11.7275 18.2678 11.7275 15.728C11.7275 12.2109 14.574 9.36435 18.0911 9.36435H19.9093C23.4263 9.36435 26.2729 12.2109 26.2729 15.728Z"
                fill={profileColors[colorIndex]}
              />
            </svg>
          ) : (
            <div className="mt-[2px] capitalize">
              {activeChat?.name
                ? activeChat?.name?.slice(0, 1)
                : activeChat?.display_name?.slice(0, 1)}
            </div>
          )}
        </div>
        {(() => {
          if (
            activeChat.presence === "online" ||
            activeChat.presence === "call"
          ) {
            return (
              <div className="ml-[45px] -mt-6 static">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="6.5"
                    cy="6.5"
                    r="5.75"
                    fill={presenceColors[activeChat.presence]}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            );
          }
        })()}
        <div className="text-[#404041] text-[18px] font-bold">
          {activeChat.members ? activeChat?.name : activeChat?.display_name}
        </div>
        {activeChat?.personal_status && (
          <div className="text-[#00000059]">
            {activeChat?.personal_status[0]?.name}
          </div>
        )}
        <div
          id="setviewmoreNew"
          onClick={() => {
            setViewMore(true);
          }}
          className={`bg-[#FEF4E9] text-[#293241] cursor-pointer h-[36px] min-w-[100px] rounded-[8px] border-[1px] border-[#B1B1B1] py-4 px-9 flex items-center justify-center`}
        >
          View more
        </div>
      </div>
    </div>
  );
};

export default UserIntro;
