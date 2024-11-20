import { memo, useRef, useState } from 'react'

const FileTransfer = (props: any) => {
    const { selectedFile, setSelectedFile } = props
    const inputFileBox = useRef<any>();
    const handleUploadedFile = (file: any) => {
        setSelectedFile(file)
        inputFileBox.current.value = null;
    }
    const handleClick = () => {
        if (!props.fileUploading) {
            inputFileBox.current.click()
        }
    }

    return (
      <>
        <input
          id="inputFileBox"
          type="file"
          ref={inputFileBox}
          onInputCapture={(event: any) => {
            handleUploadedFile(event.target.files[0]);
          }}
          className="hidden"
        />
        <svg
          id='fileTransfer'
          onClick={handleClick}
          className={`mr-2.5 ${
            props.fileUploading ? " cursor-not-allowed" : "cursor-pointer"
          }`}
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            d="M15.7359 6.28571H10.612V1.14286C10.612 0.511786 10.1021 0 9.47339 0H8.33475C7.70601 0 7.19611 0.511786 7.19611 1.14286V6.28571H2.07223C1.44349 6.28571 0.933594 6.7975 0.933594 7.42857V8.57143C0.933594 9.2025 1.44349 9.71429 2.07223 9.71429H7.19611V14.8571C7.19611 15.4882 7.70601 16 8.33475 16H9.47339C10.1021 16 10.612 15.4882 10.612 14.8571V9.71429H15.7359C16.3647 9.71429 16.8746 9.2025 16.8746 8.57143V7.42857C16.8746 6.7975 16.3647 6.28571 15.7359 6.28571Z"
            fill="#A7A9AB"
          />
          plus
        </svg>
      </>
    );
}

export default memo(FileTransfer)