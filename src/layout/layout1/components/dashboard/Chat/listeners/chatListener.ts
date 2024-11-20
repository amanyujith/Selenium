import { actionCreators, store } from "../../../../../../store";
import path from "../../../../../../navigation/routes.path";
const _ = require("lodash");

var indicatorIntervals: any = {};

const ChatListeners = (
  dispatch: any,
  instance: any,
  navigate: any,
  sendNotification: any,
  meetingInstance: any
) => {


  const handleNotiClick = (data: any) => {
    if (data) {
      if (data.isGroup) {
        window.focus();
        navigate(`${path.CHAT}/${data.message.to}`);
        dispatch(actionCreators.setAcitveChat(data.message?.to, data.isGroup));
      } else {
        window.focus();
        navigate(`${path.CHAT}/${data.message.from}`);
        dispatch(actionCreators.setAcitveChat(data.message.from, data.isGroup));
      }
    }
  };


  const endCall = () => {
    const callInfo = store.getState().Chat.chatCallInfo
    if (callInfo) {
      meetingInstance.leaveMeetingSession();
      dispatch(actionCreators.callToggleFlag(false));
      dispatch(actionCreators.callConnected(false));
      dispatch(actionCreators.setPublisherState(false));
      dispatch(actionCreators.clearMeetingStore());
      dispatch(actionCreators.clearMeetingFlags());
      dispatch(actionCreators.clearParticipantList());
      dispatch(actionCreators.setChatCallInfo(null));
    }
  };

  instance?.addEventListener("readyState", (data: any) => {
    instance.grafanaLogger([
      "Client : ReadyState",
      {
        groupCount: data?.group_info?.length,
        userCount: data?.member_info?.length,
      },
    ]);
    console.log(data, "readyState");
    dispatch(actionCreators.callMeetingData(data.meetings));
    dispatch(actionCreators.setChatData(data));
    dispatch(actionCreators.setMqttStatus("mqtt_online"));
    dispatch(actionCreators.setPersonalInfo(data));
  });

  instance?.addEventListener("errorhandler", (data: any) => {
    if (data.event === "mqtt_end") {
      instance.closeConnection();
      instance.grafanaLogger(["Client : Mqtt Disconnected"]);
      instance.initialiseSession();
      instance.grafanaLogger(["Client : Mqtt Initialised"]);
    }
  });

  instance?.addEventListener("message", (data: any) => {
    const permissions = store.getState().Main.permissionSettings
    const mqttStatus = store.getState().Chat.setMqttStatus;
    if (permissions?.chat?.length) {
      console.log("messageEvents", data);
      instance.grafanaLogger([
        "Client : Messages",
        {
          category: data?.message?.category,
          uuid: data?.message?.uuid,
          from: data?.message?.from,
          to: data?.message?.to,
          type: data?.message?.type
            ? data?.message?.type
            : data?.message?.category,
        },
      ]);

      if (data.message.status === "delivered_server" && data.message.isPublisher) {
        dispatch(actionCreators.messageDelivered(data.message.a_ctime));
        mqttStatus === "mqtt_reconnect" &&
          dispatch(actionCreators.setMqttStatus("mqtt_online"));
      }

      const myUUID = instance.globalInfo.user_token;

      if (data.message) {
        switch (data.message.category) {
          case "reaction_message":
            dispatch(actionCreators.handleReaction({ ...data }));
            break;
          case "seen_message":
            dispatch(actionCreators.handleSeen(_.cloneDeep(data)));
            break;
          case "delete_message": {
            dispatch(actionCreators.handleDelete({ ...data }));
            break;
          }
          case "retain_message": {
            dispatch(actionCreators.handleDelete({ ...data }));
            break;
          }
          case "edited_message": {
            dispatch(actionCreators.handleEdit({ ...data }));

            break;
          }
          case "pin_message": {
            console.log("pin_message", data);
            dispatch(
              actionCreators.pinMessage(
                data.isGroup
                  ? data.message.to
                  : data.message.pinned_by === myUUID
                    ? data.message.to
                    : data.message.from,
                data.isGroup,
                data.message.uuid,
                data.message.pinned_by,
                data.message.pin,
                data.message?.message
              )
            );
            break;
          }

          default:
            if (data.message.type !== "keep_alive") {
              if (data.message.type === "call") {
                if (myUUID !== data.message.from) {
                  if (
                    data.message.body.action === "initiate" ||
                    data.message.body.action === "invite"
                  ) {
                    dispatch(
                      actionCreators.notificationData({
                        title:
                          "You have an incoming call from " +
                          (data.isGroup
                            ? data.message.body.data.groupName
                            : data.message.body.data.name),
                        message: "",
                        onClick: () => handleNotiClick(data),
                        onClose: () => { },
                        duration: 2000,
                      })
                    );
                    const incomingCall = store.getState().Chat.incomingCall;
                    if (incomingCall) {
                      dispatch(actionCreators.callToggle(incomingCall))
                    }
                    dispatch(actionCreators.setIncomingCall(data.message));
                  } else if (
                    data.message.body.action === "terminate"
                  ) {
                    const meetingInfo: any = store.getState().Main.meetingInfo
                    const callInfo = store.getState().Chat.chatCallInfo;
                    if (
                      meetingInfo.meetingId ===
                      data.message.body.meetingId
                    ) {

                      if (callInfo) {
                        // instance?.publishMessage("call", callInfo.uuid, callInfo.isGroup, {
                        //   message: {
                        //     action: "terminate",
                        //     meetingId: meetingInfo.meetingId,
                        //   },
                        //   callAction: "terminate"
                        // })
                        endCall()
                      }
                      dispatch(actionCreators.callConnected(false));
                      dispatch(actionCreators.unsetIncomingCall(true));
                    } else {
                      dispatch(
                        actionCreators.unsetIncomingCall(false, data.message.from)
                      );
                    }
                    dispatch(
                      actionCreators.callToggle({
                        to: data.message.to,
                        from: null,
                        body: {
                          meetingData: null,
                          data: {
                            isGroup: data.message.isGroup,
                          },
                        },
                      })
                    );
                  } else if (
                    data.message.body.action === "join" && data.message.body.type === "initiate"
                  ) {
                    dispatch(
                      actionCreators.callToggle({
                        to: data.message.to,
                        from: data.message.from,
                        body: {
                          meetingData: data.message.body.meetingData,
                          data: {
                            isGroup: data.isGroup,
                          },
                        },
                      })
                    );
                    if (data.message.body.data.uuid ===
                      instance.chatconfiguration.user) {
                      dispatch(actionCreators.callMeetingData(data.message.body));
                    }

                  }
                }
              } else if (data.message.type === "typing") {
                console.log(data, 'typingDataTest')
                if (data.message.body.uuid !== myUUID) {
                  const typingTargetID = data.isGroup
                    ? data.message.to
                    : data.message.from;
                  dispatch(actionCreators.setTypingIndicator(data));
                  if (indicatorIntervals[typingTargetID])
                    clearTimeout(indicatorIntervals[typingTargetID]);
                  indicatorIntervals[typingTargetID] = setTimeout(() => {
                    dispatch(actionCreators.unsetTypingIndicator(data));
                  }, 9500);
                }
              } else {
                dispatch(actionCreators.handleMessage(_.cloneDeep(data)));
                if (data.message.type == "system" && data.isGroup)
                  dispatch(
                    actionCreators.unsetIncomingCall(true, data?.message?.to)
                  );
                if (
                  myUUID !== data.message.from &&
                  data.message.type !== "system" &&
                  data.message?.category !== "delivered_ack"
                ) {
                  const typingTargetID = data.isGroup
                    ? data.message.to
                    : data.message.from;
                  if (indicatorIntervals[typingTargetID]) {
                    clearTimeout(indicatorIntervals[typingTargetID]);
                    // dispatch(actionCreators.unsetTypingIndicator(data));
                  }

                  dispatch(
                    actionCreators.notificationData({
                      title: getTitle(data),
                      message:
                        data.message.type === "text"
                          ? data.message.body.plainText ?? ""
                          : "shared a file",
                      onClick: () => handleNotiClick(data),
                      onClose: () => { },
                      duration: 2000,
                      isGroup: data.isGroup ? true : false,
                      uuid: data.isGroup ? data.message.to : data.message.from,
                    })
                  );
                }
              }
            }

            break;
        }
      }
    }
  });

  instance?.addEventListener("onlineStatus", (data: any) => {
    instance.grafanaLogger(["Client : onlineStatus", data]);
    dispatch(actionCreators.handleOnlineStatus(data));
  });

  instance?.addEventListener("notification", (data: any) => {
    console.log(data, 'incominGCaller')
    instance.grafanaLogger([
      "Client : Event Notifications",
      {
        uuid: data?.message?.uuid,
        from: data?.message?.from,
        to: data?.message?.to,
        type: data?.message?.type ? data.message.type : data?.message?.category,
        event: data?.event,
      },
    ]);
    if (data.event === "group_creation" || data.event === "group_update") {
      dispatch(actionCreators.updateGroupData(data.data, false));
      //navigate(`${path.CHAT}/${data.data.uuid}`)
    } else if (data.event === "group_archive") {
      dispatch(actionCreators.archiveGroup(data.data.uuid));
    } else if (data.event === "remove_group_member") {
      dispatch(actionCreators.removeGroupMember(data));
    } else if (data.event === "new_group_chat") {
      dispatch(
        actionCreators.addNewChat({ data: data.data, isGroup: true }, false)
      );
      //navigate(`${path.CHAT}/${data.data.uuid}`)
    } else if (data.event === "new_group_call") {
      dispatch(
        actionCreators.addNewChat({ data: data.data, isGroup: true }, false)
      );

      dispatch(actionCreators.setIncomingCall(data.content));
    } else if (data.event === "new_user_chat") {
      dispatch(
        actionCreators.addNewChat({ data: data.data, isGroup: false }, false)
      );
      //navigate(`${path.CHAT}/${data.data.uuid}`)
    } else if (data.event === "new_user_call") {
      dispatch(
        actionCreators.addNewChat({ data: data.data, isGroup: false }, false)
      );
      dispatch(actionCreators.setIncomingCall(data.content));
    } else if (data.event === "update_read_count") {
      dispatch(actionCreators.unsetUnread(data.uuid, data.isGroup));
    } else if (data.event === "add_group_member") {
      dispatch(actionCreators.addGroupMember(data));
    } else if (data.event === "acknowledgement") {
      endCall();
      if (data.MqttMessage.body.type === 'initiate') {
        dispatch(actionCreators.callToggle({
          to: data.MqttMessage.to,
          from: data.MqttMessage.from,
          body: {
            meetingData: data.MqttMessage.body.meetingData,
            data: {
              isGroup: data.MqttMessage.isGroup,
            },
          },
        }));
      }
      dispatch(actionCreators.unsetIncomingCall(true, data?.MqttMessage?.to));
    } else if (data.event === "initiated_timeout_end") {
      instance?.publishMessage("call", data.body.uuid, data.body.is_group, {
        message: {
          action: "terminate",
          meetingId: data.body.meetingId,
        },
        callAction: "terminate",
      });
      const incomingCallData = store.getState().Chat.incomingCall
      if (data.body.progress) {
        dispatch(actionCreators.callToggle(incomingCallData))
      }

      if (data.body.from === instance.chatconfiguration.user)
        endCall();
      dispatch(actionCreators.unsetIncomingCall(false, data?.body?.meetingId));
    } else if (data.event === "initiated_timeout_minimize") {
      dispatch(actionCreators.setIncomingCallModal(false));
    } else if (data.event === "timeout") {
      instance?.publishMessage("call", data.body.uuid, data.body.is_group, {
        message: {
          action: "end",
          meetingId: data.body.meetingId,
        },
      });
      endCall();
    } else if (
      data.event === "remove_personal_status" ||
      data.event === "update_personal_status"
    ) {
      dispatch(actionCreators.setPersonalStatus(data));
    } else if (
      data.event === "mqtt_reconnect" ||
      data.event === "mqtt_offline"
    ) {
      console.log(data.event, "mqttStatus");
      dispatch(actionCreators.setMqttStatus(data.event));
    } else if (data.event === "disable_user_event" || data.event === "delete_user_event" || data.event === 'enable_user_event') {
      const loggedInUserInfo = store.getState().Main.loggedInUserInfo
      console.log(data, 'eventtesting')
      if (data.body.user_uuid === loggedInUserInfo.sub) {
        dispatch(actionCreators.clearLoginSession(true))
      } else {
        dispatch(actionCreators.enableDisableEvent(data))
      }
    } else if (data.event === 'incoming_call') {
      console.log('IncomingPbxCall222', data)
      dispatch(actionCreators.setPbxCallData({
        type: "incoming",
        data: {
          caller: data.body.caller,
          user_sil_id: data.body.user_sil_id,
          callee: data.body.callee,
          uuid: data.body.uuid,
          name: data.body.display_name,
          handle_id : data.body.topic
        }
      }))
      dispatch(actionCreators.setIncomingPbxCall(data))
    } else if (data.event === 'hangup') {
      const activeCall = store.getState().Call.activeCall
      if (!activeCall) {
        dispatch(actionCreators.setIncomingPbxCall(""))
              dispatch(actionCreators.setPbxCallData({
        type: null,
        data: {}
      }))
      dispatch(actionCreators.callButtonState({
        muteButton: "Mute",
        holdButton: "Hold",
        addCallButton: false
      }))
       setTimeout(() => {
            const callStatus = store.getState().Call.callStatus
         dispatch(actionCreators.setCallState('inactive'))   
             dispatch(actionCreators.setActiveCall(false))
            dispatch(actionCreators.setCallStatus(callStatus === "active" ? "active" : ""))  
       }, 1200);
      }
    } else if (data.event === "answered") {
      const callState = store.getState().Call.callState
      if (callState !== 'inCall' && callState !== 'inCallKeypad')  {
        dispatch(actionCreators.setIncomingPbxCall(""))
      }
    } else if (data.event === 'terminate') {
      const callInfo = store.getState().Chat.chatCallInfo
      if (callInfo.uuid === data.body.group_id) {
        endCall()
      }
      dispatch(actionCreators.unsetIncomingCall(false, data.body.from));


    } else if (data.event === "update_user_event") {
      dispatch(actionCreators.updateUserEvent(data))
    } else if (data.event === 'extension_update_event') {
      dispatch(actionCreators.extensionUpdateEvent(data))
    } else if (data.event === 'invite_terminate') {
      dispatch(actionCreators.unsetIncomingCall(true, data.body.meetingId))
    }
  });

  const getTitle = (data: any) => {
    if (data.isGroup) {
      const groupData = instance?.fetchGroupData();
      let group = groupData.find((item: any) => item.uuid === data.message.to);

      return `New message in ${group?.name}`;
    } else {
      const userData = instance?.fetchUserData();
      let user = userData.find((item: any) => item.uuid === data.message.from);

      return `You have a new message from ${user?.display_name}`;
    }
  };
};

export default ChatListeners;
