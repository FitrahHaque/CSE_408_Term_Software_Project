import React from 'react';
import { FiSettings } from 'react-icons/fi';
import { AiOutlineFullscreen } from 'react-icons/ai';
type PreferenceNavProps = {

};

const PreferenceNav: React.FC<PreferenceNavProps> = () => {

    return (
        <div className='flex h-11 w-full items-center justify-between bg-dark-layer-2'>
            <button className='flex cursor-pointer items-center rounded text-left focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 font-medium'>
                <div className='flex items-center px-1'>
                    <div className='text-xs text-label-2 daek:text-dark-label-2'>
                        C++
                    </div>
                </div>
            </button>

            <div className='flex items-center m-2'>
                <button className='preferenceBtn group'>
                    <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                        <FiSettings />                        
                    </div>
                    <div className='preferenceBtn-tooltip'>
                        Settings
                    </div>
                </button>
                <button className='preferenceBtn group'>
                    <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                        <AiOutlineFullscreen />                        
                    </div>
                    <div className='preferenceBtn-tooltip'> Full Screen
                    </div>
                </button>
            </div>
        </div>
    )
}
export default PreferenceNav;