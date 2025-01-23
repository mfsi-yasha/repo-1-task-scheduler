import { useCallback, useState } from "react";
import { Link } from "react-router";
import Heading from "src/components/utility/Heading/Heading";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();
			if (!email) {
				setEmailError("Please enter your email address.");
				return;
			}
			setEmailError("");
			// Handle form submission (e.g., send email reset request to API)
			console.log("Email:", email);
		},
		[email],
	);

	return (
		<div className="container pt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow-lg">
						<div className="card-body">
							<Heading
								className="card-title text-center"
								text={"Forgot Password"}
								isH1={true}
							/>
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label
										htmlFor="email"
										className="form-label"
									>
										Email address
									</label>
									<input
										type="email"
										className={`form-control ${emailError ? "is-invalid" : ""}`}
										id="email"
										value={email}
										onChange={e => setEmail(e.target.value)}
										required
									/>
									{emailError && (
										<div className="invalid-feedback">{emailError}</div>
									)}
								</div>
								<div className="d-grid">
									<button
										type="submit"
										className="btn btn-primary"
									>
										Submit
									</button>
								</div>
							</form>

							<div className="d-flex justify-content-center mt-3">
								<p>
									Remembered your password?{" "}
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

export default ForgotPassword;
