import UsersModel, { UsersSchemaAPIOutput } from "src/models/users/Users.model";
import UsersOTPModel, {
	UsersOTPCompleteData,
} from "src/models/users/UsersOTP.model";
import { encryptPassword } from "src/utils/auth";
import { isValidPassword } from "src/utils/validations";

async function resetPasswordService(
	payload: Omit<UsersOTPCompleteData, "context"> & { newPassword: string },
): Promise<boolean> {
	const passwordValid = isValidPassword(payload.newPassword + "");

	if (!passwordValid) {
		throw new Error(
			`Password must contain: {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}`,
		);
	}

	payload.newPassword = await encryptPassword(payload.newPassword);

	const verified = await UsersOTPModel.verifyUsersOTP({
		...payload,
		context: "reset-password",
	});

	if (verified) {
		await UsersModel.updateUser({
			userId: payload.userId,
			password: payload.newPassword,
		});

		return true;
	} else {
		throw new Error("Validation failed!");
	}
}

export default resetPasswordService;
