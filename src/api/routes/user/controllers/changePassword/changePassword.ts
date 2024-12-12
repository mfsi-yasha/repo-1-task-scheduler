import { CookiePayload } from "src/middlewares/auth.middleware";
import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import logger from "src/utils/logger";
import changePasswordService, {
	ChangePasswordParams,
} from "src/services/users/changePassword.service";
import { NextFunction } from "express";
import { isValidPassword } from "src/utils/validations";

interface Params {}
interface Body {
	oldPassword: string;
	newPassword: string;
}

/**
 * Controller function to validate params for verifyUser request.
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express next callback.
 */
const validate = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
	next: NextFunction,
): Promise<void> => {
	const { oldPassword, newPassword } = req.body ?? {};
	const errors: Array<string> = [];
	if (!oldPassword?.trim()) {
		errors.push("Invalid oldPassword!");
	}
	if (!isValidPassword(newPassword)) {
		errors.push("Invalid newPassword!");
	}
	if (oldPassword === newPassword) {
		errors.push("Same old and new passwords given in payload!");
	}
	if (errors.length) {
		const resError: ResponseDataType<undefined> = {
			err: true,
			statusName: "validation-error",
			msg: "Invalid Payload.",
			errors,
		};
		res.status(400).json(resError);
	} else {
		next();
	}
};

/**
 * Controller function to handle verifyUser request.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
const controller = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
): Promise<void> => {
	try {
		const changePasswordParams: ChangePasswordParams = {
			userId: req.body.cookiePayload.userId,
			newPassword: req.body.newPassword,
			oldPassword: req.body.oldPassword,
		};
		await changePasswordService(changePasswordParams);

		const resValue: ResponseDataType<undefined> = {
			err: false,
			statusName: "success",
			msg: "Password Changed.",
			errors: [],
		};
		res.status(200).json(resValue);
	} catch (error: any) {
		const resError: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Password Not Changed.",
			errors: [error.message],
		};
		res.status(401).json(resError);
	}
};

export default { validate, controller };
