import { DBProblem } from "@/utils/types/problem";
import { useState } from "react";

type UserSubmissionTableProps = {
	onSetLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
	uid: string;
};
const UserSubmissionTable: React.FC<UserSubmissionTableProps> = ({ onSetLoadingProblems, uid }) => {
	const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
	const [filteredProblems,setFilteredProblems] = useState<DBProblem[]>([]);
	
	return (
		<>
		</>
	);
}

export default UserSubmissionTable;