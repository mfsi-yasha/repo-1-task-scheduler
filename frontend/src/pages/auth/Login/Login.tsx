import { useCallback, useState } from "react";
import { Link } from "react-router";
import Heading from "src/components/utility/Heading/Heading";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();
			// Handle form submission here (e.g., send to API)
			console.log("Email:", email);
			console.log("Password:", password);
		},
		[email, password],
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
										className="btn btn-primary"
									>
										Login
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
