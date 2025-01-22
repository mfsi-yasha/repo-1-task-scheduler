import UsersModel, { UsersSchemaAPIOutput } from "src/models/users/Users.model";

async function getUserService({
	userId,
}: {
	userId: string;
}): Promise<UsersSchemaAPIOutput | null> {
	const user = await UsersModel.getUserById(userId);

	if (user) {
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

export default getUserService;
