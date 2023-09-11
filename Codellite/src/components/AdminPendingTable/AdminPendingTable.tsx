import { auth } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { Submission } from "@/utils/types/submission";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";


type AdminPendingTableProps = {
    onSetLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
    uid: string;
};

const AdminPendingTable: React.FC<AdminPendingTableProps> = ({ onSetLoadingProblems, uid }) => {
	const [ dbProblems, setDbProblems ] = useState<DBProblem[]>([]);
	const [ submissionProblems, setSubmissionProblems ] = useState<Submission[]>([]);
	const [user] = useAuthState(auth);
    useEffect(() => {
		const getPendingProblems = async () => {
			onSetLoadingProblems(true);
			// console.log("on")
			const response = await fetch('/api/submissions/getallpending', {
				method: 'GET',
			})
			const data = await response.json();
			console.log(data);
			const tmp = [
				...data.problems,
			]
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
			console.log("here5")
			setDbProblems(p);
			setSubmissionProblems(tmp);
			// console.log('off')
			onSetLoadingProblems(false);
		}

		if (user) {
			getPendingProblems();
		}
		if (!user) {
		}
	}, [user]);

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
								<p>Not Uploaded Yet</p>
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
								<p>Not Uploaded Yet</p>
							</td>
						</tr>
					);
				})}
			</tbody>
		</>
	);
}


export default AdminPendingTable;