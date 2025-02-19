import UsersModel, { UsersSchemaAPIOutput } from "src/models/users/Users.model";
import UsersOTPModel, {
	UsersOTPCompleteData,
} from "src/models/users/UsersOTP.model";

async function verifySignupService(
	payload: Omit<UsersOTPCompleteData, "context">,
): Promise<UsersSchemaAPIOutput | null> {
	const verified = await UsersOTPModel.verifyUsersOTP({
		...payload,
		context: "signup",
	});

	if (verified) {
		const user = await UsersModel.updateUser({
			userId: payload.userId,
			verified: true,
		});

		const userValue: UsersSchemaAPIOutput = {
			verified: user.verified,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			email: user.email,
			userFullName: user.userFullName,
			userId: user.userId,
		};
		return userValue;
	} else {
		return null;
	}
}

export default verifySignupService;
