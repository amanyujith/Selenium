import { memo, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { branding_logo_half } from "../../../../../constants/constantValues"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion } from "framer-motion"

const ReactionList = (props: any) => {
  //

  const reactions = useSelector((state: any) => state.Main.reactions)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const [brokenImage, setBrokenImage] = useState(false)
  const themePalette = useSelector((state: any) => state.Main.themePalette)
  useEffect(() => {}, [reactions])
  const { t } = useTranslation()

  const handleBrokenImage = () => {
    setBrokenImage(true)
  }

  return (
    <div className=" min-w-[100px] h-[396px] overflow-hidden flex-col flex justify-end absolute left-12 bottom-24">
      <AnimatePresence>
        {reactions.map((item: any, index: number) => {
          const reactionParticipant = participantList.find(
            (person: any) => person.participant_id === item.sender
          )

          return (
            <motion.div
              key={index}
              initial={props.isCall ? {} : { scale: 0 }}
              animate={
                props.isCall
                  ? {}
                  : {
                      scale: 1,
                      transition: { duration: 0.4, ease: "easeOut" },
                    }
              }
              exit={
                props.isCall
                  ? {}
                  : {
                      opacity: 0,
                      transition: { duration: 0.4, ease: "easeOut" },
                    }
              }
              className={`origin-bottom flex items-center py-0.5 px-2 mt-1 rounded bg-opacity-90 text-[#ffffff]  bg-[${themePalette?.primary}]`}
              style={{ backgroundColor: themePalette?.primary }}
            >
              {/* fadeOut */}
              <div
                className={`w-8 h-8 rounded-full mr-2.5 flex items-center justify-center text-[#ffffff] bg-[${themePalette?.primary300}]`}
                style={{ backgroundColor: themePalette?.primary300 }}
              >
                {reactionParticipant?.profile_picture &&
                reactionParticipant?.profile_picture != "undefined" ? (
                  !brokenImage ? (
                    <img
                      src={reactionParticipant?.profile_picture}
                      onError={handleBrokenImage}
                      className={"rounded-full"}
                    />
                  ) : (
                    <img src={branding_logo_half} className={"rounded-full"} />
                  )
                ) : (
                  reactionParticipant?.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className=" flex justify-between flex-1">
                <span className=" mr-5 flex">
                  <div className=" max-w-[56px] w-fit text-left overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.participant_name}
                  </div>
                  {item.sender === props.participant_id
                    ? `(${t("Chat.You")})`
                    : null}
                </span>
                <span>{item.message.message}</span>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default memo(ReactionList)
