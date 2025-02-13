import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export default async function () {
	const { data: res } = await axiosJSON.get<ResponseDataType<number>>(
		"/user/get-notifications-count",
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
