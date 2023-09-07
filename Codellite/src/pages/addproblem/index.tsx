import { allProblemsCountState } from '@/atoms/allProblemCount';
import { Problem } from '@/components/MockProblems/problems';
import { Button } from '@/components/ui/button';
import { DBProblem, ProblemDesc } from '@/utils/types/problem';
import { MdOutlineDelete, MdDelete } from 'react-icons/md'
import { RiDeleteBack2Fill, RiDeleteBack2Line } from 'react-icons/ri'
import { Sample } from '@/utils/types/sample';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import AddProblem from '@/components/AddProblem/AddProblem';

type AddProblemPageProps = {
    problemCount: number,
};

const AddProblemPage: React.FC<AddProblemPageProps> = ({ problemCount }) => {
    
    
    
    return (
        <>
            <main className='bg-black min-h-screen'>
                <AddProblem problemCount={problemCount}/>
            </main>

        </>
    )
}
export default AddProblemPage;