import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { applyCookie, CookiePayload } from "src/middlewares/auth.middleware";
import getUserService from "src/services/users/getUser.service";

interface Params {}
interface Body {}

/**
 * Controller function to handle login request.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
const controller = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
): Promise<void> => {
	try {
		const user = await getUserService({
			userId: req.body.cookiePayload.userId,
		});
		if (user) {
			const returnValue: ResponseDataType<{
				user: typeof user;
			}> = {
				err: false,
				statusName: "success",
				msg: "Auth Successful.",
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

export default { controller };
