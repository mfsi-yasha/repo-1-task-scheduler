import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { applyCookie } from "src/middlewares/auth.middleware";
import { NextFunction } from "express";
import validator from "validator";
import loginService from "src/services/users/login.service";

interface Params {}
interface Body {
	email: string;
	password: string;
}

/**
 * Controller function to handle login validation.
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

	if (!validator.isEmail(req.body?.email + "")) {
		errors.push("Email not set or valid!");
	}
	if (!req.body?.password) {
		errors.push("Password not set or valid!");
	}

	if (errors.length) {
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Email or password may be wrong.",
			errors,
		};
		res.status(400).json(returnErr);
	} else {
		next();
	}
};

/**
 * Controller function to handle login request.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
const controller = async (
	req: RequestType<Params, Body>,
	res: ResponseType,
): Promise<void> => {
	try {
		const user = await loginService(req.body);
		if (user) {
			const returnValue: ResponseDataType<{
				user: typeof user;
			}> = {
				err: false,
				statusName: "success",
				msg: "Log in successful.",
				data: {
					user,
				},
				errors: [],
			};
			applyCookie(res, user, user.verified ? "login" : "signup");
			res.status(201).json(returnValue);
		} else {
			throw new Error("Email or password may be wrong.");
		}
	} catch (error: any) {
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Email or password may be wrong.",
			errors: [error.message],
		};
		res.status(400).json(returnErr);
	}
};

export default { validate, controller };
