import EditProblem from '@/components/EditProblem/EditProblem';
import { GetServerSideProps } from 'next';
import React from 'react';

type EditProblemProps = {
    pid:string;
};

const EditProblemPage:React.FC<EditProblemProps> = ({ pid }) => {
    
    return (
        <>
            <main className='bg-black min-h-screen'>
                <EditProblem pid={pid}/>
            </main>

        </>
    )
}
export default EditProblemPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const pid = params?.pid as string || '';
    return {
        props: {
            pid,
        },
    };
};