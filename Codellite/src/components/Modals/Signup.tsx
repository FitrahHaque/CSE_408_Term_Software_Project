import { authModalState } from "@/atoms/authModalAtom";
import { auth, firestore } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Icons } from "../icons";
type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
	const setAuthModalState = useSetRecoilState(authModalState);
	const handleClick = () => {
		setAuthModalState((prev) => ({ ...prev, type: "login" }));
	};
	const [inputs, setInputs] = useState({ email: "", displayName: "", password: "" });
	const router = useRouter();
	const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputs.email || !inputs.password || !inputs.displayName) return alert("Please fill all fields");
		try {
			toast.loading("Creating your account", { position: "top-center", toastId: "loadingToast" });
			const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
			if (!newUser) return;
			const userData = {
				uid: newUser.user.uid,
				email: newUser.user.email,
				displayName: inputs.displayName,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				likedProblems: [],
				dislikedProblems: [],
				solvedProblems: [],
				starredProblems: [],
			};
			await setDoc(doc(firestore, "users", newUser.user.uid), userData);
			router.push("/");
		} catch (error: any) {
			toast.error(error.message, { position: "top-center" });
		} finally {
			toast.dismiss("loadingToast");
		}
	};

	useEffect(() => {
		if (error) toast.error(error.message, { position: "top-center" });
	}, [error]);

	return (
		<>

			<form className='space-y-6 px-6 pb-4' onSubmit={handleRegister}>
				<h3 className='font-mono text-transparent bg-gradient-to-r from-cyan-200 to-indigo-800 bg-clip-text text-2xl font-extrabold flex justify-center'>Create an account</h3>
				<div>
					<label htmlFor='email' className='text-sm font-medium block mb-2 text-slate-400'>
						Email
					</label>
					<input
						onChange={handleChangeInput}
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
					<label htmlFor='displayName' className='text-sm font-medium block mb-2 text-slate-400'>
						User Handle
					</label>
					<input
						onChange={handleChangeInput}
						type='displayName'
						name='displayName'
						id='displayName'
						className='
        border-2 outline-none sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5
        bg-gray-800 border-gray-500 placeholder-gray-400 text-white
    '
						placeholder='Cillian Murphy'
					/>
				</div>
				<div>
					<label htmlFor='password' className='text-sm font-medium block mb-2 text-slate-400'>
						Password
					</label>
					<input
						onChange={handleChangeInput}
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
					{loading ? "Registering..." : "Register"}
				</Button>

			</form>
			<div className="relative m-3">
				<div className="absolute inset-x-3.5 inset-y-0 flex items-center">
					<span className="w-4/12 border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="px-4 text-slate-300">
						Or continue with
					</span>
				</div>
				<div className="absolute inset-x-3.5 inset-y-0 flex items-center flex-row-reverse">
					<span className="w-4/12 border-t" />
				</div>
			</div>
			<div className="flex justify-center">
			<Button variant="outline" className='w-80 bg-transparent font-mono text-white mb-5 mt-2 mr-1 hover:bg-gradient-to-r hover:from-cyan-300 hover:to-indigo-900 hover:text-black transition duration-200 ease-in-out' type="button" disabled={loading}>
				{loading ? (
					<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Icons.gitHub className="mr-2 h-4 w-4" />
				)}{" "}
				Github
			</Button>
			</div>
			
			<div className='space-y-6 px-6 pb-4 text-sm font-medium font-mono text-slate-300'>
				Already have an account?{" "}
				<a href='#' className='text-sky-400 hover:underline' onClick={handleClick}>
					Log In
				</a>
			</div>
		</>
	);
};
export default Signup;
