import UsersOTPModel, {
	UsersOTPPayload,
} from "src/models/users/UsersOTP.model";
import sendEmailService from "../email/sendEmail.service";
import signupEmail from "src/templates/emails/signup.email";
import UsersModel, { UsersSchemaAPIOutput } from "src/models/users/Users.model";
import resetPasswordEmail from "src/templates/emails/resetPassword.email";

async function sendOTPService(
	params: Omit<UsersOTPPayload, "userId"> & { email: string },
): Promise<UsersSchemaAPIOutput> {
	const user = await UsersModel.getUserByEmail(params.email);
	if (user) {
		const otp = await UsersOTPModel.updateUsersOTP({
			userId: user.userId,
			context: params.context,
		});

		const emailTemplateFun =
			params.context === "signup" ? signupEmail : resetPasswordEmail;

		sendEmailService({
			to: user.email,
			...emailTemplateFun({
				toName: user.userFullName,
				otp,
				expiryTime: "1 hour",
			}),
		});

		return user;
	} else {
		throw new Error("User not found!");
	}
}

export default sendOTPService;
