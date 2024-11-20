import { Route, Routes } from 'react-router-dom';
import Chats from './Chat/Chats';
import SettingsPanel from './settingsPanel';

const LeftPanel = (props: any) => {

  const { toggle } = props;

  


  return (
    <div className=' w-64 h-screen rounded-r-[30px] bg-primary-500'>
      {/* {
        toggle? <Chats /> : <SettingsPanel />
      } */}


      {/* <Routes>
        <Route path ="/settings" element ={<SettingsPanel />}/>
      </Routes> */}

      {/* <Chats /> */}
      {/* <SettingsPanel /> */}

    </div>
  )
}

export default LeftPanel