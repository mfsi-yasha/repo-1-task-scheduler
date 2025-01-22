import validator from "validator";
import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { CookiePayload } from "src/middlewares/auth.middleware";
import TasksModel, {
	TaskSchemaInput,
	taskStatuses,
} from "src/models/tasks/Tasks.model";

interface Params {
	taskId: string;
}
type Body = Partial<Omit<TaskSchemaInput, "dueDate"> & { dueDate: string }>;

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
		const { cookiePayload, ...taskDetails } = req.body ?? {};

		const errors: Array<string> = [];

		if (
			taskDetails.name === undefined
				? false
				: typeof taskDetails.name === "string"
					? taskDetails.name.trim()
						? false
						: true
					: true
		) {
			errors.push("Key - name not given.");
		}
		if (
			taskDetails.description === undefined
				? false
				: typeof taskDetails.description === "string"
					? taskDetails.description.trim()
						? false
						: true
					: true
		) {
			errors.push("Key - description not given.");
		}
		if (
			taskDetails.dueDate === undefined
				? false
				: typeof taskDetails.dueDate === "string"
					? validator.isDate(taskDetails.dueDate)
						? false
						: true
					: true
		) {
			errors.push("Key - dueDate is not date.");
		}
		if (
			taskDetails.status === undefined
				? false
				: typeof taskDetails.status === "string"
					? taskStatuses.includes(taskDetails.status)
						? false
						: true
					: true
		) {
			errors.push("Key - status is not date.");
		}

		if (errors.length) {
			const returnErr: ResponseDataType<undefined> = {
				err: true,
				statusName: "validation-error",
				msg: "invalid data.",
				errors,
			};
			res.status(400).json(returnErr);
		} else {
			const task = await TasksModel.updateTask({
				userId: cookiePayload.userId,
				taskId: req.params?.taskId + "",
				name: taskDetails.name,
				description: taskDetails.description,
				dueDate: taskDetails.dueDate
					? new Date(taskDetails.dueDate)
					: undefined,
				status: taskDetails.status,
			});

			const returnValue: ResponseDataType<typeof task> = {
				err: false,
				statusName: "success",
				msg: "Task inserted.",
				data: task,
				errors: [],
			};
			res.status(201).json(returnValue);
		}
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
