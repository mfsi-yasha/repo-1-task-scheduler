import { matchPasswords } from "src/utils/validations";
import UsersModel, { UsersSchemaAPIOutput } from "src/models/users/Users.model";

async function verifyUserService({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<UsersSchemaAPIOutput | null> {
	if (!(email.trim() || password.trim())) {
		throw new Error("Please set email and password in payload.");
	}

	const user = await UsersModel.getUserByEmail(email);

	if (user) {
		const valid = await matchPasswords(password, user.password + "");

		if (valid) {
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
	} else {
		return null;
	}
}

export default verifyUserService;
