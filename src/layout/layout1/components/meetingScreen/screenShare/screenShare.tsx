import React, { memo, useState } from 'react';
import ViewersTileView from './viewersTileView';
import ScreenShareContent from './screenShareContent';

const ScreenShare = (props: any) => {
  const { length , isCall} = props;
  const [maximizeView, setMaximizeView] = useState(false)
  // 
  return (
    <div className='flex flex-col justify-center items-center h-[calc(100vh-54px)]'>
      {/* {!maximizeView ? */}
      <ViewersTileView length={length} maximizeView={maximizeView} isCall={isCall} />
      {/* : null
      } */}
      <ScreenShareContent setMaximizeView={setMaximizeView} maximizeView={maximizeView} isCall={isCall} />
    </div>
  )
}

export default memo(ScreenShare)