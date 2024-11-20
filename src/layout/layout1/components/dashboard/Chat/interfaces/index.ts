export interface IMessage {
  uuid: string,
  type: string,
  to: string,
  tenant: string,
  status: string,
  seen: Array <any>,
  reply_to: string | undefined,
  other_info_map: Array <string>,
  from: string,
  forward_from: string | undefined,
  category: string,
  body: any,
  a_mtime: number,
  a_ctime: number

}
export interface IUserData {
  uuid: any;
  unread_msg_count: number;
  status: string;
  profile_picture: string;
  presence: string;
  messages: Array <IMessage>;
  lastname: string;
  last_seen: number;
  firstname: string;
  display_name?: any;
  isTyping?: null | string;
  call_details: any;
  messageRecieved: boolean;
  personal_status: any;
}


export interface IGroupMembers {
  uuid: string;
  user_id: string;
  status: string;
  name: string;
  modified_by: string;
  left_time: string;
  join_time: any;
  group_id: string;
  external_member: boolean;
  created_by: string;
  a_mtime: any;
  a_ctime: any;

}

export interface IGroupData {
  uuid: any;
  unread_msg_count: number;
  tenant: string;
  status: string;
  profile_picture?: any;
  name: string;
  modified_by: string;
  messages: any[];
  members: IGroupMembers[];
  link_id?: any;
  external_group: boolean;
  description?: any;
  created_by: string;
  admin: string[];
  a_mtime: number;
  a_ctime: number;
  isTyping?: null | string;
  private: boolean;
  call_details: any;
  messageRecieved: boolean
}


export interface IChatRoot {
  userData: IUserData [];
  groupData: IGroupData [];
  isReady: boolean;
  showEmoji: boolean;
  activeChat: any;
  uuid: string;
  reaction: any;
  edit: string;
  editMsg: any;
  chatScreen: boolean;
  emojiBox: boolean;
  deleteModal: string;
  chatInstance: any;
  personalInfo: any;
  chatCallMic: boolean;
  chatCallCamera: boolean;
  chatCallScreenshare: boolean;
  chatCallInfo: any;
  showOption: boolean;
  replyMsg: any;
  replyFlag: boolean;
  createGrpOption: boolean;
  createGrpModal: boolean;
  grpMembers: any;
}



