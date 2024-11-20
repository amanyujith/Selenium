import { useEffect, useState } from 'react';

const useNotificationSound = (src: string): [(volume: number, loop : boolean ) => void] => {
  const [audio] = useState(new Audio(src));

  useEffect(() => {
    audio.volume = 0.5; // set default volume to 50%
  }, [audio]);

  const playNotificationSound = (volume: number, loop : boolean) => {
    audio.currentTime = 0;
    audio.volume = volume;
    //audio.loop = true
    audio.play();
    
     
  };

  return [playNotificationSound];
};

export default useNotificationSound;
