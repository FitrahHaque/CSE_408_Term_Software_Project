

import React from 'react';
import Topbar from '@/components/Topbar/Topbar';
import SolvingSpace from '@/components/SolvingSpace/SolvingSpace';
import { problems } from '@/utils/problems';
import { ProblemDesc } from '@/utils/types/problem';

type ProblemPageProps = {
    pid:string;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ pid }) => {
    
    return (
        <div>
            <Topbar problemPage={true} />
            <SolvingSpace pid={pid}/>
        </div>
    )
}
export default ProblemPage;


// fetch the local data
// SSG
// getStaticPaths -> it creates the dynamic routes
export async function getStaticPaths() {
    const paths = Object.keys(problems).map((key) => ({
        params: { pid: key }
    }))
    return {
        paths,
        fallback: false
    }
}

// getStaticProps => it fetches the data
export async function getStaticProps({ params }: { params: { pid: string } }) {
    const { pid } = params;
    // const problem = problems[pid];
    if (!pid) {
        return {
            notFound: true,
        }
    }
    // problem.onlineJudge = problem.onlineJudge.toString();
    // console.log(problem)
    return {
        props: {
            pid: pid,
        }
    }
}