"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
	const router = useRouter();

	const [isSignUp, setIsSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Login State
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState(""); 

	// Signup State
	const [signUpName, setSignUpName] = useState("");
	const [signUpEmail, setSignUpEmail] = useState("");
	const [signUpPassword, setSignUpPassword] =
		useState("");
	const [
		signUpConfirmPassword,
		setSignUpConfirmPassword,
	] = useState("");

	// Login Handler
	const handleLogin = async (
		e: React.FormEvent
	) => {
		e.preventDefault();

		setLoading(true);
		setError("");

		const result = await signIn("credentials", {
			email: loginEmail,
			password: loginPassword,
			redirect: false,
		});

		setLoading(false);

		if (result?.error) {
			setError("Invalid email or password");
			return;
		}

		router.push("/dashboard");
	};

	// Signup Handler
	const handleSignUp = async (
		e: React.FormEvent
	) => {
		e.preventDefault();

		setLoading(true);
		setError("");
		setSuccess("");

		if (
			signUpPassword !== signUpConfirmPassword
		) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(
				"/api/auth/register",
				{
					method: "POST",
					headers: {
						"Content-Type":
							"application/json",
					},
					body: JSON.stringify({
						name: signUpName,
						email: signUpEmail,
						password: signUpPassword,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				setError(
					data.message ||
					"Failed to create account"
				);

				setLoading(false);
				return;
			}

			setSuccess(
				"Account created successfully!"
			);

			setTimeout(async () => {
				const result = await signIn(
					"credentials",
					{
						email: signUpEmail,
						password: signUpPassword,
						redirect: false,
					}
				);

				if (result?.ok) {
					router.push("/dashboard");
				}
			}, 1500);
		} catch {
			setError("Something went wrong");
		}

		setLoading(false);
	};

	return (
		<div className="grid-container flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-2xl">

				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-4 shadow-lg">
						<span className="text-white font-bold text-2xl">
							E
						</span>
					</div>

					<h1 className="text-3xl font-bold text-white">
						Digital Expansion ERP
					</h1>

					<p className="text-slate-400 mt-2">
						Manage your business efficiently
					</p>
				</div>

				{/* Card */}
				<div className="outer w-full">
					<div className="dot"></div>

					<div className="card">

						<div className="ray"></div>

						<div className="line topl"></div>
						<div className="line leftl"></div>
						<div className="line bottoml"></div>
						<div className="line rightl"></div>

						{/* Tabs */}
						<div className="flex gap-4 mb-8 w-full z-10">

							{/* Login Tab */}
							<button
								onClick={() => {
									setIsSignUp(false);
									setError("");
									setSuccess("");
								}}
								className={`relative flex-1 py-4 rounded-2xl overflow-hidden transition-all duration-500 border ${!isSignUp
									? "bg-blue-600 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white"
									: "bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500"
									}`}
							>
								<span className="relative z-10 text-xl font-semibold">
									Login
								</span>

								{!isSignUp && (
									<span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 animate-pulse opacity-80"></span>
								)}
							</button>

							{/* Signup Tab */}
							<button
								onClick={() => {
									setIsSignUp(true);
									setError("");
									setSuccess("");
								}}
								className={`relative flex-1 py-4 rounded-2xl overflow-hidden transition-all duration-500 border ${isSignUp
									? "bg-blue-600 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white"
									: "bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500"
									}`}
							>
								<span className="relative z-10 text-xl font-semibold">
									Sign Up
								</span>

								{isSignUp && (
									<span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 animate-pulse opacity-80"></span>
								)}
							</button>
						</div>

						{/* Error */}
						{error && (
							<div className="w-full mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-sm z-10">
								{error}
							</div>
						)}

						{/* Success */}
						{success && (
							<div className="w-full mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500 text-green-300 text-sm z-10">
								{success}
							</div>
						)}

						{/* LOGIN FORM */}
						{!isSignUp ? (
							<form
								onSubmit={handleLogin}
								className="space-y-6 w-full max-w-xl mx-auto z-10"
							>

								{/* Email */}
								<div className="input-container">
									<input
										required
										type="email"
										placeholder="Email Address"
										value={loginEmail}
										onChange={(e) =>
											setLoginEmail(
												e.target.value
											)
										}
									/>
								</div>

								{/* Password */}
								<div className="input-container">
									<input
										required
										type="password"
										placeholder="Password"
										value={loginPassword}
										onChange={(e) =>
											setLoginPassword(
												e.target.value
											)
										}
									/>
								</div>

								{/* Login Button */}
								<button
									type="submit"
									disabled={loading}
									className="relative inline-flex items-center justify-center w-full px-8 py-3 overflow-hidden tracking-tighter text-white bg-gray-900 rounded-lg group border border-slate-700"
								>
									<span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-600 rounded-full group-hover:w-96 group-hover:h-96"></span>

									<span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>

									<span className="relative text-base font-semibold">
										{loading
											? "Logging in..."
											: "Login"}
									</span>
								</button>

								<p className="text-sm text-slate-400 text-center">
									Don&apos;t have an
									account?{" "}
									<button
										type="button"
										onClick={() =>
											setIsSignUp(true)
										}
										className="text-blue-400"
									>
										Sign Up
									</button>
								</p>
							</form>
						) : (
							/* SIGNUP FORM */
							<form
								onSubmit={handleSignUp}
								className="space-y-6 w-full max-w-xl mx-auto z-10"
							>

								{/* Full Name */}
								<div className="input-container">
									<input
										required
										type="text"
										placeholder="Full Name"
										value={signUpName}
										onChange={(e) =>
											setSignUpName(
												e.target.value
											)
										}
									/>
								</div>

								{/* Email */}
								<div className="input-container">
									<input
										required
										type="email"
										placeholder="Email Address"
										value={signUpEmail}
										onChange={(e) =>
											setSignUpEmail(
												e.target.value
											)
										}
									/>
								</div>

								{/* Password */}
								<div className="input-container">
									<input
										required
										type="password"
										placeholder="Password"
										value={signUpPassword}
										onChange={(e) =>
											setSignUpPassword(
												e.target.value
											)
										}
									/>
								</div>

								{/* Confirm Password */}
								<div className="input-container">
									<input
										required
										type="password"
										placeholder="Confirm Password"
										value={
											signUpConfirmPassword
										}
										onChange={(e) =>
											setSignUpConfirmPassword(
												e.target.value
											)
										}
									/>
								</div>

								{/* Signup Button */}
								<button
									type="submit"
									disabled={loading}
									className="relative inline-flex items-center justify-center w-full px-8 py-3 overflow-hidden tracking-tighter text-white bg-gray-900 rounded-lg group border border-slate-700"
								>
									<span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-600 rounded-full group-hover:w-96 group-hover:h-96"></span>

									<span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>

									<span className="relative text-base font-semibold">
										{loading
											? "Creating Account..."
											: "Create Account"}
									</span>
								</button>

								{/* Google Login */}
								<div className="flex justify-center mt-4">
									<button
										type="button"
										onClick={() => signIn("google")}
										className="google-btn"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											preserveAspectRatio="xMidYMid"
											viewBox="0 0 256 262"
										>
											<path
												fill="#4285F4"
												d="M255.878 133.451c0-10.715-.87-18.694-2.746-26.958H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.686 42.36l-.244 1.622 38.755 29.992 2.684.269c24.654-22.755 38.872-56.246 38.872-95.733"
											/>
											<path
												fill="#34A853"
												d="M130.55 261.1c35.248 0 64.817-11.629 86.455-31.66l-41.195-31.883c-11.024 7.685-25.824 13.061-45.26 13.061-34.52 0-63.8-22.755-74.258-54.255l-1.53.13-40.298 31.154-.526 1.466C35.393 233.67 79.49 261.1 130.55 261.1"
											/>
											<path
												fill="#FBBC05"
												d="M56.292 156.363c-2.746-7.979-4.331-16.54-4.331-25.401 0-8.86 1.585-17.421 4.187-25.4l-.073-1.731-40.803-31.655-1.335.635A130.075 130.962 0 000 130.962c0 20.745 4.976 40.397 13.938 58.15l42.354-32.75"
											/>
											<path
												fill="#EB4335"
												d="M130.55 50.479c24.51 0 41.05 10.57 50.477 19.431l36.84-35.976C195.221 12.189 165.798 0 130.55 0 79.49 0 35.393 27.43 13.938 72.811l42.21 32.75c10.602-31.5 39.882-54.255 74.402-54.255"
											/>
										</svg>

										Continue with Google
									</button>
								</div>

								<p className="text-sm text-slate-400 text-center">


									Already have an
									account?{" "}
									<button
										type="button"
										onClick={() =>
											setIsSignUp(false)
										}
										className="text-blue-400"
									>
										Login
									</button>
								</p>
							</form>
						)}
					</div>
				</div>

				{/* Social Login Buttons */}
				<div className="relative mt-10 w-full max-w-xl mx-auto z-10">

					<div className="absolute inset-0 bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"></div>

					<div className="relative flex items-center justify-center gap-5 p-5">

						{/* Github */}
						<button
							type="button"
							className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-600 shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="white"
								className="w-8 h-8"
							>
								<path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.39c.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.41-4.03-1.41-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.72.08-.72 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
							</svg>
						</button>

						{/* LinkedIn */}
						<button
							type="button"
							className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center border border-blue-400 shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="white"
								className="w-8 h-8"
							>
								<path d="M4.98 3.5C4.98 4.6 4.1 5.5 3 5.5S1.02 4.6 1.02 3.5 1.9 1.5 3 1.5s1.98.9 1.98 2zM1 8h4v15H1V8zm7 0h3.6v2.1h.1c.5-.9 1.7-2.1 3.5-2.1 3.7 0 4.4 2.4 4.4 5.6V23h-4v-7.4c0-1.8 0-4-2.5-4s-2.9 1.9-2.9 3.8V23H8V8z" />
							</svg>
						</button>

						{/* YouTube */}
						<button
							type="button"
							className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center border border-red-400 shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="white"
								className="w-8 h-8"
							>
								<path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.4 31.4 0 0024 12a31.4 31.4 0 00-.5-5.8zM9.8 15.5v-7L16 12l-6.2 3.5z" />
							</svg>
						</button>

						{/* Discord */}
						<button
							type="button"
							className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-800 flex items-center justify-center border border-indigo-400 shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="white"
								className="w-8 h-8"
							>
								<path d="M20.3 4.4A19.8 19.8 0 0015.4 3l-.2.4c-.2.4-.4.8-.6 1.2a18 18 0 00-5.2 0 13 13 0 00-.6-1.2L8.6 3a19.7 19.7 0 00-4.9 1.4C1.1 8.1.2 11.6.6 15.1a20 20 0 005.9 3 .1.1 0 00.1 0c.5-.6.9-1.2 1.2-1.9a12 12 0 01-1.8-.9.1.1 0 010-.2l.4-.3a.1.1 0 01.1 0c3.8 1.7 7.9 1.7 11.7 0a.1.1 0 01.1 0l.4.3a.1.1 0 010 .2 12 12 0 01-1.8.9c.3.7.7 1.3 1.2 1.9a.1.1 0 00.1 0 20 20 0 005.9-3c.5-4-.8-7.5-3.5-10.7z" />
							</svg>
						</button>

					</div>
				</div>


				{/* Footer */}
				<div className="mt-6 text-center text-sm text-slate-400">
					<Link
						href="/"
						className="hover:text-blue-400 transition"
					>
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}