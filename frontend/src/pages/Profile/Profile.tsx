import { useCallback, useState } from "react";
import changeUserPasswordApi from "src/apis/user/changeUserPassword.api";
import Heading from "src/components/utility/Heading/Heading";
import Paragraph from "src/components/utility/Paragraph/Paragraph";
import { useStore } from "src/hooks/useStore";

const Profile = () => {
	const { store } = useStore();

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handlePasswordChange = useCallback(() => {
		if (newPassword === confirmPassword) {
			if (currentPassword === newPassword) {
				alert("Old and new passwords should not be same!");
				return;
			}

			setLoading(true);
			changeUserPasswordApi({ oldPassword: currentPassword, newPassword })
				.then(() => {
					setCurrentPassword("");
					setNewPassword("");
					setConfirmPassword("");
					alert("Password changed successfully!");
				})
				.catch(() => {
					alert(
						`Password must contain - minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 and minSymbols: 1.`,
					);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			alert("Passwords do not match!");
		}
	}, [newPassword, confirmPassword, currentPassword]);

	return (
		<div className="container mt-5">
			<Heading
				text={store.loginInfo?.user?.userFullName ?? ""}
				isH1={true}
			/>
			<Paragraph text={store.loginInfo?.user?.email ?? ""} />

			<div className="card mt-4 p-4">
				<h4>Change Password</h4>
				<div className="mb-3">
					<label
						htmlFor="currentPassword"
						className="form-label"
					>
						Current Password
					</label>
					<input
						type="password"
						className="form-control"
						id="currentPassword"
						value={currentPassword}
						onChange={e => setCurrentPassword(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label
						htmlFor="newPassword"
						className="form-label"
					>
						New Password
					</label>
					<input
						type="password"
						className="form-control"
						id="newPassword"
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label
						htmlFor="confirmPassword"
						className="form-label"
					>
						Confirm New Password
					</label>
					<input
						type="password"
						className="form-control"
						id="confirmPassword"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button
					className="btn btn-success d-flex justify-content-center align-items-center gap-2"
					onClick={handlePasswordChange}
				>
					{loading && (
						<div
							className="spinner-border spinner-border-sm text-white"
							role="status"
						>
							<span className="sr-only">Loading...</span>
						</div>
					)}
					<span>Change Password</span>
				</button>
			</div>
		</div>
	);
};

export default Profile;
