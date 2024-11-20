import moment from "moment"
import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { actionCreators } from "../../../../../store"
import { useNavigate } from "react-router-dom"
import path from "../../../../../navigation/routes.path"
import { t } from "i18next"
import { motion } from "framer-motion"

function MembersPage(props: any) {
  const dispatch = useDispatch()
  const navigator = useNavigate()

  const usersList = useSelector((state: any) => state.Chat.userData)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const profileColors = ["#557BBB", "#B78931", "#91785B"]
  const [recentChats, setRecentChats] = useState([])
  const [isFetching, setFetching] = useState<boolean>(false)

  useEffect(() => {
    dispatch(actionCreators.setNewChatOption(false))
    dispatch(actionCreators.setChatscreen(true))
    chatInstance
      ?.getRecentChats()
      .then((res: any) => {
        setRecentChats(res)
      })
      .catch((err: any) => {})
  }, [])

  let myLastDate = ""

  const generateDivider = (timestamp: number, dateNum: string) => {
    myLastDate = dateNum

    const today = new Date()
    const yesterday = new Date(today.getTime() - 86400000)
    const messageDate = new Date(timestamp)
    const messageDateString = messageDate.toLocaleDateString("en-US");

    let dividerLabel: string

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      dividerLabel = t("Chat.Recent")
    } else if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      dividerLabel = t("Dashboard.Yesterday")
    } else {
      dividerLabel = messageDateString
    }

    return <div className="text-primary-100 text-sm my-1"> {dividerLabel}</div>
  }

  const handleClick = (uuid: string) => {
    const hasUser = usersList.some((node: any) => node.uuid === uuid)

    if (hasUser) {
      dispatch(actionCreators.setAcitveChat(uuid, false))
      navigator(`${path.CHAT}/${uuid}`)
    } else if (!isFetching) {
      setFetching(true)
      chatInstance
        ?.fetchUserChats(uuid, 25)
        .then((res: any) => {
          setFetching(false)
          dispatch(
            actionCreators.addNewChat({ data: res, isGroup: false }, true)
          )
          navigator(`${path.CHAT}/${uuid}`)
        })
        .catch((err: any) => {
          setFetching(false)
        })
    }
  }

  return (
    <motion.div
      key="users"
      initial={{ opacity: 0, translateY: "60px" }}
      animate={{
        opacity: 1,
        translateY: "0px",
        transition: { duration: 1.0 },
      }}
      className="w-full h-full py-5 px-7 text-left "
    >
      <div className="mb-16 h-[calc(100vh-95px)] overflow-y-scroll overflow-x-hidden">
        {recentChats.map((item: any, index: number) => {
          const dateNum = moment(item?.a_ctime).format("DD/MM/YYYY")
          let colorIndex =
            (item?.uuid.match(/\d/g).join("") + new Date().getDate()) %
            profileColors.length
          return (
            <div key={item.uuid}>
              {myLastDate !== dateNum && index !== 0 ? (
                <hr className="text-[#0000001f] mb-1 " />
              ) : null}
              {myLastDate === dateNum
                ? null
                : generateDivider(item?.a_ctime, dateNum)}
              <div>
                <div onClick={() => handleClick(item.uuid)}>
                  <div className="flex flex-row h-8 mt-3 ml-3 pb-2 cursor-pointer">
                    <div
                      style={{
                        backgroundColor: profileColors[colorIndex],
                      }}
                      className={`w-[29px] h-[29px] text-center flex justify-center items-center shrink-0 rounded-bl-none rounded-[50%] text-[15px] border-[2px] border-[#E9EBF8] text-[white] bg-[#91785B] overflow-hidden`}
                    >
                      {item.profile_picture ? (
                        <img
                          className="w-full h-full  object-cover"
                          src={item.profile_picture}
                          alt=""
                        />
                      ) : (
                        <div className="capitalize mt-[1px]">
                          {item.display_name?.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 text-primary-200 text-base">
                      {item.display_name}
                    </div>
                  </div>
                </div>
              </div>
              {index === recentChats.length - 1 ? (
                <hr className="text-[#0000001f] mb-1 " />
              ) : null}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default MembersPage
