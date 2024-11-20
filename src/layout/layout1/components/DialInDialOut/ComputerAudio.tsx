import React from 'react';
import { useSelector } from 'react-redux';
import AudioVideoDropdown from '../audioVideoDropdown/audioVideoDropdown';
import { t } from 'i18next';

const ComputerAudio = () => {
  const currentDevice = useSelector((state: any) => state.Main.currentDevice);
  const deviceList = useSelector((state: any) => state.Main.deviceList);
  const meetingSession = useSelector((state: any) => state.Main.meetingSession);

  const handleChangeDevice = (value: string, type: string) => {
    meetingSession.switchDevices(
      value,
      type,
      type === 'audioOutput' ? 'mixedAudio' : undefined
    );
  };

  return (
    <div className="flex flex-col h-[206px] mt-5">
      <div className="flex flex-col items-start p-3">
        <h3>{t("Dial.Microphone")}</h3>
        <select
          className="py-[6px] px-8px] w-[552px] h-[36px] border-[0.2px] border-[#b9b9b9] rounded-[3px] bg-[white] my-1"
          value={currentDevice.audioInput}
          onChange={(event: any) =>
            handleChangeDevice(event.target.value, 'audioInput')
          }
        >
          {deviceList
            ?.filter((device: any) => device.type === 'audioinput')
            .map((Device: any) => {
              return (
                <option
                  key={Device.id}
                  value={Device.id}
                  className="bg-[#ffffff]"
                >
                  {Device.device}
                </option>
              );
            })}
          {/* <option className='bg-primary-500' value="Default">Default</option>
          <option className='bg-primary-500' value="Camera 1">Mic 1</option>
          <option className='bg-primary-500' value="Camera 2">Mic 1</option> */}
        </select>
        <h3>{t("Dial.Speaker")}</h3>
        <select
          className="py-[6px] px-8px] w-[552px] h-[36px] border-[0.2px] border-[#b9b9b9] rounded-[3px] bg-[white] my-1"
          value={currentDevice.audioOutput}
          onChange={(event: any) =>
            handleChangeDevice(event.target.value, 'audioOutput')
          }
        >
          {deviceList
            ?.filter((device: any) => device.type === 'audiooutput')
            .map((Device: any) => {
              return (
                <option
                  key={Device.id}
                  value={Device.id}
                  className="bg-[#ffffff]"
                >
                  {Device.device}
                </option>
              );
            })}
          {/* <option className='bg-primary-500' value="Default">Default</option>
          <option className='bg-primary-500' value="Camera 1">Mic 1</option>
          <option className='bg-primary-500' value="Camera 2">Mic 1</option> */}
        </select>
      </div>
      <div className="flex flex-row-reverse items-end">
        <button className="h-[32px] w-[178px] mr-1 bg-primary-200 text-[#FFFFFF] rounded-[3px] ml-3 mt-7">
        {t("Dial.SwitchAudio")}
        </button>
      </div>
    </div>
  );
};

export default ComputerAudio;
