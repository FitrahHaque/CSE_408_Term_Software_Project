import Topbar from '@/components/Topbar/Topbar';
import UserSubmissionTable from '@/components/UserSubmissionTable/UserSubmissionTable';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';

type SubmissionProps = {
    uid: string;
};

const SubmissionPage:React.FC<SubmissionProps> = ({ uid }) => {
	const [ loadingProblems, setLoadingProblems ] = useState<boolean>(true);
    return (
        <>
			<Topbar />
            <main className='bg-black min-h-screen'>
                <UserSubmissionTable onSetLoadingProblems={setLoadingProblems} uid={uid}/>
            </main>

        </>
    )
}
export default SubmissionPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const uid = params?.uid as string || '';
    return {
        props: {
            uid,
        },
    };
};