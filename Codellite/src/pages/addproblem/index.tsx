import { allProblemsCountState } from '@/atoms/allProblemCount';
import { Problem } from '@/components/MockProblems/problems';
import { DBProblem, ProblemDesc } from '@/utils/types/problem';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

type AddProblemPageProps = {
    problemCount: number,
};

const AddProblemPage: React.FC<AddProblemPageProps> = ({ problemCount }) => {

    const setAllProblemsCount = useSetRecoilState(allProblemsCountState);
    const allProblemsCount = useRecoilValue(allProblemsCountState);
    const [inputs, setInputs] = useState<ProblemDesc>({
        id: '',
        title: '',
        problemStatement: '',
        samples: [],
        constraints: '',
        order: 0,
        boilerplateCode: '',
        onlineJudge: '',
        starterFunctionName: '',
        difficulty: '',
    })
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.name === 'id') {
            const s = e.target.value.replace(/\s/g, '');
            setInputs({
                ...inputs,
                [e.target.name]: s,
            })
        }
        else {
            setInputs({
                ...inputs,
                [e.target.name]: e.target.value,
            })
        }
        console.log(inputs);
    };
    
    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 	e.preventDefault(); //prevent page refresh
    // 	//convert inputs.order to integer
    // 	const newProblem = {
    // 		...inputs,
    // 		order: Number(inputs.order),
    // 	}
    // 	await setDoc(doc(firestore, "problems", inputs.id), newProblem);
    // 	alert("saved to db");
    // };	
    // console.log(inputs);

    const handleSubmit = () => {

    }
    return (
        <>
            <main className='bg-black min-h-screen'>
                <form className='space-y-6 px-6 pb-4' onSubmit={handleSubmit}>
                    <h3 className='font-mono text-transparent bg-gradient-to-r from-cyan-200 to-indigo-800 bg-clip-text text-2xl 
				font-extrabold flex justify-center'>Add a Problem</h3>
                    <div>
                        <label htmlFor='id' className='text-sm font-medium block mb-2 text-slate-400'>
                            Id
                        </label>
                        <input
                            onChange={handleInputChange}
                            type='id'
                            name='id'
                            id='id'
                            className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                            placeholder='two-sum'
                        />
                    </div>

                    <div>
                        <label htmlFor='title' className='text-sm font-medium block mb-2 text-slate-400'>
                            Title
                        </label>
                        <input
                            onChange={handleInputChange}
                            type='title'
                            name='title'
                            id='title'
                            className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                            placeholder='Two Sum'
                        />
                    </div>

                    <div>
                        <label htmlFor='problemStatement' className='text-sm font-medium block mb-2 text-slate-400'>
                        Problem Statement
                        </label>
                        <input
                            onChange={handleInputChange}
                            type='problemStatement'
                            name='problemStatement'
                            id='problemStatement'
                            className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                            placeholder=''
                        />
                    </div>

                    <div>
                        <label htmlFor='constraints' className='text-sm font-medium block mb-2 text-slate-400'>
                            Constraints
                        </label>
                        <input
                            onChange={handleInputChange}
                            type='constraints'
                            name='constraints'
                            id='constraints'
                            className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                            placeholder='1 <= x <= n, 1 <= y <= x'
                        />
                    </div>

                    <div>
                        <label htmlFor='boilerplateCode' className='text-sm font-medium block mb-2 text-slate-400'>
                        Boilerplate Code
                        </label>
                        <input
                            onChange={handleInputChange}
                            type='boilerplateCode'
                            name='boilerplateCode'
                            id='boilerplateCode'
                            className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                            placeholder='void func() { 

                            }'
                        />
                    </div>
                        
                    <div>
                        <label htmlFor='onlineJudge' className='text-sm font-medium block mb-2 text-slate-400'>
                        Online Judge
                        </label>
                        <input
                            onChange={handleInputChange}
                            type='onlineJudge'
                            name='onlineJudge'
                            id='onlineJudge'
                            className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                            placeholder='twoSum'
                        />
                    </div>

                    <div>
                        <label htmlFor='starterFunctionName' className='text-sm font-medium block mb-2 text-slate-400'>
                        Starter FunctionName
                        </label>
                        <input
                            onChange={handleInputChange}
                            type='starterFunctionName'
                            name='starterFunctionName'
                            id='starterFunctionName'
                            className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                            placeholder=''
                        />
                    </div>
                    <div>
                        <label htmlFor='difficulty' className='text-sm font-medium block mb-2 text-slate-400'>
                        Difficulty
                        </label>
                        <input
                            onChange={handleInputChange}
                            type='difficulty'
                            name='difficulty'
                            id='difficulty'
                            className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                            placeholder='Easy'
                        />
                    </div>
                </form>
            </main>

        </>
    )
}
export default AddProblemPage;