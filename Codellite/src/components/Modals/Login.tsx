import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
	// console.log('Login Page')
	const setAuthModalState = useSetRecoilState(authModalState);
	const handleClick = (type: "login" | "register" | "forgotPassword") => {
		setAuthModalState((prev) => ({ ...prev, type }));
	};
	const [inputs, setInputs] = useState({ email: "", password: "" });
	const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
	const router = useRouter();
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputs.email || !inputs.password) return toast.error("Please fill all fields", {position: 'top-center', autoClose: 3000, theme: 'dark'});
		try {
			const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password);
			if (!newUser) return;
			router.push("/");
		} catch (error: any) {
			toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" });
		}
	};

	useEffect(() => {
		if (error) toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" });
	}, [error]);
	return (
		<form className='space-y-6 px-6 pb-4' onSubmit={handleLogin}>
				<h3 className='font-mono text-transparent bg-gradient-to-r from-cyan-200 to-indigo-800 bg-clip-text text-2xl 
				font-extrabold flex justify-center'>Log in to Codellite</h3>

			<div>
					<label htmlFor='email' className='text-sm font-medium block mb-2 text-slate-400'>
						Email
					</label>
					<input
						onChange={handleInputChange}
						type='email'
						name='email'
						id='email'
						className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
						placeholder='chistophernolan@oppenheimer.com'
					/>
				</div>
				<div>
					<label htmlFor='password' className='text-sm font-medium block mb-2 text-slate-400'>
						Password
					</label>
					<input
						onChange={handleInputChange}
						type='password'
						name='password'
						id='password'
						className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
						placeholder='*******'
					/>
				</div>
			<Button disabled={loading}
				variant="outline"
					type='submit'
					className='font-mono w-full text-white bg-transparent hover:bg-gradient-to-r hover:from-cyan-300 hover:to-indigo-900 hover:text-black transition duration-200 ease-in-out'
				>
					{loading ? "Loading..." : "Log In"}
				</Button>
			<button className='flex w-full justify-end' onClick={() => handleClick("forgotPassword")}>
				<a href='#' className='text-sm font-mono block text-sky-400 hover:underline w-full text-right'>
					Forgot Password?
				</a>
			</button>
			<div className='space-y-6 px-6 pb-4 text-sm font-medium font-mono text-slate-300'>
				Not Registered?{" "}
				<a href='#' className='text-sky-400 hover:underline' onClick={() => handleClick("register")}>
					Create account
				</a>
			</div>
		</form>
	);
};
export default Login;
