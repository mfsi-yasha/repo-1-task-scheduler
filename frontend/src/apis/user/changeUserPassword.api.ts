import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export interface ChangePasswordParams {
	oldPassword: string;
	newPassword: string;
}

export default async function (params: ChangePasswordParams) {
	const { data: res } = await axiosJSON.patch<ResponseDataType>(
		"/user/change-password",
		params,
	);
	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return true;
	}
}
