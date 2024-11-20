const Modal = (props: any) => {
  const { icon, title, closeEvent } = props
  return (
    <div
      className="relative  z-[100]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-[#00000040] dark:bg-[#ffffff90] backdrop-blur-sm "></div>
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative animate transition-transform transform overflow-hidden  rounded-[3px] bg-ternary text-left shadow-xl   min-w-[400px] min-h-[200px]">
            {title && (
              <div className=" bg-primary-alpha-20 p-3 flex justify-between">
                <span className="flex">
                  <div className="pr-1 mr-2 text-primary">
                    {icon ? icon : ""}
                  </div>
                  <div className="pt-[2px]">{title}</div>
                </span>
                {closeEvent && (
                  <span
                    onClick={() => closeEvent()}
                    className="cursor-pointer p-1"
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.5187 5.59653C14.8271 5.28819 14.8271 4.7896 14.5187 4.48454C14.2104 4.17948 13.7118 4.17619 13.4067 4.48454L9.50328 8.388L5.59653 4.48126C5.28819 4.17291 4.7896 4.17291 4.48454 4.48126C4.17948 4.7896 4.17619 5.28819 4.48454 5.59325L8.388 9.49672L4.48126 13.4035C4.17291 13.7118 4.17291 14.2104 4.48126 14.5155C4.7896 14.8205 5.28819 14.8238 5.59325 14.5155L9.49672 10.612L13.4035 14.5187C13.7118 14.8271 14.2104 14.8271 14.5155 14.5187C14.8205 14.2104 14.8238 13.7118 14.5155 13.4067L10.612 9.50328L14.5187 5.59653Z"
                        fill="#5C6779"
                      />
                    </svg>
                  </span>
                )}
              </div>
            )}
            <div className="m-4">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Modal
