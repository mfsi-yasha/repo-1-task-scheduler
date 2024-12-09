import UsersModel from "src/models/users/Users.model";
import { matchPasswords, isValidPassword } from "src/utils/validations";
import { encryptPassword } from "src/utils/auth";

export interface ChangePasswordParams {
	userId: string;
	oldPassword: string;
	newPassword: string;
}

async function changePasswordService(
	params: ChangePasswordParams,
): Promise<boolean> {
	if (!(params.oldPassword || params.newPassword)) {
		throw Error("Parameters not set!");
	}

	const passwordValid = isValidPassword(params.newPassword);

	if (!passwordValid) {
		throw new Error(
			`Password must contain: {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}`,
		);
	}

	params.newPassword = await encryptPassword(params.newPassword);

	const user = await UsersModel.getUserById(params.userId);

	if (user) {
		const valid = await matchPasswords(params.oldPassword, user.password + "");

		if (valid) {
			await UsersModel.updateUser({
				userId: params.userId,
				password: params.newPassword,
			});
			return true;
		}

		throw Error("Validation failed!");
	} else {
		throw Error("User not found!");
	}
}

export default changePasswordService;
