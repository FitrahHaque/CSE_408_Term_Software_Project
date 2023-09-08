import { allProblemsCountState } from '@/atoms/allProblemCount';
import { Button } from '@/components/ui/button';
import { DBProblem, ProblemDesc } from '@/utils/types/problem';
import { MdOutlineDelete, MdDelete } from 'react-icons/md'
import { RiDeleteBack2Fill, RiDeleteBack2Line } from 'react-icons/ri'
import { Sample } from '@/utils/types/sample';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { Link } from 'lucide-react';
type AddProblemProps = {
    problemCount: number;
};

const AddProblem: React.FC<AddProblemProps> = ({ problemCount }) => {
    const [user] = useAuthState(auth);
    const setAllProblemsCount = useSetRecoilState(allProblemsCountState);
    // const [allProblemsCount, setAllProblemsCount ] = useState<number>(0);
    const allProblemsCount = useRecoilValue(allProblemsCountState);
    console.log('allProblemsCount: ', allProblemsCount);
    const router = useRouter();
    const [DBInputs, setDBInputs] = useState<DBProblem>({
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        order: 1,
        category: 'Array',
        likes: 0,
        dislikes: 0,
        videoId: '8-k1C6ehKuw',
        link: '',
        deadline: '12-Aug-2023'
    });
    
    const [inputs, setInputs] = useState<ProblemDesc>({
        id: 'two-sum',
        title: 'Two Sum',
        problemStatement: `<p className='mt-3'>
    Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up</em> to <code>target</code>.
</p>
<p className='mt-3'>
    You may assume that each input would have <b><em>exactly</em> one solution</b>, and you may not use the same element twice.
</p>
<p className='mt-3'>
You can return the answer in any order.
</p>`,
        samples: [],
        constraints: `<li class='mt-2'>
        <code>2 ≤ nums.length ≤ 10</code>
    </li> <li class='mt-2'>
        <code>-10 ≤ nums[i] ≤ 10</code>
    </li> <li class='mt-2'>
        <code>-10 ≤ target ≤ 10</code>
    </li>
    <li class='mt-2 text-sm'>
        <strong>Only one valid answer exists.</strong>
    </li>`,
        order: 1,
        boilerplateCode: `function twoSum(nums, target) {
            //Write your code here
        };`,
        onlineJudge: `twoSumHandler`,
        starterFunctionName: `function twoSum(nums, target)`,
        difficulty: 'Easy',
    });

    // useEffect(()=> {
    //     const response = await fetch('/api/addproblem/')
    // },[])
    const [newSample, setNewSample] = useState<Sample>({
        id: 0,
        inputText: `2,7,11,15\n9`,
        outputText: `0,1`,
        explanation: `Because nums[0] + nums[1] == 9, we return [0,1].`,
        img: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {

        if (e.target.name === 'id') {
            const s = e.target.value.replace(/\s/g, '');
            setInputs({
                ...inputs,
                [e.target.name]: s,
            })
            setDBInputs({
                ...DBInputs,
                [e.target.name]: s,
            })
        }
        else if (e.target.name === 'category' || e.target.name === 'videoId' || e.target.name === 'link' || e.target.name === 'deadline') {
            setDBInputs({
                ...DBInputs,
                [e.target.name]: e.target.value,
            });
        }
        else if (e.target.name === 'difficulty' || e.target.name === 'title') {
            setInputs({
                ...inputs,
                [e.target.name]: e.target.value,
            });
            setDBInputs({
                ...DBInputs,
                [e.target.name]: e.target.value,
            });
        }
        else {
            setInputs({
                ...inputs,
                [e.target.name]: e.target.value,
            })
        }
        // console.log(inputs);
    };


    const handleSampleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | { target: { name: string, value: string } }, index: number) => {
        if (index === -1) {
            setNewSample({
                ...newSample,
                [e.target.name]: e.target.value,
            });
        }
        else {
            const updatedInputs: ProblemDesc = {
                ...inputs,
            };

            if (updatedInputs.samples && index >= 0 && index < updatedInputs.samples.length) {
                const sampleToEdit = { ...updatedInputs.samples[index] };

                const editedSample = {
                    ...sampleToEdit,
                    [e.target.name]: e.target.value,
                }
                updatedInputs.samples[index] = editedSample;
            }
            setInputs(updatedInputs);
        }
    }

    const handleDeleteSample = (index: number) => {
        const updatedInputs: ProblemDesc = {
            ...inputs,
        };
        if (updatedInputs.samples && index >= 0 && index < updatedInputs.samples.length) {
            updatedInputs.samples.splice(index, 1);
        }
        setInputs(updatedInputs);
        toast.success("Deleted a Sample Case", { position: "top-center", autoClose: 1000, theme: "dark" })

    }

    const handleAddSample = async () => {
        if (!newSample.inputText || !newSample.outputText) {
            toast.error("Please Fill Input and Output Text Fields", { position: "top-center", autoClose: 1000, theme: "dark" })
            return;
        }
        if (inputs.samples.length === 6) {
            toast.error("You have exceeded Sample Case limit", { position: "top-center", autoClose: 1000, theme: "dark" })
            return;
        }
        const tmpSample: Sample = {
            ...newSample,
            // inputText: newSample.inputText.replace('/\n/g', '<br>'),
            id: inputs.samples.length + 1,
        }
        console.log(tmpSample.inputText)
        // const value={tmpSample.inputText.replace('/\n/g', '\n')}
        const updatedInputs: ProblemDesc = {
            ...inputs, // Copy the existing properties of 'inputs'
            samples: [...inputs.samples, tmpSample as Sample], // Add the new sample to the 'samples' array
        };
        setInputs(updatedInputs);
        setNewSample({
            ...newSample,
            id: 0,
            inputText: '',
            outputText: '',
            explanation: '',
            img: '',
        });
        toast.success("Added a New Sample Case", { position: "top-center", autoClose: 1200, theme: "dark" })

    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs.id || !inputs.boilerplateCode || !inputs.difficulty
            || !inputs.onlineJudge || !inputs.problemStatement || !inputs.starterFunctionName || !inputs.title) {
            toast.error("Please Fill All The Fields", { position: "top-center", autoClose: 1000, theme: "dark" })
            return;
        }
        if (await exists(inputs.id, setAllProblemsCount)) {
            // console.log("problem exists")
            toast.error("Problem with this id already exists!", { position: "top-center", autoClose: 1200, theme: "dark" })
            return;
        }
        console.log("-->", allProblemsCount);
        const newProblem = {
            ...inputs,
            order: allProblemsCount.count,
        }
        const newDBProblem = {
            ...DBInputs,
            order: allProblemsCount.count,
        }
        console.log("order: ", newProblem.order)

        const dateFormatPattern = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/;

        if (!dateFormatPattern.test(newDBProblem.deadline)) {
            toast.error("Deadline is not in valid format (12-Aug-2023)!", { position: "top-center", autoClose: 1200, theme: "dark" });
            return;
        }
        await fetch('/api/addproblem/addnewproblem', {
            method: "POST",
            body: JSON.stringify({
                problem: newProblem,
            })
        });
        await fetch('/api/addproblem/addnewdbproblem', {
            method: "POST",
            body: JSON.stringify({
                problem: newDBProblem,
            })
        });
        await fetch('/api/addproblem/addproblemid', {
            method: "POST",
            body: JSON.stringify({
                pid: newProblem.id,
            })
        });
        toast.success("Added a Problem", { position: "top-center", autoClose: 1200, theme: "dark" });
        setTimeout(function() {
            // This code will run after 1 second
            router.push(`/problems/${newProblem.id}`);
        }, 1200);
    }
    return (
        <>
            <form className='w-4/5 mx-auto space-y-6 px-20 pb-4 pt-3 ' onSubmit={handleSubmit}>
                <h3 className='font-mono text-transparent bg-gradient-to-r 
                    from-cyan-200 to-indigo-800 bg-clip-text text-4xl 
				font-extrabold flex justify-center mt-5'>Add a Problem</h3>

                <div>
                    <label htmlFor='id' className='text-xl font-medium block mb-2 text-slate-400'>
                        ID
                    </label>
                    <input
                        onChange={handleInputChange}
                        type='id'
                        name='id'
                        id='id'
                        value={inputs.id}
                        className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                        placeholder='two-sum'
                    />
                </div>

                <div>
                    <label htmlFor='title' className='text-xl font-medium block mb-2 text-slate-400'>
                        Title
                    </label>
                    <input
                        onChange={handleInputChange}
                        type='title'
                        name='title'
                        id='title'
                        value={inputs.title}
                        className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                        placeholder='Two Sum'
                    />
                </div>

                <div>
                    <label htmlFor="problemStatement" className="text-xl font-medium block mb-2 text-slate-400">Problem Statement</label>
                    <textarea id="problemStatement"
                        rows={6}
                        onChange={handleInputChange}
                        name='problemStatement'
                        value={inputs.problemStatement}
                        className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                        placeholder="">

                    </textarea>

                </div>
                <div>
                    <label htmlFor="constraints" className="text-xl font-medium block mb-2 text-slate-400">Constraints</label>
                    <textarea id="constraints"
                        rows={3}
                        onChange={handleInputChange}
                        name='constraints'
                        value={inputs.constraints}
                        className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                        placeholder="">

                    </textarea>

                </div>

                {
                    inputs.samples.map((sample, index) => (
                        <div>
                            <div className='flex'>

                                <label htmlFor="sampleHeader" className="text-xl font-medium block mb-2 
                                    text-slate-400">Case {index + 1}</label>
                                <div onClick={(e) => handleDeleteSample(index)}>
                                    <MdDelete className='text-2xl mx-5 my-0.48 font-medium block mb-2 
                                    text-slate-400 hover:text-cyan-600'/>
                                </div>

                            </div>

                            <div className='flex'>
                                <div className='w-1/2 mr-4'>
                                    <label htmlFor="inputText" className="text-sm font-medium block mb-2 text-slate-400">Input</label>
                                    <textarea
                                        id="inputText"
                                        rows={4}
                                        value={sample.inputText}
                                        onChange={(e) => handleSampleChange(e, index)}
                                        name='inputText'
                                        className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
                    bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                                        placeholder=""

                                    />
                                </div>
                                <div className='w-1/2 mr-4'>
                                    <label htmlFor="outputText" className="text-sm font-medium block mb-2 text-slate-400">Output</label>
                                    <textarea
                                        id="outputText"
                                        rows={4}
                                        value={sample.outputText}
                                        onChange={(e) => handleSampleChange(e, index)}
                                        name='outputText'
                                        className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
                    bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                                        placeholder=""

                                    />
                                </div>
                            </div>
                            <div className='w-full'>
                                <label htmlFor="explanation" className="text-sm mt-2 font-medium block mb-2 text-slate-400">Explanation</label>
                                <textarea
                                    id="explanation"
                                    rows={3}
                                    name='explanation'
                                    value={sample.explanation}
                                    onChange={(e) => handleSampleChange(e, index)}
                                    className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
                    bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                                    placeholder=""
                                />
                            </div>
                            <div className='flex'>
                                <div className='w-1/2 mr-4'>
                                    <label htmlFor="imageLink" className="text-sm mt-2 font-medium block mb-2 text-slate-400">Image Link</label>
                                    <input
                                        type="text"
                                        id="imageLink"
                                        name='imageLink'
                                        value={sample.img}
                                        onChange={(e) => handleSampleChange(e, index)}
                                        className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
                                    bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                                        placeholder=""
                                    />
                                </div>
                                {/* <div className='w-1/2 mt-7 mx-7'>
                                <Button
                                    variant="outline"
                                    type='submit'
                                    className='font-mono text-white bg-transparent hover:bg-gradient-to-r hover:from-cyan-300 hover:to-indigo-900 
                        hover:text-black transition duration-200 ease-in-out'
                                >
                                    Add Link
                                </Button>
                            </div> */}
                            </div>


                        </div>
                    ))
                }
                <div>
                    <label htmlFor="sampleHeader" className="text-xl font-medium block mb-2 
                                    text-slate-400">New Sample Case</label>
                    <div className='flex'>
                        <div className='w-1/2 mr-4'>
                            <label htmlFor="inputText" className="text-sm font-medium block mb-2 text-slate-400">Input</label>
                            <textarea
                                id="inputText"
                                rows={4}
                                value={newSample.inputText}
                                onChange={(e) => handleSampleChange(e, -1)}
                                style={{ whiteSpace: 'pre-wrap' }}
                                // onKeyDown={(e) => handleKeyDown(e,-1)}
                                name='inputText'
                                className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
                    bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                                placeholder=""
                            />
                        </div>
                        <div className='w-1/2 mr-4'>
                            <label htmlFor="outputText" className="text-sm font-medium block mb-2 text-slate-400">Output</label>
                            <textarea
                                id="outputText"
                                rows={4}
                                value={newSample.outputText}
                                onChange={(e) => handleSampleChange(e, -1)}
                                name='outputText'
                                className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
                    bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="explanation" className="text-sm mt-2 font-medium block mb-2 text-slate-400">Explanation</label>
                        <textarea
                            id="explanation"
                            rows={3}
                            value={newSample.explanation}
                            onChange={(e) => handleSampleChange(e, -1)}
                            name='explanation'
                            className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
                    bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                            placeholder=""
                        />
                    </div>
                    <div className='flex'>
                        <div className='w-1/2 mr-4'>
                            <label htmlFor="imageLink" className="text-sm mt-2 font-medium block mb-2 text-slate-400">Image Link</label>
                            <input
                                type="text"
                                id="imageLink"
                                value={newSample.img}
                                onChange={(e) => handleSampleChange(e, -1)}
                                name='imageLink'
                                className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
                                    bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                                placeholder=""
                            />
                        </div>
                        {/* <div className='w-1/2 mt-7 mx-7'>
                                <Button
                                    variant="outline"
                                    type='submit'
                                    className='font-mono text-white bg-transparent hover:bg-gradient-to-r hover:from-cyan-300 hover:to-indigo-900 
                        hover:text-black transition duration-200 ease-in-out'
                                >
                                    Add Link
                                </Button>
                            </div> */}
                    </div>
                </div>
                <div>
                    
                    
                    <Button
                        onClick={handleAddSample}
                        variant="outline"
                        type='button'
                        className='font-mono mx-auto text-white bg-transparent hover:bg-gradient-to-r hover:from-cyan-300 hover:to-indigo-900 
                        hover:text-black transition duration-200 ease-in-out'
                    >
                        Add Sample
                    </Button>
                
                    
                </div>

                <div>
                    <label htmlFor='difficulty' className='text-xl font-medium block mb-2 text-slate-400'>
                        Difficulty
                    </label>
                    <input
                        onChange={handleInputChange}
                        type='difficulty'
                        name='difficulty'
                        id='difficulty'
                        value={inputs.difficulty}
                        className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                        placeholder='Easy'
                    />
                </div>

                <div>
                    <label htmlFor="boilerplateCode" className="text-xl font-medium block mb-2 text-slate-400">Boilerplate Code</label>
                    <textarea id="boilerplateCode"
                        rows={5}
                        onChange={handleInputChange}
                        name='boilerplateCode'
                        value={inputs.boilerplateCode}
                        className='border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white'
                        placeholder="">

                    </textarea>

                </div>

                <div>
                    <label htmlFor='onlineJudge' className='text-xl font-medium block mb-2 text-slate-400'>
                        Online Judge
                    </label>
                    <input
                        onChange={handleInputChange}
                        type='onlineJudge'
                        name='onlineJudge'
                        id='onlineJudge'
                        value={inputs.onlineJudge}
                        className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                        placeholder='twoSum'
                    />
                </div>

                <div>
                    <label htmlFor='starterFunctionName' className='text-xl font-medium block mb-2 text-slate-400'>
                        Starter Function Name
                    </label>
                    <input
                        onChange={handleInputChange}
                        type='starterFunctionName'
                        name='starterFunctionName'
                        id='starterFunctionName'
                        value={inputs.starterFunctionName}
                        className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                        placeholder=''
                    />
                </div>

                <div>
                    <label htmlFor='category' className='text-xl font-medium block mb-2 text-slate-400'>
                        Category
                    </label>
                    <input
                        onChange={handleInputChange}
                        type='category'
                        name='category'
                        id='category'
                        value={DBInputs.category}
                        className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                        placeholder='Dynamic Programming'
                    />
                </div>

                <div>
                    <label htmlFor='videoId' className='text-xl font-medium block mb-2 text-slate-400'>
                        YouTube Video ID
                    </label>
                    <input
                        onChange={handleInputChange}
                        type='videoId'
                        name='videoId'
                        id='videoId'
                        value={DBInputs.videoId}
                        className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                        placeholder=''
                    />
                </div>

                <div>
                    <label htmlFor='link' className='text-xl font-medium block mb-2 text-slate-400'>
                        Resource Links
                    </label>
                    <input
                        onChange={handleInputChange}
                        type='link'
                        name='link'
                        id='link'
                        value={DBInputs.link}
                        className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                        placeholder=''
                    />
                </div>

                <div>
                    <label htmlFor='deadline' className='text-xl font-medium block mb-2 text-slate-400'>
                        Deadline
                    </label>
                    <input
                        onChange={handleInputChange}
                        type='text'
                        name='deadline'
                        id='deadline'
                        value={DBInputs.deadline}
                        className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
                        placeholder='DD-MMM-YYYY'
                    />
                </div>

                <Button
                    variant="outline"
                    type='submit'
                    className='font-mono mx-auto text-white bg-transparent hover:bg-gradient-to-r hover:from-cyan-300 hover:to-indigo-900 
                        hover:text-black transition duration-200 ease-in-out'
                >
                    Add
                </Button>
            </form>
        </>
    )
}
export default AddProblem;

async function exists(id: string, setAllProblemsCount:any) {
    const response = await fetch('/api/addproblem/getproblemids', {
        method: 'GET',
    });
    const data = await response.json();
    console.log("len:", data.problemids.length)
    // setAllProblemsCount(data.problemids.length);
    setAllProblemsCount((prev:any) => ({ ...prev, count: data.problemids.length }));

    // console.log("data:", data.problemids);
    if (data.problemids.some((item: { id: string }) => item.id === id)) {
        return true;
    }
    return false;
}