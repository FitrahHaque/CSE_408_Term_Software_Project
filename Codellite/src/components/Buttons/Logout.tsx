import React from 'react';
import {FiLogOut} from 'react-icons/fi';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
type LogoutProps = {};

const Logout:React.FC<LogoutProps> = () => {
    const [signOut, loading, error] = useSignOut(auth);

    const handleLogout = async () => {
        signOut();
    }
    return (
        <button className='bg-black py-1.5 px-3 cursor-pointer rounded text-sky-300' onClick={handleLogout}>
            <FiLogOut/>
        </button>
    )
}
export default Logout;