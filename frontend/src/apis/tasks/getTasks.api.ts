import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";
import { TaskDetailsI } from "./addTask.api";

export interface GetAllTaskFilters {
	userId?: string;
	searchText?: string;
	dueDateMin?: string;
	dueDateMax?: string;
	createdDateMin?: string;
	createdDateMax?: string;
	start?: number;
	limit?: number;
}

export default async function (params: GetAllTaskFilters) {
	const { data: res } = await axiosJSON.get<
		ResponseDataType<Array<TaskDetailsI>>
	>(`/tasks/`, { params });

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
