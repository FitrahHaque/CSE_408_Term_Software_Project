import { auth } from "@/firebase/firebase";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Logout from "../Buttons/Logout";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "../Timer/Timer";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
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

type TopbarProps = {
	problemPage?: boolean;
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
   
  
const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
	const [user] = useAuthState(auth);
	const setAuthModalState = useSetRecoilState(authModalState);

	return (
		<nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-black'>
			<div className={`flex w-full items-center justify-between  ${problemPage ? "" : "max-w-[1200px] mx-auto"}`}>
				<Link href='/' className='h-[22px] flex-1'>
					<Image src='/logo-full.png' alt='Logo' height={100} width={100} />
				</Link>

				{problemPage && (
					<div className='flex items-center gap-4 flex-1 justify-center'>
						<div
							className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
						>
							<FaChevronLeft />
						</div>
						<Link
							href='/'
							className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer'
						>
							<div>
								<BsList />
							</div>
							<p>Problem List</p>
						</Link>
						<div
							className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
						>
							<FaChevronRight />
						</div>
					</div>
				)}

				<div className='flex items-center space-x-4 flex-1 justify-end'>
					<div>
						<a
							href='https://www.google.com'
							target='_blank'
							rel='noreferrer'
							className='font-mono py-1.5 px-3 cursor-pointer rounded text-transparent bg-gradient-to-r from-cyan-200 to-indigo-600 bg-clip-text hover:bg-dark-fill-2'
						>
							Student
						</a>
					</div>
					{problemPage && <Timer />}
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
								className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg 
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
