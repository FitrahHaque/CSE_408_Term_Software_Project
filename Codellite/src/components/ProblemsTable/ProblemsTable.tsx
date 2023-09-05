// "use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { AiFillYoutube } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import YouTube from "react-youtube";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { on } from "events";

type ProblemsTableProps = {
	onSetLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({ onSetLoadingProblems }) => {
	const [youtubePlayer, setYoutubePlayer] = useState({
		isOpen: false,
		videoId: "",
	});
	const [allProblems,setAllProblems] = useState<DBProblem[]>([]);
	const [filteredProblems,setFilteredProblems] = useState<DBProblem[]>([]);
	const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
	// const filteredProblems = useGetProblems(onSetLoadingProblems);
	// const solvedProblems = useGetSolvedProblems();
	const [user] = useAuthState(auth);

	const closeModal = () => {
		setYoutubePlayer({ isOpen: false, videoId: "" });
	};
	// fetch the solved problems
	useEffect(()=> {
		const getSolvedProblems = async () => {
			let fetchedSolvedProblems = await fetchSolvedProblems(user);
			setSolvedProblems(fetchedSolvedProblems);
		}
		if (user) {
			console.log("got user")
			getSolvedProblems();
		}
		if (!user) {
			setSolvedProblems([]);
		}
		
	},[user]);

	//fetch all the problems
	useEffect(()=> {
		const func = async () => {
			onSetLoadingProblems(true);
			let fetchedAllProblems = await fetchAllProblems();
			setAllProblems(fetchedAllProblems);
			setFilteredProblems(fetchedAllProblems);
			console.log("allproblems:", allProblems);
			console.log("solvedProblems:", solvedProblems);
			console.log("filteredProblems:", filteredProblems);
			onSetLoadingProblems(false);
		};
		func();
	},[])
	useEffect(() => {

		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeModal();
		};
		window.addEventListener("keydown", handleEsc);

		return () => window.removeEventListener("keydown", handleEsc);
	}, []);

	return (
		<>
			<tbody className='text-neutral-500'>
				{filteredProblems.map((problem, idx) => {
					const difficulyColor =
						problem.difficulty === "Easy"
							? "text-green-600"
							: problem.difficulty === "Medium"
								? "text-yellow-600"
								: "text-pink-600";
					return (
						<tr className={`group hover:bg-neutral-800 ${idx % 2 == 1 ? "bg-neutral-900" : ""}`} key={problem.id}>
							<th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s'>
								{solvedProblems.includes(problem.id) && <BsCheckCircle fontSize={"18"} width='18' />}
							</th>
							<td className='px-6 py-4'>
								{problem.link ? (
									<Link
										className='group-hover:text-white cursor-pointer'
										href={problem.link}>
										{problem.title}
									</Link>
								) : (
									<Link
										className='group-hover:text-white cursor-pointer'
										href={`/problems/${problem.id}`}>
										{problem.title}
									</Link>
								)}
							</td>
							<td className={`px-6 py-4 ${difficulyColor}`}>{problem.difficulty}</td>
							<td className={"group-hover:text-white px-6 py-4"}>{problem.category}</td>
							<td className={"group-hover:text-white px-6 py-4"}>
								{problem.videoId ? (
									<AiFillYoutube
										fontSize={"28"}
										className='cursor-pointer hover:text-red-600'
										onClick={() =>
											setYoutubePlayer({ isOpen: true, videoId: problem.videoId as string })
										}
									/>
								) : (
									<p>Not Uploaded Yet</p>
								)}
							</td>
							<td className={"group-hover:text-white px-6 py-4"}>
								{problem.deadline ? (
									<p>{problem.deadline}</p>

								) : (
									<p className='group-hover:text-white'>Not Confirmed</p>
								)}
							</td>
						</tr>
					);
				})}
			</tbody>
			{youtubePlayer.isOpen && (
				<tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center'>
					<div
						className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute'
						onClick={closeModal}
					></div>
					<div className='w-full z-50 h-full px-6 relative max-w-4xl'>
						<div className='w-full h-full flex items-center justify-center relative'>
							<div className='w-full relative'>
								<IoClose
									fontSize={"35"}
									className='cursor-pointer absolute -top-16 right-0'
									onClick={closeModal}
								/>
								<YouTube
									videoId={youtubePlayer.videoId}
									loading='lazy'
									iframeClassName='w-full min-h-[500px]'
								/>
							</div>
						</div>
					</div>
				</tfoot>
			)}
		</>
	);
};
export default ProblemsTable;

async function fetchAllProblems() {
	const q = query(collection(firestore, "problems"), orderBy("order", "asc"));
	const querySnapshot = await getDocs(q);
	const tmp: DBProblem[] = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
	});
	return tmp;
}

async function fetchSolvedProblems(user:any) {
	// const [user] = useAuthState(auth);
	const userRef = doc(firestore, "users", user!.uid);
	const userDoc = await getDoc(userRef);
	const tmp: string[] = [];
	if (userDoc.exists()) {
		userDoc.data().solvedProblems.map((p:any) => {
			tmp.push(p as string);
		});
	}
	return tmp;
}

function useGetProblems(onSetLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>) {
	const [problems, setProblems] = useState<DBProblem[]>([]);
	useEffect(() => {
		const getProblems = async () => {
			//fetching data logic from database
			onSetLoadingProblems(true);
			const q = query(collection(firestore, "problems"), orderBy("order", "asc"));
			const querySnapshot = await getDocs(q);
			const tmp: DBProblem[] = [];
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
			});
			setProblems(tmp);
			onSetLoadingProblems(false);
		}
		getProblems();
	}, [onSetLoadingProblems])
	return problems;
}

function useGetSolvedProblems() {
	const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
	const [user] = useAuthState(auth);
	
	useEffect(() => {
		const getSolvedProblems = async () => {
			
			const userRef = doc(firestore, "users", user!.uid);
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				setSolvedProblems(userDoc.data().solvedProblems);
			}
		}
		if (user) {
			getSolvedProblems();
		}
		if (!user) {
			setSolvedProblems([]);
		}
	}, [user]);

	return solvedProblems;
}