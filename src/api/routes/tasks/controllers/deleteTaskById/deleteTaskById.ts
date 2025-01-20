import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { CookiePayload } from "src/middlewares/auth.middleware";
import TasksModel from "src/models/tasks/Tasks.model";

interface Params {
	taskId: string;
}
type Body = {};

/**
 * Controller function to handle get tesk by id request.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
const controller = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
): Promise<void> => {
	try {
		await TasksModel.deleteTaskById(req.params?.taskId + "");

		const returnValue: ResponseDataType = {
			err: false,
			statusName: "success",
			msg: "Task deleted.",
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
