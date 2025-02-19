import UsersModel from "src/models/users/Users.model";
import { matchPasswords, isValidPassword } from "src/utils/validations";
import { encryptPassword } from "src/utils/auth";

// Interface defining the parameters required to change the password
export interface ChangePasswordParams {
	// User ID whose password needs to be changed
	userId: string;
	// The current password of the user
	oldPassword: string;
	// The new password the user wants to set
	newPassword: string;
}

/**
 * Service to change a user's password.
 * It validates the password format, checks the old password,
 * encrypts the new password, and then updates it in the database.
 */
async function changePasswordService(
	params: ChangePasswordParams,
): Promise<boolean> {
	// Validate that both old and new passwords are provided
	if (!(params.oldPassword || params.newPassword)) {
		throw new Error("Parameters not set!");
	}

	// Validate the format of the new password using a predefined rule set
	const passwordValid = isValidPassword(params.newPassword);

	if (!passwordValid) {
		throw new Error(
			`Password must contain: {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}`,
		);
	}

	// Encrypt the new password before saving it to the database
	params.newPassword = await encryptPassword(params.newPassword);

	// Fetch the user from the database using the provided user ID
	const user = await UsersModel.getUserById(params.userId);

	// Check if the user exists
	if (user) {
		// Validate the old password by comparing it with the one stored in the database
		const valid = await matchPasswords(params.oldPassword, user.password + "");

		// If the old password is correct, update the user's password
		if (valid) {
			await UsersModel.updateUser({
				userId: params.userId,
				password: params.newPassword,
			});
			return true;
		}

		throw new Error("Validation failed!");
	} else {
		throw new Error("User not found!");
	}
}

export default changePasswordService;
