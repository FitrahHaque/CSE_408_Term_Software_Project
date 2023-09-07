import { DBProblem, ProblemDesc } from '@/utils/types/problem';
import React, { useEffect, useState } from 'react';
import { AiFillLike, AiFillDislike, AiOutlineLoading3Quarters, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { arrayRemove, arrayUnion, doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { auth, firestore } from '@/firebase/firebase';
import RectangleSkeleton from '@/components/skeletons/RectangleSkeleton';
import CircleSkeleton from '@/components/skeletons/CircleSkeleton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

type ProblemDescriptionProps = {
    id: string;
    problem: ProblemDesc;
    _solved: boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ id, problem, _solved }) => {
    // console.log("Problem ID : ", id)
    // console.log("problem Description", problem);
    const [user] = useAuthState(auth);
    const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } = useGetCurrentProblem(problem.id);
    const { liked, disliked, solved, starred, setData } = useGetUserDataOnProblem(problem.id);
    const [updating, setUpdating] = useState(false);

    

    const returnUserAndProblemDoc = async (transaction: any) => {
        const problemRef = doc(firestore, "problems", problem.id);
        const userRef = doc(firestore, "users", user!.uid);
        // const response = await fetch('/api/auth/getuserref', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         uid: user!.uid,
        //     })
        // });
        // const data = await response.json();
        // console.log("data:",data)
        // const userRef = data.userRef;
        // // console.log("userRef: ",userRef);
        // const userDoc1 = await getDoc(userRef);
        // console.log("userDoc1", userDoc1.data())
        
        const userDoc = await transaction.get(userRef);
        // let response = await fetch('/api/auth/getuser', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         uid: user!.uid,
        //     })
        // })
        // const data = await response.json();
        // const userDoc = data.userDoc;
        console.log("pd userDoc :", userDoc.data().uid);

        if (!userDoc.exists()) {
            throw "userDoc does not exist!";
        }
        const problemDoc = await transaction.get(problemRef);
        if (!problemDoc.exists()) {
            throw "problemDoc does not exist!";
        }
        return { userDoc, userRef, problemRef, problemDoc };
    }
    const handleLike = async () => {
        if (!user) {
            toast.error("You must be logged in to like this problem", { position: "top-center", theme: "dark" });
            return;
        }
        //if already liked, if already disliked, neither
        //transactions
        if (updating) return;
        setUpdating(true);
        try {
            await runTransaction(firestore, async (transaction) => {
                const { userDoc, userRef, problemRef, problemDoc } = await returnUserAndProblemDoc(transaction);
                if (liked) {
                    //remove problem id from likedProblem on user document, decrement likes count on problem document
                    transaction.update(userRef, {
                        likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id)
                    })
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes - 1
                    })
                    setCurrentProblem(prev => prev ? ({ ...prev, likes: prev.likes - 1 }) : null)
                    setData(prev => ({ ...prev, liked: false }))
                }
                else if (disliked) {
                    transaction.update(userRef, {
                        likedProblems: [...userDoc.data().likedProblems, problem.id],
                        dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id)
                    })
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes + 1,
                        dislikes: problemDoc.data().dislikes - 1,
                    })
                    setCurrentProblem(prev => prev ? ({ ...prev, likes: prev.likes + 1, dislikes: prev.dislikes - 1 }) : null)
                    setData(prev => ({ ...prev, liked: true, disliked: false }))
                }
                else {
                    transaction.update(userRef, {
                        likedProblems: [...userDoc.data().likedProblems, problem.id],
                    })
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes + 1,
                    })
                    setCurrentProblem(prev => prev ? ({ ...prev, likes: prev.likes + 1 }) : null)
                    setData(prev => ({ ...prev, liked: true }))
                }
            });
            console.log("Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
        setUpdating(false);
    }

    const handleDislike = async () => {
        if (!user) {
            toast.error("You must be logged in to dislike this problem", { position: "top-center", theme: "dark" });
            return;
        }
        //if already liked, if already disliked, neither
        //transactions
        if (updating) return;
        setUpdating(true);
        try {
            await runTransaction(firestore, async (transaction) => {
                const { userDoc, userRef, problemRef, problemDoc } = await returnUserAndProblemDoc(transaction);
                if (disliked) {
                    //remove problem id from likedProblem on user document, decrement likes count on problem document
                    transaction.update(userRef, {
                        dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id)
                    })
                    transaction.update(problemRef, {
                        dislikes: problemDoc.data().dislikes - 1
                    })
                    setCurrentProblem(prev => prev ? ({ ...prev, dislikes: prev.dislikes - 1 }) : null)
                    setData(prev => ({ ...prev, disliked: false }))
                }
                else if (liked) {
                    transaction.update(userRef, {
                        dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
                        likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id)
                    })
                    transaction.update(problemRef, {
                        dislikes: problemDoc.data().dislikes + 1,
                        likes: problemDoc.data().likes - 1,
                    })
                    setCurrentProblem(prev => prev ? ({ ...prev, dislikes: prev.dislikes + 1, likes: prev.likes - 1 }) : null)
                    setData(prev => ({ ...prev, disliked: true, liked: false }))
                }
                else {
                    transaction.update(userRef, {
                        dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
                    })
                    transaction.update(problemRef, {
                        dislikes: problemDoc.data().dislikes + 1,
                    })
                    setCurrentProblem(prev => prev ? ({ ...prev, dislikes: prev.dislikes + 1 }) : null)
                    setData(prev => ({ ...prev, disliked: true }))
                }
            });
            console.log("Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
        setUpdating(false);
    }
    const handleStar = async () => {
        if (!user) {
            toast.error("You must be logged in to bookmark this problem", { position: "top-center", theme: "dark" });
            return;
        }
        if (updating) return;
        setUpdating(true);
        if (starred) {
            const userRef = doc(firestore, "users", user.uid);

            await updateDoc(userRef, {
                starredProblems: arrayRemove(problem.id),
            });
            setData((prev) => ({ ...prev, starred: false }))
        }
        else {
            const userRef = doc(firestore, "users", user.uid);

            await updateDoc(userRef, {
                starredProblems: arrayUnion(problem.id)
            });
            setData((prev) => ({ ...prev, starred: true }))
        }
        setUpdating(false);
    }
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
                                {(solved || _solved) && <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
                                    <BsCheck2Circle />
                                </div>
                                }
                                <div
                                    className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                                    onClick={handleLike}
                                >
                                    {!updating ? (liked ? (<AiFillLike className='text-dark-blue-s' />)
                                        : (<AiFillLike />))
                                        : (<AiOutlineLoading3Quarters className='animate-spin' />)
                                    }
                                    <span className='text-xs'>{currentProblem.likes}</span>
                                </div>
                                <div
                                    className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
                                    onClick={handleDislike}
                                >
                                    {!updating ? (disliked ? (<AiFillDislike className='text-dark-blue-s' />)
                                        : (<AiFillDislike />))
                                        : (<AiOutlineLoading3Quarters className='animate-spin' />)
                                    }
                                    <span className='text-xs'>{currentProblem.dislikes}</span>
                                </div>
                                <div
                                    className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
                                    onClick={handleStar}
                                >
                                    {!updating ? (starred ? (<AiFillStar className='text-dark-yellow' />)
                                        : (<AiOutlineStar />))
                                        : (<AiOutlineLoading3Quarters className='animate-spin' />)
                                    }
                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className='mt-3 flex space-x-2'>
                                <RectangleSkeleton />
                                <CircleSkeleton />
                                <RectangleSkeleton />
                                <RectangleSkeleton />
                                <CircleSkeleton />
                            </div>
                        )}

                        {/* Problem Statement(paragraphs) */}
                        <div className='text-white text-sm'>
                            <div
                                dangerouslySetInnerHTML={{ __html: problem.problemStatement }} />
                        </div>

                        {/* samples */}
                        <div className='mt-4'>
                            {/* sample 1 */}
                            {problem.samples.map((sample, index) => (
                                <div key={sample.id}>
                                    <p className='font-medium text-white'> Sample {index + 1}: </p>
                                    {sample.img && (
                                        <img src={sample.img} alt="" className='mt-3' />
                                    )}
                                    <div className='example-card'>
                                        <pre>
                                            <strong>Input:</strong><br/>
                                            <span className='text-white'>{sample.inputText}</span><br /><br/>
                                            <strong>Output:</strong><br/>
                                            <span className='text-white'>{sample.outputText}</span><br /><br/>
                                            {
                                                sample.explanation && (
                                                    <>
                                                        <strong>Explanation:</strong><br/>
                                                        <span className='text-white'>{sample.explanation}</span>
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
                                <div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
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
    const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("");
    useEffect(() => {
        //Get problem from DB
        const getProblem = async () => {
            //fetching data logic from database
            setLoading(true);
            const docRef = doc(firestore, "problems", problemId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const problem = docSnap.data();
                setCurrentProblem({ id: docSnap.id, ...problem } as DBProblem);
                setProblemDifficultyClass(problem.difficulty == "Easy" ? "bg-olive text-olive" :
                    problem.difficulty == "Medium" ? "bg-yellow text-dark-yellow" : "bg-dark-pink text-dark-pink");
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
            setLoading(false);
        }
        if(problemId){
            getProblem();
        }
    }, [problemId]);
    console.log("get into usereffect1")
        
    return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUserDataOnProblem(problemId: string) {
    const [data, setData] = useState({ liked: false, disliked: false, starred: false, solved: false })
    const [user] = useAuthState(auth);
    useEffect(() => {
        const getUserDataOnProblem = async () => {
            //fetching data logic from database
            const userRef = doc(firestore, "users", user!.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                const { solvedProblems, likedProblems, dislikedProblems, starredProblems } = data;
                setData({
                    liked: likedProblems.includes(problemId),
                    disliked: dislikedProblems.includes(problemId),
                    starred: starredProblems.includes(problemId),
                    solved: solvedProblems.includes(problemId),
                });
            } else {
                // userSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        if (user) getUserDataOnProblem();
        return () => setData({ liked: false, disliked: false, starred: false, solved: false });
    }, [problemId, user])
    return { ...data, setData };
}
