import React, { useEffect, useState } from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { javascript } from '@codemirror/lang-javascript';
import EditorFooter from './EditorFooter/EditorFooter';
import { cpp } from '@codemirror/lang-cpp';
import { ProblemDesc } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/firebase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Sample } from '@/utils/types/sample';
import { AiOutlineDelete } from 'react-icons/ai';
import { Submission } from '@/utils/types/submission';

type PlaygroundProps = {
    problem: ProblemDesc;
    onSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};
export interface ISettings {
    fontSize: string;
    settingsModalIsOpen: boolean;
    dropdownIsOpen: boolean;
}
const Playground: React.FC<PlaygroundProps> = ({ problem, onSuccess, setSolved }) => {
    const [currentTestCaseId, setCurrentTestCaseId] = useState<number>(0);
    const [testCases, setTestCases] = useState<Sample[]>([]);
    useEffect(() => {
        if (problem.samples.length > 0) {
            setTestCases(problem.samples);
        }
    }, [problem.samples.length]);
    const router = useRouter();
    let [userCode, setUserCode] = useState<string>(problem.boilerplateCode);
    const [user] = useAuthState(auth);
    const [fontSize, setFontSize] = useLocalStorage("codellite-fontSize", "16px");
    const [settings, setSettings] = useState<ISettings>({
        fontSize: fontSize,
        settingsModalIsOpen: false,
        dropdownIsOpen: false,
    })
    const handleTestCaseChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedTestCases = [...testCases];
        updatedTestCases[currentTestCaseId] = {
            ...updatedTestCases[currentTestCaseId],
            [e.target.name]: e.target.value,
        };
        setTestCases(updatedTestCases);
    }

    const handleAddSample = async () => {
        if (testCases.length === 7) {
            toast.error("You have exceeded Sample Case limit", { position: "top-center", autoClose: 1000, theme: "dark" })
            return;
        }
        const index = testCases.length;
        const tmpSample: Sample = {
            inputText: '',
            outputText: '',
            id: index + 1,
        }
        const updatedTestCases: Sample[] = [...testCases, tmpSample as Sample]
        setTestCases(updatedTestCases);
        setCurrentTestCaseId(index);
    }

    const handleDeleteSample = async () => {
        const index = currentTestCaseId;
        const updatedTestCases: Sample[] = [...testCases];
        updatedTestCases.splice(index, 1);
        setTestCases(updatedTestCases);
        if (index > 0) {
            setCurrentTestCaseId(index - 1);
        }
    }

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please Log in to submit your code", { position: "top-center", autoClose: 2000, theme: "dark" });
            return;
        }
        try {
            let sid;
            // console.log("crossed try");
            while (true) {
                const tmp = generateUniqueId();
                const response = await fetch('/api/sid/readsid', {
                    method: 'POST',
                    body: JSON.stringify({
                        number: tmp,
                    })
                })
                const data = await response.json();
                if (!data.exists) {
                    sid = tmp;
                    break;
                }
            }
            // console.log("sid:", sid);
            await fetch('api/sid/writesid', {
                method: 'POST',
                body: JSON.stringify({
                    number: sid,
                })
            })
            // console.log("wrote to sid");
            await fetch('/api/pending/addpending', {
                method: 'POST',
                body: JSON.stringify({
                    uid: user.uid,
                    pid: problem.id,
                    sid: sid,
                })
            })
            // console.log("works till here");
            // console.log(user.uid,problem.id, sid, "pending", '')
            const submission: Submission = {
                uid: '',
                pid: '',
                id: sid.toString(),
                status: 'pending',
                checkedBy: '',
                marks: -200,
                code: userCode,
                createdAt: {
                    year: 0,
                    month: 0,
                    hours: 0,
                    minute: 0,
                    second: 0,
                }
            }
            await fetch('/api/submissions/updatesubmission', {
                method: 'POST',
                body: JSON.stringify({
                    submission: submission,
                })
            })
            // console.log("stored to updatesubmission");
            toast.success("Submitted", { position: "top-center", autoClose: 3000, theme: "dark" });
            router.push(`/submission/${user.uid}`);
        }
        catch (error: any) {
            toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" })
        }
    }

    const handleRun = async () => {
        if (!user) {
            toast.error("Please Log in to submit your code", { position: "top-center", autoClose: 2000, theme: "dark" });
            return;
        }
        try {
            const response = await fetch('/api/runcode/runcode', {
                method: 'POST',
                body: JSON.stringify({
                    uid: user.uid,
                    pid: problem.id,
                    testcases: testCases,
                    code: userCode,
                }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Congrats! All tests passed", { position: "top-center", autoClose: 3000, theme: "dark" });
                onSuccess(true);
                setTimeout(() => {
                    onSuccess(false);
                }, 4000);
                // await fetch('/api/updateuser/updatesolvedproblems', {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         pid: problem.id,
                //         uid: user!.uid,
                //     })
                // });
                // setSolved(true); //this should not be here
            }
            else {
                const message = `Failed at case ${data.failedTestCaseIndex}!` + data.message;
                toast.error(message, { position: "top-center", autoClose: 4000, theme: "dark" })
            }
        } catch (error: any) {
            console.log(error);
            if (error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")) {
                toast.error("Oops! One or more test cases failed!", { position: "top-center", autoClose: 3000, theme: "dark" })
            }
            else {
                toast.error(error.message, { position: "top-center", autoClose: 4000, theme: "dark" })
            }
        }

        // try {
        //     userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
        //     const cb = new Function(`return ${userCode}`)();
        //     const handler = problem.onlineJudge;
        //     if (typeof handler === "function") {
        //         const success = handler(cb);
        //         if (success) {
        //             toast.success("Congrats! All tests passed", { position: "top-center", autoClose: 3000, theme: "dark" })
        //             onSuccess(true);
        //             setTimeout(() => {
        //                 onSuccess(false);
        //             }, 4000);

        //             await fetch('/api/updateuser/updatesolvedproblems', {
        //                 method: 'POST',
        //                 body: JSON.stringify({
        //                     pid: problem.id,
        //                     uid: user!.uid,
        //                 })
        //             });
        //             setSolved(true);
        //         }
        //     }

        // }

    }
    useEffect(() => {
        if (user) {
            const code = localStorage.getItem(`code-${problem.id}-${user.uid}`);
            setUserCode(code ? JSON.parse(code) : problem.boilerplateCode);
        } else {
            setUserCode(problem.boilerplateCode);
        }
    }, [problem.id, user, problem.boilerplateCode]);
    const onChange = (value: string) => {
        setUserCode(value);
        if (user) {
            localStorage.setItem(`code-${problem.id}-${user.uid}`, JSON.stringify(value));
        }
    }
    return (
        <div className='flex flex-col bg-zinc-900 relative overflow-x-hidden'>
            <PreferenceNav settings={settings} onSetSettings={setSettings} />
            <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
                {/* Code editor */}
                <div className='w-full overflow-auto'>
                    <CodeMirror
                        value={userCode}
                        theme={tokyoNight}
                        onChange={onChange}
                        extensions={[cpp()]}
                        style={{ fontSize: settings.fontSize }}
                    />
                </div>

                <div className='w-full px-5 overflow-auto'>
                    {/* TestCase Heading */}
                    <div className='flex h-10 items-center space-x-6'>
                        <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                            <div className='text-sm font-medium leading-5 text-white'>Testcase</div>
                            <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
                        </div>
                    </div>

                    {/* Testcases */}
                    <div className='flex'>
                        {testCases.map((sample, index) => (
                            <div
                                key={index}
                                className='mr-2 items-start mt-2 text-white'
                                onClick={() => setCurrentTestCaseId(index)}
                            >
                                <div className='flex flex-wrap items-center gap-y-4'>
                                    <div className={`text-sm items-center transition-all focus:outline-none inline-flex 
		bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${currentTestCaseId === index ? "text-white" : "text-gray-500"}`}>
                                        Case {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div
                            id="add"
                            className='mr-2 items-start mt-2 text-white'
                            onClick={handleAddSample}
                        >
                            <div className='flex flex-wrap items-center gap-y-4'>
                                <div className={`text-sm items-center transition-all focus:outline-none inline-flex 
		bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap text-gray-500`}>
                                    +
                                </div>
                            </div>

                        </div>
                    </div>
                    <div
                        className='flex justify-end'
                    >
                        <div
                            id="delete"
                            className='mr-2 items-start mt-2 text-white'
                            onClick={handleDeleteSample}
                        >
                            <div className='flex flex-wrap items-center gap-y-4'>
                                <div className={`text-medium items-center transition-all focus:outline-none inline-flex 
		bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap text-gray-500`}>
                                    <AiOutlineDelete />
                                </div>
                            </div>

                        </div>
                    </div>


                    {testCases.length > currentTestCaseId
                        && <div className='font-light mb-[80px] overflow-auto'>
                            <p className='text-sm font-medium mt-4 text-gray-400'>
                                Input:
                            </p>
                            <textarea
                                id='inputText'
                                name='inputText'
                                onChange={(e) => handleTestCaseChange(e)}
                                style={{ height: 'auto', minHeight: '4em' }}
                                value={testCases[currentTestCaseId].inputText}
                                className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 
                            border-transparent text-slate-50 mt-2 resize-none'>

                            </textarea>
                            <p className='text-sm font-medium mt-4 text-gray-400'>
                                Output:
                            </p>
                            <textarea
                                id='outputText'
                                name='outputText'
                                onChange={(e) => handleTestCaseChange(e)}
                                style={{ height: 'auto', minHeight: '4em' }}
                                value={testCases[currentTestCaseId].outputText}
                                className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 
                            border-transparent text-white mt-2 resize-none'>
                            </textarea>
                        </div>}

                </div>
            </Split>
            <EditorFooter onHandleRun={handleRun} onHandleSubmit={handleSubmit} />
        </div>
    )
}
export default Playground;

function generateUniqueId(): number {
    // Generate a timestamp as part of the ID
    const timestamp = Date.now();

    // Generate a random number (between 0 and 99999999)
    const random = Math.floor(Math.random() * 100000000);

    // Combine the timestamp and random number to create a unique ID
    const uniqueId = timestamp * 100000000 + random;

    return uniqueId;
}

