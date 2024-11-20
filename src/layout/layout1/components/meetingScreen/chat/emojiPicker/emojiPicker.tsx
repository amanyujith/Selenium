import { GithubSelector } from '@charkour/react-reactions';
import { memo } from 'react';


const EmojiPicker = (props: any) => {

  const { onEmojiSelect } = props;

  // const stopPropagation = (e: any) => {
  //   e.stopPropagation();
  // };

  return (

    <div id='emojiSection' className=' mt-1'>
      <GithubSelector
        reactions={['😊', '😁', '😀', '😂', '🤣', '🥺', '😭', '😠', '😍', '❤️', '🔥', '👍', '👎', '✌️', '👌', '👋', '✋', '👏']}
        onSelect={(event) => onEmojiSelect(event)}
      />
    </div>
  )
}
export default memo(EmojiPicker); 