import { useEffect, useRef, useState } from "react"

interface DtmfFrequency {
  f1: number
  f2: number
}

interface DtmfFrequencies {
  [key: string]: DtmfFrequency
}

const dtmfFrequencies: DtmfFrequencies = {
  "1": { f1: 697, f2: 1209 },
  "2": { f1: 697, f2: 1336 },
  "3": { f1: 697, f2: 1477 },
  "4": { f1: 770, f2: 1209 },
  "5": { f1: 770, f2: 1336 },
  "6": { f1: 770, f2: 1477 },
  "7": { f1: 852, f2: 1209 },
  "8": { f1: 852, f2: 1336 },
  "9": { f1: 852, f2: 1477 },
  "*": { f1: 941, f2: 1209 },
  "0": { f1: 941, f2: 1336 },
  "#": { f1: 941, f2: 1477 },
}

export const Dtmf = () => {
  const dtmfRef = useRef<any>(null)
  const [context, setContext] = useState<AudioContext | null>(null)
  useEffect(() => {
    const audioContext = new AudioContext()
    setContext(audioContext)
  }, [])

  const Tone = (context: any, freq1: any, freq2: any) => {
    const osc1 = context.createOscillator()
    const osc2 = context.createOscillator()
    const gainNode = context.createGain()
    const filter = context.createBiquadFilter()

    osc1.frequency.value = freq1
    osc2.frequency.value = freq2
    gainNode.gain.value = 0.25
    filter.type = "lowpass"
    filter.frequency.value = 8000

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(filter)
    filter.connect(context.destination)

    let started = false // Flag to track start state

    return {
      start: () => {
        if (!started) {
          osc1.start(0)
          osc2.start(0)
          started = true
        }
      },
      stop: () => {
        if (started) {
          osc1.stop(0)
          osc2.stop(0)
          started = false
        }
      },
    }
  }

  const handleKeyPress = (keyPressed: string) => {
    const frequencyPair = dtmfFrequencies[keyPressed]

    dtmfRef.current =
      dtmfRef.current || Tone(context, frequencyPair.f1, frequencyPair.f2) // Create tone instance only when needed
    dtmfRef.current.start()
  }
  const handleKeyUp = () => {
    if (dtmfRef.current) {
      dtmfRef.current.stop()
      dtmfRef.current = null
    }
  }

  return { handleKeyPress, handleKeyUp }
}

export default Dtmf
