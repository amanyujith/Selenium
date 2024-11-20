import React from "react"
import Lottiefy from "../Lottie/lottie"
import * as warning from "../Lottie/warning.json"

const NotSupported = () => {
  return (
    <div className=" w-screen h-screen grid place-content-center text-center gap-3">
      <Lottiefy loop={true} json={warning} height={100} width={100} />
      <div className=" font-bold">Unsupported Browser Version!</div>
      <div>
        Please update to Safari 15+ or use Chrome for optimal performance.
      </div>
    </div>
  )
}

export default NotSupported
