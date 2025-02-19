import UsersOTPModel, {
	UsersOTPPayload,
} from "src/models/users/UsersOTP.model";
import sendEmailService from "../email/sendEmail.service";
import signupEmail from "src/templates/emails/signup.email";
import UsersModel, { UsersSchemaAPIOutput } from "src/models/users/Users.model";
import resetPasswordEmail from "src/templates/emails/resetPassword.email";

/**
 * Service to send an OTP to the user via email for either signup or password reset.
 * It generates the OTP, selects the appropriate email template based on the context,
 * and sends the OTP email to the user.
 *
 * @param params - The parameters containing the user's email, OTP context (signup or reset-password), and other OTP related data.
 * @returns The user object if OTP is successfully sent.
 * @throws Will throw an error if the user is not found.
 */
async function sendOTPService(
	params: Omit<UsersOTPPayload, "userId"> & { email: string },
): Promise<UsersSchemaAPIOutput> {
	// Retrieve the user by email
	const user = await UsersModel.getUserByEmail(params.email);

	// If user exists, proceed with OTP generation and sending email
	if (user) {
		// Update or create a new OTP for the user with the specified context (signup or reset-password)
		const otp = await UsersOTPModel.updateUsersOTP({
			userId: user.userId,
			context: params.context,
		});

		// Select the appropriate email template based on the context
		const emailTemplateFun =
			params.context === "signup" ? signupEmail : resetPasswordEmail;

		// Send the OTP email using the selected template and context
		sendEmailService({
			to: user.email,
			...emailTemplateFun({
				toName: user.userFullName,
				otp,
				// Set OTP expiration time to 1 hour
				expiryTime: "1 hour",
			}),
		});

		// Return the user object
		return user;
	} else {
		// If the user does not exist, throw an error
		throw new Error("User not found!");
	}
}

export default sendOTPService;
