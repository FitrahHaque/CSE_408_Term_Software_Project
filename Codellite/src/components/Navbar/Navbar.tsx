import { authModalState } from "@/atoms/authModalAtom";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSetRecoilState } from "recoil";
import { Button } from "../ui/button";
type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
	const setAuthModalState = useSetRecoilState(authModalState);
	const handleClick = () => {
		setAuthModalState((prev) => ({ ...prev, isOpen: true }));
	};
	return (
		<div className='flex items-center justify-between sm:px-12 px-2 md:px-24'>
			{/* Logo */}
			<Link href='/' className='flex items-center justify-center h-20'>
				<Image src='/logo.png' alt='Codellite' height={200} width={200} />
			</Link>
			<div className='flex items-center'>
				<Button variant="ghost"
					className='font-mono text-white bg-transparent px-2 py-1 sm:px-4 border-solid border-2 border-black
					rounded-md text-sm font-medium
                hover:text-white  hover:bg-transparent hover:border-solid hover:border-2 hover:border-sky-600
                transition duration-300 ease-in-out
                '
					onClick={handleClick}
				>
					Log In
				</Button>
			</div>
		</div>
	);
};
export default Navbar;
