import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../store";
import { useEffect } from "react";

const CustomNotification = () => {
  const dispatch = useDispatch();
  const { content: content, type } = useSelector(
    (state: any) => state.Chat.setNotification
  );

  const closeModalAfterDelay = () => {
    setTimeout(() => {
      dispatch(
        actionCreators.setNotification({
          content: "",
          type: "",
        })
      );
    }, 4000);
  };

  useEffect(() => {
    if (content !== "") {
      closeModalAfterDelay();
    }
  }, [content]);

  return (
    <div
      className={`animated_fade fadeInDown z-[500] bg-[red] rounded-[15px] min-h-[150px] min-w-[350px] max-w-[350px] text-center flex flex-col  items-center top-16 right-4 absolute shadow-[0_4px_4px_0px_rgba(0,0,0,0.1)]`}
    >
      <svg
        className="self-end mt-5 mr-5 cursor-pointer"
        onClick={() =>
          dispatch(
            actionCreators.setNotification({
              content: "",
              type: "",
            })
          )
        }
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0187 2.09653C11.3271 1.78819 11.3271 1.2896 11.0187 0.984536C10.7104 0.679475 10.2118 0.676195 9.90675 0.984536L6.00328 4.888L2.09653 0.981256C1.78819 0.672915 1.2896 0.672915 0.984536 0.981256C0.679475 1.2896 0.676195 1.78819 0.984536 2.09325L4.888 5.99672L0.981256 9.90347C0.672915 10.2118 0.672915 10.7104 0.981256 11.0155C1.2896 11.3205 1.78819 11.3238 2.09325 11.0155L5.99672 7.112L9.90347 11.0187C10.2118 11.3271 10.7104 11.3271 11.0155 11.0187C11.3205 10.7104 11.3238 10.2118 11.0155 9.90675L7.112 6.00328L11.0187 2.09653Z"
          fill="#5C6779"
        />
      </svg>

      <div className="flex flex-col justify-center items-center gap-4 px-4">
        {type === "success" ? (
          <svg
            className="mt-5"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="39"
              height="39"
              rx="19.5"
              stroke="#76B947"
            />
            <path
              d="M28.8131 14.1869C29.0623 14.436 29.0623 14.8459 28.8131 15.0951L17.8821 26.0261C17.633 26.2753 17.223 26.2753 16.9739 26.0261L11.1869 20.2391C10.9377 19.99 10.9377 19.58 11.1869 19.3309C11.436 19.0817 11.8459 19.0817 12.0951 19.3309L17.428 24.6638L27.9049 14.1869C28.1541 13.9377 28.564 13.9377 28.8131 14.1869Z"
              fill="#76B947"
            />
          </svg>
        ) : (
          <svg
            className="mt-5"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="39"
              height="39"
              rx="19.5"
              stroke="#F74B14"
            />
            <path
              d="M20.6364 11.6545C20.6364 11.2945 20.3418 11 19.9818 11C19.6218 11 19.3273 11.2945 19.3273 11.6545V24.0909C19.3273 24.4509 19.6218 24.7455 19.9818 24.7455C20.3418 24.7455 20.6364 24.4509 20.6364 24.0909V11.6545ZM19.9818 29C20.2422 29 20.4919 28.8966 20.6761 28.7124C20.8602 28.5283 20.9636 28.2786 20.9636 28.0182C20.9636 27.7578 20.8602 27.5081 20.6761 27.3239C20.4919 27.1398 20.2422 27.0364 19.9818 27.0364C19.7214 27.0364 19.4717 27.1398 19.2876 27.3239C19.1034 27.5081 19 27.7578 19 28.0182C19 28.2786 19.1034 28.5283 19.2876 28.7124C19.4717 28.8966 19.7214 29 19.9818 29Z"
              fill="#F74B14"
            />
          </svg>
        )}
        <div
          className={` ${
            type === "success" ? "text-[#F7931F]" : "text-[#F74B14]"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

export default CustomNotification;
