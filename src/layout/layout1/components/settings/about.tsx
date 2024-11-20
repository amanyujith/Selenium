import React from "react"
import { useSelector } from "react-redux"
import { ncs_logo } from "../../../../constants/constantValues"
import packages from "../../../../../package.json"
const About = () => {
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)

  return (
    <div className="w-[580px] min-h-[400px]   h-[calc(100vh-292px)] flex items-center justify-center flex-col">
      <img className="w-[150px] max-h-[100px]" src={ncs_logo} />
      <span className="text-[18px] font-medium mt-[20px]">
        Version : {packages.version}.{packages.buildNumber}
      </span>
    </div>
  )
}

export default About
