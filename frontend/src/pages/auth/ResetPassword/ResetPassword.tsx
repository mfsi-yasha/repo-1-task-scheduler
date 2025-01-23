import { useCallback, useState } from "react";
import { Link } from "react-router";
import Heading from "src/components/utility/Heading/Heading";

const ForgotPassword = () => {
	const [otp, setOtp] = useState("");
	const [otpError, setOtpError] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();
			if (!otp) {
				setOtpError("Please enter your otp.");
				return;
			}
			setOtpError("");
			if (password !== confirmPassword) {
				setPasswordError("Passwords do not match.");
				return;
			}
			setPasswordError("");
			// Handle form submission (e.g., send email reset request to API)
			console.log("Email:", otp);
		},
		[otp, password, confirmPassword],
	);

	return (
		<div className="container pt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow-lg">
						<div className="card-body">
							<Heading
								className="card-title text-center"
								text={"Reset Password"}
								isH1={true}
							/>
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label
										htmlFor="otp"
										className="form-label"
									>
										OTP
									</label>
									<input
										type="text"
										className={`form-control ${otpError ? "is-invalid" : ""}`}
										id="otp"
										value={otp}
										onChange={e => setOtp(e.target.value)}
										required
									/>
									{otpError && (
										<div className="invalid-feedback">{otpError}</div>
									)}
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
