import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import logger from "src/utils/logger";
import createUserService from "src/services/users/createUser.service";
import { applyCookie } from "src/middlewares/auth.middleware";
import { NextFunction } from "express";
import validator from "validator";
import { isValidPassword } from "src/utils/validations";
import UsersModel, { UsersSchemaAPIInput } from "src/models/users/Users.model";

interface Params {}
type Body = UsersSchemaAPIInput;

/**
 * Controller function to handle signup validation.
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express NextFunction.
 */
const validate = async (
	req: RequestType<Params, Body>,
	res: ResponseType,
	next: NextFunction,
): Promise<void> => {
	const { email, password, userFullName } = req.body ?? {};
	const errors: Array<string> = [];

	if (!validator.isEmail(email + "")) {
		errors.push("Email not set or valid!");
	}
	if (!isValidPassword(password)) {
		errors.push("Password not set or valid!");
	}
	if (!userFullName.trim()) {
		errors.push("Key - userFullName not set!");
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
 * Controller function to handle signup request.
 * @param {RequestType<Params, Body>} req - Express Request object.
 * @param {ResponseType} res - Express Response object.
 * @returns {Promise<void>}
 */
const controller = async (
	req: RequestType<Params, Body>,
	res: ResponseType,
): Promise<void> => {
	try {
		const userExists = await UsersModel.userEmailExists(req.body.email);
		if (userExists) {
			const returnValue: ResponseDataType<undefined> = {
				err: true,
				statusName: "already-exists",
				msg: "User already exists. Please login.",
				errors: [],
			};
			req.cookies;
			req.signedCookies;
			res.status(201).json(returnValue);
		} else {
			const user = await createUserService(req.body);
			const returnValue: ResponseDataType<{ user: typeof user }> = {
				err: false,
				statusName: "success",
				msg: "Sign up successful.",
				data: {
					user,
				},
				errors: [],
			};
			applyCookie(res, user, "signup");
			res.status(201).json(returnValue);
		}
	} catch (error: any) {
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Sign up failed due to invalid data.",
			errors: [error.message],
		};
		res.status(400).json(returnErr);
	}
};

export default { validate, controller };
