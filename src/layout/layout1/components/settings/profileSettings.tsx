import { t } from 'i18next';
import { useCallback, useState } from 'react';
import HomeButton from '../../../../atom/HomeButton/homeButton';
import InputFields from '../../../../atom/InputField/inputField';
import { useDropzone } from "react-dropzone"
import Cropper from "react-easy-crop"

const ProfileSettings = () => {
  const [profilePicture, setProfilePicture] = useState(null)
    const [crop, setCrop] = useState({ x: 50, y: 50 })
    const [zoom, setZoom] = useState(1)
    const onDrop = useCallback((acceptedFiles) => {
      // Do something with the files
        setProfilePicture(acceptedFiles[0])
        
        
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop, //@ts-ignore
      accept: "image/*",
    })
   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
     
   }, [])
    return (
      <div className="text-left ml-6 mr-16">
        <h2 className=" text-base mt-[1.5rem] leading-[23px] font-bold text-primary-200">
        {t("Meeting.Profile")}
        </h2>
        <div className="flex flex-col items-baseline mt-4 ml-2">
          <div className="flex ">
            <div className="text-[14px] w-[120px] mt-2.5 text-base leading-[19px] text-primary-200 mr-[30px]">
            {t("Meeting.DisplayName")}
            </div>
            <InputFields
              label={t("Dashboard.HoolvaRoot")}
              name={"displayName"}
              restClass={"w-[283px] h-[32px]"}
            />
          </div>
          <div className="flex mt-4">
            <div className="text-[14px] w-[120px] mt-2.5 text-base leading-[19px] text-primary-200 mr-[30px]">
            {t("Dashboard.ProfilePicture")}
            </div>
            <div className="   flex flex-col justify-center items-center">
              {profilePicture ? (
                <div className="flex flex-col w-[250px] h-[230px] profile-border   justify-center">
                  <div className="w-[180px] h-[180px] relative mx-auto object-cover">
                    <Cropper
                      image={URL.createObjectURL(profilePicture)}
                      crop={crop}
                      zoom={zoom}
                      aspect={5 / 5}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      objectFit="horizontal-cover"
                      zoomWithScroll=  {true}
                    />
                    {/* <img
                        src={URL.createObjectURL(profilePicture)}
                        alt="Selected"
                        width="158"
                      /> */}
                  </div>
                  <div className="flex justify-around mt-3">
                   
                    <span
                      className="text-link text-sm cursor-pointer"
                      onClick={() => setProfilePicture(null)}
                    >
                      {t("Remove")}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="w-[162px] h-[144px] profile-border  flex flex-col justify-center items-center"
                  {...getRootProps()}
                >
                  <svg
                    width="46"
                    height="46"
                    viewBox="0 0 46 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.0026 25.7987C25.4026 25.7987 27.4471 24.9543 29.1359 23.2654C30.8248 21.5765 31.6693 19.532 31.6693 17.132C31.6693 14.6876 30.8248 12.6316 29.1359 10.964C27.4471 9.29825 25.4026 8.46537 23.0026 8.46537C20.6026 8.46537 18.5582 9.29825 16.8693 10.964C15.1804 12.6316 14.3359 14.6876 14.3359 17.132C14.3359 19.532 15.1804 21.5765 16.8693 23.2654C18.5582 24.9543 20.6026 25.7987 23.0026 25.7987ZM5.13594 45.6654C3.8026 45.6654 2.66927 45.1987 1.73594 44.2654C0.802604 43.332 0.335938 42.1987 0.335938 40.8654V5.13203C0.335938 3.7987 0.802604 2.66536 1.73594 1.73203C2.66927 0.798698 3.8026 0.332031 5.13594 0.332031H40.8693C42.2026 0.332031 43.3359 0.798698 44.2693 1.73203C45.2026 2.66536 45.6693 3.7987 45.6693 5.13203V40.8654C45.6693 42.1987 45.2026 43.332 44.2693 44.2654C43.3359 45.1987 42.2026 45.6654 40.8693 45.6654H5.13594ZM4.86927 41.6654H41.1359C41.3137 41.4876 41.4364 41.0769 41.5039 40.4334C41.5697 39.788 41.6248 39.3543 41.6693 39.132C39.2693 36.7765 36.4808 34.9214 33.3039 33.5667C30.1253 32.2103 26.6915 31.532 23.0026 31.532C19.3137 31.532 15.8808 32.2103 12.7039 33.5667C9.52527 34.9214 6.73594 36.7765 4.33594 39.132C4.38038 39.3543 4.43549 39.788 4.50127 40.4334C4.56883 41.0769 4.69149 41.4876 4.86927 41.6654Z"
                      fill="#C4C4C4"
                    />
                  </svg>
                  <span className="text-sm text-[#C4C4C4] p-2">
                    {isDragActive ? "Drop Here" : " Drag or upload"}
                  </span>
                  <span className="text-link text-sm cursor-pointer">
                  {t("Dashboard.Upload")}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex w-[24rem] justify-center mt-3">
            <HomeButton
              color={'primary-200'}
              restClass={"text-[14px] leading py-[7.5px]  w-[77px] h-[32px]"}
            >
              {t("Chat.Update")}
            </HomeButton>
          </div>
        </div>
      </div>
    )
}

export default ProfileSettings