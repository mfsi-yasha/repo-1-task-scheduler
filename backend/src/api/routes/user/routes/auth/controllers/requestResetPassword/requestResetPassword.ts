import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { applyCookie } from "src/middlewares/auth.middleware";
import { NextFunction } from "express";
import validator from "validator";
import sendOTPService from "src/services/users/sendOTP.service";

interface Params {}
type Body = { email: string };

/**
 * Controller function to handle reset password request validation.
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express NextFunction.
 */
const validate = async (
	req: RequestType<Params, Body>,
	res: ResponseType,
	next: NextFunction,
): Promise<void> => {
	const { email } = req.body ?? {};
	const errors: Array<string> = [];

	if (!validator.isEmail(email + "")) {
		errors.push("Email not set or valid!");
	}

	if (errors.length) {
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Validation error.",
			errors,
		};
		res.status(400).json(returnErr);
	} else {
		next();
	}
};

/**
 * Controller function to handle reset password request.
 * @param {RequestType<Params, Body>} req - Express Request object.
 * @param {ResponseType} res - Express Response object.
 * @returns {Promise<void>}
 */
const controller = async (
	req: RequestType<Params, Body>,
	res: ResponseType,
): Promise<void> => {
	try {
		const user = await sendOTPService({
			email: req.body.email,
			context: "reset-password",
		});
		if (user) {
			const resValue: ResponseDataType<undefined> = {
				err: false,
				statusName: "success",
				msg: "OTP sent.",
				errors: [],
			};
			applyCookie(res, user, "reset-password");
			res.status(200).json(resValue);
		} else {
			throw new Error("Invalid user!");
		}
	} catch (error: any) {
		const resError: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Failed to reset password!",
			errors: [error.message],
		};
		res.status(400).json(resError);
	}
};

export default { validate, controller };
