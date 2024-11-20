import { useState, useCallback } from "react"
import Cropper, {
  getInitialCropFromCroppedAreaPercentages,
} from "react-easy-crop"
import getCroppedImg from "./General/imageFunctions"
import Lottiefy from "../../../../atom/Lottie/lottie"
import * as invalid from "../../../../atom/Lottie/invalid.json"
const ProfilePicture = (props: any) => {
  const { profilePicture, setProfilePicture, setCropImage, setChange } = props
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<any>(1)
  const [rotate, setRotate] = useState<any>(0)
  const [croppedImage, setCroppedImage] = useState<any>()
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 })
  const [mediaSize, setMediaSize] = useState({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  })
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }
  const UpdateImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        profilePicture,
        croppedAreaPixels,
        rotate
      )

      setCropImage(croppedImage)
      // setCroppedImage(croppedImage)
      setProfilePicture("")
      setChange(true)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="z-10 w-full h-full flex justify-center items-center absolute left-0 top-0">
      <div className=" w-[70%] h-[100%] rounded-2xl bg-[#ffffff] shadow-xl">
        <div className=" flex justify-between items-center px-2.5 py-4  bg-[#EBEDEF] rounded-t-2xl">
          <span className="font-bold">Edit Profile Picture</span>
          <svg
            className="cursor-pointer"
            onClick={() => {
              setProfilePicture("");
            }}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.8334 5.34102L14.6584 4.16602L10 8.82435L5.34169 4.16602L4.16669 5.34102L8.82502 9.99935L4.16669 14.6577L5.34169 15.8327L10 11.1743L14.6584 15.8327L15.8334 14.6577L11.175 9.99935L15.8334 5.34102Z"
              fill="#A7A9AB"
            />
            close
          </svg>
        </div>
        <div className=" flex flex-col m-6 h-full">
          <div className=" w-[100%] relative h-[70%] flex items-center justify-center ">
            <div className="crop-container ">
              {profilePicture !== "invalid" ? (
                <Cropper
                  image={profilePicture}
                  crop={crop}
                  zoom={zoom}
                  zoomSpeed={2}
                  aspect={1 / 1}
                  rotation={rotate}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  setMediaSize={setMediaSize}
                  setCropSize={setCropSize}
                />
              ) : (
                <div className="h-[50%] w-full flex justify-center flex-col items-center">
                  <Lottiefy
                    loop={true}
                    json={invalid}
                    height={100}
                    width={100}
                  />
                  <span className="text-[18px] font-sans font-semibold">
                    {" "}
                    File format not supported.
                  </span>
                </div>
              )}
            </div>
          </div>
          {profilePicture !== "invalid" && (
            <div className="relative flex justify-between">
              <div className="px-4 pl-6 pt-2 w-[40%]">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Zoom
                  {/* <b>{(100 + ((zoom - 1) / 2) * 100).toFixed(0)}%</b> */}
                </label>
                <input
                  id="default-range"
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(e.target.value);
                  }}
                  className="bg-transparent [&::-webkit-slider-runnable-track]:rounded-full  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#F7931F] w-full h-1 bg-[#EBEDEF] rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div className="px-4 pt-2 w-[40%]">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Rotate
                  {/* <b>{rotate}</b> */}
                </label>
                <input
                  id="default-range"
                  type="range"
                  value={rotate}
                  min={0}
                  max={360}
                  step={5}
                  aria-labelledby="Rotate"
                  onChange={(e) => {
                    setRotate(e.target.value);
                  }}
                  className="  bg-transparent [&::-webkit-slider-runnable-track]:rounded-full  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#F7931F] w-full h-1 bg-[#EBEDEF] rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <button id ="updateImage"
                onClick={UpdateImage}
                className={`m-6 mt-5 flex justify-center ${
                  profilePicture !== "invalid"
                    ? "bg-[#E57600] hover:bg-[#CC6900] text-[#FFFFFF] font-bold"
                    : "bg-[#fae2c7] text-[#293241]"
                }  items-center w-[100px] h-[36px] border-[0px] rounded-[7px]`}
              >
                Update
              </button>
            </div>
          )}
        </div>
        <img src={croppedImage} />
      </div>
    </div>
  );
}
export default ProfilePicture
