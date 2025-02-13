import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { CookiePayload } from "src/middlewares/auth.middleware";
import UsersNotificationsModel from "src/models/users/UsersNotifications.model";

interface Params {}
interface Body {
	notificationId: string;
}

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
		if (!req.body?.notificationId?.trim()) {
			throw new Error("Key - notificationId not given!");
		}

		await UsersNotificationsModel.markAsRead({
			userId: req.body.cookiePayload.userId,
			notificationId: req.body.notificationId,
		});

		const returnValue: ResponseDataType = {
			err: false,
			statusName: "success",
			msg: "Successful.",
			errors: [],
		};
		res.status(201).json(returnValue);
	} catch (error: any) {
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Something may be wrong.",
			errors: [error.message],
		};
		res.status(400).json(returnErr);
	}
};

export default { controller };
