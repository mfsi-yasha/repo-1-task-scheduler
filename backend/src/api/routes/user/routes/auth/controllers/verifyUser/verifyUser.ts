import { CookiePayload, applyCookie } from "src/middlewares/auth.middleware";
import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { NextFunction } from "express";
import verifySignupService from "src/services/users/verifySignup.service";

interface Params {}
interface Body {
	otp: string;
}

/**
 * Controller function to handle reset password validation.
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express NextFunction.
 */
const validate = async (
	req: RequestType<Params, Body>,
	res: ResponseType,
	next: NextFunction,
): Promise<void> => {
	const errors: Array<string> = [];

	if (!req.body?.otp?.trim()) {
		errors.push("OTP not set!");
	}

	if (errors.length) {
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "OTP not set.",
			errors,
		};
		res.status(400).json(returnErr);
	} else {
		next();
	}
};

/**
 * Controller function to handle verifyUser request.
 * @param {RequestType<Params, Body, CookiePayload>} req - Express Request object.
 * @param {ResponseType} res - Express Response object.
 * @returns {Promise<void>}
 */
const controller = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
): Promise<void> => {
	try {
		const user = await verifySignupService({
			userId: req.body.cookiePayload.userId,
			otp: req.body.otp,
		});
		if (user) {
			const resValue: ResponseDataType<{ user: typeof user }> = {
				err: false,
				statusName: "success",
				msg: "User verified",
				data: {
					user,
				},
				errors: [],
			};
			applyCookie(res, user, "login");
			res.status(201).json(resValue);
		} else {
			throw new Error("OTP not valid!");
		}
	} catch (error: any) {
		const resError: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "User not verified",
			errors: [error.message],
		};
		res.status(400).json(resError);
	}
};

export default { validate, controller };
