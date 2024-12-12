import { Schema, model, Types } from "mongoose";
import KEYS from "src/globals/keys";
import { createJWT, encryptPassword, generateOTP } from "src/utils/auth";
import { matchPasswords, validateJWT } from "src/utils/validations";

export interface UsersOTPPayload {
	userId: string;
	context: "signup" | "reset-password";
}

export interface UsersOTPSchema extends Omit<UsersOTPPayload, "userId"> {
	userId: Types.ObjectId;
	otp: string;
}

export type UsersOTPCompleteData = Omit<UsersOTPSchema, "userId"> & {
	userId: string;
};

const usersOTPSchema = new Schema<UsersOTPSchema>(
	{
		userId: { type: Schema.Types.ObjectId, required: true },
		context: { type: String, required: true },
		otp: {
			type: String,
		},
	},
	{ timestamps: false },
);

const UsersOTPM = model("UsersOTP", usersOTPSchema);

/**
 * Insert a new user.
 */
const updateUsersOTP = async (data: UsersOTPPayload) => {
	let user = await UsersOTPM.findOne(data);
	if (!user) {
		user = new UsersOTPM(data);
	}

	const otp =
		KEYS.APP_ENVS.NODE_ENV === "development" ? "000000" : generateOTP();

	const encryptedOTP = await encryptPassword(otp);
	const signedOTP = createJWT({ otp: encryptedOTP }, { expiresIn: "1h" });

	user.otp = signedOTP;

	await user.save();
	return otp;
};

const verifyUsersOTP = async (
	{ otp, ...payload }: UsersOTPCompleteData,
	resetOTP = true,
) => {
	const user = await UsersOTPM.findOne(payload);
	if (user) {
		const { otp: decodedOTP } = validateJWT(user.otp + "");
		if (resetOTP) {
			user.otp = "";
			await user.save();
		}
		return await matchPasswords(otp, decodedOTP);
	} else {
		return false;
	}
};

export default {
	updateUsersOTP,
	verifyUsersOTP,
};
