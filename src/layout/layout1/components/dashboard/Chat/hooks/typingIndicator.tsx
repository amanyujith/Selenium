import { t } from 'i18next';
import React, {useCallback, useEffect, useState} from 'react';
import "./typing.css"

interface ITypingIndicator {
  name: string | undefined | null;
  getName: (uuid: string) => string;
  uuid: string;
  profile_picture?: any;
  members?:any;
  inactive_members?:any;
  isGroup?:any;
}

const TypingIndicator: React.FC<ITypingIndicator> = ({
  name,
  getName,
  uuid,
  profile_picture,
  members,
  inactive_members,
  isGroup,
}) => {
  const [groupUsername, setGroupUsername] = useState<string | null>(null);
  useEffect(() => {
    if (name === null) {
      const username = getName(uuid);
      setGroupUsername(username);
    }
  }, [uuid]);

  const getProfilePicture = useCallback(
    (from: any) => {
      if (members && members.length > 0) {
        const user = members.find((item: any) => item.user_id === from);
        if (user) {
          if (user.profile_picture) {
            return (
              <img
                className="w-full h-full  object-cover"
                src={user.profile_picture}
                alt=""
              />
            );
          } else return user.display_name?.slice(0, 1);
        } else {
          const inactive_user = inactive_members.find(
            (item: any) => item.user_id === from
          );
          if (inactive_user) {
            if (inactive_user.profile_picture) {
              return (
                <img
                  className="w-full h-full  object-cover"
                  src={inactive_user.profile_picture}
                  alt=""
                />
              );
            } else return inactive_user.display_name?.slice(0, 1);
          }
        }
      } else return "";
    },
    [members, inactive_members]
  );

  return (
    <div className="ml-2 flex flex-row items-end align-bottom justify-center  mr-2 mb-1">
      <div
        className={`w-[24px] h-[24px] flex items-center justify-center text-center shrink-0 capitalize rounded-bl-none rounded-[50%] text-[13px] border-[2px] border-[#E9EBF8] text-[white] bg-[#91785B] overflow-hidden`}
      >
        {isGroup ? (
          getProfilePicture(uuid)
        ) : profile_picture ? (
          <img
            className="w-full h-full  object-cover"
            src={profile_picture}
            alt=""
          />
        ) : (
          <div className="capitalize">{name?.slice(0, 1)}</div>
        )}
      </div>
      <div className="typing">
        <div>
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
        </div>
        <div className="mt-[2px] text-center m-auto">
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
