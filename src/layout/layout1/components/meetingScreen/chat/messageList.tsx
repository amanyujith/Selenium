import { memo, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Linkify from "linkify-react";
import { actionCreators } from '../../../../../store';
import { t } from 'i18next';

const MessageList = (props: any) => {
    const { messages, groupChatState, privateChatParticipant } = props;
    const dispatch = useDispatch();
    const participantList = useSelector((state: any) => state.Main.participantList)
    const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
    const msgRef = useRef<any>(null);
    const imageTypes = ['.png', '.jpeg', '.jpg', '.svg']
    const themePalette = useSelector((state: any) => state.Main.themePalette);

    useEffect(() => {
        scrollToBottom();
        if (groupChatState) {
            dispatch(actionCreators.setUnReadGroupChat())

        }
        // else {
        // dispatch(actionCreators.setUnReadPrivateChat(privateChatParticipant))
        // }
    }, [messages])

    const scrollToBottom = () => {
        if (msgRef.current) {
            msgRef.current.scrollIntoView({ block: "end" })
        }
    }
    return (
        <div id='MeetingChat'>
            {
                messages.map((item: any, index: number) => {
                    return (
                      <div key={index} ref={msgRef}>
                        {
                          //condition for Group send messages
                          (item.sender ===
                            participantList[selfTileIndex].participant_id &&
                            groupChatState &&
                            item.receiver === "all_participant") ||
                          (item.sender ===
                            participantList[selfTileIndex].participant_id &&
                            item.receiver === props.privateChatParticipant) ? (
                            <div className="mb-2 ml-auto mr-0 text-right w-fit max-w-[240px]">
                              <span className=" text-sm leading-4 mr-1 text-primary-100">
                                {t("Meeting.You")}
                              </span>
                              <span className=" text-sm leading-4 text-primary-100">
                                {new Date(item.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  }
                                )}
                              </span>
                              <div
                                data-private
                                className=" w-fit max-w-[220px] relative px-5 py-2.5 my-1 rounded-[10px] break-words text-left bg-primary-500 bg-opacity-10 select-all"
                                style={{
                                  backgroundColor: `${themePalette?.primary100}50`,
                                }}
                              >
                                {item.type === "file" ? (
                                  <a
                                    href={item.message}
                                    target="_blank"
                                    download={item.title}
                                  >
                                    <span className=" absolute top-2 left-2 px-2 rounded max-w-[125px] w-fit text-left mr-1 overflow-hidden text-ellipsis whitespace-nowrap text-primary-100 bg-[rgba(28,22,22,0.7)]">
                                      {item.title}
                                    </span>
                                  

                                    {imageTypes.includes(
                                      item.message.substring(
                                        item.message.lastIndexOf(".")
                                      )
                                    ) ? (
                                      <img
                                        className=" min-w-[200px] min-h-[100px]"
                                        src={item.message}
                                      />
                                    ) : (
                                      <svg
                                        width="100"
                                        height="100"
                                        viewBox="0 0 100 100"
                                        fill="none"
                                      >
                                        <path
                                          d="M15.95 35.5h16.1v-3h-16.1Zm0-8.5h16.1v-3h-16.1ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z"
                                          transform="translate(30,30)"
                                          fill="#4DC7CC"
                                          width={140}
                                          height={140}
                                        />
                                      </svg>
                                    )}
                                  </a>
                                ) : (
                                  <Linkify options={linkifyOptions}>
                                    {item.message}
                                  </Linkify>
                                )}
                              </div>
                            </div>
                          ) : (item.receiver === "all_participant" &&
                              groupChatState) ||
                            (item.sender === props.privateChatParticipant &&
                              item.receiver ===
                                participantList[selfTileIndex]
                                  .participant_id) ? (
                            <div className="mb-2 text-left w-fit max-w-[240px]">
                              <span className=" text-sm leading-4 mr-1 text-primary-100">
                                {item.participant_name}
                              </span>
                              <span className=" text-sm leading-4 text-primary-100">
                                {new Date(item.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  }
                                )}
                              </span>
                              <div
                                data-private
                                className=" w-fit max-w-[220px] relative px-5 py-2.5 my-1 rounded-[10px] break-words bg-primary-alpha-10 select-all"
                                style={{
                                  backgroundColor: `${themePalette?.primary100}50`,
                                }}
                              >
                                {item.type === "file" ? (
                                  <a
                                    href={item.message}
                                    target="_blank"
                                    download={item.title}
                                  >
                                    
                                    <span className=" absolute top-2 left-2 px-2 rounded max-w-[125px] w-fit text-left mr-1 overflow-hidden text-ellipsis whitespace-nowrap text-primary-100 bg-[rgba(28,22,22,0.7)]">
                                      '{item.title}
                                    </span>
                                    
                                    {imageTypes.includes(
                                      item.message.substring(
                                        item.message.lastIndexOf(".")
                                      )
                                    ) ? (
                                      <img
                                        className=" min-w-[200px] min-h-[100px]"
                                        src={item.message}
                                      />
                                    ) : (
                                      <svg
                                        width="100"
                                        height="100"
                                        viewBox="0 0 100 100"
                                        fill="none"
                                      >
                                        <path
                                          d="M15.95 35.5h16.1v-3h-16.1Zm0-8.5h16.1v-3h-16.1ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z"
                                          transform="translate(30,30)"
                                          fill="#4DC7CC"
                                          width={140}
                                          height={140}
                                        />
                                      </svg>
                                    )}
                                  </a>
                                ) : (
                                  <Linkify options={linkifyOptions}>
                                    {item.message}
                                  </Linkify>
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        }
                      </div>
                    )
                })
            }
        </div>
    )
}

export default memo(MessageList)





const linkifyOptions = {
    className: "text-[#004B91]",
    target: "_blank",
  };