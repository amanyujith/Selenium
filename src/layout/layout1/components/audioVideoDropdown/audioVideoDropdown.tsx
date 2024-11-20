import { t } from 'i18next';
import React from 'react'
import { useSelector } from 'react-redux'

const AudioVideoDropdown = () => {

  const currentDevice = useSelector((state: any) => state.Main.currentDevice);
  const deviceList = useSelector((state: any) => state.Main.deviceList);
  const meetingSession = useSelector((state: any) => state.Main.meetingSession);
  const themePalette = useSelector((state: any) => state.Main.themePalette)


  const handleChangeDevice = (value: string, type: string) => {
    meetingSession.switchDevices(value, type, type === "audioOutput" ? "mixedAudio" : undefined)
  }


  return (
    <div>
      <div className='flex items-center px-2.5 py-1 rounded-[3px] mx-0.5 mt-0.5 group hover:bg-[#ffffff] hover:bg-opacity-10'>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M9.33889 2.66797H1.32778C0.594444 2.66797 0 3.26241 0 3.99575V12.0069C0 12.7402 0.594444 13.3346 1.32778 13.3346H9.33889C10.0722 13.3346 10.6667 12.7402 10.6667 12.0069V3.99575C10.6667 3.26241 10.0722 2.66797 9.33889 2.66797ZM14.6 3.71519L11.5556 5.81519V10.1874L14.6 12.2846C15.1889 12.6902 16 12.2763 16 11.568V4.43186C16 3.7263 15.1917 3.30964 14.6 3.71519Z" fill="#A7A9AB" />
          {t("Chat.Video")}
        </svg>
        <select
          className='mx-5 w-full text-sm leading-4 bg-primary-500 group-hover:bg-opacity-10 text-[#ffffff] outline-none'
          style={{backgroundColor:themePalette?.primary500}}
          value={currentDevice.videoInput}
          onChange={(event: any) => handleChangeDevice(event.target.value, "videoInput")}
        >
          {
            deviceList?.filter((device: any) => device.type === "videoinput").map((Device: any) => {
              return (
                <option key={Device.id} value={Device.id} className='bg-primary-500'
                 style={{backgroundColor:themePalette?.primary500}}>
                  {Device.device}
                </option>
              )
            })
          }
          {/* <option className='bg-primary-500' value="Default">Default</option>
          <option className='bg-primary-500' value="Camera 1">Camera 1</option>
          <option className='bg-primary-500' value="Camera 2">Camera 1</option> */}
        </select>
      </div>
      <div className='flex items-center px-2.5 py-1 rounded-[3px] mx-0.5 mt-0.5 group hover:bg-[#ffffff] hover:bg-opacity-10'>
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
          <path d="M6 11C7.65688 11 9 9.65687 9 8V3C9 1.34312 7.65688 0 6 0C4.34312 0 3 1.34312 3 3V8C3 9.65687 4.34312 11 6 11ZM11 6H10.5C10.2238 6 10 6.22375 10 6.5V8C10 10.3375 7.98469 12.2131 5.60031 11.9806C3.52219 11.7778 2 9.90969 2 7.82188V6.5C2 6.22375 1.77625 6 1.5 6H1C0.72375 6 0.5 6.22375 0.5 6.5V7.755C0.5 10.5562 2.49906 13.0534 5.25 13.4328V14.5H3.5C3.22375 14.5 3 14.7238 3 15V15.5C3 15.7762 3.22375 16 3.5 16H8.5C8.77625 16 9 15.7762 9 15.5V15C9 14.7238 8.77625 14.5 8.5 14.5H6.75V13.4447C9.42844 13.0772 11.5 10.7781 11.5 8V6.5C11.5 6.22375 11.2762 6 11 6Z" fill="#A7A9AB" />
          Audio
        </svg>
        <select
          className='ml-6 mr-5 outline-none text-sm leading-4 w-full bg-primary-500 group-hover:bg-opacity-10 text-[#ffffff]'
          style={{backgroundColor : themePalette?.primary500}}
          value={currentDevice.audioInput}
          onChange={(event: any) => handleChangeDevice(event.target.value, "audioInput")}
        >
          {
            deviceList?.filter((device: any) => device.type === "audioinput").map((Device: any) => {
              return (
                <option key={Device.id} value={Device.id} className='bg-primary-500'
                 style={{backgroundColor :themePalette?.primary500}}>
                  {Device.device}
                </option>
              )
            })
          }
          {/* <option className='bg-primary-500' value="Default">Default</option>
          <option className='bg-primary-500' value="Camera 1">Mic 1</option>
          <option className='bg-primary-500' value="Camera 2">Mic 1</option> */}
        </select>
      </div>
      {deviceList?.filter((device: any) => device.type === "audiooutput")?.length > 0 ?
        <div className='flex items-center px-2.5 py-1 rounded-[3px] mx-0.5 mt-0.5 group hover:bg-[#ffffff] hover:bg-opacity-10'>
          <svg width="16" height="16" viewBox="0 0 18 16" fill="none">
            <path d="M6.71969 2.22046L3.93937 5.00014H0.75C0.335625 5.00014 0 5.33577 0 5.75014V10.2501C0 10.6642 0.335625 11.0001 0.75 11.0001H3.93937L6.71969 13.7798C7.18937 14.2495 8 13.9195 8 13.2495V2.75077C8 2.08014 7.18875 1.75139 6.71969 2.22046ZM14.0109 0.624207C13.6619 0.395145 13.1928 0.491707 12.9637 0.841395C12.7344 1.19046 12.8319 1.65952 13.1809 1.88858C15.2519 3.24764 16.4878 5.53233 16.4878 8.00046C16.4878 10.4686 15.2519 12.7533 13.1809 14.1123C12.8319 14.3411 12.7344 14.8105 12.9637 15.1592C13.1838 15.4939 13.6491 15.6142 14.0109 15.3764C16.5084 13.737 18 10.9792 18 8.00014C18 5.02108 16.5084 2.26358 14.0109 0.624207ZM15 8.00014C15 6.01483 13.9981 4.18952 12.3197 3.11764C11.97 2.89452 11.5062 2.99827 11.2847 3.35077C11.0631 3.70327 11.1666 4.16983 11.5162 4.39327C12.7584 5.18671 13.5 6.53483 13.5 8.00014C13.5 9.46546 12.7584 10.8136 11.5162 11.607C11.1666 11.8301 11.0631 12.2967 11.2847 12.6495C11.4881 12.9733 11.9447 13.1226 12.3197 12.8826C13.9981 11.8108 15 9.98577 15 8.00014ZM10.5697 5.59796C10.2078 5.40014 9.75125 5.53046 9.55062 5.89327C9.35094 6.25608 9.48313 6.71202 9.84594 6.91233C10.2494 7.13389 10.5 7.55108 10.5 8.00014C10.5 8.44952 10.2494 8.86639 9.84625 9.08796C9.48344 9.28827 9.35125 9.74421 9.55094 10.107C9.75187 10.4714 10.2087 10.6008 10.57 10.4023C11.4522 9.91639 12.0003 8.99608 12.0003 7.99983C12.0003 7.00358 11.4522 6.08358 10.5697 5.59796Z" fill="#A7A9AB" />
            Speaker
          </svg>
          <select
            className=' ml-[19px] mr-5 outline-none text-sm leading-4 w-full bg-primary-500 group-hover:bg-opacity-10 text-[#ffffff]'
            style={{ backgroundColor :themePalette?.primary500}}
            value={currentDevice.audioOutput}
            onChange={(event: any) => handleChangeDevice(event.target.value, "audioOutput")}
          >
            {
              deviceList?.filter((device: any) => device.type === "audiooutput").map((Device: any) => {
                return (
                  <option key={Device.id} value={Device.id} className='bg-primary-500'
                   style={{backgroundColor: themePalette?.primary500}}>
                    {Device.device}
                  </option>
                )
              })
            }
            {/* <option className='bg-primary-500' value="Default">Default</option>
          <option className='bg-primary-500' value="Camera 1">Mic 1</option>
          <option className='bg-primary-500' value="Camera 2">Mic 1</option> */}
          </select>
        </div>
        : null
      }
    </div>

  )
}

export default AudioVideoDropdown