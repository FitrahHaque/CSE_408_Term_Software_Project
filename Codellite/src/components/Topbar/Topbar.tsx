import { auth } from "@/firebase/firebase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Logout from "../Buttons/Logout";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "../Timer/Timer";
import { Icons } from "@/components/icons"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useRouter } from "next/router";
import { DBProblem, ProblemDesc } from "@/utils/types/problem";
import { CloudFog } from "lucide-react";
// import { problems } from "@/utils/problems";
type TopbarProps = {
	problemPage?: boolean;
	pid? : string;
};
const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
]


const Topbar: React.FC<TopbarProps> = ({ problemPage, pid }) => {
	const [ user ] = useAuthState(auth);
	console.log(user);
	const setAuthModalState = useSetRecoilState(authModalState);
	const router = useRouter();
	const [ currentProblem, setCurrentProblem ] = useState<DBProblem>({
		id: '',
        title: '',
        difficulty: '',
        order: 1,
        category: '',
        likes: 0,
        dislikes: 0,
        videoId: '',
        link: '',
        deadline: '',
        admin: '',
	});
	const [ userRole, setUserRole ] = useState<string>('');
	const [ problems, setProblems ] = useState<DBProblem[]>([]);
	useEffect(()=> {
		const getAllDbProblems = async() => {
			let response = await fetch('/api/allproblems', {
				method: 'GET',
			});
			const data = await response.json();
			// console.log(data);
			setProblems(data.problems);
		}
		getAllDbProblems();

		const getCurrentProblem = async() => {
			const response = await fetch('/api/getproblem/getdbproblem', {
				method: 'POST',
				body: JSON.stringify({
					id:pid,
				})
			});
			const data = await response.json();
			setCurrentProblem(data.problem);
		}
		if(pid) {
			getCurrentProblem();
		}
	},[]);
	useEffect(()=> {
		const getRole = async () => {
			const response = await fetch('/api/auth/getcurrentuser', {
				method: 'POST',
				body: JSON.stringify({
					uid: user!.uid,
				})
			})
			const data = await response.json();
			const userInfo = data.userInfo;
			setUserRole(userInfo.role);
		}
		if(user) {
			getRole();
		}
		else {
			setUserRole('');
		}
	},[user]);
	// const handleProblemNavigation = (isForward: boolean) => {
	// 	const { order } = problems[router.query.pid as string] as DBProblem;
	// 	const direction = isForward ? 1 : -1;
	// 	const nextProblemOrder = order + direction;
	// 	const nextProblemKey = Object.keys(problems).find((key) => problems[key].order === nextProblemOrder);
	// 	if(isForward && !nextProblemKey) {
	// 		const firstProblemKey = Object.keys(problems).find((key) => problems[key].order === 1);
	// 		router.push(`/problems/${firstProblemKey}`);
	// 	}
	// 	else if(!isForward && !nextProblemKey){
	// 		const lastProblemKey = Object.keys(problems).find((key)=> problems[key].order === Object.keys(problems).length)
	// 		router.push(`/problems/${lastProblemKey}`);
	// 	}
	// 	else{
	// 		router.push(`/problems/${nextProblemKey}`);
	// 	}
	// 	// console.log(router.query.pid);
	// }
	const handleProblemNavigation = (isForward: boolean) => {
		if (pid) {
			console.log("pid:", pid);
		  const currentProblem = problems.find((problem) => problem.id === pid);
	  
		  if (currentProblem) {
			const { order } = currentProblem;
			const direction = isForward ? 1 : -1;
			const nextProblemOrder = order + direction;
	  
			// Find the next problem based on the nextProblemOrder
			const nextProblem = problems.find((problem) => problem.order === nextProblemOrder);
	  
			if (nextProblem) {
			  const nextProblemKey = nextProblem.id;
			  router.push(`/problems/${nextProblemKey}`);
			} else if (isForward) {
			  // If going forward and no next problem, navigate to the first problem
			  const firstProblem = problems.find((problem) => problem.order === 1);
			  if (firstProblem) {
				router.push(`/problems/${firstProblem.id}`);
			  }
			} else {
			  // If going backward and no previous problem, navigate to the last problem
			  const lastProblem = problems.reduce((prev, current) => (prev.order > current.order ? prev : current));
			  router.push(`/problems/${lastProblem.id}`);
			}
		  }
		}
	  }
	  
	return (
		<nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-black'>
			<div className={`flex w-full items-center justify-between  ${problemPage ? "" : "max-w-[1200px] mx-auto"}`}>
				<Link href='/' className='h-[22px] flex-1'>
					<Image src='/logo-full.png' alt='Logo' height={100} width={100} />
				</Link>

				{problemPage && (
					<div className='flex items-center text-white gap-4 flex-1 justify-center '>
						<div
							className='flex items-center justify-center rounded bg-black hover:bg-neutral-800 hover:text-sky-200 h-8 w-8 cursor-pointer'
							onClick={() => handleProblemNavigation(false)}
						>
							<FaChevronLeft />
						</div>
						<Link
							href='/'
							className='flex items-center gap-2 font-medium max-w-[170px] cursor-pointer hover:text-transparent hover:bg-gradient-to-r 
							hover:from-cyan-200 hover:to-indigo-700 hover:bg-clip-text'>
							<div>
								<BsList />
							</div>
							<p>Problem List</p>
						</Link>
						<div
							className='flex items-center justify-center rounded bg-black hover:bg-neutral-800 hover:text-sky-600 h-8 w-8 cursor-pointer'
							onClick={() => handleProblemNavigation(true)}

						>
							<FaChevronRight />
						</div>
					</div>
				)}

				<div className='flex items-center space-x-4 flex-1 justify-end'>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
										<li className="row-span-3">
											<NavigationMenuLink asChild>
												<a
													className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b 
													from-slate-500 to-slate-900 p-6 no-underline outline-none focus:shadow-md"
													href="/"
												>
													<Icons.logo className="h-6 w-6" />
													<div className="mb-2 mt-4 text-lg font-medium">
														shadcn/ui
													</div>
													<p className="text-sm leading-tight text-muted-foreground">
														Beautifully designed components built with Radix UI and
														Tailwind CSS.
													</p>
												</a>
											</NavigationMenuLink>
										</li>
										<Link href="/docs" title="Introduction">
											Re-usable components built using Radix UI and Tailwind CSS.
										</Link>
										<Link href="/docs/installation" title="Installation">
											How to install dependencies and structure your app.
										</Link>
										<Link href="/docs/primitives/typography" title="Typography">
											Styles for headings, paragraphs, lists...etc
										</Link>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger>Components</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
										{components.map((component) => (
											<Link
												key={component.title}
												title={component.title}
												href={component.href}
											>
												{component.description}
											</Link>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							{userRole === "admin" && <NavigationMenuItem>
								<Link href="/addproblem" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										Add a Problem
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>}
							{user && userRole === "admin" && user!.uid === currentProblem.admin &&<NavigationMenuItem>
								<Link href="/addproblem" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										Edit This Problem
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>}
						</NavigationMenuList>
					</NavigationMenu>

					{/* <div>
						<a
							href='https://www.google.com'
							target='_blank'
							rel='noreferrer'
							className='font-mono py-1.5 px-3 cursor-pointer rounded text-transparent bg-gradient-to-r from-cyan-200 to-indigo-600 bg-clip-text hover:bg-dark-fill-2'
						>
							Student
						</a>
					</div> */}
					{user && problemPage && <Timer />}
					{!user && (
						<Link
							href='/auth'
							onClick={() => setAuthModalState((prev) => ({ ...prev, isOpen: true, type: "login" }))}
						>
							<button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded '>Sign In</button>
						</Link>
					)}
					{user && (
						<div className='cursor-pointer group relative'>
							<Image src='/avatar.png' alt='Avatar' width={30} height={30} className='rounded-full' />
							<div
								className='overflow-x-hidden absolute top-10 left-2/4 -translate-x-3/4 text-white mx-auto 
								bg-neutral-700 p-2 rounded shadow-lg 
								z-40 group-hover:scale-100 scale-0 
								transition-all duration-300 ease-in-out'
							>
								<p className='text-sm'>{user.email}</p>
							</div>
						</div>
					)}
					{user && <Logout />}
				</div>
			</div>
		</nav>
	);
};
export default Topbar;
