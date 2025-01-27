import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";
import { TaskDetailsI, TaskStatusesT } from "./addTask.api";

export interface UpdateTaskParams {
	taskId: string;
	name?: string;
	description?: string;
	status?: TaskStatusesT;
	dueDate?: string;
}

export default async function ({ taskId, ...params }: UpdateTaskParams) {
	const { data: res } = await axiosJSON.patch<ResponseDataType<TaskDetailsI>>(
		`/tasks/${taskId}`,
		params,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
