import Topbar from '@/components/Topbar/Topbar';
import UserSubmissionTable from '@/components/UserSubmissionTable/UserSubmissionTable';
import { auth } from '@/firebase/firebase';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import CodeMirror from '@uiw/react-codemirror';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { cpp } from '@codemirror/lang-cpp';
import { ISettings } from '@/components/SolvingSpace/Playground/Playground';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Submission } from '@/utils/types/submission';
import { DBProblem } from '@/utils/types/problem';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

type UserSubmissionProps = {
    sid: string;
};

const UserSubmissionPage: React.FC<UserSubmissionProps> = ({ sid }) => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [author, setAuthor] = useState({
        displayName: '',
        uid: '',
    })
    const [role, setRole] = useState<string>('');
    const [prof, setProf] = useState<string> ('');
    const [fontSize, setFontSize] = useLocalStorage("codellite-fontSize", "16px");
    const [settings, setSettings] = useState<ISettings>({
        fontSize: fontSize,
        settingsModalIsOpen: false,
        dropdownIsOpen: false,
    })
    const [marks, setMarks] = useState('');
    const [submittedProblem, setSubmittedProblem] = useState<Submission>({
        id: '',
        pid: '',
        uid: '',
        status: '',
        createdAt: {
            year: 0,
            month: 0,
            hours: 0,
            minute: 0,
            second: 0,
        },
        checkedBy: '',
        marks: -200,
        code: '',
    })
    const [dbProblem, setDbProblem] = useState<DBProblem>({
        id: '',
        title: '',
        category: '',
        difficulty: '',
        order: 0,
        likes: 0,
        dislikes: 0,
        videoId: '',
        link: '',
        deadline: '',
        admin: '',
    });
    useEffect(() => {
        const getProblem = async () => {
            const res1 = await fetch('/api/submissions/getsubmission', {
                method: 'POST',
                body: JSON.stringify({
                    id: sid,
                })
            })
            const data1 = await res1.json();
            setSubmittedProblem({ ...data1.problem });

            const res2 = await fetch('/api/getproblem/getdbproblem', {
                method: 'POST',
                body: JSON.stringify({
                    id: data1.problem.pid,
                })
            })
            const data2 = await res2.json();
            setDbProblem({ ...data2.problem });
        }

        getProblem();
    }, []);
    useEffect(() => {
        const getCurrentUser = async () => {
            const res = await fetch('/api/auth/getcurrentuser', {
                method: 'POST',
                body: JSON.stringify({
                    uid: submittedProblem.uid,
                })
            })
            const data = await res.json();
            setAuthor((prev) => ({
                ...prev,
                displayName: data.userInfo.displayName,
                uid: data.userInfo.uid,
            }));
        }
        if (submittedProblem.uid) {
            getCurrentUser();
        }
    }, [submittedProblem]);

    useEffect(() => {
        const getRole = async () => {
            const res = await fetch('/api/auth/getcurrentuser', {
                method: 'POST',
                body: JSON.stringify({
                    uid: user!.uid,
                })
            })
            const data = await res.json();
            setRole(data.userInfo.role);
            setProf(data.userInfo.displayName);
        }
        if (user) {
            getRole();
        }
    }, [user])

    const handleTest = () => {
        if (!user) {
            toast.error("Please Log in to run the code", { position: "top-center", autoClose: 2000, theme: "dark" });
            return;
        }
        localStorage.setItem(`code-${dbProblem.id}-${user.uid}`, JSON.stringify(submittedProblem.code));
        router.push(`/problems/${dbProblem.id}`);
    }
    const handleEvaluate = async () => {
        if (!marks) {
            toast.error("Please provide marks", { position: "top-center", autoClose: 2000, theme: "dark" });
            return;
        }
        const submission: Submission = {
            ...submittedProblem,
            marks: parseInt(marks),
            checkedBy: prof,
            status: 'solved',
        }
        await fetch('/api/submissions/updatesubmission', {
            method: 'POST',
            body: JSON.stringify({
                submission: submission,
            })
        })
        await fetch('/api/updateuser/updatesolvedproblems', {
            method: 'POST',
            body: JSON.stringify({
                pid: dbProblem.id,
                uid: author.uid,
                sid: submittedProblem.id,
            })
        })
        toast.success("Evaluated", { position: "top-center", autoClose: 1200, theme: "dark" });
        setTimeout(function() {
            // This code will run after 1 second
            router.push(`/adminpending/${user!.uid}`);
        }, 1200);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMarks(e.target.value);
    }
    return (
        <>
            <main
                className='bg-black min-h-screen'>
                <Topbar />
                <h1 className='font-mono text-transparent bg-gradient-to-b from-cyan-200 to-indigo-800 bg-clip-text text-2xl font-extrabold 
				flex justify-center uppercase mt-10 mb-5'>Submission</h1>
                <div className='flex justify-center space-x-10 items-center'>
                    <div className='text-base font-mono'>
                        <p className='text-neutral-500 text-base font-mono'>Problem </p>
                        <Link
                            className='text-emerald-500 '
                            href={`/problems/${dbProblem.id}`}>
                            {dbProblem.title}
                        </Link>
                    </div>

                    <div className='text-base font-mono'>
                        <p className='text-neutral-500'>Author</p>
                        <span className='text-cyan-400'>{author.displayName}</span>
                    </div>
                    <div className='text-base font-mono'>
                        <p className='text-neutral-500'>Language</p>
                        <span className='text-white'>C++</span>
                    </div>
                    <div className='text-base font-mono'>
                        <p className='text-neutral-500'>Verdict</p>
                        {submittedProblem.status === 'solved' &&
                            <span className='text-emerald-300'>{submittedProblem.marks}</span>}
                        {submittedProblem.status === 'pending' &&
                            <span className='font-medium text-neutral-500'>Pending</span>}
                    </div>
                    {submittedProblem.status === 'solved' &&
                        <div className='text-base font-mono'>
                            <p className='text-neutral-500'>Evaluator</p>
                            <span className='text-blue-400'>{submittedProblem.checkedBy}</span>
                        </div>
                    }
                    <div className="flex my-5 justify-end space-x-10 py-10">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleTest}
                            className="font-mono text-white bg-transparent hover:bg-gradient-to-r hover:from-cyan-300 hover:to-indigo-900 hover:text-black transition duration-200 ease-in-out"
                        >
                            Run
                        </Button>
                        {user && role === 'admin' &&
                            <Button
                                variant="outline"
                                onClick={handleEvaluate}
                                type="button"
                                className="font-mono text-white bg-transparent hover:bg-gradient-to-r hover:from-cyan-300 hover:to-indigo-900 hover:text-black transition duration-200 ease-in-out"
                            >
                                Evaluate
                            </Button>}
                    </div>
                    {role === 'admin' &&
                        <input
                            onChange={handleInputChange}
                            type='link'
                            name='link'
                            id='link'
                            className='w-24
border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block p-2.5
bg-gray-800 border-gray-500 placeholder-gray-400 text-white
'
                            placeholder='marks'
                        />}
                </div>

                <div className='flex flex-col relative overflow-x-hidden h-[calc(100vh-94px)]'>
                    <div className='w-7/12 mx-auto overflow-auto '
                        style={{ height: '200px' }}>
                        <CodeMirror
                            value={submittedProblem.code}
                            theme={tokyoNight}
                            readOnly={true}
                            extensions={[cpp()]}
                            style={{ fontSize: settings.fontSize, height: '100%' }}
                        />
                    </div>
                </div>

            </main>

        </>
    )
}

export default UserSubmissionPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const sid = params?.sid as string || '';
    return {
        props: {
            sid,
        },
    };
};
