import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export interface DeleteTaskParams {
	taskId: string;
}

export default async function ({ taskId }: DeleteTaskParams) {
	const { data: res } = await axiosJSON.delete<ResponseDataType>(
		`/tasks/${taskId}`,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return true;
	}
}
