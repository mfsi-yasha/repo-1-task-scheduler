import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export interface ChangePasswordParams {
	email: string;
}

export default async function (params: ChangePasswordParams) {
	const { data: res } = await axiosJSON.post<ResponseDataType>(
		"/user/auth/request-reset-password",
		params,
	);

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return true;
	}
}
