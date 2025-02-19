import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import resendSignupOTPApi from "src/apis/user/auth/resendSignupOTP.api";
import verifyUserApi from "src/apis/user/auth/verifyUser.api";
import Heading from "src/components/utility/Heading/Heading";
import useLogout from "src/hooks/user/useLogout";
import { useStore } from "src/hooks/useStore";

const ForgotPassword = () => {
	const [otp, setOtp] = useState("");
	const [otpError, setOtpError] = useState("");
	const [loading, setLoading] = useState(false);
	const [otpLoading, setOtpLoading] = useState(false);

	const { dispatch } = useStore();
	const navigate = useNavigate();
	const handleLogout = useLogout();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();
			if (!otp) {
				setOtpError("Please enter your otp.");
				return;
			}
			setOtpError("");

			setLoading(true);
			verifyUserApi({ otp })
				.then(res => {
					dispatch("setStore", {
						loginInfo: res,
						loginInfoFetching: "success",
					});
					navigate("/");
				})
				.catch(() => {
					setOtpError("Invalid OTP! Try resending.");
					setLoading(false);
				});
		},
		[otp],
	);

	const handleResendOTP = useCallback(() => {
		setOtpLoading(true);
		resendSignupOTPApi()
			.then(() => {})
			.catch(() => {})
			.finally(() => {
				setOtpLoading(false);
			});
	}, []);

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
								<button
									className="btn btn-secondary d-inline-flex justify-content-center align-items-center gap-2"
									onClick={handleResendOTP}
								>
									{otpLoading && (
										<div
											className="spinner-border spinner-border-sm text-white"
											role="status"
										>
											<span className="sr-only">Loading...</span>
										</div>
									)}
									<span>Resend OTP</span>
								</button>
							</div>
							<div className="d-flex justify-content-center mt-3">
								<button
									className="btn btn-danger"
									onClick={handleLogout}
								>
									Log out
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
