import React, { useState } from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import Playground from './Playground/Playground';
import { ProblemDesc } from "@/utils/types/problem";
import Confetti from 'react-confetti';
import useWindowSize from '@/hooks/useWindowSize';
type SolvingSpaceProps = {
    problem: ProblemDesc;
};

const SolvingSpace: React.FC<SolvingSpaceProps> = ({ problem }) => {
    const {width, height} = useWindowSize();
    const [ success, setSuccess ] = useState(false);
    const [ solved, setSolved ] = useState(false);
    return (
        <Split className='split' minSize={0}>
            <ProblemDescription problem={problem} _solved={solved}/>
            <div>
            <Playground problem={problem} onSuccess={setSuccess} setSolved={setSolved}/>
            {success && <Confetti gravity={0.3} tweenDuration={4000} width={width-1} height={height}/>}
            </div>
        </Split>
    )
}
export default SolvingSpace;