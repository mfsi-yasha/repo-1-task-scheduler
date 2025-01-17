import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { CookiePayload } from "src/middlewares/auth.middleware";
import TasksModel, { GetAllTaskFilters } from "src/models/tasks/Tasks.model";

interface Params {}
type Body = Omit<GetAllTaskFilters, "userId">;

/**
 * Controller function to handle get tesk request.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
const controller = async (
	req: RequestType<Params, Body, CookiePayload>,
	res: ResponseType,
): Promise<void> => {
	try {
		const { cookiePayload, ...filters } = req.body ?? {};

		const errors = TasksModel.validateFilters({
			userId: cookiePayload.userId,
			...(filters ?? {}),
		});

		if (errors.length) {
			const returnErr: ResponseDataType<undefined> = {
				err: true,
				statusName: "failure",
				msg: "Filters may be not valid.",
				errors,
			};
			res.status(400).json(returnErr);
		} else {
			const tasks = await TasksModel.getAllTasks({
				userId: cookiePayload.userId,
				...(filters ?? {}),
			});

			const returnValue: ResponseDataType<typeof tasks> = {
				err: false,
				statusName: "success",
				msg: "Tasks fetched.",
				data: tasks,
				errors: [],
			};
			res.status(200).json(returnValue);
		}
	} catch (error: any) {
		const returnErr: ResponseDataType<undefined> = {
			err: true,
			statusName: "failure",
			msg: "Filters may be wrong.",
			errors: [error.message],
		};
		res.status(400).json(returnErr);
	}
};

export default { controller };
