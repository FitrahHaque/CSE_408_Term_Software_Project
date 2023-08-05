import React from 'react';
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";

type ProblemDescriptionProps = {

};

const ProblemDescription: React.FC<ProblemDescriptionProps> = () => {

    return (
        <div className='bg-dark-layer-1'>
            {/* TAB */}
            <div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
                <div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
                    Description
                </div>
            </div>

            <div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
                <div className='px-5'>
                    {/* Problem heading */}
                    <div className='w-full'>
                        <div className='flex space-x-4'>
                            <div className='flex-1 mr-2 text-lg text-white font-medium'>1. Two Sum</div>
                        </div>

                        <div className='flex items-center mt-3'>
                            <div
                                className={`text-olive bg-olive inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                            >
                                Easy
                            </div>
                            <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
                                <BsCheck2Circle />
                            </div>
                            <div
                                className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                            >
                                <AiFillLike />
                                <span className='text-xs'>12</span>
                            </div>
                            <div
                                className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
                            >
                                <AiFillDislike />
                                <span className='text-xs'>3</span>
                            </div>
                            <div
                                className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
                            >
                                <TiStarOutline />
                            </div>
                        </div>


                        {/* Problem Statement(paragraphs) */}
                        <div className='text-white text-sm'>
                            <p className='mt-3'>
                                Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up</em> to <code>target</code>.
                            </p>
                            <p className='mt-3'>
                                You may assume that each input would have <b><em>exactly</em> one solution</b>, and you may not use the same element twice.
                            </p>
                            You can return the answer in any order.
                            <p></p>
                        </div>

                        {/* Examples */}
                        <div className='mt-4'>
                            {/* Example 1 */}
                            <div>
                                <p className='font-medium text-white'> Example 1: </p>
                                <div className='example-card'>
                                    <pre>
                                        <strong>Input:</strong><span className='text-white'> nums = [2,7,11,15], target = 9{" "} </span><br />
                                        <strong>Output:</strong><span className='text-white'> [0,1] </span><br />
                                        <strong>Explanation:</strong><span className='text-white'> Because nums[0] + nums[1] == 9, we return [0,1].</span>
                                    </pre>
                                </div>
                            </div>
                            
                            {/* Example 2 */}
                            <div>
                                <p className='font-medium text-white'> Example 2: </p>
                                <div className='example-card'>
                                    <pre>
                                        <strong>Input:</strong><span className='text-white'> nums = [3,2,4], target = 6{" "}</span><br />
                                        <strong>Output:</strong><span className='text-white'> [1,2] </span> <br />
                                        <strong>Explanation:</strong><span className='text-white'> Because nums[1] + nums[2] == 6, we return [1,2].</span>
                                    </pre>
                                </div>
                            </div>

                             {/* Example 3 */}
                             <div>
                                <p className='font-medium text-white'>Example 3: </p>
                                <div className='example-card'>
                                    <pre>
                                        <strong className='text-white'>Input:</strong><span className='text-white'> nums = [3,3], target = 6{" "} </span><br />
                                        <strong className='text-white'>Output:</strong><span className='text-white'> [0,1]</span><br />
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Constraints */}
                        <div className='mt-8 pb-4'>
                            <p className='text-white font-medium'>Constraints:</p>
                            <ul className='text-white ml-5 list-disc '>
                                <li className='mt-2'>
                                    <code>2  nums.length  10</code>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProblemDescription;


