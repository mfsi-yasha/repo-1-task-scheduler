import { useCallback, useState } from "react";
import Heading from "src/components/utility/Heading/Heading";

const ForgotPassword = () => {
	const [otp, setOtp] = useState("");
	const [otpError, setOtpError] = useState("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();
			if (!otp) {
				setOtpError("Please enter your otp.");
				return;
			}
			setOtpError("");
			// Handle form submission (e.g., send email reset request to API)
			console.log("Email:", otp);
		},
		[otp],
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
								<button className="btn btn-danger">Log out</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
