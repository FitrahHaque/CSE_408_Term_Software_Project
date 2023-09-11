import { auth } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { Submission } from "@/utils/types/submission";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillYoutube } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import YouTube from "react-youtube";

type UserSubmissionTableProps = {
	onSetLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
	uid: string;
};
const UserSubmissionTable: React.FC<UserSubmissionTableProps> = ({ onSetLoadingProblems, uid }) => {
	// const [solvedProblems, setSolvedProblems] = useState<Submission[]>([]);

	// const [attemptedProblems, setAttemptedProblems] = useState<{
	// 	pid: string,
	// 	sid: string,
	// }[]>([]);
	const [youtubePlayer, setYoutubePlayer] = useState({
		isOpen: false,
		videoId: "",
	});
	const closeModal = () => {
		setYoutubePlayer({ isOpen: false, videoId: "" });
	};
	const [dbProblems, setDbProblems] = useState<DBProblem[]>([]);
	const [submissionProblems, setSubmissionProblems] = useState<Submission[]>([]);

	const [user] = useAuthState(auth);

	useEffect(() => {
		const getAttemptedProblems = async () => {
			onSetLoadingProblems(true);
			// console.log("on")
			const response = await fetch('/api/auth/getcurrentuser', {
				method: 'POST',
				body: JSON.stringify({
					uid: user!.uid,
				})
			})
			const data = await response.json();
			console.log(data);
			const tmp = [
				...data.userInfo.pendingProblems,
				...data.userInfo.solvedProblems,
			]
			// console.log("here1")
			// setSolvedProblems([...data.userInfo.solvedProblems]);
			// console.log("here2")
			// setAttemptedProblems(tmp);
			// console.log("here3")
			const p: DBProblem[] = [];
			for (let i = 0; i < tmp.length; i++) {
				const res = await fetch('/api/getproblem/getdbproblem', {
					method: 'POST',
					body: JSON.stringify({
						id: tmp[i].pid,
					})
				})
				const data = await res.json();
				p.push({ ...data.problem });
				// console.log("here4")
			}
			// console.log("here5")
			setDbProblems(p);

			//get particular submissions
			const s: Submission[] = [];
			for (let i = 0; i < tmp.length; i++) {
				// console.log("id->", tmp[i].sid)
				const res = await fetch('/api/submissions/getsubmission', {
					method: 'POST',
					body: JSON.stringify({
						id: tmp[i].sid,
					})
				})
				const data = await res.json();
				s.push({ ...data.problem });
				console.log("here5")
			}
			setSubmissionProblems(s);
			// console.log('off')
			onSetLoadingProblems(false);
		}

		if (user) {
			getAttemptedProblems();
		}
	}, [user]);
	useEffect(() => {
		console.log("dbProblems:", dbProblems);
	}, [dbProblems])

	return (
		<>
			<tbody className='text-neutral-500'>
				{submissionProblems.map((problem, idx) => {
					return (
						<tr className={`group hover:bg-neutral-800 ${idx % 2 == 1 ? "bg-neutral-900" : ""}`} key={problem.id}>
							<th className='px-6 py-4 font-medium whitespace-nowrap'>
								<Link
									className='group-hover:text-white cursor-pointer underline'
									href={`/usersubmission/${problem.id}`}>
									{problem.id}
								</Link>
							</th>
							<td className='px-6 py-4 group-hover:text-white cursor-pointer'>
								{dbProblems[idx].title}
							</td>
							<td className={"group-hover:text-white px-6 py-4"}>{dbProblems[idx].category}</td>
							<td className={"group-hover:text-white px-6 py-4"}>
								{dbProblems[idx].videoId ? (
									<AiFillYoutube
										fontSize={"28"}
										className='cursor-pointer hover:text-red-600'
										onClick={() =>
											setYoutubePlayer({ isOpen: true, videoId: dbProblems[idx].videoId as string })
										}
									/>
								) : (
									<p>Not Uploaded Yet</p>
								)}
							</td>
							<td className={"px-6 py-4"}>
								{problem.status === 'solved' &&
									<p className="font-mono text-emerald-300 text-base">
										{problem.marks}
									</p>}
								{problem.status === 'pending' &&
									<p className="font-mono text-base">
										Pending
									</p>}
							</td>
							<td className={"group-hover:text-white px-6 py-4"}>
								{problem.checkedBy}
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
}

export default UserSubmissionTable;