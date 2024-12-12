import { applyCookie, CookiePayload } from "src/middlewares/auth.middleware";
import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import logger from "src/utils/logger";
import { NextFunction } from "express";
import sendOTPService from "src/services/users/sendOTP.service";
import resetPasswordService from "src/services/users/resetPassword.service";

interface Params {}
interface Body {
	otp: string;
	newPassword: string;
}

/**
 * Controller function to handle reset password validation.
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express NextFunction.
 */
const validate = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
	next: NextFunction,
): Promise<void> => {
	const errors: Array<string> = [];

	if (!req.body?.otp) {
		errors.push("OTP not provided!");
	}
	if (!req.body?.newPassword) {
		errors.push("New password not provided!");
	}

	if (errors.length) {
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Email may be wrong.",
			errors,
		};
		res.status(400).json(returnErr);
	} else {
		next();
	}
};

/**
 * Controller function to handle verifyUser request.
 * @param {RequestType<Params, Body>} req - Express Request object.
 * @param {ResponseType} res - Express Response object.
 * @returns {Promise<void>}
 */
const controller = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
): Promise<void> => {
	try {
		const resetDone = await resetPasswordService({
			userId: req.body.cookiePayload.userId,
			newPassword: req.body.newPassword,
			otp: req.body.otp,
		});
		if (resetDone) {
			const resValue: ResponseDataType<undefined> = {
				err: false,
				statusName: "success",
				msg: "Give new password.",
				errors: [],
			};
			res.status(200).json(resValue);
		} else {
			throw new Error("OTP not valid!");
		}
	} catch (error: any) {
		const resError: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "User not found!",
			errors: [error.message],
		};
		res.status(400).json(resError);
	}
};

export default { validate, controller };
