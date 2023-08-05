import React from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import EditorFooter from './EditorFooter/EditorFooter';
import { cpp } from '@codemirror/lang-cpp';

type PlaygroundProps = {

};

const Playground: React.FC<PlaygroundProps> = () => {
    const boilerplateCode = `vector<int> twoSum(vector<int>& nums, int target) {
  //Write your code here
}`
    return (
        <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
            <PreferenceNav />
            <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
                {/* Code editor */}
                <div className='w-full overflow-auto'>
                    <CodeMirror
                        value={boilerplateCode}
                        theme={vscodeDark}
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
                        {/* Case 1 */}
                        <div className='mr-2 items-start mt-2 text-white'>
                            <div className='flex flex-wrap items-center gap-y-4'>
                                <div className={`TestCaseSelection`}>
                                    Case 1
                                </div>
                            </div>
                        </div>

                        {/* Case 2 */}
                        <div className='mr-2 items-start mt-2 text-white'>
                            <div className='flex flex-wrap items-center gap-y-4'>
                                <div className={`TestCaseSelection`}>
                                    Case 2
                                </div>
                            </div>
                        </div>

                        {/* Case 3 */}
                        <div className='mr-2 items-start mt-2 text-white'>
                            <div className='flex flex-wrap items-center gap-y-4'>
                                <div className={`TestCaseSelection`}>
                                    Case 3
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='font-light mb-[80px] overflow-auto'>
                        <p className='text-sm font-medium mt-4 text-gray-400'>
                            Input:
                        </p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-slate-50 mt-2'>
                            nums = [2,7,11,15], target = 9
                        </div>
                        <p className='text-sm font-medium mt-4 text-gray-400'>
                            Output:
                        </p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                            [0,1]
                        </div>
                    </div>
                </div>
            </Split>
            <EditorFooter />
        </div>
    )
}
export default Playground;