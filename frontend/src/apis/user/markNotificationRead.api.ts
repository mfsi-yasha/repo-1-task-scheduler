import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export default async function (params: { notificationId: string }) {
	const { data: res } = await axiosJSON.post<ResponseDataType>(
		"/user/mark-notification-read",
		params,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return true;
	}
}
