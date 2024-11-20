import React, { useEffect } from "react"

const UseEscape = (callBack: () => void) => {
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 27) {
        callBack()
      }
    }
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])
  return null
}

export default UseEscape
