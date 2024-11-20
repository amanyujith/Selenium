import { ChatActionType } from "../action-types";



export const setChatInstance = (data: any) => {
    return {
        type: ChatActionType.SET_CHAT_INSTANCE,
        data
    }
}

export const handleMessage = (data: any) => {
    return {
        type: ChatActionType.HANDLE_CHAT_MESSAGE,
        data
    }
}

export const handleOnlineStatus = (data: any) => {
    return {
        type: ChatActionType.HANDLE_ONLINE_STATUS,
        data
    }
}

export const handleSeen = (data: any) => {
    return {
        type: ChatActionType.HANDLE_SEEN,
        data
    }
}

export const handleDelete = (data: any) => {
    return {
        type: ChatActionType.HANDLE_DELETE,
        data
    }
}

export const handleEdit = (data: any) => {
    return {
        type: ChatActionType.HANDLE_EDIT,
        data
    }
}

export const setUsersList = (data: any) => {

    return {
        type: ChatActionType.SET_USERS_LIST,
        data
    }
}

export const setGroupsList = (data: any) => {
    return {
        type: ChatActionType.SET_GROUPS_LIST,
        data
    }
}

export const setActiveMessenger = (data: any) => {

    return {
        type: ChatActionType.SET_ACTIVE_MESSENGER,
        data
    }
}

export const setShowEmoji = (data: boolean) => {
    return {
        type: ChatActionType.SET_SHOWEMOJI,
        data
    }
}

export const handleReaction = (data: any) => {
    return {
        type: ChatActionType.HANLDE_REACTION,
        data
    }
}

export const setChatscreen = (data: boolean) => {
    return {
        type: ChatActionType.SET_CHAT_SCREEN,
        data
    }
}



export const setAcitveChat = (uuid: string, isGroup: boolean) => {
    return {
        type: ChatActionType.SET_ACTIVE_CHAT,
        uuid,
        isGroup

    }
}

export const setSearchResultChat = (uuid: string, messages: any, isGroup: boolean, msgUuid: string) => {
    return {
        type: ChatActionType.SET_SEARCH_RESULT_CHAT,
        uuid,
        messages,
        isGroup,
        msgUuid
    }
}

export const unsetSearchResultChat = () => {
    return {
        type: ChatActionType.UNSET_SEARCH_RESULT_CHAT,

    }
}

export const setEdit = (data: string) => {
    return {
        type: ChatActionType.SET_EDIT,
        data
    }
}

export const setEmojiBox = (data: boolean) => {
    return {
        type: ChatActionType.SET_EMOJI_BOX,
        data
    }
}

export const setDeleteModal = (data: string) => {
    return {
        type: ChatActionType.SET_DELETE_MODAL,
        data
    }
}

export const setPersonalInfo = (data: string) => {

    return {
        type: ChatActionType.SET_PERSONAL_INFO,
        data
    }
}

export const setChatCallMic = (data: boolean) => {

    return {
        type: ChatActionType.SET_CHAT_CALL_MIC,
        data
    }
}
export const setChatCallCamera = (data: boolean) => {

    return {
        type: ChatActionType.SET_CHAT_CALL_CAMERA,
        data
    }
}
export const setChatCallScreenshare = (data: boolean) => {

    return {
        type: ChatActionType.SET_CHAT_CALL_SCREENSHARE,
        data
    }
}
export const setChatCallInfo = (data: any) => {

    return {
        type: ChatActionType.SET_CHAT_CALL_INFO,
        data
    }
}
export const setOptionBox = (data: any) => {
    return {
        type: ChatActionType.SET_OPTION_BOX,
        data
    }
}
export const setReplyMsg = (data: any) => {
    return {
        type: ChatActionType.SET_REPLY_MSG,
        data
    }
}
export const setReplyFlag = (data: boolean) => {

    return {
        type: ChatActionType.SET_REPLY_FLAG,
        data
    }
}
export const setPastMessages = (data: string, isGroup: boolean, isNew?: boolean) => {

    return {
        type: ChatActionType.SET_PAST_MESSAGES,
        data,
        isGroup,
        isNew
    }
}
export const setCreateGrpOption = (data: boolean) => {

    return {
        type: ChatActionType.SET_CREATE_GRP_OPTION,
        data
    }
}
export const setNewChatOption = (data: boolean) => {
    return {
        type: ChatActionType.SET_NEW_CHAT_OPTION,
        data
    }
}
export const setCreateGrpModal = (data: boolean) => {

    return {
        type: ChatActionType.SET_CREATE_GRP_MODAL,
        data
    }
}

export const setMemberBubbleDelete = (data: any) => {

    return {
        type: ChatActionType.SET_MEMBER_BUBBLE_DELETE,
        data
    }
}
export const setCall = (data: any) => {

    return {
        type: ChatActionType.SET_CALL,
        data
    }
}

export const flagSetCall = (data: boolean) => {

    return {
        type: ChatActionType.FLAG_SET_CALL,
        data
    }
}

export const setShareMsgModal = (data: boolean) => {

    return {
        type: ChatActionType.SET_SHARE_MSG_MODAL,
        data
    }
}
export const setAddAdminModal = (data: boolean) => {

    return {
        type: ChatActionType.SET_ADD_ADMIN_MODAL,
        data
    }
}
export const setTwoOptionModal = (data: any) => {

    return {
        type: ChatActionType.SET_TWO_OPTION_MODAL,
        data
    }
}

export const unsetUnread = (uuid: string, isGroup: boolean) => {

    return {
        type: ChatActionType.UNSET_UNREAD,
        uuid,
        isGroup
    }
}

export const updateGroupData = (data: any, isCreate: boolean) => {
    return {
        type: ChatActionType.UPDATE_GROUP_DATA,
        data,
        isCreate
    }
}

export const chatIsScrolled = (data: any, scrollPos: number | null, isGroup: boolean) => {
    return {
        type: ChatActionType.IS_SCROLLED,
        data,
        scrollPos,
        isGroup
    }
}


export const setChatByUUID = (uuid: string, data: any) => {
    return {
        type: ChatActionType.SET_CHAT_BY_UUID,
        uuid,
        data

    }
}

export const setDraftMessage = (uuid: string, draftText: any, isGroup: boolean) => {
    return {
        type: ChatActionType.SET_DRAFT_MESSAGE,
        uuid,
        draftText,
        isGroup
    }
}

export const removeGroupMember = (data: any) => {
    return {
        type: ChatActionType.REMOVE_GROUP_MEMBER,
        data,
    }
}

export const alignOneSide = (data: boolean) => {
    return {
        type: ChatActionType.ALIGN_ONE_SIDE,
        data,
    }
}

export const addNewChat = (data: any, setActive: boolean) => {
    return {
        type: ChatActionType.ADD_NEW_CHAT,
        data,
        setActive
    }
}

export const setChatMessage = (data: any, isGroup: boolean, uuid: string) => {
    return {
        type: ChatActionType.SET_CHAT_MESSAGE,
        data,
        isGroup,
        uuid
    }
}

export const addGroupMember = (data: any) => {
    return {
        type: ChatActionType.ADD_GROUP_MEMBER,
        data
    }
}


export const setAttachment = (uuid: string | undefined, files: any, isGroup: boolean) => {
    return {
        type: ChatActionType.SET_ATTACHMENT,
        uuid,
        files,
        isGroup
    }
}

export const setAttachmentURL = (uuid: string | undefined, isGroup: boolean, url: string, index: number,) => {
    return {
        type: ChatActionType.SET_ATTACHMENT_URL,
        uuid,
        isGroup,
        url,
        index
    }
}

export const setUploadingStatus = (uuid: string | undefined, isGroup: boolean, status: boolean) => {
    return {
        type: ChatActionType.SET_UPLOADING_STATUS,
        uuid,
        isGroup,
        status
    }
}

export const setUploadingFailed = (uuid: string | undefined, isGroup: boolean, index: number,) => {
    return {
        type: ChatActionType.SET_UPLOADING_FAILED,
        uuid,
        isGroup,
        index
    }
}

export const setIncomingCall = (data: any) => {
    return {
        type: ChatActionType.SET_INCOMING_CALL,
        data
    }
}

export const unsetIncomingCall = (isCurrentCall: boolean, id?: string, data?: any) => {
    return {
        type: ChatActionType.UNSET_INCOMING_CALL,
        isCurrentCall: isCurrentCall,
        id: id,
        data: data,
    }
}

export const setIncomingCallModal = (data: boolean) => {
    return {
        type: ChatActionType.INCOMING_CALL_MODAL,
        data
    }
}

export const setChatData = (data: any) => {
    return {
        type: ChatActionType.SET_CHAT_DATA_UPDATE,
        data
    }
}

export const unsetAcitveChat = () => {
    return {
        type: ChatActionType.UNSET_ACTIVE_CHAT,

    }
}

export const setArrowUpEdit = () => {
    return {
        type: ChatActionType.SET_ARROWUP_EDIT,
    }
}

export const setTypingIndicator = (data: any) => {
    return {
        type: ChatActionType.SET_TYPING_INDICATOR,
        data: data
    }
}

export const unsetTypingIndicator = (data: string) => {
    return {
        type: ChatActionType.UNSET_TYPING_INDICATOR,
        data: data
    }
}
export const handleMessageInLimbo = (data: any, isGroup: boolean) => {

    return {
        type: ChatActionType.HANDLE_MESSAGES_IN_LIMBO,
        data,
        isGroup
    }
}

export const archiveGroup = (uuid: string) => {
    return {
        type: ChatActionType.ARCHIVE_GROUP,
        uuid
    }
}
export const kickOut = (data: string) => {
    return {
        type: ChatActionType.KICK_OUT,
        data
    }
}

export const pinMessage = (data: any, isGroup: boolean, messageUUID: string, pinnedBy: string, isPin: boolean, pinnedMessage?: any) => {

    return {
        type: ChatActionType.HANDLE_PIN_MESSAGE,
        data,
        isGroup,
        messageUUID,
        pinnedBy,
        isPin,
        pinnedMessage
    }
}

export const messageDelivered = (data: number) => {
    return {
        type: ChatActionType.MESSAGE_DELIVERED,
        data,
    };
};

export const callData = (data: object) => {
    return {
        type: ChatActionType.CALL_DATA,
        data
    };
};
export const updateCachedMessages = (data: any, remove?: boolean) => {
    return {
        type: ChatActionType.UPDATE_CACHED_MESSAGES,
        data,
        remove
    };
};
export const searchFlag = (data: any) => {
    return {
        type: ChatActionType.SEARCH_FLAG,
        data
    };
};
export const hoveredMessage = (data: any) => {
    return {
        type: ChatActionType.HOVERED_MESSAGE,
        data,
    };
};
export const updateOptions = (data: any) => {
    return {
        type: ChatActionType.UPDATE_OPTIONS,
        data,
    };
};
export const searchActiveChat = (data: any) => {
    return {
        type: ChatActionType.SEARCH_ACTIVE_CHAT,
        data,
    };
};
export const callToggle = (data: any) => {
    return {
        type: ChatActionType.CALL_TOGGLE,
        data,
    };
};
export const callMeetingData = (data: any) => {
    return {
        type: ChatActionType.CALL_MEETING_DATA,
        data,
    };
};

export const rejectReasonModal = (data: boolean) => {
    return {
        type: ChatActionType.REJECT_REASON_MODAL,
        data,
    };
};
export const selfData = (data: any) => {
    return {
        type: ChatActionType.SELF_DATA,
        data,
    };
};

export const pinnedChat = (data: any) => {
    return {
        type: ChatActionType.PINNED_CHAT,
        data,
    };
};

export const setMiniProfile = (data: boolean) => {
    return {
        type: ChatActionType.SET_MINI_PROFILE,
        data,
    };
};
export const setPersonalStatus = (data: any) => {
    return {
        type: ChatActionType.SET_PERSONAL_STATUS,
        data,
    };
};
export const callConnected = (data: any) => {
    return {
        type: ChatActionType.CALL_CONNECTED,
        data,
    };
};
export const handleActivePlaying = (data: any) => {
    return {
        type: ChatActionType.SETACTIVEPLAYING,
        data,
    };
};

export const setMeetingModal = (data: boolean) => {
    return {
        type: ChatActionType.SET_MEETING_MODAL,
        data,
    };
};
export const callToggleFlag = (data: any) => {
    return {
        type: ChatActionType.CALL_TOGGLE_FLAG,
        data,
    };
};

export const setMiniUuid = (data: any) => {
    return {
        type: ChatActionType.SET_MINI_UUID,
        data,
    };
};

export const setMqttStatus = (data: any) => {
    return {
        type: ChatActionType.SET_MQTT_STATUS,
        data,
    };
};

export const setNotification = (data: any) => {
    return {
        type: ChatActionType.SET_NOTIFICATION,
        data,
    };
};
export const setInviteState = (data: any) => {
    return {
        type: ChatActionType.SET_INVITE_STATE,
        data,
    };
};
export const gotoFile = (data: any) => {
    return {
        type: ChatActionType.GOTOFILE,
        data,
    };
};
export const setMentionUuid = (data: any) => {
    return {
        type: ChatActionType.SET_MENTION_UUID,
        data,
    };
};
export const clearChatData = () => {
    return {
        type: ChatActionType.CLEAR_CHAT_DATA,
    };
};
export const callReconnection = (data: any) => {
    return {
        type: ChatActionType.CALL_RECONNECTION,
        data,
    };
};
export const updateUserEvent = (data: any) => {
    return {
        type: ChatActionType.UPDATE_USER_EVENT,
        data,
    };
};
export const enableDisableEvent = (data: any) => {
    return {
        type: ChatActionType.ENABLE_DISABLE_EVENT,
        data,
    };
};

export const meetCredentials = (id: any, password: any) => {
    return {
        type: ChatActionType.MEET_CREDENTIALS,
        id,
        password,
    };
};

export const endCall = (data: any) => {
    return {
        type: ChatActionType.END_CALL,
        data,
    };
};

export const setMultipleMsgSelect = (data: boolean) => {
  return {
    type: ChatActionType.SET_MULTIPLE_MSG_SELECT,
    data,
  };
};

export const setMultipleMsgList = (data: any) => {
  return {
    type: ChatActionType.SET_MULTIPLE_MSG_LIST,
    data,
  };
};


