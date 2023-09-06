import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import Topbar from "@/components/Topbar/Topbar";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
type HomeProps = {
	
};

const Home:React.FC<HomeProps> = () => {
	const [ loadingProblems, setLoadingProblems ] = useState(true);
	// const [ inputs, setInputs ] = useState({
	// 	id: '',
	// 	title: '',
	// 	difficulty: '',
	// 	category: '',
	// 	order: 0,
	// 	videoId: '',
	// 	link: '',
	// 	likes: 0,
	// 	dislikes: 0,
	// 	deadline: '',
	// });
	// const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	setInputs({
	// 		...inputs,
	// 		[e.target.name]: e.target.value,
	// 	})
	// };
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
	return (
		<>
			<main className='bg-black min-h-screen'>
				<Topbar />

				<h1 className='font-mono text-transparent bg-gradient-to-b from-cyan-200 to-indigo-800 bg-clip-text text-2xl font-extrabold 
				flex justify-center uppercase mt-10 mb-5'>Problem List</h1>

				<div className='relative overflow-x-auto mx-auto px-6 pb-10'>
					{loadingProblems && (
						<div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse">
							{[...Array(10)].map((_,idx)=> (
								<LoadingSkeleton key={idx}/>
							))}
						</div>
					)}
					<table className='text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
						{ !loadingProblems && (
							<thead className='text-xs font-bold text-white uppercase border-b'>
								<tr>
									<th scope='col' className='px-1 py-3 w-0 font-medium'>
										Status
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Title
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Difficulty
									</th>

									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Category
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Solution
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Deadline
									</th>
								</tr>
							</thead>
						)}
						<ProblemsTable onSetLoadingProblems={setLoadingProblems}/>
					</table>
				</div>

				{/* <form className="p-6 flex flex-col max-w-sm gap-3" onSubmit={handleSubmit}>
					<input onChange={handleInputChange} type="text" placeholder="problem id" name="id"/>
					<input onChange={handleInputChange} type="text" placeholder="title" name="title"/>
					<input onChange={handleInputChange} type="text" placeholder="problem statement" name="problem statement"/>
					<input onChange={handleInputChange} type="text" placeholder="samples" name="samples"/>
					<input onChange={handleInputChange} type="text" placeholder="constraints" name="constraints"/>
					<input onChange={handleInputChange} type="text" placeholder="difficulty" name="difficulty"/>
					<input onChange={handleInputChange} type="text" placeholder="category" name="category"/>
					<input onChange={handleInputChange} type="text" placeholder="order" name="order"/>
					<input onChange={handleInputChange} type="text" placeholder="videoId?" name="videoId"/>
					<input onChange={handleInputChange} type="text" placeholder="link?" name="link"/>
					<input onChange={handleInputChange} type="text" placeholder="deadline?" name="deadline"/>
					<button className="bg-white">Save to database</button>
				</form> */}
			</main>
		</>
	);
}
export default Home;


const LoadingSkeleton = () => {
	return (
		<div className='flex items-center space-x-12 mt-4 px-6'>
			<div className='w-6 h-6 shrink-0 rounded-full bg-dark-layer-1'></div>
			<div className='h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1'></div>
			<div className='h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1'></div>
			<div className='h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1'></div>
			<span className='sr-only'>Loading...</span>
		</div>
	);
};