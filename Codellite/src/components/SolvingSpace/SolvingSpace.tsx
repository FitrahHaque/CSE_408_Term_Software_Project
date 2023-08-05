import React from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';

type SolvingSpaceProps = {
    
};

const SolvingSpace:React.FC<SolvingSpaceProps> = () => {
    
    return (
        <Split className='split'>
        <ProblemDescription/>
        <div>Code Editor</div>
        </Split>
    )
}
export default SolvingSpace;