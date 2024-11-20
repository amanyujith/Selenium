import React from 'react'

interface ISearchResultMessage {
    profile_picture?: any;
    item: any;
    isGroup: boolean;
    name?: string;
}

const SearchResultMessage = ({
    profile_picture,
    item,
    isGroup,
    name,
    

}: ISearchResultMessage) => {
    return (
      <div>
        <div className={`h-fit flex flex-row pr-10`}>
          <div
            className={`w-[33px] h-[33px] text-center shrink-0 rounded-bl-none rounded-[50%] text-[20px] text-[white] bg-[#91785B] overflow-hidden`}
          >
            {name?.slice(0, 1).toUpperCase()}
          </div>
        </div>
      </div>
    );
}

export default SearchResultMessage