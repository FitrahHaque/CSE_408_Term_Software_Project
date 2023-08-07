import React, { useState } from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { javascript } from '@codemirror/lang-javascript';
import EditorFooter from './EditorFooter/EditorFooter';
import { cpp } from '@codemirror/lang-cpp';
import { Problem } from '@/utils/types/problem';

type PlaygroundProps = {
    problem: Problem;
};

const Playground: React.FC<PlaygroundProps> = ({ problem }) => {
    const [currentTestCaseId, setCurrentTestCaseId] = useState<number> (0);
    return (
        <div className='flex flex-col bg-zinc-900 relative overflow-x-hidden'>
            <PreferenceNav />
            <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
                {/* Code editor */}
                <div className='w-full overflow-auto'>
                    <CodeMirror
                        value={problem.boilerplateCode}
                        theme={tokyoNight}
                        extensions={[javascript(),cpp()]}
                        style={{ fontSize: 16 }}
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
                        {problem.samples.map((sample,index) => (
                            <div 
                            className='mr-2 items-start mt-2 text-white'
                            onClick={() => setCurrentTestCaseId(index)}
                            >
                            <div className='flex flex-wrap items-center gap-y-4'>
                                <div className={`text-sm items-center transition-all focus:outline-none inline-flex 
		bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${currentTestCaseId === index ? "text-white" :"text-gray-500"}`}>
                                    Case {index+1}
                                </div>
                            </div>
                        </div>
                        ))}
                        

                        
                    </div>

                    <div className='font-light mb-[80px] overflow-auto'>
                        <p className='text-sm font-medium mt-4 text-gray-400'>
                            Input:
                        </p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-slate-50 mt-2'>
                            {problem.samples[currentTestCaseId].inputText}
                        </div>
                        <p className='text-sm font-medium mt-4 text-gray-400'>
                            Output:
                        </p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                            {problem.samples[currentTestCaseId].outputText}
                        </div>
                    </div>
                </div>
            </Split>
            <EditorFooter />
        </div>
    )
}
export default Playground;