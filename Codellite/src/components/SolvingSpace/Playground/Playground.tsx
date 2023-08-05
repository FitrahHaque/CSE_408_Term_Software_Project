import React from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';

type PlaygroundProps = {
    
};

const Playground:React.FC<PlaygroundProps> = () => {
    
    return (
        <div className='flex flex-col bg-dark-layer-1 relative'>
        <PreferenceNav />
        <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60,40]} minSize={60}>
            {/* Code editor */}
            <div className='w-full overflow-auto'>
                <CodeMirror 
                    value="class Solution { &nbsp; public:
                            vector<int> twoSum(vector<int>& nums, int target) {
                                
                            }
                        };"
                    theme={vscodeDark}
                    extensions={[javascript()]}
                    style={{fontSize:16}}
                />
            </div>
            {/* TestCases */}
            <div className='w-full'>
                <div>

                </div>
            </div>
        </Split>
        </div>
    )
}
export default Playground;