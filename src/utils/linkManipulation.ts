import { DocumentRoot } from "../config/environmentConfigs/config"

export const getURL = (url: any) => {
    // e.stopPropagation()
    const host = window.location.hostname
    // const host = "hoolvadev.us3-test.ncsapp.com"
    // const host = "us3-test.ncsapp.com"

    let subdmain: any = []
    let flag = true

    DocumentRoot.map((node: any) => {
      if (flag && host.includes(node.domain)) {
        subdmain = host.split("." + node.domain)[0]
        flag = false
      }
    })
    
    let newURL = url
    // console.log("qwerty", url, host)
    // console.log("subdmain === host", subdmain, host)
  if (subdmain === host && url.includes(host) && url.split("." + host)[1]) {
      newURL = "https://" + host + url.split("." + host)[1]
      // console.log("subdmainsubdmain", newURL)
  } else if(!url.includes(host) && url.split("." + 'hoolva.com')[1]) {
    newURL = "https://" + host + url.split("." + 'hoolva.com')[1]
   }
    return newURL
  }
