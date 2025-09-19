import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../Store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {useThemeStore} from '../Store/useThemeStore';

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const {theme}=useThemeStore();

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try{
            await forgotPassword(email);
		setIsSubmitted(true);

        }catch(e){
            toast.error(e.response.data.message)
        }
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={`max-w-md w-full ${theme==='light' ? 'bg-white/90 border-1 shadow-xl drop-shadow-2xl/50': 'bg-gray-800'}   bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl  overflow-hidden  `}
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-400 text-blue-500 dark:text-transparent bg-clip-text'>
					Forgot Password
				</h2>

				{!isSubmitted ? (
					<form onSubmit={handleSubmit}>
						<p className='text-black/60 dark:text-gray-300 mb-6 text-center'>
							Enter your email address and we'll send you a link to reset your password.
						</p>
						<Input
							icon={Mail}
							type='email'
							placeholder='Email Address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className={`mt-1 w-full py-3 px-4 text-center bg-gradient-to-r ${theme==='dark' ? 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500': 'from-cyan-400 to-blue-800 hover:from-cyan-400 hover:to-blue-600 focus:ring-cyan-900'} text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-200 transition-all duration-200`}
						>
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
						</motion.button>
					</form>
				) : (
					<div className='text-center'>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							className='px-8 py-4 bg-cyan-900 dark:bg-gray-900 bg-opacity-50 flex justify-center'
						>
							<Mail className='h-8 w-8 text-white' />
						</motion.div>
						<p className='text-gray-300 mb-6'>
							If an account exists for {email}, you will receive a password reset link shortly.
						</p>
					</div>
				)}
			</div>

			<div className='px-8 py-4 bg-cyan-900 dark:bg-gray-900 bg-opacity-50 flex justify-center'>
				<Link to={"/sign-in"} className='text-sm text-cyan-200 dark:text-green-400 hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
				</Link>
			</div>
		</motion.div>
	);
};
export default ForgotPasswordPage;