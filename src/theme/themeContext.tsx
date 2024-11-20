import React, { createContext, useEffect, useState } from "react"
import { baseTheme } from "./baseTheme"
import { darkTheme } from "./darkTheme"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import LocalDb from "../dbServices/dbServices"
import { RootState, actionCreators } from "../store"
import { networkHook } from "hdmeet"
import { DocumentRoot, Environment } from "../config/environmentConfigs/config"
interface ThemeContextType {
  theme: string
  toggleTheme: (theme: string, callback: VoidFunction) => void
  createTheme: (theme: ThemeType) => any
}
interface ThemeType {
  primary: string
  primaryLight: string
  secondary: string
  secondaryLight: string
  textBase: string
  accent: string
}

// Context API used for Theme related information and methods.
let ThemeContext = createContext<ThemeContextType>(null!)

// Context Provider to wrap the whole app within and make auth information available.
export function ThemeProvider(props: {
  children?: React.ReactNode
  ready?: boolean
  token?: any
}) {
  let [theme, setTheme] = React.useState<string>("light")
  const dispatch = useDispatch()
  const [branding, setBranding] = useState<any>({})
  const deviceDB = LocalDb.loadLocalDB("hoolvaUser", "UserData", 2)
  const sessionData = Environment.getInstance()
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const onReady = useSelector((state: any) => state.Flag.onReady)
  const authInfo = useSelector((state: RootState) => state.Main.authInfo)
  useEffect(() => {
    if (onReady) {
      ;(async () => {
        const domain = getSubDomain()
        if (domain) {
          networkHook(0).then(() => {
            axios
              .post(
                sessionData.tenant_info_api,
                {
                  sname: authInfo?.tenant?.length ? authInfo?.tenant : domain,
                },
                {
                  headers: {
                    "hoolva-app": "b92307c2-1a60-4d4b-b1fe-4d3ba57d1ca5",
                  },
                }
              )
              .then((res) => {
                setBranding(res)
                var link = document.createElement("link")
                link.type = "image/x-icon"
                link.rel = "icon"
                link.href = res.data.logos.favicon
                document.head.appendChild(link)
              })
              .catch(() => {
                if (!window.location.hostname.includes("localhost")) {
                  window.open(sessionData.rootUrl, "_self")
                }
              })
          })
        }
      })()
    }
  }, [authInfo?.tenant, onReady])

  function getSubDomain() {
    const host = window.location.hostname

    let real = "system"
    let sub = host.split(".")
    if (sub.length > 2) {
      real = sub[0]
    }
    return real
  }
  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  useEffect(() => {
    if (onReady) {
      const domain = getSubDomain()
      document.title = `${capitalizeFirstLetter(
        authInfo?.tenant?.length ? authInfo?.tenant : domain
      )} | NCS`
    }
  }, [authInfo?.tenant, onReady])

  useEffect(() => {
    dispatch(actionCreators.setBrandingInfo(branding))
    dispatch(actionCreators.setThemePalette(branding?.data?.theme?.lite))
    LocalDb.get(deviceDB, "UserData", "theme", (data: any) => {
      if (data == "dark") {
        toggleTheme("dark", () => {})
        dispatch(actionCreators.setThemePalette(branding?.data?.theme?.dark))
        dispatch(actionCreators.setTheme("dark"))
      } else {
        toggleTheme("light", () => {
          dispatch(actionCreators.setThemePalette(branding.data.theme.dark))
          dispatch(actionCreators.setTheme("light"))
        })
      }
    })
  }, [branding])
  const convertHexToRGBA = (hexCode: string, opacity = 1) => {
    let hex = hexCode?.replace("#", "")

    if (hex?.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
    }

    const r = parseInt(hex?.substring(0, 2), 16)
    const g = parseInt(hex?.substring(2, 4), 16)
    const b = parseInt(hex?.substring(4, 6), 16)

    /* Backward compatibility for whole number based opacity values. */
    if (opacity > 1 && opacity <= 100) {
      opacity = opacity / 100
    }

    return `rgba(${r},${g},${b},${opacity})`
  }

  let toggleTheme = (themes: any, callback: VoidFunction) => {
    setTheme(themes)

    const themesJson: ThemeType =
      themes === "dark"
        ? branding?.data?.theme?.dark
        : branding?.data?.theme?.lite
    const root = document.documentElement
    const createdTheme = createTheme(themesJson)

    Object.keys(createdTheme).forEach((cssVar: string) => {
      root.style.setProperty(cssVar, createdTheme[cssVar])
    })
  }
  const createTheme = (theme: any): any => {
    return {
      "--theme-main": theme?.main,
      "--theme-primary": theme?.primary,
      "--theme-primary-100": theme?.primary100,
      "--theme-primary-200": theme?.primary300,
      "--theme-primary-500": theme?.primary500,
      "--theme-primary-alpha-10": convertHexToRGBA(theme?.primary500, 0.1),
      "--theme-primary-alpha-20": convertHexToRGBA(theme?.primary300, 0.3),
      "--theme-link": theme?.linkText,
      "--theme-danger": theme?.danger,
      "--theme-status": theme?.whileOnline,
      "--theme-secondary": theme?.bgSecondary,
      "--theme-notification": theme?.callNotification,
    }
  }

  let value = { theme, toggleTheme, createTheme }

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  )
}

// Custom hook to access auth related data and methods.
// Most important hook to be used throughout
export function useTheme() {
  return React.useContext(ThemeContext)
}
