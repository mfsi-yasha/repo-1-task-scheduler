import { NextFunction } from "express";
import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { validateJWT } from "src/utils/validations";
import { createJWT } from "src/utils/auth";
import { UsersSchemaAPIOutput } from "src/models/users/Users.model";

interface Params {}
type Body = {};

export interface CookiePayload {
	cookiePayload: {
		userId: string;
		email: string;
		verified: boolean;
		cookieScope: "login" | "signup" | "reset-password";
	};
}

/**
 * Set cookie in response.
 * @param {ResponseType} res - Express Response object.
 */
export const applyCookie = (
	res: ResponseType,
	userData: UsersSchemaAPIOutput,
	cookieScope: CookiePayload["cookiePayload"]["cookieScope"],
) => {
	const authToken = createJWT({
		userId: userData.userId,
		email: userData.email,
		verified: userData.verified,
		cookieScope,
	} as CookiePayload["cookiePayload"]);
	res.cookie("authToken", authToken, {
		signed: true,
		httpOnly: true,
		expires: new Date(Date.now() + 31536000000),
	});
};

/**
 * Remove cookie in response.
 * @param {ResponseType} res - Express Response object.
 */
const removeCookie = (res: ResponseType) => {
	try {
		res.clearCookie("authToken");
	} catch (error: any) {
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "forbidden",
			msg: "Internal Server Error.",
			errors: [error.message],
		};
		res.status(500).json(returnErr);
	}
};

/**
 * Middleware controller function to handle reset password verification.
 * @param {RequestType<Params, Body>} req - Express Request object.
 * @param {ResponseType} res - Express Response object.
 * @param {NextFunction} next - Express NextFunction.
 * @returns {Promise<void>}
 */
const resetPasswordController = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
	next: NextFunction,
): Promise<void> => {
	try {
		// Check if cookiePayload is already set in body. Then fail this request.
		if (req.body && req.body.cookiePayload) {
			const returnErr: ResponseDataType<undefined> = {
				err: true,
				statusName: "value-not-allowed",
				msg: "Setting key - cookiePayload is not allowed.",
				errors: [],
			};
			res.status(400).json(returnErr);
		}

		// Access and validate the signed cookie
		const jwtRes: CookiePayload["cookiePayload"] = validateJWT(
			req.signedCookies.authToken,
		);

		if (jwtRes && jwtRes.userId && jwtRes.cookieScope === "reset-password") {
			// If the authentication token is valid, proceed to the next middleware
			req.body.cookiePayload = jwtRes;
			next();
		} else {
			throw new Error("Session expired.");
		}
	} catch (error: any) {
		removeCookie(res);
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "forbidden",
			msg: "Forbidden: Session not found.",
			errors: [],
		};
		res.status(403).json(returnErr);
	}
};

/**
 * Middleware controller function to handle signup user verification.
 * @param {RequestType<Params, Body>} req - Express Request object.
 * @param {ResponseType} res - Express Response object.
 * @param {NextFunction} next - Express NextFunction.
 * @returns {Promise<void>}
 */
const signupController = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
	next: NextFunction,
): Promise<void> => {
	try {
		// Check if cookiePayload is already set in body. Then fail this request.
		if (req.body && req.body.cookiePayload) {
			const returnErr: ResponseDataType<undefined> = {
				err: true,
				statusName: "value-not-allowed",
				msg: "Setting key - cookiePayload is not allowed.",
				errors: [],
			};
			res.status(400).json(returnErr);
			return;
		}

		// Access and validate the signed cookie
		const jwtRes: CookiePayload["cookiePayload"] = validateJWT(
			req.signedCookies.authToken,
		);

		if (jwtRes && jwtRes.userId && jwtRes.cookieScope === "signup") {
			// If the authentication token is valid, proceed to the next middleware
			req.body.cookiePayload = jwtRes;
			next();
		} else {
			throw new Error("Session expired.");
		}
	} catch (error: any) {
		removeCookie(res);
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "forbidden",
			msg: "Forbidden: Session not found.",
			errors: [],
		};
		res.status(403).json(returnErr);
	}
};

/**
 * Controller function to check if user is logged in.
 * @param {RequestType<Params, Body>} req - Express Request object.
 * @param {ResponseType} res - Express Response object.
 * @param {NextFunction} next - Express NextFunction.
 * @returns {Promise<void>}
 */
const loginController = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
	next: NextFunction,
): Promise<void> => {
	try {
		// Check if cookiePayload is already set in body. Then fail this request.
		if (req.body && req.body.cookiePayload) {
			const returnErr: ResponseDataType<undefined> = {
				err: true,
				statusName: "value-not-allowed",
				msg: "Setting key - cookiePayload is not allowed.",
				errors: [],
			};
			res.status(400).json(returnErr);
			return;
		}

		// Access and validate the signed cookie
		const jwtRes: CookiePayload["cookiePayload"] = validateJWT(
			req.signedCookies.authToken,
		);

		if (
			jwtRes &&
			jwtRes.userId &&
			jwtRes.verified &&
			jwtRes.cookieScope === "login"
		) {
			// If the authentication token is valid, proceed to the next middleware
			req.body.cookiePayload = jwtRes;
			next();
		} else {
			throw new Error("Session expired.");
		}
	} catch (error: any) {
		removeCookie(res);
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "forbidden",
			msg: "Forbidden: Session not found.",
			errors: [],
		};
		res.status(403).json(returnErr);
	}
};

/**
 * Controller function to extract cookie in case of logout.
 * @param {RequestType<Params, Body>} req - Express Request object.
 * @param {ResponseType} res - Express Response object.
 * @param {NextFunction} next - Express NextFunction.
 * @returns {Promise<void>}
 */
const logoutController = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
	next: NextFunction,
): Promise<void> => {
	try {
		// Check if cookiePayload is already set in body. Then fail this request.
		if (req.body && req.body.cookiePayload) {
			const returnErr: ResponseDataType<undefined> = {
				err: true,
				statusName: "value-not-allowed",
				msg: "Setting key - cookiePayload is not allowed.",
				errors: [],
			};
			res.status(400).json(returnErr);
			return;
		}

		// Access and validate the signed cookie
		const jwtRes: CookiePayload["cookiePayload"] = validateJWT(
			req.signedCookies.authToken,
		);

		if (jwtRes && jwtRes.userId) {
			// If the authentication token is valid, proceed to the next middleware
			req.body.cookiePayload = jwtRes;
			removeCookie(res);
			next();
		} else {
			throw new Error("Session expired.");
		}
	} catch (error: any) {
		removeCookie(res);
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "forbidden",
			msg: "Forbidden: Session not found.",
			errors: [],
		};
		res.status(403).json(returnErr);
	}
};

export default {
	resetPasswordController,
	signupController,
	loginController,
	logoutController,
};
