import { Schema, model, Types, Document } from "mongoose";
import validator from "validator";

interface UsersI {
	email: string;
	userFullName: string;
	verified: boolean;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

const usersSchema = new Schema<UsersI>(
	{
		email: {
			type: String,
			unique: true,
			required: [true, "Key - email is required."],
			trim: true,
			lowercase: true,
			maxlength: [250, "Key - email length ust be <= 250 charecters."],
			validate: {
				validator: function (v: string) {
					return validator.isEmail(v);
				},
				message: props => `Key - email: ${props.value} is not valid!`,
			},
		},
		userFullName: {
			type: String,
			required: [true, "Key - userFullName is required."],
			trim: true,
			maxlength: [250, "Key - userFullName length ust be <= 250 charecters."],
			validate: {
				validator: function (v: string) {
					return v.trim().length !== 0;
				},
				message: props => `Key - userFullName can not be empty!`,
			},
		},
		verified: {
			type: Boolean,
			default: false,
		},
		password: {
			type: String,
		},
	},
	{ timestamps: true },
);

const UsersM = model("Users", usersSchema);

export type UserCompleteData = UsersI & {
	userId: string;
};

type UserDocument = Document<unknown, {}, UsersI> &
	UsersI & {
		_id: Types.ObjectId;
	};

const generateCompleteUserData = (user: UserDocument) => {
	const data: UserCompleteData = {
		userId: user._id.toHexString(),
		email: user.email,
		userFullName: user.userFullName,
		verified: user.verified,
		password: user.password,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
	return data;
};

/**
 * Retrieve user by email.
 */
const getUserByEmail = async (email: string) => {
	const user = await UsersM.findOne({ email });
	if (user) {
		return generateCompleteUserData(user);
	} else {
		return null;
	}
};

/**
 * Retrieve user by id.
 */
const getUserById = async (id: string) => {
	const user = await UsersM.findById(id);
	if (user) {
		return generateCompleteUserData(user);
	} else {
		return null;
	}
};

const getUserByIds = async (ids: Array<string>) => {
	const users = await UsersM.find({
		_id: { $in: ids.map(id => new Types.ObjectId(id)) },
	});
	return users.map(user => generateCompleteUserData(user));
};

/**
 * Check if user already exists.
 */
const userEmailExists = async (email: string) => {
	const userData = await UsersM.exists({ email });
	return userData?._id ? true : false;
};

/**
 * Insert a new user.
 */
const insertUser = async (data: Omit<UsersI, "createdAt" | "updatedAt">) => {
	const userExists = await userEmailExists(data.email);
	if (userExists) {
		throw new Error("User already exists!");
	} else {
		const user = new UsersM({
			email: data.email,
			userFullName: data.userFullName,
			verified: data.verified,
			password: data.password,
		});

		await user.save();
		return generateCompleteUserData(user);
	}
};

/**
 * Update an existing user.
 */
const updateUser = async ({
	userId,
	...data
}: Omit<UsersI, "email"> & { userId: string }) => {
	const user = await UsersM.findById(userId);

	if (user) {
		let updated = false;

		if (data.userFullName !== undefined) {
			user.userFullName = data.userFullName;
			updated = true;
		}
		if (data.verified !== undefined) {
			user.verified = data.verified;
			updated = true;
		}
		if (data.password !== undefined) {
			user.password = data.password;
			updated = true;
		}

		if (updated) {
			await user.save();
			return generateCompleteUserData(user);
		} else {
			throw new Error("Nothing to update!");
		}
	} else {
		throw new Error(`User not found for userId: ${userId}`);
	}
};

export default {
	getUserByEmail,
	getUserById,
	getUserByIds,
	userEmailExists,
	insertUser,
	updateUser,
};
