import { RefObject, useEffect } from "react"
import { useSelector } from "react-redux"
const knowIt = require("../Chat/audio/incoming-call/Know it.mp3")


const useRingSound = (audioSound: any) => {
    var audio = new Audio(knowIt)
    const settings = useSelector((state: any) => state.Main.soundAndNotification)

    useEffect(() => {
        audio.src = ""
        audio.src = audioSound
    }, [audioSound])
 
useEffect(() => {
    if (!settings[0]?.mute) {
      audio.loop = true
      audio.play()
    }

    return () => {
      audio.pause()
    }
  }, [])
}

export default useRingSound
