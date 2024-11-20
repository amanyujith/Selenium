import { ReactionBarSelector } from "./reactionBar/ReactionBarSelector"
import { useDispatch, useSelector } from "react-redux"
import { memo, useMemo } from "react"
import { motion } from "framer-motion"

const Reactions = (props: any) => {
  // const dispatch = useDispatch();
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const reactionEmojis = [
    { label: "smile", node: "😊", key: "smile" },
    { label: "heart", node: "❤️", key: "heart" },
    { label: "100", node: "💯", key: "100" },
    { label: "like", node: "👍", key: "like" },
    { label: "clap", node: "👏", key: "clap" },
  ]

  // { label: 'raised_hand', node: '🤚', key: "raised_hand" },

  const onReactionSelect = (event: any) => {
    // setMessage(event)
    // const timestamp = Date.now()
    const emoji = reactionEmojis.find((item) => item.label === event)?.node
    const data = {
      message: emoji,
      type: "reaction",
    }
    meetingSession
      .sendMessage(JSON.stringify(data), "text", "text")
      .then((response: any) => {
        // const message = isJson(response);
        // if (message) {
        //     const data = {
        //         sender: participantList[selfTileIndex].participant_id,
        //         receiver: "reaction",
        //         participant_id: "reactions_to_all",
        //         message: response.message,
        //         timestamp: response.timestamp,
        //         participant_name: `${participantList[selfTileIndex].name}`
        //     }
        //     // dispatch(actionCreators.addReactions(data))
        // }
      })
      .catch(() => {})
    //
  }
  return (
    <motion.div
      initial={props.isCall ? {} : { scale: 0 }}
      animate={
        props.isCall
          ? {}
          : { scale: 1, transition: { duration: 0.3, ease: "easeOut" } }
      }
      exit={
        props.isCall
          ? {}
          : { scale: 0, transition: { duration: 0.3, ease: "easeOut" } }
      }
      className="origin-bottom-left absolute left-12 bottom-12 z-10"
    >
      <ReactionBarSelector
        iconSize={24}
        reactions={
          // [{ label: "raised_hand", node: <div>🤚</div> },
          // { label: "smile", node: <div>😊</div> },
          // { label: "heart", node: <div>❤️</div> },
          // { label: "100", node: <div>💯</div> },
          // { label: "like", node: <div>👍</div> },
          // { label: "clap", node: <div>👏</div> }
          // ]
          reactionEmojis
        }
        style={{
          backgroundColor: "#292929",
          border: "0.5px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          padding: "5px 10px",
        }}
        onSelect={(event) => onReactionSelect(event)}
      />
    </motion.div>
  )
}

export default memo(Reactions)
