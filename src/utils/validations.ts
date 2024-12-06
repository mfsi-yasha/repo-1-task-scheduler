import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import KEYS from "src/globals/keys";
import validator from "validator";

export async function matchPasswords(password: string, encrypted: string) {
	return await bcrypt.compare(password, encrypted);
}

export const validateJWT = (jwtToken: string): any => {
	// Verify the JWT and extract the payload
	return jwt.verify(jwtToken, KEYS.APP_ENVS.JWT_SECRET);
};

export const isValidPassword = (password: string) => {
	return validator.isStrongPassword(password, {
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
		returnScore: false,
	});
};
