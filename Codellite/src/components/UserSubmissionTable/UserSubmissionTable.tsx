import { auth } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillYoutube } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";

type UserSubmissionTableProps = {
	onSetLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
	uid: string;
};
const UserSubmissionTable: React.FC<UserSubmissionTableProps> = ({ onSetLoadingProblems, uid }) => {
	const [unsolvedProblems, setUnsolvedProblems] = useState<string[]>([]);
	const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
	const [AttemptedProblems, setAttemptedProblems] = useState<string[]>([]);
	const [filteredProblems, setFilteredProblems] = useState<DBProblem[]>([]);
	const [user] = useAuthState(auth);

	useEffect(() => {
		const getAttemptedProblems = async () => {
			onSetLoadingProblems(true);
			console.log("on")
			const response = await fetch('/api/auth/getcurrentuser', {
				method: 'POST',
				body: JSON.stringify({
					uid: user!.uid,
				})
			})
			const data = await response.json();
			console.log(data);
			const tmp: string[] = [
				...data.userInfo.pendingProblems,
				...data.userInfo.unsolvedProblems,
				...data.userInfo.solvedProblems,
			]
			console.log("here1")
			setSolvedProblems([...data.userInfo.solvedProblems]);
			console.log("here2")
			setAttemptedProblems(tmp);
			console.log("here3")
			const p: DBProblem[] = [];
			for (let i = 0; i < tmp.length; i++) {
				const res = await fetch('/api/getproblem/getdbproblem', {
					method: 'POST',
					body: JSON.stringify({
						id: tmp[i],
					})
				})
				const data = await res.json();
				p.push({ ...data.problem });
				console.log("here5")
			}
			console.log("here4")
			setFilteredProblems(p);
			console.log('off')
			onSetLoadingProblems(false);
		}

		if (user) {
			getAttemptedProblems();
		}
		if (!user) {
			setAttemptedProblems([]);
		}
	}, [user]);
	useEffect(()=> {
		console.log("filteredProblems:", filteredProblems);
	},[filteredProblems])

	return (
		<>
			<tbody className='text-neutral-500'>
				{filteredProblems.map((problem, idx) => {
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
							<td className={"group-hover:text-white px-6 py-4"}>{problem.category}</td>
							<td className={"group-hover:text-white px-6 py-4"}>
								<p>Not Uploaded Yet</p>
							</td>
							<td className={"px-6 py-4"}>
								{solvedProblems.includes(problem.id) &&
									<p className="font-mono text-emerald-300 text-base">
										ACCEPTED
									</p>}
								{unsolvedProblems.includes(problem.id) &&
									<p className="font-mono text-red-500 text-base">
										WRONG ANSWER
									</p>}
								{!solvedProblems.includes(problem.id) && !unsolvedProblems.includes(problem.id) &&
									<p className="font-mono text-neutral-400 text-base">
										PENDING
									</p>}
							</td>
						</tr>
					);
				})}
			</tbody>
		</>
	);
}

export default UserSubmissionTable;