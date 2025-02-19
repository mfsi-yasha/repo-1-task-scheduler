import UsersModel from "src/models/users/Users.model";
import UsersOTPModel, {
	UsersOTPCompleteData,
} from "src/models/users/UsersOTP.model";
import { encryptPassword } from "src/utils/auth";
import { isValidPassword } from "src/utils/validations";

/**
 * Service to handle password reset. It verifies the OTP for the user, checks if the
 * new password is valid, encrypts it, and updates the user's password in the database.
 *
 * @param payload - The payload that contains the user's OTP, userId, and the new password.
 * @returns A promise that resolves to `true` if the password reset is successful.
 * @throws Will throw an error if the OTP verification fails or the new password is invalid.
 */
async function resetPasswordService(
	payload: Omit<UsersOTPCompleteData, "context"> & { newPassword: string },
): Promise<boolean> {
	// Validate the new password using the utility function
	const passwordValid = isValidPassword(payload.newPassword + "");

	// If the password is invalid, throw an error specifying the required password format
	if (!passwordValid) {
		throw new Error(
			`Password must contain: {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}`,
		);
	}

	// Encrypt the new password before saving it to the database
	payload.newPassword = await encryptPassword(payload.newPassword);

	// Verify the OTP provided for the reset password request
	const verified = await UsersOTPModel.verifyUsersOTP({
		userId: payload.userId,
		otp: payload.otp,
		// Context ensures this OTP is for resetting the password
		context: "reset-password",
	});

	// If the OTP is verified, update the user's password in the database
	if (verified) {
		await UsersModel.updateUser({
			userId: payload.userId,
			password: payload.newPassword,
		});

		// Return true indicating the password reset was successful
		return true;
	} else {
		// If OTP verification fails, throw an error
		throw new Error("Validation failed!");
	}
}

export default resetPasswordService;
