import { useCallback, useState } from "react";
import { Link } from "react-router";
import Heading from "src/components/utility/Heading/Heading";

const SignUp = () => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();
			if (password !== confirmPassword) {
				setPasswordError("Passwords do not match.");
				return;
			}
			setPasswordError("");
			// Handle form submission here (e.g., send to API)
			console.log("Full Name:", fullName);
			console.log("Email:", email);
			console.log("Password:", password);
		},
		[fullName, email, password, confirmPassword],
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
										className="btn btn-primary"
									>
										Sign Up
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
