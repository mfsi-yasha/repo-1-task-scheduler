import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import KEYS from "src/globals/keys";

export async function encryptPassword(password: string) {
	return await bcrypt.hash(password, 12);
}

export const createJWT = (payload: any, options?: jwt.SignOptions) => {
	// Sign the JWT
	const token = jwt.sign(payload, KEYS.APP_ENVS.JWT_SECRET, options);

	return token;
};

export function generateOTP() {
	// Generate a random number between 100000 and 999999 (inclusive)
	return `${Math.floor(Math.random() * 900000) + 100000}`;
}
