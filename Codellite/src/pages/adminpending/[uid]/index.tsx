import AdminPendingTable from "@/components/AdminPendingTable/AdminPendingTable";
import Topbar from "@/components/Topbar/Topbar";
import { auth } from "@/firebase/firebase";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";



type AdminPendingPageProps = {
    uid: string;
};

const AdminPendingPage: React.FC<AdminPendingPageProps> = ({ uid }) => {
    const [loadingProblems, setLoadingProblems] = useState<boolean>(true);
    const [user] = useAuthState(auth);
    const[ currentAdmin, setCurrentAdmin ] = useState({
        displayName: '',
        uid: '',
    })
    useEffect(()=> {
        const getCurrentUser = async () => {
            const res = await fetch('/api/auth/getcurrentuser', {
                method: 'POST',
                body: JSON.stringify({
                    uid: user!.uid,
                })
            })
            const data = await res.json();
            setCurrentAdmin((prev)=> ({
                ...prev,
                displayName: data.userInfo.displayName,
                uid: data.userInfo.uid,
            }));
        }
        if(user) {
            getCurrentUser();
        }
    },[user,uid]);
    return (
        <>
            <main className='bg-black min-h-screen'>
                <Topbar />
                {user && currentAdmin.uid === uid &&
                    <div>
                        <h1 className='font-mono text-transparent bg-gradient-to-b from-cyan-200 to-indigo-800 bg-clip-text text-2xl font-extrabold 
				    flex justify-center uppercase mt-10 mb-5'>{currentAdmin.displayName} Pending Problems</h1>
                        <div className='relative overflow-x-auto mx-auto px-6 pb-10'>
                            {loadingProblems && (
                                <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse">
                                    {[...Array(10)].map((_, idx) => (
                                        <LoadingSkeleton key={idx} />
                                    ))}
                                </div>
                            )}
                            <table className='text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
                                {!loadingProblems && (
                                    <thead className='text-xs font-bold text-white uppercase border-b'>
                                        <tr>
                                            <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                                #
                                            </th>
                                            <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                                Title
                                            </th>
                                            <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                                Category
                                            </th>
                                            <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                                Solution
                                            </th>
                                            <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                                Verdict
                                            </th>
                                            <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                                something
                                            </th>
                                        </tr>
                                    </thead>
                                )}
                                <AdminPendingTable onSetLoadingProblems={setLoadingProblems} uid={currentAdmin.uid} />
                            </table>
                        </div>
                    </div>

                }


            </main>

        </>
    )
}
export default AdminPendingPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const uid = params?.uid as string || '';
    return {
        props: {
            uid,
        },
    };
};
const LoadingSkeleton = () => {
    return (
        <div className='flex items-center space-x-12 mt-4 px-6'>
            {/* <div className='w-6 h-6 shrink-0 rounded-full bg-dark-layer-1'></div> */}
            <div className='h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1'></div>
            <div className='h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1'></div>
            <div className='h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1'></div>
            <div className='h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1'></div>
            <span className='sr-only'>Loading...</span>
        </div>
    );
};