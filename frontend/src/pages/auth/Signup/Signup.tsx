import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import signupApi from "src/apis/user/auth/signup.api";
import Heading from "src/components/utility/Heading/Heading";
import { useStore } from "src/hooks/useStore";

const SignUp = () => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [loading, setLoading] = useState(false);
	const { dispatch } = useStore();
	const navigate = useNavigate();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();
			if (password !== confirmPassword) {
				setPasswordError("Passwords do not match.");
				return;
			}
			setPasswordError("");

			setLoading(true);
			signupApi({ userFullName: fullName, email, password })
				.then(res => {
					dispatch("setStore", {
						loginInfo: res,
						loginInfoFetching: "success",
					});
					navigate("/verify-user");
				})
				.catch(() => {
					setPasswordError(
						`Password must contain - minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 and minSymbols: 1.`,
					);
					setLoading(false);
				});
		},
		[fullName, email, password, confirmPassword, dispatch, navigate],
	);

	return (
		<div className="container pt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow-lg">
						<div className="card-body">
							<Heading
								className="card-title text-center"
								text={"Signup"}
								isH1={true}
							/>
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label
										htmlFor="fullName"
										className="form-label"
									>
										Full Name
									</label>
									<input
										type="text"
										className="form-control"
										id="fullName"
										value={fullName}
										onChange={e => setFullName(e.target.value)}
										required
									/>
								</div>
								<div className="mb-3">
									<label
										htmlFor="email"
										className="form-label"
									>
										Email address
									</label>
									<input
										type="email"
										className="form-control"
										id="email"
										value={email}
										onChange={e => setEmail(e.target.value)}
										required
									/>
								</div>
								<div className="mb-3">
									<label
										htmlFor="password"
										className="form-label"
									>
										Password
									</label>
									<input
										type="password"
										className={`form-control ${passwordError ? "is-invalid" : ""}`}
										id="password"
										value={password}
										onChange={e => setPassword(e.target.value)}
										required
									/>
									{passwordError && (
										<div className="invalid-feedback">{passwordError}</div>
									)}
								</div>
								<div className="mb-3">
									<label
										htmlFor="confirmPassword"
										className="form-label"
									>
										Confirm Password
									</label>
									<input
										type="password"
										className={`form-control ${passwordError ? "is-invalid" : ""}`}
										id="confirmPassword"
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
										required
									/>
									{passwordError && (
										<div className="invalid-feedback">{passwordError}</div>
									)}
								</div>
								<div className="d-grid">
									<button
										type="submit"
										className="btn btn-primary d-flex justify-content-center align-items-center gap-2"
									>
										{loading && (
											<div
												className="spinner-border spinner-border-sm text-white"
												role="status"
											>
												<span className="sr-only">Loading...</span>
											</div>
										)}
										<span>Sign Up</span>
									</button>
								</div>
							</form>

							<div className="d-flex justify-content-center mt-3">
								<p>
									Already have an account?{" "}
									<Link
										to="/login"
										className="text-decoration-none"
									>
										Login
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
