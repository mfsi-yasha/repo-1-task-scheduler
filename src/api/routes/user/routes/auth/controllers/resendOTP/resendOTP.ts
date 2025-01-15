import { CookiePayload } from "src/middlewares/auth.middleware";
import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import sendOTPService from "src/services/users/sendOTP.service";

interface Params {}
interface Body {}

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
		if (
			req.body.cookiePayload.cookieScope !== "reset-password" &&
			req.body.cookiePayload.cookieScope !== "signup"
		) {
			throw new Error("Invalid scope!");
		}
		const user = await sendOTPService({
			email: req.body.cookiePayload.email,
			context: req.body.cookiePayload.cookieScope,
		});
		if (user) {
			const resValue: ResponseDataType<undefined> = {
				err: false,
				statusName: "success",
				msg: "OTP sent.",
				errors: [],
			};
			res.status(201).json(resValue);
		} else {
			throw new Error("Invalid user!");
		}
	} catch (error: any) {
		const resError: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Failed to resend OTP!",
			errors: [error.message],
		};
		res.status(400).json(resError);
	}
};

export default { controller };
