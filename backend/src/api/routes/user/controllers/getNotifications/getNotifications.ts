import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { CookiePayload } from "src/middlewares/auth.middleware";
import UsersNotificationsModel from "src/models/users/UsersNotifications.model";

interface Params {}
interface Body {}

/**
 * Controller function to handle login request.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
const controller = async (
	req: RequestType<
		Params,
		Body,
		CookiePayload,
		{ start: number; limit: number }
	>,
	res: ResponseType,
): Promise<void> => {
	try {
		const notifications = await UsersNotificationsModel.getAllUsersNotification(
			{
				userId: req.body.cookiePayload.userId,
				start: parseInt((req.query?.start ?? 0) + ""),
				limit: parseInt((req.query?.limit ?? 25) + ""),
			},
		);

		const returnValue: ResponseDataType<typeof notifications> = {
			err: false,
			statusName: "success",
			msg: "Successful.",
			data: notifications,
			errors: [],
		};
		res.status(200).json(returnValue);
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
