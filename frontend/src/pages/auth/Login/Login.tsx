import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import loginApi from "src/apis/user/auth/login.api";
import Heading from "src/components/utility/Heading/Heading";
import { useStore } from "src/hooks/useStore";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { dispatch } = useStore();
	const navigate = useNavigate();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();

			setLoading(true);
			loginApi({ email, password })
				.then(res => {
					dispatch("setStore", {
						loginInfo: res,
						loginInfoFetching: "success",
					});
					if (res.user.verified) {
						navigate("/");
					} else {
						navigate("/verify-user");
					}
				})
				.catch(() => {
					alert(`Invalid user or password!`);
					setLoading(false);
				});
		},
		[email, password, dispatch, navigate],
	);

	return (
		<div className="container pt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow-lg">
						<div className="card-body">
							<Heading
								className="card-title text-center"
								text={"Login"}
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
										className="form-control"
										id="password"
										value={password}
										onChange={e => setPassword(e.target.value)}
										required
									/>
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
										<span>Log in</span>
									</button>
								</div>
							</form>
							<div className="d-flex justify-content-between mt-3">
								<Link
									to="/forgot-password"
									className="text-decoration-none"
								>
									Forgot Password?
								</Link>
								<Link
									to="/signup"
									className="text-decoration-none"
								>
									Sign Up
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
