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
import { problems } from '@/utils/problems';
import { useRouter } from 'next/router';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import useLocalStorage from '@/hooks/useLocalStorage';

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
    console.log("playground", problem.samples.length)
    const [currentTestCaseId, setCurrentTestCaseId] = useState<number>(0);
    let [userCode, setUserCode] = useState<string>(problem.boilerplateCode);
    const [user] = useAuthState(auth);
    const { query: { pid } } = useRouter();
    const [fontSize, setFontSize] = useLocalStorage("codellite-fontSize", "16px");
    const [settings, setSettings] = useState<ISettings>({
        fontSize: fontSize,
        settingsModalIsOpen: false,
        dropdownIsOpen: false,
    })
    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please Log in to submit your code", { position: "top-center", autoClose: 3000, theme: "dark" });
            return;
        }
        try {
            userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
            const cb = new Function(`return ${userCode}`)();
            const handler = problems[pid as string].onlineJudge;
            if (typeof handler === "function") {
                const success = handler(cb);
                if (success) {
                    toast.success("Congrats! All tests passed", { position: "top-center", autoClose: 3000, theme: "dark" })
                    onSuccess(true);
                    setTimeout(() => {
                        onSuccess(false);
                    }, 4000);
                    const userRef = doc(firestore, "users", user.uid);
                    await updateDoc(userRef, {
                        solvedProblems: arrayUnion(pid),
                    })
                    setSolved(true);
                }
            }

        } catch (error: any) {
            console.log(error);
            if (error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")) {
                toast.error("Oops! One or more test cases failed!", { position: "top-center", autoClose: 3000, theme: "dark" })
            }
            else {
                toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" })
            }
        }
    }
    useEffect(() => {
        if (user) {
            const code = localStorage.getItem(`code-${pid}-${user.uid}`);
            setUserCode(code ? JSON.parse(code) : problem.boilerplateCode);
        } else {
            setUserCode(problem.boilerplateCode);
        }
    }, [pid, user, problem.boilerplateCode]);
    const onChange = (value: string) => {
        setUserCode(value);
        if (user) {
            localStorage.setItem(`code-${pid}-${user.uid}`, JSON.stringify(value));
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
                        extensions={[javascript(), cpp()]}
                        style={{ fontSize: settings.fontSize }}
                    />
                </div>

                <div className='w-full px-5 overflow-auto'>
                    {/* TestCase heading */}
                    <div className='flex h-10 items-center space-x-6'>
                        <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                            <div className='text-sm font-medium leading-5 text-white'>Testcase</div>
                            <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
                        </div>
                    </div>

                    {/* Testcases */}
                    <div className='flex'>
                        {problem.samples.map((sample, index) => (
                            <div
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



                    </div>

                    {problem.samples.length > 0
                        && <div className='font-light mb-[80px] overflow-auto'>
                            <p className='text-sm font-medium mt-4 text-gray-400'>
                                Input:
                            </p>
                            <textarea
                            style={{ height: 'auto', minHeight: '4em' }} 
                            className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 
                            border-transparent text-slate-50 mt-2 resize-none'>
                                {problem.samples[currentTestCaseId].inputText}
                            </textarea>
                            <p className='text-sm font-medium mt-4 text-gray-400'>
                                Output:
                            </p>
                            <textarea 
                            style={{ height: 'auto', minHeight: '4em' }} 
                            className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 
                            border-transparent text-white mt-2 resize-none'>
                                {problem.samples[currentTestCaseId].outputText}
                            </textarea>
                        </div>}
                </div>
            </Split>
            <EditorFooter onHandleSubmit={handleSubmit} />
        </div>
    )
}
export default Playground;