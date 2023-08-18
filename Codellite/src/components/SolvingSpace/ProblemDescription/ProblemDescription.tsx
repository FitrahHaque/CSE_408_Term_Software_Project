import { DBProblem, Problem } from '@/utils/types/problem';
import React, { useEffect, useState } from 'react';
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from '@/firebase/firebase';
import RectangleSkeleton from '@/components/skeletons/RectangleSkeleton';
import CircleSkeleton from '@/components/skeletons/CircleSkeleton';

type ProblemDescriptionProps = {
    problem: Problem;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
    const { currentProblem, loading, problemDifficultyClass } = useGetCurrentProblem(problem.id);
    return (
        <div className='bg-dark-layer-1'>
            {/* TAB */}
            <div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
                <div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
                    Description
                </div>
            </div>

            <div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto bg-zinc-900'>
                <div className='px-5'>
                    {/* Problem heading */}
                    <div className='w-full'>
                        <div className='flex space-x-4'>
                            <div className='flex-1 mr-2 text-lg text-white font-medium'>{problem.title}</div>
                        </div>

                        {!loading && currentProblem && (
                            <div className='flex items-center mt-3'>
                            <div
                                className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                            >
                                {currentProblem.difficulty}
                            </div>
                            <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
                                <BsCheck2Circle />
                            </div>
                            <div
                                className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                            >
                                <AiFillLike />
                                <span className='text-xs'>{currentProblem.likes}</span>
                            </div>
                            <div
                                className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
                            >
                                <AiFillDislike />
                                <span className='text-xs'>{currentProblem.dislikes}</span>
                            </div>
                            <div
                                className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
                            >
                                <TiStarOutline />
                            </div>
                        </div>
                        )}
                        {loading && (
                            <div className='mt-3 flex space-x-2'>
                                <RectangleSkeleton/>
                                <CircleSkeleton/>
                                <RectangleSkeleton/>
                                <RectangleSkeleton/>
                                <CircleSkeleton/>
                            </div>
                        )}
                        
                        {/* Problem Statement(paragraphs) */}
                        <div className='text-white text-sm'>
                            <div 
                                dangerouslySetInnerHTML={{ __html: problem.problemStatement }}/>
                        </div>

                        {/* samples */}
                        <div className='mt-4'>
                            {/* sample 1 */}
                            {problem.samples.map((sample, index) => (
                                <div key={sample.id}>
                                <p className='font-medium text-white'> Sample {index+1}: </p>
                                {sample.img && (
                                    <img src={sample.img} alt="" className='mt-3'/>
                                )}
                                <div className='example-card'>
                                    <pre>
                                        <strong>Input:</strong><span className='text-white'> {sample.inputText}</span><br />
                                        <strong>Output:</strong><span className='text-white'>  {sample.outputText}</span><br />
                                        {
                                            sample.explanation && (
                                                <>
                                                    <strong>Explanation:</strong><span className='text-white'> {sample.explanation}</span>
                                                </>
                                            )
                                        }
                                    </pre>
                                </div>
                            </div>
                            ))}
                            

                        </div>

                        {/* Constraints */}
                        <div className='mt-8 pb-4'>
                            <p className='text-white font-medium'>Constraints:</p>
                            <ul className='text-white ml-5 list-disc '>
                                <div dangerouslySetInnerHTML={{__html:problem.constraints}} />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProblemDescription;


function useGetCurrentProblem(problemId: string) {
    const [ currentProblem, setCurrentProblem ] = useState<DBProblem|null>(null);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ problemDifficultyClass, setProblemDifficultyClass ] = useState<string>("");
    useEffect(()=> {
        //Get problem from DB
        const getProblem = async () => {
			//fetching data logic from database
			setLoading(true); 
            const docRef = doc(firestore, "problems", problemId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const problem = docSnap.data();
                setCurrentProblem({id:docSnap.id, ...problem} as DBProblem);
                setProblemDifficultyClass(problem.difficulty == "Easy" ? "bg-olive text-olive" : 
                problem.difficulty == "Medium" ? "bg-yellow text-dark-yellow" : "bg-dark-pink text-dark-pink");
            } else {
              // docSnap.data() will be undefined in this case
              console.log("No such document!");
            }
            setLoading(false);
		}
		getProblem();
    },[problemId]);
    return { currentProblem, loading, problemDifficultyClass};
}