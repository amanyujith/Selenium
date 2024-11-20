import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useTheme } from "../../theme/themeContext"
import { HoolvaUtils } from "../../utils"
import Logger from "../../utils/logger"

const HomePage = () => {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const user = useSelector((state: any) => state.Auth.user)

  const changeTheme = (theme: string) => {
    Logger.log("Theme switched")
    Logger.warn("Theme hey")
    Logger.log({ name: "theme switch" }, { data: "123" })
    Logger.warn({ name: "theme switch" }, { data: "123" })
    toggleTheme(theme, () => {})
  }
  return (
    <div>
      <h6 className="bg-dark">{t("Home Page")}</h6>
      <h1 className="text-3xl bg-light text-dark font-bold underline">
        {process.env.REACT_APP_ENVIRONMENT}
      </h1>
      <h1 className="text-3xl bg-light text-dark font-bold">
        Current User: {user}
      </h1>
      <div className="flex text-center my-8">
        <div className="mx-auto">
          <button
            onClick={() => changeTheme("light")}
            value="light"
            className="px-2 py-1 mr-1 rounded bg-white"
          >
            Light
          </button>

          <button
            onClick={() => changeTheme("dark")}
            value="dark"
            className="px-2 py-1 ml-1 rounded bg-black text-white"
          >
            Dark
          </button>
        </div>
      </div>
      <div>
        <div className={`bg-${theme} shadow sm:rounded-lg mx-48`}>
          <div className="px-4 py-5 sm:p-6">
            <h3 className={`text-${theme}-400 text-lg leading-6 font-medium`}>
              Payment method
            </h3>
            <div className="mt-5">
              <div
                className={`bg-sky-500 shadow sm:rounded-lg rounded-md  px-6 py-5 sm:flex sm:items-start
                sm:justify-between`}
              >
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:ml-4">
                    <div
                      className={`text-${theme} text-sm leading-5 font-medium `}
                    >
                      Random Password {HoolvaUtils.generatePassword(6, 3, 2, 1)}
                    </div>
                    <div className="mt-1 text-sm leading-5 text-black dark:text-gray sm:flex sm:items-center">
                      <div>Expires 12/20</div>
                      <span
                        className="hidden sm:mx-2 sm:inline"
                        aria-hidden="true"
                      >
                        &middot;
                      </span>
                      <div className="mt-1 sm:mt-0 text-white">
                        Last updated on 22 Aug 2017
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                  <span className="inline-flex rounded-md shadow-sm">
                    <button
                      type="button"
                      className={`bg-${theme}-500 text-${theme}-400 inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150`}
                    >
                      Edit
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomePage
