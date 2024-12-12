import { CookiePayload } from "src/middlewares/auth.middleware";
import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import logger from "src/utils/logger";

interface Params {}
interface Body {}

/**
 * Controller function to handle logout request.
 * @param {RequestType<Params, Body, CookiePayload>} req - Express Request object.
 * @param {ResponseType} res - Express Response object.
 * @returns {Promise<void>}
 */
const controller = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
): Promise<void> => {
	try {
		const resValue: ResponseDataType<undefined> = {
			err: false,
			statusName: "success",
			msg: "Logged out.",
			errors: [],
		};
		res.status(201).json(resValue);
	} catch (error: any) {
		const resError: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Unable to logout.",
			errors: [error.message],
		};
		res.status(400).json(resError);
	}
};

export default { controller };
