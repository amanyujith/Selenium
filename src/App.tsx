import { BrowserRouter } from "react-router-dom"
import "./App.css"
import { Provider } from "react-redux"
import { store } from "./store"
import { ThemeProvider } from "./theme/themeContext"
import { AuthProvider } from "./navigation/auth/useAuth"
import RouterConfig from "./navigation/router.config"
import { AppProvider } from "./appContext"
import { ReactKeycloakProvider } from "@react-keycloak/web"
import keyCloak from "./auth/keycloak"
import AuthKeyCloak from "./auth/authKeyCloak"
import { ReactNotifications } from "react-notifications-component"
import "react-notifications-component/dist/theme.css"
import { useEffect, useState } from "react"
import PageVisibility from "../src/containers/PageVisibility/pageVisibility"
import axios from "axios"
import ChatSettings from "./layout/layout1/components/settings/chatSettings"
import ScreenLoader from "./atom/ScreenLoader/screenLoader"
import { networkHook } from "hdmeet"

function App() {
  return (
    <div className="App">
      {
        // key

        // &&
        // <ReactKeycloakProvider
        //   authClient={keyCloak}
        //   onEvent={eventLogger}
        //   onTokens={tokenLogger}
        // >
        <Provider store={store}>
          <>
            <ReactNotifications />
            <AppProvider>
              <AuthProvider>
                <ThemeProvider>
                  <PageVisibility>
                    <ChatSettings>
                      <BrowserRouter>
                        <RouterConfig />
                      </BrowserRouter>
                    </ChatSettings>
                  </PageVisibility>
                </ThemeProvider>
              </AuthProvider>
            </AppProvider>
          </>
        </Provider>
        // </ReactKeycloakProvider>
      }
    </div>
  )
}

export default App
