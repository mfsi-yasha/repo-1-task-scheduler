import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export type TaskStatusesT = "toDo" | "inProgress" | "done";

export interface TaskDetailsI {
	taskId: string;
	userId: string;
	name: string;
	description: string;
	status: TaskStatusesT;
	dueDate: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AddTaskParams {
	name: string;
	description: string;
	dueDate: string;
}

export default async function (params: AddTaskParams) {
	const { data: res } = await axiosJSON.post<ResponseDataType<TaskDetailsI>>(
		"/tasks/",
		params,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
