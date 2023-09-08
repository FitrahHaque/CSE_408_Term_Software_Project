import React from 'react';
import Topbar from '@/components/Topbar/Topbar';
import SolvingSpace from '@/components/SolvingSpace/SolvingSpace';
// import { problems } from '@/utils/problems';
import { ProblemDesc } from '@/utils/types/problem';
import { GetServerSideProps } from 'next';

type ProblemPageProps = {
    pid: string;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ pid }) => {
    console.log("PPpid:", pid);
    return (
        <div>
            <Topbar problemPage={true} pid={pid}/>
            <SolvingSpace pid={pid} />
        </div>
    )
}

export default ProblemPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const pid = params?.pid as string || '';
    return {
        props: {
            pid,
        },
    };
};

// type Data = {
//     problemids: { id: string }[];
// }
// fetch the local data
// SSG
// getStaticPaths -> it creates the dynamic routes
// export async function getStaticPaths() {
//     // const response = await fetch('/api/addproblem/getproblemids');
//     // const data = await response.json();
//     // const res = await import("../api/addproblem/getproblemids");
//     // const paths = data.problemids.map((problem:{id:string}) => ({
//     //     params: { pid : problem.id},
//     // }))
//     const paths = Object.keys(problems).map((key) => ({
//         params: { pid: key }
//     }))
//     // console.log("paths:", data);
//     return {
//         paths,
//         fallback: false
//     }
// }

// // getStaticProps => it fetches the data
// export async function getStaticProps({ params }: { params: { pid: string } }) {
//     const { pid } = params;
//     // const problem = problems[pid];
//     console.log("pid:", pid);
//     if (!pid) {
//         return {
//             notFound: true,
//         }
//     }
//     // problem.onlineJudge = problem.onlineJudge.toString();
//     // console.log(problem)
//     return {
//         props: {
//             pid: pid,
//         }
//     }
// }