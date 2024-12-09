import validator from "validator";
import UsersModel, {
	UsersSchemaAPIInput,
	UsersSchemaAPIOutput,
} from "src/models/users/Users.model";
import { isValidPassword } from "src/utils/validations";
import { encryptPassword } from "src/utils/auth";

async function createUserService(
	params: UsersSchemaAPIInput,
): Promise<UsersSchemaAPIOutput> {
	if (!validator.isEmail(params.email)) {
		throw new Error("Email not valid!");
	}
	if (validator.isEmpty(params.userFullName)) {
		throw new Error("Name can not be empty!");
	}
	const passwordValid = isValidPassword(params.password);

	if (!passwordValid) {
		throw new Error(
			`Password must contain: {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}`,
		);
	}

	params.password = await encryptPassword(params.password);

	const user = await UsersModel.insertUser({
		...params,
		verified: false,
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
}

export default createUserService;
