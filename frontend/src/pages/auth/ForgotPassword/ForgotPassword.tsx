import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import requestResetPasswordApi from "src/apis/user/auth/requestResetPassword.api";
import Heading from "src/components/utility/Heading/Heading";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();
			if (!email) {
				setEmailError("Please enter your email address.");
				return;
			}
			setEmailError("");

			setLoading(true);
			requestResetPasswordApi({ email })
				.then(() => {
					navigate("/reset-password");
				})
				.catch(() => {
					setEmailError("Email is not valid!");
					setLoading(false);
				});
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
										<span>Submit</span>
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
