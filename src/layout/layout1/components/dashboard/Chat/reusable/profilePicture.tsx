import React from 'react'

interface IProfilePicture {
    profile_picture : string;
    name: string;
    children?: React.ReactNode

}

const ProfilePicture = ({profile_picture, name, children} :IProfilePicture  ) => {
  return (
    <div
      className={`w-[33px] h-[30px] shrink-0 rounded-bl-none rounded-[50%] text-[20px] border-[2px] border-[#E9EBF8] capitalize text-[white] bg-[#91785B] overflow-hidden`}
    >
      {profile_picture ? (
        <img
          className="w-full h-full  object-cover"
          src={profile_picture}
          alt=""
        />
      ) : (
        name?.slice(0, 1)
      )}
      {children}
    </div>
  );
}

export default ProfilePicture
