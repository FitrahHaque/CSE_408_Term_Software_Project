import React, { useEffect, useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { ISettings } from '../Playground';
import SettingsModal from '@/components/Modals/SettingsModal';
type PreferenceNavProps = {
    settings:ISettings;
    onSetSettings:React.Dispatch<React.SetStateAction<ISettings>>;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({ settings, onSetSettings }) => {
    const [ isFullScreen, setIsFullScreen ] = useState<boolean> (false);
    const handleFullScreen = () => {
        if(isFullScreen) {
            document.exitFullscreen();
        }
        else{
            document.documentElement.requestFullscreen();
        }
        setIsFullScreen(!isFullScreen);
    };
    useEffect(()=> {
        function exitHandler(event:any) {
            if(!document.fullscreenElement){
                setIsFullScreen(false);
                return;
            }
            setIsFullScreen(true);
        }
        if(document.addEventListener) {
            document.addEventListener("fullscreenchange",exitHandler);
            document.addEventListener("webkitfullscreenchange", exitHandler);
            document.addEventListener("mozfullscreenchange",exitHandler);
            document.addEventListener("MSFullscreenChange", exitHandler);
        }
    }, [isFullScreen])
    return (
        <div className='flex h-11 w-full items-center justify-between bg-dark-layer-2'>
            <button className='flex cursor-pointer items-center rounded text-left focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 font-medium'>
                <div className='flex items-center px-1'>
                    <div className='text-xs text-label-2 daek:text-dark-label-2'>
                        JavaScript
                    </div>
                </div>
            </button>

            <div className='flex items-center m-2'>
                <button className='preferenceBtn group' onClick={()=>onSetSettings({ ...settings, settingsModalIsOpen:true })}>
                    <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                        <FiSettings />                        
                    </div>
                    <div className='preferenceBtn-tooltip'>
                        Settings
                    </div>
                </button>
                <button className='preferenceBtn group' onClick={handleFullScreen}>
                    <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                        {isFullScreen ? <AiOutlineFullscreenExit/> :<AiOutlineFullscreen />}                        
                    </div>
                    <div className='preferenceBtn-tooltip'> Full Screen
                    </div>
                </button>
            </div>
            {settings.settingsModalIsOpen && <SettingsModal settings={settings} setSettings={onSetSettings}/>}
        </div>
    )
}
export default PreferenceNav;