import { useEffect, useState } from "react"

const useNotificationSound = (src: string): [(volume: number) => void] => {
  const [audio] = useState(new Audio(src))

  useEffect(() => {
    audio.volume = 0.5 // set default volume to 50%
  }, [audio])

  const playNotificationSound = (volume: number) => {
    
    audio.currentTime = 0
    audio.volume = volume
    audio.play()
  }

  return [playNotificationSound]
}

export default useNotificationSound
