import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import Playground from './Playground/Playground';
import { ProblemDesc } from "@/utils/types/problem";
import Confetti from 'react-confetti';
import useWindowSize from '@/hooks/useWindowSize';
type SolvingSpaceProps = {
    pid: string;
};

const SolvingSpace: React.FC<SolvingSpaceProps> = ({ pid }) => {
    const [problem, setProblem] = useState<ProblemDesc>({
        id: ``,
        title: ``,
        problemStatement: '',
        samples: [],
        constraints: '',
        order: 0,
        boilerplateCode: '',
        onlineJudge: '',
        starterFunctionName: '',
        difficulty: '',
    });
    const { width, height } = useWindowSize();
    const [success, setSuccess] = useState(false);
    const [solved, setSolved] = useState(false);
    useEffect(() => {
        const get = async () => {
            const tmp = await getProblemData(pid);
            // console.log("problem:", tmp);
            setProblem(tmp);
        }
        get();
    }, [])


    return (
        <Split className='split' minSize={0}>
            <ProblemDescription id={problem.id}
             problem={problem} _solved={solved} />
            <div>
                <Playground problem={problem} onSuccess={setSuccess} setSolved={setSolved} />
                {success && <Confetti gravity={0.3} tweenDuration={4000} width={width - 1} height={height} />}
            </div>
        </Split>
    )
}
export default SolvingSpace;

async function getProblemData(problemId:string) {
    // console.log("solvingspace getproblemdata entry")
    const response = await fetch('/api/getproblem/getproblemdesc', {
        method: 'POST',
        body: JSON.stringify({
            id: problemId,
        })
    })
    const data = await response.json();
    // console.log("data.problem: ", data.problem);
    return data.problem;
}