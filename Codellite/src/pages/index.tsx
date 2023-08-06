import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import Topbar from "@/components/Topbar/Topbar";

type HomeProps = {
	
};

const Home:React.FC<HomeProps> = () => {
	
	return (
		<>
			<main className='bg-black min-h-screen'>
				<Topbar />

				<h1 className='font-mono text-transparent bg-gradient-to-r from-cyan-200 to-indigo-800 bg-clip-text text-2xl font-extrabold 
				flex justify-center uppercase mt-10 mb-5'>Problem List</h1>

				<div className='relative overflow-x-auto mx-auto px-6 pb-10'>
					{/* {loadingProblems && (
						<div className='max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse'>
							{[...Array(10)].map((_, idx) => (
								<LoadingSkeleton key={idx} />
							))}
						</div>
					)} */}
					<table className='text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
						{/*!loadingProblems */ true && (
							<thead className='text-xs text-transparent bg-gradient-to-r from-cyan-200 to-indigo-600 bg-clip-text uppercase border-b border-b-sky-400'>
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
						{/* <ProblemsTable setLoadingProblems={setLoadingProblems} /> */}
						{<ProblemsTable />}
					</table>
				</div>
			</main>
		</>
	);
}
export default Home;