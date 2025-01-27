import validator from "validator";
import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";
import { CookiePayload } from "src/middlewares/auth.middleware";
import TasksModel, { TaskSchemaInput } from "src/models/tasks/Tasks.model";

interface Params {}
type Body = Omit<TaskSchemaInput, "status" | "dueDate" | "userId"> & {
	dueDate: string;
};

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
			typeof taskDetails.name === "string"
				? taskDetails.name.trim()
					? false
					: true
				: true
		) {
			errors.push("Key - name not given.");
		}
		if (
			typeof taskDetails.description === "string"
				? taskDetails.description.trim()
					? false
					: true
				: true
		) {
			errors.push("Key - description not given.");
		}
		if (
			typeof taskDetails.dueDate === "string"
				? validator.isDate(taskDetails.dueDate)
					? false
					: true
				: true
		) {
			errors.push("Key - dueDate is not date.");
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
			const task = await TasksModel.insertTask({
				userId: cookiePayload.userId,
				name: taskDetails.name,
				description: taskDetails.description,
				dueDate: new Date(taskDetails.dueDate),
				status: "toDo",
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
