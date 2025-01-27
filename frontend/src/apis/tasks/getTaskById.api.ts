import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";
import { TaskDetailsI } from "./addTask.api";

export interface GetTaskByIdParams {
	taskId: string;
}

export default async function ({ taskId }: GetTaskByIdParams) {
	const { data: res } = await axiosJSON.get<ResponseDataType<TaskDetailsI>>(
		`/tasks/${taskId}`,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
