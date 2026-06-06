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
										{/* Login Button */}
	
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

										{/* OR Divider */}
<div className="flex items-center my-4">
  <div className="flex-1 border-t border-slate-700"></div>
  <span className="px-4 text-slate-400 text-sm">OR</span>
  <div className="flex-1 border-t border-slate-700"></div>
</div>

{/* Google Login */}
<div className="flex justify-center">
  <button
    type="button"
    onClick={() =>
      signIn("google", {
        callbackUrl: "/dashboard",
      })
    }
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
												onClick={() =>
		signIn("google", {
			callbackUrl: "/dashboard",
		})
		}
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

