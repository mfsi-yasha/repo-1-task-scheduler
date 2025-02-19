import validator from "validator";
import UsersModel, {
	UsersSchemaAPIInput,
	UsersSchemaAPIOutput,
} from "src/models/users/Users.model";
import { isValidPassword } from "src/utils/validations";
import { encryptPassword } from "src/utils/auth";
import UsersOTPModel from "src/models/users/UsersOTP.model";
import sendEmailService from "../email/sendEmail.service";
import signupEmail from "src/templates/emails/signup.email";

/**
 * Creates a new user in the system by validating input, encrypting the password,
 * saving the user data to the database, generating a signup OTP, and sending a
 * confirmation email with the OTP.
 *
 * @param params - The input data for creating a new user. It includes email,
 *                 full name, and password.
 * @returns A promise that resolves to the created user's output data.
 * @throws Will throw an error if any input is invalid or required fields are missing.
 */
async function createUserService(
	params: UsersSchemaAPIInput,
): Promise<UsersSchemaAPIOutput> {
	// Validate email format
	if (!validator.isEmail(params.email)) {
		throw new Error("Email not valid!");
	}

	// Ensure that the user's full name is not empty
	if (validator.isEmpty(params.userFullName)) {
		throw new Error("Name can not be empty!");
	}

	// Validate password strength using the utility function
	const passwordValid = isValidPassword(params.password);

	// If the password is invalid, throw an error specifying the required password format
	if (!passwordValid) {
		throw new Error(
			`Password must contain: {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}`,
		);
	}

	// Encrypt the password before saving to the database
	params.password = await encryptPassword(params.password);

	// Insert the new user into the database with the 'verified' field set to false initially
	const user = await UsersModel.insertUser({
		...params,
		verified: false,
	});

	// Generate an OTP for email verification associated with the new user
	const otp = await UsersOTPModel.updateUsersOTP({
		userId: user.userId,
		// Context defines that this OTP is for the signup process
		context: "signup",
	});

	// Send a signup email to the user containing the OTP and its expiry time
	sendEmailService({
		to: user.email,
		...signupEmail({
			// Recipient's name
			toName: user.userFullName,
			// OTP code for verification
			otp,
			// OTP expiry time
			expiryTime: "1 hour",
		}),
	});

	// Construct the user object to be returned, excluding sensitive fields like password
	const userValue: UsersSchemaAPIOutput = {
		verified: user.verified,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		email: user.email,
		userFullName: user.userFullName,
		userId: user.userId,
	};

	// Return the output data representing the newly created user
	return userValue;
}

export default createUserService;
