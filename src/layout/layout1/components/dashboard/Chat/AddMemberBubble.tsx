
interface IMember {
  uuid: string;
  unread_msg_count: number;
  status: string;
  profile_picture: string | null;
  presence: string;
  messages: any[];
  lastname: string;
  last_seen?: number | null;
  firstname: string;
  display_name: string | null;
  type: "user" | "group"
}


interface IAddMemberBubble {
  member:any;
  removeMember : (item: IMember) => void
}

const AddMemberBubble = ({ member, removeMember }: IAddMemberBubble) => {
    const profileColors = ["#557BBB", "#B78931", "#91785B"];
    let colorIndex: any =
      (member.uuid?.match(/\d/g).join("") + new Date().getDate()) %
      profileColors.length;
    const deleteMember = () =>{
        removeMember(member)
        //dispatch(actionCreators.setMemberBubbleDelete(member));
    }
  return (
    <div className="h-[23px] w-fit  border-[1.5px] text-primary-200 m-1 flex flex-row rounded-[3px] px-2 border-[#0000001f]">
      <div
        style={{
          backgroundColor: profileColors[colorIndex],
        }}
        className={`w-[19px] h-[19px] text-center flex justify-center items-center shrink-0 rounded-bl-none rounded-[44%] border-[2px] border-[#E9EBF8] text-[9px] text-[white] bg-[#91785B] overflow-hidden`}
      >
        {member.profile_picture ? (
          <img
            className="w-full h-full  object-cover"
            src={member.profile_picture}
            alt=""
          />
        ) : (
          <div className="mt-[2px]">{member.display_name?.slice(0, 1)}</div>
        )}
      </div>
      <div className="text-sm ml-2">{member.display_name}</div>
      <div className="ml-3 mt-[5px] cursor-pointer" onClick={deleteMember}>
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.22969 8.37943L0.617188 7.76693L3.88385 4.50026L0.617188 1.23359L1.22969 0.621094L4.49635 3.88776L7.76302 0.621094L8.37552 1.23359L5.10885 4.50026L8.37552 7.76693L7.76302 8.37943L4.49635 5.11276L1.22969 8.37943Z"
            fill="#A7A9AB"
          />
        </svg>
      </div>
    </div>
  );
};

export default AddMemberBubble;
