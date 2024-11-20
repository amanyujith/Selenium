import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import LayoutConfig1 from "./layout1.config";
import { useApp } from "../../appContext";
// import LeftSideBar from "./components/leftSideBar/leftSideBar";
// import ToolBar from "./components/toolbar/toolbar";
import ThemedButton from "../../atom/ThemedButton/themedButton";
const Layout1 = () => {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState("en");
    const appContext = useApp();
    const { routes } = appContext;
    const navigation = useLocation();
    const currentPathConfiguration = routes.find(route => route.path === navigation.pathname);
    const layoutConfiguration = currentPathConfiguration && currentPathConfiguration.config ? currentPathConfiguration.config : LayoutConfig1
    const handleSwitchLanguage = () => {

        i18n.changeLanguage(currentLanguage === "en" ? "fr" : "en");
        setCurrentLanguage(currentLanguage === "en" ? "fr" : "en");
    }
    return (
        <div className="w-full flex">
            {/* <div>
            {layoutConfiguration.defaults.leftSidePanel.display &&  <LeftSideBar />}
           
            </div> */}

            <div className="relative w-full bg-white overflow-hidden">
                <div className="w-full mx-auto">
                    <div className={` relative z-10 bg-white w-full h-screen `}>
                        {/* {layoutConfiguration.defaults.toolbar.display && <ToolBar />} */}

                        <main >
                            {/* className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28" */}
                            {/* <button onClick={handleSwitchLanguage}>Switch Language</button> 
                            <ThemedButton color="primary">
                                    Themed Button
                            </ThemedButton>
                            <h2>Layout 1</h2> */}
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Layout1;