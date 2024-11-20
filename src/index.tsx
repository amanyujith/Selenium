import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import "./i18n/i18n"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { ErrorBoundary } from "react-error-boundary"
import ErrorBoundaryPage from "./layout/layout1/components/errorBoundaryPage"
import CoreInstance from "./config/environmentConfigs/coreInstance"
import { v4 as uuidv4 } from "uuid"

const ID = uuidv4()
const logError = (error: Error, info: { componentStack: string }) => {
  // Do something with the error, e.g. log to an external API
  const chatInstance = CoreInstance.getChatInstance()
  chatInstance.grafanaLogger([`Client Crashed : Crash ID = ${ID}, ${error}`])
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorBoundaryPage ID={ID} />} onError={logError}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
